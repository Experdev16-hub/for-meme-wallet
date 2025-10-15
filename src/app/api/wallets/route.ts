import { NextResponse } from 'next/server'
import { ApiResponse, WalletData } from '../../../types'

// This endpoint provides wallet statistics
let walletCount: number = 0;
let wallets: WalletData[] = [];

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const today: string = new Date().toDateString();
    const walletsToday: number = wallets.filter(w => 
      new Date(w.timestamp).toDateString() === today
    ).length;

    return NextResponse.json({
      totalWallets: walletCount,
      walletsToday: walletsToday,
      lastUpdated: new Date().toISOString()
    }, {
      headers: { 
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('Error in wallets API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
