import TabContext from "@mui/lab/TabContext";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import Divider from "../../components/divider";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { styled } from "@mui/material/styles";

// ** REDUX SLICE & SELECTOR  **
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

// ✅ Styled Tabs va Tab
const CustomTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: "2px solid #e0e0e0",
  marginBottom: theme.spacing(3),
  "& .MuiTabs-indicator": {
    backgroundColor: "#1976d2",
    height: 4,
    borderRadius: 2,
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "14px",
  color: "#555",
  marginRight: theme.spacing(3),
  borderRadius: 8,
  minHeight: "48px",
  "&.Mui-selected": {
    color: "#1976d2",
    backgroundColor: "rgba(25, 118, 210, 0.1)",
  },
  "&:hover": {
    color: "#115293",
    backgroundColor: "rgba(25, 118, 210, 0.05)",
  },
}));

// ✅ Styled User Card
const UserCard = styled(Stack)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const UserImage = styled("img")({
  width: 90,
  height: 90,
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 8,
});

const UserName = styled(Typography)({
  fontWeight: 600,
  fontSize: "18px",
});

const UserType = styled(Typography)({
  fontSize: "14px",
  color: "#888",
});

const UserLocation = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  fontSize: "14px",
  color: "#555",
});

// ✅ Styled Payment Card
const PaymentCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
  borderRadius: 16,
  padding: theme.spacing(3),
  color: "#fff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  width: "100%",
  maxWidth: 360,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  },
}));

const CardNumber = styled(Typography)({
  letterSpacing: 3,
  fontWeight: 600,
  fontSize: "18px",
});

const CardDetails = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: 500,
});

const CustomerName = styled(Typography)({
  fontWeight: 600,
  fontSize: "16px",
});

const CardsRow = styled(Stack)({
  flexDirection: "row",
  gap: 12,
  marginTop: 8,
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  paddingBottom: 3,
                  paddingLeft: 3,
                }}
              >
                <CustomTabs
                  value={value}
                  onChange={handleChange}
                  aria-label="orders tabs"
                >
                  <CustomTab label="PAUSED ORDERS" value="1" />
                  <CustomTab label="PROCESS ORDERS" value="2" />
                  <CustomTab label="FINISHED ORDERS" value="3" />
                </CustomTabs>
              </Box>
            </Box>
            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        {/* ✅ Yangilangan order-right dizayni */}
        <Stack className={"order-right"} spacing={2}>
          <UserCard>
            <Stack alignItems={"center"}>
              <UserImage
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
              />
              <UserName>{authMember?.memberNick}</UserName>
              <UserType>{authMember?.memberType}</UserType>
            </Stack>

            <Divider height="1" width="100%" bg="#e0e0e0" />

            <UserLocation>
              <img
                src={
                  authMember?.memberType === MemberType.RESTAURANT
                    ? "/icons/restaurant.svg"
                    : "/icons/user-badge.svg"
                }
                alt="icon"
                style={{ width: 20, height: 20 }}
              />
              <span>
                {authMember?.memberAddress
                  ? authMember.memberAddress
                  : "no address"}
              </span>
            </UserLocation>
          </UserCard>

          <PaymentCard>
            <CardNumber>1234 2345 3456 6789</CardNumber>

            <CardDetails>
              <Box>07/24</Box>
              <Box>CVV: 010</Box>
            </CardDetails>

            <CustomerName>Justin Robertson</CustomerName>

            <CardsRow>
              <img
                src="/img/western-union.png"
                alt="Western Union"
                width={40}
              />
              <img src="/img/master-card.png" alt="Master Card" width={40} />
              <img src="/img/paypal.png" alt="PayPal" width={40} />
              <img src="/img/visa.png" alt="Visa" width={40} />
            </CardsRow>
          </PaymentCard>
        </Stack>
      </Container>
    </div>
  );
}
