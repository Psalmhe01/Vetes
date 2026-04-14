import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { ApiResponse, CartGetDto, CartProductGetDto, CartProductCreateUpdateDto } from "../../constants/types";
import api from "../../config/axios";
import { Container, ActionIcon, Button, Group, Space, Table, Title, Text } from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartGetDto>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchCart();  

      async function fetchCart() {
        setLoading(true);
        const response = await api.get<ApiResponse<CartGetDto[]>>("/api/cart")

        if(response.data.hasErrors){
            showNotification({
                message: "Error fetching cart.",
                color: "red",

            });
        }

        if(response.data.data && response.data.data.length > 0){
            setCart(response.data.data[0]);
        }
        setLoading(false);
      }
    }, []);
    const total = 
        cart?.products.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

    async function updateCartProduct(item: CartProductGetDto, newQuantity: number){
        if (!cart) return;

        if (newQuantity <= 0){
            await removeCartProduct(item.id);
            return;
        }

        const values: CartProductCreateUpdateDto = {
            cartId: cart.id,
            productSizeId: item.productSizeId,
            quantity: newQuantity
        };

        const response = await api.put<ApiResponse<CartProductGetDto>>(
            `/api/cartproducts/${item.id}`,
            values
        );
        if (response.data.hasErrors){
            showNotification({
                message: "Error updating cart item.",
                color: "red"
            });
            return;
        }
        setCart({
            ...cart,
            products: cart.products.map((product) => 
                product.id === item.id ? { ...product, quantity: newQuantity } : product
            ),
        });
    }

    async function removeCartProduct(cartProductId: number){
        if (!cart) return;

        const response = await api.delete<ApiResponse<boolean>>(
            `/api/cartproducts/${cartProductId}`
        );

        if (response.data.hasErrors){
            showNotification({
                message: "Error removing item from cart.",
                color: "red",
            });
            return;
        }

        setCart({
            ...cart,
            products: cart.products.filter((product) => product.id !== cartProductId),
        });

        showNotification({
            message: "Item removed from cart.",
            color: "green",
        });
    }
    return (
        <Container>
            <Title order={2}>Cart</Title>
            <Space h="md" />

            {loading && <Text>Loading cart...</Text>}

            {!loading && cart && cart.products.length === 0 && (
                <>
                    <Text>Your cart is empty.</Text>
                    <Space h="md" />
                    <Button onClick={() => navigate(routes.productListing)}>
                        Continue Shopping
                    </Button>
                </>
            )}

            {!loading && cart && cart.products.length > 0 && (
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
                                                    updateCartProduct(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                <IconMinus size={16} />    
                                            </ActionIcon>

                                            <ActionIcon
                                                variant="light"
                                                onClick={() =>
                                                    updateCartProduct(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                <IconPlus size={16} />
                                            </ActionIcon>

                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                onClick={() => 
                                                    removeCartProduct(item.id)
                                                }
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

            <Space h ="md" />

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