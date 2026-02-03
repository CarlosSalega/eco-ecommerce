"use client";

import { AdminHeader } from "@/components/admin-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type Order = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: { include: { product: true } };
  };
}>;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AdminHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 overflow-x-hidden px-4 py-12">
        <h1 className="mb-2 font-serif text-4xl font-light tracking-tight">
          Órdenes
        </h1>
        <p className="text-muted-foreground pb-8">
          Visualizá y administrá las órdenes de clientes
        </p>

        <div className="bg-card border-border w-full overflow-x-auto rounded-lg border">
          {loading ? (
            <div className="text-muted-foreground p-8 text-center">
              Cargando órdenes...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              No hay órdenes todavía.
            </div>
          ) : (
            <Table className="min-w-max table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    ID de Orden
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Cliente</TableHead>
                  <TableHead className="whitespace-nowrap">Monto</TableHead>
                  <TableHead className="whitespace-nowrap">Estado</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Tipo de Entrega
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Fecha</TableHead>
                  <TableHead className="whitespace-nowrap">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {order.id.slice(0, 8)}...
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div>
                        <p className="font-medium">
                          {order.customer?.name || "Invitado"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {order.customer?.phone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
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
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {order.deliveryType === "MEET_UP" ? "Retiro" : "Envío"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
