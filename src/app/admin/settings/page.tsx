"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/admin-header";

export default function AdminSettingsPage() {
  const [links, setLinks] = useState([
    { label: "Instagram", url: "" },
    { label: "WhatsApp", url: "" },
    { label: "Facebook", url: "" },
    { label: "Sitio Web", url: "" },
  ]);

  const handleChange = (idx: number, value: string) => {
    const newLinks = [...links];
    newLinks[idx].url = value;
    setLinks(newLinks);
  };

  const handleSave = () => {
    localStorage.setItem("contactLinks", JSON.stringify(links));
    alert("Configuración guardada");
  };

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-xl py-10">
        <h1 className="mb-6 text-2xl font-bold">
          Configurar enlaces de contacto
        </h1>
        <div className="space-y-4">
          {links.map((link, idx) => (
            <div key={link.label} className="flex items-center gap-2">
              <span className="w-32 font-medium">{link.label}</span>
              <Input
                value={link.url}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder={`URL de ${link.label}`}
              />
            </div>
          ))}
        </div>
        <Button className="mt-8" onClick={handleSave}>
          Guardar
        </Button>
      </main>
    </>
  );
}
