import { kv } from '@vercel/kv'

export interface WalletData {
  address: string
  timestamp: string
  source: string
}

const WALLETS_KEY = 'wallets'

export async function readWallets(): Promise<WalletData[]> {
  try {
    const wallets = await kv.get<WalletData[]>(WALLETS_KEY)
    return wallets || []
  } catch (error) {
    console.error('Error reading wallets from KV:', error)
    return []
  }
}

export async function writeWallets(wallets: WalletData[]): Promise<void> {
  try {
    await kv.set(WALLETS_KEY, wallets)
    console.log('✅ Wallets saved to KV. Total:', wallets.length)
  } catch (error) {
    console.error('Error writing wallets to KV:', error)
  }
}

export async function addWallet(wallet: WalletData): Promise<void> {
  const wallets = await readWallets()

  // Check for duplicates
  if (!wallets.some(w => w.address.toLowerCase() === wallet.address.toLowerCase())) {
    wallets.push(wallet)
    await writeWallets(wallets)
    console.log('✅ Wallet added to KV:', wallet.address)
  } else {
    console.log('❌ Wallet already exists:', wallet.address)
  }
}

export async function getWalletStats() {
  const allWallets = await readWallets()
  const today = new Date().toDateString()

  const walletsToday = allWallets.filter(w =>
    new Date(w.timestamp).toDateString() === today
  ).length

  return {
    total: allWallets.length,
    today: walletsToday,
    recent: allWallets.slice(-10)
  }
}

export async function getAllWallets(): Promise<WalletData[]> {
  return await readWallets()
}
