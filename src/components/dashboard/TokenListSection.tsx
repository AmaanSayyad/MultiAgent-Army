import React, { useState } from 'react';

interface TokenRowProps {
  name: string;
  symbol: string;
  contractAddress: string;
  imageUrl: string;
  marketCap: string;
  change: string;
  changeColor: string;
  volume: string;
  creatorImage: string;
  badge?: { type: 'trending' | 'new'; value: string; color: string };
}

const TokenRow: React.FC<TokenRowProps> = ({
  name,
  symbol,
  contractAddress,
  imageUrl,
  marketCap,
  change,
  changeColor,
  volume,
  creatorImage,
  badge
}) => {
  return (
    <div className="flex w-full items-center gap-5 justify-between mt-2 px-5 py-3 max-md:max-w-full hover:bg-[rgba(255,255,255,0.02)] transition-colors">
      <div className="self-stretch flex items-stretch gap-[18px]">
        <div className="flex flex-col items-stretch">
          <div className="flex items-center">
            <div className="self-stretch flex min-h-[54px] w-[54px] items-stretch gap-2 overflow-hidden my-auto rounded-[10px]">
              <img
                src={imageUrl}
                className="aspect-[1] object-contain w-full flex-1 shrink basis-[0%]"
                alt={`${name} logo`}
              />
            </div>
          </div>
          {badge && (
            <div className={`${badge.color} self-center z-10 flex items-center gap-0.5 overflow-hidden text-[10px] text-white font-medium whitespace-nowrap justify-center -mt-2.5 px-1 py-0.5 rounded-xl`}>
              <img
                src={badge.type === 'trending' ? "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/74967ab94e8ca154b19e3782df3f0300106b6fef?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f3a1f5f40e7283913efe6c4b93d1fb3b1890fee0?placeholderIfAbsent=true"}
                className="aspect-[0.8] object-contain w-2 self-stretch shrink-0 my-auto"
                alt={badge.type}
              />
              <div>{badge.value}</div>
            </div>
          )}
        </div>
        <div className="whitespace-nowrap my-auto">
          <div className="self-stretch gap-1.5 text-base text-white font-bold">{symbol}</div>
          <div className="self-stretch gap-1 text-sm text-white font-normal">{contractAddress}</div>
        </div>
      </div>
      
      <div className="self-stretch min-h-[19px] gap-1.5 text-sm text-white font-bold whitespace-nowrap my-auto">
        {marketCap}
      </div>
      
      <div className="self-stretch flex items-center gap-[39px] my-auto">
        <div className="self-stretch flex items-center gap-1 text-sm font-medium whitespace-nowrap my-auto" style={{ color: changeColor }}>
          <img
            src={changeColor === '#3BC25F' ? "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/9116c42911b12eaacc2fb0790e9c7aae3d85b022?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/9b3ec38c00f9b9f2b312011b03cae238acaee58e?placeholderIfAbsent=true"}
            className="aspect-[2.33] object-contain w-[7px] self-stretch shrink-0 my-auto"
            alt="Change indicator"
          />
          <div>{change}</div>
        </div>
        <div className="text-white text-sm font-bold self-stretch my-auto">{volume}</div>
        <div className="self-stretch flex items-center gap-2 p-1 rounded-2xl">
          <div className="self-stretch flex w-[49px] items-center gap-2 my-auto p-[3px] rounded-lg">
            <img
              src={creatorImage}
              className="aspect-[2.39] object-contain w-[43px] self-stretch gap-[-6px] my-auto"
              alt="Creator"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TokenListSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [activeTimeTab, setActiveTimeTab] = useState('24h');

  const tokens = [
    {
      name: 'NATIVE',
      symbol: '$NATIVE',
      contractAddress: '0x3...DD0',
      imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/d6de21ecfb2930e5ca6a99c24c6c93d89cda9d95?placeholderIfAbsent=true',
      marketCap: '$6.8M',
      change: '10%',
      changeColor: '#3BC25F',
      volume: '$20k',
      creatorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/64c2c41bfd7b8dd45c0f5456c6fc9ba664c77f33?placeholderIfAbsent=true'
    },
    {
      name: 'FWOG',
      symbol: '$FWOG',
      contractAddress: '0x3...DD0',
      imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/19230d600d3a519c52c493efe6a0a1b4171e769f?placeholderIfAbsent=true',
      marketCap: '$2.3M',
      change: '4%',
      changeColor: '#3BC25F',
      volume: '$19k',
      creatorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/bada6fe5ee002e3b487241571cc9014f68fb761f?placeholderIfAbsent=true',
      badge: { type: 'new' as const, value: '12h', color: 'bg-[rgba(76,186,105,0.4)]' }
    },
    {
      name: 'CLANKFUN',
      symbol: '$CLANKFUN',
      contractAddress: '0x3...DD0',
      imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4578e72c5b75393c35c660d4cbd68a5413a4769b?placeholderIfAbsent=true',
      marketCap: '$450k',
      change: '8%',
      changeColor: '#3BC25F',
      volume: '$80k',
      creatorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/a3da2cdf6b765f663db1bc0fbff34fff19ac9b4a?placeholderIfAbsent=true'
    },
    {
      name: 'OPSYS',
      symbol: '$OPSYS',
      contractAddress: '0x3...DD0',
      imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/30b3506a362fe81912c95419b8c26ac7e24cf519?placeholderIfAbsent=true',
      marketCap: '$230k',
      change: '2%',
      changeColor: 'rgba(239,102,102,1)',
      volume: '$20k',
      creatorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/cc7667baa0eeb206c995daedba70ab33d0904983?placeholderIfAbsent=true',
      badge: { type: 'trending' as const, value: '275', color: 'bg-[rgba(249,108,36,0.3)]' }
    },
    {
      name: 'BANKR',
      symbol: '$BANKR',
      contractAddress: '0x3...DD0',
      imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/cc7bbb5145aa3b101e38256a8ea579f48b688ee4?placeholderIfAbsent=true',
      marketCap: '$18M',
      change: '11%',
      changeColor: '#3BC25F',
      volume: '$1.4M',
      creatorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4a2586a600b6419eaf7002afec8e936f43c64cc2?placeholderIfAbsent=true'
    }
  ];

  return (
    <section className="flex w-full max-w-[680px] flex-col items-stretch justify-center mt-10 rounded-2xl max-md:max-w-full">
      <header className="flex w-full items-center text-white font-medium whitespace-nowrap justify-between p-5 rounded-2xl max-md:max-w-full">
        <div className="self-stretch flex min-w-60 w-full items-center gap-[40px_100px] justify-between flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
          <nav className="self-stretch flex items-center gap-8 text-2xl my-auto">
            <div className="self-stretch flex items-center gap-1.5 my-auto">
              {['Trending', 'Top', 'New'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`self-stretch gap-2.5 h-full pr-2 py-1 ${
                    activeTab === tab 
                      ? 'text-white font-bold' 
                      : 'gap-2 overflow-hidden px-2 py-1 rounded-[10px] hover:bg-[rgba(255,255,255,0.05)]'
                  } transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
          
          <div className="self-stretch flex items-center gap-3 text-sm my-auto">
            <div className="self-stretch flex items-center gap-2 my-auto">
              <div className="bg-[rgba(255,255,255,0.05)] self-stretch flex overflow-hidden my-auto px-[3px] py-1 rounded-[14px]">
                {['1h', '6h', '24h', '7d'].map((timeTab) => (
                  <button
                    key={timeTab}
                    onClick={() => setActiveTimeTab(timeTab)}
                    className={`self-stretch gap-2 overflow-hidden px-3 py-1.5 rounded-[10px] ${
                      activeTimeTab === timeTab 
                        ? 'bg-[rgba(255,255,255,0.05)] text-white font-bold w-[54px] rounded-xl' 
                        : 'hover:bg-[rgba(255,255,255,0.03)]'
                    } transition-colors`}
                  >
                    {timeTab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex w-full flex-col items-stretch justify-center mt-3 max-md:max-w-full">
        <div className="w-full rounded-2xl max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <div className="flex w-full items-stretch gap-5 flex-wrap justify-between px-[23px] py-2.5 max-md:max-w-full max-md:pr-5">
              <div className="text-white text-[13px] font-medium">Token</div>
              <div className="flex items-stretch gap-[40px_73px]">
                <div className="text-white text-[13px] font-medium">Market Cap</div>
                <div className="flex items-stretch gap-[37px]">
                  <div className="text-white text-[13px] font-medium">24h %</div>
                  <div className="text-white text-[13px] font-medium">24h Vol.</div>
                  <div className="flex items-center gap-[5px]">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/942553332f6388ff39b3c805b4286ad56f3e5351?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-4 self-stretch my-auto"
                      alt="Sort"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {tokens.map((token, index) => (
              <TokenRow key={index} {...token} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex w-full items-center gap-[40px_100px] text-sm text-white font-medium justify-between flex-wrap mt-3 px-5 py-2.5 rounded-2xl max-md:max-w-full">
        <div className="self-stretch flex gap-1 whitespace-nowrap leading-none my-auto">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className={`overflow-hidden p-1 ${
                page === 1 
                  ? 'rounded bg-[rgba(255,255,255,0.07)]' 
                  : 'rounded-[3px] hover:bg-[rgba(255,255,255,0.05)]'
              } transition-colors`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className="self-stretch my-auto hover:text-gray-300 transition-colors">
          Browse All
        </button>
      </div>
    </section>
  );
};
