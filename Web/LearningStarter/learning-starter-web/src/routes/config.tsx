import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { RegisterPage } from "../pages/register-page/register-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { CategoryListing } from "../pages/category-page/category-listing";
import { CategoryDetail } from "../pages/category-page/category-detail";
import { ProductListing } from "../pages/product-page/product-listing";
import { ProductDetail } from "../pages/product-page/product-detail";
import { Container } from "@mantine/core";
import { Footer } from "../pages/footer/footer-page";
import { CartPage } from "../pages/cart-page/cart-page";
import { CheckoutPage } from "../pages/checkout-page/checkout-page";


import { UpdateUserPage } from "../pages/user-page/update-user";

//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /user render UserPage */}
          <Route path={routes.user} element={<UserPage />} />
          <Route path={routes.updateUser} element={<UpdateUserPage />} />
          <Route path={routes.categoryListing} element={<CategoryListing />} />
          <Route path={routes.categoryDetail} element={<CategoryDetail />} />
          <Route path={routes.productListing} element={<ProductListing />} />
          <Route path={routes.productDetail} element={<ProductDetail />} />
          <Route path = {routes.cartPage} element={<CartPage />} />
          <Route path={routes.checkoutPage} element={<CheckoutPage />} />

          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />

          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
        
      </PageWrapper>
    </>
  );
};
