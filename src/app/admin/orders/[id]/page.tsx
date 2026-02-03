"use client";

import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Order = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: { include: { product: true } };
  };
}>;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Orden no encontrada");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la orden",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Cargando orden...</p>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-destructive">{error || "Orden no encontrada"}</p>
        </main>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(order.totalAmount - subtotal);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />

      <main className="container-gutter mx-auto max-w-4xl flex-1 py-12">
        <Link
          href="/admin/orders"
          className="text-accent hover:text-accent/80 mb-6 flex items-center gap-2 transition"
        >
          <ArrowLeft className="size-4" />
          Volver a las Órdenes
        </Link>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-light tracking-tight">
            Orden {order.id.slice(0, 8)}
          </h1>
          <Badge
            className={
              order.status === "PAID"
                ? "border-transparent bg-green-300 text-green-800"
                : order.status === "PENDING"
                  ? "border-transparent bg-orange-300 text-orange-800"
                  : "bg-destructive border-transparent text-white"
            }
          >
            {order.status === "PAID"
              ? "Pagado"
              : order.status === "PENDING"
                ? "Pendiente"
                : order.status}
          </Badge>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Información de la Orden */}
          <div className="lg:col-span-2">
            <div className="bg-card border-border mb-6 rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Información de la Orden
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de Orden:</span>
                  <span className="font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tipo de Entrega:
                  </span>
                  <span>
                    {order.deliveryType === "MEET_UP"
                      ? "Punto de Encuentro"
                      : "Envío"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border-border mb-6 rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Información del Cliente
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span>
                    {order.fullName || order.customer?.name || "Sin dato"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span>{order.customer?.phone || "Sin dato"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.customer?.email || "Sin dato"}</span>
                </div>
              </div>
            </div>

            {order.deliveryType === "SHIPPING" && (
              <div className="bg-card border-border mb-6 rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Dirección de Envío
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dirección:</span>
                    <span>{order.address || "Sin dato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ciudad:</span>
                    <span>{order.city || "Sin dato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provincia:</span>
                    <span>{order.province || "Sin dato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Código Postal:
                    </span>
                    <span>{order.postalCode || "Sin dato"}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border-border rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Artículos de la Orden
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product.title}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Resumen de la Orden */}
          <div>
            <div className="bg-card border-border sticky top-20 rounded-lg border p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Resumen de la Orden
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>${(tax / 100).toFixed(2)}</span>
                </div>
                <div className="border-border flex justify-between border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
