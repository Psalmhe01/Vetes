import {
  Container,
  Text,
  Skeleton,
  Grid,
  Card,
  Badge,
  Table,
  Anchor,
  Breadcrumbs,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
  ActionIcon,
  Group,
  NumberInputHandlers,
  Radio,
  useMantineTheme,
  Image,
  Center
} from "@mantine/core";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ApiResponse,
  ProductGetDto,
  SizeGetDto,
  MeasurementTypeGetDto,
  ProductSizeCreateDto,
  ProductSizeMeasurementCreateDto,
} from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useCart } from "../../cart/cart-context";
import { useForm } from "@mantine/form";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductGetDto | null>(null);
  const location = useLocation();
  const from = location.state?.from;
  const [loading, setLoading] = useState(true);
  const userCart = useCart();
  const [sizes, setSizes] = useState<SizeGetDto[]>([]);
  const [measurementTypes, setMeasurementTypes] = useState<
    MeasurementTypeGetDto[]
  >([]);

  const [addSizeOpen, setAddSizeOpen] = useState(false);
  const [addMeasurementOpen, setAddMeasurementOpen] = useState(false);
  const [selectedProductSizeId, setSelectedProductSizeId] = useState<
    number | null
  >(null);

  const addSizeForm = useForm<{ sizeId: string; stock: number }>({
    initialValues: { sizeId: "", stock: 0 },
    validate: {
      sizeId: (value) => (value.length <= 0 ? "Size is required" : null),
      stock: (value) => (value <= 0 ? "Stock must be greater than 0" : null),
    },
  });

  const addMeasurementForm = useForm<{
    measurementTypeId: string;
    value: number;
  }>({
    initialValues: { measurementTypeId: "", value: 0 },
    validate: {
      measurementTypeId: (value) =>
        value.length <= 0 ? "Measurement type is required" : null,
      value: (value) => (value <= 0 ? "Value must be greater than 0" : null),
    },
  });

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
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
      return;
    }

    await userCart.addToCart(productSizeId, cartId, quantity);
    await fetchProduct();
  };

  const fetchProduct = async () => {
    try {
      const [productRes, sizesRes, measurementTypesRes] = await Promise.all([
        api.get<ApiResponse<ProductGetDto>>(`/api/products/${id}`),
        api.get<ApiResponse<SizeGetDto[]>>(`/api/size`),
        api.get<ApiResponse<MeasurementTypeGetDto[]>>(`/api/measurementtypes`),
      ]);

      if (productRes.data.hasErrors) {
        showNotification({
          message: "Error fetching product.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        if (from === "category") {
          navigate(-1);
        } else if (from === "listing") {
          navigate("/products");
        } else {
          navigate("/");
        }
        return;
      }

      setProduct(productRes.data.data);

      if (sizesRes.data.data) {
        setSizes(sizesRes.data.data);
      }

      if (measurementTypesRes.data.data) {
        setMeasurementTypes(measurementTypesRes.data.data);
      }
    } catch (error) {
      showNotification({
        message: "Error fetching product.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const submitAddSize = async (values: { sizeId: string; stock: number }) => {
    try {
      const response = await api.post<ApiResponse<any>>(
        `/api/size/${values.sizeId}/product/${id}?stock=${values.stock}`,
        {},
      );
      if (response.data.hasErrors) {
        showNotification({
          message: response.data.errors?.[0]?.message ?? "Error adding size.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        return;
      }
      showNotification({
        message: "Size added!",
        color: "green",
        position: "top-center",
        style: { backgroundColor: "#D4E9CF" },
      });
      setAddSizeOpen(false);
      addSizeForm.reset();
      fetchProduct();
    } catch (error) {
      showNotification({
        message: "Error adding size.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
  };

  const openAddMeasurement = (productSizeId: number) => {
    setSelectedProductSizeId(productSizeId);
    addMeasurementForm.reset();
    setAddMeasurementOpen(true);
  };

  const submitAddMeasurement = async (values: {
    measurementTypeId: string;
    value: number;
  }) => {
    if (!selectedProductSizeId) return;
    try {
      const response = await api.post<ApiResponse<any>>(
        `/api/productsizemeasurements`,
        {
          productSizeId: selectedProductSizeId,
          measurementTypeId: parseInt(values.measurementTypeId),
          value: values.value,
        },
      );
      if (response.data.hasErrors) {
        showNotification({
          message:
            response.data.errors?.[0]?.message ?? "Error adding measurement.",
          color: "red",
          position: "top-center",
          style: { backgroundColor: "#E9CFCF" },
        });
        return;
      }
      showNotification({
        message: "Measurement added!",
        color: "green",
        position: "top-center",
        style: { backgroundColor: "#D4E9CF" },
      });
      setAddMeasurementOpen(false);
      addMeasurementForm.reset();
      fetchProduct();
    } catch (error) {
      showNotification({
        message: "Error adding measurement.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
  };

  const [quantity, setQuantity] = useState(1);

  const [itemSize, setItemSize] = useState(product?.sizes[0]?.sizeId) ?? 1;

  const { classes } = useStyles();

  const theme = useMantineTheme();

  const handlersRef = useRef<NumberInputHandlers>(null);

  if (loading) {
    return (
      <Container fluid className={classes.root}>
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
    <Container fluid className={classes.root}>
      <Breadcrumbs mb="xl">
        <Anchor
          onClick={() => navigate("/categories")}
          style={{ cursor: "pointer", color: colors.text }}
        >
          Categories
        </Anchor>
        <Anchor
          onClick={() => navigate(`/categories/${product.categoryId}`)}
          style={{ cursor: "pointer", color: colors.text }}
        >
          Category
        </Anchor>
        <Text className={classes.breadcrumbColor}>{product.name}</Text>
      </Breadcrumbs>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Card
            withBorder
            radius="md"
            p={0} // Adding p={0} makes the image go to the edges of the card
            style={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden" 
            }}
          >
          
          {product?.productImages && product.productImages.length > 0 ? (
            <Image
              src={product.productImages[0].imageUrl}
              alt={product.name}
              height={400}
              fit="contain"
            />
          ) : (
          
            <Text c="dimmed" size="sm">
              Product image coming soon
            </Text>
          )}
          </Card>
        </Grid.Col>

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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Text fw={500}>Sizes and measurements</Text>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setAddSizeOpen(true)}
            >
              + Add size
            </Button>
          </div>

          {product.sizes.length === 0 ? (
            <Text c="dimmed">No sizes available for this product.</Text>
          ) : (
            product.sizes.map((size) => (
              <Radio.Group
                value={String(itemSize)}
                onChange={() => setItemSize(size.sizeId)}
                key={size.id}
              >
                <Card
                  key={size.id}
                  withBorder
                  radius="md"
                  padding="md"
                  mb="sm"
                  className={classes.radioGroup}
                >
                  <Radio.Card
                    value={String(size.sizeId)}
                    withBorder={false}
                    disabled={size.stock === 0}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Radio.Indicator
                          variant="outline"
                          style={{
                            cursor:
                              size.stock === 0 ? "not-allowed" : "pointer",
                          }}
                        />
                        <Text fw={500}>{size.sizeName}</Text>
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={() => openAddMeasurement(size.id)}
                        >
                          +
                        </Button>
                      </div>
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
                  </Radio.Card>
                </Card>
              </Radio.Group>
            ))
          )}
          <Text fw={500}>Quantity</Text>
          <Group
            gap={0}
            align="center"
            justify="space-between"
            style={{
              border: `solid ${colors.background3} 1px`,
              width: "200px",
              marginBottom: "10px",
              backgroundColor: `${colors.background1}`,
            }}
          >
            <ActionIcon
              onClick={() => {
                const newQuantity = quantity - 1;
                if (newQuantity < 1) {
                  setQuantity(1);
                } else {
                  setQuantity(newQuantity);
                }
              }}
              variant="subtle"
              size={36}
              radius={0}
            >
              <FontAwesomeIcon icon={faMinus} />
            </ActionIcon>
            <NumberInput
              handlersRef={handlersRef}
              step={1}
              min={0}
              max={100}
              value={quantity}
              onChange={(value) => {
                const nextQuantity =
                  typeof value === "string" ? Number(value) : (value ?? 0);
                setQuantity(nextQuantity);
              }}
              hideControls
              w={60}
              styles={{ input: { textAlign: "center" } }}
              radius={0}
              variant="unstyled"
            />
            <ActionIcon
              onClick={() => {
                const newQuantity = quantity + 1;
                setQuantity(newQuantity);
              }}
              variant="subtle"
              size={36}
              radius={0}
            >
              <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
          </Group>
          <Button
            onClick={() => addToCart(product.id, itemSize ?? 1, quantity)}
            className={classes.addToCartBtn}
            fullWidth
            radius="xl"
          >
            Add to cart
          </Button>
        </Grid.Col>
      </Grid>

      <Modal
        opened={addSizeOpen}
        onClose={() => {
          setAddSizeOpen(false);
          addSizeForm.reset();
        }}
        title="Add size to product"
      >
        <form onSubmit={addSizeForm.onSubmit(submitAddSize)}>
          <Select
            withAsterisk
            label="Size"
            placeholder="Select a size"
            data={sizes.map((s) => ({ value: String(s.id), label: s.name }))}
            key={addSizeForm.key("sizeId")}
            {...addSizeForm.getInputProps("sizeId")}
          />
          <NumberInput
            withAsterisk
            label="Stock"
            placeholder="How many in stock"
            min={1}
            mt="md"
            key={addSizeForm.key("stock")}
            {...addSizeForm.getInputProps("stock")}
          />
          <Button
            type="submit"
            mt="md"
            fullWidth
            className={classes.addToCartBtn}
          >
            Add size
          </Button>
        </form>
      </Modal>

      <Modal
        opened={addMeasurementOpen}
        onClose={() => {
          setAddMeasurementOpen(false);
          addMeasurementForm.reset();
        }}
        title="Add measurement"
      >
        <form onSubmit={addMeasurementForm.onSubmit(submitAddMeasurement)}>
          <Select
            withAsterisk
            label="Measurement type"
            placeholder="Select a measurement type"
            data={measurementTypes.map((mt) => ({
              value: String(mt.id),
              label: `${mt.name} (${mt.unit})`,
            }))}
            key={addMeasurementForm.key("measurementTypeId")}
            {...addMeasurementForm.getInputProps("measurementTypeId")}
          />
          <NumberInput
            withAsterisk
            label="Value"
            placeholder="Measurement value"
            min={0.1}
            decimalScale={2}
            mt="md"
            key={addMeasurementForm.key("value")}
            {...addMeasurementForm.getInputProps("value")}
          />
          <Button
            type="submit"
            mt="md"
            fullWidth
            className={classes.addToCartBtn}
          >
            Add measurement
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
      color: colors.background3,
      paddingTop: "30px",
      paddingBottom: "30px",
      paddingLeft: "60px",
      paddingRight: "60px",
    },

    categoryCard: {
      backgroundColor: colors.background1,
      color: colors.text,
      border: `solid 1px ${colors.background3}`,
      cursor: "pointer",
      fontWeight: "lighter",
      borderRadius: 0,
    },

    addToCartBtn: {
      backgroundColor: colors.background3,
      color: colors.buttonText,
      
    },

    breadcrumbColor: {
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        color: "#D4E9CF",
      },
    },

    radioGroup: {
      backgroundColor: colors.background1,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#2C2E33",
        borderColor: "#373A40",
        color: "#C1C2C5",
      },
      border: `solid 1px ${colors.background3}`,
      borderRadius: 0,
      color: colors.background3,
    },
  };
});
