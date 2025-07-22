import React from "react";
import shuffle from "../../assets/icons/shuffle.svg";
import error from "../../assets/icons/error_outline.svg";

const Alternatives = () => {
  return (
    <div>
      {" "}
      {/* Alternatives Section */}
      <div className="p-3 flex flex-col mt-4 bg-[#F6F7F6] border border-[#E1E6E1] w-full rounded-lg">
        <div className="flex justify-between mb-2">
          <button className="flex text-xs font-semibold border border-[#0066AF] text-[#0066AF] justify-between items-center px-1 gap-0.5 rounded-[4px]">
            <img src={shuffle} alt="shuffle" />
            Alternative
          </button>

          <div className="flex rounded-[4px] gap-1 items-center font-semibold w-fit px-1 py-0.5 border border-[#C4CBC5] ">
            <img src={error} alt="error" />
            <p className="text-xs text-[#5F6D60]">5 Item(s) in stock</p>
          </div>
        </div>

        {/* Headers for alternatives */}
        <div className="flex font-semibold text-[#5F6D60] text-sm rounded-t-[8px] border border-[#E1E6E1] justify-between items-center py-2 px-3">
          <div>Alternatives</div>
          <div className="w-32 text-right">Price</div>
          <div className="text-right">Stock Available</div>
        </div>

        {/* Selecting alternatives */}
        <div className="bg-white border border-[#E1E6E1] rounded-b-[8px]">
          {/* Row 1 */}
          <div className="flex py-2 justify-between items-center px-3 border-b border-[#E1E6E1]">
            <div className="flex text-sm font-semibold items-center w-40 flex-shrink-0">
              <input
                type="radio"
                name="alternative"
                className="w-4 h-4 mr-2 flex-shrink-0"
              />
              <div className="px-1 py-0.5 rounded-[4px] w-fit truncate text-[#3E473F] border border-[#E1E6E1]">
                Wreaker
              </div>
            </div>
            <div className="w-32 text-left text-sm text-[#3E473F] font-semibold">
              $6000/10kgs
            </div>
            <div className="w-16 text-right text-sm font-semibold text-[#3E473F]">
              6
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between items-center py-2 px-3">
            <div className="flex text-sm font-semibold items-center w-40 flex-shrink-0">
              <input
                type="radio"
                name="alternative"
                className="w-4 h-4 mr-2 flex-shrink-0"
              />
              <div className="px-1 py-0.5 rounded-[4px] w-fit truncate text-[#3E473F] border border-[#E1E6E1]">
                Weed Away
              </div>
            </div>
            <div className="w-32 text-left text-sm text-[#3E473F] font-semibold">
              $4500/10kgs
            </div>
            <div className="w-16 text-right text-sm text-[#3E473F] font-semibold">
              9
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatives;
