import React from "react";
import { Link } from "react-router-dom";

interface TokenCardProps {
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
  id?: string; // Added id for linking to agent page
}

export const TokenCard: React.FC<TokenCardProps> = ({
  name,
  symbol,
  marketCap,
  change,
  changeColor,
  backgroundColor,
  logoUrl,
  socialCount,
  badges = [],
  hasLogo = true,
  id,
}) => {
  // Wrap the card in a Link if id is provided
  const CardContent = () => (
    <>
      <div className="bg-[rgba(0,0,0,0.2)] flex w-full items-stretch gap-5 justify-between pl-3 py-1">
        <div className="flex flex-col items-stretch my-auto">
          {socialCount && (
            <div className="flex items-center gap-2 text-[10px] text-white font-medium whitespace-nowrap text-center leading-none p-[3px] rounded-lg">
              <div className="self-stretch flex items-center gap-[-6px] my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/399cb0b89afa54d01d4dc5ee84a8667f0e4c93cf?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto rounded-[50%]"
                  alt="Social avatar"
                />
                <div className="self-stretch bg-[rgba(255,255,255,0.1)] gap-[-5px] my-auto px-[5px] py-px rounded-[555px]">
                  {socialCount}
                </div>
              </div>
            </div>
          )}

          <h3 className="text-white text-lg font-bold">{symbol}</h3>

          <div className="rounded flex min-h-[39px] flex-col overflow-hidden items-stretch justify-center mt-[7px]">
            <div className="text-white text-xs font-normal">Market Cap</div>
            <div className="flex gap-1 whitespace-nowrap">
              <div className="text-white text-sm font-bold">{marketCap}</div>
              <div className={`text-[${changeColor}] text-[11px] font-medium`}>
                {change}
              </div>
            </div>
          </div>
        </div>

        {hasLogo && (
          <div className="z-10 flex mr-[-23px] items-center gap-2 p-2">
            <img
              src={logoUrl}
              className="aspect-[1] object-contain w-[98px] shadow-[0px_2px_40px_rgba(0,0,0,0.25)] self-stretch my-auto rounded-[18px]"
              alt={`${name} logo`}
            />
          </div>
        )}
      </div>

      {badges.length > 0 && (
        <div className="relative">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`${badge.color} absolute z-10 flex items-center gap-0.5 overflow-hidden text-[10px] text-white font-medium whitespace-nowrap justify-center px-1 py-0.5 rounded-xl`}
              style={{
                top: index * 25 + 10,
                right: badge.type === "trending" ? 90 : 93,
              }}
            >
              <div className="bg-white self-stretch flex w-[7px] shrink-0 h-2.5 my-auto" />
              <div>{badge.value}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <article
      className={`${backgroundColor} self-stretch flex min-w-60 flex-col overflow-hidden w-[244px] my-auto rounded-xl relative ${
        id ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
    >
      {id ? (
        <Link to={`/agent/${id}`} className="block w-full h-full">
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </article>
  );
};
