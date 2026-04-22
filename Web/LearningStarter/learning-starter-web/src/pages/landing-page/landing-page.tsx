import { Container, Text, Button, Group, Card } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer/footer-page";
import { Navbar } from "../../components/navigation/navbar";

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
      <Text size="lg" ta="center">Featured Products</Text>
      <Group justify="center" wrap="nowrap">
        <Card
              withBorder
              radius="md"
              style={{
                width: "200px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text c="dimmed" size="sm">Product</Text>
            </Card>
        <Card
              withBorder
              radius="md"
              style={{
                width: "200px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
        >
              <Text c="dimmed" size="sm">Product</Text>
            </Card>
        <Card
              withBorder
              radius="md"
              style={{
                width: "200px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
        >
              <Text c="dimmed" size="sm">Product</Text>
            </Card>  
        <Card
              withBorder
              radius="md"
              style={{
                width: "200px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
        >
              <Text c="dimmed" size="sm">Product</Text>
            </Card>
        <Card
              withBorder
              radius="md"
              style={{
                width: "200px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
        >
              <Text c="dimmed" size="sm">Product</Text>
            </Card>  
      </Group>
    </Container>
    </Container>
    </>
  );
};

const useStyles = createStyles(() => {
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
