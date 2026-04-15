import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  Modal,
  Button,
  ScrollArea,
  Container,
  Text,
  Group,
  Flex,
  Space,
  Divider,
  Drawer,
  Indicator,
  Stack,
  Card,
  SimpleGrid,
  NumberInputHandlers,
  NumberInput,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import {
  faCartShopping,
  faTrash,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import {
  CategoryGetDto,
  ApiResponse,
  CartGetDto,
  UserDto,
  CartProductGetDto,
} from "../../constants/types";
import { useUser } from "../../authentication/use-auth";
import { routes } from "../../routes";
import { useCart } from "../../cart/cart-context";


export const SideCart = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const cartel = useCart();
  const navigate = useNavigate();
  const cartTotal =
    cartel.cart?.products.reduce(
      (total, val) => total + val.price * val.quantity,
      0,
    ) ?? 0;
  const totalItems =
    cartel.cart?.products.reduce((total, val) => total + val.quantity, 0) ?? 0;


  const CartItem = ({
    product,
    cartId,
  }: {
    product: CartProductGetDto;
    cartId: number;
  }) => {
    const handlersRef = useRef<NumberInputHandlers>(null);
    const [quantity, setQuantity] = useState(product.quantity);
    const totalPrice = product.price * quantity;

    useEffect(() => {
      setQuantity(product.quantity);
    }, [product.quantity]);

    return (
      <Container>
        <Divider my="md" />
        <Group dir={"row"} justify="space-between">
          <Card
            withBorder
            w={80}
            h="auto"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/products/${product.id}`, {
                state: { from: "category" },
              })
            }
          >
            <Text c="dimmed" size="sm">
              Image
            </Text>
          </Card>

          <Stack>
            <Text fw={500} size="sm" mb={4}>
              {product.name}
            </Text>
            <Text fw={500} size="sm" mb={4}>
              {product.size}
            </Text>
            <Text fw={500}>${product.price.toFixed(2)}</Text>
            <Group gap={0} align="center" style={{ border: "solid white 1px" }}>
              <ActionIcon
                onClick={() => {
                  const newQuantity = quantity - 1;
                  if (newQuantity < 1) {
                    cartel.deleteCartProduct(product.id);
                  } else {
                    setQuantity(newQuantity);
                    cartel.updateCartProduct(
                      product.id,
                      newQuantity,
                      product.productSizeId,
                      cartId,
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
                  cartel.updateCartProduct(
                    product.id,
                    nextQuantity,
                    product.productSizeId,
                    cartId,
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
                  cartel.updateCartProduct(
                    product.id,
                    newQuantity,
                    product.productSizeId,
                    cartId,
                  );
                }}
                variant="subtle"
                size={36}
                radius={0}
              >
                <FontAwesomeIcon icon={faPlus} />
              </ActionIcon>
            </Group>
          </Stack>

          <Stack justify="space-between" gap="xl" align="flex-end">
            <ActionIcon
              onClick={() => cartel.deleteCartProduct(product.id)}
              variant="subtle"
              size={36}
              radius={0}
            >
              <FontAwesomeIcon icon={faTrash} />
            </ActionIcon>
            <Space />
            <Text fw={500} size="xl" typeof="number">
              ${totalPrice.toFixed(2)}
            </Text>
          </Stack>
        </Group>
      </Container>
    );
  };

  const Content = () => {
    if (!cartel.cart) return null;
    if (cartel.loading) {
      return (
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {[...Array(2)].map((_, i) => (
              <Group>
                <Skeleton key={i} height={50} width={80} radius="md" />
                <Stack>
                  <Skeleton height={20} width={130} mb="md" />
                  <Skeleton height={20} width={130} mb="md" />
                  <Skeleton height={20} width={130} mb="md" />
                  <Skeleton height={40} width={130} mb="md" />
                </Stack>
                <Stack>
                  <Skeleton height={40} width={40} mb="md" />
                  <Skeleton height={30} width={70} mb="md" />
                </Stack>
              </Group>
            ))}
          </SimpleGrid>
        </Stack>
      );
    }

    if (totalItems === 0) {
      return <Text c="dimmed">No products in this cart yet.</Text>;
    }
    return (
      <Container>
        {cartel.cart && (
          <Stack>
            {cartel.cart.products.map((product) => (
              <CartItem key={product.id} product={product} cartId={cartel.cart!.id} />
            ))}
          </Stack>
        )}
      </Container>
    );
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Group justify="space-between" align="center">
            <Text size="lg">Cart</Text>{" "}
            <Text size="sm" c="dimmed">
              {totalItems} items
            </Text>
          </Group>
        }
        scrollAreaComponent={ScrollArea.Autosize}
        radius={0}
        lockScroll
        position="right"
        transitionProps={{ transition: "fade-left", duration: 200 }}
        overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      >
        <ScrollArea type="hover" h="60vh" offsetScrollbars>
          <Content />
        </ScrollArea>

        <Container py="1rem">
          <Stack>
            <Group justify="space-between" w="vw">
              <Text size="xl">Estimated total</Text>
              <Text size="xl">${cartTotal?.toFixed(2)}</Text>
            </Group>
            <Text>Taxes and shipping are calculated at checkout.</Text>
            <Button
              fullWidth
              radius={0}
              onClick={() => {
                (navigate(routes.checkoutPage), close());
              }}
            >
              Checkout
            </Button>
            <Button
              variant="outline"
              radius={0}
              onClick={() => {
                (navigate(routes.cartPage), close());
              }}
              fullWidth
            >
              View Cart
            </Button>
            <Text size="m" ta="center">
              Secure Checkout
            </Text>
          </Stack>
        </Container>
      </Drawer>

      {totalItems ? (
        <Indicator
          color="blue"
          inline
          label={totalItems}
          autoContrast
          position="bottom-end"
          size="sm"
          offset={12}
          onClick={open}
          withBorder
        >
          <Button variant="subtle" radius="xl" onClick={open} size="md">
            <FontAwesomeIcon size="xl" icon={faCartShopping} />
          </Button>
        </Indicator>
      ) : (
        <Button variant="subtle" radius="xl" onClick={open} size="auto">
          <FontAwesomeIcon size="xl" icon={faCartShopping} />
        </Button>
      )}
    </>
  );
};
