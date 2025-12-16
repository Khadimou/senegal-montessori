import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface PreorderRequestBody {
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity_requested: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PreorderRequestBody = await request.json();
    const { product_id, product_name, customer_name, customer_email, customer_phone, quantity_requested } = body;

    // Validation
    if (!product_id || !product_name || !customer_name || !customer_email || !quantity_requested) {
      return NextResponse.json(
        { error: 'Données incomplètes' },
        { status: 400 }
      );
    }

    if (quantity_requested < 1) {
      return NextResponse.json(
        { error: 'La quantité doit être au moins 1' },
        { status: 400 }
      );
    }

    // Enregistrer la demande dans Supabase
    const { data, error } = await supabase
      .from('preorder_requests')
      .insert([{
        product_id,
        product_name,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        quantity_requested,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur enregistrement demande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    console.log(`[Preorder] Nouvelle demande: ${customer_name} veut ${quantity_requested}x ${product_name}`);

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée avec succès',
      id: data?.id,
    });

  } catch (error) {
    console.error('Erreur preorder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande' },
      { status: 500 }
    );
  }
}

// Récupérer toutes les demandes (pour l'admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('product_id');

    let query = supabase
      .from('preorder_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ requests: data || [] });

  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

