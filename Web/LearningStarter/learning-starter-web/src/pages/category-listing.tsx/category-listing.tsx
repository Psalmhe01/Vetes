import { useEffect, useState } from "react"
import { ApiResponse, CategoryGetDto } from "../../constants/types"
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { Card, Container, SimpleGrid, Skeleton, Text } from "@mantine/core";

export const CategoryListing = () => {
    const [categories, setCategories] = useState<CategoryGetDto[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
        
        async function fetchCategories() {
            const response = await api.get<ApiResponse<CategoryGetDto[]>>(`api/categories`)
            
            if (response.data.hasErrors){
                showNotification({message: "Error fetching products.", color: "red"});
            }

            if (response.data.data){
                setCategories(response.data.data)
            }
            
            setLoading(false);
        }
    }, []);
    
        if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Skeleton height={28} width={200} mb={4} />
          <Skeleton height={16} width={280} mb="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={140} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Text fw={500} size="xl" mb={4}>Shop by category</Text>
        <Text size="sm" c="dimmed" mb="lg">Select a category to browse available products</Text>

        {categories.length === 0 ? (
          <Text c="dimmed">No categories available.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {categories.map((category) => (
              <Card
                key={category.id}
                withBorder
                radius="md"
                padding="lg"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                <Text fw={500} mb={4}>{category.name}</Text>
                <Text size="xs" c="dimmed">{category.products.length} products</Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </PageWrapper>
  );
};