import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  initialProducts,
  initialReservations,
  initialSellerProducts,
  initialSellers,
} from "../data/mockData.ts";
import type {
  AdminAccount,
  AuthUser,
  Category,
  Product,
  ProductUpsertPayload,
  Reservation,
  Seller,
  SellerProduct,
  SellerProductUpsertPayload,
  SiteSettings,
  ToastMessage,
} from "../types.ts";
import {
  apiRequest,
  AUTH_EXPIRED_EVENT,
  clearStoredTokens,
  storeTokens,
} from "../utils/api.ts";

interface RegisterPayload {
  name: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  password: string;
}

interface AdminRegisterPayload {
  name: string;
  email: string;
  roleType: "admin" | "staff";
  password: string;
}

interface CategoryPayload {
  name: string;
}

interface LoginResult {
  ok: boolean;
  message: string;
  role?: AuthUser["role"];
  sellerStatus?: "approved" | "pending" | "rejected";
}

interface ReservationResult {
  ok: boolean;
  message: string;
}

interface AppContextValue {
  currentUser: AuthUser | null;
  categories: Category[];
  products: Product[];
  sellerProducts: SellerProduct[];
  sellers: Seller[];
  adminAccounts: AdminAccount[];
  reservations: Reservation[];
  notifications: ApiNotification[];
  commissionPercent: number;
  siteSettings: SiteSettings;
  toasts: ToastMessage[];
  unreadNotificationCount: number;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  registerSeller: (payload: RegisterPayload) => Promise<LoginResult>;
  registerAdmin: (payload: AdminRegisterPayload) => Promise<void>;
  deleteAdminAccount: (adminId: string) => Promise<void>;
  approveSeller: (sellerId: string) => Promise<void>;
  rejectSeller: (sellerId: string) => Promise<void>;
  addCategory: (payload: CategoryPayload) => Promise<void>;
  addProduct: (payload: ProductUpsertPayload) => Promise<void>;
  updateProduct: (
    productId: string,
    payload: ProductUpsertPayload,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addSellerProduct: (payload: SellerProductUpsertPayload) => Promise<void>;
  updateSellerProduct: (
    productId: string,
    payload: SellerProductUpsertPayload,
  ) => Promise<void>;
  deleteSellerProduct: (productId: string) => Promise<void>;
  reserveProduct: (
    productId: string,
    quantity: number,
  ) => Promise<ReservationResult>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  approveReservation: (reservationId: string) => Promise<void>;
  rejectReservation: (reservationId: string) => Promise<void>;
  confirmReservationDelivery: (reservationId: string) => Promise<void>;
  enableBrowserNotifications: () => Promise<void>;
  setCommissionPercent: (value: number) => Promise<void>;
  dismissToast: (toastId: string) => void;
}

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "staff";
  sellerStatus?: "approved" | "pending" | "rejected";
};

type ApiCategory = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiSeller = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phoneNumber?: string;
  sellerStatus?: "approved" | "pending" | "rejected";
  status?: "approved" | "pending" | "rejected";
  joinedAt?: string;
};

type ApiAdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt?: string;
};

type ApiProduct = {
  id: string;
  name: string;
  price: string | number;
  stock: number;
  brand: string;
  category: string;
  categoryId: string;
  imageUrl?: string;
  createdAt: string;
};

type ApiSellerProduct = {
  id: string;
  sellerId?: string;
  name: string;
  price: string | number;
  stock: number;
  brand: string;
  category: string;
  categoryId: string;
  imageUrl?: string;
  createdAt: string;
};

type ApiReservation = {
  id: string;
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  baseTotal: string | number;
  finalTotal: string | number;
  discountPercent?: string | number;
  status: "reserve" | "pending" | "approved" | "rejected" | "delivered";
  createdAt: string;
  deliveredAt?: string;
  rejectedAt?: string;
};

type ApiNotification = {
  id: string;
  title: string;
  message: string;
  kind: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
};

const defaultSiteSettings: SiteSettings = {
  id: 1,
  commissionPercent: 10,
  contactPhone: "+1 (555) 900-1001",
  contactAddress:
    "Next to CBE Temenja Yaj branch, Kirkos sub city woreda 11, Addis Ababa — a convenient landmark near central commercial areas, with easy street access and visitor parking.",
  businessHours:
    "Monday - Saturday, 8:30 AM - 6:00 PM (closed on Sundays). Our support desk is available during these hours for sales inquiries, technical assistance, and reseller coordination.",
  tiktokUrl: "https://www.tiktok.com/@dipcomtechnologies",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.728265867298!2d38.75657401086354!3d8.99713269102569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8584482eab63%3A0x2c55bad0b8eff98a!2sDipcom%20Technology%20Solutions!5e0!3m2!1sen!2set!4v1775917748282!5m2!1sen!2set",
  heroTagline: "Comprehensive Stock Management & Reseller Platform",
  heroTitle: "Comprehensive Stock Management and Reseller Platform.",
  heroDescription:
    "Our platform brings together import operations, device repair services, and hands-on team training into a single coherent experience. It helps operations teams manage incoming shipments, track stock levels in real time, coordinate with reseller partners, and automate reservation workflows so customers receive accurate availability and timely delivery. Built with scalability and reliability in mind, the platform supports role-based access for admins, staff, and sellers, making it easy to run both retail and B2B reseller programs.",
  aboutTitle:
    "Eighteen Years of Trusted Printer Import, Repair, and Training Expertise",
  aboutDescription:
    "For nearly two decades, DIPCOM Technologies has specialized in importing high-quality printing hardware, providing expert repair services, and delivering practical training programs to technical teams and business users. Our engineers and trainers combine hands-on field experience with industry best practices to ensure reliable equipment performance, predictable maintenance schedules, and improved uptime. We focus on practical outcomes — reducing repair turnaround times, extending device lifecycles, and empowering reseller partners with sales and technical training that drives customer satisfaction and repeat business.",
  yearsExperience: 18,
  studentsTrained: 200,
  updatedAt: undefined,
};

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

const AppContext = createContext<AppContextValue | undefined>(undefined);
const defaultProductImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
const notificationDeviceStorageKey = "stock-notification-device-key";
const notificationSeenStorageKey = "stock-notification-seen-ids";
const notificationPromptStorageKey = "stock-notification-prompted";
const makeId = () => crypto.randomUUID();

function toNumber(value: string | number | undefined) {
  return Number(value ?? 0);
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function mapProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    price: toNumber(product.price),
    stock: product.stock,
    brand: product.brand,
    category: product.category,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl || defaultProductImage,
    createdAt: product.createdAt,
  };
}

function mapSellerProduct(product: ApiSellerProduct): SellerProduct {
  return {
    id: product.id,
    sellerId: product.sellerId ?? "",
    name: product.name,
    price: toNumber(product.price),
    stock: product.stock,
    brand: product.brand,
    category: product.category,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl || defaultProductImage,
    createdAt: product.createdAt,
  };
}

function mapSeller(seller: ApiSeller): Seller {
  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    businessName: seller.businessName,
    phoneNumber: seller.phoneNumber || "+251900000000",
    status: seller.sellerStatus ?? seller.status ?? "pending",
    joinedAt:
      seller.joinedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

function mapAdminAccount(admin: ApiAdminAccount): AdminAccount {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    joinedAt:
      admin.joinedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

function mapReservation(reservation: ApiReservation): Reservation {
  const normalizedStatus =
    reservation.status === "reserve" ? "pending" : reservation.status;

  return {
    id: reservation.id,
    productId: reservation.productId,
    productName: reservation.productName,
    sellerId: reservation.sellerId,
    sellerName: reservation.sellerName,
    quantity: reservation.quantity,
    baseTotal: toNumber(reservation.baseTotal),
    finalTotal: toNumber(reservation.finalTotal),
    discountPercent:
      reservation.discountPercent != null
        ? toNumber(reservation.discountPercent)
        : undefined,
    status: normalizedStatus,
    createdAt: reservation.createdAt,
    deliveredAt: reservation.deliveredAt,
    rejectedAt: reservation.rejectedAt,
  };
}

function supportsBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

function getOrCreateNotificationDeviceKey() {
  if (typeof window === "undefined") {
    return "server-device";
  }

  const existingKey = window.localStorage.getItem(notificationDeviceStorageKey);
  if (existingKey) {
    return existingKey;
  }

  const generatedKey = crypto.randomUUID();
  window.localStorage.setItem(notificationDeviceStorageKey, generatedKey);
  return generatedKey;
}

function getSeenNotificationIds() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(notificationSeenStorageKey);
    if (!raw) {
      return [] as string[];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [] as string[];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [] as string[];
  }
}

function saveSeenNotificationIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(notificationSeenStorageKey, JSON.stringify(ids));
}

function hasPromptedForNotifications() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.localStorage.getItem(notificationPromptStorageKey) === "true";
}

function markNotificationsPrompted() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(notificationPromptStorageKey, "true");
}

function base64UrlToUint8Array(base64UrlString: string) {
  const paddingLength = (4 - (base64UrlString.length % 4)) % 4;
  const base64 = `${base64UrlString}${"=".repeat(paddingLength)}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function compressImageFile(file: File) {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return file;
  }

  const maxDimension = 1600;
  const quality = 0.8;

  try {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to load image file."));
      image.src = imageUrl;
    });

    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height),
    );
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(imageUrl);
      return file;
    }

    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(imageUrl);

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });

    if (!compressedBlob) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image";
    return new File([compressedBlob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

async function buildCatalogFormData(payload: ProductUpsertPayload) {
  const data = new FormData();
  data.append("name", payload.name);
  data.append("price", String(payload.price));
  data.append("stock", String(payload.stock));
  data.append("brand", payload.brand);
  data.append("categoryId", payload.categoryId);
  if (payload.imageFile) {
    data.append("imageFile", await compressImageFile(payload.imageFile));
  }
  return data;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>(
    initialSellerProducts,
  );
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [adminAccounts, setAdminAccounts] =
    useState<AdminAccount[]>(initialAdmins);
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [commissionPercent, setCommissionPercentState] = useState(
    defaultSiteSettings.commissionPercent,
  );
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(defaultSiteSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const notificationDeviceKeyRef = useRef(getOrCreateNotificationDeviceKey());
  const seenNotificationIdsRef = useRef<Set<string>>(
    new Set(getSeenNotificationIds()),
  );
  const pushSetupInProgressRef = useRef<Promise<void> | null>(null);

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

  const refreshPublicData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiRequest<ApiCategory[]>("/catalog/categories/"),
        apiRequest<ApiProduct[]>("/catalog/products/"),
      ]);

      setCategories(categoriesResponse.map(mapCategory));
      setProducts(productsResponse.map(mapProduct));

      // Intentionally do NOT fetch site settings from the backend.
      // We rely on the hard-coded `defaultSiteSettings` above so the UI
      // displays consistent, local content and does not depend on the
      // Django backend's settings API.
      setSiteSettings(defaultSiteSettings);
      setCommissionPercentState(defaultSiteSettings.commissionPercent);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshPrivateData = async (role?: AuthUser["role"] | null) => {
    if (!role) {
      return;
    }

    try {
      if (role === "admin" || role === "staff") {
        const [
          sellersResponse,
          adminsResponse,
          reservationsResponse,
          sellerProductsResponse,
        ] = await Promise.all([
          apiRequest<ApiSeller[]>("/accounts/sellers/"),
          apiRequest<ApiAdminAccount[]>("/accounts/admins/"),
          apiRequest<ApiReservation[]>("/reservations/reservations/"),
          apiRequest<ApiSellerProduct[]>("/catalog/seller-products/"),
        ]);

        setSellers(sellersResponse.map(mapSeller));
        setAdminAccounts(adminsResponse.map(mapAdminAccount));
        setReservations(reservationsResponse.map(mapReservation));
        setSellerProducts(sellerProductsResponse.map(mapSellerProduct));
        return;
      }

      const [reservationsResponse, sellerProductsResponse] = await Promise.all([
        apiRequest<ApiReservation[]>("/reservations/reservations/"),
        apiRequest<ApiSellerProduct[]>("/catalog/seller-products/"),
      ]);

      setReservations(reservationsResponse.map(mapReservation));
      setSellerProducts(sellerProductsResponse.map(mapSellerProduct));
    } catch (error) {
      console.error(error);
    }
  };

  const refreshForCurrentUser = async (role?: AuthUser["role"] | null) => {
    await refreshPublicData();
    await refreshPrivateData(role ?? currentUser?.role);
  };

  const registerNotificationDevice = async (
    subscription?: Record<string, unknown>,
  ) => {
    if (!currentUser || typeof window === "undefined") {
      return;
    }

    try {
      await apiRequest(
        "/notifications/devices/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceKey: notificationDeviceKeyRef.current,
            label: `${navigator.platform || "Browser"} device`,
            platform: navigator.platform || navigator.userAgent,
            userAgent: navigator.userAgent,
            subscription: subscription ?? undefined,
          }),
        },
        false,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const registerBrowserPushSubscription = async (
    promptForPermission: boolean,
  ) => {
    if (
      !currentUser ||
      typeof window === "undefined" ||
      !supportsBrowserNotifications() ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    if (Notification.permission === "default") {
      if (!promptForPermission || hasPromptedForNotifications()) {
        return;
      }

      markNotificationsPrompted();
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        pushToast(
          "Notifications disabled",
          "Enable browser notifications to receive alerts.",
          "warning",
        );
        return;
      }
    }

    if (Notification.permission === "denied") {
      pushToast(
        "Notifications blocked",
        "Allow notifications in your browser settings to receive alerts.",
        "warning",
      );
      return;
    }

    if (pushSetupInProgressRef.current) {
      try {
        await pushSetupInProgressRef.current;
      } catch (error) {
        console.error(error);
      }
      return;
    }

    pushSetupInProgressRef.current = (async () => {
      const registration = await navigator.serviceWorker.register(
        "/notification-sw.js",
      );
      const { publicKey } = await apiRequest<{ publicKey: string }>(
        "/notifications/push-key/",
      );
      const existingSubscription =
        await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(publicKey),
        }));

      await registerNotificationDevice(
        subscription.toJSON() as Record<string, unknown>,
      );
    })();

    try {
      await pushSetupInProgressRef.current;
      await refreshNotifications();
    } catch (error) {
      console.error(error);
      pushToast(
        "Notifications unavailable",
        "The browser push subscription could not be created.",
        "warning",
      );
    } finally {
      pushSetupInProgressRef.current = null;
    }
  };

  const displayIncomingNotification = (notification: ApiNotification) => {
    if (
      supportsBrowserNotifications() &&
      Notification.permission === "granted"
    ) {
      new Notification(notification.title, {
        body: notification.message,
      });
      return;
    }

    pushToast(notification.title, notification.message, "info");
  };

  const refreshNotifications = async () => {
    if (!currentUser) {
      setUnreadNotificationCount(0);
      setNotifications([]);
      return;
    }

    try {
      const [allNotificationsResponse, notificationsResponse] =
        await Promise.all([
          apiRequest<ApiNotification[]>("/notifications/list/"),
          apiRequest<ApiNotification[]>("/notifications/inbox/"),
        ]);

      setNotifications(allNotificationsResponse);
      setUnreadNotificationCount(notificationsResponse.length);

      if (notificationsResponse.length === 0) {
        return;
      }

      const unseenNotifications = notificationsResponse.filter(
        (notification) => !seenNotificationIdsRef.current.has(notification.id),
      );

      unseenNotifications.forEach((notification) => {
        seenNotificationIdsRef.current.add(notification.id);
        displayIncomingNotification(notification);
      });

      saveSeenNotificationIds([...seenNotificationIdsRef.current]);
    } catch (error) {
      console.error(error);
    }
  };

  const enableBrowserNotifications = async () => {
    if (!supportsBrowserNotifications()) {
      pushToast(
        "Notifications unavailable",
        "This browser does not support browser notifications.",
        "warning",
      );
      return;
    }

    try {
      await registerBrowserPushSubscription(true);
      if (Notification.permission === "granted") {
        pushToast(
          "Notifications enabled",
          "You will receive browser alerts for key updates.",
          "success",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to enable notifications.";
      pushToast("Action failed", message, "warning");
    }
  };

  useEffect(() => {
    const hydrate = async () => {
      await refreshPublicData();
    };

    void hydrate();

    return () => {};
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearStoredTokens();
      setCurrentUser(null);
      setSellers([]);
      setAdminAccounts([]);
      setReservations([]);
      setSellerProducts([]);
      setNotifications([]);
      setUnreadNotificationCount(0);
      pushToast("Session expired", "Please sign in again.", "warning");
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUnreadNotificationCount(0);
      return;
    }

    let cancelled = false;

    const syncNotifications = async () => {
      if (cancelled) {
        return;
      }

      const shouldPromptForNotifications =
        supportsBrowserNotifications() &&
        Notification.permission === "default" &&
        !hasPromptedForNotifications();

      if (shouldPromptForNotifications) {
        await enableBrowserNotifications();
      } else {
        await registerBrowserPushSubscription(false);
      }

      await refreshNotifications();
    };

    void syncNotifications();

    const intervalId = window.setInterval(() => {
      void refreshNotifications();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [currentUser?.id]);

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResult> => {
    try {
      const response = await apiRequest<{
        refresh: string;
        access: string;
        user: ApiUser;
      }>(
        "/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
        false,
      );

      storeTokens(response.access, response.refresh);
      const user: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        sellerStatus: response.user.sellerStatus,
      };

      setCurrentUser(user);
      await refreshForCurrentUser(user.role);
      pushToast("Welcome back", `${user.role} session started.`, "success");

      return {
        ok: true,
        message: `${user.role} login successful.`,
        role: user.role,
        sellerStatus: user.sellerStatus,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      return { ok: false, message };
    }
  };

  const logout = () => {
    clearStoredTokens();
    setCurrentUser(null);
    setSellers([]);
    setAdminAccounts([]);
    setReservations([]);
    setSellerProducts([]);
    setNotifications([]);
    setUnreadNotificationCount(0);
    pushToast("Signed out", "Session closed securely.", "info");
  };

  const registerSeller = async ({
    name,
    email,
    businessName,
    phoneNumber,
    password,
  }: RegisterPayload): Promise<LoginResult> => {
    try {
      await apiRequest(
        "/accounts/register/seller/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            businessName,
            phoneNumber,
            password,
          }),
        },
        false,
      );

      await refreshPublicData();
      pushToast(
        "Application received",
        "Your seller account is pending approval.",
        "info",
      );
      return { ok: true, message: "Seller registration submitted." };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed.";
      return { ok: false, message };
    }
  };

  const registerAdmin = async ({
    name,
    email,
    roleType,
    password,
  }: AdminRegisterPayload) => {
    try {
      await apiRequest("/accounts/admins/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, roleType, password }),
      });
      await refreshPrivateData(currentUser?.role);
      pushToast(
        "Admin registered",
        `${name} can now log in to the platform.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to register admin.";
      pushToast("Action failed", message, "warning");
    }
  };

  const deleteAdminAccount = async (adminId: string) => {
    try {
      await apiRequest(`/accounts/admins/${adminId}/`, { method: "DELETE" });
      await refreshPrivateData(currentUser?.role);
      pushToast("Admin removed", "The admin account was deleted.", "warning");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to remove admin.";
      pushToast("Action failed", message, "warning");
    }
  };

  const approveSeller = async (sellerId: string) => {
    try {
      await apiRequest(`/accounts/sellers/${sellerId}/approve/`, {
        method: "POST",
      });
      await refreshPrivateData(currentUser?.role);
      pushToast("Seller approved", "The seller can now log in.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to approve seller.";
      pushToast("Action failed", message, "warning");
    }
  };

  const rejectSeller = async (sellerId: string) => {
    try {
      await apiRequest(`/accounts/sellers/${sellerId}/reject/`, {
        method: "POST",
      });
      await refreshPrivateData(currentUser?.role);
      pushToast(
        "Seller rejected",
        "The seller application was declined.",
        "warning",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reject seller.";
      pushToast("Action failed", message, "warning");
    }
  };

  const addCategory = async ({ name }: CategoryPayload) => {
    try {
      await apiRequest("/catalog/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      await refreshPublicData();
      pushToast(
        "Category added",
        `${name} is now available in the catalog.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add category.";
      pushToast("Action failed", message, "warning");
    }
  };

  const addProduct = async (payload: ProductUpsertPayload) => {
    try {
      await apiRequest("/catalog/products/", {
        method: "POST",
        body: await buildCatalogFormData(payload),
      });
      await refreshForCurrentUser();
      pushToast(
        "Product added",
        `${payload.name} is now in inventory.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const updateProduct = async (
    productId: string,
    payload: ProductUpsertPayload,
  ) => {
    try {
      await apiRequest(`/catalog/products/${productId}/`, {
        method: "PATCH",
        body: await buildCatalogFormData(payload),
      });
      await refreshForCurrentUser();
      pushToast(
        "Product updated",
        `${payload.name} details were saved.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await apiRequest(`/catalog/products/${productId}/`, { method: "DELETE" });
      await refreshForCurrentUser();
      pushToast(
        "Product removed",
        "The product was deleted from inventory.",
        "warning",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const addSellerProduct = async (payload: SellerProductUpsertPayload) => {
    try {
      await apiRequest("/catalog/seller-products/", {
        method: "POST",
        body: await buildCatalogFormData(payload),
      });
      await refreshForCurrentUser();
      pushToast(
        "My stock updated",
        `${payload.name} was added to your stock list.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to add seller product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const updateSellerProduct = async (
    productId: string,
    payload: SellerProductUpsertPayload,
  ) => {
    try {
      await apiRequest(`/catalog/seller-products/${productId}/`, {
        method: "PATCH",
        body: await buildCatalogFormData(payload),
      });
      await refreshForCurrentUser();
      pushToast(
        "My stock updated",
        `${payload.name} details were saved.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update seller product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const deleteSellerProduct = async (productId: string) => {
    try {
      await apiRequest(`/catalog/seller-products/${productId}/`, {
        method: "DELETE",
      });
      await refreshForCurrentUser();
      pushToast(
        "My stock updated",
        "The item was removed from your stock list.",
        "warning",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete seller product.";
      pushToast("Action failed", message, "warning");
    }
  };

  const reserveProduct = async (
    productId: string,
    quantity: number,
  ): Promise<ReservationResult> => {
    if (!currentUser || currentUser.role !== "seller") {
      return {
        ok: false,
        message: "Only authenticated sellers can reserve products.",
      };
    }

    try {
      await apiRequest("/reservations/reservations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      await refreshForCurrentUser(currentUser.role);
      pushToast(
        "Reservation successful",
        "The product was reserved successfully.",
        "success",
      );
      return { ok: true, message: "Reservation completed." };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Reservation failed.";
      return { ok: false, message };
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await apiRequest("/notifications/mark-read/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notificationId] }),
      });
      await refreshNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const approveReservation = async (reservationId: string) => {
    try {
      await apiRequest(`/reservations/reservations/${reservationId}/approve/`, {
        method: "POST",
      });
      await refreshPrivateData(currentUser?.role);
      pushToast(
        "Reservation approved",
        "The reservation is now approved.",
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to approve reservation.";
      pushToast("Action failed", message, "warning");
    }
  };

  const rejectReservation = async (reservationId: string) => {
    try {
      await apiRequest(`/reservations/reservations/${reservationId}/reject/`, {
        method: "POST",
      });
      await refreshPrivateData(currentUser?.role);
      pushToast(
        "Reservation rejected",
        "The reservation was rejected and moved to history.",
        "warning",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reject reservation.";
      pushToast("Action failed", message, "warning");
    }
  };

  const confirmReservationDelivery = async (reservationId: string) => {
    try {
      await apiRequest(`/reservations/reservations/${reservationId}/deliver/`, {
        method: "POST",
      });
      await refreshPrivateData(currentUser?.role);
      pushToast(
        "Delivery confirmed",
        "The reservation was moved to history.",
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to confirm delivery.";
      pushToast("Action failed", message, "warning");
    }
  };

  const setCommissionPercent = async (value: number) => {
    try {
      await apiRequest("/site/settings/1/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionPercent: value }),
      });
      await refreshPublicData();
      pushToast("Discount updated", `Discount is now ${value}%.`, "info");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update discount.";
      pushToast("Action failed", message, "warning");
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      categories,
      products,
      sellerProducts,
      sellers,
      adminAccounts,
      reservations,
      notifications,
      commissionPercent,
      siteSettings,
      toasts,
      unreadNotificationCount,
      login,
      logout,
      registerSeller,
      registerAdmin,
      deleteAdminAccount,
      approveSeller,
      rejectSeller,
      addCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      addSellerProduct,
      updateSellerProduct,
      deleteSellerProduct,
      reserveProduct,
      markNotificationRead,
      approveReservation,
      rejectReservation,
      confirmReservationDelivery,
      enableBrowserNotifications,
      setCommissionPercent,
      dismissToast,
    }),
    [
      currentUser,
      categories,
      products,
      sellerProducts,
      sellers,
      adminAccounts,
      reservations,
      notifications,
      commissionPercent,
      siteSettings,
      toasts,
      unreadNotificationCount,
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
