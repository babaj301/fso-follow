import React, { useState } from "react";
import ModalComponent from "../../components/Modals/modal";
import { Search } from "@mui/icons-material";

const AlternativeModal = ({
  setShowAlternative,
  isShowAlternative,
  setNotInStockModal,
}) => {
  const data = [
    {
      name: "Attrazine",
      priceRange: [
        {
          min: "3700",
          max: "4000",
          quantity: "2",
          unit: "kg",
        },
        {
          min: "7000",
          max: "8000",
          quantity: "4",
          unit: "kg",
        },
      ],
    },
    {
      name: "Attack v9",
      priceRange: [
        {
          min: "3700",
          max: "4000",
          quantity: "2",
          unit: "kg",
        },
        {
          min: "7000",
          max: "8000",
          quantity: "4",
          unit: "kg",
        },
      ],
    },
    {
      name: "Attack v4",
      priceRange: [
        {
          min: "3700",
          max: "4000",
          quantity: "2",
          unit: "kg",
        },
        {
          min: "7000",
          max: "8000",
          quantity: "4",
          unit: "kg",
        },
      ],
    },
    {
      name: "Attack 45",
      priceRange: [
        {
          min: "3700",
          max: "4000",
          quantity: "2",
          unit: "kg",
        },
        {
          min: "7000",
          max: "8000",
          quantity: "4",
          unit: "kg",
        },
      ],
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [selectedAlternative, setSelectedAlternative] = useState({});
  const [isSearchValue, setIsSearchValue] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [confirmOrderUpdate, setConfirmOrderUpdate] = useState(false);

  return (
    <div>
      <ModalComponent
        show={isShowAlternative}
        showModal={() => setShowAlternative(false)}
        title={"Suggest an Alternative Product"}
        subtitle="The original product is unavailable. Suggest an alternative from the available options with the best match percentage."
      >
        <div>
          <div className="border border-[#E1E6E1] bg-[#F6F7F6] mt-1 rounded-lg p-3">
            <div className="bg-white rounded-lg px-1 py-[2px] w-fit mb-3 border border-[#E1E6E1]">
              <p className="text-[#4B564D] font-semibold text-sm ">Slasher</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                {" "}
                <p className="text-[#79887B] font-semibold text-xs ">
                  Quantity
                </p>
                <p className="text-[#2E332F] font-semibold text-sm pt-1">5</p>
              </div>
              <div>
                {" "}
                <p className="text-[#79887B] font-semibold text-xs ">Price</p>
                <p className="text-[#2E332F] font-semibold text-sm pt-1">
                  ₦5000/10kgs
                </p>
              </div>
              <div>
                {" "}
                <p className="text-[#79887B] font-semibold text-xs ">
                  Total Price
                </p>
                <p className="text-[#2E332F] font-semibold text-sm pt-1">
                  ₦25,000
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[#E1E6E1] bg-[#FFF] mt-3 rounded-lg">
            <div className="border-b border-b-[#E1E6E1]">
              <p className="text-[#4B564D] font-semibold text-sm p-3">
                Suggest Alternative
              </p>
            </div>
            <div className="px-2 py-1 flex items-center w-full gap-[6px] mt-1">
              <div className="w-[85%]">
                <div className="relative">
                  <div className="relative">
                    <input
                      onChange={(event) => {
                        setSearchValue(event.target.value);
                        setIsSearchValue(true);
                      }}
                      type="text"
                      value={searchValue}
                      className="appearance-none w-full placeholder:text-[#96A397] 
                placeholder:text-sm text-[#344335] text-sm focus:border-[#2B8C34] 
                focus:outline-none focus:shadow-input focus:shadow-[0px_0px_0px_2px_#D5E8D6] rounded-lg border border-[#96A397] h-[44px] font-semibold bg-white py-3 px-10"
                      placeholder={"Product name"}
                    />
                    <Search
                      style={{
                        color: "#96A397",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "1rem",
                      }}
                    />
                  </div>

                  {searchValue && isSearchValue && (
                    <div
                      className="absolute rounded-[8px] p-[8px] mt-1 w-full bg-white z-20 max-h-[250px] overflow-y-scroll "
                      style={{
                        boxShadow:
                          "0px 0px 1px rgba(0, 0, 0, 0.25), 0px 16px 32px rgba(0, 0, 0, 0.08",
                      }}
                    >
                      {data.map((data, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedAlternative(data);
                              setIsSearchValue(false);
                            }}
                            className="px-[16px] py-[12px] hover:bg-[#EDF7EE] cursor-pointer"
                          >
                            <p className="font-semibold text-sm leading-5 text-[#2E332F]">
                              {data.name}
                            </p>
                            <div className=" flex flex-wrap">
                              {data.priceRange?.map((price, index) => {
                                return (
                                  <div key={index}>
                                    <p className="font-medium text-xs leading-5 text-[#5F6D60]">
                                      ₦{price.min}-₦{price.max}/{price.quantity}
                                      {price.unit}
                                      <span className="px-1 text-[#5C715E] font-semibold">
                                        |
                                      </span>
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[15%]">
                <button
                  disabled={searchValue.length === 0}
                  onClick={() => {
                    setSearchValue("");
                    setAlternatives((prev) => [...prev, selectedAlternative]);
                    setSelectedAlternative({});
                  }}
                  className={`w-full h-[40px] rounded-lg text-sm font-medium text-white bg-[#2B8C34] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="border border-[#E1E6E1]  mt-3 rounded-lg">
            {/* TABLE HEAD */}
            <div className="border-b border-b-[#E1E6E1] bg-[#E1E6E1] flex items-center">
              <div className="w-[80%] flex justify-between items-center gap-2">
                <p className="text-[#4B564D] font-semibold text-sm p-3">
                  Alternative
                </p>
                <p className="text-[#4B564D] font-semibold text-sm p-3">
                  Price
                </p>{" "}
                <p className="text-[#4B564D] font-semibold text-sm p-3">
                  Stock Available
                </p>
              </div>
              <div className="w-[20%] "></div>
            </div>
            {/* TABLE BODY */}

            {alternatives?.length === 0 ? (
              <div className="h-[78px] flex justify-center items-center">
                <p className="text-[#96A397] font-medium text-sm p-3">
                  No alternative has been added yet
                </p>
              </div>
            ) : (
              <>
                {alternatives?.map((data, index) => {
                  return (
                    <div key={index} className=" flex items-center">
                      <div className="w-[80%] flex justify-between items-center gap-2">
                        <p className="text-[#4B564D] font-semibold text-sm p-3">
                          {data.name}
                        </p>
                        <p className="text-[#4B564D] font-semibold text-sm p-3">
                          ₦6000/10kgs
                        </p>{" "}
                        <p className="text-[#4B564D] font-semibold text-sm p-3">
                          6
                        </p>
                      </div>
                      <div className="w-[20%] flex cursor-pointer justify-end ">
                        <p className="text-[#96A397] font-semibold text-sm p-3">
                          Remove
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between  mt-3">
            <button
              onClick={() => {
                setShowAlternative(false);
                setNotInStockModal(true);
              }}
              className=" py-2 text-sm text-[#5C715E]"
            >
              Back
            </button>

            <div className="flex gap-5">
              <button
                onClick={() => setShowAlternative(false)}
                className="px-5 py-2 text-sm text-[#5C715E]"
              >
                Cancel
              </button>
              <button
                disabled={alternatives.length === 0}
                onClick={() => {
                  setShowAlternative(false);
                  setConfirmOrderUpdate(true);
                }}
                className={`w-[69px] h-[40px] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white bg-[#2B8C34] `}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </ModalComponent>

      <ModalComponent
        show={confirmOrderUpdate}
        showModal={() => setConfirmOrderUpdate(false)}
        title={"Confirm Order Update"}
        subtitle="The order has been updated with an alternative product. The CS team will confirm with the farmer."
      >
        <div>
          <div className="border border-[#E1E6E1] bg-[#FFF] mt-3 rounded-lg">
            <div className="border-b border-b-[#E1E6E1]">
              <p className="text-[#4B564D] font-semibold text-sm p-3">Note</p>
            </div>
            <div className="p-2 ">
              <div className="border-b rounded-lg border-b-[#E1E6E1] bg-[#F6F7F6] flex items-center">
                <div className="w-full">
                  <p className="text-[#5F6D60] font-semibold text-sm p-3">
                    Alternative Order
                  </p>
                </div>
              </div>

              <div className="border-b my-2 rounded-lg border-b-[#E1E6E1] bg-[#F6F7F6] flex items-center">
                <div className="w-full">
                  <p className="text-[#5F6D60] font-medium text-sm p-3">
                    The farmer originally ordered{" "}
                    <span className="font-semibold text-[#3E473F]">
                      [Original Product Name]
                    </span>{" "}
                    at{" "}
                    <span className="font-semibold text-[#3E473F]">
                      {" "}
                      ₦[Original Price]
                    </span>
                    , but it is currently out of stock. Below are alternative
                    options they can consider
                  </p>

                  <div className="px-2 mb-2">
                    <div className="border border-[#E1E6E1] rounded-lg">
                      {/* TABLE HEAD */}
                      <div className=" bg-[#F6F7F6] flex items-center">
                        <div className="w-[80%] flex justify-between items-center gap-2">
                          <p className="text-[#4B564D] font-semibold text-sm px-3 py-2">
                            Alternatives
                          </p>
                          <p className="text-[#4B564D] font-semibold text-sm px-3 py-2">
                            Price
                          </p>{" "}
                          <p className="text-[#4B564D] font-semibold text-sm px-3 py-2">
                            Stock Available
                          </p>
                        </div>
                        <div className="w-[20%] "></div>
                      </div>
                      <hr />
                      {/* TABLE BODY */}

                      <div className="">
                        {alternatives?.map((data, index) => {
                          return (
                            <div
                              key={index}
                              className=" bg-white  flex items-center"
                            >
                              <div className="w-[80%] flex justify-between items-center gap-2">
                                {/* <div className="p-1 border border-[#E1E6E1] bg-white h-[24px] w-fit rounded-lg"> */}
                                <p className="text-[#4B564D] font-semibold border border-[#E1E6E1] w-fit  rounded-lg text-sm px-1 ml-3 py-[2px]">
                                  {data.name}
                                </p>
                                {/* </div> */}
                                <p className="text-[#4B564D] font-semibold text-sm px-3 py-2">
                                  ₦6000/10kgs
                                </p>{" "}
                                <p className="text-[#4B564D] font-semibold text-sm px-3 py-2">
                                  6
                                </p>
                              </div>
                              <div className="w-[20%] flex cursor-pointer justify-end ">
                                <p className="text-[#96A397] font-semibold text-sm px-3 py-2">
                                  Remove
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[#5F6D60] font-medium text-sm p-3">
                      Please call the farmer and confirm if they would like to
                      choose one of these alternatives or cancel the order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between  mt-3">
            <button
              onClick={() => {
                setConfirmOrderUpdate(false);
                setShowAlternative(true);
              }}
              className=" py-2 text-sm text-[#5C715E]"
            >
              Back
            </button>

            <div className="flex gap-5">
              <button
                onClick={() => setConfirmOrderUpdate(false)}
                className="px-5 py-2 text-sm text-[#5C715E]"
              >
                Cancel
              </button>
              <button
                onClick={() => setConfirmOrderUpdate(false)}
                className={`w-[69px] h-[40px] rounded-lg text-sm font-medium text-white bg-[#2B8C34] `}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default AlternativeModal;
