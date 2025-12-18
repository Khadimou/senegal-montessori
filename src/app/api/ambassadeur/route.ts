import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/brevo';

const ADMIN_EMAIL = 'contact@senegal-montessori.store';
const MAX_AMBASSADORS = 5;

interface AmbassadorRequestBody {
  name: string;
  email: string;
  phone: string;
  city: string;
  instagram?: string;
  facebook?: string;
  children_ages: string;
  motivation: string;
  social_followers?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AmbassadorRequestBody = await request.json();
    const { name, email, phone, city, instagram, facebook, children_ages, motivation, social_followers } = body;

    if (!name || !email || !phone || !city || !children_ages || !motivation) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires' }, { status: 400 });
    }

    const { count } = await supabase.from('ambassadors').select('*', { count: 'exact', head: true }).eq('status', 'approved');
    if (count && count >= MAX_AMBASSADORS) {
      return NextResponse.json({ error: 'Toutes les places sont prises' }, { status: 400 });
    }

    const { data: existing } = await supabase.from('ambassadors').select('id').eq('email', email).single();
    if (existing) {
      return NextResponse.json({ error: 'Vous avez deja postule' }, { status: 400 });
    }

    const { data, error } = await supabase.from('ambassadors').insert([{
      name, email, phone, city,
      instagram: instagram || null,
      facebook: facebook || null,
      children_ages,
      motivation,
      social_followers: social_followers || null,
      status: 'pending',
    }]).select().single();

    if (error) {
      console.error('Error inserting ambassador:', error);
    }

    const html = `
      <div style="font-family: Arial; max-width: 600px;">
        <h2 style="color: #9333ea;">Nouvelle Candidature Ambassadeur</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${phone}</p>
        <p><strong>Ville:</strong> ${city}</p>
        <p><strong>Instagram:</strong> ${instagram || 'Non renseigne'}</p>
        <p><strong>Facebook:</strong> ${facebook || 'Non renseigne'}</p>
        <p><strong>Ages enfants:</strong> ${children_ages}</p>
        <p><strong>Abonnes:</strong> ${social_followers || 'Non renseigne'}</p>
        <p><strong>Motivation:</strong></p>
        <p>${motivation}</p>
      </div>
    `;

    await sendEmail({
      to: [{ email: ADMIN_EMAIL, name: 'Senegal Montessori' }],
      subject: `[Ambassadeur] Nouvelle candidature de ${name}`,
      htmlContent: html,
      textContent: `Candidature de ${name} (${email}). Tel: ${phone}. Ville: ${city}.`,
      replyTo: { email, name },
    });

    const confirmHtml = `
      <div style="font-family: Arial; max-width: 600px;">
        <h2 style="color: #9333ea;">Candidature Recue !</h2>
        <p>Bonjour ${name},</p>
        <p>Merci d'avoir postule au programme Ambassadeur Montessori Senegal !</p>
        <p>Nous examinerons votre candidature et vous contacterons dans les 48 heures.</p>
        <p>A bientot,<br>L'equipe Montessori Senegal</p>
      </div>
    `;

    await sendEmail({
      to: [{ email, name }],
      subject: 'Votre candidature ambassadeur a ete recue !',
      htmlContent: confirmHtml,
      textContent: `Bonjour ${name}, merci d'avoir postule ! Nous vous contacterons dans 48h.`,
    });

    console.log(`[Ambassadeur] Nouvelle candidature de ${name} (${email})`);

    return NextResponse.json({ success: true, message: 'Candidature envoyee', id: data?.id });

  } catch (error) {
    console.error('Erreur ambassadeur:', error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('count');

    if (countOnly) {
      const { count } = await supabase.from('ambassadors').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      return NextResponse.json({ count: count || 0 });
    }

    const { data, error } = await supabase.from('ambassadors').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    return NextResponse.json({ ambassadors: data || [] });

  } catch (error) {
    console.error('Erreur get ambassadors:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
