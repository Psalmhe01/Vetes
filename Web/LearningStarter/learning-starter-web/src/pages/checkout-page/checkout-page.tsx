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
  TextInput,
  Select,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useCart } from "../../cart/cart-context";
import { useUser } from "../../authentication/use-auth";
import { useState, useEffect } from "react";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import {
  ApiResponse,
  CartProductGetDto,
  ShippingAddressesGetDto,
} from "../../constants/types";
import { CartItem } from "../cart-page/cart-page";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const userCart = useCart();
  const cart = userCart.cart;
  const { id: userId } = useUser();
  const [loading, setLoading] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<
    ShippingAddressesGetDto[]
  >([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    "new",
  );

  const total =
    cart?.products.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get<ApiResponse<ShippingAddressesGetDto[]>>(
          "/api/shipping-addresses",
        );
        if (response.data.data) {
          const userAddresses = response.data.data.filter(
            (a) => a.userId === userId,
          );
          setExistingAddresses(userAddresses);

          if (userAddresses.length > 0) {
            setSelectedAddressId(userAddresses[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching addresses", error);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (
      selectedAddressId === "new" &&
      (!form.addressLine1 ||
        !form.city ||
        !form.state ||
        !form.postalCode ||
        !form.country)
    ) {
      showNotification({
        message: "Please fill out all required shipping fields.",
        color: "yellow",
        position: "top-center",
      });
      return;
    }

    if (!form.expiration.includes("/")) {
      showNotification({
        message: "Please enter expiration date as MM/YY",
        color: "yellow",
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      let shippingAddressId: number;

      if (selectedAddressId && selectedAddressId !== "new") {
        shippingAddressId = Number(selectedAddressId);
      } else {
        const addressResponse = await api.post<ApiResponse<{ id: number }>>(
          "/api/shipping-addresses",
          {
            userId,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        );
        if (addressResponse.data.hasErrors) {
          showNotification({
            message: "Error saving shipping address.",
            color: "red",
            position: "top-center",
            style: { backgroundColor: "#E9CFCF" },
          });
          setLoading(false);
          return;
        }
        shippingAddressId = addressResponse.data.data.id;
      }

      const orderResponse = await api.post<ApiResponse<{ id: number }>>(
        "/api/orders",
        {
          userId,
          status: "Pending",
          shippingAddressId,
        },
      );

      if (orderResponse.data.hasErrors) {
        showNotification({
          message: "Error creating order.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        setLoading(false);
        return;
      }

      const orderId = orderResponse.data.data.id;

      if (cart) {
        for (const item of cart.products) {
          const orderProductResponse = await api.post<ApiResponse<any>>(
            "/api/order-products",
            {
              orderId,
              productSizeId: item.productSizeId,
              quantity: item.quantity,
              price: item.price,
            },
          );

          if (orderProductResponse.data.hasErrors) {
            showNotification({
              message: `Error adding ${item.name} to order.`,
              color: "red",
              position: "top-center",
              style: { backgroundColor: "#E9CFCF" },
            });
            setLoading(false);
            return;
          }
        }
      }

      const paymentMethodResponse = await api.post<ApiResponse<{ id: number }>>(
        "/api/payment-methods",
        {
          userId,
          type: "Credit Card",
          provider: "Visa",
          last4: form.cardNumber.slice(-4),
          expMonth: parseInt(form.expiration.split("/")[0]),
          expYear: parseInt(form.expiration.split("/")[1]),
          token: "placeholder",
        },
      );

      if (paymentMethodResponse.data.hasErrors) {
        showNotification({
          message: "Error saving payment method.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        setLoading(false);
        return;
      }
      const paymentMethodId = paymentMethodResponse.data.data.id;

      const paymentResponse = await api.post<ApiResponse<{ id: number }>>(
        "/api/payments",
        {
          orderId,
          paymentMethodId,
          paymentStatusId: 2,
          amount: total,
        },
      );

      if (paymentResponse.data.hasErrors) {
        showNotification({
          message: "Error processing payment.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        setLoading(false);
        return;
      }

      await userCart.clearCart();

      showNotification({
        message: "Order placed successfully",
        color: "green",
        position: "top-center",
        style: { backgroundColor: "#D4E9CF" },
      });
      navigate(routes.productListing);
      window.scrollTo(0, 0);
    } catch (e) {
      showNotification({
        message: "An unexpected error occurred while placing your order.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = async (cartProduct: CartProductGetDto) => {
    const productFoundId = await userCart.findProduct(cartProduct);

    if (productFoundId) {
      navigate(`/products/${productFoundId}`);
      window.scrollTo(0, 0);
    } else {
      showNotification({
        message: "Error finding product",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
  };

  return (
    <Container py={30}>
      <Title order={2}>Checkout</Title>
      <Space h="md" />
      <Title order={4}>Order summary</Title>
      <Space h="sm" />
      {cart && cart.products.length > 0 ? (
        <>
          {cart.products.map((item) => (
            <CartItem
              key={item.id}
              product={item}
              cartId={cart.id}
              userCart={userCart}
              handleNavigate={handleNavigate}
            />
          ))}

          <Space h="sm" />
          <Text fw={700}>Total: ${total.toFixed(2)}</Text>
        </>
      ) : (
        <Text c="dimmed">Your cart is empty.</Text>
      )}

      <Space h="xl" />
      <Divider />
      <Space h="xl" />

      <Title order={4}>Shipping Info</Title>
      <Space h="sm" />
      <Select
        label="Select Shipping Address"
        placeholder="Choose an address"
        data={[
          ...existingAddresses.map((addr) => ({
            value: addr.id.toString(),
            label: `${addr.addressLine1}, ${addr.city}, ${addr.state}`,
          })),
          { value: "new", label: "+ Add New Address" },
        ]}
        value={selectedAddressId}
        onChange={setSelectedAddressId}
        mb="md"
      />

      {selectedAddressId === "new" && (
        <Stack>
          <TextInput
            label="Address Line 1"
            placeholder="123 Abc street"
            value={form.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Address Line 2"
            placeholder="Apt 4B (optional)"
            value={form.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
          />
          <Group grow>
            <TextInput
              label="City"
              placeholder="Hammond"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              withAsterisk
            />
            <TextInput
              label="State"
              placeholder="LA"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              withAsterisk
            />
          </Group>
          <Group grow>
            <TextInput
              label="Postal Code"
              placeholder="70401"
              value={form.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              withAsterisk
            />
            <TextInput
              label="Country"
              placeholder="US"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              withAsterisk
            />
          </Group>
        </Stack>
      )}

      <Space h="xl" />
      <Divider />
      <Space h="xl" />

      <Title order={4}>Payment Info</Title>
      <Space h="sm" />
      <Stack>
        <TextInput
          label="Card Number"
          placeholder="1234 5678 9101 1121"
          value={form.cardNumber}
          onChange={(e) => handleChange("cardNumber", e.target.value)}
        />
        <Group grow>
          <TextInput
            label="Expiration Date"
            placeholder="MM/YY"
            value={form.expiration}
            onChange={(e) => handleChange("expiration", e.target.value)}
          />
          <TextInput
            label="CVV"
            placeholder="123"
            value={form.cvv}
            onChange={(e) => handleChange("cvv", e.target.value)}
          />
        </Group>
      </Stack>

      <Space h="xl" />
      <Group>
        <Button
          variant="outline"
          onClick={() => {
            navigate(routes.cartPage);
            window.scrollTo(0, 0);
          }}
        >
          Back to Cart
        </Button>
        <Button color="green" onClick={handlePlaceOrder} loading={loading}>
          Place Order
        </Button>
      </Group>
    </Container>
  );
};
