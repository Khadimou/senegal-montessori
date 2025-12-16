import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface WebhookPayload {
  order_id: string;
  transaction_status: 'pending' | 'paid' | 'done' | 'part_paid' | 'failed';
  amount: number;
  amount_to_pay?: number;
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    
    console.log('[Webhook NabooPay] Reçu:', JSON.stringify(payload, null, 2));

    const { order_id, transaction_status } = payload;

    if (!order_id || !transaction_status) {
      console.error('[Webhook] Payload invalide');
      return NextResponse.json(
        { error: 'Payload invalide' },
        { status: 400 }
      );
    }

    // Mapper le statut NabooPay vers notre statut de commande
    const orderStatusMap: Record<string, string> = {
      'pending': 'pending',
      'paid': 'confirmed',
      'done': 'confirmed',
      'part_paid': 'pending',
      'failed': 'cancelled',
    };

    const orderStatus = orderStatusMap[transaction_status] || 'pending';

    // Mettre à jour la commande dans Supabase
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('naboopay_transaction_id', order_id)
      .single();

    if (findError || !order) {
      console.error('[Webhook] Commande non trouvée pour transaction:', order_id);
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: transaction_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('[Webhook] Erreur mise à jour commande:', updateError);
      return NextResponse.json(
        { error: 'Erreur mise à jour' },
        { status: 500 }
      );
    }

    console.log(`[Webhook] Commande ${order.id} mise à jour: ${transaction_status} -> ${orderStatus}`);

    // Décrémenter le stock si le paiement est confirmé
    if (transaction_status === 'paid' || transaction_status === 'done') {
      const items = order.items as Array<{ product_id: string; quantity: number }>;
      
      for (const item of items) {
        // Récupérer le stock actuel
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();
        
        if (product) {
          const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity);
          
          // Mettre à jour le stock
          const { error: stockError } = await supabase
            .from('products')
            .update({ 
              stock_quantity: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.product_id);
          
          if (stockError) {
            console.error(`[Webhook] Erreur mise à jour stock produit ${item.product_id}:`, stockError);
          } else {
            console.log(`[Webhook] Stock produit ${item.product_id} mis à jour: -${item.quantity} (nouveau stock: ${newStock})`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      new_status: orderStatus,
    });

  } catch (error) {
    console.error('[Webhook] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// NabooPay peut envoyer des requêtes GET pour vérifier l'endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook NabooPay endpoint actif',
  });
}

