'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Package,
  ShoppingBag,
  Ticket,
  Boxes,
  Users,
  BarChart3,
  Settings,
  Plus,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Zap,
  ArrowUpRight,
  FolderTree,
  Palette,
  Megaphone,
  Layers,
  Sparkles,
  Tag,
  Ruler,
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  category: 'quickstart' | 'catalog' | 'tabs' | 'payment' | 'faq';
  icon: any;
  summary: string;
  steps?: string[];
  tips?: string[];
  linkUrl?: string;
  linkLabel?: string;
}

const docSections: DocSection[] = [
  // CATALOG MASTERCLASS (DETAILED EXPLANATIONS)
  {
    id: 'catalog-products',
    title: '1. Products Directory & Catalog (/admin/products)',
    category: 'catalog',
    icon: Package,
    summary: 'Master guide to creating, pricing, tagging, and publishing products on BatalaBandi.',
    steps: [
      'Product Title & Subtitle: Use descriptive titles including fit & GSM (e.g. "Cyber Samurai Oversized Heavyweight Tee - 240 GSM").',
      'Pricing & Discount Badges: Set "Price (₹)" as selling price and "Compare At Price (₹)" higher to display crossed-out discount badges (e.g. ~~₹1,990~~ ₹1,490).',
      'Media & Thumbnails: Upload high-res square product images (1:1 ratio). First image becomes the primary thumbnail.',
      'Inventory & SKU: Assign unique SKU codes (e.g. BB-TSH-001) and set Stock quantity & Low Stock Alert threshold.',
      'Taxonomy Tags: Tag the product with Category (Tshirts), Collection (Printed), Theme (Anime), and Gender (Unisex/Men/Women).',
      'Variants: Add Color Swatches (Black, White) and Sizes (S, M, L, XL) with individual SKU stock quantities.',
    ],
    tips: [
      'Keeping Compare At Price active increases customer conversion by 35%!',
      'Products with stock <= Low Stock Threshold will trigger red inventory alerts on your dashboard.',
    ],
    linkUrl: '/admin/products',
    linkLabel: 'Open Products Catalog',
  },
  {
    id: 'catalog-categories',
    title: '2. Categories & Taxonomy Tree (/admin/categories)',
    category: 'catalog',
    icon: FolderTree,
    summary: 'Organize your store hierarchy into primary gender departments and specialized apparel groups.',
    steps: [
      'Level 0 (Main Departments): Top-level categories (e.g. "Men", "Women", "Unisex").',
      'Level 1 (Apparel Groups): Group categories under departments (e.g. "Tops", "Bottoms", "Ethnic Wear").',
      'Level 2 (Specific Garment Cuts): Child subcategories (e.g. "Shirts", "Hoodies", "Oversized T-Shirts", "Joggers").',
      'Category Slugs: Controls clean storefront URLs (e.g., /categories/oversized-tshirts). Slugs are lowercase separated by hyphens.',
      'Status Toggle: Set Active to publish on navigation headers or Draft to hide temporarily.',
    ],
    tips: [
      'Category tree directly powers the top header navigation menu on desktop and mobile app bars.',
    ],
    linkUrl: '/admin/categories',
    linkLabel: 'Manage Categories',
  },
  {
    id: 'catalog-product-types',
    title: '3. Product Types & Size Rules (/admin/product-types)',
    category: 'catalog',
    icon: Tag,
    summary: 'Garment classification system connecting products to size guides and gender availability rules.',
    steps: [
      'Define Garment Types: Standardize types like "Shirt", "Hoodie", "Oversized T-Shirt", "Kurta", "Joggers", "Dress", "Cap".',
      'Parent Category Binding: Bind each type to its parent group (e.g. Hoodie ➔ Tops).',
      'Gender Availability: Define eligible genders (e.g., Kurta ➔ Men & Women; Hoodie ➔ Unisex & Men).',
      'Featured Toggles: Mark popular types as "Featured" to highlight on category filter chips.',
    ],
    linkUrl: '/admin/product-types',
    linkLabel: 'Manage Product Types',
  },
  {
    id: 'catalog-collections',
    title: '4. Collections & Craftsmanship Drops (/admin/collections)',
    category: 'catalog',
    icon: Palette,
    summary: 'Curate artisan drops based on printing, embroidery, and painting techniques.',
    steps: [
      'Drop Names: Create collections based on technique (e.g. "Hand Painted", "Thread Embroidery", "Printed DTG", "Limited Edition").',
      'Homepage Priority: Set priority ranking (1 to 5) to control order of appearance on the homepage slider.',
      'Promo Badges: Assign custom promo labels like "Best Seller", "Hot Drop", "Limited Edition", or "New Arrival".',
      'Short Description: Write a compelling 1-line craftsmanship backstory displayed on category banners.',
    ],
    tips: [
      'Collections allow customers to shop by craft style rather than just garment type!',
    ],
    linkUrl: '/admin/collections',
    linkLabel: 'Manage Collections',
  },
  {
    id: 'catalog-themes',
    title: '5. Pop-Culture & Aesthetic Themes (/admin/themes)',
    category: 'catalog',
    icon: Sparkles,
    summary: 'Curate design aesthetics (Anime, Nature, Marvel, Gaming, Quotes) with custom marketing banners.',
    steps: [
      'Theme Creation: Set up themes like "Anime / Otaku", "Nature Botanical", "Marvel Superheroes", "Gaming Esports", "Bold Quotes".',
      'Marketing Tagline: Set custom tagline (e.g. "Unleash Your Inner Otaku Street Style").',
      'Hero CTA Button: Set button label (e.g. "Explore Anime Collection") and URL link.',
      'Compatible Collections: Link themes to matching collections (e.g. Anime Theme ➔ Printed & Limited Edition drops).',
    ],
    linkUrl: '/admin/themes',
    linkLabel: 'Manage Themes',
  },
  {
    id: 'catalog-attributes',
    title: '6. Global Variant Attributes (/admin/attributes)',
    category: 'catalog',
    icon: Ruler,
    summary: 'Configure global variant properties for Color Swatches, Size Charts, Materials & Fit Silhouettes.',
    steps: [
      'Color Swatches: Define color names and exact Hex Codes (e.g., Midnight Black `#000000`, Crimson Red `#ef4444`, Emerald Green `#10b981`).',
      'Size Grids: Define size values (`XS`, `S`, `M`, `L`, `XL`, `XXL`) with chest measurement labels (e.g. Medium 40").',
      'Materials: Define fabric textures and GSM weight (e.g., "100% Combed Cotton 240 GSM", "330 GSM Heavy Brushed Fleece").',
      'Fit Silhouettes: Define cuts (e.g. "Drop Shoulder Oversized Fit", "Tailored Slim Fit", "Classic Regular Cut").',
    ],
    tips: [
      'Hex codes automatically render interactive visual color circles on product pages for shoppers to click!',
    ],
    linkUrl: '/admin/attributes',
    linkLabel: 'Manage Attributes',
  },

  // QUICK START GUIDES
  {
    id: 'add-product-guide',
    title: 'How to Add & Publish a New Product Step-by-Step',
    category: 'quickstart',
    icon: Plus,
    summary: 'Step-by-step walkthrough to list a new garment or accessory on BatalaBandi.',
    steps: [
      'Navigate to Catalog ➔ Products in the admin sidebar, or click the yellow "Add Product" button.',
      'Enter Product Title (e.g. "Cyber Samurai Oversized Heavyweight Tee") and Subtitle.',
      'Set Pricing: Regular Price (₹) and optional Compare At Price (₹) for discount crossed-out badges.',
      'Assign Category (Tshirts/Hoodies/Kurtas), Collection (Printed/Painted), and Theme (Anime/Nature).',
      'Upload High-Res Product Images and select Color Swatches (Black, White, Blue) and Sizes (S, M, L, XL).',
      'Set Inventory Quantity (e.g. Stock: 35) and Low Stock Alert Threshold (e.g. 5).',
      'Click "Save & Publish Product" to immediately list it live on your store!',
    ],
    linkUrl: '/admin/products/create',
    linkLabel: 'Open Add Product Wizard',
  },
  {
    id: 'pack-order-guide',
    title: 'How to Pick, Pack & Dispatch Customer Orders',
    category: 'quickstart',
    icon: ShoppingBag,
    summary: 'How your warehouse staff can fulfill orders, print invoices, and update delivery status.',
    steps: [
      'Go to Orders tab in the admin sidebar to see all real-time customer purchases.',
      'Click on any order or click "Open Packing Slip" button to view its dedicated fulfillment page (/admin/orders/[id]).',
      'Check Customer Shipping Address: Click "Copy Address" to paste directly into courier portals (Shiprocket/BlueDart).',
      'Use the Item Checklist: Tick the checkbox [x] for each garment as you pack it into the box.',
      'Click "Print Packing Slip" to print the physical invoice to attach to the parcel.',
      'Update Fulfillment Status: Click "Mark Packing (Processing)" ➔ "Mark Shipped" ➔ "Mark Delivered".',
    ],
    linkUrl: '/admin/orders',
    linkLabel: 'Go to Order Management',
  },
  {
    id: 'create-coupon-guide',
    title: 'How to Create & Share Discount Coupons',
    category: 'quickstart',
    icon: Ticket,
    summary: 'Create custom promo codes (e.g., WELCOME10, FESTIVE15) with percentage or flat discounts.',
    steps: [
      'Navigate to Marketing ➔ Coupons in the sidebar.',
      'Click "Create New Coupon" button.',
      'Enter Coupon Code (e.g. "SUMMER20" - codes automatically convert to UPPERCASE).',
      'Select Discount Type: Percentage (e.g. 20% OFF) or Flat Amount (e.g. ₹200 OFF).',
      'Set Minimum Purchase Amount (e.g. Min order ₹999 required for coupon to apply).',
      'Set Usage Limit (e.g. Max 500 uses total) and click Save Coupon.',
    ],
    linkUrl: '/admin/coupons',
    linkLabel: 'Manage Coupons',
  },

  // TAB DIRECTORY
  {
    id: 'tab-dashboard',
    title: 'Dashboard Overview (/admin)',
    category: 'tabs',
    icon: BarChart3,
    summary: 'Central nerve center showing real-time gross revenue, total orders, active products, total registered customers, and live order feed.',
    linkUrl: '/admin',
    linkLabel: 'Go to Dashboard',
  },
  {
    id: 'tab-customers',
    title: 'Customers Directory (/admin/customers)',
    category: 'tabs',
    icon: Users,
    summary: 'View registered customer accounts, check join dates, and assign administrator privileges.',
    linkUrl: '/admin/customers',
    linkLabel: 'View Customers',
  },
  {
    id: 'tab-marketing',
    title: 'Marketing & Banners (/admin/marketing)',
    category: 'tabs',
    icon: Megaphone,
    summary: 'Manage homepage promotional banners, hero carousel sliders, and store discount coupons.',
    linkUrl: '/admin/marketing',
    linkLabel: 'Go to Marketing',
  },
  {
    id: 'tab-reports',
    title: 'Sales & Analytics Reports (/admin/reports)',
    category: 'tabs',
    icon: BarChart3,
    summary: 'Analyze revenue metrics, average order value, category share, and export full CSV reports.',
    linkUrl: '/admin/reports',
    linkLabel: 'View Reports',
  },
  {
    id: 'tab-settings',
    title: 'Store Settings & Gateway (/admin/settings)',
    category: 'tabs',
    icon: Settings,
    summary: 'Configure store profile, Razorpay API credentials, test mode toggles, and delivery charge rules.',
    linkUrl: '/admin/settings',
    linkLabel: 'Open Settings',
  },

  // PAYMENT & SECURITY
  {
    id: 'payment-sec-guide',
    title: 'Razorpay Online Payments & Security',
    category: 'payment',
    icon: ShieldCheck,
    summary: 'How payments work safely on BatalaBandi.',
    steps: [
      'Razorpay Integration handles 100% Online Payments (UPI, Google Pay, PhonePe, Cards, NetBanking).',
      'All payments are cryptographically verified on server using HMAC SHA256 signatures.',
      'Webhooks automatically update order payment status to PAID when Razorpay captures payment.',
      'Configure test keys in /admin/settings or server/.env (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET).',
    ],
  },

  // FAQ
  {
    id: 'faq-1',
    title: 'How do I grant Admin access to an employee?',
    category: 'faq',
    icon: HelpCircle,
    summary: 'Go to Customers tab (/admin/customers), search for the employee’s account email, and click the "Make Admin" button!',
  },
  {
    id: 'faq-2',
    title: 'What happens when stock reaches 0?',
    category: 'faq',
    icon: HelpCircle,
    summary: 'Products with 0 stock automatically show an "Out of Stock" badge on the shop storefront so customers cannot overpurchase.',
  },
];

export default function AdminDocsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'catalog' | 'quickstart' | 'tabs' | 'payment' | 'faq'>('catalog');

  const filteredDocs = docSections.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.summary.toLowerCase().includes(search.toLowerCase()) ||
      (doc.steps && doc.steps.some((s) => s.toLowerCase().includes(search.toLowerCase())));
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Page Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#facc15] text-stone-950 flex items-center justify-center font-black shadow-xs">
              <BookOpen className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
                Admin User Guide & Catalog Masterclass
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Exhaustive documentation for products, categories, collections, themes, attributes, orders & store settings.
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog, products, categories..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'catalog', label: '📦 Catalog Masterclass (Deep Dive)' },
          { id: 'quickstart', label: '🚀 Step-by-Step How-Tos' },
          { id: 'tabs', label: '🗂️ All Admin Tabs' },
          { id: 'payment', label: '💳 Payment Gateway' },
          { id: 'faq', label: '❓ FAQs & Tips' },
          { id: 'all', label: 'All Documentation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === tab.id
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
            <p className="text-sm font-black text-stone-900">No documentation guides match your search</p>
            <p className="text-xs text-stone-400">Try searching for keywords like "product", "category", or "attribute".</p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                id={doc.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-amber-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black shrink-0">
                      <Icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-stone-950">{doc.title}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{doc.summary}</p>
                    </div>
                  </div>

                  {doc.linkUrl && (
                    <Link
                      href={doc.linkUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-bold rounded-xl shadow-xs transition active:scale-95 self-start sm:self-auto shrink-0"
                    >
                      <span>{doc.linkLabel || 'Open Page'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Step / Details List */}
                {doc.steps && doc.steps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                      Detailed Breakdown & Features:
                    </h4>
                    <ol className="space-y-2 text-xs">
                      {doc.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-stone-800 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Pro Tips */}
                {doc.tips && doc.tips.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-950 font-medium space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Pro Tip:
                    </span>
                    {doc.tips.map((tip, idx) => (
                      <p key={idx}>• {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
