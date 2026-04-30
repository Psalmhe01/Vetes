import { ClassNames } from "@emotion/react";
import { Card, Text, useMantineTheme } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

type ProductCardProps = {
  name: string;
  price: number;
  description?: string;
  onClick?: () => void | Promise<void>;
};

export const ProductCard = ({
  name,
  price,
  description,
  onClick,
}: ProductCardProps) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  return (
    <Card
      radius="md"
      p="md"
      h={320}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className={classes.card}
    >
      <Card.Section>
        <div
          style={{
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${theme.colors.brand[1]}`,
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

const useStyles = createStyles((theme) => {
  return {
    card: {
      color: theme.colors.brand[4],
      background: "none",
      borderRadius: 0,
      border: `solid 1px ${theme.colors.brand[2]}}`,
      cursor: "pointer",
      fontWeight: "lighter",
    },
  };
});
