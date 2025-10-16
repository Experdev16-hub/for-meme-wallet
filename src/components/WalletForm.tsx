'use client'
import { useState, FormEvent } from 'react'

interface WalletFormProps {
  onSubmission: (submitted: boolean) => void;
}

export default function WalletForm({ onSubmission }: WalletFormProps) {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔄 Form submitted')
    console.log('📝 Wallet address:', walletAddress)

    if (!walletAddress.trim()) {
      alert('Please enter your wallet address')
      return
    }

    // Basic validation - just check it starts with 0x and has some length
    if (!walletAddress.startsWith('0x') || walletAddress.length < 10) {
      alert('Please enter a valid wallet address')
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Sending to API...')
      
      const payload = {
        walletAddress: walletAddress
      }
      
      console.log('📦 Payload:', payload)

      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📨 Response status:', response.status)
      
      const data = await response.json()
      console.log('📊 Response data:', data)

      if (response.ok) {
        console.log('✅ Success - calling onSubmission')
        onSubmission(true)
        setWalletAddress('')
      } else {
        throw new Error(data.error || 'Failed to submit wallet address')
      }
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Failed to submit wallet address. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter your wallet address (0x...)"
          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-center focus:outline-none focus:border-white/30 transition-all duration-300 text-base font-mono"
          disabled={isLoading}
          style={{ 
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !walletAddress.trim()}
        className="w-full bg-white text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-base uppercase tracking-wider relative overflow-hidden group"
      >
        <span className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3"></div>
              Processing...
            </div>
          ) : (
            'Register Wallet'
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Supported: Ethereum, Polygon, BSC
        </p>
      </div>
    </form>
  )
}
