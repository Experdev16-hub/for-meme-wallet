import { NextRequest, NextResponse } from 'next/server'
import { addWallet, getWalletStats, getAllWallets, WalletData } from '../../../lib/storage'

const TELEGRAM_BOT_TOKEN: string | undefined = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID: string | undefined = process.env.TELEGRAM_CHAT_ID

// Handle ALL requests (both wallet submissions and Telegram webhooks)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    // If it's a Telegram webhook update
    if (contentType?.includes('application/json')) {
      const update = await request.json()
      
      if (update.message) {
        const { chat, text } = update.message
        const chatId = chat.id

        console.log('📨 Received Telegram message:', text, 'from chat:', chatId)

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
    }
    
    // If it's a wallet submission from the website
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid Ethereum wallet address' }, { status: 400 })
    }

    // Store wallet
    const walletData: WalletData = {
      address: walletAddress,
      timestamp: new Date().toISOString(),
      source: 'for.meme'
    }
    
    addWallet(walletData)
    const stats = await getWalletStats()

    // Send notification to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const notificationMessage = `🤑 *New Wallet Registered!*\n\n` +
        `💰 *Wallet:* \`${walletAddress}\`\n` +
        `📊 *Total Wallets:* ${stats.total}\n` +
        `📈 *Today:* ${stats.today}\n` +
        `⏰ *Time:* ${new Date().toLocaleString()}`

      await sendTelegramMessage(TELEGRAM_CHAT_ID, notificationMessage)
    }

    return NextResponse.json({ 
      success: true,
      totalWallets: stats.total,
      position: stats.total
    })

  } catch (error) {
    console.error('Error in Telegram API:', error)
    return NextResponse.json({ success: true }) // Always return success to Telegram
  }
}

// Command handlers
async function handleStartCommand(chatId: string | number) {
  const stats = await getWalletStats()
  const message = `🤖 *Welcome to for.meme Bot!*\n\n` +
    `I manage wallet registrations from the for.meme website.\n\n` +
    `📊 *Current Stats:*\n` +
    `• Total Wallets: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n\n` +
    `Use /help to see all available commands.`
  
  await sendTelegramMessage(chatId, message)
}

async function handleWalletsCommand(chatId: string | number) {
  const stats = await getWalletStats()
  
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
  const stats = await getWalletStats()
  
  const message = `📈 *Quick Stats*\n\n` +
    `• Total Wallets: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n` +
    `• Last 10 Registrations: ${stats.recent.length}\n\n` +
    `_Use /wallets to see all wallet addresses_`

  await sendTelegramMessage(chatId, message)
}

async function handleExportCommand(chatId: string | number) {
  const allWallets = await getAllWallets()
  
  if (allWallets.length === 0) {
    await sendTelegramMessage(chatId, 'No wallets found in database.')
    return
  }

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
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('❌ No Telegram bot token configured')
    return
  }

  try {
    const response = await fetch(
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
    
    const result = await response.json()
    console.log('📤 Sent Telegram message:', result.ok ? '✅ Success' : '❌ Failed')
    
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error)
  }
}

// Handle GET requests
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const setup = url.searchParams.get('setup')

  if (setup === 'webhook' && TELEGRAM_BOT_TOKEN) {
    const webhookUrl = `https://for-meme-wallet.vercel.app/api/telegram`
    
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
