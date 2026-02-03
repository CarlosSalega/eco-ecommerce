"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useEffect, useState } from "react";

const defaultLinks = [
  { label: "Instagram", url: "https://instagram.com/tuusuario" },
  { label: "WhatsApp", url: "https://wa.me/1234567890" },
  { label: "Facebook", url: "https://facebook.com/tuusuario" },
  { label: "Sitio Web", url: "https://tusitio.com" },
];

export default function ContactPage() {
  const [contactLinks, setContactLinks] = useState(defaultLinks);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("contactLinks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setContactLinks(parsed);
        } catch {}
      }
    }
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-7xl py-12">
      <h1 className="mb-8 text-center font-serif text-4xl font-light tracking-tight">
        Contactos
      </h1>
      <div className="bg-card flex min-w-72 flex-col gap-4 rounded-xl px-4 py-8">
        {contactLinks.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-accent hover:bg-accent/80 min-h-14 w-full text-lg text-white">
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </main>
  );
}
