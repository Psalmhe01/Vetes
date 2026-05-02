import { useEffect, useState } from "react";
import {
  ApiResponse,
  CategoryCreateUpdateDto,
  CategoryGetDto,
} from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Modal,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";

export const CategoryListing = () => {
  const [categories, setCategories] = useState<CategoryGetDto[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const createForm = useForm<CategoryCreateUpdateDto>({
    initialValues: { name: "" },
    validate: {
      name: (value) => (value.length <= 0 ? "Name is required" : null),
    },
  });

  async function fetchCategories() {
    const response =
      await api.get<ApiResponse<CategoryGetDto[]>>(`/api/categories`);

    if (response.data.hasErrors) {
      showNotification({
        message: "Error fetching categories.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }

    if (response.data.data) {
      setCategories(response.data.data);
    }

    setLoading(false);
  }

  const submitCreate = async (values: CategoryCreateUpdateDto) => {
    const response = await api.post<ApiResponse<CategoryGetDto>>(
      `/api/categories`,
      values,
    );
    if (response.data.hasErrors) {
      showNotification({
        message: "Error creating category.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
      return;
    }
    showNotification({
      message: "Category Created!",
      color: "green",
      position: "top-center",
      style: { backgroundColor: "#D4E9CF" },
    });
    setCreateOpen(false);
    createForm.reset();
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Container fluid className={classes.categoryRoot}>
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
    <Container fluid className={classes.categoryRoot}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
          color: colors.text,
        }}
      >
        <Text fw={500} size="xl">
          Shop by category
        </Text>
        <Button
          onClick={() => setCreateOpen(true)}
          className={classes.catButton}
        >
          Add category
        </Button>
      </div>
      <Text size="sm" c="dimmed" mb="lg">
        Select a category to browse available products
      </Text>

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
              className={classes.categoryCard}
              onClick={() => navigate(`/categories/${category.id}`)}
            >
              <Text fw={500} mb={4}>
                {category.name}
              </Text>
              <Text size="xs" c="dimmed">
                {category.products.length} products
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
      <Modal
        opened={createOpen}
        onClose={() => {
          setCreateOpen(false);
          createForm.reset();
        }}
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
          <Button type="submit" mt="md" fullWidth>
            Create
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    categoryRoot: {
      background: `radial-gradient(circle at 2.8857421875% 97.55208333333333%, #F4F3E8 0%, 17.5%, rgba(244,243,232,0) 35%), 
        radial-gradient(circle at 42.369791666666664% 100%, #F4F3E8 0%, 17.5%, rgba(244,243,232,0) 35%), 
        radial-gradient(circle at 91.689453125% 19.5703125%, #D4E9CF 0%, 28%, rgba(212,233,207,0) 56%), 
        radial-gradient(circle at 97.41536458333333% 100%, #F4F3E8 0%, 28.419999999999998%, rgba(244,243,232,0) 58%), 
        radial-gradient(circle at 0% 0%, rgba(221,248,50,0.5) 0%, 48%, rgba(221,248,50,0) 80%), 
        radial-gradient(circle at 48.9013671875% 49.521484375%, #FFFFFF 0%, 100%, rgba(255,255,255,0) 100%)`,
      '[data-mantine-color-scheme="dark"] &': {
        background: `radial-gradient(circle at 2.8% 97%, #1A1B1E 0%, 35%, transparent 70%), 
          radial-gradient(circle at 42% 100%, #132e16 0%, 35%, transparent 70%), 
          radial-gradient(circle at 91% 19%, #0D1B2A 0%, 56%, transparent 100%), 
          radial-gradient(circle at 97% 100%, #1A1B1E 0%, 58%, transparent 100%), 
          radial-gradient(circle at 48% 49%, #101113 0%, 100%, transparent 100%)`,
        color: "#C1C2C5",
      },
      width: "100%",
      minHeight: "100vh",
      color: colors.text,
      padding: "30px",
    },

    categoryCard: {
      backgroundColor: colors.background1,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#2C2E33",
        borderColor: "#373A40",
      },
      color: colors.text,
      border: `solid 1px ${colors.background3}`,
      cursor: "pointer",
      fontWeight: "lighter",
      borderRadius: 0,
    },

    catButton: {
      "&:hover": {
        background: "none",
        borderColor: colors.text,
        color: colors.text,
      },
    },
  };
});
