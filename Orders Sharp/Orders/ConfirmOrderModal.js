import React from "react";
import error from "../../assets/icons/error_outline.svg";
import ModalComponent from "../../components/Modals/modal";

const ConfirmOrderModal = ({
  onClose,
  onConfirm,
  itemName,
  quantity,
  itemNumber,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
}) => {
  return (
    console.log("Modal show prop", isConfirmModalOpen),
    (
      <ModalComponent
        show={isConfirmModalOpen}
        showModal={() => setIsConfirmModalOpen(false)}
        title='Confirm Order'
        subtitle=''
      >
        <div className='text-sm text-[#4B564D] font-medium'>
          Confirm that this{" "}
          <span className='font-semibold text-[#2E332F]'>
            order is in stock
          </span>{" "}
          to proceed.
        </div>
        {/* Grey container for item information */}
        <div className='flex mt-2 mb-2 flex-col rounded-md px-2 py-3 bg-[#F6F7F6] border border-[#E1E6E1]'>
          <div className='flex items-center gap-2 mb-2 text-sm text-[#79887B] font-semibold'>
            <p>Item Name:</p>
            <div
              className={`${
                type ? "w-fit" : "w-8 h-1"
              }bg-white border items-center text-[#4B564D] border-[#E1E6E1] px-0.5 py-1 rounded-md`}
            >
              {" "}
              {{
                        type === "Input"
                          ? orderData?.input_product?.name || "N/A"
                          : type === "Advisory"
                          ? orderData?.advisory_product?.name || "N/A"
                          : type === "Mechanization"
                          ? orderData?.mechanization_product?.name || "N/A"
                          : type === "Insurance"
                          ? orderData?.insurance_product?.name || "N/A"
                          : type === "Livestock"
                          ? orderData?.livestock_input_product?.name || "N/A"
                          : null
                      }}
            </div>
          </div>
          {/* Quantity and Items in Stock */}
          <div className='flex justify-between'>
            <div className='flex items-center gap-1 text-sm text-[#79887B] font-semibold'>
              <p>Quantity:</p>
              <div
                className={`${
                  quantity ? "w-fit" : "w-8 h-1"
                }bg-white border items-center text-[#4B564D] border-[#E1E6E1] px-0.5 py-1 rounded-md`}
              >
{orderData?.quantity || "N/A"}              </div>
            </div>
            {/* Items in stock */}
            <div className='flex rounded-[4px] gap-1 items-center font-semibold w-fit px-1 py-0.5 border border-[#C4CBC5] '>
              <img src={error} alt='error' />
              <p className='text-xs text-[#5F6D60]'>
              5 Item(s) in stock
              </p>
            </div>
          </div>
        </div>
        {/* Once confirmed ..... */}
        <div className='text-sm font-medium mb-8 text-[#4B564D] '>
          Once confirmed, the order will be accepted and assigned to the <br />
          Customer Success team for delivery confirmation
        </div>

        {/* Buttons */}
        <div className='flex items-center justify-end gap-5 '>
          {/* Cancel Button */}
          <button className='px-5 py-2 text-[#5C715E]' onClick={onClose}>
            Cancel
          </button>
          <button
            className='px-5 py-2 rounded-[8px] bg-[#2B8C34] text-white'
            onClick={onConfirm}
          >
            Confirm Order
          </button>
        </div>
      </ModalComponent>
    )
  );
};

export default ConfirmOrderModal;
