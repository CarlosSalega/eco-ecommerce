"use client";

import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />

      <main className="container-gutter mx-auto max-w-7xl flex-1 py-12">
        <div className="mb-12">
          <h1 className="mb-2 font-serif text-4xl font-light tracking-tight">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Administrá tu tienda de cosméticos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Productos",
              value: stats.totalProducts,
              href: "/admin/products",
            },
            {
              label: "Categorías",
              value: stats.totalCategories,
              href: "/admin/categories",
            },
            {
              label: "Órdenes Pendientes",
              value: stats.pendingOrders,
              href: "/admin/orders",
            },
            {
              label: "Ingresos",
              value: `$${(stats.totalRevenue / 100).toFixed(2)}`,
              href: "/admin/orders",
            },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-card border-border hover:border-accent cursor-pointer rounded-lg border p-6 transition">
                <p className="text-muted-foreground mb-2 text-sm">
                  {stat.label}
                </p>
                <p className="text-accent text-3xl font-semibold">
                  {stat.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border-border rounded-lg border p-8">
          <h2 className="mb-6 text-lg font-semibold">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-accent hover:bg-accent/90 text-white">
              <Link href="/admin/products/new">Agregar Producto</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories/new">Agregar Categoría</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/orders">Ver Órdenes</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
