import { useState } from 'react';
import { Product } from '../services/productService';
import { 
  getProductWhatsAppUrl, 
  WhatsAppEnquiryType, 
  WHATSAPP_ACTIONS,
  MECHAFY_WHATSAPP_DISPLAY 
} from '../services/whatsappService';
import { MessageSquare, HelpCircle, Truck, PackageCheck, UserCheck, ChevronDown, ExternalLink } from 'lucide-react';

interface ProductWhatsAppEnquiryProps {
  product: Product;
  quantity?: number;
  productUrl?: string;
  className?: string;
}

export function ProductWhatsAppEnquiry({
  product,
  quantity = 1,
  productUrl,
  className = ''
}: ProductWhatsAppEnquiryProps) {
  const [selectedType, setSelectedType] = useState<WhatsAppEnquiryType>('ask_product');
  const [showOptions, setShowOptions] = useState(false);

  const currentAction = WHATSAPP_ACTIONS.find(a => a.id === selectedType) || WHATSAPP_ACTIONS[0];
  const activeUrl = getProductWhatsAppUrl({
    productName: product.name,
    sku: product.sku,
    quantity,
    productUrl,
    type: selectedType
  });

  const getIcon = (type: WhatsAppEnquiryType) => {
    switch (type) {
      case 'check_availability':
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'bulk_quote':
        return <PackageCheck className="w-4 h-4 text-amber-400" />;
      case 'product_specialist':
        return <UserCheck className="w-4 h-4 text-electric-blue" />;
      case 'ask_product':
      default:
        return <HelpCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Instant WhatsApp Desk</h3>
            <p className="text-[11px] text-slate-400">Direct engineering & sales response at {MECHAFY_WHATSAPP_DISPLAY}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Online
        </span>
      </div>

      {/* Contextual Action Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span>Choose Inquiry Intent:</span>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="text-electric-blue hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showOptions ? 'Hide Options' : 'Change Topic'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Action Pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {WHATSAPP_ACTIONS.map(action => {
            const isSelected = action.id === selectedType;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  setSelectedType(action.id);
                  setShowOptions(false);
                }}
                className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#25D366]/15 border-[#25D366]/50 text-white shadow-sm ring-1 ring-[#25D366]/30'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="shrink-0">{getIcon(action.id)}</div>
                <div className="min-w-0">
                  <div className="font-semibold truncate text-[11px]">{action.shortLabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selection Description */}
      <div className="p-2.5 rounded-xl bg-navy-950/70 border border-white/5 text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1.5">
            {getIcon(currentAction.id)}
            {currentAction.label}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {quantity > 1 ? `Qty: ${quantity}` : '1 unit'} {product.sku ? `• SKU: ${product.sku}` : ''}
          </span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          {currentAction.description}
        </p>
      </div>

      {/* Primary WhatsApp Action Button */}
      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_4px_15px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all cursor-pointer text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        <span>{currentAction.label}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>
    </div>
  );
}
