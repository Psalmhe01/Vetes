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
  useMantineTheme,
  ActionIcon,
  Skeleton,
  Checkbox,
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
  ProductSizeGetDto,
} from "../../constants/types";
import { useUser } from "../../authentication/use-auth";
import { routes } from "../../routes";
import { useCart } from "../../cart/cart-context";
import { colors } from "../../constants/theme-constants";
import { createStyles, keyframes } from "@mantine/emotion";
import { IconLock, IconLockFilled } from "@tabler/icons-react";

export const SideCart = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [shake, setShake] = useState(false);
  const cartel = useCart();
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("selected-cart-items");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("selected-cart-items", JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    if (cartel.cart && selectedIds.length === 0 && !localStorage.getItem("selected-cart-items")) {
      setSelectedIds(cartel.cart.products.map((p) => p.id));
    }
  }, [cartel.cart]);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const cartTotal =
    cartel.cart?.products
      .filter((p) => selectedIds.includes(p.id))
      .reduce((total, val) => total + val.price * val.quantity, 0) ?? 0;

  const selectedItems = cartel.cart?.products.filter((p) => selectedIds.includes(p.id)).reduce
    ((total, val) => total + val.quantity, 0)?? 0;


  const totalItems = cartel.cart?.products
    .reduce((total, val) => total + val.quantity, 0) ?? 0;

  useEffect(() => {
    if (totalItems > 0) {
      setShake(true);

      const timer = setTimeout(() => {
        setShake(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleNavigate = async (cartProduct: CartProductGetDto) => {
    const productFoundId = await cartel.findProduct(cartProduct);

    if (productFoundId) {
      navigate(`/products/${productFoundId}`);
    } else {
      showNotification({ message: "Error finding product", color: "red" });
    }
  };

  const CartItem = ({
    product,
    cartId,
    isSelected,
    onToggle,
  }: {
    product: CartProductGetDto;
    cartId: number;
    isSelected: boolean;
    onToggle: (id: number) => void;
  }) => {
    const handlersRef = useRef<NumberInputHandlers>(null);
    const [quantity, setQuantity] = useState(product.quantity);
    const totalPrice = product.price * quantity;

    useEffect(() => {
      setQuantity(product.quantity);
    }, [product.quantity]);

    return (
      <Container>
        <Divider my="xs" color={colors.text} />
        <Group
          dir={"row"}
          justify="space-between"
          className={classes.sideCartItem}
          wrap="nowrap"
        >
          <Checkbox
            checked={isSelected}
            onChange={() => onToggle(product.id)}
            mr="xs"
          />
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
            <Text fw={500} size="sm" mb={4}>
              {product.name}
            </Text>
            <Text fw={500} size="sm" mb={4}>
              Size: {product.size}
            </Text>
            <Text fw={500}>${product.price.toFixed(2)}</Text>
            <Group gap={0} align="center" style={{ border: `solid ${colors.text} 1px` }}>
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
               maw={30}
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

    if (cartel.cart.products.length === 0) {
      return <Text c="dimmed">No products in this cart yet.</Text>;
    }
    return (
      <Container fluid>
        {cartel.cart && (
          <Stack gap={0}>
            {cartel.cart.products.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                cartId={cartel.cart!.id}
                isSelected={selectedIds.includes(product.id)}
                onToggle={toggleSelection}
              />
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
            <Text size="md">{totalItems} items</Text>
            <Text size="sm" c="dimmed">
              ({selectedItems} selected)
            </Text>
          </Group>
        }
        scrollAreaComponent={ScrollArea.Autosize}
        radius={0}
        lockScroll
        position="right"
        transitionProps={{ transition: "fade-left", duration: 200 }}
        overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
        classNames={{
          content: classes.sideCartRoot,
          header: classes.sideCartRoot,
        }}
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
              disabled={totalItems === 0}
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
            <Group align="center" justify="center" gap="xs" p={0} m={0}>
              <IconLockFilled />
              <Text size="m" ta="center">
                Secure Checkout
              </Text>
            </Group>
          </Stack>
        </Container>
      </Drawer>

      {totalItems ? (
        <Indicator
          inline
          label={totalItems}
          autoContrast
          position="bottom-start"
          size="sm"
          offset={33}
          onClick={open}
          className={classes.indicator}
          color={colors.buttonText}
        >
          <Button
            variant="subtle"
            radius="xl"
            onClick={open}
            size="md"
            className={cx(classes.cartBtn, { [classes.cartBtnShake]: shake })}
          >
            <FontAwesomeIcon size="xl" icon={faCartShopping} />
          </Button>
        </Indicator>
      ) : (
        <Button
          variant="subtle"
          radius="xl"
          onClick={open}
          size="auto"
          className={cx(classes.cartBtn, { [classes.cartBtnShake]: shake })}
        >
          <FontAwesomeIcon size="xl" icon={faCartShopping} />
        </Button>
      )}
    </>
  );
};

const shake = keyframes({
  "0%": { transform: "translate(1px, 1px) rotate(0deg)" },
  "10%": { transform: "translate(-1px, -2px) rotate(-1deg)" },
  "20%": { transform: "translate(-3px, 0px) rotate(1deg)" },
  "30%": { transform: "translate(3px, 2px) rotate(0deg)" },
  "40%": { transform: "translate(1px, -1px) rotate(1deg)" },
  "50%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
  "60%": { transform: "translate(-3px, 1px) rotate(0deg)" },
  "70%": { transform: "translate(3px, 1px) rotate(-1deg)" },
  "80%": { transform: "translate(-1px, -1px) rotate(1deg)" },
  "90%": { transform: "translate(1px, 2px) rotate(0deg)" },
  "100%": { transform: "translate(1px, -2px) rotate(-1deg)" },
});

const useStyles = createStyles((theme) => {
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

    indicator: {
      background: "none",
      color: colors.background2,
      border: "none",
      textAlign: "center",
      fontSize: "small",
      '[data-mantine-color-scheme="dark"] &': {
        color: "#C1C2C5",
      },
    },

    sideCartRoot: {
      backgroundColor: colors.background1,
      color: colors.text,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#1A1B1E",
        color: "#C1C2C5",
      },
    },

    sideCartItem: {
      height: "150px",
      objectFit: "fill",
      marginTop: 0,
    },

    cartBtnShake: {
      animation: `${shake} 0.5s`,
    },
  };
});
