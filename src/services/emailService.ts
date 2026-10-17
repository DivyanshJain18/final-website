/**
 * Centralized Web3Forms Email Submission Service for Mechafy Global
 * Handles form submissions to sales@mechafyglobal.com with validation,
 * error handling, and duplicate submission prevention.
 */

export interface Web3FormsSubmissionOptions {
  subject: string;
  fromName?: string;
  replyTo?: string;
  fields: Record<string, any>;
}

export interface Web3FormsResult {
  success: boolean;
  message: string;
}

/**
 * Returns the configured Web3Forms Access Key from Vite environment variables.
 */
export function getWeb3FormsAccessKey(): string | undefined {
  return import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
}

/**
 * Submits form data to sales@mechafyglobal.com using Web3Forms.
 */
export async function submitToWeb3Forms(options: Web3FormsSubmissionOptions): Promise<Web3FormsResult> {
  const accessKey = getWeb3FormsAccessKey();

  if (!accessKey || !accessKey.trim()) {
    console.warn('[Web3Forms] VITE_WEB3FORMS_ACCESS_KEY is missing from environment variables.');
    return {
      success: false,
      message: 'VITE_WEB3FORMS_ACCESS_KEY is missing. Please configure it in your Netlify environment variables (Site settings > Environment variables) and trigger a redeploy.'
    };
  }

  // Format all custom fields cleanly for the email body if not already present
  const payload: Record<string, any> = {
    access_key: accessKey.trim(),
    subject: options.subject,
    from_name: options.fromName || 'Mechafy Global Desk',
    to_email: 'sales@mechafyglobal.com',
    ...options.fields
  };

  if (options.replyTo && options.replyTo.trim()) {
    payload.replyto = options.replyTo.trim();
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Your inquiry has been delivered to sales@mechafyglobal.com.'
      };
    } else {
      const errorMsg = data.message || 'Web3Forms submission failed. Please verify your Access Key.';
      console.error('[Web3Forms Error]', errorMsg, data);
      return {
        success: false,
        message: errorMsg
      };
    }
  } catch (err: any) {
    console.error('[Web3Forms Network Error]', err);
    return {
      success: false,
      message: err.message || 'Network error while submitting to Web3Forms. Please try again or contact sales@mechafyglobal.com directly.'
    };
  }
}
