import { Container, Text, Button } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState, useEffect } from "react";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const [state, setState] = useState(1);

  useEffect(() =>
  {
    setState(state+1);
  }, [])

  return (
    <Container className={classes.homePageContainer}>
      <Text size="lg">Home Page {state}</Text>
      <Button onClick={() => setState(state+1)}>Click moi</Button>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
