import {
  Container,
  Divider,
  Group,
  Space,
  Image,
  Text,
  Anchor,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandTiktok,
} from "@tabler/icons-react";
import {
  colors,
  FOOTER_HEIGHT,
  FOOTER_HEIGHT_NUMBER,
} from "../../constants/theme-constants";

export const Footer = () => {
  const logo = "/logo.png";
  const { classes } = useStyles();

  return (
    <Container fluid className={classes.footerPg} w="100vw" my={0}>
      <Group justify="space-between" className={classes.groups}>
        <Container className={classes.groups}>
          <Image className={classes.logo} fit="contain" src={logo} />
          <Space h="xl" />
          <Text>555-555-5555</Text>
          <Space h="m" />
          <Text>testmail@abc.com</Text>
          <Space h="m" />
          <Text>
            1600 Pennsylvania Ave NW, <br />
            Washington, DC 20500
          </Text>
          <Space h="xl" />
          <Group>
            <IconBrandFacebook />
            <IconBrandInstagram />
            <IconBrandTwitter />
            <IconBrandTiktok />
          </Group>
        </Container>
        <Container className={classes.groups}>
          <Anchor
            href="https://youtu.be/xMHJGd3wwZk?si=06ZXdddre_nVQ85w"
            target="_blank"
            className={classes.groups}
            underline="hover"
          >
            <Text>Privacy Policy</Text>
            <Text>Accessibility Statement</Text>
            <Text>Shipping Policy</Text>
            <Text>Terms and Conditions</Text>
            <Text>Return Policy</Text>
          </Anchor>
          <Space h="xl" />
          <Text>© 2026 by Les V</Text>
        </Container>
      </Group>
      <Space h="l" />
    </Container>
  );
};

const useStyles = createStyles((theme) => {
  return {
    pointer: {
      cursor: "pointer",
    },

    footerPg: {
      height: FOOTER_HEIGHT,
      maxWidth: "100%",
      objectFit: "contain",
      padding: 0,
      marginTop: 0,
      backgroundColor: colors.background3,
      '[data-mantine-color-scheme="dark"] &': {
        backgroundColor: "#0D1B2A",
        color: "#D4E9CF",
      },
      color: colors.background1,
    },

    groups: {
      justifyContent: "flex-start",
      
      marginBottom: "10px",
      color: colors.background1,
      '[data-mantine-color-scheme="dark"] &': {
        color: "#D4E9CF",
      },
    },

    logo: {
      cursor: "pointer",
      marginRight: "5px",
      paddingTop: "5px",
      height: FOOTER_HEIGHT_NUMBER / 3,
      alignSelf: "left",
    },

    fullHeight: {
      height: "100%",
    },
  };
});
