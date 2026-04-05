import React, { useEffect, useState } from "react";
import { routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  Menu,
  Image,
  Container,
  Group,
  useMantineColorScheme,
  Button,
  Flex,
  Text,
  Avatar,
  Title,
  Overlay,
  Burger,
} from "@mantine/core";
import {
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_NUMBER,
} from "../../constants/theme-constants";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserDto } from "../../constants/types";
import { useAuth } from "../../authentication/use-auth";
import { createStyles } from "@mantine/emotion";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { SideCart } from "../../pages/side-cart-page/side-cart-page";
import { ClassNames } from "@emotion/react";

type PrimaryNavigationProps = {
  user?: UserDto;
};

type NavigationItem = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
} & (
  | {
      nav: Omit<
        NavLinkProps,
        keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
      >;
      children?: never;
    }
  | { nav?: never; children: NavigationItemForceNav[] }
);

export type NavigationItemForceNav = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
  nav: NavLinkProps;
};

const navigation: NavigationItem[] = [
  {
    text: "Home",
    hide: false,
    nav: {
      to: routes.home,
    },
  },
  {
    text: "User",
    hide: false,
    nav: {
      to: routes.user,
    },
  },
  {
    text: "Categories",
    hide: false,
    nav: {
      to: routes.categoryListing,
    },
  },
  {
    text: "Products",
    hide: false,
    nav: {
      to: routes.productListing,
    },
  },
];

const DesktopNavigation = () => {
  const { classes, cx } = useStyles();
  const { pathname } = useLocation();
  const [active, setActive] = useState(navigation[0].nav?.to.toString());

  useEffect(() => {
    setActive(pathname);
  }, [pathname, setActive]);

  return (
    <>
      <Container px={0} className={classes.desktopNav}>
        <Flex direction="row" align="center" className={classes.fullHeight}>
          {navigation
            .filter((x) => !x.hide)
            .map((x, i) => {
              if (x.children) {
                return (
                  <Menu trigger="hover" key={i}>
                    <Menu.Target>
                      <Button
                        size="md"
                        className={classes.paddedMenuItem}
                        variant="subtle"
                        key={i}
                      >
                        {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {x.children
                        .filter((x) => !x.hide)
                        .map((y) => {
                          return (
                            <Menu.Item
                              key={`${y.text}`}
                              to={y.nav.to}
                              component={NavLink}
                            >
                              <Flex direction="row">
                                <Text size="sm">
                                  {y.icon && <FontAwesomeIcon icon={y.icon} />}{" "}
                                  {y.text}
                                </Text>
                              </Flex>
                            </Menu.Item>
                          );
                        })}
                    </Menu.Dropdown>
                  </Menu>
                );
              }
              return (
                <Button
                  size="md"
                  component={NavLink}
                  to={x.nav.to}
                  className={cx(classes.paddedMenuItem, {
                    [classes.linkActive]: active === x.nav.to,
                  })}
                  variant="subtle"
                  key={i}
                >
                  {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                </Button>
              );
            })}
        </Flex>
      </Container>
    </>
  );
};

const BurgerNavigation = () => {
  const burgerItems = navigation.filter(
    (item): item is NavigationItem & { nav: NavLinkProps } =>
      !item.hide && item.nav !== undefined
  );
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <>
    {opened && <Overlay onClick={close} />}
    <Menu
      opened={opened}
      onChange={(o) => (o ? toggle() : close())}
      trigger="click"
      radius={0}
      position="bottom"
      offset={15}
      transitionProps={{ transition: 'fade-down', duration: 150 }}
      width="100vw"
    >
      <Menu.Target>
        <Burger opened={opened} onClick={toggle} />
      </Menu.Target>

      <Menu.Dropdown style={{ left: 0 }}>
        {burgerItems.map((x) => {
          return (
            <Menu.Item key={`${x.text}`} to={x.nav.to} component={NavLink} onClick={close}>
              <Text size="sm" ta="center">
                {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
              </Text>
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  </>);
};

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  user,
}) => {
  const { classes } = useStyles();
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [opened, { open, close }] = useDisclosure(false);
  const dark = colorScheme === "dark";
  return (
    <Title order={4}>
      <Container px={20} fluid>
        <Flex direction="row" justify="space-between" align="center">
          <Group>
            <Flex direction="row" align="center">
              <NavLink to={routes.root}>
                <Image
                  className={classes.logo}
                  w={60}
                  h={60}
                  radius="sm"
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                  src={logo}
                  alt="logo"
                />
              </NavLink>
              {user && !isMobile && <DesktopNavigation />}
            </Flex>
          </Group>
          <Group>
            {user && (
              <Menu>
                {isMobile && <BurgerNavigation />}
                <SideCart />
                <Menu.Target>
                  <Avatar className={classes.pointer}>
                    {user.firstName.substring(0, 1)}
                    {user.lastName.substring(0, 1)}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => toggleColorScheme()}>
                    {dark ? "Light mode" : "Dark mode"}
                  </Menu.Item>
                  <Menu.Item onClick={() => logout()}>Sign Out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Flex>
      </Container>
    </Title>
  );
};

const useStyles = createStyles((theme) => {
  return {
    pointer: {
      cursor: "pointer",
    },
    logo: {
      cursor: "pointer",
      marginRight: "5px",
      paddingTop: "5px",
      height: NAVBAR_HEIGHT,
    },
    paddedMenuItem: {
      margin: "0px 5px 0px 5px",
    },
    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.variantColorResolver({
          theme: theme,
          color: theme.primaryColor,
          variant: "light",
        }).background,
        color: theme.variantColorResolver({
          theme: theme,
          color: theme.primaryColor,
          variant: "light",
        }).color,
      },
    },
    desktopNav: {
      height: NAVBAR_HEIGHT,
    },
    fullHeight: {
      height: "100%",
    },
  };
});
