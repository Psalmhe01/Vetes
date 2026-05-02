import {
  Container,
  ActionIcon,
  Button,
  Group,
  Space,
  Table,
  Title,
  Text,
  Card,
  Divider,
  NumberInput,
  Stack,
  Box,
  NumberInputHandlers,
  Flex,
  Modal,
} from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useCart } from "../../cart/cart-context";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { CartProductGetDto } from "../../constants/types";
import { useDisclosure } from "@mantine/hooks";

const CartItem = ({
  product,
  cartId,
  userCart,
  handleNavigate,
}: {
  product: CartProductGetDto;
  cartId: number;
  userCart: any;
  handleNavigate: (product: CartProductGetDto) => void;
}) => {
  const { classes } = useStyles();
  const handlersRef = useRef<NumberInputHandlers>(null);
  const [quantity, setQuantity] = useState(product.quantity);
  const [opened, { open, close }] = useDisclosure(false);
  const totalPrice = product.price * quantity;

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);

  return (
    <Box key={product.id} w="100%">
      <Divider my="xs" color={colors.text} />
      <Group
        justify="space-between"
        className={classes.sideCartItem}
        align="flex-start"
        p={20}
      >
        <Group>
          <Card
            withBorder
            w={80}
            h="auto"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigate(product)}
          >
            <Text c="dimmed" size="sm">
              Image
            </Text>
          </Card>

          <Stack gap="xs">
            <Text
              fw={500}
              size="sm"
              mb={4}
              onClick={() => handleNavigate(product)}
              className={classes.productNameText}
            >
              {product.name}
            </Text>
            <Text fw={500} size="sm" mb={4}>
              Size: {product.size}
            </Text>
            <Text fw={500}>${product.price.toFixed(2)}</Text>
          </Stack>
        </Group>
        <Group
          gap={0}
          align="center"
          style={{ border: `solid ${colors.text} 1px` }}
        >
          <ActionIcon
            onClick={() => {
              const newQuantity = quantity - 1;
              if (newQuantity < 1) {
                open(); // Open modal instead of instant delete if you prefer consistency
              } else {
                setQuantity(newQuantity);
                userCart.updateCartProduct(
                  product.id,
                  newQuantity,
                  product.productSizeId,
                  cartId
                );
              }
            }}
            variant="subtle"
            size={36}
            radius={0}
          >
            <FontAwesomeIcon icon={faMinus} />
          </ActionIcon>
          <NumberInput
            handlersRef={handlersRef}
            step={1}
            min={0}
            max={100}
            value={quantity}
            onChange={(value) => {
              const nextQuantity =
                typeof value === "string" ? Number(value) : (value ?? 0);
              setQuantity(nextQuantity);
              userCart.updateCartProduct(
                product.id,
                nextQuantity,
                product.productSizeId,
                cartId
              );
            }}
            hideControls
            w={60}
            styles={{ input: { textAlign: "center" } }}
            radius={0}
            variant="unstyled"
          />
          <ActionIcon
            onClick={() => {
              const newQuantity = quantity + 1;
              setQuantity(newQuantity);
              userCart.updateCartProduct(
                product.id,
                newQuantity,
                product.productSizeId,
                cartId
              );
            }}
            variant="subtle"
            size={36}
            radius={0}
          >
            <FontAwesomeIcon icon={faPlus} />
          </ActionIcon>
        </Group>

        <Text fw={500} size="xl">
          ${totalPrice.toFixed(2)}
        </Text>
        <ActionIcon onClick={open} variant="subtle" size="lg" radius={0}>
          <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
      </Group>
      <Modal opened={opened} onClose={close} title="Confirm Deletion">
        Are you sure you want to remove this item? This action cannot be undone.
        <Group mt="lg" justify="flex-end">
          <Button onClick={close} variant="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              userCart.deleteCartProduct(product.id);
              close();
            }}
            color="red"
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};

export const CartPage = () => {
  const navigate = useNavigate();
  const userCart = useCart();
  const { classes } = useStyles();
  const cart = userCart.cart;

  const total =
    cart?.products.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const totalItems =
    cart?.products.reduce((total, val) => total + val.quantity, 0) ?? 0;

  const handleNavigate = async (cartProduct: CartProductGetDto) => {
    const productFoundId = await userCart.findProduct(cartProduct);

    if (productFoundId) {
      navigate(`/products/${productFoundId}`);
    } else {
      showNotification({ message: "Error finding product", color: "red" });
    }
  };

  return (
    <Container size="xl" className={classes.cartRoot}>
      {userCart.loading && <Text>Loading cart...</Text>}

      {!userCart.loading && cart && totalItems === 0 && (
        <>
          <Text size="xl">Cart</Text>
          <Space h="md" />
          <Text>Your cart is empty.</Text>
          <Space h="md" />
          <Button onClick={() => navigate(routes.productListing)}>
            Continue Shopping
          </Button>
        </>
      )}

      {!userCart.loading && cart && cart.products.length > 0 && (
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap="xl"
          align="flex-start"
        >
          <Stack style={{ flex: 1 }} gap={0}>
            <Title order={2} mb="md">
              Cart
            </Title>
            {cart.products.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                cartId={cart.id}
                userCart={userCart}
                handleNavigate={handleNavigate}
              />
            ))}
          </Stack>

          <Stack style={{ flex: 1 }} gap={0}>
            <Title order={3} mb="md">
              Order Summary
            </Title>
            <Divider my="md" color="brand.9" />
            <Group justify="space-between" mb="xs">
              <Text size="lg">Subtotal ({totalItems} items)</Text>
              <Text size="lg" fw={700}>
                ${total.toFixed(2)}
              </Text>
            </Group>
            <Group justify="space-between" mb="xs">
              <Text size="lg">Delivery Fee</Text>
              <Text size="lg" fw={700}>
                FREE
              </Text>
            </Group>
            <Divider my="md" />
            <Group justify="space-between" mb="xs">
              <Title order={3} >Total</Title>
              <Title order={3}  fw={700}>
                ${total.toFixed(2)}
              </Title>
            </Group>
            <Divider my="md" />
            <Stack>
              <Button
                color="green.9"
                fullWidth
                onClick={() => navigate(routes.checkoutPage)}
              >
                Checkout
              </Button>
              <Button
                variant="outline"
                color="brand.9"
                fullWidth
                onClick={() => navigate(routes.productListing)}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Stack>
        </Flex>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    cartBtn: {
      padding: 0,
      marginRight: "20px",
      color: colors.background2,
      background: "none",
      "&:hover": {
        color: colors.buttonText,
        background: "none",
      },
      '[data-mantine-color-scheme="dark"] &': {
        color: "#C1C2C5",
        "&:hover": {
          color: "#D4E9CF",
        },
      },
    },

    cartRoot: {
      padding: "60px",
      backgroundColor: colors.background1,
      color: colors.text,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#1A1B1E",
        color: "#C1C2C5",
      },
    },

    sideCartItem: {
      minHeight: "150px",
      objectFit: "fill",
      marginTop: 0,
    },

    productNameText: {
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  };
});
