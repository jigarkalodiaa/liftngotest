import { NextResponse } from 'next/server';
import { getKhatuShopById, getProductsForShop } from '@/data/khatuShops';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const shop = getKhatuShopById(id);
  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  }
  const products = getProductsForShop(id);
  return NextResponse.json({ shop, products });
}
