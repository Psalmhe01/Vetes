import { useEffect, useState } from "react"
import { ApiResponse, CategoryCreateUpdateDto, CategoryGetDto } from "../../constants/types"
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Modal, SimpleGrid, Skeleton, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";

export const CategoryListing = () => {
    const [categories, setCategories] = useState<CategoryGetDto[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false); 
    const theme = useMantineTheme();
    const createForm = useForm<CategoryCreateUpdateDto>({
      initialValues: { name: ""},
      validate: {
        name: (value) => value.length <= 0 ? "Name is required" : null,
      },
    });

    async function fetchCategories() {
      const response = await api.get<ApiResponse<CategoryGetDto[]>>(`/api/categories`);

      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching categories.", color: "red" });
      }

      if (response.data.data) {
        setCategories(response.data.data);
      }
      
      setLoading(false);
    }

    const submitCreate = async (values: CategoryCreateUpdateDto) => {
      const response = await api.post<ApiResponse<CategoryGetDto>>(`/api/categories`, values);
      if (response.data.hasErrors) {
        showNotification({message: "Error creating category.", color: "red"});
        return;
      }
      showNotification({message: "Category Created!", color: "green"});
      setCreateOpen(false);
      createForm.reset();
      fetchCategories();
    };

    useEffect(() => {
    fetchCategories();
}, []);
    
        if (loading) {
    return (
        <Container>
          <Skeleton height={28} width={200} mb={4} />
          <Skeleton height={16} width={280} mb="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={140} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
    );
  }

  return (
      <Container py={20}>
         <div style={
          { display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "4px",
          color: theme.colors.brand[2], 
          }}
        >
          <Text fw={500} size="xl">Shop by category</Text>
          <Button onClick={() => setCreateOpen(true)}>Add category</Button>
        </div>
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
        <Modal
          opened={createOpen}
          onClose={() => { setCreateOpen(false); createForm.reset(); }}
          title="Create category"
        >
          <form onSubmit={createForm.onSubmit(submitCreate)}>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Category name"
              key={createForm.key("name")}
              {...createForm.getInputProps("name")}
            />
            <Button type="submit" mt="md" fullWidth>Create</Button>
          </form>
        </Modal>
      </Container>
  );
};