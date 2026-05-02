import {
  Container,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
  Skeleton,
  Title,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer-page";
import { Navbar } from "../../components/navigation/navbar";
import { ProductCard } from "../../components/product-card/product-card";
import { showNotification } from "@mantine/notifications";
import { colors } from "../../constants/theme-constants";
import api from "../../config/axios";
import homeImage from "../../assets/home.png";
import { ProductGetDto, ApiResponse } from "../../constants/types";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const [state, setState] = useState(1);
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductGetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();

  async function fetchProduct() {
    const response =
      await api.get<ApiResponse<ProductGetDto[]>>(`/api/products`);
    if (response.data.hasErrors) {
      showNotification({
        message: "Error fetching products.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
    if (response.data.data) {
      setProducts(response.data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <Container fluid p={0}>
        {/* Hero / Intro Container Skeleton */}
        <Container
          fluid
          p={50}
          h={500}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Skeleton height={96} width="60%" mb="md" />
          <Skeleton height={20} width="30%" mb="xl" />
          <Skeleton height={42} width={120} radius="xl" />
        </Container>

        {/* Featured Products Skeleton */}
        <Container fluid p={50}>
          <Skeleton height={40} width="40%" mb="md" />
          <Divider h={30} mb="md" />
          <SimpleGrid cols={3} spacing="lg">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height={320} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid className={classes.homePageContainer}>
      <Container fluid p={50} className={classes.introContainer}>
        <Title order={1} size="96px">
          Shop your Style
        </Title>
        <Text size="sm">Fashion with Elegance</Text>
        <Button
          radius="xl"
          style={{
            color: colors.background3,
            backgroundColor: colors.buttonText,
            fontWeight: "lighter",
            marginTop: "30px",
          }}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </Button>
      </Container>
      <Container className={classes.featuredProductsContainer} fluid>
        <Title order={1} fw={700} ta="left" w="100%">
          Explore our Featured Products
        </Title>
        <Divider h={30} color={colors.background3} />
        <SimpleGrid cols={3} spacing="lg" mt="md">
          {products.slice(0, 3).map((product) => (
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
      </Container>
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    introContainer: {
      height: "500px",
      backgroundImage: `url(${homeImage})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      color: colors.background2,
    },

    homePageContainer: {
      width: "100vw",
      height: "100%",
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        color: "#C1C2C5",
        backgroundColor: "#1A1B1E",
      },
      padding: 0,
    },
    featuredProductsContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "20px",
      width: "100%",
      padding: "50px",
      backgroundColor: colors.background4,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#2C2E33",
      },
    },

    productCard: {
      background: "none",
      color: colors.text,
      border: "none",
    },
  };
});
