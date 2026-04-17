import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import {
  initialProducts,
  initialReservations,
  initialSellerProducts,
  initialSellers,
} from "../data/mockData.ts";
import {
  AuthUser,
  AdminAccount,
  Product,
  Reservation,
  Seller,
  SellerProduct,
  ToastMessage,
} from "../types.ts";

interface RegisterPayload {
  name: string;
  email: string;
  businessName: string;
  password: string;
}

interface AdminRegisterPayload {
  name: string;
  email: string;
  role: string;
}

interface LoginResult {
  ok: boolean;
  message: string;
}

interface ReservationResult {
  ok: boolean;
  message: string;
}

interface AppContextValue {
  currentUser: AuthUser | null;
  products: Product[];
  sellerProducts: SellerProduct[];
  sellers: Seller[];
  adminAccounts: AdminAccount[];
  reservations: Reservation[];
  commissionPercent: number;
  toasts: ToastMessage[];
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  registerSeller: (payload: RegisterPayload) => void;
  registerAdmin: (payload: AdminRegisterPayload) => void;
  deleteAdminAccount: (adminId: string) => void;
  approveSeller: (sellerId: string) => void;
  rejectSeller: (sellerId: string) => void;
  addProduct: (payload: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (payload: Product) => void;
  deleteProduct: (productId: string) => void;
  addSellerProduct: (
    payload: Omit<SellerProduct, "id" | "createdAt" | "sellerId">,
  ) => void;
  updateSellerProduct: (payload: SellerProduct) => void;
  deleteSellerProduct: (productId: string) => void;
  reserveProduct: (productId: string, quantity: number) => ReservationResult;
  confirmReservationDelivery: (reservationId: string) => void;
  removeReservation: (reservationId: string) => void;
  setCommissionPercent: (value: number) => void;
  dismissToast: (toastId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const adminEmail = "admin@test.com";
const adminPassword = "123456";
const staffEmail = "staff@test.com";
const staffPassword = "123456";
const defaultProductImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
const initialAdmins: AdminAccount[] = [
  {
    id: "a1",
    name: "Platform Admin",
    email: "admin@test.com",
    role: "Super Admin",
    joinedAt: "2026-01-01",
  },
  {
    id: "a2",
    name: "Operations Lead",
    email: "ops@dipcomtechnologies.com",
    role: "Operations Admin",
    joinedAt: "2026-01-18",
  },
];

const makeId = () => crypto.randomUUID();

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>(
    initialSellerProducts,
  );
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [adminAccounts, setAdminAccounts] =
    useState<AdminAccount[]>(initialAdmins);
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [commissionPercent, setCommissionPercentState] = useState(10);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (
    title: string,
    description: string,
    type: ToastMessage["type"],
  ) => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const dismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  const login = (email: string, password: string): LoginResult => {
    if (email === adminEmail && password === adminPassword) {
      setCurrentUser({
        role: "admin",
        id: "admin",
        name: "Platform Admin",
        email,
      });
      pushToast("Welcome back", "Admin session started.", "success");
      return { ok: true, message: "Admin login successful." };
    }

    if (email === staffEmail && password === staffPassword) {
      setCurrentUser({
        role: "staff",
        id: "staff",
        name: "Reservations Staff",
        email,
      });
      pushToast(
        "Welcome back",
        "Staff session started with limited access.",
        "success",
      );
      return { ok: true, message: "Staff login successful." };
    }

    const seller = sellers.find(
      (entry) => entry.email === email && entry.password === password,
    );
    if (!seller) {
      return {
        ok: false,
        message: "Invalid credentials. Try the demo accounts.",
      };
    }

    if (seller.status !== "approved") {
      return {
        ok: false,
        message: `Your account is ${seller.status}. Please wait for admin approval.`,
      };
    }

    setCurrentUser({
      role: "seller",
      id: seller.id,
      name: seller.name,
      email: seller.email,
    });
    pushToast(
      "Welcome back",
      `Seller dashboard ready for ${seller.businessName}.`,
      "success",
    );
    return { ok: true, message: "Seller login successful." };
  };

  const logout = () => {
    setCurrentUser(null);
    pushToast("Signed out", "Session closed securely.", "info");
  };

  const registerSeller = ({
    name,
    email,
    businessName,
    password,
  }: RegisterPayload) => {
    setSellers((prev) => [
      {
        id: makeId(),
        name,
        email,
        businessName,
        password,
        status: "pending",
        joinedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    pushToast(
      "Application received",
      "Your seller account is pending approval.",
      "info",
    );
  };

  const registerAdmin = ({ name, email, role }: AdminRegisterPayload) => {
    setAdminAccounts((prev) => [
      {
        id: makeId(),
        name,
        email,
        role,
        joinedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    pushToast(
      "Admin registered",
      `${name} was added as a new admin account.`,
      "success",
    );
  };

  const deleteAdminAccount = (adminId: string) => {
    const target = adminAccounts.find((admin) => admin.id === adminId);
    if (!target) {
      return;
    }

    if (adminAccounts.length <= 1) {
      pushToast(
        "Action blocked",
        "At least one admin account must remain on the platform.",
        "warning",
      );
      return;
    }

    setAdminAccounts((prev) => prev.filter((admin) => admin.id !== adminId));
    pushToast(
      "Admin removed",
      `${target.name} was removed from admin accounts.`,
      "warning",
    );
  };

  const approveSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((seller) =>
        seller.id === sellerId ? { ...seller, status: "approved" } : seller,
      ),
    );
    pushToast("Seller approved", "The seller can now log in.", "success");
  };

  const rejectSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((seller) =>
        seller.id === sellerId ? { ...seller, status: "rejected" } : seller,
      ),
    );
    pushToast(
      "Seller rejected",
      "The seller application was declined.",
      "warning",
    );
  };

  const addProduct = (payload: Omit<Product, "id" | "createdAt">) => {
    setProducts((prev) => [
      {
        ...payload,
        imageUrl: payload.imageUrl ?? defaultProductImage,
        id: makeId(),
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    pushToast(
      "Product added",
      `${payload.name} is now in inventory.`,
      "success",
    );
  };

  const updateProduct = (payload: Product) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === payload.id ? payload : product)),
    );
    pushToast(
      "Product updated",
      `${payload.name} details were saved.`,
      "success",
    );
  };

  const deleteProduct = (productId: string) => {
    const item = products.find((product) => product.id === productId);
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    if (item) {
      pushToast(
        "Product removed",
        `${item.name} was deleted from inventory.`,
        "warning",
      );
    }
  };

  const addSellerProduct = (
    payload: Omit<SellerProduct, "id" | "createdAt" | "sellerId">,
  ) => {
    if (!currentUser || currentUser.role !== "seller") {
      return;
    }

    setSellerProducts((prev) => [
      {
        ...payload,
        imageUrl: payload.imageUrl ?? defaultProductImage,
        id: makeId(),
        sellerId: currentUser.id,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

    pushToast(
      "My stock updated",
      `${payload.name} was added to your stock list.`,
      "success",
    );
  };

  const updateSellerProduct = (payload: SellerProduct) => {
    if (!currentUser || currentUser.role !== "seller") {
      return;
    }

    setSellerProducts((prev) =>
      prev.map((product) => {
        if (product.id !== payload.id || product.sellerId !== currentUser.id) {
          return product;
        }

        return payload;
      }),
    );

    pushToast(
      "My stock updated",
      `${payload.name} details were saved.`,
      "success",
    );
  };

  const deleteSellerProduct = (productId: string) => {
    if (!currentUser || currentUser.role !== "seller") {
      return;
    }

    const target = sellerProducts.find(
      (product) =>
        product.id === productId && product.sellerId === currentUser.id,
    );

    if (!target) {
      return;
    }

    setSellerProducts((prev) =>
      prev.filter(
        (product) =>
          !(product.id === productId && product.sellerId === currentUser.id),
      ),
    );

    pushToast(
      "My stock updated",
      `${target.name} was removed from your stock list.`,
      "warning",
    );
  };

  const reserveProduct = (
    productId: string,
    quantity: number,
  ): ReservationResult => {
    if (!currentUser || currentUser.role !== "seller") {
      return {
        ok: false,
        message: "Only authenticated sellers can reserve products.",
      };
    }

    const selected = products.find((product) => product.id === productId);
    if (!selected) {
      return { ok: false, message: "Product not found." };
    }

    if (quantity < 1) {
      return { ok: false, message: "Quantity must be at least 1." };
    }

    if (selected.stock < quantity) {
      return { ok: false, message: "Insufficient stock for this reservation." };
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: product.stock - quantity,
            }
          : product,
      ),
    );

    const baseTotal = selected.price * quantity;
    const finalTotal = baseTotal * (1 - commissionPercent / 100);

    setReservations((prev) => [
      {
        id: makeId(),
        productId,
        productName: selected.name,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        quantity,
        baseTotal,
        finalTotal,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    pushToast(
      "Reservation successful",
      `${selected.name} reserved successfully.`,
      "success",
    );

    if (selected.stock - quantity <= 3) {
      pushToast(
        "Low stock warning",
        `${selected.name} is reaching low stock levels.`,
        "warning",
      );
    }

    return { ok: true, message: "Reservation completed." };
  };

  const confirmReservationDelivery = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "delivered",
              deliveredAt: new Date().toISOString(),
            }
          : reservation,
      ),
    );
    pushToast(
      "Delivery confirmed",
      "The reservation was moved to history.",
      "success",
    );
  };

  const removeReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "removed",
              removedAt: new Date().toISOString(),
            }
          : reservation,
      ),
    );
    pushToast(
      "Reservation removed",
      "The reservation was archived from the active queue.",
      "warning",
    );
  };

  const setCommissionPercent = (value: number) => {
    setCommissionPercentState(value);
    pushToast("Discount updated", `Discount is now ${value}%.`, "info");
  };

  const value = useMemo(
    () => ({
      currentUser,
      products,
      sellerProducts,
      sellers,
      adminAccounts,
      reservations,
      commissionPercent,
      toasts,
      login,
      logout,
      registerSeller,
      registerAdmin,
      deleteAdminAccount,
      approveSeller,
      rejectSeller,
      addProduct,
      updateProduct,
      deleteProduct,
      addSellerProduct,
      updateSellerProduct,
      deleteSellerProduct,
      reserveProduct,
      confirmReservationDelivery,
      removeReservation,
      setCommissionPercent,
      dismissToast,
    }),
    [
      currentUser,
      products,
      sellerProducts,
      sellers,
      adminAccounts,
      reservations,
      commissionPercent,
      toasts,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }

  return context;
}
