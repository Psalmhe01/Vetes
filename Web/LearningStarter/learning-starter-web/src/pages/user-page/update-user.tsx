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

export const UpdateUserPage = () => {
  const { refetchUser } = useAuth();
  const user = useUser();
  const navigate = useNavigate();
  const { classes } = useStyles();

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
        });
        await refetchUser();
        navigate(routes.user);
      }
    } catch (error: any) {
      showNotification({
        message: "Failed to update user. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Container>
      <Container px={0}>
        <Title order={3}>Account</Title>
        <Text>View and edit your personal info below.</Text>
      </Container>

      <Divider />
      <form onSubmit={form.onSubmit(submitUser)}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={96}>
          <TextInput
            withAsterisk
            label="First Name"
            placeholder="First Name"
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
            radius={0}
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
            label="Phone Number"
            placeholder="Your phone"
            key={form.key("phone")}
            {...form.getInputProps("phone")}
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
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button
            onClick={() => navigate(routes.user)}
            aria-label="cancel"
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {};
});
