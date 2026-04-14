import { Button, Container, Divider, Flex, Text } from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const user = useUser();
  const { classes } = useStyles();
  const navigate = useNavigate();
  
  return (
    <Container>
      <Container>
        <Text size="lg" ta="center">
          User Information
        </Text>
        <Container className={classes.textAlignLeft}>
          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              First Name:
            </Text>
            <Text size="md">{user.firstName}</Text>
          </Flex>

          <Divider />

          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Last Name:
            </Text>
            <Text size="md">{user.lastName}</Text>
          </Flex>

          <Divider />

          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Email Address:
            </Text>
            <Text size="md">{user.email}</Text>
          </Flex>

          <Divider />

          <Flex direction="row">
            <Text size="md" className={classes.labelText}>
              Phone:
            </Text>
            <Text size="md">{user.phone}</Text>
          </Flex>

          <Divider />
          <Button onClick={() => navigate(routes.updateUser)}>Update</Button>
          
        </Container>
      </Container>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    textAlignLeft: {
      textAlign: "left",
    },

    labelText: {
      marginRight: "10px",
    },

    userPageContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
