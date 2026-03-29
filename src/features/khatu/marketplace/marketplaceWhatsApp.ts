import type { MarketplaceCartLine } from '@/features/khatu/marketplace/cartStore';
import { MARKETPLACE_DELIVERY_FLAT_INR, marketplaceCartSubtotal } from '@/features/khatu/marketplace/cartStore';

export function buildMarketplaceWhatsAppMessage(
  shopName: string,
  items: MarketplaceCartLine[],
  deliveryFlatInr: number = MARKETPLACE_DELIVERY_FLAT_INR
): string {
  if (items.length === 0) return '';
  const subtotal = marketplaceCartSubtotal(items);
  const grand = subtotal + deliveryFlatInr;
  const lines = [
    `Order for *${shopName}* (Liftngo marketplace)`,
    '————————————',
    ...items.map((i) => `${i.name} × ${i.quantity} — ₹${i.price * i.quantity}`),
    '————————————',
    `*Items subtotal: ₹${subtotal}*`,
    `Delivery (Liftngo): ₹${deliveryFlatInr}`,
    `*Total (estimate): ₹${grand}*`,
    '',
    'Please confirm availability & payment. Thank you!',
  ];
  return lines.join('\n');
}

export function marketplaceWhatsAppHref(phoneDigits: string, message: string): string | null {
  const digits = phoneDigits.replace(/\D/g, '');
  if (!digits || !message.trim()) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
