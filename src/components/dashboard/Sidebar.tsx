import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="flex min-h-[982px] items-stretch gap-2 px-5 py-[30px]">
      <nav className="flex w-[72px] flex-col overflow-hidden items-center justify-between px-1 py-[3px] rounded-[21px] max-md:hidden">
        <div className="bg-[rgba(115,94,181,1)] flex w-10 items-center gap-2 overflow-hidden h-10 p-[11px] rounded-xl">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/d5bbdd6c297037a5322d74c10e77d81d1064d24b?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
            alt="Logo"
          />
        </div>

        <div className="flex w-14 items-center gap-2 overflow-hidden mt-[278px] px-3 py-3.5 rounded-[17px] max-md:mt-10">
          <div className="self-stretch flex w-8 flex-col items-stretch justify-center my-auto">
            <div className="self-center w-full max-w-8">
              <a
                href="/"
                className="flex w-full items-center gap-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-1 transition-colors"
              >
                <div className="self-stretch flex min-h-8 w-8 items-center gap-2 justify-center my-auto rounded-[34px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/4601c882fe86d6e6af4cb4d2b3e94986ace9a93f?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                    alt="Home"
                  />
                </div>
              </a>

              <button className="bg-[rgba(0,0,0,0.2)] flex w-full items-center gap-2 mt-[18px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <div className="self-stretch flex min-h-8 w-8 items-center gap-2 justify-center h-8 my-auto rounded-[23px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/6366aaa24df910417501d8cc23695c755cb4bba0?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                    alt="Lists"
                  />
                </div>
              </button>

              <button className="bg-[rgba(0,0,0,0.2)] flex min-h-8 w-full items-center gap-2 justify-center h-8 mt-[18px] rounded-[23px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f1e07dbb3349c103f59ff360eddeca696b147c4e?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                  alt="Menu"
                />
              </button>

              <a
                href="/launchpad"
                className="flex w-full items-center gap-2 mt-[18px] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-1 transition-colors"
              >
                <div className="self-stretch flex min-h-8 w-8 items-center gap-2 justify-center h-8 my-auto rounded-[23px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/6366aaa24df910417501d8cc23695c755cb4bba0?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
                    alt="Launchpad"
                  />
                </div>
              </a>
            </div>

            <div className="border min-h-px w-full mt-6 border-[rgba(255,255,255,0.1)] border-solid" />

            <div className="w-full mt-6">
              <button className="flex w-full items-center gap-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-1 transition-colors">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/f48055aac3008238604b28ed6b8cdaa76035f5d6?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-8 self-stretch my-auto rounded-[35px]"
                  alt="Profile 1"
                />
              </button>

              <button className="flex w-full items-center gap-2 mt-[18px] hover:bg-[rgba(255,255,255,0.1)] rounded-lg p-1 transition-colors">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/1ae2a24793d3b73965c6e1f9a1c7a7ce10bd4a11?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-8 self-stretch my-auto rounded-[66px]"
                  alt="Profile 2"
                />
              </button>
            </div>
          </div>
        </div>

        <button className="bg-[rgba(255,255,255,0.06)] flex min-h-[30px] w-10 items-center gap-2 justify-center mt-[278px] rounded-lg max-md:mt-10 hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/6419a38edfd20141dc21904371cdf7e0648350ff?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[18px] self-stretch my-auto"
            alt="Create List"
          />
        </button>
      </nav>
    </aside>
  );
};
