import React, { useState } from 'react';

interface TradeCardProps {
  authorImage: string;
  authorName: string;
  tokenImage: string;
  tokenName: string;
  amount: string;
}

const TradeCard: React.FC<TradeCardProps> = ({
  authorImage,
  authorName,
  tokenImage,
  tokenName,
  amount
}) => {
  return (
    <article className="self-stretch min-w-60 flex-1 shrink basis-[0%] my-auto">
      <div className="bg-[rgba(255,255,255,0.05)] flex w-full flex-col justify-center p-4 rounded-xl hover:bg-[rgba(255,255,255,0.07)] transition-colors">
        <div className="flex items-center gap-2 text-sm text-white">
          <img
            src={authorImage}
            className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
            alt={`${authorName} avatar`}
          />
          <div className="self-stretch my-auto">{authorName}</div>
        </div>
        <div className="flex items-center gap-2 text-base text-white mt-3">
          <span className="self-stretch my-auto">bought</span>
          <div className="bg-[rgba(255,255,255,0.05)] self-stretch flex items-center gap-1 text-white justify-center my-auto px-2 py-1 rounded-[41px]">
            <div className="self-stretch flex items-center gap-1.5 my-auto">
              <img
                src={tokenImage}
                className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto rounded-[32px]"
                alt={`${tokenName} logo`}
              />
              <div className="self-stretch my-auto">{tokenName}</div>
            </div>
          </div>
          <span className="self-stretch my-auto">with</span>
          <span className="self-stretch my-auto">{amount}</span>
        </div>
      </div>
    </article>
  );
};

export const TradesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Notable Buys');

  const trades = [
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/bbbfd7aa4493f2c68f867520305f536473d315db?placeholderIfAbsent=true',
      authorName: '@aivan.eth',
      tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/a69c24dcd579b99e6f4eae77e0b1b85f6bfb8953?placeholderIfAbsent=true',
      tokenName: 'CLANKVTX',
      amount: '$1.2k'
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/931eaef9441dba2479d86da1861f256453ad6660?placeholderIfAbsent=true',
      authorName: '@annoushka.eth',
      tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/79a72afa4df712d015dc3ef3fa31c03841a38c1f?placeholderIfAbsent=true',
      tokenName: 'CLANKER',
      amount: '$429'
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4d044e255bfe82030bc56532319134c2375d2bbf?placeholderIfAbsent=true',
      authorName: '@jessepollak',
      tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/1ccbab8a852507eec375b10152e8aa04a6fbfdaf?placeholderIfAbsent=true',
      tokenName: 'TINY',
      amount: '$12.4K'
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/9cc4e7cd7355bfc40cbc5418be8e3c09960c149d?placeholderIfAbsent=true',
      authorName: '@xprto.eth',
      tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/735d347691ddae16f7259a8601f07cb69b2c5792?placeholderIfAbsent=true',
      tokenName: 'MOAR',
      amount: '$12.4K'
    }
  ];

  return (
    <section className="flex w-full max-w-[680px] flex-col items-stretch justify-center mt-10 rounded-2xl max-md:max-w-full">
      <header className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap p-5 rounded-2xl max-md:max-w-full">
        <nav className="self-stretch flex min-w-60 items-stretch gap-1.5 text-2xl my-auto">
          {['Notable Buys', 'Big Wins'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`self-stretch gap-2.5 h-full pr-2 py-1 ${
                activeTab === tab 
                  ? 'text-white font-bold' 
                  : 'gap-2 overflow-hidden text-white font-medium px-2 py-1 rounded-[10px] hover:bg-[rgba(255,255,255,0.05)]'
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button className="text-white text-sm font-medium self-stretch my-auto hover:text-gray-300 transition-colors">
          All trades
        </button>
      </header>
      
      <div className="w-full font-medium whitespace-nowrap mt-3 max-md:max-w-full">
        <div className="flex w-full flex-col items-stretch justify-center px-5 max-md:max-w-full">
          <div className="flex w-full items-center gap-4 flex-wrap max-md:max-w-full">
            {trades.slice(0, 2).map((trade, index) => (
              <TradeCard key={index} {...trade} />
            ))}
          </div>
        </div>
        
        <div className="flex w-full flex-col items-stretch justify-center mt-5 px-5 max-md:max-w-full">
          <div className="flex w-full items-center gap-5 flex-wrap max-md:max-w-full">
            {trades.slice(2).map((trade, index) => (
              <TradeCard key={index + 2} {...trade} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
