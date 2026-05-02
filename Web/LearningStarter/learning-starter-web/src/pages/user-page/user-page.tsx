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
import { colors } from "../../constants/theme-constants";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const user = useUser();

  return (
    <Container fluid className={classes.root}>
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
              Email
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
    root: {
      background: `radial-gradient(circle at 2.8857421875% 97.55208333333333%, #F4F3E8 0%, 17.5%, rgba(244,243,232,0) 35%), 
        radial-gradient(circle at 42.369791666666664% 100%, #F4F3E8 0%, 17.5%, rgba(244,243,232,0) 35%), 
        radial-gradient(circle at 91.689453125% 19.5703125%, #D4E9CF 0%, 28%, rgba(212,233,207,0) 56%), 
        radial-gradient(circle at 97.41536458333333% 100%, #F4F3E8 0%, 28.419999999999998%, rgba(244,243,232,0) 58%), 
        radial-gradient(circle at 0% 0%, rgba(221,248,50,0.5) 0%, 48%, rgba(221,248,50,0) 80%), 
        radial-gradient(circle at 48.9013671875% 49.521484375%, #FFFFFF 0%, 100%, rgba(255,255,255,0) 100%)`,
      '[data-mantine-color-scheme="dark"] &': {
        background: `radial-gradient(circle at 2.8% 97%, #1A1B1E 0%, 35%, transparent 70%), 
          radial-gradient(circle at 42% 100%, #132e16 0%, 35%, transparent 70%), 
          radial-gradient(circle at 91% 19%, #0D1B2A 0%, 56%, transparent 100%), 
          radial-gradient(circle at 97% 100%, #1A1B1E 0%, 58%, transparent 100%), 
          radial-gradient(circle at 48% 49%, #101113 0%, 100%, transparent 100%)`,
        color: "#C1C2C5",
      },
      width: "100%",
      height: "100vh",
      color: colors.background3,
      paddingTop: "30px",
      paddingBottom: "30px",
      paddingLeft: "60px",
      paddingRight: "60px",
    },

    labelText: {
      fontSize: "var(--mantine-font-size-sm)",
      fontWeight: 500,
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        color: "#D4E9CF",
      },
    },

    formBox: {
      border: `1px solid ${colors.background4}`,
      borderRadius: 0,
      padding: "8px 12px",
      minHeight: "36px",
      display: "flex",
      alignItems: "center",
      fontSize: "var(--mantine-font-size-sm)",
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        borderColor: "#373A40",
        color: "#C1C2C5",
      },
    },

    
  };
});
