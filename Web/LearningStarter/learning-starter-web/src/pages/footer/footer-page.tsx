import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Divider, Group, Space, Image, ActionIcon } from "@mantine/core";



export const Footer = () => {

    const logo = "/logo.png"

    return (
        <Container>
            <Space h="l" />
            <Divider my="sm" />
            <Group justify="space-between">
                <Container>
                    <Image
                        radius="md"
                        h={200}
                        w="auto"
                        fit="contain"
                        src={logo}
                    />
                    <Space h="l" />
                    <p>985-CALL-VETES</p>
                    <p>vetements@gmail.com</p>
                    <Space h="m" />
                    <p>1211 SGA Dr. <br />Hammond, LA 70402</p>
                    <Space h="m" />
                    <Group grow>
                        <Container><FontAwesomeIcon icon={"face-angry"}/></Container>
                        <Container><FontAwesomeIcon icon= {"facebook"} /></Container>
                        <Container><FontAwesomeIcon icon={"facebook"}/></Container>
                        <Container><FontAwesomeIcon icon={"tiktok"}/></Container>
                    </ Group>
                </Container>
                <Container>
                    <p>Privacy Policy</p>
                    <p>Accessibility Statement</p>
                    <p>Shipping Policy</p>
                    <p>Terms and Conditions</p>
                    <p>Return Policy</p>
                    <Space h="m" />
                    <p>© 2026 by Les V</p>
                </Container>
            </Group>
            <Divider my="sm" />
            <Space h="l" />
        </Container>
    )
}