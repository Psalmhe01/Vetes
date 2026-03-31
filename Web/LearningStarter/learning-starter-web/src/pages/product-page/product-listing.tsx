import { Container, Text } from "@mantine/core"
import { PageWrapper } from "../../components/page-wrapper/page-wrapper"

export const ProductListing = () => {
    return (
        //<PageWrapper>
            <Container>
                <Text fw={500} size="x1">Products</Text>
                <Text c="dimmed">Coming Soon.</Text>
            </Container>
        //</PageWrapper>
    )
}