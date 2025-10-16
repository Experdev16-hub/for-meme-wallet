// Simple memory storage that works NOW
let wallets: any[] = []

export async function readWallets() {
  console.log('Reading wallets:', wallets.length)
  return wallets
}

export async function writeWallets(newWallets: any[]) {
  wallets = newWallets
  console.log('Writing wallets:', wallets.length)
}

export async function addWallet(wallet: any) {
  const currentWallets = await readWallets()
  if (!currentWallets.some(w => w.address === wallet.address)) {
    currentWallets.push(wallet)
    await writeWallets(currentWallets)
    console.log('✅ Wallet added:', wallet.address)
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

export async function getAllWallets() {
  return await readWallets()
}
