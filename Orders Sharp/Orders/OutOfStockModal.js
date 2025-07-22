import React, { useState } from "react";
import redError from "../../assets/icons/error_outline_red.svg";
import AlternativeModal from "../../containers/Orders/AlternativeModal";
import { Close } from "@mui/icons-material";

const OutOfStockModal = ({ onClose, onNext, itemName, quantity }) => {
  const [isRejected, setIsRejected] = useState(false);
  const [isAlternative, setIsAlternative] = useState(false);

  return (
    <div className="fixed inset-0 flex rounded-[8px] bg-black bg-opacity-50 z-50 items-center justify-center">
      <div className="px-6 pt-6 pb-8 bg-white rounded-[8px] w-full max-w-[553px] flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[#181B19] text-base font-semibold ">
            Order Not In Stock
          </p>
          <button
            onClick={onClose}
            className="text-[#79887B] text-base font-semibold"
          >
            <Close />
          </button>
        </div>
        <div className="text-sm text-[#4B564D] font-medium">
          This product is not available
        </div>
        {/* Grey container for item information */}
        <div className="flex mt-2 mb-2 flex-col rounded-md px-2 py-3 bg-[#F6F7F6] border border-[#E1E6E1]">
          <div className="flex gap-2 items-center mb-2 text-sm text-[#79887B] font-semibold">
            <p>Item Name:</p>
            <div
              className={`${
                itemName ? "w-fit" : "w-8 h-1"
              }bg-white border items-center border-[#E1E6E1] px-0.5 py-1 rounded-md`}
            >
              {" "}
              {itemName}
            </div>
          </div>
          {/* Quantity and Items in Stock */}
          <div className="flex justify-between">
            <div className="flex items-center gap-1 text-sm text-[#79887B] font-semibold">
              <p>Quantity:</p>
              <div
                className={`${
                  quantity ? "w-fit" : "w-8 h-1"
                }bg-white border items-center border-[#E1E6E1] px-0.5 py-1 rounded-md`}
              >
                {quantity}
              </div>
            </div>
            {/* Items in stock */}
            <div className="flex rounded-[4px] gap-1 items-center font-semibold w-fit px-1 py-0.5 border border-[#C4CBC5] ">
              <img src={redError} alt="error" />
              <p className="text-xs text-[#B92020]">0 Item(s) in stock</p>
            </div>
          </div>
        </div>
        {/* Once confirmed ..... */}
        <div className="text-sm font-medium mb-2 text-[#4B564D] ">
          You can either suggest an alternative or reject the order. The
          Customer Success team will inform the farmer.
        </div>

        {/* Suggest alternative select */}
        {/* <label className="text-sm flex gap-2 mb-2 items-center cursor-pointer">
          <input
            type="radio"
            name="option"
            checked={isAlternative}
            onChange={() => {
              setIsAlternative(!isAlternative);
              setShowAlternative(true);
            }}
            className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
          />
          <span className="font-semibold text-sm text-[#4B564D]">
            Suggest Alternative{" "}
          </span>{" "}
          - Select a replacement product
        </label> */}

        {/* Reject select */}
        <label className="flex text-sm gap-2 items-center cursor-pointer mb-8">
          <input
            type="radio"
            name="option"
            checked={isRejected}
            onChange={() => setIsRejected(!isRejected)}
            className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
          />
          <span className="font-semibold text-sm text-[#4B564D]">
            Reject Order
          </span>{" "}
          - Mark order as unavailable
        </label>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-5 text-[#4B564D] ">
          {/* Cancel Button */}
          <button className="px-5 py-2 text-[#5C715E]" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!isRejected || !isAlternative} // Disable when not selected
            className={`px-5 py-2 rounded text-white ${
              isRejected || isAlternative
                ? "bg-[#2B8C34] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutOfStockModal;
