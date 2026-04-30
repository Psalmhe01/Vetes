import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  Fieldset,
  Group,
  Input,
  PasswordInput,
  Text,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { Navigate } from "react-router-dom";
import { routes } from "../../routes";
import { redirect } from "react-router-dom";
import { useState } from "react";

type LoginRequest = {
  userName: string;
  password: string;
};

type LoginResponse = ApiResponse<boolean>;

//This is a *fairly* basic form
//The css used in here is a good example of how flexbox works in css
//For more info on flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
export const LoginPage = ({
  fetchCurrentUser,
  onRegisterClick,
}: {
  fetchCurrentUser: () => void;
  onRegisterClick: () => void;
}) => {
  const styles = useStyles();
  const { classes } = styles;

  const form = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) =>
        value.length <= 0 ? "Username must not be empty" : null,
      password: (value) =>
        value.length <= 0 ? "Password must not be empty" : null,
    },
  });

  const [, submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    const response = await api.post<LoginResponse>(`/api/authenticate`, values);
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
      showNotification({ message: "Successfully Logged In!", color: "green" });
      fetchCurrentUser();
    }
  }, []);

  return (
    <PageWrapper>
      <Container className={classes.root}>
        <Container px={0}>
          {form.errors[""] && (
            <Alert className={classes.generalErrors} color="red">
              <Text>{form.errors[""]}</Text>
            </Alert>
          )}
          <form onSubmit={form.onSubmit(submitLogin)}>
            <Fieldset legend="Login" radius={0} className={classes.formBox}>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="userName">Username</label>
                </Container>

                <Input {...form.getInputProps("userName")} />
                <Text c="red">{form.errors["userName"]}</Text>
              </Container>
              <Container className={classes.formField} px={0}>
                <Container px={0}>
                  <label htmlFor="password">Password</label>
                </Container>
                <PasswordInput
                  type="password"
                  {...form.getInputProps("password")}
                />
                <Text c="red">{form.errors["password"]}</Text>
              </Container>

              <Container px={0}>
                <Group justify="flex-end" mt="md" align="center">
                  <Button
                    className={classes.loginButton}
                    onClick={onRegisterClick}
                    aria-label="New User? Register"
                    variant="outline"
                  >
                    Register
                  </Button>
                  <Button className={classes.loginButton} type="submit">
                    Login
                  </Button>
                </Group>
              </Container>
            </Fieldset>
          </form>
        </Container>
      </Container>
    </PageWrapper>
  );
};

const useStyles = createStyles((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
    },

    generalErrors: {
      marginBottom: "8px",
    },

    loginButton: {
      marginTop: "8px",
    },

    formField: {
      marginBottom: "8px",
    },

    formBox: {
      maxWidth: "600px",
      background: "none",
      border: "solid 1px",
      borderColor: theme.colors.brand[4],
      color: theme.colors.brand[4],
      alignSelf: "center",
    },
  };
});
