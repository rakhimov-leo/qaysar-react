import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { styled } from "@mui/material/styles"; // ✅ Styled qo‘shildi

// ** REDUX SLICE & SELECTOR  **//
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

// ✅ Styled components
const OrderCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  },
}));

const OrderItemsContainer = styled(Box)(({ theme }) => ({
  maxHeight: 300,
  overflowY: "auto",
  marginBottom: theme.spacing(2),
}));

const OrderItemRow = styled(Stack)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const DishImg = styled("img")(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 8,
  objectFit: "cover",
  marginRight: theme.spacing(2),
}));

const TotalBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: "1px solid #eee",
  marginTop: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: "#f9f9f9",
  fontWeight: 600,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
  gap: theme.spacing(1),
}));

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proceed with payment?"
      );
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"1"}>
      <Stack spacing={2}>
        {pausedOrders?.map((order: Order) => (
          <OrderCard key={order._id}>
            <OrderItemsContainer>
              {order?.orderItems?.map((item: OrderItem) => {
                const product: Product = order.productData.find(
                  (ele: Product) => item.productId === ele._id
                )!;
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <OrderItemRow key={item._id}>
                    <DishImg src={imagePath} />
                    <Stack sx={{ flex: 1, justifyContent: "center" }}>
                      <p className={"title-dish"}>{product.productName}</p>
                    </Stack>
                    <Box
                      className={"price-box"}
                      sx={{ display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <p>${item.itemPrice}</p>
                      <img src={"/icons/close.svg"} alt="" />
                      <p>{item.itemQuantity}</p>
                      <img src={"/icons/pause.svg"} alt="" />
                      <p style={{ marginLeft: "15px" }}>
                        ${item.itemQuantity * item.itemPrice}
                      </p>
                    </Box>
                  </OrderItemRow>
                );
              })}
            </OrderItemsContainer>

            {/* ✅ Total box dizayni yangilandi */}
            <TotalBox>
              <p>
                Product: ${order.orderTotal - order.orderDelivery} + Delivery: $
                {order.orderDelivery}
              </p>
              <p>Total: ${order.orderTotal}</p>
            </TotalBox>

            <ActionButtons>
              <Button
                value={order._id}
                variant="contained"
                color="secondary"
                onClick={deleteOrderHandler}
              >
                Cancel
              </Button>
              <Button
                value={order._id}
                variant="contained"
                color="primary"
                onClick={processOrderHandler}
              >
                Payment
              </Button>
            </ActionButtons>
          </OrderCard>
        ))}

        {!pausedOrders ||
          (pausedOrders.length === 0 && (
            <Box display={"flex"} justifyContent={"center"} mt={5}>
              <img
                src="/icons/noimage-list.svg"
                style={{ width: 300, height: 300 }}
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
