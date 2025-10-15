'use client'
import { useState, FormEvent } from 'react'
import { WalletFormProps, ApiResponse } from '../types'

export default function WalletForm({ onSubmission }: WalletFormProps) {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!walletAddress.trim()) {
      alert('Please enter a valid wallet address')
      return
    }

    // Enhanced wallet address validation
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum wallet address (starts with 0x, 42 characters total)')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress,
          timestamp: new Date().toISOString(),
          source: 'for.meme'
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        onSubmission(true)
        setWalletAddress('')
      } else {
        throw new Error(data.error || 'Failed to submit wallet address')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit wallet address. Please try again.')
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

      {/* Quick info */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Supported: Ethereum, Polygon, BSC
        </p>
      </div>
    </form>
  )
}
