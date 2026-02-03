import { PrismaClient } from "@prisma/client";
import { categoriesData, productsData } from "./data/products";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

function generateSlugBase(title: string): string {
	return slugify(title, { lower: true, strict: true });
}

async function generateUniqueSlug(base: string): Promise<string> {
	let slug = base;
	let counter = 1;

	while (true) {
		const exists = await prisma.product.findFirst({ where: { slug } });
		if (!exists) return slug;

		slug = `${base}-${counter}`;
		counter++;
	}
}

async function main() {
	console.log("🚀 Iniciando seed de la base de datos...");

	try {
		// 1. Limpiar datos existentes (en orden correcto por dependencias)
		console.log("🧹 Limpiando datos existentes...");

		// Limpiar sesiones de admin primero
		await prisma.adminSession.deleteMany();

		await prisma.orderItem.deleteMany();
		await prisma.order.deleteMany();
		await prisma.variant.deleteMany();
		await prisma.product.deleteMany();
		await prisma.category.deleteMany();
		await prisma.customer.deleteMany();
		await prisma.oTPCode.deleteMany();
		await prisma.adminUser.deleteMany();

		console.log("✅ Datos existentes eliminados");

		// 2. Crear categorías
		console.log("📁 Creando categorías...");

		const categorias = await Promise.all(
			categoriesData.map((cat) => prisma.category.create({ data: cat }))
		);

		console.log(`✅ ${categorias.length} categorías creadas`);

		// 3. Mapear categorías por nombre para fácil acceso
		const categoriasMap = new Map();
		categorias.forEach((cat) => categoriasMap.set(cat.name, cat.id));

		// 4. Crear productos con sus imágenes y variantes
		console.log("📦 Creando productos...");

		let productosCreados = [];

		for (const productData of productsData) {
			try {
				const categoryId = categoriasMap.get(productData.categoryName);

				if (!categoryId) {
					console.warn(
						`⚠️ Categoría no encontrada para producto: ${productData.title}`
					);
					continue;
				}

				// 🔥 Generar slug único
				const baseSlug = generateSlugBase(productData.title);
				const slug = await generateUniqueSlug(baseSlug);

				// Convertir imágenes a array de strings
				const imageUrls: string[] = productData.images
					.map((img: any) =>
						typeof img === "string" ? img : img.url
					)
					.filter(
						(url: any): url is string => typeof url === "string"
					);

				const product = await prisma.product.create({
					data: {
						title: productData.title,
						slug,
						description: productData.description,
						price: productData.price,
						categoryId: categoryId,
						stock: productData.stock,
						isActive: productData.isActive,
						images: imageUrls,
					} as any,
				});

				// Variantes si existen
				if (productData.variants && productData.variants.length > 0) {
					await Promise.all(
						productData.variants.map((variant) =>
							prisma.variant.create({
								data: {
									name: variant.name,
									value: variant.value,
									productId: product.id,
								},
							})
						)
					);

					console.log(
						`   ↳ ${productData.variants.length} variantes creadas para: ${productData.title}`
					);
				}

				productosCreados.push(product);
				console.log(`   ✅ ${product.title} (${slug})`);
			} catch (error) {
				console.error(
					`❌ Error creando producto ${productData.title}:`,
					error
				);
			}
			console.log(
				`✅ ${productosCreados.length} productos creados en total`
			);
		}

		// 5. Crear usuarios admin
		console.log("👤 Creando usuario admin...");

		function hashPassword(password: string): string {
			return bcrypt.hashSync(password, 10);
		}

		const adminUser = await prisma.adminUser.create({
			data: {
				email: "admin@belleza.com",
				username: "admin",
				password: hashPassword("admin123"),
			},
		});

		console.log("✅ Usuario admin creado");
		console.log("   📧 Email: admin@belleza.com");
		console.log("   🔑 Contraseña: admin123");

		// 6. Crear cliente de prueba
		console.log("👥 Creando cliente de prueba...");

		const customer = await prisma.customer.create({
			data: {
				phone: "+541234567890",
				name: "Test Customer",
				email: "test@example.com",
			},
		});

		console.log("✅ Cliente de prueba creado");

		// 7. Crear orden de prueba
		console.log("🛒 Creando orden de prueba...");

		const order = await prisma.order.create({
			data: {
				customerId: customer.id,
				totalAmount: 5790,
				status: "PAID",
				deliveryType: "SHIPPING",
				fullName: "Test Customer",
				address: "Calle Falsa 123",
				postalCode: "1425",
				city: "Buenos Aires",
				province: "Buenos Aires",
			},
		});

		console.log("✅ Orden de prueba creada");

		// 8. Agregar items a la orden (usando variantes si existen)
		console.log("📝 Agregando items a la orden...");

		const serumProduct = productosCreados[0];
		const cremaProduct = productosCreados[1];

		// Obtener primera variante de cada producto si existe
		const serumVariant = await prisma.variant.findFirst({
			where: { productId: serumProduct.id },
		});

		const cremaVariant = await prisma.variant.findFirst({
			where: { productId: cremaProduct.id },
		});

		await Promise.all([
			prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: serumProduct.id,
					variantId: serumVariant?.id || null,
					quantity: 1,
					price: serumProduct.price,
				},
			}),
			prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: cremaProduct.id,
					variantId: cremaVariant?.id || null,
					quantity: 2,
					price: cremaProduct.price,
				},
			}),
		]);

		console.log("✅ Items de orden creados");

		// 9. Estadísticas finales
		console.log("\n📊 Resumen del seed:");
		console.log(`   📁 Categorías: ${categorias.length}`);
		console.log(`   📦 Productos: ${productosCreados.length}`);
		console.log(`   👤 Admin: 1`);
		console.log(`   👥 Clientes: 1`);
		console.log(`   🛒 Órdenes: 1`);
		console.log(`   📝 Items de orden: 2`);

		console.log("\n🎉 Seed completado exitosamente!");
		console.log("🔗 Puedes acceder al panel admin en /admin/login");
		console.log("👀 Para ver los datos: npx prisma studio");
	} catch (error) {
		console.error("\n❌ Error durante el seed:", error);
		throw error;
	}
}

main()
	.catch((e) => {
		console.error("💥 Error fatal en el seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("🔌 Conexión a la base de datos cerrada");
	});
