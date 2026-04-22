import { Button, Container, Space, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

export const CheckoutPage = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Title order={2}>Checkout</Title>
            <Space h="md" />

            <Text>Checkout page coming soon.</Text>

            <Space h="md" />

            <Button onClick={() => navigate(routes.cartPage)}>
                Back to Cart
            </Button>
        </Container>
    );
};