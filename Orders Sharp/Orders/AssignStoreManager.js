import React, { useState } from "react";
import ModalComponent from "../../components/Modals/modal";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SearchComponent from "../../components/Search";

const AssignStoreManager = () => {
  const [show, setShow] = useState(false);
  const [isToggleSelect, setToggleSelect] = useState(false);
  const [selectedStoreManager, setSelectedStoreManager] = useState({
    name: "",
    id: "",
  });
  return (
    <div>
      <button
        onClick={() => setShow(true)}
        className="disabled:bg-[#ABB6AC] text-white text-sm h-[36px]  px-5 bg-[#2B8C34] hover:bg-opacity-[0.9] rounded-[8px] font-medium transition-all"
      >
        Assign Store Manager
      </button>

      <ModalComponent
        show={show}
        showModal={() => setShow(false)}
        title="Assign Store Manager"
        subtitle=""
      >
        <div className="mt-3">
          <h6 className="text-[#5F6D60] font-medium text-sm">
            Select a store manager to handle this order based on the delivery
            location
          </h6>

          <div className="bg-[#F7F7F5] border border-[#EDECE7] py-1 px-2 rounded-lg mt-4">
            {/* ADDRESS */}
            <div className="flex gap-2 border-b py-2 border-b-[#E1E6E1] items-center">
              <p className="text-[#79887B] font-semibold text-xs ">Address:</p>
              <div className="bg-white border border-[#E1E6E1] px-1 py-[2px] rounded-[4px] ">
                <p className="text-[#5F6D60] font-semibold text-xs ">
                  No 6 Ojuade road, Ikolaba estate.
                </p>
              </div>
            </div>

            {/* STATE */}
            <div className="flex gap-2 border-b py-2 border-b-[#E1E6E1] items-center">
              <p className="text-[#79887B] font-semibold text-xs ">State:</p>
              <div className="bg-white border border-[#E1E6E1] px-1 py-[2px] rounded-[4px] ">
                <p className="text-[#5F6D60] font-semibold text-xs ">Oyo</p>
              </div>
            </div>

            {/* LGA */}
            <div className="flex gap-2 py-2 items-center">
              <p className="text-[#79887B] font-semibold text-xs ">LGA:</p>
              <div className="bg-white border border-[#E1E6E1] px-1 py-[2px] rounded-[4px] ">
                <p className="text-[#5F6D60] font-semibold text-xs ">
                  Ibadan North
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <p className="font-medium text-sm leading-[18px] text-[#344335]">
                Store Manager
              </p>
              <div
                className="flex items-center cursor-pointer justify-between outline-0 h-[44px] bg-white rounded-[8px] border border-[#E1E6E1] mt-[4px]  px-[14px] w-full font-semibold text-sm leading-5 text-[#96A397]"
                onClick={() => setToggleSelect(!isToggleSelect)}
              >
                <p>{selectedStoreManager?.name || "Select store manger"}</p>

                {isToggleSelect ? (
                  <ExpandLess
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                ) : (
                  <ExpandMore
                    className="text-[#ABB6AC] cursor-pointer"
                    style={{ fontSize: "18px" }}
                  />
                )}
              </div>

              {isToggleSelect && (
                <div
                  className="absolute rounded-[8px] p-[8px] w-full bg-white z-20 max-h-[250px] overflow-y-scroll "
                  style={{
                    boxShadow:
                      "0px 0px 1px rgba(0, 0, 0, 0.25), 0px 16px 32px rgba(0, 0, 0, 0.08",
                  }}
                >
                  <div className="">
                    <SearchComponent
                      placeholder="Search..."
                      // searchValue={lgaSearchValue}
                      // handleChange={handleSearchLgaChange}
                    />
                  </div>
                  {["Bola", "Tade", "Sola"].map((data, index) => {
                    return (
                      <div
                        onClick={() => {
                          setSelectedStoreManager({
                            name: data,
                            id: index,
                          });
                          setToggleSelect(false);
                        }}
                        key={index}
                        className="px-[16px] py-[12px] hover:bg-[#EDF7EE] cursor-pointer"
                      >
                        <p className="font-medium text-sm leading-5 text-[#344335]">
                          {data}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 mb-3">
          <button
            onClick={() => setShow(false)}
            type="submit"
            disabled={false}
            className="rounded-lg px-6 py-3 text-[#5C715E] text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={selectedStoreManager?.name === "" ? true : false}
              className="bg-primary 
                                 disabled:bg-[#ABB6AC] 
                                 rounded-lg px-6 py-3 text-white disabled:cursor-not-allowed text-sm font-medium hover:bg-[#24752B] transition-all"
            >
              Assign Store Manager
            </button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default AssignStoreManager;
