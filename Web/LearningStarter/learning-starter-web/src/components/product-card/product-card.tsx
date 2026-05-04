import { Card, Text, Image } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { colors } from "../../constants/theme-constants";

type ProductCardProps = {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  onClick?: () => void | Promise<void>;
};

export const ProductCard = ({
  name,
  price,
  description,
  imageUrl,
  onClick,
}: ProductCardProps) => {
  const { classes } = useStyles();

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
            backgroundColor: colors.background2,
            overflow: "hidden"
          }}
        >
        <Image
          src = {imageUrl || "https://placehold.co/400x400?text=No+Image"}
          alt = {name}
          height = {180}
          fit = "contain"
        />
        
        </div>
      </Card.Section>

      <Text fw={600} mt="sm">
        {name}
      </Text>

      {description && (
        <Text c="dimmed" size="sm" mt="xs" lineClamp={3} truncate="end">
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
      color: colors.text,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#2C2E33",
        borderColor: "#373A40",
        color: "#C1C2C5",
      },
      background: "none",
      borderRadius: 0,
      border: `solid 1px ${colors.background3}`,
      cursor: "pointer",
      fontWeight: "lighter",
    },
  };
});
