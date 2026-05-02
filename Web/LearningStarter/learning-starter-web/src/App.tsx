import { Routes } from "./routes/config";
import { AuthProvider } from "./authentication/use-auth";
import { MantineProvider, Container, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Global } from "@emotion/react";
import { MantineEmotionProvider } from "@mantine/emotion";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { CartProvider } from "./cart/cart-context";
import { colors } from "./constants/theme-constants";

const theme = createTheme({
  black: colors.text,
  fontFamily: "Questrial, sans-serif",
  headings: {
    fontFamily: "Questrial",
  },
  colors: {
    // Mantine requires exactly 10 shades (0-9).
    // It is best to use a single base color and generate shades for it.
    brand: [
      "#f2fcf1", // 0
      "#e6f6e3", // 1
      "#c9ecc2", // 2
      "#abe1a0", // 3
      "#90d881", // 4
      "#7ed26d", // 5
      "#75cf62", // 6
      "#24582A", // 7 (Primary Brand Green)
      "#1c4a23", // 8
      "#132e16", // 9
    ],
    "button-hover": Array(10).fill(colors.buttonHoverText) as any,
  },
  primaryColor: "brand",
  defaultRadius: 0,
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <MantineEmotionProvider>
        <Notifications position="top-right" autoClose={3000} limit={5} />
        <Container fluid px={0} className="App">
          <AuthProvider>
            <CartProvider>
              <Routes />
            </CartProvider>
          </AuthProvider>
        </Container>
      </MantineEmotionProvider>
    </MantineProvider>
  );
}

export default App;
