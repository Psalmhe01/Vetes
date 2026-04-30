import { createStyles } from "@mantine/emotion";
import { UserDto } from "../../constants/types";
import { PrimaryNavigation } from "../navigation/navigation";
import { Container } from "@mantine/core";
import { Footer } from "../../pages/footer/footer-page";
import { colors, NAVBAR_HEIGHT, NAVBAR_HEIGHT_NUMBER } from "../../constants/theme-constants";

type PageWrapperProps = {
  user?: UserDto;
  children?: React.ReactNode;
};

//This is the wrapper that surrounds every page in the app.  Changes made here will be reflect all over.
export const PageWrapper: React.FC<PageWrapperProps> = ({ user, children }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.body}>
      <PrimaryNavigation user={user} />
      <Container px={0} fluid className={classes.mainContent}>
        {children}
      </Container>
      {user && <Footer />}
    </div>
  );
};

const useStyles = createStyles((theme) => {
  return {
    body: {
      backgroundColor: theme.colors.brand[0],
    },

    mainContent: {
      minHeight: "calc(100vh - 80px)",
      marginTop: "80px",
      padding: 0,
    },
  };
});
