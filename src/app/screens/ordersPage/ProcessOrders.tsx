import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveProcessOrders } from "./selector";
import { serverApi, Messages } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { styled } from "@mui/material/styles";
import moment from "moment";

// ✅ REDUX SELECTOR
const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);

// ✅ Styled components (PausedOrders dizayniga mos)
const OrderCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: theme.spacing(2),
}));

const OrderTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "16px",
});

const OrderStatusLabel = styled(Box)<{ status: string }>(({ status }) => ({
  padding: "2px 8px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: "12px",
  color: "#fff",
  backgroundColor:
    status === "PROCESS"
      ? "#1976d2"
      : status === "PAUSE"
        ? "#ff9800"
        : "#4caf50",
}));

const ProcessOrders: React.FC<{ setValue: (val: string) => void }> = ({
  setValue,
}) => {
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);

  const finishOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const input = {
        orderId,
        orderStatus: OrderStatus.FINISH,
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const orderService = new OrderService();
        await orderService.updateOrder(input);
        setValue("3"); // Finished Orders tab
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="2">
      <Stack>
        {processOrders && processOrders.length > 0 ? (
          processOrders.map((order: Order) => (
            <OrderCard key={order._id}>
              <OrderTitle>{`Order #${order._id}`}</OrderTitle>
              <OrderStatusLabel status="PROCESS">IN PROCESS</OrderStatusLabel>

              <Box sx={{ mt: 2 }}>
                {order.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.find(
                    (p: Product) => p._id === item.productId
                  )!;
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <img
                        src={imagePath}
                        alt={product.productName}
                        style={{ width: 50, height: 50, borderRadius: 8 }}
                      />
                      <Typography>{product.productName}</Typography>
                      <Typography>
                        {item.itemQuantity} x ${item.itemPrice} = $
                        {item.itemQuantity * item.itemPrice}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  Total: ${order.orderTotal}
                </Typography>
                <Typography variant="caption">
                  {moment(order.createdAt).format("YY-MM-DD HH:mm")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => finishOrderHandler(order._id)}
                >
                  Verify to Fulfill
                </Button>
              </Box>
            </OrderCard>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 5,
            }}
          >
            <img
              src="/icons/noimage-list.svg"
              alt="No orders"
              style={{ width: 300, height: 300 }}
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
};

export default ProcessOrders;
