import {
  Button,
  Card,
  Container,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiResponse,
  CategoryGetDto,
  ProductCreateDto,
  ProductGetDto,
} from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { useForm } from "@mantine/form";
import { createStyles } from "@mantine/emotion";
import { ProductCard } from "../../components/product-card/product-card";
import { colors } from "../../constants/theme-constants";

export const ProductListing = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductGetDto[]>([]);
  const [categories, setCategories] = useState<CategoryGetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const { classes } = useStyles();

  const theme = useMantineTheme();

  const createForm = useForm<ProductCreateDto>({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: 0,
    },
    validate: {
      name: (value) => (value.length <= 0 ? "Name is required" : null),
      description: (value) =>
        value.length <= 0 ? "Description is required" : null,
      price: (value) => (value <= 0 ? "Price must be greater than 0" : null),
      categoryId: (value) => (value <= 0 ? "Category is required" : null),
    },
  });

  const fetchProducts = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<ApiResponse<ProductGetDto[]>>(`/api/products`),
        api.get<ApiResponse<CategoryGetDto[]>>(`/api/categories`),
      ]);

      if (productsRes.data.hasErrors) {
        showNotification({
          message: "Error fetching products.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
      }
      if (productsRes.data.data) {
        setProducts(productsRes.data.data);
      }
      if (categoriesRes.data.data) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      showNotification({
        message: "Error fetching products.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitCreate = async (values: ProductCreateDto) => {
    try {
      const response = await api.post<ApiResponse<ProductGetDto>>(
        `/api/products`,
        values,
      );
      if (response.data.hasErrors) {
        showNotification({
          message:
            response.data.errors?.[0]?.message ?? "Error creating product.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        return;
      }
      showNotification({
        message: "Product created!",
        color: "green",
        position: "top-center",
        style: { backgroundColor: "#D4E9CF" },
      });
      setCreateOpen(false);
      createForm.reset();
      fetchProducts();
    } catch (error) {
      showNotification({
        message: "Error creating product.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
  };

  if (loading) {
    return (
      <Container  fluid className={classes.root}>
        <Skeleton height={28} width={200} mb={4} />
        <Skeleton height={16} width={280} mb="xl" />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height={140} radius="md" />
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  return (
    <Container fluid className={classes.root}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <Text fw={500} size="xl">
          All products
        </Text>
        <Button
          onClick={() => setCreateOpen(true)}
          className={classes.prodButton}
        >
          Add product
        </Button>
      </div>
      <Text size="sm" c="dimmed" mb="lg">
        Browse all available products
      </Text>

      {products.length === 0 ? (
        <Text c="dimmed">No products available.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              onClick={() =>
                navigate(`/products/${product.id}`, {
                  state: { from: "home" },
                })
              }
            />
          ))}
        </SimpleGrid>
      )}
      <Modal
        opened={createOpen}
        onClose={() => {
          setCreateOpen(false);
          createForm.reset();
        }}
        title="Create product"
        styles={{
          title: { color: colors.text },
          content: { backgroundColor: colors.background2 }
        }}
      >
        <form onSubmit={createForm.onSubmit(submitCreate)}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Product name"
            key={createForm.key("name")}
            {...createForm.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Description"
            placeholder="Product description"
            mt="md"
            key={createForm.key("description")}
            {...createForm.getInputProps("description")}
          />
          <NumberInput
            withAsterisk
            label="Price"
            placeholder="0.00"
            min={0.01}
            decimalScale={2}
            mt="md"
            key={createForm.key("price")}
            {...createForm.getInputProps("price")}
          />
          <Select
            withAsterisk
            label="Category"
            placeholder="Select a category"
            mt="md"
            data={categories.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            key={createForm.key("categoryId")}
            onChange={(value) =>
              createForm.setFieldValue(
                "categoryId",
                value ? parseInt(value) : 0,
              )
            }
            value={
              createForm.values.categoryId
                ? String(createForm.values.categoryId)
                : ""
            }
          />
          <Button type="submit" mt="md" fullWidth className={classes.prodButton}>
            Create
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
      width: "100%",
      minHeight: "100vh",
      color: colors.text,
      padding: "30px",
    },

    categoryCard: {
      backgroundColor: colors.background1,
      color: colors.text,
      border: `solid 1px ${colors.background3}`,
      cursor: "pointer",
      fontWeight: "lighter",
      borderRadius: 0,
    },

    prodButton: {
      "&:hover": {
        background: "none",
        borderColor: colors.text,
        color: colors.text,
      },
    },
  };
});
