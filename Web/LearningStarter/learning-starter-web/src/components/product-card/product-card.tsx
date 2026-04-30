import { Card, Text } from "@mantine/core";

type ProductCardProps = {
  name: string;
  price: number;
  description?: string;
};

export const ProductCard = ({
  name,
  price,
  description,
}: ProductCardProps) => {
  return (
    <Card withBorder radius="md" p="md" h={320}>
      <Card.Section>
        <div
          style={{
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2B2B2B",
          }}
        >
          <Text c="dimmed" size="sm">
            Image coming soon
          </Text>
        </div>
      </Card.Section>

      <Text fw={600} mt="sm">
        {name}
      </Text>

      {description && (
        <Text c="dimmed" size="sm" mt="xs">
          {description}
        </Text>
      )}

      <Text fw={700} mt="md">
        ${price.toFixed(2)}
      </Text>
    </Card>
  );
};