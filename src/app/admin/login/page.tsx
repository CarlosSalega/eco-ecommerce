"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error en el inicio de sesión");
      }
      await response.json();
      toast({
        title: "Login exitoso",
        description: "Bienvenido al panel de administración",
      });
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error en el inicio de sesión",
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error en el inicio de sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 container-gutter flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card border-border rounded-lg border p-8">
          <h1 className="mb-8 text-center font-serif text-3xl font-light tracking-tight">
            Belleza Admin
          </h1>

          {error && (
            <div className="bg-destructive/10 text-destructive mb-6 rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@belleza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent/90 w-full text-white"
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </Button>
          </form>

          <div className="border-border text-muted-foreground mt-6 border-t pt-6 text-center text-xs">
            <p>Credenciales de prueba:</p>
            <p>admin@belleza.com</p>
            <p>admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
