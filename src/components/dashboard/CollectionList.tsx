import React from "react";
import { TokenCard } from "./TokenCard";

interface TokenData {
  name: string;
  symbol: string;
  marketCap: string;
  change: string;
  changeColor: string;
  backgroundColor: string;
  logoUrl: string;
  socialCount?: string;
  badges?: Array<{
    type: "trending" | "new" | "hot";
    value: string;
    color: string;
  }>;
  hasLogo?: boolean;
}

interface ImageToken {
  isImage: true;
  imageUrl: string;
  name: string;
}

interface CollectionListProps {
  title: string;
  author: string;
  authorImage: string;
  tokens: Array<TokenData | ImageToken>;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  title,
  author,
  authorImage,
  tokens,
}) => {
  return (
    <section className="relative flex w-full max-w-[680px] flex-col items-stretch p-5 rounded-2xl max-md:max-w-full">
      <header className="z-0 flex w-full items-center gap-[40px_100px] text-white justify-between flex-wrap max-md:max-w-full">
        <div className="self-stretch flex items-center gap-4 my-auto">
          <img
            src={authorImage}
            className="aspect-[1] object-contain w-12 self-stretch shrink-0 my-auto rounded-[32px]"
            alt={`${author} avatar`}
          />
          <div className="self-stretch flex flex-col items-stretch justify-center my-auto">
            <h2 className="text-2xl font-bold leading-none">{title}</h2>
            <div className="text-sm font-medium mt-1.5">{author}</div>
          </div>
        </div>
        <button className="text-sm font-medium self-stretch my-auto hover:text-gray-300 transition-colors">
          Show all
        </button>
      </header>

      <div className="overflow-x-auto z-0 flex w-full items-center gap-5 overflow-hidden mt-6 max-md:max-w-full">
        {tokens.map((token, index) =>
          "isImage" in token ? (
            <img
              key={index}
              src={token.imageUrl}
              className="aspect-[2] object-contain w-[244px] self-stretch min-w-60 my-auto rounded-xl"
              alt={`${token.name} card`}
            />
          ) : (
            <TokenCard
              key={index}
              name={token.name}
              symbol={token.symbol}
              marketCap={token.marketCap}
              change={token.change}
              changeColor={token.changeColor}
              backgroundColor={token.backgroundColor}
              logoUrl={token.logoUrl}
              socialCount={token.socialCount}
              badges={token.badges}
              hasLogo={token.hasLogo}
            />
          )
        )}
      </div>

      <button className="bg-[rgba(255,255,255,0.03)] absolute z-0 flex items-center gap-2 justify-center px-0.5 py-3 rounded-[31px] right-[5px] bottom-[58px] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/44763d0741f903306f0a78acdf7c76c331b96590?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6 self-stretch my-auto rounded-[33px]"
          alt="Next"
        />
      </button>
    </section>
  );
};
