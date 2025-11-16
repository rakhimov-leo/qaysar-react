import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { styled } from "@mui/material/styles";
import moment from "moment";

// ✅ REDUX SELECTOR
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

// ✅ Styled components
const OrderCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: theme.spacing(4),
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  marginBottom: theme.spacing(3),
}));

const OrderTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "20px",
  marginBottom: 8,
});

const OrderStatusLabel = styled(Box)<{ status: string }>(({ status }) => ({
  padding: "4px 12px",
  borderRadius: 12,
  fontWeight: 600,
  fontSize: "14px",
  color: "#fff",
  backgroundColor:
    status === "FINISH"
      ? "#4caf50"
      : status === "PROCESS"
        ? "#1976d2"
        : "#ff9800",
  display: "inline-block",
  marginBottom: 16,
}));

const FinishedOrders: React.FC = () => {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value="3">
      <Stack>
        {finishedOrders && finishedOrders.length > 0 ? (
          finishedOrders.map((order: Order) => (
            <OrderCard key={order._id}>
              <OrderTitle>{`Order #${order._id}`}</OrderTitle>
              <OrderStatusLabel status="FINISH">FINISHED</OrderStatusLabel>

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
                        mb: 2,
                      }}
                    >
                      <img
                        src={imagePath}
                        alt={product.productName}
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 12,
                          objectFit: "cover",
                        }}
                      />
                      <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                        {product.productName}
                      </Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
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
                  mt: 3,
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total: ${order.orderTotal}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  {moment(order.createdAt).format("YY-MM-DD HH:mm")}
                </Typography>
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
              style={{ width: 350, height: 350 }}
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
};

export default FinishedOrders;
