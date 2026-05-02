import {
  Container,
  Checkbox,
  Input,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Fieldset,
  Text,
  Divider,
  Title,
  SimpleGrid,
  useMantineTheme,
} from "@mantine/core";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  ApiResponse,
  UserCreateUpdateDto,
  UserDto,
} from "../../constants/types";
import api from "../../config/axios";
import { useAuth, useUser } from "../../authentication/use-auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";

export const UpdateUserPage = () => {
  const { refetchUser } = useAuth();
  const user = useUser();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const theme = useMantineTheme();

  // For user updates, we use the current user's ID
  const userId = user?.id;

  const form = useForm<UserDto>({
    mode: "uncontrolled",
    initialValues: {
      id: user?.id || 0,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userName: user?.userName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      userName: (value) =>
        value.length <= 0 ? "Username cannot be empty" : null,
      firstName: (value) =>
        value.length <= 3 ? "Name must have more than three letters" : null,
    },
  });

  const submitUser = async (values: UserDto) => {
    try {
      const response = await api.put<ApiResponse<UserDto>>(
        `/api/users/${userId}`,
        {
          ...values,
          id: userId,
        },
      );

      if (response.data.hasErrors) {
        const formErrors: FormErrors = response.data.errors.reduce(
          (prev, curr) => {
            Object.assign(prev, { [curr.property]: curr.message });
            return prev;
          },
          {} as FormErrors,
        );
        form.setErrors(formErrors);
      }

      if (response.data.data) {
        showNotification({
          message: "User Successfully Updated!",
          color: "green",
          position: "top-center",
          style: { backgroundColor: "#D4E9CF" },
        });
        await refetchUser();
        navigate(routes.user);
      }
    } catch (error: any) {
      showNotification({
        message: "Failed to update user. Please try again.",
        color: "red",
        position: "top-center",
        style: { backgroundColor: "#E9CFCF" },
      });
    }
  };

  return (
    <Container fluid className={classes.root}>
      <Container px={0}>
        <Title order={3}>Account</Title>
        <Text>View and edit your personal info below.</Text>
      </Container>

      <Divider />
      <Container px={0}>
        <form onSubmit={form.onSubmit(submitUser)}>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={96}>
            <TextInput
              withAsterisk
              label="First Name"
              placeholder="First Name"
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
              radius={0}
              color={colors.background3}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
              radius={0}
            />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              key={form.key("email")}
              {...form.getInputProps("email")}
              radius={0}
            />

            <TextInput
              withAsterisk
              label="Username"
              placeholder="Username"
              key={form.key("userName")}
              {...form.getInputProps("userName")}
              radius={0}
            />

            <TextInput
              label="Phone"
              placeholder="Your phone"
              key={form.key("phone")}
              {...form.getInputProps("phone")}
              radius={0}
            />
          </SimpleGrid>

          <Group justify="flex-end" mt="md">
            <Button
              onClick={() => navigate(routes.user)}
              aria-label="cancel"
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </Group>
        </form>
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
