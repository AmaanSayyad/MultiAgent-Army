import React, { useState } from "react";

export const WidgetSidebar: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState("0.0");
  const [activeSwapTab, setActiveSwapTab] = useState("Buy");

  return (
    <aside className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
      <div className="h-[747px] mt-4 pt-3 px-3 rounded-[20px] max-md:mt-10">
        <div className="w-full">
          {/* New Trade Widget */}
          <div className="bg-[rgba(255,255,255,0.05)] flex w-full items-center text-sm whitespace-nowrap p-5 rounded-2xl">
            <div className="self-stretch flex min-w-60 w-full items-center gap-[40px_81px] justify-between flex-1 shrink basis-[0%] my-auto">
              <div className="self-stretch flex items-center gap-1.5 text-white font-medium my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
                  alt="Derek avatar"
                />
                <div className="self-stretch my-auto">@derek</div>
              </div>
              <div className="self-stretch flex items-center gap-1.5 text-white font-bold my-auto">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/62dc1643bcc55c1a54b975bdbd59d22356686703?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt="Token icon"
                />
                <div className="self-stretch my-auto">60k</div>
                <div className="self-stretch my-auto">TINY</div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5ecfaa1c07bb293c5eb608249595329da9655d2?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-[22px] self-stretch shrink-0 my-auto rounded-[50%]"
                  alt="Profile"
                />
              </div>
            </div>
          </div>

          {/* Protocol Stats Widget */}
          <div className="w-full text-white mt-6">
            <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden rounded-[20px]">
              <div className="flex w-full gap-2 font-medium px-5 py-3">
                <div className="flex min-w-60 w-full items-center gap-[40px_100px] justify-between flex-1 shrink basis-[0%]">
                  <div className="self-stretch flex items-center gap-1 text-xs my-auto">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/af3aea063d4a8db94b7e134e505fc1cbde33f196?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
                      alt="Stats icon"
                    />
                    <div className="self-stretch my-auto">Protocol Stats</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.08)] self-stretch flex items-center gap-2 text-[13px] whitespace-nowrap my-auto px-2 py-0.5 rounded-lg">
                    <div className="self-stretch gap-1.5 my-auto">24h</div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/37e91cbc0ce7bed1ccf781f6a1bf49f89809e01d?placeholderIfAbsent=true"
                      className="aspect-[2] object-contain w-2 self-stretch shrink-0 my-auto"
                      alt="Dropdown"
                    />
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center overflow-hidden pb-5 px-5 rounded-[21px]">
                <div className="self-stretch flex flex-col items-stretch justify-center flex-1 shrink basis-[0%] my-auto">
                  <div className="flex items-center gap-2 text-base font-bold whitespace-nowrap">
                    <div className="self-stretch my-auto">$3.2B</div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0ea83ce2a7c566ebc135eec14dfda4853a248996?placeholderIfAbsent=true"
                      className="aspect-[2.33] object-contain w-[7px] fill-[#3BC25F] stroke-[1px] stroke-[#3BC25F] self-stretch shrink-0 my-auto"
                      alt="Up arrow"
                    />
                  </div>
                  <div className="text-xs font-medium">Market Cap</div>
                </div>

                <div className="self-stretch flex flex-col items-center whitespace-nowrap justify-center w-[105px] my-auto border-[rgba(255,255,255,0.03)] border-r border-l">
                  <div className="self-stretch gap-2 text-base font-bold">
                    $2.4m
                  </div>
                  <div className="text-xs font-medium">Volume</div>
                </div>

                <div className="self-stretch flex flex-col whitespace-nowrap justify-center flex-1 shrink basis-[0%] my-auto">
                  <div className="flex items-center gap-2 text-base font-bold">
                    <div className="self-stretch my-auto">350k</div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0ea83ce2a7c566ebc135eec14dfda4853a248996?placeholderIfAbsent=true"
                      className="aspect-[2.33] object-contain w-[7px] fill-[#3BC25F] stroke-[1px] stroke-[#3BC25F] self-stretch shrink-0 my-auto"
                      alt="Up arrow"
                    />
                  </div>
                  <div className="text-xs font-medium">Rewards</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily List Widget */}
          <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden text-white mt-6 rounded-[20px]">
            <div className="flex w-full flex-col justify-center px-[21px] py-7 rounded-2xl max-md:px-5">
              <div className="flex items-center gap-2">
                <div className="self-stretch flex w-full flex-col items-stretch flex-1 shrink basis-[0%] my-auto">
                  <div className="flex items-center gap-1 text-xs font-medium capitalize leading-loose">
                    <div className="text-white text-ellipsis opacity-40 self-stretch my-auto">
                      Daily List
                    </div>
                  </div>
                  <div className="text-white text-lg font-bold leading-none tracking-[-0.3px] opacity-90 mt-[11px]">
                    420 New Tokens
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Status Widget */}
          <div className="w-full mt-6">
            <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden rounded-[20px]">
              <div className="flex w-full items-center gap-2 text-xs text-white font-medium px-5 py-3.5">
                <div className="self-stretch flex items-center gap-1 my-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="self-stretch my-auto">Deployment Status</div>
                </div>
              </div>

              {/* Deployment Status Items */}
              <div className="px-5 pb-4">
                {[
                  {
                    name: "FEEN",
                    symbol: "$FEEN",
                    progress: 37.41,
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2",
                    timeRemaining: "14d",
                  },
                  {
                    name: "GovBot",
                    symbol: "$GOVBOT",
                    progress: 0.41,
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/62dc1643bcc55c1a54b975bdbd59d22356686703",
                    timeRemaining: "57d",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={`${item.name} logo`}
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-white text-sm font-medium">
                            {item.name}
                          </h3>
                          <span className="text-gray-400 text-xs">
                            {item.symbol}
                          </span>
                        </div>
                        <div className="w-full bg-[rgba(255,255,255,0.1)] h-1 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-green-500 h-full rounded-full"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-400 text-xs">
                            Unlocking in {item.timeRemaining}
                          </span>
                          <span className="text-white text-xs">
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Get Started Widget */}
          <div className="w-full mt-6">
            <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden rounded-[20px]">
              <div className="flex w-full items-center gap-2 text-xs text-white font-medium px-5 py-3.5">
                <div className="self-stretch flex items-center gap-1 my-auto">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/97f21697478593c65d200f68c1444604874549de?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
                    alt="Get started icon"
                  />
                  <div className="self-stretch my-auto">Get Started</div>
                </div>
              </div>

              <div className="flex w-full items-center gap-3 pb-3 px-5 rounded-[21px]">
                <div className="self-stretch flex items-center gap-3 my-auto">
                  <div className="self-stretch flex min-h-[38px] items-center gap-[-18px] justify-center w-9 my-auto p-3 rounded-xl">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f07023dee5a9ba60738712144b9874baf7b99f0a?placeholderIfAbsent=true"
                      className="aspect-[0.86] object-contain w-3 self-stretch my-auto"
                      alt="Step 1"
                    />
                  </div>
                  <div className="self-stretch flex flex-col items-stretch leading-none justify-center my-auto">
                    <div className="text-white text-sm font-bold">
                      Set up QuickBuy
                    </div>
                    <div className="text-white text-xs font-medium mt-1">
                      Instant transactions wallet
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-3 overflow-hidden pt-3 pb-5 px-5 rounded-[21px]">
                <div className="self-stretch flex min-w-60 items-center gap-3 my-auto">
                  <div className="self-stretch flex min-h-[38px] items-center gap-[-18px] justify-center w-9 my-auto px-2 py-[9px] rounded-xl">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/bf1b78c5a1a95b7cb92b3f253bb3c54dc2653eb2?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-5 self-stretch my-auto"
                      alt="Step 2"
                    />
                  </div>
                  <div className="self-stretch flex flex-col items-stretch leading-none justify-center my-auto">
                    <div className="text-white text-sm font-bold">
                      Bridge to Base
                    </div>
                    <div className="text-white text-xs font-medium mt-1">
                      Bridge to Base to start buying clankers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Widget */}
          <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden whitespace-nowrap mt-6 rounded-[20px]">
            <div className="bg-[rgba(255,255,255,0)] w-full">
              <div className="bg-[rgba(255,255,255,0)] flex w-full items-center gap-2 text-sm text-white pt-3 pb-2 px-5">
                <div className="self-stretch flex min-w-60 w-full items-center gap-[40px_100px] justify-between flex-1 shrink basis-[0%] my-auto">
                  <div className="self-stretch flex items-center gap-2.5 justify-center my-auto py-1 rounded-[41px]">
                    {["Buy", "Sell"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSwapTab(tab)}
                        className={`self-stretch gap-1 my-auto ${
                          activeSwapTab === tab
                            ? "font-bold"
                            : "font-medium hover:text-gray-300"
                        } transition-colors`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button className="self-stretch font-bold my-auto hover:text-gray-300 transition-colors">
                    <div className="flex items-center gap-2 justify-center px-2 py-1 rounded-[41px]">
                      <div className="self-stretch flex items-center gap-1.5 my-auto">
                        <div className="bg-white self-stretch flex w-[13px] shrink-0 h-[13px] my-auto rounded-[32px]" />
                        <div className="self-stretch my-auto">Select</div>
                      </div>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f524371e60b83ebd728bcd4ed600dc334ac3d62a?placeholderIfAbsent=true"
                        className="aspect-[1.6] object-contain w-2 self-stretch shrink-0 my-auto"
                        alt="Dropdown"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div className="w-full pt-1 pb-4 px-3">
                <div className="bg-[rgba(255,255,255,0.02)] border w-full overflow-hidden rounded-2xl border-[rgba(255,255,255,0.02)] border-solid">
                  <div className="flex w-full flex-col items-stretch text-white justify-center px-5 py-4">
                    <div className="flex min-h-[35px] w-full items-center gap-[40px_100px] overflow-hidden justify-between rounded-xl">
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="0.0"
                        className="self-stretch text-lg font-bold my-auto bg-transparent border-none outline-none"
                      />
                      <button className="self-stretch flex items-center gap-1 text-sm font-medium my-auto hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        <div className="self-stretch flex items-center gap-2 justify-center my-auto px-2 py-1.5 rounded-[54px]">
                          <div className="self-stretch flex items-center gap-1.5 my-auto">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/fc09ac6167b717541d203d4665c375fea02d6b0f?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto rounded-[69px]"
                              alt="ETH"
                            />
                            <div className="self-stretch my-auto">ETH</div>
                          </div>
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/90f6fd49a4d807349aaf8f20b4b501c354aac4dd?placeholderIfAbsent=true"
                            className="aspect-[1.6] object-contain w-2 self-stretch shrink-0 my-auto"
                            alt="Dropdown"
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="w-full text-xs font-medium pb-3.5 px-5">
                    <div className="flex w-full items-center gap-10 justify-between">
                      <div className="self-stretch flex items-center gap-2.5 text-white my-auto">
                        {["10%", "25%", "50%", "Max"].map((percentage) => (
                          <button
                            key={percentage}
                            className="self-stretch gap-1.5 my-auto py-0.5 rounded-[32px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                          >
                            {percentage}
                          </button>
                        ))}
                      </div>
                      <div className="self-stretch flex items-center gap-1 text-white justify-center my-auto">
                        <span className="self-stretch my-auto">Available</span>
                        <span className="self-stretch my-auto">0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Widget */}
          <div className="bg-[rgba(255,255,255,0.05)] w-full overflow-hidden text-xs text-white font-medium whitespace-nowrap mt-6 rounded-[20px]">
            <div className="flex w-full items-center p-5 rounded-[21px]">
              <div className="self-stretch flex min-w-60 w-full items-center gap-[21px] justify-between flex-1 shrink basis-[0%] my-auto">
                {[
                  {
                    name: "CLANK...",
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/8842f52ff5eb74fac0ae4a274e88b5d070e3dfdb?placeholderIfAbsent=true",
                  },
                  {
                    name: "OPSYS",
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/37e595d2cba96c70bbca77c3978460b61956a9f3?placeholderIfAbsent=true",
                  },
                  {
                    name: "BANKR",
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c441318a2aa374fb6748b2f32169a80a04dae56a?placeholderIfAbsent=true",
                  },
                  {
                    name: "FWOG",
                    image:
                      "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0c82a7db6a49e5d91236b6779fad677c06992157?placeholderIfAbsent=true",
                  },
                ].map((token, index) => (
                  <button
                    key={index}
                    className="self-stretch flex flex-col items-center w-[53px] my-auto hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={token.image}
                      className="aspect-[1] object-contain w-[53px] rounded-[13px]"
                      alt={`${token.name} logo`}
                    />
                    <div className="mt-2">{token.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
