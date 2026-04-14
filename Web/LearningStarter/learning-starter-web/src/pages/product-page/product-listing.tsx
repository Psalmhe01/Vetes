import { Card, Container, SimpleGrid, Skeleton, Text } from "@mantine/core"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiResponse, ProductGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";

export const ProductListing = () => {
const navigate = useNavigate();
const [products, setProducts] = useState<ProductGetDto[]>([]);
const [loading, setLoading] = useState(true);

async function fetchProduct () {
        const response = await api.get<ApiResponse<ProductGetDto[]>>(`/api/products`);
        if (response.data.hasErrors){
        showNotification({ message: "Error fetching products.", color: "red" });
        }
        if (response.data.data) {
            setProducts(response.data.data);
        }
        setLoading(false);
    }

useEffect (() => {
    fetchProduct();
}, []);

if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Skeleton height={28} width={200} mb={4} />
          <Skeleton height={16} width={280} mb="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height={140} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
      </PageWrapper>
    );
  }

  return (
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <Text fw={500} size="xl">All products</Text>
        </div>
        <Text size="sm" c="dimmed" mb="lg">Browse all available products</Text>

        {products.length === 0 ? (
          <Text c="dimmed">No products available.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {products.map((product) => (
              <Card
                key={product.id}
                withBorder
                radius="md"
                padding="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${product.id}`, { state: { from: "listing" } })}
              >
                <Text fw={500} size="sm" mb={4}>{product.name}</Text>
                <Text size="xs" c="dimmed" lineClamp={2} mb="sm">{product.description}</Text>
                <Text fw={500}>${product.price.toFixed(2)}</Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
  );
};