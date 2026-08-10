"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Store,
  PanelLeftClose,
  PanelLeft,
  X,
  ChevronDown,
} from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { sidebarItems } from "./sidebar-items";
import { useSidebar } from "./SidebarContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-stone-950/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-stone-200 flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-60"
        } ${
          isMobileOpen ? "translate-x-0 w-60 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-14 px-3.5 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              className="rounded-lg flex-shrink-0"
              alt="BatalaBandi"
            />

            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-extrabold text-xs text-stone-950 tracking-tight leading-tight truncate">
                  BatalaBandi
                </h2>
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider truncate">
                  Admin Panel
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition flex-shrink-0"
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4 text-amber-600" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-stone-500" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar space-y-1">
          {isCollapsed ? (
            /* COLLAPSED MODE: Clean icon-only column without nested text clutter */
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const targetHref = item.children ? item.children[0].href : item.href;
                const active =
                  pathname === targetHref ||
                  (targetHref !== "/admin" && pathname.startsWith(targetHref));

                return (
                  <Link
                    key={item.title}
                    href={targetHref}
                    title={item.title}
                    onClick={() => setIsMobileOpen(false)}
                    className={`w-12 h-10 mx-auto flex items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-[#facc15] text-stone-950 font-bold shadow-xs"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <Icon size={19} className="flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            /* EXPANDED MODE: Full Menu with Accordions */
            <Accordion className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                // Single item without children
                if (!item.children) {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-[#facc15] text-stone-950 font-extrabold shadow-xs"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0 text-stone-700" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                }

                // Parent item with children
                return (
                  <AccordionItem
                    key={item.title}
                    value={item.title}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className="hover:no-underline rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition [&[data-state=open]]:bg-stone-50"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={18} className="flex-shrink-0 text-stone-700" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-1 pt-1">
                      <div className="ml-6 pl-2 border-l border-stone-200 space-y-1">
                        {item.children.map((child) => {
                          const active =
                            pathname === child.href ||
                            pathname.startsWith(child.href + "/");

                          return (
                            <Link
                              key={child.title}
                              href={child.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`block rounded-lg px-2.5 py-1.5 text-xs transition truncate ${
                                active
                                  ? "bg-yellow-100 text-yellow-950 font-extrabold"
                                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                              }`}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* Footer Link */}
        <div className="border-t border-stone-100 p-2.5 flex-shrink-0">
          <Link
            href="/"
            title={isCollapsed ? "Visit Store" : undefined}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2" : "justify-center gap-2 px-3"
            } rounded-xl bg-yellow-100 hover:bg-yellow-200 py-2.5 text-xs font-bold text-stone-950 transition`}
          >
            <Store size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Visit Store</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}