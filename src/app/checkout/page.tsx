"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/cart";
import { setSession } from "@/lib/auth";
import Link from "next/link";

type CheckoutStep = "login" | "shipping" | "payment" | "confirmation";

function CheckoutContent() {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("login");

  // Login state
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Shipping state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryType, setDeliveryType] = useState<"MEET_UP" | "SHIPPING">(
    "MEET_UP",
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Por favor, ingresá un número de teléfono");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      const { code } = await response.json();
      console.log("[v0] OTP sent:", code); // For development
      setOtpSent(true);
      setShowOtpInput(true);
    } catch (err) {
      setError("Failed to send code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError("Por favor, ingresá el código OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode }),
      });

      if (!response.ok) {
        // Try to extract error message from API
        let errorMsg = "Código incorrecto o expirado. Intentá de nuevo.";
        try {
          const data = await response.json();
          if (data?.error) errorMsg = data.error;
        } catch {}
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const { customer } = await response.json();
      setSession({
        customerId: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
      });

      setStep("shipping");
    } catch (err) {
      setError("Invalid code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShipping = () => {
    if (!name) {
      setError("Por favor, ingresá tu nombre");
      return;
    }

    if (deliveryType === "SHIPPING") {
      if (!address || !city || !province || !postalCode) {
        setError("Por favor, completá todos los datos de envío");
        return;
      }
    }

    setError("");
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          fullName: name,
          email: email || undefined,
          deliveryType,
          address: deliveryType === "SHIPPING" ? address : undefined,
          city: deliveryType === "SHIPPING" ? city : undefined,
          province: deliveryType === "SHIPPING" ? province : undefined,
          postalCode: deliveryType === "SHIPPING" ? postalCode : undefined,
          items: cart.items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order } = await response.json();
      clearCart();
      setStep("confirmation");
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  if (step === "confirmation") {
    return (
      <div className="container-gutter mx-auto max-w-2xl py-20 text-center">
        <div className="mb-8">
          <div className="mb-4 text-6xl">✓</div>
          <h1 className="mb-4 font-serif text-4xl font-light tracking-tight">
            ¡Compra Confirmada!
          </h1>
          <p className="text-muted-foreground mb-8">
            Gracias por tu compra. Enviamos la confirmación a tu WhatsApp.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link href="/shop">Seguir Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-gutter mx-auto max-w-2xl py-20 text-center">
        <p className="text-muted-foreground mb-8">Tu carrito está vacío</p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/shop">Continuar Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-gutter mx-auto max-w-4xl py-12">
      {/* Progress */}
      <div className="mb-12 flex gap-2">
        {(() => {
          const steps: CheckoutStep[] = ["login", "shipping", "payment"];
          // Map step to index for progress bar
          let currentIndex = 0;
          switch (step as string) {
            case "login":
              currentIndex = 0;
              break;
            case "shipping":
              currentIndex = 1;
              break;
            case "payment":
            case "confirmation":
              currentIndex = 2;
              break;
            default:
              currentIndex = 0;
          }
          return steps.map((s, idx) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition ${
                idx <= currentIndex ? "bg-accent" : "bg-border"
              }`}
            />
          ));
        })()}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <h1 className="mb-8 font-serif text-3xl font-light tracking-tight">
            {step === "login"
              ? "Verificá tu Teléfono"
              : step === "shipping"
                ? "Información de Entrega"
                : "Revisá y Pagá"}
          </h1>

          {error && (
            <div className="bg-destructive/10 text-destructive mb-6 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Login Step */}
          {step === "login" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Ingresá tu número de WhatsApp
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 9 11 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className="flex-1"
                  />
                  {!otpSent && (
                    <Button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      {loading ? "Enviando..." : "Enviar Código"}
                    </Button>
                  )}
                </div>
              </div>

              {showOtpInput && (
                <div>
                  <Label htmlFor="otp" className="mb-2 block">
                    Código de Verificación (6 dígitos)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otpCode.length !== 6}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      {loading ? "Verificando..." : "Verificar"}
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    En desarrollo, el código aparece en la consola del
                    navegador.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Shipping Step */}
          {step === "shipping" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email (Opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@example.com"
                />
              </div>

              <div>
                <Label className="mb-3 block">Método de Entrega</Label>
                <div className="space-y-3">
                  {[
                    {
                      value: "MEET_UP",
                      label: "Encuentro / Retiro",
                    },
                    {
                      value: "SHIPPING",
                      label: "Envío a Domicilio",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.value}
                        checked={deliveryType === option.value}
                        onChange={(e) =>
                          setDeliveryType(
                            e.target.value as "MEET_UP" | "SHIPPING",
                          )
                        }
                        className="h-4 w-4"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {deliveryType === "SHIPPING" && (
                <>
                  <div>
                    <Label htmlFor="address" className="mb-2 block">
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle Principal 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="mb-2 block">
                        Localidad
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province" className="mb-2 block">
                        Provincia
                      </Label>
                      <Input
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="CABA"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postal" className="mb-2 block">
                      Código Postal
                    </Label>
                    <Input
                      id="postal"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1428"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleContinueShipping}
                className="bg-accent hover:bg-accent/90 w-full text-white"
              >
                Continuar al Pago
              </Button>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="space-y-6">
              <div className="bg-primary/5 border-border rounded-lg border p-6">
                <h3 className="mb-4 font-semibold">Detalles de la Orden</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span>{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span>{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega:</span>
                    <span>
                      {deliveryType === "MEET_UP" ? "Encuentro" : "Envío"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-border rounded-lg border bg-white p-6">
                <h3 className="mb-4 font-semibold">
                  Método de Pago (Simulado)
                </h3>
                <div className="bg-primary/5 border-border rounded-lg border p-4 text-sm">
                  💳 Mercado Pago - Integración
                  <p className="text-muted-foreground mt-2 text-xs">
                    El pago está simulado para desarrollo. Hacé clic en
                    "Completar Compra" para terminar.
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-accent hover:bg-accent/90 w-full text-white"
              >
                {loading ? "Procesando..." : "Completar Compra"}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border-border sticky top-20 rounded-lg border p-4">
            <h2 className="mb-6 text-lg font-semibold">Resumen de la Orden</h2>

            <div className="mb-6 max-h-96 space-y-3 overflow-y-auto">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-xs"
                >
                  <img
                    className="mr-2 aspect-square size-12 rounded-md object-cover"
                    src={item.image}
                    alt={item.title}
                    width={50}
                    height={50}
                  />
                  <span className="text-muted-foreground mr-2 flex-1 pl-2 text-balance lg:pl-0">
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-border space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-border flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
