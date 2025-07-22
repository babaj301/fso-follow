import React, { useEffect, useState } from "react";
import GoBack from "../../components/GoBack";
import Header from "../../components/Header";
import { ContentCopy } from "@mui/icons-material";
import ModalComponent from "../../components/Modals/modal";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getVendorPaymentInfo,
  vendorPaymentApproval,
} from "../../redux/Orders/ordersAction";
import moment from "moment";
import cogoToast from "cogo-toast";

const VendorPaymentInfoPage = () => {
  const { id, product_type } = useParams();
  const dispatch = useDispatch();
  const { vendorPaymentInfoData } = useSelector((state) => state.orders);

  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(!show);
  };

  const handlePhoneNumber = (number) => {
    cogoToast.success("Phone Number copied successfully!");
  };

  const handleVendorPayment = (type, id) => {
    const advisoryOrder = [];
    const inputOrder = [];
    const insuranceOrder = [];
    const mechanizationOrder = [];

    if (type === "input") {
      inputOrder.push(id);
    } else if (type === "advisory") {
      advisoryOrder.push(id);
    } else if (type === "insurance") {
      insuranceOrder.push(id);
    } else if (type === "mechanization") {
      mechanizationOrder.push(id);
    }

    const value = {
      advisory_orders: advisoryOrder,
      input_orders: inputOrder,
      insurance_orders: insuranceOrder,
      mechanization_orders: mechanizationOrder,
    };

    dispatch(vendorPaymentApproval({ value }));

    setTimeout(() => {
      setShow(false);
      dispatch(getVendorPaymentInfo({ id: id, value: product_type }));
    }, 800);
  };

  useEffect(() => {
    dispatch(getVendorPaymentInfo({ id: id, value: product_type }));
  }, [dispatch, id, product_type]);

  // console.log(vendorPaymentInfoData, vendorPaymentInfoLoading);

  return (
    <>
      {/* Pay  modal */}
      <ModalComponent show={show} showModal={showModal} title="" subtitle="">
        <div className="mt-6">
          <h6 className="text-[#344335] font-semibold text-[15px] text-center">
            Are you sure you want to pay the vendor?
          </h6>
          <p className="text-[#344335] font-medium text-xs text-center">
            N{vendorPaymentInfoData?.amount} would be payed to{" "}
            {vendorPaymentInfoData?.vendor || "N/A"}
          </p>
        </div>

        <div className="flex justify-center mt-8 mb-3">
          <div className="flex gap-3">
            <button
              type="submit"
              onClick={() =>
                handleVendorPayment(
                  vendorPaymentInfoData?.product_type,
                  vendorPaymentInfoData?.order_id
                )
              }
              disabled={false}
              className="bg-primary 
                           disabled:bg-[#ABB6AC] 
                           rounded-lg px-8 py-3 text-white text-sm font-medium hover:bg-[#24752B] transition-all"
            >
              Pay
            </button>
            <button
              onClick={() => setShow(false)}
              type="submit"
              disabled={false}
              className="rounded-lg border border-[#2B8C34] px-8 py-3 text-[#2B8C34] text-sm font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalComponent>

      <GoBack />
      <div className="mt-4">
        <Header text="Vendor Payment Details" />
      </div>

      <div className="mt-4 bg-white rounded-lg py-4 px-4">
        <p className="text-[#344335] text-[15px] font-semibold">
          Vendor Information
        </p>

        <div className="flex gap-3 mt-4">
          <div className="flex justify-center items-center rounded-full bg-[#2B8C34] w-[48px] h-[48px] text-white font-medium text-[15px]">
            <p>{vendorPaymentInfoData?.vendor?.charAt(0) || "N/A"}</p>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm font-semibold">
              {vendorPaymentInfoData?.vendor || "N/A"}
            </p>
            <div
              className="flex gap-1 items-center"
              onClick={() =>
                handlePhoneNumber(vendorPaymentInfoData?.phone_number)
              }
            >
              <p className="text-primary text-sm font-medium">
                {" "}
                {vendorPaymentInfoData?.phone_number || "N/A"}
              </p>
              <ContentCopy
                className="text-primary cursor-pointer"
                style={{ fontSize: "18px" }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <div>
            <p className="text-[#7C8D7E] text-sm">Email Address</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorPaymentInfoData?.email || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Product Type</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {" "}
              {vendorPaymentInfoData?.product_type || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Account Number</p>
            <div className="flex gap-1 items-center">
              <h6 className="text-[#2B8C34] text-sm font-medium mt-1">
                {vendorPaymentInfoData?.account_number || "N/A"}
              </h6>
              <ContentCopy
                className="text-primary cursor-pointer"
                style={{ fontSize: "18px" }}
              />
            </div>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Bank Name</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorPaymentInfoData?.bank || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Address</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorPaymentInfoData?.address || "N/A"}
            </h6>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[#344335] text-[15px] font-semibold">
            Payment Information
          </p>
        </div>

        <div className="flex justify-between mt-2 ">
          <div>
            <p className="text-[#7C8D7E] text-sm">Order ID</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorPaymentInfoData?.order_id || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Product Name</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorPaymentInfoData?.product_name || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Order Type</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {" "}
              {vendorPaymentInfoData?.product_type || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Cost</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              N {vendorPaymentInfoData?.amount || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Quantity</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {" "}
              {vendorPaymentInfoData?.quantity || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Date</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {moment(vendorPaymentInfoData?.order_date).format("lll")}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Payment Status</p>
            <div className="flex mt-1">
              <div
                className={`font-medium text-sm bg-[#FDDED4] rounded-[4px] py-1 px-2 ${
                  vendorPaymentInfoData?.paid_vendor
                    ? "success-badge"
                    : "error-badge"
                } `}
              >
                <p> {vendorPaymentInfoData?.paid_vendor ? "Paid" : "Unpaid"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* {vendorPaymentInfoData?.paid_vendor ? null : (
          <div className="flex mt-6 gap-4">
            <button
              onClick={() => showModal()}
              className="py-3 disabled:bg-[#ABB6AC] text-white text-sm  px-5 bg-[#2B8C34] hover:bg-opacity-[0.9] rounded-[8px] font-medium transition-all"
            >
              Pay
            </button>
          </div>
        )} */}
      </div>
    </>
  );
};

export default VendorPaymentInfoPage;
