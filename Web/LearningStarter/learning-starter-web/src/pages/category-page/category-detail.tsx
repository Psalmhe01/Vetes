import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiResponse, CategoryGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { Anchor, Breadcrumbs, Card, Container, SimpleGrid, Skeleton, Text } from "@mantine/core";

export const CategoryDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryGetDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return
        fetchCategory();

        async function fetchCategory() {
            try {
                const response = await api.get<ApiResponse<CategoryGetDto>>(`/api/categories/${id}`);
                if (response.data.hasErrors) {
                    showNotification({message: "Error fetching category.", color: "red"});
                navigate("/categories");
                }

                if (response.data.data) {
                    setCategory(response.data.data);
                }
            } catch (error) {
                showNotification({message: "Error fetching category.", color: "red"});
                navigate("/categories");
            } finally {
                setLoading(false);
            }
        }
    }, [id]);

    if (loading) {
        return (
        <Container>
          <Skeleton height={20} width={180} mb="md" />
          <Skeleton height={28} width={140} mb={4} />
          <Skeleton height={16} width={80} mb="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={140} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
        );
    }
    
    if (!category) return null;

    return (
      <Container>
        <Breadcrumbs mb="md">
          <Anchor onClick={() => navigate("/categories")} style={{ cursor: "pointer" }}>
            Categories
          </Anchor>
          <Text>{category.name}</Text>
        </Breadcrumbs>

        <Text fw={500} size="xl" mb={4}>{category.name}</Text>
        <Text size="sm" c="dimmed" mb="lg">{category.products.length} products</Text>

        {category.products.length === 0 ? (
          <Text c="dimmed">No products in this category yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {category.products.map((product) => (
              <Card
                key={product.id}
                withBorder
                radius="md"
                padding="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${product.id}`, {state: {from: "category"}})}
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