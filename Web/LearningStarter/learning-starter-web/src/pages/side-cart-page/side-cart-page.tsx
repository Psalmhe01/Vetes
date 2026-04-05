import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Modal, Button, ScrollArea, Container, Text, Group, Flex, Space, Divider } from '@mantine/core';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SideCart = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 50em)');

    const content = Array(100)
        .fill(0)
        .map((_, index) => <p key={index}>Modal with scroll</p>);

    return (
        <>
        <Modal
            opened={opened}
            onClose={close}
            title="Cart"
            scrollAreaComponent={ScrollArea.Autosize}
            radius={0}
            yOffset="0vh"
            xOffset="0vw"
            lockScroll
            styles={{
                inner: { justifyContent: 'flex-end', alignItems: 'flex-start' },
                content: { height: '100vh', maxHeight: '100vh' },
            }}
            fullScreen={isMobile}
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <ScrollArea type="hover" h="60vh" offsetScrollbars>
                <Container >{content}</Container>
            </ScrollArea>
            <Container>
                <Group>
                    <Flex direction="row" justify={'space-between'} >
                        <Text size='xl'>Estimated total</Text>
                        <Text size='xl'>$0.00</Text>
                    </Flex>
                    <Text>Taxes and shipping are calculated at checkout.</Text>
                    <Button fullWidth radius={0}>Checkout</Button>
                    <Button variant='outline' radius={0} fullWidth>View Cart</Button>
                    <Text size='m' ta="center">Secure Checkout</Text>
                </Group>
            </Container>
        </Modal>

        <Button variant="subtle" radius="xl" onClick={open}>
            <FontAwesomeIcon icon={faCartShopping} />
        </Button>
        </>
    );
}