'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Grid2X2, Search, Heart, ShoppingBag } from "lucide-react";
import MobileSearchDrawer from "@/components/common/MobileSearchDrawer";
import { getWishlist } from "@/lib/wishlist/store";
import { getCart, getLocalCart } from "@/lib/cart/store";

export default function BottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateCounts = async () => {
    const wishItems = getWishlist();
    setWishlistCount(wishItems.length);

    const cartItems = getLocalCart();
    const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCartQty);
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('cart-updated', updateCounts);
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
    };
  }, []);

  const resolvedActive = pathname === "/"
    ? "home"
    : pathname === "/wishlist"
      ? "wishlist"
      : pathname === "/profile"
        ? "profile"
        : pathname === "/categories" || pathname.startsWith("/categories/")
          ? "categories"
          : pathname === "/cart"
            ? "cart"
            : active;

  const navItems = [
    { id: "home", label: "Home", Icon: Home, href: "/" },
    { id: "categories", label: "Categories", Icon: Grid2X2, href: "/categories" },
    { id: "search", label: "Search", Icon: Search, isSpecial: true },
    { id: "wishlist", label: "Wishlist", Icon: Heart, badge: wishlistCount, href: "/wishlist" },
    { id: "cart", label: "Cart", Icon: ShoppingBag, badge: cartCount, href: "/cart" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] font-sans pb-[env(safe-area-inset-bottom,0px)]">
        <div className="max-w-md mx-auto flex items-center justify-around px-3 py-1 h-14 relative">
          {navItems.map(({ id, label, Icon, badge, isSpecial, href }) => {
            const isActive = resolvedActive === id || (id === "search" && isSearchOpen);

            // Large Floating Bump Search button
            if (isSpecial) {
              return (
                <button
                  key={id}
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open Search Drawer"
                  className="flex flex-col items-center justify-center -mt-5 focus:outline-none relative z-10"
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                      border-2 border-white shadow-lg
                      ${isActive
                        ? "bg-stone-950 text-[#facc15] scale-105 ring-2 ring-[#facc15]"
                        : "bg-[#facc15] text-stone-950 hover:bg-[#eab308] active:scale-95"
                      }
                    `}
                  >
                    <Search className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 font-bold transition-colors ${
                      isActive ? "text-stone-950 font-black" : "text-stone-500 font-semibold"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            }

            // Standard nav items with larger icons and dynamic yellow badge
            return (
              <Link
                key={id}
                href={href || "/"}
                onClick={() => setActive(id)}
                className="flex flex-col items-center justify-center px-2 py-1 transition-all relative min-w-[52px]"
              >
                {/* Top yellow active indicator bar */}
                {isActive && (
                  <span className="absolute -top-1 w-7 h-0.5 bg-[#facc15] rounded-full" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all ${
                      isActive
                        ? "text-[#facc15] stroke-[2.5] scale-110"
                        : "text-stone-400 stroke-[1.8]"
                    }`}
                  />
                  {badge && badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#facc15] text-stone-950 text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-2xs">
                      {badge}
                    </span>
                  ) : null}
                </div>

                <span
                  className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? "text-stone-950 font-black" : "text-stone-500 font-semibold"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Search Bottom Sheet */}
      <MobileSearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
