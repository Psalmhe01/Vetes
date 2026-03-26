import { Container, Checkbox, Input, TextInput, PasswordInput, Group, Button, Fieldset } from "@mantine/core"
import { PageWrapper } from "../../components/page-wrapper/page-wrapper"
import { useForm } from "@mantine/form";
//import { IMaskInput } from 'react-imask';

export const RegisterPage = ({
    fetchCurrentUser,
    onBackToLogin,
}: {
    fetchCurrentUser: () => void;
    onBackToLogin: () => void;
}) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmpass: '',
            phone: '',
        termsOfService: false,
        validateInputOnBlur: true,
        },

        validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        username: (value) => (value.length <= 0 ? "username cannot be empty" : null),
        firstname: (value) => (value.length <= 3 ? "Name must have more than three letters" : null),
        password: (value) => (value.length <= 0 ? "password cannot be empty" : null),
        confirmpass: (value, values) => value !== values.password ? 'Passwords did not match' : null
        },
    });
    return (
        <PageWrapper>
            <Container>
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <Fieldset legend="Personal Information">
                        <TextInput
                            withAsterisk
                            label="First Name"
                            placeholder="First Name"
                            key={form.key('firstname')}
                            {...form.getInputProps('firstname')}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Last Name"
                            key={form.key('lastname')}
                            {...form.getInputProps('lastname')}
                        />
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            /*component={IMaskInput}*/
                            label="Phone Number"
                            placeholder="Your phone"
                            key={form.key('phone')}
                            {...form.getInputProps('phone')}
                        />
                    </Fieldset>
                    <Fieldset legend="Account Information">
                        <TextInput
                            withAsterisk
                            label="Username"
                            placeholder="Username"
                            key={form.key('username')}
                            {...form.getInputProps('username')}
                        />
                        <PasswordInput
                            mt= "md"
                            withAsterisk
                            label="Password"
                            placeholder="********"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            mt="md"
                            withAsterisk
                            label="Confirm Password"
                            placeholder="********"
                            key={form.key('confirmpass')}
                            {...form.getInputProps('confirmpass')}
                        />
                    </Fieldset>

                
                    <Group justify="flex-end" mt="md">
                        <Button onClick={onBackToLogin} aria-label="Not a new user? Login">
                            Login
                        </Button>
                        <Button type="submit">
                            Submit
                        </Button>

                    </Group>
                </form>
            </Container>
        </PageWrapper>
    )    
}