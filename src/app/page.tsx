'use client'
import { useState } from 'react'
import WalletForm from '../components/WalletForm'

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center pt-20 pb-16">
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter">
            for.meme
          </h1>
          <div className="flex justify-center space-x-3 mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-12">
                  <p className="text-2xl text-gray-300 mb-3 uppercase tracking-widest">Create Token</p>
                  <p className="text-sm text-gray-500 mb-8">Enter your wallet address to participate</p>
                  
                  {/* Stats row */}
                  <div className="flex justify-between text-xs text-gray-400 mb-8">
                    <div>
                      <div className="text-white font-semibold">1,234</div>
                      <div>Total Wallets</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">24H</div>
                      <div>Active</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">$MEME</div>
                      <div>Token</div>
                    </div>
                  </div>
                </div>
                
                <WalletForm onSubmission={setIsSubmitted} />
                
                {/* Additional info */}
                <div className="text-center mt-12 space-y-4">
                  <div className="text-xs text-gray-500">
                    <p>By connecting your wallet, you agree to our Terms</p>
                    <p>and acknowledge our Privacy Policy</p>
                  </div>
                  
                  <div className="flex justify-center space-x-6 text-xs text-gray-400">
                    <button className="hover:text-white transition-colors">Twitter</button>
                    <button className="hover:text-white transition-colors">Telegram</button>
                    <button className="hover:text-white transition-colors">Chart</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold mb-4">You're On The List!</h2>
                <p className="text-gray-400 mb-2">Welcome to the meme revolution</p>
                <p className="text-sm text-gray-500 mb-8">Your wallet has been registered successfully</p>
                
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <div className="text-xs text-gray-400 mb-2">Your Position</div>
                  <div className="text-2xl font-bold">#1,235</div>
                </div>
                
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Register another wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="text-xs text-gray-500 space-y-1">
            <p>for.meme © 2024 • The future of memes is here</p>
            <p>Built with ❤️ for the meme community</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
