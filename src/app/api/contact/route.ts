import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestBody = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    // Enregistrer le message dans Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'unread',
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur enregistrement message:', error);
      // Si la table n'existe pas, on continue quand même
      if (error.code === '42P01') {
        console.log('Table contact_messages non trouvée. Créez-la avec le schéma SQL.');
      }
    }

    console.log(`[Contact] Nouveau message de ${name} (${email}) - Sujet: ${subject}`);

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      id: data?.id,
    });

  } catch (error) {
    console.error('Erreur contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}

// Récupérer tous les messages (pour l'admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages: data || [] });

  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}

