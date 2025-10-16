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
    console.log('🔗 Connecting to Redis...')
    await redis.connect()
    isConnected = true
    console.log('✅ Redis connected successfully')
  }
}

export async function readWallets(): Promise<WalletData[]> {
  try {
    await ensureConnected()
    const wallets = await redis.get(WALLETS_KEY)
    console.log('📖 Read wallets from Redis:', wallets ? JSON.parse(wallets).length : 0)
    return wallets ? JSON.parse(wallets) : []
  } catch (error) {
    console.error('❌ Error reading wallets:', error)
    return []
  }
}

export async function writeWallets(wallets: WalletData[]): Promise<void> {
  try {
    await ensureConnected()
    await redis.set(WALLETS_KEY, JSON.stringify(wallets))
    console.log('💾 Saved wallets to Redis. Total:', wallets.length)
  } catch (error) {
    console.error('❌ Error writing wallets:', error)
  }
}

export async function addWallet(wallet: WalletData): Promise<void> {
  console.log('🔄 addWallet called with:', wallet.address)
  const wallets = await readWallets()
  console.log('📊 Current wallets before add:', wallets.length)
  
  if (!wallets.some(w => w.address.toLowerCase() === wallet.address.toLowerCase())) {
    wallets.push(wallet)
    await writeWallets(wallets)
    console.log('✅ Wallet added successfully. New total:', wallets.length)
  } else {
    console.log('❌ Wallet already exists')
  }
}

export async function getWalletStats() {
  const allWallets = await readWallets()
  const today = new Date().toDateString()
  const walletsToday = allWallets.filter(w => new Date(w.timestamp).toDateString() === today).length

  console.log('📈 getWalletStats - Total:', allWallets.length, 'Today:', walletsToday)
  
  return {
    total: allWallets.length,
    today: walletsToday,
    recent: allWallets.slice(-10)
  }
}

export async function getAllWallets(): Promise<WalletData[]> {
  return await readWallets()
}
