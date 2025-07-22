import React, { useEffect, useState } from "react";
import GoBack from "../../components/GoBack";
import Header from "../../components/Header";
import error from "../../assets/icons/error_outline.svg";
import redError from "../../assets/icons/error_outline_red.svg";
import ModalComponent from "../../components/Modals/modal";
import { Form, Formik } from "formik";
import { refundApplicationValidator } from "../../validationSchema/validator";
import warning from "../../assets/icons/warning.svg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptOrders,
  getAnOrder,
  rejectOrder,
  requestRefund,
  updateAnOrder,
} from "../../redux/Orders/ordersAction";
import cogoToast from "cogo-toast";
import moment from "moment";
import {
  Bronze,
  Copper,
  Gold,
  Plantinum,
  Silver,
} from "../../components/Ranks/Rank";

import {
  Chat,
  Check,
  ContentCopy,
  ErrorOutline,
  Moped,
  Close,
  HourglassBottom,
} from "@mui/icons-material";
import AlternativeModal from "../../containers/Orders/AlternativeModal";
import DeliveryDetailsModal from "../../containers/Orders/DeliveryDetailsModal";
import { ThreeDots } from "react-loader-spinner";
import personAlert from "../../assets/icons/person_alert.svg";
import AssignStoreManager from "../../containers/Orders/AssignStoreManager";
import { Tooltip } from "@mui/material";
import OrderTimeline from "../../containers/Orders/OrderTimeline";
import NoteSection from "../../containers/Orders/NoteSection";
// import Alternatives from "../../containers/Orders/Alternatives";
import { hasPermission } from "../../utils/permissionChecker";
import { PRIVILEGES } from "../../utils/privileges";

const OrderInfoPage = () => {
  const { id, type } = useParams();
  const dispatch = useDispatch();
  const { orderLoading, orderData } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [notInStockModal, setNotInStockModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isAlternative, setIsAlternative] = useState(false);
  const [rejectNoteModal, setRejectNoteModal] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [noAlternative, setNoAlternative] = useState(false);
  const [isCustomNote, setIsCustomNote] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [isShowAlternative, setShowAlternative] = useState(false);
  const [deliveryDetailsModal, setDeliveryDetailsModal] = useState(false);
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    state: "",
    lga: "",
    deliveryType: "",
    estimatedDate: "",
    expectedDeliveryDate: "",
    daysRemaining: "",
  });

  const showModal = (orderData) => {
    setOrderType(orderData);
    setShow(!show);
  };

  const showRejectNoteModal = () => {
    setRejectNoteModal(!rejectNoteModal);
  };

  const showConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const showNotinStockModal = () => {
    setNotInStockModal(!notInStockModal);
  };

  const handleNext = () => {
    setNotInStockModal(false);
    if (isAlternative) {
      setShowAlternative(true);
    } else {
      setRejectNoteModal(true);
    }
  };

  const showRejectModal = (orderData) => {
    setOrderType(orderData);
    setRejectModal(!rejectModal);
  };

  const showDeliveryModal = () => {
    setDeliveryModal(!deliveryModal);
  };

  const showHistoryModal = () => {
    setHistoryModal(!historyModal);
  };

  const showRefundModal = () => {
    setRefundModal(!refundModal);
  };

  const showDeliveryDetailsModal = () => {
    setDeliveryDetailsModal(!deliveryDetailsModal);
  };

  // Function to calculate remaining days
  const calculateRemainingDays = () => {
    if (!deliveryDetails.expectedDeliveryDate) return null;

    const today = new Date();
    const futureDate = new Date(deliveryDetails.expectedDeliveryDate);
    const remainingDays = Math.ceil(
      (futureDate - today) / (1000 * 60 * 60 * 24)
    );

    return remainingDays >= 0 ? remainingDays : 0;
  };

  const handleSubmit = (values) => {
    const typeValueMap = {
      Input: {
        input_order_id: orderData?.id,
      },
      Livestock: {},
      Advisory: {
        advisory_order_id: orderData?.id,
      },
      Mechanization: {
        mechanization_order_id: orderData?.id,
      },
      Insurance: {
        insurance_order_id: orderData?.id,
      },
    };

    const typeValue = typeValueMap[type] || {};

    const value = {
      ...typeValue,
      refund_amount: values.cost,
      refund_reason: values.description,
    };

    dispatch(requestRefund({ value }));

    setTimeout(() => {
      dispatch(
        getAnOrder({
          orderType: type,
          id: id,
        })
      );
    }, 800);
  };

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number);
    cogoToast.success(`${number} copied successfully`);
  };

  const handleChangeOrderType = () => {
    let userId = localStorage.getItem("userId");
    let orderStatus;
    if (orderType === "pending") {
      orderStatus = ["PENDING", "PROCESSING"];
    } else if (orderType === "processing") {
      orderStatus = ["PENDING", "PROCESSING", "DISPATCHED"];
    } else if (orderType === "dispatched") {
      orderStatus = ["PENDING", "PROCESSING", "DISPATCHED", "DELIVERED"];
    }

    dispatch(
      updateAnOrder({
        orderStatus,
        type,
        id,
        userId,
        farmerName:
          orderData.farmer.first_name + " " + orderData.farmer.last_name,
        farmerPhonenumber: orderData.farmer.phone_number,
        productName:
          type === "Input"
            ? orderData.input_product.name || "N/A"
            : type === "Advisory"
            ? orderData.advisory_product.name || "N/A"
            : type === "Mechanization"
            ? orderData.mechanization_product.name || "N/A"
            : type === "Insurance"
            ? orderData.insurance_product.name || "N/A"
            : type === "Livestock"
            ? orderData.input_product.name || "N/A"
            : "N/A",
        price: orderData.total_display_price || "N/A",
      })
    );

    setTimeout(() => {
      setShow(false);
      dispatch(
        getAnOrder({
          orderType: type,
          id: id,
        })
      );
    }, 800);
  };

  const handleRejectChangeStatus = () => {
    let userId = localStorage.getItem("userId");
    let orderStatus;
    if (orderType === "pending") {
      orderStatus = ["PENDING", "CANCELLED"];
    } else if (orderType === "processing") {
      orderStatus = ["PENDING", "PROCESSING", "CANCELLED"];
    } else if (orderType === "dispatched") {
      orderStatus = ["PENDING", "PROCESSING", "DISPATCHED", "CANCELLED"];
    }
    dispatch(
      updateAnOrder({
        orderStatus,
        type,
        id,
        userId,
        farmerName:
          orderData.farmer.first_name + " " + orderData.farmer.last_name,
        farmerPhonenumber: orderData.farmer.phone_number,
        productName:
          type === "Input"
            ? orderData.input_product.name || "N/A"
            : type === "Advisory"
            ? orderData.advisory_product.name || "N/A"
            : type === "Mechanization"
            ? orderData.mechanization_product.name || "N/A"
            : type === "Insurance"
            ? orderData.insurance_product.name || "N/A"
            : type === "Livestock"
            ? orderData.input_product.name || "N/A"
            : "N/A",
        price: orderData.total_display_price || "N/A",
      })
    );

    setTimeout(() => {
      setRejectModal(false);
      dispatch(
        getAnOrder({
          orderType: type,
          id: id,
        })
      );
    }, 800);
  };

  const handleAcceptOrder = () => {
    setConfirmOrderLoading(true);
    dispatch(acceptOrders({ id })).then((res) => {
      if (res.type === "acceptOrders/fulfilled") {
        setConfirmModal(false);
        cogoToast.success("Order accepted successfully");
        setConfirmOrderLoading(false);
        dispatch(
          getAnOrder({
            orderType: type,
            id: id,
          })
        );
      } else if (res.type === "acceptOrders/rejected") {
        setConfirmOrderLoading(false);
      }
    });
  };

  const [rejectLoading, setRejectLoading] = useState(false);
  const handleRejectOrder = () => {
    setRejectLoading(true);
    setConfirmOrderLoading(true);
    const data = {
      order_id: id,
      rejection_reason: customBody,
      title: customTitle || "",
    };

    dispatch(rejectOrder({ data })).then((res) => {
      if (res.type === "rejectOrder/fulfilled") {
        setRejectNoteModal(false);
        setConfirmOrderLoading(false);
        setRejectLoading(false);
        dispatch(
          getAnOrder({
            orderType: type,
            id: id,
          })
        );
      } else if (res.type === "rejectOrder/rejected") {
        setConfirmOrderLoading(false);
        setRejectLoading(false);
      }
    });
  };

  useEffect(() => {
    dispatch(
      getAnOrder({
        orderType: type,
        id: id,
      })
    ).then((res) => {
      if (res.type === "getAnOrder/fulfilled") {
        const deliveryDetail = res.payload.data.delivery_details;
        if (deliveryDetail && deliveryDetail?.address !== "") {
          setDeliveryDetails({
            address: deliveryDetail?.address || "N/A",
            state: deliveryDetail?.state || "N/A",
            lga: deliveryDetail?.lga || "N/A",
            deliveryType:
              deliveryDetail?.delivery_type === "door_step"
                ? "Door Step"
                : deliveryDetail?.delivery_type === "pick_up"
                ? "Pick Up"
                : "N/A",
            estimatedDate: deliveryDetail?.estimated_date,
            expectedDeliveryDate: deliveryDetail?.estimated_date
              ? moment(deliveryDetail?.estimated_date).format("YYYY-MM-DD")
              : "N/A",
          });
        } else {
          setDeliveryDetails({
            address: "",
            state: "",
            lga: "",
            deliveryType: "",
            estimatedDate: "",
            expectedDeliveryDate: "",
            daysRemaining: "",
          });
        }
      }
    });
  }, [dispatch, id, type]);

  // Dummy Data for Notes display
  const notes = [
    {
      id: 1,
      title: "Delivery Note",
      body: "This is the dummy note for the first delivery note. Just adding text to make it longer",
      date: " 12 Aug 22",
      time: "10:00 AM",
      user: "John Doe",
    },
    {
      id: 2,
      title: "Dummy Note",
      body: "This is the second dummy note for the Dummy note. Just adding text to make it longer ",
      date: "13 Aug 22",
      time: "11:00 AM",
      user: "Jane Smith",
    },
    {
      id: 3,
      title: "Delivery Note",
      body: "This is the dummy note for the first delivery note. Just adding text to make it longer",
      date: " 12 Aug 22",
      time: "10:00 AM",
      user: "John Doe",
    },
    {
      id: 4,
      title: "Dummy Note",
      body: "This is the second dummy note for the Dummy note. Just adding text to make it longer ",
      date: "13 Aug 22",
      time: "11:00 AM",
      user: "Jane Smith",
    },
    {
      id: 5,
      title: "Dummy Note",
      body: "This is the second dummy note for the Dummy note. Just adding text to make it longer ",
      date: "13 Aug 22",
      time: "11:00 AM",
      user: "Jane Smith",
    },
    {
      id: 6,
      title: "Dummy Note",
      body: "This is the second dummy note for the Dummy note. Just adding text to make it longer ",
      date: "13 Aug 22",
      time: "11:00 AM",
      user: "Jane Smith",
    },
  ];

  return (
    <div>
      {orderLoading ? (
        <div className="flex justify-center items-center h-[500px] w-full">
          {" "}
          <p className="font-medium text-sm leading-5">Loading...</p>
        </div>
      ) : (
        <div>
          <GoBack />
          <div className="mt-4">
            <Header text="Order Info" />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-[25%]">
              <div>
                <div className="border border-[#E1E6E1] rounded-t-[8px] py-3 px-4 bg-white flex justify-between items-center">
                  <p className="text-[#4B564D] font-semibold text-sm ">
                    Farmer Info
                  </p>
                </div>
                <div className=" border-b-[none] border-x border-[#E1E6E1] rounded-b-lg p-4 bg-white flex flex-col  h-fit">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-[8px] text-base">
                        {/* FARMER"S INITIALS */}

                        {orderData?.rank === "Plantinum" ? (
                          <Plantinum>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Plantinum>
                        ) : orderData?.rank === "Gold" ? (
                          <Gold>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Gold>
                        ) : orderData?.rank === "Silver" ? (
                          <Silver>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Silver>
                        ) : orderData?.rank === "Bronze" ? (
                          <Bronze>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Bronze>
                        ) : orderData?.rank === "Copper" ? (
                          <Copper>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Copper>
                        ) : (
                          <Copper>
                            {" "}
                            {orderData?.farmer?.first_name?.charAt(0)}
                            {orderData?.farmer?.last_name?.charAt(0)}
                          </Copper>
                        )}

                        <div className="">
                          <p className="text-[#344335] font-semibold leading-[18px] text-xs">
                            {orderData?.farmer?.first_name}{" "}
                            {orderData?.farmer?.last_name}
                          </p>
                          <div
                            className="flex gap-[6px] mt-[4px] cursor-pointer"
                            onClick={() =>
                              handleCopyNumber(orderData?.farmer?.phone_number)
                            }
                          >
                            <p
                              className={`  ${
                                orderData?.rank === "Plantinum"
                                  ? "text-[#4B4E68]"
                                  : orderData?.rank === "Gold"
                                  ? "text-[#F9B43B]"
                                  : orderData?.rank === "Silver"
                                  ? "text-[#4B7295]"
                                  : orderData?.rank === "Bronze"
                                  ? "text-[#E86454]"
                                  : orderData?.rank === "Copper"
                                  ? "text-[#6A1505]"
                                  : null
                              }font-semibold leading-[18px] text-xs`}
                            >
                              {orderData?.farmer?.phone_number}
                            </p>
                            <ContentCopy
                              className={`  ${
                                orderData?.rank === "Plantinum"
                                  ? "text-[#4B4E68]"
                                  : orderData?.rank === "Gold"
                                  ? "text-[#F9B43B]"
                                  : orderData?.rank === "Silver"
                                  ? "text-[#4B7295]"
                                  : orderData?.rank === "Bronze"
                                  ? "text-[#E86454]"
                                  : orderData?.rank === "Copper"
                                  ? "text-[#6A1505]"
                                  : null
                              }`}
                              style={{ fontSize: "16px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-[32px] cursor-pointer h-[32px] rounded-full flex items-center justify-center border border-primary">
                      <Chat style={{ color: "#2B8C34", fontSize: "16px" }} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[#96A397] font-semibold text-xs pb-1">
                      Channel
                    </p>
                    <div className="flex gap-1 items-center bg-[#F6F7F6] px-[6px] border border-[#E1E6E1] py-[2px] w-fit rounded-lg">
                      <h6 className=" font-semibold text-xs uppercase text-[#5F6D60]">
                        {orderData?.order_channel || "N/A"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="border border-[#E1E6E1] rounded-lg mt-3  bg-white ">
                  <div className="py-2 px-3 border-b border-b-[#E1E6E1] ">
                    <p className="text-[#4B564D] font-semibold text-sm ">
                      Delivery Details
                    </p>
                  </div>

                  <div className=" bg-white flex flex-col gap-4 pb-3  h-fit">
                    <div className="flex flex-col gap-1 px-4 pt-2">
                      <p className="text-[#96A397] font-semibold text-xs pb-1">
                        Delivery Address
                      </p>
                      <div className="flex gap-1 items-center bg-[#F6F7F6] px-[6px] border border-[#E1E6E1] py-[2px] w-fit rounded-lg">
                        <h6 className=" font-semibold text-xs text-[#5F6D60]">
                          {deliveryDetails.address !== ""
                            ? deliveryDetails.address
                            : "--"}
                        </h6>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-4">
                      <p className="text-[#96A397] font-semibold text-xs pb-1">
                        Estimated Delivery Date
                      </p>
                      <div className="flex gap-1 items-center bg-[#F6F7F6] px-[6px] border border-[#E1E6E1] py-[2px] w-fit rounded-lg mb-2">
                        <h6 className=" font-semibold text-xs text-[#5F6D60]">
                          {deliveryDetails.expectedDeliveryDate || "--"}
                        </h6>
                      </div>
                      <p
                        className={
                          calculateRemainingDays()
                            ? "text-[#B98A00] font-semibold text-xs pb-1"
                            : "text-[#96A397] font-semibold text-xs pb-1"
                        }
                      >
                        {calculateRemainingDays()
                          ? `${calculateRemainingDays()} days remaining`
                          : "-- days remaining"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 px-4">
                      <p className="text-[#96A397] font-semibold text-xs pb-1">
                        Delivery Type
                      </p>
                      <div className="flex gap-1 items-center bg-[#F6F7F6] px-[6px] border border-[#E1E6E1] py-[2px] w-fit rounded-lg">
                        <Moped style={{ color: "#5F6D60", fontSize: "14px" }} />
                        <h6 className=" font-semibold text-xs text-[#5F6D60]">
                          {deliveryDetails.deliveryType !== ""
                            ? deliveryDetails.deliveryType
                            : "--"}
                        </h6>
                      </div>
                    </div>
                  </div>

                  {/* Adding Permission for Editing Delivery details */}
                  {hasPermission(user, PRIVILEGES.UPDATE_DELIVERY) && (
                    <div className="py-2 px-3 border-t border-t-[#E1E6E1] ">
                      <button
                        disabled={
                          orderData?.order_status?.at(-1)?.toLowerCase() ===
                            "rejected" ||
                          orderData?.order_status?.at(-1)?.toLowerCase() ===
                            "cancelled"
                        }
                        onClick={showDeliveryDetailsModal}
                        className="text-primary font-semibold text-xs cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        Edit Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* FARMER INFO */}
            </div>
            <div className="w-[50%] ">
              <div>
                <div className="border border-[#E1E6E1] rounded-t-[8px] py-3 px-4 bg-white flex justify-between items-center">
                  <p className="text-[#4B564D] font-semibold text-sm ">
                    Payment
                  </p>
                </div>
                <div className=" border-t-[none] border-b border-x border-[#E1E6E1] rounded-b-lg  bg-white flex flex-col   h-fit">
                  <div className="flex flex-col gap-1 px-4 pt-4">
                    <div className="flex gap-[10px] items-center">
                      <p className="text-[#79887B] font-semibold text-sm">
                        Total Amount
                      </p>

                      {orderData?.payment_status && (
                        <div className="bg-primary py-[2px] px-1  rounded-[4px] flex gap-1 text-white text-xs font-semibold">
                          <Check style={{ fontSize: "14px" }} />
                          <p className="text-[#FFFFFF] font-semibold text-xs">
                            Paid
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex gap-1 items-center  pb-3 ${
                        orderData?.payment_status ? "pb-1" : "pb-3"
                      }`}
                    >
                      <h6 className="text-[#2B8C34] font-semibold text-2xl">
                        ₦
                        {parseFloat(
                          orderData?.total_display_price
                        )?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "N/A"}
                      </h6>
                    </div>
                  </div>
                  <div>
                    {(orderData?.payment_status &&
                      orderData.order_status?.at(-1)?.toLowerCase() ===
                        "rejected") ||
                      (orderData?.order_status?.at(-1)?.toLowerCase() ===
                        "cancelled" && (
                        <div className=" border-t border-t-[#E1E6E1] pt-3 pl-4">
                          <p
                            onClick={() => showRefundModal()}
                            className="text-primary font-semibold text-sm cursor-pointer  pb-4"
                          >
                            Request Refund
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div className="border border-[#E1E6E1] rounded-t-[8px] mt-3 py-3 px-4 bg-white flex justify-between items-center">
                    {orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "delivered" ||
                    orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "cancelled" ||
                    orderData.order_status?.at(-1)?.toLowerCase() ===
                      "rejected" ||
                    orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "cancelled" ? (
                      <p className="text-[#4B564D] font-semibold text-sm ">
                        Order Details
                      </p>
                    ) : orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "accepted" ? (
                      // &&
                      // Object.keys(orderData?.delivery_details)?.length !== 0
                      <p className="text-[#4B564D] font-semibold text-sm ">
                        Order Details
                      </p>
                    ) : (
                      <p className="text-[#4B564D] font-semibold text-sm ">
                        Confirm Order Availabilty
                      </p>
                    )}

                    <div className="flex cursor-pointer gap-1 items-center border border-[#C4CBC5] text-[#5F6D60] text-xs px-1 py-1 rounded-[4px]">
                      <p className="text-[#5F6D60] font-semibold text-xs ">
                        {" "}
                        {orderData?.id || "N/A"}
                      </p>
                      <ContentCopy
                        onClick={() => handleCopyNumber(orderData?.id)}
                        className={`text-[#96A397] w-[9px] h-[10px]`}
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  <div className=" border-x pb-3 border-[#E1E6E1] rounded-b-none  bg-white flex flex-col gap-4 h-fit">
                    <div className="px-4">
                      <div className="bg-[#F6F7F6] border-[#E1E6E1] border rounded-lg p-3 my-3">
                        <div className="flex justify-between items-center">
                          {orderData.order_status?.at(-1)?.toLowerCase() ===
                            "rejected" ||
                          orderData?.order_status?.at(-1)?.toLowerCase() ===
                            "cancelled" ? (
                            <div className="flex gap-1 border border-[#B92020] px-1 py-1 rounded-[4px] items-center">
                              <Close
                                style={{ color: "#B92020", fontSize: "16px" }}
                              />
                              <p className="text-[#B92020] font-semibold text-xs ">
                                Not in stock
                              </p>
                            </div>
                          ) : orderData.order_status?.at(-1)?.toLowerCase() ===
                            "accepted" ? (
                            orderData?.deliveryDetails !== null &&
                            orderData?.deliveryDetails?.address !== "" ? (
                              <div className="flex gap-1 bg-[#FEF8D8] border border-[#E7C339] px-1 py-[2px] rounded-[4px] items-center">
                                <img src={personAlert} alt="Person Alert" />
                                <p className="text-[#9B7000] font-semibold text-xs ">
                                  Unassigned
                                </p>
                              </div>
                            ) : (
                              <div className="flex gap-1 bg-[#DFF6DD] border border-[#2B8C34] px-1 py-1 rounded-[4px] items-center">
                                <Check
                                  style={{ color: "#2B8C34", fontSize: "16px" }}
                                />
                                <p className="text-[#2B8C34] font-semibold text-xs ">
                                  Confirmed
                                </p>
                              </div>
                            )
                          ) : (
                            <div className="flex gap-1 bg-[#FFFCC5] px-1 py-1 rounded-[4px] items-center">
                              <HourglassBottom
                                style={{ color: "#D4A407", fontSize: "16px" }}
                              />
                              <p className="text-[#D4A407] font-semibold text-xs ">
                                Pending
                              </p>
                            </div>
                          )}

                          <div className="flex gap-1 border border-[#C4CBC5] px-1 py-1 rounded-[4px] items-center">
                            <ErrorOutline
                              style={{ color: "#5F6D60", fontSize: "16px" }}
                            />
                            <p className="text-[#96A397] font-semibold text-xs ">
                              5 Items in stock
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            <p className="text-[#79887B] font-semibold text-xs pb-1">
                              Item Name
                            </p>
                            <p className="text-[#2E332F] font-semibold text-xs ">
                              {type === "Input"
                                ? orderData?.input_product?.name || "N/A"
                                : type === "Advisory"
                                ? orderData?.advisory_product?.name || "N/A"
                                : type === "Mechanization"
                                ? orderData?.mechanization_product?.name ||
                                  "N/A"
                                : type === "Insurance"
                                ? orderData?.insurance_product?.name || "N/A"
                                : type === "Livestock"
                                ? orderData?.livestock_input_product?.name ||
                                  "N/A"
                                : null}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#79887B] font-semibold text-xs pb-1">
                              Quantity
                            </p>
                            <p className="text-[#2E332F] font-semibold text-xs ">
                              {orderData?.quantity || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#79887B] text-end font-semibold text-xs pb-1">
                              Price
                            </p>
                            <p className="text-[#2E332F] text-end font-semibold text-xs ">
                              ₦{" "}
                              {parseFloat(
                                orderData?.total_display_price
                              )?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || "N/A"}
                              /10kgs
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <div>
                      <Alternatives />
                    </div> */}
                      <div className="flex gap-3 w-full">
                        {orderData?.order_status?.at(-1)?.toLowerCase() ===
                          "delivered" ||
                        orderData?.order_status?.at(-1)?.toLowerCase() ===
                          "cancelled" ||
                        orderData.order_status?.at(-1)?.toLowerCase() ===
                          "rejected" ||
                        orderData?.order_status?.at(-1)?.toLowerCase() ===
                          "cancelled" ? null : (
                          <div>
                            <div className="flex mt-3 gap-4 w-full">
                              {orderData?.order_status
                                ?.at(-1)
                                // Adding permission for showing assign manager button
                                ?.toLowerCase() === "accepted" &&
                              hasPermission(user, PRIVILEGES.ASSIGN_ORDER) ? (
                                orderData?.delivery_details !== null &&
                                orderData?.delivery_details?.address !== "" ? (
                                  <AssignStoreManager />
                                ) : (
                                  <button
                                    disabled
                                    className="disabled:bg-[#ABB6AC] text-white text-sm h-[36px] px-5 bg-[#2B8C34] rounded-[8px] font-medium transition-all"
                                  >
                                    <Tooltip title="Edit Delivery Details To Continue">
                                      <span>Confirmed</span>
                                    </Tooltip>
                                  </button>
                                )
                              ) : (
                                // Disabling the confirm button if user doesn't have permission
                                <button
                                  onClick={() => {
                                    setConfirmModal(true);
                                  }}
                                  disabled={
                                    !hasPermission(
                                      user,
                                      PRIVILEGES.CONFIRM_ORDER
                                    )
                                  }
                                  className="text-white disabled:bg-[#ABB6AC] text-sm h-[36px] px-5 bg-[#2B8C34] hover:bg-opacity-[0.9] rounded-[8px] font-medium transition-all"
                                >
                                  Confirm
                                </button>
                              )}

                              <>
                                {orderData?.order_status
                                  ?.at(-1)
                                  ?.toLowerCase() === "accepted" ? (
                                  <button
                                    disabled
                                    onClick={() => setNotInStockModal(true)}
                                    className=" h-[36px] disabled:bg-[#F6F7F6] disabled:bg-opacity-[0.9] text-[#96A397] text-sm  px-5 bg-[#F6F7F6] rounded-[8px] font-medium transition-all"
                                  >
                                    Cancel
                                  </button>
                                ) : (
                                  // Disabling the not in stock button if user doesn't have permission
                                  <button
                                    onClick={() => setNotInStockModal(true)}
                                    disabled={
                                      !hasPermission(
                                        user,
                                        PRIVILEGES.REJECT_ORDER
                                      )
                                    }
                                    className=" h-[36px] disabled:bg-[#FEF0EC] disabled:bg-opacity-[0.9] text-[#B92043] text-sm  px-5 bg-[#FEF0EC] rounded-[8px] font-medium transition-all"
                                  >
                                    Not In Stock
                                  </button>
                                )}
                              </>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    {orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "delivered" ||
                    orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "cancelled" ||
                    orderData.order_status?.at(-1)?.toLowerCase() ===
                      "rejected" ||
                    orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "cancelled" ? null : (
                      <div className="border border-[#E1E6E1] rounded-b-lg  py-3 px-4 bg-white flex gap-2 items-center w-full">
                        <ErrorOutline
                          style={{ color: "#79887B", fontSize: "16px" }}
                        />
                        <p className="text-[#79887B] font-semibold text-xs cursor-pointer">
                          By confirming this order is in stock you are accepting
                          the order
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="border border-[#E1E6E1] rounded-t-[8px] py-3 bg-white flex justify-between items-center mt-3">
                    <OrderTimeline />
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            {/* NOTES SECTION */}
            <NoteSection notes={notes} />
          </div>

          {/* ALL MODALS SECTION */}
          <section>
            {/* accept, dispatch order modal */}
            <ModalComponent
              show={show}
              showModal={showModal}
              title={
                orderType === "processing"
                  ? "Dispatch Order"
                  : orderType === "pending"
                  ? "  Process Order"
                  : orderType === "dispatched"
                  ? " Confirm Order Delivery"
                  : "N/A"
              }
              subtitle=""
            >
              <div className="mt-4">
                <h6 className="text-[#5C715E] font-medium text-sm">
                  {orderType === "processing"
                    ? " Are you sure you want to accept and dispatch this order?"
                    : orderType === "pending"
                    ? "  Are you sure you want to accept and process this order?"
                    : orderType === "dispatched"
                    ? "   Are you sure the order has been delivered?"
                    : "N/A"}
                </h6>
              </div>

              <div className="flex justify-end mt-8 mb-3">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    onClick={handleChangeOrderType}
                    className="bg-primary 
                disabled={false}
                           disabled:bg-[#ABB6AC] 
                           rounded-lg px-6 py-3 text-white text-sm font-medium hover:bg-[#24752B] transition-all"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShow(false)}
                    type="submit"
                    disabled={false}
                    className="rounded-lg px-6 py-3 text-[#2B8C34] text-sm font-medium transition-all"
                  >
                    No
                  </button>
                </div>
              </div>
            </ModalComponent>

            {/* confirm delivery modal */}
            <ModalComponent
              show={deliveryModal}
              showModal={showDeliveryModal}
              title="Confirm Order Delivery"
              subtitle=""
            >
              <div className="mt-4">
                <h6 className="text-[#5C715E] font-medium text-sm">
                  Are you sure the order has been delivered?
                </h6>
              </div>

              <div className="flex justify-end mt-8 mb-3">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={false}
                    className="bg-primary 
                           disabled:bg-[#ABB6AC] 
                           rounded-lg px-6 py-3 text-white text-sm font-medium hover:bg-[#24752B] transition-all"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeliveryModal(false)}
                    type="submit"
                    disabled={false}
                    className="rounded-lg px-6 py-3 text-[#2B8C34] text-sm font-medium transition-all"
                  >
                    No
                  </button>
                </div>
              </div>
            </ModalComponent>

            {/* confirm order modal */}

            <ModalComponent
              show={confirmModal}
              showModal={showConfirmModal}
              title="Confirm Order"
              subtitle=""
            >
              <div className="text-sm text-[#4B564D] font-medium">
                Confirm that this{" "}
                <span className="font-semibold text-[#2E332F]">
                  order is in stock
                </span>{" "}
                to proceed.
              </div>
              {/* Grey container for item information */}

              <div className="flex mt-2 mb-2 flex-col rounded-md px-2 py-3 bg-[#F6F7F6] border border-[#E1E6E1]">
                <div className="flex items-center gap-2 mb-2 text-sm text-[#79887B] font-semibold">
                  <p>Item Name:</p>
                  <div
                    className={`${
                      type ? "w-fit" : "w-8 h-1"
                    }bg-white border items-center text-[#4B564D] border-[#E1E6E1] px-0.5 py-1 rounded-md`}
                  >
                    {type === "Input"
                      ? orderData?.input_product?.name || "N/A"
                      : type === "Advisory"
                      ? orderData?.advisory_product?.name || "N/A"
                      : type === "Mechanization"
                      ? orderData?.mechanization_product?.name || "N/A"
                      : type === "Insurance"
                      ? orderData?.insurance_product?.name || "N/A"
                      : type === "Livestock"
                      ? orderData?.livestock_input_product?.name || "N/A"
                      : null}
                  </div>
                </div>
                {/* Quantity and Items in Stock */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-1 text-sm text-[#79887B] font-semibold">
                    <p>Quantity:</p>
                    <div
                      className={`${
                        orderData?.quantity ? "w-fit" : "w-8 h-1"
                      }bg-white border items-center text-[#4B564D] border-[#E1E6E1] px-0.5 py-1 rounded-md`}
                    >
                      {orderData?.quantity || "N/A"}
                    </div>
                  </div>
                  {/* Items in stock */}
                  <div className="flex rounded-[4px] gap-1 items-center font-semibold w-fit px-1 py-0.5 border border-[#C4CBC5] ">
                    <img src={error} alt="error" />
                    <p className="text-xs text-[#5F6D60]">5 Item(s) in stock</p>
                  </div>
                </div>
              </div>
              {/* Once confirmed ..... */}
              <div className="text-sm font-medium mb-8 text-[#4B564D] ">
                Once confirmed, the order will be accepted and assigned to the{" "}
                <br />
                Customer Success team for delivery confirmation
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-5 ">
                {/* Cancel Button */}
                <button
                  className="px-5 py-2 text-[#5C715E] text-sm"
                  onClick={() => setConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={
                    confirmOrderLoading ||
                    orderData?.order_status?.at(-1)?.toLowerCase() ===
                      "accepted"
                  }
                  className="px-5 py-2 rounded-[8px] bg-[#2B8C34] text-sm text-white disabled:bg-[#ABB6AC] disabled:border-[#ABB6AC] disabled:cursor-not-allowed"
                  onClick={handleAcceptOrder}
                >
                  {confirmOrderLoading ? (
                    <ThreeDots
                      height={20}
                      width={20}
                      color="#FFF"
                      visible={true}
                      secondaryColor="#FFF"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  ) : (
                    "Confirm Order"
                  )}
                </button>
              </div>
            </ModalComponent>

            {/* not in stock modal */}

            <ModalComponent
              show={notInStockModal}
              showModal={showNotinStockModal}
              title="Order Not In Stock"
              subtitle=""
            >
              <div className="text-sm text-[#4B564D] font-medium">
                This product is not available
              </div>
              {/* Grey container for item information */}
              <div className="flex mt-2 mb-2 flex-col rounded-md px-2 py-3 bg-[#F6F7F6] border border-[#E1E6E1]">
                <div className="flex gap-2 items-center mb-2 text-sm text-[#79887B] font-semibold">
                  <p>Item Name:</p>
                  <div
                    className={`${
                      type ? "w-fit" : "w-8 h-1"
                    }bg-white border items-center border-[#E1E6E1] px-0.5 py-1 rounded-md`}
                  >
                    {" "}
                    {type === "Input"
                      ? orderData?.input_product?.name || "N/A"
                      : type === "Advisory"
                      ? orderData?.advisory_product?.name || "N/A"
                      : type === "Mechanization"
                      ? orderData?.mechanization_product?.name || "N/A"
                      : type === "Insurance"
                      ? orderData?.insurance_product?.name || "N/A"
                      : type === "Livestock"
                      ? orderData?.livestock_input_product?.name || "N/A"
                      : null}
                  </div>
                </div>
                {/* Quantity and Items in Stock */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-1 text-sm text-[#79887B] font-semibold">
                    <p>Quantity:</p>
                    <div
                      className={`${
                        orderData?.quantity ? "w-fit" : "w-8 h-1"
                      }bg-white border items-center border-[#E1E6E1] px-0.5 py-1 rounded-md`}
                    >
                      {orderData?.quantity || "N/A"}
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
                  onChange={() => setIsAlternative(!isAlternative)}
                  className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
                />
                <span className="font-semibold text-sm text-[#4B564D]">
                  Suggest Alternative{" "}
                </span>{" "}
                - Select a replacement product
              </label>{" "} */}
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
                <button
                  className="px-5 py-2 text-[#5C715E]"
                  onClick={() => {
                    setNotInStockModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!isAlternative && !isRejected}
                  className={`px-5 py-2 rounded-lg text-sm font-medium text-white ${
                    isRejected || isAlternative
                      ? "bg-[#2B8C34]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </ModalComponent>

            {/* Rejection Note Modal */}
            <ModalComponent
              show={rejectNoteModal}
              showModal={showRejectNoteModal}
              title="Add a Rejection Note"
              subtitle="Since the product is not available and no alternative was selected, add a note for the Customer Success team to inform the farmer."
            >
              <div className="mt-2">
                {/* Product is completely unavailable  */}
                <label
                  className={
                    "text-sm flex gap-2 mb-2 items-center cursor-pointer"
                  }
                >
                  <input
                    type="radio"
                    value={"Product is completely unavailable"}
                    name="option"
                    checked={isUnavailable}
                    onChange={(e) => {
                      setIsUnavailable(!isUnavailable);
                      setCustomBody(e.target.value);
                    }}
                    className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
                  />
                  Product is completely unavailable
                </label>
                {/* No suitable alternative available */}
                <label className="text-sm flex gap-2 mb-2 items-center cursor-pointer">
                  <input
                    type="radio"
                    name="option"
                    value={"No suitable alternative available"}
                    checked={noAlternative}
                    onChange={(e) => {
                      setNoAlternative(!noAlternative);
                      setCustomBody(e.target.value);
                    }}
                    className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
                  />
                  No suitable alternative available
                </label>

                {/* Custom Note */}
                <div className="flex items-start gap-2 mb-8">
                  <label className="flex text-sm gap-2 items-center cursor-pointer mb-8">
                    <input
                      type="radio"
                      name="option"
                      checked={isCustomNote}
                      onChange={() => setIsCustomNote(!isCustomNote)}
                      className="w-4 h-4 border border-[#5F6D60] text-sm font-medium text-[#4B564D]"
                    />
                  </label>
                  <div className="w-full">
                    <div className="flex items-center border p-3 rounded-t-md border-b-[#E1E6E1]">
                      <h3 className="text-sm font-semibold text-[#4B564D]">
                        Custom note
                      </h3>
                    </div>
                    <div className="flex flex-col border p-3 rounded-b-md">
                      <input
                        type="text"
                        placeholder="Title"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full p-3 text-sm font-semibold bg-[#F6F7F6] border rounded-md border-[#E1E6E1] text-[#5F6D60]"
                      />
                      <textarea
                        placeholder="Body"
                        value={customBody}
                        onChange={(e) => setCustomBody(e.target.value)}
                        className="w-full min-h-[100px] resize-none p-3 text-sm font-semibold bg-[#F6F7F6] border rounded-md mt-2 border-[#E1E6E1] text-[#5F6D60]"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between mb-8">
                  <button
                    className="px-5 py-2 text-sm text-[#5C715E]"
                    onClick={() => {
                      setRejectNoteModal(false);
                      setNotInStockModal(true);
                    }}
                  >
                    Back
                  </button>

                  <div className="flex gap-5">
                    <button
                      className="px-5 py-2 text-sm text-[#5C715E]"
                      onClick={() => {
                        setRejectNoteModal(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={rejectLoading || customBody === ""}
                      className="px-5 py-2 text-sm bg-[#B92020] text-white rounded-[8px] disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleRejectOrder}
                    >
                      Reject Order
                    </button>
                  </div>
                </div>
              </div>
            </ModalComponent>

            {/* reject order modal */}
            <ModalComponent
              show={rejectModal}
              showModal={showRejectModal}
              title="Reject Order"
              subtitle=""
            >
              <div className="mt-4">
                <h6 className="text-[#5C715E] font-medium text-sm">
                  Are you sure you want to reject this order?
                </h6>
              </div>

              <div className="flex justify-end mt-8 mb-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleRejectChangeStatus}
                    type="submit"
                    disabled={false}
                    className="bg-[#B92043] 
                           disabled:bg-[#B92043] hover:bg-opacity-[0.9]
                           rounded-lg px-6 py-3 text-white text-sm font-medium hover:bg-[#B92043] transition-all"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setRejectModal(false)}
                    type="submit"
                    disabled={false}
                    className="rounded-lg px-6 py-3 text-[#5C715E] text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </ModalComponent>

            {/* order history modal */}
            <ModalComponent
              show={historyModal}
              showModal={showHistoryModal}
              title="Order History"
              subtitle=""
            >
              <div>
                {orderData?.order_history?.length === 0 ? (
                  <div className="h-[160px] w-full flex justify-center items-center">
                    <p className="text-sm leading-5 font-semibold text-[#344335]">
                      No status update yet
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 mb-6">
                    {orderData?.order_history?.map((data, index) => {
                      return (
                        <div>
                          <div className="mb-4" key={index}>
                            <h6 className="text-[#344335] text-sm font-semibold capitalize">
                              {data?.update_by || "N/A"}
                            </h6>
                            {index === 0 ? (
                              <p className="text-[#7C8D7E] text-xs font-medium mt-1">
                                Changed{" "}
                                <span className="font-semibold text-[#344335]">
                                  Order Status from{" "}
                                  <span
                                    className={`capitalize ${
                                      orderData?.order_status?.at(0) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(0) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(0) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(0) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(0) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(0)
                                      ?.toLowerCase()}{" "}
                                  </span>
                                  to{" "}
                                  <span
                                    className={` capitalize ${
                                      orderData?.order_status?.at(1) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(1) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(1) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(1) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(1) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(1)
                                      ?.toLowerCase()}
                                  </span>
                                </span>{" "}
                              </p>
                            ) : index === 1 ? (
                              <p className="text-[#7C8D7E] text-xs font-medium mt-1">
                                Changed{" "}
                                <span className="font-semibold text-[#344335]">
                                  Order Status from{" "}
                                  <span
                                    className={` capitalize ${
                                      orderData?.order_status?.at(1) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(1) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(1) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(1) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(1) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(1)
                                      ?.toLowerCase()}
                                  </span>{" "}
                                  to{" "}
                                  <span
                                    className={` capitalize ${
                                      orderData?.order_status?.at(2) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(2) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(2) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(2) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(2) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(2)
                                      ?.toLowerCase()}
                                  </span>
                                </span>{" "}
                              </p>
                            ) : index === 2 ? (
                              <p className="text-[#7C8D7E] text-xs font-medium mt-1">
                                Changed{" "}
                                <span className="font-semibold text-[#344335]">
                                  Order Status from{" "}
                                  <span
                                    className={`capitalize ${
                                      orderData?.order_status?.at(2) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(2) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(2) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(2) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(2) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(2)
                                      ?.toLowerCase()}
                                  </span>{" "}
                                  to{" "}
                                  <span
                                    className={`capitalize ${
                                      orderData?.order_status?.at(3) ===
                                      "PENDING"
                                        ? "text-[#b92043]"
                                        : orderData?.order_status?.at(3) ===
                                          "PROCESSING"
                                        ? "text-[#d5a407]"
                                        : orderData?.order_status?.at(3) ===
                                          "DISPATCHED"
                                        ? "text-[#0066AF]"
                                        : orderData?.order_status?.at(3) ===
                                          "DELIVERED"
                                        ? "text-[#2b8c34]"
                                        : orderData?.order_status?.at(3) ===
                                          "CANCELLED"
                                        ? "text-[#b92043]"
                                        : null
                                    } `}
                                  >
                                    {orderData?.order_status
                                      ?.at(3)
                                      ?.toLowerCase()}
                                  </span>
                                </span>{" "}
                              </p>
                            ) : null}

                            <p className="text-[#344335] text-xs font-medium mt-1">
                              {moment(data?.update_date).format("LLL")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </ModalComponent>

            {/* request refund modal */}
            <ModalComponent
              show={refundModal}
              showModal={showRefundModal}
              title="Refund Application"
              subtitle=""
            >
              <div className="mt-6 mb-6">
                <Formik
                  onSubmit={(values, { setSubmitting }) =>
                    handleSubmit(values, setSubmitting)
                  }
                  validationSchema={refundApplicationValidator}
                  initialValues={{
                    orderID: `${orderData?.id}`,
                    cost: `${orderData?.total_display_price}`,
                    refundAmount: "",
                    description: "",
                  }}
                >
                  {({
                    handleChange,
                    isSubmitting,
                    handleSubmit,
                    handleBlur,
                    values,
                    touched,
                    errors,
                  }) => (
                    <Form className="mt-8" onSubmit={handleSubmit}>
                      <div>
                        <label
                          htmlFor="orderID"
                          className="block mb-2 text-[#344335] text-sm font-normal"
                        >
                          Order ID
                        </label>
                        <input
                          type="text"
                          disabled
                          name="orderID"
                          placeholder="Order ID"
                          className={
                            touched.orderID && errors.orderID
                              ? "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm  text-[#344335] text-base focus:border-[#B92043] focus:outline-none rounded-lg border border-[#B92043] bg-white py-3 px-4"
                              : "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm text-[#344335] text-base focus:border-[#2B8C34] focus:outline-none focus:shadow-input rounded-lg border border-[#96A397] bg-white py-3 px-4"
                          }
                          value={values.orderID}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.orderID && errors.orderID ? (
                          <div className="flex">
                            <img src={warning} className="" alt="warning" />
                            <small className="text-[#B92043] font-medium text-xs pl-[5.65px] pt-[4px]">
                              {touched.orderID && errors.orderID}
                            </small>
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label
                            htmlFor="cost"
                            className="block mb-2 text-[#344335] text-sm font-normal"
                          >
                            Cost
                          </label>
                          <input
                            type="number"
                            disabled
                            name="cost"
                            placeholder="Enter cost"
                            className={
                              touched.cost && errors.cost
                                ? "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm  text-[#344335] text-base focus:border-[#B92043] focus:outline-none rounded-lg border border-[#B92043] bg-white py-3 px-4"
                                : "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm text-[#344335] text-base focus:border-[#2B8C34] focus:outline-none focus:shadow-input rounded-lg border border-[#96A397] bg-white py-3 px-4"
                            }
                            value={values.cost}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched.cost && errors.cost ? (
                            <div className="flex">
                              <img src={warning} className="" alt="warning" />
                              <small className="text-[#B92043] font-medium text-xs pl-[5.65px] pt-[4px]">
                                {touched.cost && errors.cost}
                              </small>
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <label
                            htmlFor="refundAmount"
                            className="block mb-2 text-[#344335] text-sm font-normal"
                          >
                            Refund Amount
                          </label>
                          <input
                            type="text"
                            name="refundAmount"
                            placeholder="Enter refund amount"
                            className={
                              touched.refundAmount && errors.refundAmount
                                ? "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm  text-[#344335] text-base focus:border-[#B92043] focus:outline-none rounded-lg border border-[#B92043] bg-white py-3 px-4"
                                : "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm text-[#344335] text-base focus:border-[#2B8C34] focus:outline-none focus:shadow-input rounded-lg border border-[#96A397] bg-white py-3 px-4"
                            }
                            value={values.refundAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched.refundAmount && errors.refundAmount ? (
                            <div className="flex">
                              <img src={warning} className="" alt="warning" />
                              <small className="text-[#B92043] font-medium text-xs pl-[5.65px] pt-[4px]">
                                {touched.refundAmount && errors.refundAmount}
                              </small>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-[#344335] text-sm font-normal"
                        >
                          Request Description
                        </label>
                        <textarea
                          id="description"
                          rows="6"
                          className={
                            touched.description && errors.description
                              ? "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm  text-[#344335] text-base focus:border-[#B92043] focus:outline-none rounded-lg border border-[#B92043] bg-white py-3 px-4"
                              : "appearance-none w-full placeholder:text-[#96A397] placeholder:text-sm text-[#344335] text-base focus:border-[#2B8C34] focus:outline-none focus:shadow-input rounded-lg border border-[#96A397] bg-white py-3 px-4"
                          }
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter a description"
                        ></textarea>
                        {touched.description && errors.description ? (
                          <div className="flex">
                            <img src={warning} className="" alt="warning" />
                            <small className="text-[#B92043] font-medium text-xs pl-[5.65px] pt-[4px]">
                              {touched.description && errors.description}
                            </small>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={false}
                          className="bg-primary 
                            disabled:bg-[#ABB6AC] 
                            rounded-lg w-full py-4 text-white font-medium hover:bg-[#24752B] transition-all"
                        >
                          Request Refund
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </ModalComponent>

            {/* Delivery Details Modal */}
            <DeliveryDetailsModal
              deliveryDetailsModal={deliveryDetailsModal}
              showDeliveryDetailsModal={showDeliveryDetailsModal}
              setDeliveryDetailsModal={setDeliveryDetailsModal}
              setDeliveryDetails={setDeliveryDetails}
              deliveryDetails={deliveryDetails}
              id={id}
            />

            {/* ALTERNATIVE */}
            <AlternativeModal
              setNotInStockModal={setNotInStockModal}
              isShowAlternative={isShowAlternative}
              setShowAlternative={setShowAlternative}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default OrderInfoPage;
