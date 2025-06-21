import React, { useState } from 'react';

interface FeedPostProps {
  authorImage: string;
  authorName: string;
  timeAgo: string;
  tokenArtImage: string;
  backgroundColor: string;
  stats: {
    volume: string;
    holders: string;
    comments: string;
  };
  trades?: Array<{
    authorImage: string;
    authorName: string;
    tokenImage: string;
    tokenAmount: string;
    amount: string;
  }>;
  socialPost?: {
    content: string;
    likes: string;
    reposts: string;
    comments: string;
  };
}

const FeedPost: React.FC<FeedPostProps> = ({
  authorImage,
  authorName,
  timeAgo,
  tokenArtImage,
  backgroundColor,
  stats,
  trades,
  socialPost
}) => {
  return (
    <article className="w-full mt-20 max-md:max-w-full max-md:mt-10">
      <div className="flex w-full flex-col items-stretch justify-center px-5 max-md:max-w-full">
        <div className="relative flex w-full flex-col items-stretch justify-center max-md:max-w-full">
          <header className="z-0 flex w-full items-center gap-[40px_100px] text-white font-medium justify-between flex-wrap max-md:max-w-full">
            <div className="self-stretch flex min-w-60 items-center gap-1.5 text-sm my-auto">
              <img
                src={authorImage}
                className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
                alt={`${authorName} avatar`}
              />
              <div className="self-stretch flex items-center gap-2.5 my-auto">
                <div className="self-stretch flex items-center gap-1 my-auto">
                  <span className="self-stretch my-auto">{authorName}</span>
                </div>
              </div>
            </div>
            <div className="self-stretch flex items-center gap-2 text-[13px] whitespace-nowrap my-auto">
              <div className="self-stretch gap-2 my-auto">{timeAgo}</div>
            </div>
          </header>
          
          <div className={`${backgroundColor} z-0 flex min-h-[520px] w-full items-center gap-2 justify-center mt-6 rounded-xl max-md:max-w-full`}>
            <img
              src={tokenArtImage}
              className="aspect-[1] object-contain w-[336px] self-stretch min-w-60 my-auto rounded-[14px]"
              alt="Token art"
            />
          </div>
          
          {trades && (
            <div className="overflow-x-auto z-0 flex w-full items-center gap-4 overflow-hidden font-medium whitespace-nowrap mt-6 max-md:max-w-full">
              {trades.map((trade, index) => (
                <div key={index} className="self-stretch min-w-60 w-[267px] my-auto">
                  <div className="bg-[rgba(255,255,255,0.05)] flex w-full flex-col items-stretch justify-center p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <img
                        src={trade.authorImage}
                        className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
                        alt={`${trade.authorName} avatar`}
                      />
                      <div className="self-stretch my-auto">{trade.authorName}</div>
                    </div>
                    <div className="flex items-center gap-2 text-base text-white mt-3">
                      <span className="self-stretch my-auto">bought</span>
                      <div className="bg-[rgba(255,255,255,0.05)] self-stretch flex items-center gap-1 text-white justify-center my-auto px-2 py-1 rounded-[41px]">
                        <div className="self-stretch flex items-center gap-1.5 my-auto">
                          <img
                            src={trade.tokenImage}
                            className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto rounded-[32px]"
                            alt="Token"
                          />
                          <div className="self-stretch my-auto">{trade.tokenAmount}</div>
                        </div>
                      </div>
                      <span className="self-stretch my-auto">with</span>
                      <span className="self-stretch my-auto">{trade.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {socialPost && (
            <div className="w-full mt-6 max-md:max-w-full">
              <div className="bg-[rgba(255,255,255,0.05)] flex w-full flex-col items-stretch justify-center rounded-xl max-md:max-w-full">
                <div className="w-full max-md:max-w-full">
                  <div className="flex w-full flex-col items-stretch p-5 max-md:max-w-full">
                    <div className="flex w-full max-w-[581px] flex-col items-stretch max-md:max-w-full">
                      <div className="w-full text-base text-white font-normal mt-3 max-md:max-w-full">
                        <div className="self-stretch flex-1 shrink basis-[0%] w-full gap-2 px-0.5 max-md:max-w-full">
                          {socialPost.content}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-[40px_57px] text-sm text-white font-normal whitespace-nowrap mt-6">
                      <div className="self-stretch flex items-center gap-4 my-auto">
                        <div className="self-stretch flex items-center gap-7 my-auto">
                          <div className="self-stretch flex items-center gap-2.5 my-auto">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/360f23ab699c27be2a0d40b3357ba4fea19bef34?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                              alt="Likes"
                            />
                            <div className="self-stretch my-auto">{socialPost.likes}</div>
                          </div>
                          <div className="self-stretch flex items-center gap-2.5 my-auto">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/a99d71f47274c958e4e7793d041f7ec16297b37a?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                              alt="Reposts"
                            />
                            <div className="self-stretch my-auto">{socialPost.reposts}</div>
                          </div>
                          <div className="self-stretch flex items-center gap-2.5 my-auto">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/dca947391e49cdf4cb66092243d3aac075dada41?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                              alt="Comments"
                            />
                            <div className="self-stretch my-auto">{socialPost.comments}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="z-0 flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-6 max-md:max-w-full">
            <div className="self-stretch flex min-w-60 gap-7 text-sm text-white font-medium whitespace-nowrap my-auto">
              <div className="flex items-center gap-1.5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/bcb836c4a23b53edc6375397beb49868c76c23b3?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Volume"
                />
                <div className="self-stretch flex items-center gap-2 my-auto">
                  <div className="self-stretch my-auto">{stats.volume}</div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/6c9a23fb9c959a5cf22fcd2b35d17305f1098435?placeholderIfAbsent=true"
                    className="aspect-[2.33] object-contain w-[7px] fill-[#3BC25F] stroke-[1px] stroke-[#3BC25F] self-stretch shrink-0 my-auto"
                    alt="Up arrow"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/addb6157c14a6efc64d8f881994553add0dbebe0?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Holders"
                />
                <div className="self-stretch gap-2 my-auto">{stats.holders}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/703ec0ad9436460bc29f7ebac968644b4f3ddb1e?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
                  alt="Comments"
                />
                <div className="self-stretch gap-2 my-auto">{stats.comments}</div>
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] self-stretch flex items-center gap-2 overflow-hidden my-auto p-2 rounded-[22px]">
              <div className="self-stretch flex gap-3 my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/e81e88ee2a1b15e38fedc5ce79997d501b7711bf?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 shrink-0"
                  alt="Action 1"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/430778f52788f886f0a0c69b791f452932139c15?placeholderIfAbsent=true"
                  className="aspect-[0.94] object-contain w-4 shrink-0"
                  alt="Action 2"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/fcb6a6c5ac4bf8c4aeb2122a367f4f3e1fd58359?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 shrink-0"
                  alt="Action 3"
                />
              </div>
            </div>
          </div>
          
          <button className="bg-[rgba(255,255,255,0.03)] absolute z-0 flex items-center gap-2 justify-center px-0.5 py-3 rounded-[31px] -right-3.5 bottom-[81px] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/44763d0741f903306f0a78acdf7c76c331b96590?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch my-auto rounded-[33px]"
              alt="Next"
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export const SocialFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('For You');

  const feedPosts = [
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/bbbfd7aa4493f2c68f867520305f536473d315db?placeholderIfAbsent=true',
      authorName: 'aivan.eth + 5 others bought Clankfun',
      timeAgo: 'now',
      tokenArtImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/5c534c80a9d0166f585544e4bb1acffda94864e0?placeholderIfAbsent=true',
      backgroundColor: 'bg-[rgba(121,98,217,0.08)]',
      stats: { volume: '$450k', holders: '200k', comments: '40' },
      trades: [
        {
          authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/dd2384d7533b0559cf38ccab273edd20ac24603d?placeholderIfAbsent=true',
          authorName: '@aivan.eth',
          tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4f51c072e25705a5bf6ead798fd24f7d37bcc46c?placeholderIfAbsent=true',
          tokenAmount: '12.2M',
          amount: '$3.4K'
        },
        {
          authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/fd43b36577290edb642182317767111c65ccd3df?placeholderIfAbsent=true',
          authorName: '@annoushka.eth',
          tokenImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4f51c072e25705a5bf6ead798fd24f7d37bcc46c?placeholderIfAbsent=true',
          tokenAmount: '250k',
          amount: '$637'
        }
      ]
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f30c5024711ca640d0937525262b1d012cd2384a?placeholderIfAbsent=true',
      authorName: 'nacho • Based Fwog Is trending',
      timeAgo: '6h',
      tokenArtImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f92d38dbdd9d107f02d77c3a8d75b2a3734e2a80?placeholderIfAbsent=true',
      backgroundColor: 'bg-[rgba(0,95,252,0.08)]',
      stats: { volume: '280k', holders: '80k', comments: '1.2k' }
    },
    {
      authorImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2?placeholderIfAbsent=true',
      authorName: 'Derek created Native',
      timeAgo: '1h',
      tokenArtImage: 'https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/894342a21ac3227377b13aeb117e8490353867c1?placeholderIfAbsent=true',
      backgroundColor: 'bg-[rgba(6,78,60,0.08)]',
      stats: { volume: '$6.8m', holders: '200k', comments: '2.8k' },
      socialPost: {
        content: '@clanker please launch a token called Native with the ticker $NATIVE. It\'ll be associated with a new kind of Farcaster client I\'ve been building: a place for Casters to build a home.',
        likes: '600',
        reposts: '134',
        comments: '21'
      }
    }
  ];

  return (
    <section className="flex max-w-full w-[680px] flex-col items-stretch justify-center mt-10 rounded-2xl">
      <header className="flex w-full flex-col items-stretch text-2xl font-medium justify-center p-5 rounded-2xl max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <nav className="flex w-full items-center gap-8 border-[rgba(255,255,255,0.1)] border-b max-md:max-w-full">
            <div className="self-stretch flex min-w-60 w-full items-center gap-[18px] flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
              {['For You', 'Following'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`self-stretch gap-2.5 overflow-hidden text-white my-auto pt-2 pb-3 ${
                    activeTab === tab 
                      ? 'border-b-2 border-[rgba(255,255,255,0.5)]' 
                      : 'whitespace-nowrap px-2 py-1 rounded-[10px] hover:bg-[rgba(255,255,255,0.05)]'
                  } transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>
      
      <div className="w-full mt-6 max-md:max-w-full">
        {feedPosts.map((post, index) => (
          <FeedPost key={index} {...post} />
        ))}
      </div>
    </section>
  );
};
