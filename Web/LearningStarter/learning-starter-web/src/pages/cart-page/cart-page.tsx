import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  ApiResponse,
  CartGetDto,
  CartProductGetDto,
  CartProductCreateUpdateDto,
} from "../../constants/types";
import api from "../../config/axios";
import {
  Container,
  ActionIcon,
  Button,
  Group,
  Space,
  Table,
  Title,
  Text,
} from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useUser } from "../../authentication/use-auth";
import { useCart } from "../../cart/cart-context";
import { useError } from "react-use";

export const CartPage = () => {
  const navigate = useNavigate();
  const userCart = useCart();
  const cart = userCart.cart;

  const total =
    cart?.products.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const totalItems =
    cart?.products.reduce((total, val) => total + val.quantity, 0) ?? 0;

  
  return (
    <Container>
      <Title order={2}>Cart</Title>
      <Space h="md" />
      
      <Button color="red" onClick={() => userCart.createCart() }>
        Create cart
      </Button>

      {userCart.loading && <Text>Loading cart...</Text>}

      {!userCart.loading && cart && totalItems === 0 && (
        <>
          <Text>Your cart is empty.</Text>
          <Space h="md" />
          <Button onClick={() => navigate(routes.productListing)}>
            Continue Shopping
          </Button>
        </>
      )}

      {!userCart.loading && cart && cart.products.length > 0 && (
        <>
          <Table withTableBorder striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          onClick={() =>
                            userCart.updateCartProduct(item.id, item.quantity - 1, item.productSizeId, cart.id)
                          }
                        >
                          <IconMinus size={16} />
                        </ActionIcon>

                        <ActionIcon
                          variant="light"
                          onClick={() =>
                            userCart.updateCartProduct(item.id, item.quantity + 1, item.productSizeId, cart.id)
                          }
                        >
                          <IconPlus size={16} />
                        </ActionIcon>

                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => userCart.deleteCartProduct(item.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Space h="md" />

          <Text fw={700}>Total: ${total.toFixed(2)}</Text>

          <Space h="md" />

          <Group>
            <Button onClick={() => navigate(routes.productListing)}>
              Continue Shopping
            </Button>

            <Button color="green" onClick={() => navigate(routes.checkoutPage)}>
              Checkout
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
};
