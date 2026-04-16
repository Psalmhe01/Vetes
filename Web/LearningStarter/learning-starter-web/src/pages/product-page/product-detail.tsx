import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  Skeleton,
  Table,
  Text,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiResponse, ProductGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useCart } from "../../cart/cart-context";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductGetDto>();
  const location = useLocation();
  const from = location.state?.from;
  const [loading, setLoading] = useState(true);
  const userCart = useCart();

  const addToCart = async (
    prodId: number,
    sizeId: number,
    quantity: number,
  ) => {
    const productSizeId = await userCart.findProductSizeId(prodId, sizeId);
    const cartId = await userCart.cart?.id;
    if (!productSizeId || !cartId) {
      showNotification({
        message: "Could not successfully add to cart",
        color: "red",
      });
      return;
    }

    await userCart.addToCart(productSizeId, cartId, quantity);
  };

  useEffect(() => {
    if (!id) return;
    fetchProduct();

    async function fetchProduct() {
      const response = await api.get<ApiResponse<ProductGetDto>>(
        `/api/products/${id}`,
      );
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching product", color: "red" });
        if (from === "category") {
          navigate(-1);
        } else if (from === "listing") {
          navigate("/products");
        } else {
          navigate("/");
        }
      }
      if (response.data.data) {
        setProduct(response.data.data);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Skeleton height={20} width={220} mb="md" />
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 5 }}>
            <Skeleton height={400} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 7 }}>
            <Skeleton height={28} width={200} mb={4} />
            <Skeleton height={16} width={300} mb="sm" />
            <Skeleton height={20} width={80} mb="xl" />
            <Skeleton height={60} radius="md" mb="sm" />
            <Skeleton height={60} radius="md" mb="sm" />
            <Skeleton height={60} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container>
      <Breadcrumbs mb="md">
        <Anchor
          onClick={() => navigate("/categories")}
          style={{ cursor: "pointer" }}
        >
          Categories
        </Anchor>
        <Anchor
          onClick={() => navigate(`/categories/${product.categoryId}`)}
          style={{ cursor: "pointer" }}
        >
          Category
        </Anchor>
        <Text>{product.name}</Text>
      </Breadcrumbs>

      <Grid gutter="xl">
        {/* left side - image */}
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Card
            withBorder
            radius="md"
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text c="dimmed" size="sm">
              Product image coming soon
            </Text>
          </Card>
        </Grid.Col>

        {/* right side - product info */}
        <Grid.Col span={{ base: 12, sm: 7 }}>
          <Text fw={500} size="xl" mb={4}>
            {product.name}
          </Text>
          <Text size="sm" c="dimmed" mb="sm">
            {product.description}
          </Text>
          <Text fw={500} size="lg" mb="xl">
            ${product.price.toFixed(2)}
          </Text>

          {product.sizes.length === 0 ? (
            <Text c="dimmed">No sizes available for this product.</Text>
          ) : (
            <>
              <Text fw={500} mb="sm">
                Sizes and measurements
              </Text>
              {product.sizes.map((size) => (
                <Card key={size.id} withBorder radius="md" padding="md" mb="sm">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Text fw={500}>{size.sizeName}</Text>
                    <Badge
                      variant="light"
                      color={size.stock > 0 ? "green" : "red"}
                    >
                      {size.stock > 0
                        ? `${size.stock} in stock`
                        : "Out of stock"}
                    </Badge>
                  </div>

                  {size.measurements.length > 0 && (
                    <Table fz="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th c="dimmed">Measurement</Table.Th>
                          <Table.Th c="dimmed">Value</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {size.measurements.map((m) => (
                          <Table.Tr key={m.id}>
                            <Table.Td c="dimmed">
                              {m.measurementTypeName}
                            </Table.Td>
                            <Table.Td>
                              {m.value} {m.measurementTypeUnit}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Card>
              ))}
            </>
          )}

          <Button
            onClick={() =>
              addToCart(
                product.id, 
                product.sizes[0].sizeId,
                1,
              )
            }
          >
            Add to Cart
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
