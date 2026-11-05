// Products that run on the Proxigo platform. The marketing pages, the desktop
// app section, and the dashboard sidebar are all driven from this list, so a new
// product only needs an entry here plus its own pages.

export type ProductStatus = "available" | "preorder" | "development";

export interface ProductNavItem {
  label: string;
  href: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  summary: string;
  status: ProductStatus;
  href: string;
  /** Sections this product adds to the user dashboard. */
  dashboard: ProductNavItem[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "macula",
    name: "Macula",
    category: "Visual positioning module",
    summary:
      "Bolt-on module that gives a drone continuous position estimates from a downward camera. No GPS, no ground infrastructure.",
    status: "preorder",
    href: "/product",
    dashboard: [
      { label: "Modules", href: "/dashboard/modules" },
      { label: "Map usage", href: "/dashboard/usage" },
    ],
  },
];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  available: "Available",
  preorder: "Pre-order",
  development: "In development",
};
