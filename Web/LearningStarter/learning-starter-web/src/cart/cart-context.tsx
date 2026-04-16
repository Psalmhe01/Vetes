import { createContext, useContext, useEffect, useState } from "react";
import {
  ApiError,
  ApiResponse,
  CartCreateDto,
  CartGetDto,
  CartProductGetDto,
} from "../constants/types";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/use-auth";
import api from "../config/axios";

type CartState = {
  cart: CartGetDto | null;
  setCart: (cart: CartGetDto | null) => void;
  loading: boolean;
  deleteCartProduct: (prodId: number) => Promise<void>;
  updateCartProduct: (
    id: number,
    quantity: number,
    productSizeId: number,
    cartId: number,
  ) => Promise<void>;
  createCart: () => Promise<void>;
};

const INITIAL_STATE: CartState = {
  cart: null,
  setCart: undefined as any,
  loading: true,
  deleteCartProduct: undefined as any,
  updateCartProduct: undefined as any,
  createCart: undefined as any,
};

export const CartContext = createContext<CartState>(INITIAL_STATE);

export const CartProvider = (props: any) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartGetDto | null>(INITIAL_STATE.cart);
  const [loading, setLoading] = useState(true);
  const { id }: { id: number } = useUser();

  useEffect(() => {
    fetchCart();

    async function fetchCart() {
      try {
        const response = await api.get<ApiResponse<CartGetDto>>(
          `/api/cart/${id}`,
        );
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching cart.", color: "red" });
          navigate("/home");
        }

        if (response.data.data == null) {
          await createCart();
        }

        if (response.data.data) {
          setCart(response.data.data);
        }
      } catch (error) {
        showNotification({ message: "Error fetching cart.", color: "red" });
        navigate("/home");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  async function deleteCartProduct(prodId: number) {
    try {
      const response = await api.delete<ApiResponse<CartGetDto>>(
        `/api/cartproducts/${prodId}`,
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error deleting cart item", color: "red" });
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.filter((p) => p.id !== prodId),
        };
      });

      showNotification({ message: "Item removed from cart", color: "green" });
    } catch (error) {
      showNotification({ message: "Error deleting cart item", color: "red" });
    }
  }

  async function updateCartProductImpl(
    id: number,
    quantity: number,
    productSizeId: number,
    cartId: number,
  ): Promise<void> {
    try {
      const response = await api.put<ApiResponse<CartProductGetDto>>(
        `/api/cartproducts/${id}`,
        { quantity, productSizeId, cartId },
      );

      if (response.data.hasErrors) {
        showNotification({
          message: "Error updating this cart item",
          color: "red",
        });
        return;
      }

      setCart((prev) => {
        if (!prev) return prev;
        const updatedProduct = response.data.data;
        return {
          ...prev,
          products: prev.products.map((p) =>
            p.id === id && updatedProduct ? updatedProduct : p,
          ),
        };
      });
    } catch (error) {
      showNotification({ message: "Error updating cart item", color: "red" });
    }
  }

  async function createCart() {
    const date = new Date();
    const updatedAt = date.toISOString();

    try {
      const response = await api.post<ApiResponse<CartCreateDto>>(`/api/cart`, {
        userId: id,
        updatedAt,
      });
      if (response.data.hasErrors) {
        showNotification({ message: "Error fetching cart.", color: "red" });
        navigate("/home");
      }

      if (response.data.data) {
        showNotification({ message: "Cart created", color: "green" });
      }
    } catch (error) {
      showNotification({ message: "Error creating cart.", color: "red" });
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        deleteCartProduct,
        updateCartProduct: updateCartProductImpl,
        createCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(`useCart must be used within a Cart provider`);
  }
  return context;
}
