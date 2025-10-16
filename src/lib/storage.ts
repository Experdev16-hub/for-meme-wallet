import { createClient } from 'redis'

export interface WalletData {
  address: string
  timestamp: string
  source: string
}

const WALLETS_KEY = 'wallets'

// Create Redis client
const redis = createClient({
  url: process.env.REDIS_URL
})

// Connect to Redis (do this once)
let isConnected = false
async function ensureConnected() {
  if (!isConnected) {
    await redis.connect()
    isConnected = true
  }
}

export async function readWallets(): Promise<WalletData[]> {
  try {
    await ensureConnected()
    const wallets = await redis.get(WALLETS_KEY)
    return wallets ? JSON.parse(wallets) : []
  } catch (error) {
    console.error('Error reading wallets:', error)
    return []
  }
}

export async function writeWallets(wallets: WalletData[]): Promise<void> {
  try {
    await ensureConnected()
    await redis.set(WALLETS_KEY, JSON.stringify(wallets))
    console.log('✅ Wallets saved to Redis. Total:', wallets.length)
  } catch (error) {
    console.error('Error writing wallets:', error)
  }
}

export async function addWallet(wallet: WalletData): Promise<void> {
  const wallets = await readWallets()
  if (!wallets.some(w => w.address.toLowerCase() === wallet.address.toLowerCase())) {
    wallets.push(wallet)
    await writeWallets(wallets)
    console.log('✅ Wallet added to Redis:', wallet.address)
  } else {
    console.log('❌ Wallet already exists:', wallet.address)
  }
}

export async function getWalletStats() {
  const allWallets = await readWallets()
  const today = new Date().toDateString()
  const walletsToday = allWallets.filter(w => new Date(w.timestamp).toDateString() === today).length

  return {
    total: allWallets.length,
    today: walletsToday,
    recent: allWallets.slice(-10)
  }
}

export async function getAllWallets(): Promise<WalletData[]> {
  return await readWallets()
}
