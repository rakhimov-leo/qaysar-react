import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import styled from "styled-components";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

/** Styled Components **/
const BasketWrapper = styled(Stack)`
  width: 400px;
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
`;

const BasketItem = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 12px;
  background-color: #f5f5f5;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 12px;
`;

const ProductInfo = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.span`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const ProductPrice = styled.span`
  color: #555;
  font-size: 14px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  button {
    width: 28px;
    height: 28px;
    border: none;
    background-color: #1976d2;
    color: #fff;
    font-size: 18px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: #115293;
    }
  }
`;

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const itemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const proccedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="basket-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 450,
            maxWidth: "90vw",
            p: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <BasketWrapper>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <strong>My Cart</strong>
            {cartItems.length > 0 && (
              <DeleteForeverIcon
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => onDeleteAll()}
              />
            )}
          </Stack>

          {cartItems.length === 0 && <div>Cart is empty!</div>}

          {cartItems.map((item: CartItem) => {
            const imagePath = `${serverApi}/${item.image}`;
            return (
              <BasketItem key={item._id}>
                <CancelIcon
                  color="primary"
                  sx={{ cursor: "pointer", mr: 1 }}
                  onClick={() => onDelete(item)}
                />
                <ProductImage src={imagePath} alt={item.name} />
                <ProductInfo>
                  <ProductName>{item.name}</ProductName>
                  <ProductPrice>
                    ${item.price} x {item.quantity}
                  </ProductPrice>
                  <QuantityControls>
                    <button onClick={() => onRemove(item)}>-</button>
                    <button onClick={() => onAdd(item)}>+</button>
                  </QuantityControls>
                </ProductInfo>
              </BasketItem>
            );
          })}

          {cartItems.length !== 0 && (
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <span>
                Total: ${totalPrice} ({itemsPrice} + {shippingCost})
              </span>
              <Button
                variant="contained"
                color="primary"
                onClick={proccedOrderHandler}
                startIcon={<ShoppingCartIcon />}
              >
                Order
              </Button>
            </Stack>
          )}
        </BasketWrapper>
      </Menu>
    </Box>
  );
}
