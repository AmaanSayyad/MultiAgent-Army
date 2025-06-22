import React from 'react';

interface CollectionCardProps {
  title: string;
  creator: string;
  backgroundImage: string;
  logoImage: string;
  tokens: Array<{
    name: string;
    marketCap: string;
    logoUrl: string;
  }>;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  creator,
  backgroundImage,
  logoImage,
  tokens
}) => {
  return (
    <article className="bg-black relative flex min-w-60 flex-col overflow-hidden items-stretch justify-center flex-1 shrink basis-[0%] rounded-2xl">
      <img
        src={backgroundImage}
        className="aspect-[2.05] object-contain w-[828px] absolute z-0 right-[-266px] h-[1146px] bottom-0"
        alt="Background"
      />
      
      <div className="bg-[rgba(0,0,0,0.2)] z-0 w-full overflow-hidden p-6 max-md:px-5">
        <img
          src={logoImage}
          className="aspect-[1] object-contain w-12 rounded-xl"
          alt={`${title} logo`}
        />
        <div className="flex w-full flex-col justify-center mt-4">
          <h3 className="gap-2 text-2xl text-[rgba(249,249,249,1)] font-bold leading-none">
            {title}
          </h3>
          <div className="self-stretch gap-1 text-sm text-white font-medium whitespace-nowrap mt-1.5">
            {creator}
          </div>
        </div>
      </div>
      
      <div className="z-0 w-full text-sm text-white whitespace-nowrap pt-7 pb-3 px-6 rounded-[23px] max-md:px-5">
        <div className="w-full">
          {tokens.map((token, index) => (
            <div
              key={index}
              className={`flex w-full items-center gap-[40px_100px] justify-between ${index > 0 ? 'mt-3' : ''}`}
            >
              <div className="self-stretch flex gap-2.5 font-bold my-auto">
                <img
                  src={token.logoUrl}
                  className="aspect-[1] object-contain w-[21px] shrink-0 rounded-[42px]"
                  alt={`${token.name} logo`}
                />
                <div>{token.name}</div>
              </div>
              <div className="font-medium self-stretch my-auto">{token.marketCap}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="z-0 flex w-full items-center gap-[40px_100px] text-sm text-white font-medium whitespace-nowrap justify-between pt-3 pb-4 px-6 max-md:px-5">
        <div className="self-stretch flex gap-1 leading-none my-auto">
          {[1, 2, 3].map((page) => (
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
          All
        </button>
      </div>
    </article>
  );
};

export const TopListsSection: React.FC = () => {
  const collections = [
    {
      title: 'Just launched',
      creator: '@clanker',
      backgroundImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/a90351e883ba7c2811e40d7f5d35f33142bb8e34?placeholderIfAbsent=true',
      logoImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/da9cdc3930a0fca900f89c9379de35993639d1e0?placeholderIfAbsent=true',
      tokens: [
        { name: 'OPSYS', marketCap: '$230k', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/da4dc21e69f4ca0ed0e8ed0957a2fb4b96524acb?placeholderIfAbsent=true' },
        { name: 'BANKR', marketCap: '$18M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/aa3f9fdfffb3fc836664e9f7b27930b7834ca5dc?placeholderIfAbsent=true' },
        { name: 'NATIVE', marketCap: '$6.8M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/af40b2ff18eb8baeca7192ebc1eacb0b019aa8e0?placeholderIfAbsent=true' },
        { name: 'FWOG', marketCap: '$2.3M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0eeb0ac0552002a94a407d5295e3d2de9acab4f8?placeholderIfAbsent=true' },
        { name: 'CLANKFUN', marketCap: '$450k', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/3360bb8b4f359c10aca536338b251836cf899749?placeholderIfAbsent=true' }
      ]
    },
    {
      title: 'Social Rank',
      creator: '@openrank',
      backgroundImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4006dd671c760dc38c5a9734d0e0d36a8b526d43?placeholderIfAbsent=true',
      logoImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/556d9aa350bfb140d8338ed2273ff8986a878514?placeholderIfAbsent=true',
      tokens: [
        { name: 'NATIVE', marketCap: '$6.8M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/af40b2ff18eb8baeca7192ebc1eacb0b019aa8e0?placeholderIfAbsent=true' },
        { name: 'FWOG', marketCap: '$2.3M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0eeb0ac0552002a94a407d5295e3d2de9acab4f8?placeholderIfAbsent=true' },
        { name: 'CLANKFUN', marketCap: '$450k', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/3360bb8b4f359c10aca536338b251836cf899749?placeholderIfAbsent=true' },
        { name: 'OPSYS', marketCap: '$230k', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/da4dc21e69f4ca0ed0e8ed0957a2fb4b96524acb?placeholderIfAbsent=true' },
        { name: 'BANKR', marketCap: '$18M', logoUrl: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/aa3f9fdfffb3fc836664e9f7b27930b7834ca5dc?placeholderIfAbsent=true' }
      ]
    }
  ];

  return (
    <section className="w-full max-w-[680px] mt-10 p-5 rounded-2xl max-md:max-w-full">
      <header className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap max-md:max-w-full">
        <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
          <h2 className="text-[rgba(249,249,249,1)] text-2xl font-bold leading-none">
            Top Lists
          </h2>
          <div className="self-stretch gap-1 text-sm text-white font-normal mt-1.5">
            Curated by Clanker Studiio
          </div>
        </div>
        <button className="text-white text-sm font-medium self-stretch my-auto hover:text-gray-300 transition-colors">
          Show all
        </button>
      </header>
      
      <div className="flex w-full gap-5 flex-wrap mt-6 max-md:max-w-full">
        {collections.map((collection, index) => (
          <CollectionCard key={index} {...collection} />
        ))}
      </div>
    </section>
  );
};
