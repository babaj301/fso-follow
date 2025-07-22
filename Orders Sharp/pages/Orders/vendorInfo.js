import { ContentCopy } from "@mui/icons-material";
import React, { useEffect } from "react";
import GoBack from "../../components/GoBack";
import VendorInfoTable from "../../tables/Orders/vendorInfoTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { vendorDetails } from "../../redux/Orders/ordersAction";

const VendorInfoPage = () => {
  const { id, product_type } = useParams();
  const dispatch = useDispatch();
  const { vendorDetailsData } = useSelector((state) => state.orders);
  const vendorName = sessionStorage.getItem("vendorName");

  useEffect(() => {
    dispatch(vendorDetails({ id: id, orderType: product_type }));
  }, [dispatch, id, product_type]);

  return (
    <>
      <GoBack />
      <div className="mt-4 bg-white rounded-lg py-4 px-4">
        <div className="flex gap-3">
          <div className="flex justify-center items-center rounded-full bg-[#2B8C34] w-[48px] h-[48px] text-white font-medium text-[15px]">
            <p>{vendorName.charAt(0).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-lg font-semibold">
              {vendorDetailsData?.supplier_info?.organization?.name ||
                vendorName ||
                "N/A"}
            </p>
            <div className="flex gap-1 items-center">
              <p className="text-primary text-sm font-medium">
                {vendorDetailsData?.supplier_info?.organization?.phone_number ||
                  "N/A"}
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
              {vendorDetailsData?.supplier_info?.user?.email || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Category</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorDetailsData?.product_type || "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Account Number</p>
            <div className="flex gap-1 items-center">
              <h6 className="text-[#2B8C34] text-sm font-medium mt-1">
                {vendorDetailsData?.supplier_info?.organization
                  ?.account_number || "N/A"}
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
              {vendorDetailsData?.supplier_info?.organization?.account_name ||
                vendorDetailsData?.supplier_info?.organization
                  ?.wallet_provider ||
                "N/A"}
            </h6>
          </div>
          <div>
            <p className="text-[#7C8D7E] text-sm">Address</p>
            <h6 className="text-[#344335] text-sm font-medium mt-1">
              {vendorDetailsData?.supplier_info?.organization?.address || "N/A"}
            </h6>
          </div>
        </div>
      </div>
      <VendorInfoTable productType={product_type} id={id} />
    </>
  );
};

export default VendorInfoPage;
