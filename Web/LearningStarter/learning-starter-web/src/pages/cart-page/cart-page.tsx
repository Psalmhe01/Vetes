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
import { useCart } from "../../cart/cart-context";

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
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Subtotal</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cart.products.map((item) => {
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.size}</Table.Td>
                    <Table.Td>{item.price.toFixed(2)}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>{(item.price * item.quantity).toFixed(2)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          onClick={() =>{
                              const newQuantity = item.quantity - 1;
                              if (newQuantity== 0) {
                                userCart.deleteCartProduct(item.id)
                              }
                              else userCart.updateCartProduct(item.id, newQuantity, item.productSizeId, cart.id)
                            }
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
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
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
