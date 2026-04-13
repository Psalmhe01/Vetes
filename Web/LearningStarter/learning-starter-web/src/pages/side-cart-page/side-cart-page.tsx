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

export const SideCart = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { id }: { id: number } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartGetDto | null>(null);
  const [loading, setLoading] = useState(true);
  const cartTotal = cart?.products.reduce((total, val) => total + (val.price * val.quantity), 0);
  const totalItems = cart?.products.length;

  useEffect(() => {
    if (!id) return;
    fetchCart();

    async function fetchCart() {
      try {
        const response = await api.get<ApiResponse<CartGetDto>>(
          `/api/cart/${id}`,
        );
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching cart.", color: "red" });
          navigate("/home");
        }
        
        if (response.data.data) {
          setCart(response.data.data);
        }
      } catch (error) {
        showNotification({ message: "Error fetching cart.", color: "red" });
        navigate("/home");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  async function deleteCartProduct(prodId: number) {
    try {
      const response = await api.delete<ApiResponse<CartGetDto>>(
        `/api/cartproducts/${prodId}`,
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error deleting cart item", color: "red" });
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.filter((p) => p.id !== prodId),
        };
      });
    } catch (error) {
      showNotification({ message: "Error deleting cart item", color: "red" });
    }
  }

  async function updateCartProduct(
    id: number,
    quantity: number,
    productSizeId: number,
    cartId: number,
  ) {
    try {
      const response = await api.put<ApiResponse<CartProductGetDto>>(
        `/api/cartproducts/${id}`,
        { quantity, productSizeId, cartId },
      );

      if (response.data.hasErrors) {
        showNotification({
          message: "Error updating this cart item",
          color: "red",
        });
        return;
      }


      setCart((prev) => {
        if (!prev) return prev;
        const updatedProduct = response.data.data;
        return {
          ...prev,
          products: prev.products.map((p) =>
            p.id === id && updatedProduct ? updatedProduct : p,
          ),
        };
      });
    } 
    
    catch (error) {
      showNotification({ message: "Error updating cart item", color: "red" });
    }
  }

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
                  if (newQuantity < 1){
                    deleteCartProduct(product.id);
                  }
                  else{
                  setQuantity(newQuantity);
                  updateCartProduct(
                    product.id,
                    newQuantity,
                    product.productSizeId,
                    cartId,
                  );}
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
                  updateCartProduct(
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
                  updateCartProduct(
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
              onClick={() => deleteCartProduct(product.id)}
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
    if (!cart) return null;
    return (
      <Container>
        {cart.products.length === 0 ? (
          <Text c="dimmed">No products in this cart yet.</Text>
        ) : (
          <Stack>
            {cart.products.map((product) => (
              <CartItem key={product.id} product={product} cartId={cart.id} />
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
        title={`Cart ${totalItems}`}
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
            <Button fullWidth radius={0}>
              Checkout
            </Button>
            <Button variant="outline" radius={0} fullWidth>
              View Cart
            </Button>
            <Text size="m" ta="center">
              Secure Checkout
            </Text>
          </Stack>
        </Container>
      </Drawer>

      <Indicator
        color="blue"
        inline
        label={totalItems}
        autoContrast
        position="bottom-end"
        size="s"
        offset={12}
        onClick={open}
        withBorder
      >
        <Button variant="subtle" radius="xl" onClick={open} size="auto">
          <FontAwesomeIcon size="xl" icon={faCartShopping} />
        </Button>
      </Indicator>
    </>
  );
};
