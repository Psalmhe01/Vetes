import { Container, Group, Text, Button } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(() => ({
  navbar: {
    width: "100%",
    height: 70,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eaeaea",
    backgroundColor: "#1B1B1B",
  },
  inner: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.navbar}>
      <Container className={classes.inner}>
        
        {/* Left: Logo / Brand */}
        <Group className={classes.section}>
          {/* Add icons/buttons here later */}
        </Group>

        {/* Center: Future nav links */}
        <Group className={classes.section}>
          <Button variant="subtle" onClick={() => navigate("/products")}>
            ALL
          </Button>

          <Button variant="subtle" onClick={() => navigate("/categories")}>
            Tops
          </Button>

          <Button variant="subtle" onClick={() => navigate("/categories")}>
            Bottoms
          </Button>

          <Button variant="subtle" onClick={() => navigate("/categories")}>
            Dresses
          </Button>

          <Button variant="subtle" onClick={() => navigate("/categories")}>
            Jackets & Coats
          </Button>

          <Button variant="subtle" onClick={() => navigate("/categories")}>
            Accessories
          </Button>
        </Group>

        {/* Right: Future actions (cart, profile, etc.) */}
        <Group className={classes.section}>
          {/* Add icons/buttons here later */}
        </Group>

      </Container>
    </div>
  );
};
