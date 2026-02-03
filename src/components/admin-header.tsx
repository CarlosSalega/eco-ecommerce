"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const adminFolders = [
  { name: "Productos", path: "/admin/products" },
  { name: "Categorías", path: "/admin/categories" },
  { name: "Órdenes", path: "/admin/orders" },
  { name: "Configuración", path: "/admin/settings" },
];

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // In production, would call API
    localStorage.removeItem("admin-session");
    window.location.href = "/admin/login";
  };

  return (
    <header className="border-border sticky top-0 z-50 w-dvw border-b bg-white">
      <nav className="container-gutter mx-auto flex max-w-7xl items-center justify-between py-4">
        <Link
          href="/admin"
          className="text-foreground font-serif text-xl font-light tracking-wider"
        >
          Belleza Admin
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {adminFolders.map((folder) => (
            <Link
              key={folder.path}
              href={folder.path}
              className="text-foreground hover:text-accent text-sm font-medium transition"
            >
              {folder.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden gap-2 bg-transparent md:flex"
          >
            <LogOut className="size-4" />
            Cerrar Sesión
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:bg-primary/10 relative rounded-lg p-2 transition md:hidden"
            style={{ width: "2rem", height: "2rem" }}
          >
            <span
              className={`absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 ${mobileMenuOpen ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
              style={{ pointerEvents: mobileMenuOpen ? "none" : "auto" }}
              aria-hidden={mobileMenuOpen}
            >
              <Menu className="size-full" />
            </span>
            <span
              className={`absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 ${mobileMenuOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
              style={{ pointerEvents: !mobileMenuOpen ? "none" : "auto" }}
              aria-hidden={!mobileMenuOpen}
            >
              <X className="size-full" />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`border-border bg-card max-w-7xl transform border-t transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
        style={{ position: "absolute", width: "100%" }}
      >
        <div className="container-gutter mx-auto flex max-w-7xl flex-col gap-3 py-4">
          {adminFolders.map((folder) => (
            <Link
              key={folder.path}
              href={folder.path}
              className="text-foreground hover:text-accent text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {folder.name}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full bg-transparent"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
