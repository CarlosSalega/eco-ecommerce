import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border mt-20 border-t bg-white">
      <div className="container-gutter mx-auto max-w-7xl py-12 md:py-16">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-light tracking-wider">
              Belleza
            </h3>
            <p className="text-muted-foreground text-sm">
              Cosméticos y productos de belleza premium para la mujer moderna.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=skincare"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Cuidado de Piel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=makeup"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Maquillaje
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2025 Belleza. Todos los derechos reservados.
          </p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
