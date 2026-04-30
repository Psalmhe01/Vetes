import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useUser } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const user = useUser();

  return (
    <Container>
      <Container px={0}>
        <Container px={0}>
          <Title order={3}>Account</Title>
          <Text>View and edit your personal info below.</Text>
        </Container>

        <Divider />

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={96}>
          <Flex direction="column">
            <Text size="md" className={classes.labelText}>
              First Name
            </Text>
            <Text size="md" className={classes.formBox}>
              {user.firstName}
            </Text>
          </Flex>

          <Flex direction="column">
            <Text size="md" className={classes.labelText}>
              Last Name
            </Text>
            <Text size="md" className={classes.formBox}>
              {user.lastName}
            </Text>
          </Flex>

          <Flex direction="column">
            <Text size="md" className={classes.labelText}>
              Email Address
            </Text>
            <Text size="md" className={classes.formBox}>
              {user.email}
            </Text>
          </Flex>

          <Flex direction="column">
            <Text size="md" className={classes.labelText}>
              Username
            </Text>
            <Text size="md" className={classes.formBox}>
              {user.userName}
            </Text>
          </Flex>

          <Flex direction="column">
            <Text size="md" className={classes.labelText}>
              Phone
            </Text>
            <Text size="md" className={classes.formBox}>
              {user.phone}
            </Text>
          </Flex>
        </SimpleGrid>
        <Flex px={0} mt="md" justify="flex-end">
          <Button
            onClick={() => navigate(routes.updateUser)}
            justify="flex-end"
          >
            Update Info
          </Button>
        </Flex>
      </Container>
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    labelText: {
      fontSize: "var(--mantine-font-size-sm)",
      fontWeight: 500,
      marginBottom: theme.spacing.xs,
    },

    formBox: {
      border: "1px solid #ced4da",
      borderRadius: 0,
      padding: "8px 12px",
      minHeight: "36px",
      display: "flex",
      alignItems: "center",
      fontSize: "var(--mantine-font-size-sm)",
    },
  };
});
