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

