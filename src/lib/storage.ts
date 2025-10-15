// lib/storage.ts
export interface WalletData {
  address: string
  timestamp: string
  source: string
}

// In-memory storage (resets on server restart)
let wallets: WalletData[] = []

export function readWallets(): WalletData[] {
  return wallets
}

export function writeWallets(newWallets: WalletData[]): void {
  wallets = newWallets
}

export function addWallet(wallet: WalletData): void {
  const existingWallets = readWallets()
  
  // Check for duplicates
  if (!existingWallets.some(w => w.address.toLowerCase() === wallet.address.toLowerCase())) {
    existingWallets.push(wallet)
    writeWallets(existingWallets)
  }
}

export function getWalletStats() {
  const allWallets = readWallets()
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

export function getAllWallets(): WalletData[] {
  return readWallets()
}
