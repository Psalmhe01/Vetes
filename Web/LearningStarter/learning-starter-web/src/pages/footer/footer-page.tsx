import {
  Container,
  Divider,
  Group,
  Space,
  Image,
  Text,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";

import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandTiktok } from "@tabler/icons-react";
import { colors, FOOTER_HEIGHT, FOOTER_HEIGHT_NUMBER } from "../../constants/theme-constants";

export const Footer = () => {
  const logo = "/logo.png";
  const { classes } = useStyles();

  return (
    <Container className={classes.footerPg} w="100vw">
      <Divider my="sm" w="vw"/>
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
          <Text>Privacy Policy</Text>
          <Text>Accessibility Statement</Text>
          <Text>Shipping Policy</Text>
          <Text>Terms and Conditions</Text>
          <Text>Return Policy</Text>
          <Space h="m" />
          <Text>© 2026 by Les V</Text>
        </Container>
      </Group>
      <Divider my="sm" />
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
      backgroundColor: colors.background3,
      
    },

    groups: {
      justifyContent: "flex-start",
      marginTop: "10px",
      marginBottom: "10px",
    },

    logo: {
          cursor: "pointer",
          marginRight: "5px",
          paddingTop: "5px",
          height: (FOOTER_HEIGHT_NUMBER/3),
        },

    fullHeight: {
      height: "100%",
    },
  };
});
