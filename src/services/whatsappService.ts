/**
 * Mechafy Global WhatsApp Enquiry Service
 * Business WhatsApp Number: +91 9817056538
 */

export const MECHAFY_WHATSAPP_NUMBER = '919817056538';
export const MECHAFY_WHATSAPP_DISPLAY = '+91 9817056538';

export type WhatsAppEnquiryType = 
  | 'ask_product' 
  | 'check_availability' 
  | 'bulk_quote' 
  | 'product_specialist'
  | 'general_support';

export interface WhatsAppProductEnquiryOptions {
  productName: string;
  sku?: string;
  quantity?: number;
  productUrl?: string;
  type?: WhatsAppEnquiryType;
  customNote?: string;
}

export const WHATSAPP_ACTIONS = [
  {
    id: 'ask_product' as WhatsAppEnquiryType,
    label: 'Ask About This Product',
    shortLabel: 'Product Inquiry',
    description: 'Ask questions regarding specifications, features, or compatibility.',
    badge: 'Quick Response',
    iconName: 'HelpCircle'
  },
  {
    id: 'check_availability' as WhatsAppEnquiryType,
    label: 'Check Availability',
    shortLabel: 'Check Stock',
    description: 'Confirm live inventory, dispatch timelines, and delivery to your PIN code.',
    badge: 'Dispatch Status',
    iconName: 'Truck'
  },
  {
    id: 'bulk_quote' as WhatsAppEnquiryType,
    label: 'Request Bulk Quote',
    shortLabel: 'B2B / Bulk',
    description: 'Special tier pricing for educational institutions, makerspaces, or enterprise orders.',
    badge: 'Best Pricing',
    iconName: 'PackageCheck'
  },
  {
    id: 'product_specialist' as WhatsAppEnquiryType,
    label: 'Talk to a Product Specialist',
    shortLabel: 'Technical Support',
    description: 'Speak directly with our robotics & hardware engineering specialists.',
    badge: 'Expert Advice',
    iconName: 'UserCheck'
  }
];

/**
 * Builds a formatted WhatsApp message according to Phase 9 requirements:
 * Contains: Product Name, SKU, Product URL, Requested Quantity, and Intent.
 */
export function buildProductWhatsAppMessage({
  productName,
  sku,
  quantity = 1,
  productUrl,
  type = 'ask_product',
  customNote
}: WhatsAppProductEnquiryOptions): string {
  const cleanUrl = productUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const skuText = sku ? ` (SKU: ${sku})` : '';
  const qtyText = quantity > 1 ? ` | Quantity: ${quantity} units` : '';

  switch (type) {
    case 'check_availability':
      return `Hi Mechafy Global team,\n\nI would like to *Check Availability* for:\n• Product: ${productName}${skuText}${qtyText}\n• Link: ${cleanUrl}\n\nCould you please confirm current stock and estimated delivery time?${customNote ? `\nNote: ${customNote}` : ''}\n\nThank you!`;

    case 'bulk_quote':
      return `Hi Mechafy Global team,\n\nI am requesting a *Bulk / B2B Quote* for:\n• Product: ${productName}${skuText}\n• Requested Quantity: ${quantity} units\n• Link: ${cleanUrl}\n\nPlease share tier pricing and GST invoice details.${customNote ? `\nRequirements: ${customNote}` : ''}\n\nThank you!`;

    case 'product_specialist':
      return `Hi Mechafy Global team,\n\nI would like to *Talk to a Product Specialist* regarding:\n• Product: ${productName}${skuText}\n• Link: ${cleanUrl}\n\nI need technical advice and compatibility verification for my project.${customNote ? `\nQuestions: ${customNote}` : ''}\n\nThank you!`;

    case 'ask_product':
    default:
      return `Hi Mechafy Global team,\n\nI am inquiring about:\n• Product: ${productName}${skuText}${qtyText}\n• Link: ${cleanUrl}\n\nCould you please provide more information?${customNote ? `\nQuery: ${customNote}` : ''}\n\nThank you!`;
  }
}

/**
 * Returns a direct https://wa.me link with encoded message
 */
export function getProductWhatsAppUrl(options: WhatsAppProductEnquiryOptions): string {
  const message = buildProductWhatsAppMessage(options);
  return `https://wa.me/${MECHAFY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * General site-wide WhatsApp support link
 */
export function getGeneralWhatsAppUrl(intent?: string): string {
  const message = intent 
    ? `Hi Mechafy Global, I would like assistance with: ${intent}.` 
    : 'Hi Mechafy Global, I am browsing your store and would like some assistance.';
  return `https://wa.me/${MECHAFY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
