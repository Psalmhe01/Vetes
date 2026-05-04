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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useCart } from "../../cart/cart-context";
import { useUser } from "../../authentication/use-auth";
import { useState } from "react";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { ApiResponse } from "../../constants/types";

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const userCart = useCart();
    const cart = userCart.cart;
    const { id: userId } = useUser();
    
    const total = 
        cart?.products.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
    
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

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = async () => {
        const addressResponse = await api.post<ApiResponse<{ id : number }>>( //Create shipping address
            "/api/shipping-address",
            {
                userId,
                addressLine1: form.addressLine1,
                addressLine2: form.addressLine2,
                city: form.city,
                state: form.state,
                postalCode: form.postalCode,
                country: form.country,

            }
        );
        if (addressResponse.data.hasErrors) {
            showNotification({ message: "Error saving shipping address.", color: "red" });
            return;
        }
        const shippingAddressId = addressResponse.data.data.id;

        const orderResponse = await api.post<ApiResponse<{ id: number }>>( //Create order
            "/api/orders",
            {
                userId,
                status: "Pending",
                shippingAddressId,
            }
        );

        if (orderResponse.data.hasErrors) {
            showNotification({message: "Error creating order.", color: "red"});
            return;
        }

        const orderId = orderResponse.data.data.id;

        const paymentMethodResponse = await api.post<ApiResponse<{ id: number }>>( //Create payment method
            "/api/payment-methods",
            {
                userId,
                type: "Credit Card",
                provider: "Visa",
                last4: form.cardNumber.slice(-4),
                expMonth: parseInt(form.expiration.split("/")[0]),
                expYear: parseInt(form.expiration.split("/")[1]),
                token: "placeholder",
            }
        );

        if (paymentMethodResponse.data.hasErrors) {
            showNotification({ message: "Error saving payment method.", color: "red" });
            return;
        }
        const paymentMethodId = paymentMethodResponse.data.data.id;

        const paymentResponse = await api.post<ApiResponse<{ id: number}>>( //Create payment
            "/api/payments",
            {
                orderId,
                paymentMethodId,
                paymentStatusId: 2,
                amount: total,
            }
        );

        if (paymentResponse.data.hasErrors) {
            showNotification({ message: "Error processing payment.", color: "red"});
            return;
        }

        showNotification({ message: "Order placed successfully", color: "green" });
        navigate(routes.productListing);

    };
    
    return (
        <Container>
            <Title order={2}>Checkout</Title>
            <Space h="md" />

            {/* Order summary */}
            <Title order={2}>Order summary</Title>
            <Space h="sm" />
            {cart && cart.products.length > 0 ? (
                <>
                    <Table withTableBorder striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Size</Table.Th>
                                <Table.Th>Qty</Table.Th>
                                <Table.Th>Subtotal</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {cart.products.map((item) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>{item.name}</Table.Td>
                                    <Table.Td>{item.size}</Table.Td>
                                    <Table.Td>{item.quantity}</Table.Td>
                                    <Table.Td>${(item.price * item.quantity).toFixed(2)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Space h="sm" />
                    <Text fw={700}>Total: ${total.toFixed(2)}</Text>
                </>
            ) : (
                <Text c="dimmed">Your cart is empty.</Text>
            )}

            <Space h="x1" />
            <Divider />
            <Space h="xl" />

            {/*Shipping Info*/}
            <Title order={4}>Shipping Info</Title>
            <Space h="sm" />
            <Stack>
                <TextInput
                    label="Address Line 1"
                    placeholder="123 Abc street"
                    value={form.addressLine1}
                    onChange={(e) => handleChange("addressLine1", e.target.value)}
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
                    />
                    <TextInput
                        label="State"
                        placeholder="LA"
                        value={form.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                    />
                </Group>
                <Group grow>
                    <TextInput
                        label="Postal Code"
                        placeholder="70401"
                        value={form.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                    />
                    <TextInput
                        label="Country"
                        placeholder="US"
                        value={form.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                    />
                </Group>
            </Stack>

            <Space h="x1" />
            <Divider />
            <Space h="xl" />

            {/* Payment Info */}
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
                <Button variant="outline" onClick={() => navigate(routes.cartPage)}>
                    Back to Cart
                </Button>
                <Button color="green" onClick={handlePlaceOrder}>
                    Place Order
                </Button>
            </Group>
        </Container>
    );

};

    
