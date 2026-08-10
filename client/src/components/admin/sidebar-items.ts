import {
  LayoutDashboard,
  Package,
  FolderTree,
  Palette,
  Boxes,
  ShoppingBag,
  Users,
  Megaphone,
  BarChart3,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Catalog",
    icon: Package,
    children: [
      {
        title: "Products",
        href: "/admin/products",
      },
      {
        title: "Categories",
        href: "/admin/categories",
      },
      {
        title: "Product Types",
        href: "/admin/product-types",
      },
      {
        title: "Collections",
        href: "/admin/collections",
      },
      {
        title: "Themes",
        href: "/admin/themes",
      },
      {
        title: "Attributes",
        href: "/admin/attributes",
      },
    ],
  },
  {
    title: "Inventory",
    icon: Boxes,
    children: [
      {
        title: "Stock",
        href: "/admin/inventory",
      },
    ],
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Marketing",
    icon: Megaphone,
    children: [
      {
        title: "Homepage",
        href: "/admin/homepage",
      },
      {
        title: "Banners",
        href: "/admin/banners",
      },
      {
        title: "Coupons",
        href: "/admin/coupons",
      },
    ],
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];