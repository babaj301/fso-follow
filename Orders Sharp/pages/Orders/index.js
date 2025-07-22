import React, { useEffect } from "react";
import { Card, CardWithBorderStatus } from "../../components/Cards";
import Header from "../../components/Header";
import OrderTable from "../../tables/Orders";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersStats } from "../../redux/Orders/ordersAction";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { ordersStatsData } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrdersStats());
  }, [dispatch]);

  return (
    <>
      <Header text="Orders" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <CardWithBorderStatus
          title="Overdue Orders"
          subtitle={`${ordersStatsData?.overdue_orders_count || 0}`}
          color="border-l-[#B92043]"
          href="/orders/overdue-orders"
          hasStatus
          status="Urgent"
        />
        <CardWithBorderStatus
          title="Vendor Payments"
          subtitle={`${ordersStatsData?.payments_count || 0}`}
          color="border-l-[#B92043]"
          href="/orders/vendor-payments"
          hasStatus
          status="Urgent"
        />
        <CardWithBorderStatus
          title="Refunds"
          subtitle={`${ordersStatsData?.refunds_count || 0}`}
          color="border-l-[#B92043]"
          href="/orders/refunds"
          hasStatus
          status="Urgent"
        />
        <Card
          title="Vendors"
          subtitle={`${ordersStatsData?.vendors_count || 0}`}
          href="/orders/vendors"
        />
      </div>
      <OrderTable />
    </>
  );
};

export default OrdersPage;
