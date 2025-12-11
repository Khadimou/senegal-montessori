import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface WebhookPayload {
  transaction_id: string;
  status: 'pending' | 'paid' | 'done' | 'part_paid' | 'failed';
  amount: number;
  payment_method?: string;
  paid_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    
    console.log('[Webhook NabooPay] Reçu:', JSON.stringify(payload, null, 2));

    const { transaction_id, status } = payload;

    if (!transaction_id || !status) {
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

    const orderStatus = orderStatusMap[status] || 'pending';

    // Mettre à jour la commande dans Supabase
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('naboopay_transaction_id', transaction_id)
      .single();

    if (findError || !order) {
      console.error('[Webhook] Commande non trouvée pour transaction:', transaction_id);
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
        payment_status: status,
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

    console.log(`[Webhook] Commande ${order.id} mise à jour: ${status} -> ${orderStatus}`);

    // Ici vous pouvez ajouter :
    // - Envoi d'email de confirmation
    // - Notification SMS
    // - Mise à jour du stock
    // etc.

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

