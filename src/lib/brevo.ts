// Configuration Brevo (anciennement Sendinblue)
// Documentation: https://developers.brevo.com/reference/sendtransacemail

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: EmailRecipient;
  sender?: EmailRecipient;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('[Brevo] API Key non configurée. Ajoutez BREVO_API_KEY dans les variables d\'environnement.');
    return { success: false, error: 'API Key non configurée' };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: options.sender || {
          name: 'Sénégal Montessori',
          email: 'noreply@senegal-montessori.store',
        },
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        htmlContent: options.htmlContent,
        textContent: options.textContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Brevo] Erreur:', data);
      return { success: false, error: data.message || 'Erreur lors de l\'envoi' };
    }

    console.log('[Brevo] Email envoyé avec succès:', data.messageId);
    return { success: true, messageId: data.messageId };

  } catch (error) {
    console.error('[Brevo] Exception:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Template pour les notifications de contact
export function getContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { html: string; text: string } {
  const subjectLabels: Record<string, string> = {
    question: 'Question sur un produit',
    order: 'Suivi de commande',
    advice: 'Conseils pédagogiques',
    partnership: 'Partenariat',
    other: 'Autre',
  };

  const subjectLabel = subjectLabels[data.subject] || data.subject;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f8f8f8; padding: 30px; border-radius: 0 0 12px 12px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .value { background: white; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #f59e0b; }
    .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; white-space: pre-wrap; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
    .cta { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Nouveau message de contact</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">De</div>
        <div class="value">${data.name} &lt;${data.email}&gt;</div>
      </div>
      ${data.phone ? `
      <div class="field">
        <div class="label">Téléphone</div>
        <div class="value">${data.phone}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">Sujet</div>
        <div class="value">${subjectLabel}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${data.message}</div>
      </div>
      <center>
        <a href="mailto:${data.email}" class="cta">Répondre à ${data.name}</a>
      </center>
    </div>
    <div class="footer">
      Ce message a été envoyé via le formulaire de contact de senegal-montessori.store
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NOUVEAU MESSAGE DE CONTACT
===========================

De: ${data.name} <${data.email}>
${data.phone ? `Téléphone: ${data.phone}` : ''}
Sujet: ${subjectLabel}

Message:
${data.message}

---
Répondre à: ${data.email}
  `;

  return { html, text };
}

// Template pour la confirmation de commande
export function getOrderConfirmationEmail(data: {
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
  isCOD?: boolean; // Paiement à la livraison
}): { html: string; text: string } {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 500;">${item.name}</div>
        <div style="color: #6b7280; font-size: 14px;">Quantité: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
        ${(item.price * item.quantity).toLocaleString()} FCFA
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0 0 10px 0; font-size: 28px; }
    .header p { color: #fef3c7; margin: 0; font-size: 16px; }
    .content { background: #ffffff; padding: 40px 20px; }
    .order-number { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0; }
    .order-number strong { color: #f59e0b; font-size: 18px; }
    .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #f59e0b; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .totals { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; }
    .total-row.final { border-top: 2px solid #f59e0b; margin-top: 10px; padding-top: 15px; font-size: 20px; font-weight: bold; color: #f59e0b; }
    .promo-badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 8px; }
    .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .info-box p { margin: 5px 0; color: #1e40af; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 30px 20px; text-align: center; color: #6b7280; font-size: 14px; }
    .social-links { margin: 20px 0; }
    .social-links a { display: inline-block; margin: 0 10px; color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Commande Confirmée !</h1>
      <p>Merci pour votre achat, ${data.customerName}</p>
    </div>
    
    <div class="content">
      <div class="order-number">
        <div style="color: #78716c; font-size: 14px; margin-bottom: 5px;">Numéro de commande</div>
        <strong>#${data.orderId.slice(0, 8).toUpperCase()}</strong>
      </div>

      <p style="font-size: 16px; color: #4b5563;">
        Nous avons bien reçu votre commande et nous la préparons avec soin. Vous serez contacté sous peu pour organiser la livraison.
      </p>

      <div class="section-title">📦 Détails de votre commande</div>
      
      <table class="items-table">
        ${itemsHtml}
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Sous-total</span>
          <span>${data.subtotal.toLocaleString()} FCFA</span>
        </div>
        ${data.shipping > 0 ? `
        <div class="total-row">
          <span>Livraison</span>
          <span>${data.shipping.toLocaleString()} FCFA</span>
        </div>
        ` : `
        <div class="total-row" style="color: #10b981;">
          <span>✅ Livraison</span>
          <span>Gratuite</span>
        </div>
        `}
        ${data.discount > 0 ? `
        <div class="total-row" style="color: #10b981;">
          <span>
            Réduction
            ${data.promoCode ? `<span class="promo-badge">${data.promoCode}</span>` : ''}
          </span>
          <span>-${data.discount.toLocaleString()} FCFA</span>
        </div>
        ` : ''}
        <div class="total-row final">
          <span>${data.isCOD ? 'Total à payer à la livraison' : 'Total payé'}</span>
          <span>${data.total.toLocaleString()} FCFA</span>
        </div>
      </div>

      ${data.isCOD ? `
      <div class="info-box" style="background: #ecfdf5; border-color: #10b981;">
        <p style="color: #065f46;"><strong>💵 Paiement à la livraison</strong></p>
        <p style="color: #065f46;">Préparez ${data.total.toLocaleString()} FCFA en espèces pour le livreur. Aucun paiement en ligne n'est requis.</p>
      </div>
      ` : ''}

      <div class="info-box">
        <p><strong>📞 Prochaine étape :</strong></p>
        <p>Notre équipe vous contactera très bientôt pour confirmer les détails de livraison.</p>
      </div>

      <div class="info-box" style="background: #dbeafe; border-color: #3b82f6;">
        <p style="color: #1e40af;"><strong>🚀 Délais de livraison express</strong></p>
        <p style="color: #1e40af;">• <strong>Dakar :</strong> Livraison en 2h chrono</p>
        <p style="color: #1e40af;">• <strong>Régions :</strong> Moins de 48h partout au Sénégal</p>
      </div>

      <div class="info-box" style="background: #fef3c7; border-color: #f59e0b;">
        <p style="color: #92400e;"><strong>💡 Besoin d'aide ?</strong></p>
        <p style="color: #92400e;">Contactez-nous au +221 71 115 07 63 ou par email à contact@senegal-montessori.store</p>
      </div>

      <center>
        <a href="https://senegal-montessori.store/produits" class="cta-button">
          Continuer mes achats
        </a>
      </center>
    </div>

    <div class="footer">
      <p><strong>Montessori Sénégal</strong></p>
      <p>Almadies, Dakar - Sénégal</p>
      <p>+221 71 115 07 63</p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        Vous recevez cet email car vous avez passé commande sur senegal-montessori.store
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const itemsText = data.items.map(item => 
    `- ${item.name} x${item.quantity} : ${(item.price * item.quantity).toLocaleString()} FCFA`
  ).join('\n');

  const text = `
COMMANDE CONFIRMÉE !
==================

Merci ${data.customerName} !

Numéro de commande : #${data.orderId.slice(0, 8).toUpperCase()}

DÉTAILS DE VOTRE COMMANDE
-------------------------
${itemsText}

Sous-total : ${data.subtotal.toLocaleString()} FCFA
Livraison : ${data.shipping > 0 ? data.shipping.toLocaleString() + ' FCFA' : 'Gratuite'}
${data.discount > 0 ? `Réduction ${data.promoCode ? '(' + data.promoCode + ')' : ''} : -${data.discount.toLocaleString()} FCFA` : ''}

${data.isCOD ? 'TOTAL À PAYER À LA LIVRAISON' : 'TOTAL PAYÉ'} : ${data.total.toLocaleString()} FCFA
${data.isCOD ? `
💵 PAIEMENT À LA LIVRAISON
Préparez ${data.total.toLocaleString()} FCFA en espèces pour le livreur.
` : ''}
---
Prochaine étape : Notre équipe vous contactera très bientôt pour la livraison.

🚀 DÉLAIS DE LIVRAISON EXPRESS
• Dakar : Livraison en 2h chrono
• Régions : Moins de 48h partout au Sénégal

Besoin d'aide ? Contactez-nous :
+221 71 115 07 63
contact@senegal-montessori.store

Montessori Sénégal
Almadies, Dakar - Sénégal
  `;

  return { html, text };
}

