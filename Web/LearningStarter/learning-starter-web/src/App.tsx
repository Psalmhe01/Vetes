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
  fontFamily: "Questrial, sans-serif",
  headings: {
    fontFamily: "Questrial",
  },
  colors: {
    brand: [
      colors.background1,
      colors.background2,
      colors.background3,
      colors.lineDivider,
      colors.text,
      colors.text2,
      colors.button,
      colors.buttonText,
      colors.buttonHover,
      colors.buttonHoverText,
      colors.button2,
      colors.button2Text,
      colors.button2Hover,
      colors.button2HoverText,
      colors.background4,
    ],
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
