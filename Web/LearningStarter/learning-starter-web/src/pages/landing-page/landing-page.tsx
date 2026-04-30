import { Container, Text, Button, Group, Card, SimpleGrid } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer-page";
import { Navbar } from "../../components/navigation/navbar";
import { ProductCard } from "../../components/product-card/product-card";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const [state, setState] = useState(1);
  const navigate = useNavigate()

  useEffect(() =>
  {
    setState(state+1);
  }, [])

  return (
    <>
    <Container>
      <Navbar />
    <Container className={classes.featuredProductsContainer} fluid>
      <Text size="xl" fw={700} ta="center" w="100%">Featured Products</Text>
    <SimpleGrid cols={4} spacing="lg" mt="md">
      <ProductCard
        name="Red Shirt"
        price={20.00}
        description="A red shirt"
      />
      <ProductCard
        name="Product"
        price={20.00}
        description="A product description that is a bit longer than the others to test text wrapping and layout consistency across different product cards"
      />
      <ProductCard
        name="Product"
        price={20.00}
        description="A product description that is not as long"
      />
      <ProductCard
        name="Product"
        price={20.00}
        description="A product description that is not as long"
      />
    </SimpleGrid>
    </Container>
    </Container>
    </>
  );
};

const useStyles = createStyles((theme) => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },
    featuredProductsContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "20px",
      height: "80vh",
    },
  };
});
