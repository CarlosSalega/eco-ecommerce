export interface CartItem {
  productId: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = "belleza-cart";

export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0 };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [], total: 0 };

    const parsed = JSON.parse(stored);
    // Si es un array (formato viejo), migrar a objeto
    if (Array.isArray(parsed)) {
      const items = parsed as CartItem[];
      const total = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0,
      );
      // Migrar a objeto y actualizar storage
      const cart = { items, total };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return cart;
    } else if (parsed && Array.isArray(parsed.items)) {
      // Formato correcto
      const items = parsed.items as CartItem[];
      const total = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0,
      );
      return { items, total };
    } else {
      // Formato inválido
      return { items: [], total: 0 };
    }
  } catch (error) {
    console.error("Failed to get cart:", error);
    return { items: [], total: 0 };
  }
}

export function addToCart(
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  },
  quantity = 1,
) {
  const cart = getCart();
  const existingItem = cart.items.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: product.id,
      quantity,
      title: product.title,
      price: product.price,
      image: product.image,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartItem(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.items.find((item) => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string) {
  return updateCartItem(productId, 0);
}

export function clearCart() {
  saveCart({ items: [], total: 0 });
}

function saveCart(cart: Cart) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}

export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}
