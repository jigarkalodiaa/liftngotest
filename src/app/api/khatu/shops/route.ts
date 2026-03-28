import { NextResponse } from 'next/server';
import { KHATU_SHOPS } from '@/data/khatuShops';

export async function GET() {
  return NextResponse.json({ shops: KHATU_SHOPS });
}
