import React from "react";
import {
  Alternative,
  DeliveryDetails,
  NotInStock,
  OrderPlaced,
  StockConfirmation,
} from "../../components/Order/OrderPlaced";

const OrderTimeline = () => {
  return (
    <div className="w-full">
      {" "}
      <p className="text-[#4B564D] font-semibold text-sm w-full mb-2 px-4 ">
        Timeline
      </p>
      <div className="w-full h-[1px] bg-[#E4E7E0]" />
      <DeliveryDetails
        name={"Azeez Olayemi"}
        time={"Now"}
        department={"Customer Success Team"}
      />
      {/* <Alternative
        name={"Celina Avong"}
        time={"Mar 27, 2023 02:36 PM"}
        department={" Sales Department"}
      /> */}
      <NotInStock
        name={"Celina Avong"}
        time={"Mar 27, 2023 02:36 PM"}
        department={" Sales Department"}
      />
      <StockConfirmation
        name={"Celina Avong"}
        time={"Mar 27, 2023 02:36 PM"}
        department={" Sales Department"}
      />
      <OrderPlaced
        name={"Abubakar Jesam"}
        time={"Mar 27, 2023 02:36 PM"}
        paymentStatus={true}
      />
    </div>
  );
};

export default OrderTimeline;
