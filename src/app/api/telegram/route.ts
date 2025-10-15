import { NextRequest, NextResponse } from 'next/server'
import { addWallet, getWalletStats, getAllWallets, WalletData } from '../../../lib/storage'

const TELEGRAM_BOT_TOKEN: string | undefined = process.env.TELEGRAM_BOT_TOKEN

// Handle wallet submissions (POST from frontend)
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate Ethereum address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum wallet address format' },
        { status: 400 }
      )
    }

    // Store wallet in JSON file
    const walletData: WalletData = {
      address: walletAddress,
      timestamp: new Date().toISOString(),
      source: 'for.meme'
    }
    
    addWallet(walletData)
    const stats = getWalletStats()

    return NextResponse.json({ 
      success: true,
      totalWallets: stats.total,
      position: stats.total
    })

  } catch (error) {
    console.error('Error in Telegram API:', error)
    return NextResponse.json(
      { error: 'Failed to process wallet address' },
      { status: 500 }
    )
  }
}

// Handle Telegram webhook (POST from Telegram)
export async function PATCH(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: 'Telegram bot not configured' })
  }

  try {
    const update = await request.json()
    
    // Handle message updates from Telegram
    if (update.message) {
      const { chat, text } = update.message
      const chatId = chat.id

      if (text) {
        switch (text.toLowerCase()) {
          case '/start':
            await handleStartCommand(chatId)
            break
            
          case '/wallets':
            await handleWalletsCommand(chatId)
            break
            
          case '/stats':
            await handleStatsCommand(chatId)
            break
            
          case '/export':
            await handleExportCommand(chatId)
            break
            
          case '/help':
            await handleHelpCommand(chatId)
            break
            
          default:
            await sendTelegramMessage(chatId, 
              '🤖 *for.meme Bot*\n\n' +
              'Use /help to see available commands.'
            )
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling Telegram update:', error)
    return NextResponse.json({ success: true }) // Always return success to Telegram
  }
}

// Command handlers
async function handleStartCommand(chatId: string | number) {
  const stats = getWalletStats()
  const message = `🤖 *Welcome to for.meme Bot!*\n\n` +
    `I manage wallet registrations from the for.meme website.\n\n` +
    `📊 *Current Stats:*\n` +
    `• Total Wallets: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n\n` +
    `Use /help to see all available commands.`
  
  await sendTelegramMessage(chatId, message)
}

async function handleWalletsCommand(chatId: string | number) {
  const stats = getWalletStats()
  
  let message = `📊 *All Wallet Statistics*\n\n`
  message += `💰 *Total Wallets:* ${stats.total}\n`
  message += `📈 *Registered Today:* ${stats.today}\n`
  message += `⏰ *Last Updated:* ${new Date().toLocaleString()}\n\n`
  
  if (stats.recent.length > 0) {
    message += `*Recent Wallets (last 10):*\n`
    stats.recent.slice(-10).forEach((wallet, index) => {
      const time = new Date(wallet.timestamp).toLocaleTimeString()
      const date = new Date(wallet.timestamp).toLocaleDateString()
      message += `${index + 1}. \`${wallet.address}\`\n   📅 ${date} ${time}\n\n`
    })
  } else {
    message += `No wallets registered yet.`
  }

  await sendTelegramMessage(chatId, message)
}

async function handleStatsCommand(chatId: string | number) {
  const stats = getWalletStats()
  
  const message = `📈 *Quick Stats*\n\n` +
    `• Total Wallets: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n` +
    `• Last 10 Registrations: ${stats.recent.length}\n\n` +
    `_Use /wallets to see all wallet addresses_`

  await sendTelegramMessage(chatId, message)
}

async function handleExportCommand(chatId: string | number) {
  const allWallets = getAllWallets()
  
  if (allWallets.length === 0) {
    await sendTelegramMessage(chatId, 'No wallets found in database.')
    return
  }

  // Create formatted list
  let message = `📁 *All Wallets (${allWallets.length})*\n\n`
  
  allWallets.forEach((wallet, index) => {
    const time = new Date(wallet.timestamp).toLocaleString()
    message += `${index + 1}. \`${wallet.address}\`\n   ⏰ ${time}\n\n`
  })

  await sendTelegramMessage(chatId, message)
}

async function handleHelpCommand(chatId: string | number) {
  const message = `🤖 *Available Commands*\n\n` +
    `*/start* - Welcome message with stats\n` +
    `*/wallets* - Show all wallet addresses and stats\n` +
    `*/stats* - Quick statistics overview\n` +
    `*/export* - Export all wallet addresses\n` +
    `*/help* - Show this help message\n\n` +
    `💡 *All commands are available to everyone with bot access*`

  await sendTelegramMessage(chatId, message)
}

// Utility function to send messages
async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    }
  )
}



// In GET function - webhook setup
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const setup = url.searchParams.get('setup')

  if (setup === 'webhook' && TELEGRAM_BOT_TOKEN) {
    // Use the actual production URL
    const webhookUrl = `https://${process.env.VERCEL_URL || 'your-domain.vercel.app'}/api/telegram`
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`
    )
    
    const result = await response.json()
    
    return NextResponse.json({
      success: result.ok,
      webhook: webhookUrl,
      result: result
    })
  }

  return NextResponse.json({
    status: 'Telegram API is running',
    instructions: 'Set webhook with: /api/telegram?setup=webhook'
  })
}
