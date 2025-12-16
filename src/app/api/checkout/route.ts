import { NextRequest, NextResponse } from 'next/server';
import { naboopay, formatCartForNabooPay, PaymentMethod } from '@/lib/naboopay';
import { supabase } from '@/lib/supabase';
import { sendEmail, getOrderConfirmationEmail } from '@/lib/brevo';

interface CheckoutRequestBody {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    description?: string;
  }>;
  paymentMethod: PaymentMethod;
  shipping?: number;
  promoCode?: {
    id: string;
    code: string;
    discount: number;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { customer, items, paymentMethod, shipping, promoCode } = body;

    // Validation
    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json(
        { error: 'Informations client incomplètes' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    // Calculer le total (prix affiché au client)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shipping || 0;
    const discount = promoCode?.discount || 0;
    const total = Math.max(0, subtotal + shippingCost - discount);

    // Si un code promo est utilisé, incrémenter son compteur
    if (promoCode?.id) {
      try {
        // Récupérer la valeur actuelle
        const { data: currentPromo, error: fetchError } = await supabase
          .from('promo_codes')
          .select('usage_count')
          .eq('id', promoCode.id)
          .single();
        
        if (fetchError) {
          console.error('[Checkout] Erreur récupération promo:', fetchError);
        } else if (currentPromo) {
          // Incrémenter
          const { error: updateError } = await supabase
            .from('promo_codes')
            .update({ usage_count: (currentPromo.usage_count || 0) + 1 })
            .eq('id', promoCode.id);
          
          if (updateError) {
            console.error('[Checkout] Erreur incrémentation promo:', updateError);
          }
        }
      } catch (error) {
        console.error('[Checkout] Erreur promo:', error);
        // Ne pas bloquer la commande si l'incrémentation échoue
      }
    }

    // 1. Créer la commande dans Supabase avec statut "pending"
    const orderData: Record<string, unknown> = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      items: items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: 'pending',
      payment_method: paymentMethod,
    };

    // Tester d'abord avec tous les champs
    let order;
    let orderError;
    
    // Essayer avec les nouveaux champs (subtotal, discount, promo)
    const fullOrderData = {
      ...orderData,
      subtotal,
      discount_amount: discount,
      ...(promoCode && {
        promo_code_id: promoCode.id,
        promo_code: promoCode.code,
      }),
    };

    const result = await supabase
      .from('orders')
      .insert([fullOrderData])
      .select()
      .single();

    order = result.data;
    orderError = result.error;

    // Si erreur de colonne manquante, réessayer sans ces champs
    if (orderError && (orderError.code === '42703' || orderError.message?.includes('column'))) {
      console.log('[Checkout] Colonnes promo non disponibles, création sans ces champs');
      const fallbackResult = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      order = fallbackResult.data;
      orderError = fallbackResult.error;
    }

    if (orderError || !order) {
      console.error('Erreur création commande:', orderError);
      console.error('Données envoyées:', JSON.stringify(orderData, null, 2));
      console.error('Code erreur:', orderError?.code);
      console.error('Détails erreur:', orderError?.details);
      console.error('Hint:', orderError?.hint);
      
      return NextResponse.json(
        { 
          error: 'Erreur lors de la création de la commande', 
          details: orderError?.message || 'La commande n\'a pas été créée',
          code: orderError?.code,
          hint: orderError?.hint || 'Vérifiez que la table orders contient toutes les colonnes nécessaires. Exécutez supabase-orders-update-schema.sql'
        },
        { status: 500 }
      );
    }

    // 2. Créer la transaction NabooPay
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/checkout/success?order_id=${order.id}`;
    const errorUrl = `${baseUrl}/checkout/error?order_id=${order.id}`;

    // Vérifier si on est en HTTPS (requis par NabooPay)
    const isHttps = baseUrl.startsWith('https://');
    
    if (!isHttps) {
      // Mode développement - simuler le succès sans NabooPay
      console.log(`[Checkout] Mode DEV - NabooPay requiert HTTPS. Commande ${order.id} créée.`);
      
      // Mettre à jour le statut pour simuler un paiement réussi en dev
      await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'done',
        })
        .eq('id', order.id);

      // Décrémenter le stock en mode dev
      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.id)
          .single();
        
        if (product) {
          const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity);
          await supabase
            .from('products')
            .update({ 
              stock_quantity: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id);
          console.log(`[Checkout DEV] Stock ${item.name}: -${item.quantity} (nouveau: ${newStock})`);
        }
      }

      // Envoyer l'email de confirmation en mode dev
      try {
        const { html, text } = getOrderConfirmationEmail({
          customerName: customer.name,
          orderId: order.id,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          shipping: shippingCost,
          discount,
          total,
          promoCode: promoCode?.code,
        });

        const emailResult = await sendEmail({
          to: [{ email: customer.email, name: customer.name }],
          subject: `Confirmation de commande #${order.id.slice(0, 8).toUpperCase()} - Montessori Sénégal`,
          htmlContent: html,
          textContent: text,
        });

        if (emailResult.success) {
          console.log(`[Checkout DEV] Email de confirmation envoyé à ${customer.email}`);
        } else {
          console.error(`[Checkout DEV] Erreur envoi email:`, emailResult.error);
        }
      } catch (emailError) {
        console.error('[Checkout DEV] Erreur lors de l\'envoi de l\'email:', emailError);
      }

      return NextResponse.json({
        success: true,
        order_id: order.id,
        checkout_url: successUrl, // Rediriger directement vers success en dev
        dev_mode: true,
        message: 'Mode développement - NabooPay requiert HTTPS. Déployez sur Vercel pour tester les paiements.',
      });
    }

    // Production - utiliser NabooPay
    // Ajuster les prix des produits pour absorber les frais NabooPay (2%)
    // Si le client doit payer P, et NabooPay ajoute 2% de frais :
    // - Montant envoyé à NabooPay = M
    // - Frais NabooPay = M * 0.02
    // - Total payé = M + (M * 0.02) = M * 1.02
    // On veut : M * 1.02 = P (prix affiché AVEC réduction)
    // Donc : M = P / 1.02
    const NABOOPAY_FEE_RATE = 0.02; // 2% de frais
    
    // IMPORTANT: Utiliser le total AVEC la réduction du code promo ET la livraison
    const targetAmount = total; // Le montant final que le client doit payer
    const nabooAmount = Math.round(targetAmount / (1 + NABOOPAY_FEE_RATE));
    
    // Ajuster les prix des items proportionnellement pour atteindre le montant cible
    const baseTotal = subtotal + shippingCost; // Total avant réduction
    const ratio = nabooAmount / baseTotal; // Ratio de réduction global
    
    const adjustedItems = items.map(item => ({
      ...item,
      price: Math.round(item.price * ratio)
    }));
    
    // Ajouter les frais de livraison comme un item si > 0
    const allItems = [...adjustedItems];
    if (shippingCost > 0) {
      allItems.push({
        id: 'shipping',
        name: 'Frais de livraison',
        price: Math.round(shippingCost * ratio),
        quantity: 1,
        category: 'shipping',
      });
    }
    
    const nabooProducts = formatCartForNabooPay(allItems);
    
    // Log pour debug
    const adjustedTotal = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const estimatedFees = Math.round(adjustedTotal * NABOOPAY_FEE_RATE);
    const finalAmount = adjustedTotal + estimatedFees;
    console.log(`[Checkout] Sous-total: ${subtotal} FCFA, Livraison: ${shippingCost} FCFA, Réduction: ${discount} FCFA`);
    console.log(`[Checkout] Total: ${total} FCFA`);
    console.log(`[Checkout] Montant NabooPay: ${adjustedTotal} FCFA, Frais NabooPay: ${estimatedFees} FCFA`);
    console.log(`[Checkout] Total final client: ${finalAmount} FCFA (devrait être ≈ ${total})`);

    const nabooResponse = await naboopay.createTransaction(
      nabooProducts,
      successUrl,
      errorUrl,
      [paymentMethod]
    );

    // 3. Mettre à jour la commande avec l'ID de transaction NabooPay
    await supabase
      .from('orders')
      .update({
        naboopay_transaction_id: nabooResponse.order_id,
      })
      .eq('id', order.id);

    console.log(`[Checkout] Commande ${order.id} créée, transaction NabooPay: ${nabooResponse.order_id}`);

    // 4. Retourner l'URL de paiement
    return NextResponse.json({
      success: true,
      order_id: order.id,
      checkout_url: nabooResponse.checkout_url,
      transaction_id: nabooResponse.order_id,
    });

  } catch (error) {
    console.error('Erreur checkout:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du checkout' },
      { status: 500 }
    );
  }
}

