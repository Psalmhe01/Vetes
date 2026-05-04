import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiResponse,
  CategoryCreateUpdateDto,
  CategoryGetDto,
} from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import {
  Anchor,
  Breadcrumbs,
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
import { ProductCard } from "../../components/product-card/product-card";

export const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryGetDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateOpen, setUpdateOpen] = useState(false);
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const updateForm = useForm<CategoryCreateUpdateDto>({
    initialValues: { name: "" },
    validate: {
      name: (value) => (value.length <= 0 ? "Name is required" : null),
    },
  });

  useEffect(() => {
    if (!id) return;
    fetchCategory();

    async function fetchCategory() {
      const response = await api.get<ApiResponse<CategoryGetDto>>(
        `/api/categories/${id}`,
      );
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching category.", color: "red" });
        navigate("/categories");
        window.scrollTo(0, 0);
      }
      if (response.data.data) {
        setCategory(response.data.data);
      }
      setLoading(false);
    }
  }, [id]);

  const openUpdate = () => {
    if (!category) return;
    updateForm.setValues({ name: category.name });
    setUpdateOpen(true);
  };

  const submitUpdate = async (values: CategoryCreateUpdateDto) => {
    if (!category) return;
    try {
      const response = await api.put<ApiResponse<CategoryGetDto>>(
        `/api/categories/${id}`,
        values,
      );
      if (response.data.hasErrors) {
        showNotification({ message: "Error updating category.", color: "red" });
        return;
      }
      showNotification({ message: "Category updated!", color: "green" });
      setUpdateOpen(false);
      setCategory({ ...response.data.data, products: category.products });
    } catch (error) {
      showNotification({ message: "Error updating category.", color: "red" });
    }
  };

  if (loading) {
    return (
      <Container fluid className={classes.root}>
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
    <Container fluid className={classes.root}>
      <Breadcrumbs mb="md">
        <Anchor
          onClick={() => {
            navigate("/categories");
            window.scrollTo(0, 0);
          }}
          style={{ cursor: "pointer", color: colors.text }}
        >
          Categories
        </Anchor>
        <Text className={classes.breadcrumbColor}>{category.name}</Text>
      </Breadcrumbs>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <Text fw={500} size="xl">
          {category.name}
        </Text>
        <Button variant="outline" onClick={openUpdate}>
          Edit
        </Button>
      </div>
      <Text size="sm" c="dimmed" mb="lg">
        {category.products.length} products
      </Text>

      {category.products.length === 0 ? (
        <Text c="dimmed">No products in this category yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              onClick={() => {
                navigate(`/products/${product.id}`, {
                  state: { from: "home" },
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ))}
        </SimpleGrid>
      )}
      <Modal
        opened={updateOpen}
        onClose={() => setUpdateOpen(false)}
        title="Edit category"
      >
        <form onSubmit={updateForm.onSubmit(submitUpdate)}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Category name"
            key={updateForm.key("name")}
            {...updateForm.getInputProps("name")}
          />
          <Button type="submit" mt="md" fullWidth>
            Save
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    root: {
      backgroundColor: colors.background4,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#1A1B1E",
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

    breadcrumbColor: {
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        color: "#D4E9CF",
      },
    },
  };
});
