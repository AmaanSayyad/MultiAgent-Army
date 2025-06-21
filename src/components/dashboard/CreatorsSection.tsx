import React, { useState } from 'react';

interface CreatorCardProps {
  authorImage: string;
  authorName: string;
  earnings: string;
  tokens: Array<{
    name: string;
    imageUrl: string;
  }>;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  authorImage,
  authorName,
  earnings,
  tokens
}) => {
  return (
    <article className="self-stretch min-w-60 flex-1 shrink basis-[0%] my-auto">
      <div className="bg-[rgba(255,255,255,0.05)] flex w-full flex-col justify-center p-4 rounded-xl hover:bg-[rgba(255,255,255,0.07)] transition-colors">
        <div className="flex items-center gap-2 text-sm text-white font-medium whitespace-nowrap">
          <img
            src={authorImage}
            className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
            alt={`${authorName} avatar`}
          />
          <div className="self-stretch my-auto">{authorName}</div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <div className="text-white text-base font-medium self-stretch my-auto">earned</div>
          <div className="text-white text-base font-medium self-stretch my-auto">{earnings}</div>
          <div className="text-white text-base font-medium self-stretch my-auto">in rewards</div>
          <div className="self-stretch flex items-center gap-2 my-auto">
            <div className="self-stretch flex min-h-5 gap-2 my-auto py-2" />
          </div>
          <div className="text-white text-base font-medium self-stretch my-auto">24h</div>
        </div>
        
        <div className="flex w-full max-w-[260px] items-center gap-2 text-xs text-white font-medium whitespace-nowrap mt-3">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="bg-[rgba(255,255,255,0.05)] self-stretch flex items-center gap-1 justify-center my-auto px-1.5 py-1 rounded-[41px]"
            >
              <div className="self-stretch flex items-center gap-1.5 my-auto">
                <img
                  src={token.imageUrl}
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto rounded-[32px]"
                  alt={`${token.name} logo`}
                />
                <div className="self-stretch my-auto">{token.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export const CreatorsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Top Creators');

  const creators = [
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2?placeholderIfAbsent=true',
      authorName: '@derek',
      earnings: '$1.4k',
      tokens: [
        { name: 'NATIVE', imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/dd90c3b2efb3327ba7e72f62799ea23b014d097a?placeholderIfAbsent=true' },
        { name: 'PANES', imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/2650ee6434b624871cd8b460d815b0c777780f0c?placeholderIfAbsent=true' },
        { name: 'BALLOON', imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/089aedc635b3714c86e5f103ba52903deaefcc85?placeholderIfAbsent=true' }
      ]
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/cc0960cf05e3ca7c0fa10fe64442577662f45f05?placeholderIfAbsent=true',
      authorName: '@nt',
      earnings: '$0.4k',
      tokens: [
        { name: 'CLANKFUN', imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/35ac9cc9bcf2706da7caa8d9014286f26bec92be?placeholderIfAbsent=true' }
      ]
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/050f40c0511677ec3485a46eb821c84c8f7e1fca?placeholderIfAbsent=true',
      authorName: '@bankr',
      earnings: '$0.2k',
      tokens: [
        { name: 'BANKR', imageUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/98c4a65500152fb150c06105d9b9ffbc6c3ff1be?placeholderIfAbsent=true' }
      ]
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/6fb6d064fb317ab7b8594f11c0667fb67e542803?placeholderIfAbsent=true',
      authorName: '0xb1...e4f9',
      earnings: '$0.1k',
      tokens: [
        { name: 'DRB', imageUrl: '' }
      ]
    }
  ];

  return (
    <section className="flex w-full max-w-[680px] flex-col items-stretch justify-center mt-10 rounded-2xl max-md:max-w-full">
      <header className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap p-5 rounded-2xl max-md:max-w-full">
        <nav className="self-stretch flex min-w-60 items-stretch gap-1.5 text-2xl my-auto">
          {['Top Creators', 'Rising'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`self-stretch gap-2.5 h-full pr-2 py-1 ${
                activeTab === tab 
                  ? 'text-white font-bold' 
                  : 'gap-2 overflow-hidden text-white font-medium whitespace-nowrap px-2 py-1 rounded-[10px] hover:bg-[rgba(255,255,255,0.05)]'
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button className="text-white text-sm font-medium self-stretch my-auto hover:text-gray-300 transition-colors">
          All creators
        </button>
      </header>
      
      <div className="w-full mt-3 max-md:max-w-full">
        <div className="flex w-full flex-col items-stretch justify-center px-5 max-md:max-w-full">
          <div className="flex w-full items-center gap-4 flex-wrap max-md:max-w-full">
            {creators.slice(0, 2).map((creator, index) => (
              <CreatorCard key={index} {...creator} />
            ))}
          </div>
          
          <div className="flex w-full items-center gap-4 flex-wrap mt-5 max-md:max-w-full">
            {creators.slice(2).map((creator, index) => (
              <CreatorCard key={index + 2} {...creator} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
