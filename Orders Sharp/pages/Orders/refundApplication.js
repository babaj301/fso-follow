import React, { useEffect, useState } from "react";
import GoBack from "../../components/GoBack";
import Header from "../../components/Header";
import ModalComponent from "../../components/Modals/modal";
import copy_icon from "../../assets/icons/copy_black.svg";
import { useDispatch, useSelector } from "react-redux";
import { refundsApproval, refundsInfo } from "../../redux/Orders/ordersAction";
import { useParams } from "react-router-dom";

const RefundApplicationPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { refundsInfoLoading, refundsInfoData, refundsApprovalLoading } =
    useSelector((state) => state.orders);
  const [show, setShow] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  console.log(userInfo);

  const showModal = () => {
    setShow(!show);
  };

  const showRejectModal = () => {
    setRejectModal(!rejectModal);
  };

  const handleApproveRefunds = () => {
    dispatch(refundsApproval({ id: id, value: "APPROVED" }));

    setTimeout(() => {
      setShow(false);
      dispatch(refundsInfo({ id: id }));
    }, 800);
  };

  const handleRejectRefunds = () => {
    dispatch(refundsApproval({ id: id, value: "DENIED" }));

    setTimeout(() => {
      setRejectModal(false);
      dispatch(refundsInfo({ id: id }));
    }, 800);
  };

  useEffect(() => {
    dispatch(refundsInfo({ id: id }));
  }, [dispatch, id]);

  return (
    <>
      {/* accept refund modal */}
      <ModalComponent
        show={show}
        showModal={showModal}
        title="Approve Refund Application?"
        subtitle=""
      >
        <div className="mt-6">
          <h6 className="text-[#5C715E] font-medium text-sm">
            Are you sure you want to accept this farmer’s Refund Application?
          </h6>
          <p className="text-[#344335] font-semibold text-sm">
            N{refundsInfoData?.refund_amount || 0} will be paid to{" "}
            {refundsInfoData?.name?.toLowerCase() || 0}
          </p>
        </div>

        <div className="flex justify-end mt-8 mb-3">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={refundsApprovalLoading}
              onClick={handleApproveRefunds}
              className="bg-primary 
                           disabled:bg-[#ABB6AC] 
                           rounded-lg px-8 py-3 text-white text-sm font-medium hover:bg-[#24752B] transition-all"
            >
              Approve
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

      {/* reject refund modal */}
      <ModalComponent
        show={rejectModal}
        showModal={showRejectModal}
        title="Reject Refund Application?"
        subtitle=""
      >
        <div className="mt-6">
          <h6 className="text-[#5C715E] font-medium text-sm">
            Are you sure you want to reject this farmer’s Refund Application?
          </h6>
          <p className="text-[#344335] font-semibold text-sm">
            N{refundsInfoData?.refund_amount || 0} would not be paid to{" "}
            {refundsInfoData?.name?.toLowerCase() || 0}
          </p>
        </div>

        <div className="flex justify-end mt-8 mb-3">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={refundsApprovalLoading}
              onClick={handleRejectRefunds}
              className="bg-[#B92043] 
                           disabled:bg-[#B92043] hover:bg-opacity-[0.9] disabled:bg-opacity-[0.9]
                           rounded-lg px-8 py-3 text-white text-sm font-medium hover:bg-[#B92043] transition-all"
            >
              Reject
            </button>
            <button
              onClick={() => setRejectModal(false)}
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
        <Header text="Refund Application" />
      </div>

      <div>
        {refundsInfoLoading ? (
          <p className="text-center mt-[90px]">Loading...</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg py-4 px-4 bg-white">
              <p className="text-[#7C8D7E] font-semibold text-sm">Order Info</p>
              <div className="mt-4">
                <p className="text-[#7C8D7E] text-sm">Order ID</p>
                <div className="flex gap-1 items-center">
                  <h6 className="text-[#344335] font-medium text-sm">
                    {refundsInfoData?.order_id || "N/A"}
                  </h6>
                  <img src={copy_icon} alt="copy icon" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[#7C8D7E] text-sm">Refund Description</p>
                <p className="text-[#344335] font-medium text-sm">
                  {refundsInfoData?.refund_reason || "N/A"}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <div className="bg-white rounded-lg py-4 px-4 flex justify-between items-center">
                <div>
                  <p className="text-[#7C8D7E] text-sm font-semibold">
                    Refund Amount
                  </p>
                  <h6 className="text-[#2B8C34] font-semibold text-lg">
                    ₦{refundsInfoData?.refund_amount || "N/A"}
                  </h6>
                </div>
              </div>
              <div className="bg-white rounded-lg py-4 px-4 mt-3">
                <p className="text-[#7C8D7E] font-semibold text-sm">
                  Item Details{" "}
                </p>

                <div className="mt-4 flex justify-between">
                  <div>
                    <h6 className="text-[#7C8D7E] text-sm">Item Name</h6>
                    <p className="text-[#344335] font-medium text-sm mt-1">
                      {refundsInfoData?.product_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-[#7C8D7E] text-sm">Vendor</h6>
                    <p className="text-[#344335] font-medium text-sm mt-1">
                      {refundsInfoData?.vendor || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-[#7C8D7E] text-sm">Quantity</h6>
                    <p className="text-[#344335] font-medium text-sm mt-1">
                      {" "}
                      {refundsInfoData?.quantity || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-[#7C8D7E] text-sm">Price</h6>
                    <p className="text-[#344335] font-medium text-sm mt-1">
                      ₦{refundsInfoData?.cost || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h6 className="text-[#7C8D7E] capitalize text-sm">
                      Refund Status
                    </h6>
                    <div
                      className={`flex mt-1 ${refundsInfoData?.approval_status === "PENDING"
                        ? "pending-badge"
                        : refundsInfoData?.approval_status === "DENIED"
                          ? "error-badge"
                          : refundsInfoData?.approval_status === "APPROVED"
                            ? "success-badge"
                            : "n/a-badge"
                        }
                       
                      `}
                    >
                      <p className="capitalize">
                        {refundsInfoData.approval_status === "APPROVED"
                          ? "Approved"
                          : refundsInfoData.approval_status === "DENIED"
                            ? "Rejected"
                            : refundsInfoData.approval_status === "PENDING"
                              ? "Pending"
                              : null}
                      </p>
                    </div>
                  </div>
                </div>


                <>
                  {refundsInfoData?.approval_status === "PENDING" && (
                    <div className="flex mt-6 gap-4">
                      <button
                        onClick={() => showModal()}
                        className="py-3 disabled:bg-[#ABB6AC] text-white text-sm  px-5 bg-[#2B8C34] hover:bg-opacity-[0.9] rounded-[8px] font-medium transition-all"
                      >
                        Approve Refund
                      </button>
                      <button
                        onClick={() => showRejectModal()}
                        className="py-3 disabled:bg-[#FEF0EC] disabled:bg-opacity-[0.9] text-[#B92043] text-sm  px-5 bg-[#FEF0EC] rounded-[8px] font-medium transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </>


              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RefundApplicationPage;
