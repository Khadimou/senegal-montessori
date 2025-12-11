import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test 1: Variables d'environnement
    const hasApiKey = !!process.env.NABOOPAY_API_KEY;
    const hasBaseUrl = !!process.env.NABOOPAY_BASE_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Test 2: Appel simple à l'API NabooPay
    let nabooTest = null;
    let nabooError = null;
    
    try {
      const testPayload = {
        method_of_payment: ['WAVE'],
        products: [
          {
            name: 'Test Product',
            category: 'Test',
            amount: 1000,
            quantity: 1,
            description: 'Test description'
          }
        ],
        success_url: 'https://www.senegal-montessori.store/test/success',
        error_url: 'https://www.senegal-montessori.store/test/error',
        is_escrow: false,
        is_merchant: true
      };

      const response = await fetch(
        `${process.env.NABOOPAY_BASE_URL || 'https://api.naboopay.com/api/v1'}/transaction/create-transaction`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.NABOOPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        nabooError = {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        };
      } else {
        nabooTest = await response.json();
      }
    } catch (error) {
      nabooError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      };
    }

    return NextResponse.json({
      status: 'Test API NabooPay',
      environment: {
        hasApiKey,
        apiKeyPrefix: hasApiKey ? process.env.NABOOPAY_API_KEY?.substring(0, 15) + '...' : 'MISSING',
        hasBaseUrl,
        baseUrl: process.env.NABOOPAY_BASE_URL,
        publicBaseUrl: baseUrl,
        supabaseUrl,
      },
      naboopay: {
        success: !!nabooTest,
        data: nabooTest,
        error: nabooError
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

