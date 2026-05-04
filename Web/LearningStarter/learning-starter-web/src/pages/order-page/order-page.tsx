import {
  Container,
  Stack,
  Title,
  Text,
  Card,
  Divider,
  Group,
  Badge,
  Loader,
  Center,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";
import {
  ApiResponse,
  OrdersGetDto,
  ShippingAddressesGetDto,
} from "../../constants/types";
import { useUser } from "../../authentication/use-auth";

const AddressDisplay = ({ addressId }: { addressId: number }) => {
  const [address, setAddress] = useState<string>("Loading...");

  useEffect(() => {
    if (!addressId) return;
    api
      .get<ApiResponse<ShippingAddressesGetDto>>(
        `/api/shipping-addresses/${addressId}`,
      )
      .then((res) => {
        if (res.data.data) {
          const d = res.data.data;
          setAddress(
            `${d.addressLine1}${d.addressLine2 ? `, ${d.addressLine2}` : ""}, ${d.city}, ${d.state} ${d.postalCode}`,
          );
        }
      })
      .catch(() => setAddress("Address not found"));
  }, [addressId]);

  return <Text size="sm">{address}</Text>;
};

export const OrderPage = () => {
  const { classes } = useStyles();
  const user = useUser();
  const [orders, setOrders] = useState<OrdersGetDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<OrdersGetDto[]>>("/api/orders")
      .then((res) => {
        if (res.data.data) {
          setOrders(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box className={classes.orderRoot}>
      <Container size="md">
        <Stack gap="xl">
          <Title order={2} className={classes.pageTitle}>
            My Order History
          </Title>

          {loading && (
            <Center h={300}>
              <Stack align="center">
                <Loader color="brand.6" size="xl" variant="bars" />
                <Text size="sm" c="dimmed">
                  Loading your history...
                </Text>
              </Stack>
            </Center>
          )}

          {!loading && orders.length === 0 && (
            <Card withBorder p="xl" radius="md" className={classes.emptyCard}>
              <Stack align="center" gap="xs">
                <Text size="lg" fw={600}>
                  No orders yet
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  You haven't placed any orders. Once you check out, your items
                  will appear here!
                </Text>
              </Stack>
            </Card>
          )}

          {!loading && orders.length > 0 && (
            <Stack gap="md">
              {orders.map((order) => (
                <Card
                  key={order?.id}
                  withBorder
                  p="lg"
                  radius="md"
                  className={classes.orderCard}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text fw={700} size="lg">
                        Order #{order?.id}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Placed on:{" "}
                        {order?.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </Text>
                    </Stack>

                    <Badge
                      size="md"
                      variant="light"
                      color={order?.status === "Shipped" ? "green" : "blue"}
                    >
                      {order?.status || "Processing"}
                    </Badge>
                  </Group>

                  <Divider my="md" opacity={0.5} />

                  <Group justify="space-between">
                    <Box>
                      <Text size="xs" fw={500} c="dimmed" tt="uppercase">
                        Shipping Address
                      </Text>
                      <AddressDisplay addressId={order.shippingAddressId} />
                    </Box>
                    <Box style={{ textAlign: "right" }}>
                      <Text size="xs" fw={500} c="dimmed" tt="uppercase">
                        Customer
                      </Text>
                      <Text size="sm">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

const useStyles = createStyles((theme) => {
  return {
    orderRoot: {
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
      minHeight: "100vh", // Use minHeight instead of height to allow scrolling
      color: colors.background3,
      paddingTop: "30px",
      paddingBottom: "60px",
      paddingLeft: "60px",
      paddingRight: "60px",
    },

    pageTitle: {
      color: colors.background3,
      marginBottom: "40px",
      '[data-mantine-color-scheme="dark"] &': {
        color: "#D4E9CF",
      },
    },

    orderCard: {
      backgroundColor: "transparent",
      border: `1px solid ${colors.background4}`,
      borderRadius: 0,
      color: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        borderColor: "#373A40",
        color: "#C1C2C5",
        backgroundColor: "rgba(0,0,0,0.2)",
      },
    },

    emptyCard: {
      backgroundColor: "transparent",
      border: `1px dashed ${colors.background4}`,
      borderRadius: 0,
      textAlign: "center",
      padding: "40px",
    },
  };
});
