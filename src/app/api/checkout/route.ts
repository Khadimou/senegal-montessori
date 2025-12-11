import { NextRequest, NextResponse } from 'next/server';
import { naboopay, formatCartForNabooPay, PaymentMethod } from '@/lib/naboopay';
import { supabase } from '@/lib/supabase';

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
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { customer, items, paymentMethod } = body;

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

    // Calculer le total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 1. Créer la commande dans Supabase avec statut "pending"
    const orderData = {
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

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Erreur création commande:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande' },
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

      return NextResponse.json({
        success: true,
        order_id: order.id,
        checkout_url: successUrl, // Rediriger directement vers success en dev
        dev_mode: true,
        message: 'Mode développement - NabooPay requiert HTTPS. Déployez sur Vercel pour tester les paiements.',
      });
    }

    // Production - utiliser NabooPay
    const nabooProducts = formatCartForNabooPay(items);

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
        naboopay_transaction_id: nabooResponse.transaction.id,
      })
      .eq('id', order.id);

    console.log(`[Checkout] Commande ${order.id} créée, transaction NabooPay: ${nabooResponse.transaction.id}`);

    // 4. Retourner l'URL de paiement
    return NextResponse.json({
      success: true,
      order_id: order.id,
      checkout_url: nabooResponse.checkout_url,
      transaction_id: nabooResponse.transaction.id,
    });

  } catch (error) {
    console.error('Erreur checkout:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du checkout' },
      { status: 500 }
    );
  }
}

