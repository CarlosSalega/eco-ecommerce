export const categoriesData = [
	{ name: "Skincare" },
	{ name: "Maquillaje" },
	{ name: "Tratamientos" },
	{ name: "Cuidado del Cabello" },
	{ name: "Cuerpo" },
];

export const productsData = [
	{
		title: "Serum Vitamina C Premium",
		description:
			"Serum antioxidante potente con vitamina C pura. Ilumina y rejuvenece la piel en 4 semanas.",
		price: 2990,
		categoryName: "Skincare",
		stock: 50,
		isActive: true,
		images: [{ url: "/serum-vitamina-c-premium-cosm-tico.jpg" }],
		variants: [],
	},
	{
		title: "Crema Hidratante 24hs",
		description:
			"Crema facial nutritiva con ácido hialurónico. Hidratación profunda y duradera.",
		price: 1890,
		categoryName: "Skincare",
		stock: 45,
		isActive: true,
		images: [{ url: "/crema-hidratante-facial.jpg" }],
		variants: [
			{ name: "Tamaño", value: "250ml" },
			{ name: "Tamaño", value: "500ml" },
		],
	},
	{
		title: "Limpiador Facial Espuma",
		description:
			"Limpiador suave que elimina impurezas sin resecar. Indicado para todos los tipos de piel.",
		price: 1290,
		categoryName: "Skincare",
		stock: 60,
		isActive: true,
		images: [{ url: "/limpiador-facial-espuma.jpg" }],
		variants: [],
	},
	{
		title: "Base de Maquillaje Fluida",
		description:
			"Base de larga duración con cobertura media a alta. Acabado natural y mate.",
		price: 2190,
		categoryName: "Maquillaje",
		stock: 40,
		isActive: true,
		images: [{ url: "/base-maquillaje-fluida.jpg" }],
		variants: [
			{ name: "Color", value: "Rosa Claro" },
			{ name: "Color", value: "Rojo Intenso" },
			{ name: "Color", value: "Nude" },
			{ name: "Color", value: "Marrón" },
			{ name: "Color", value: "Frambuesa" },
		],
	},
	{
		title: "Labial Líquido Mate",
		description:
			"Labial de larga duración con acabado mate. 16 tonos disponibles.",
		price: 990,
		categoryName: "Maquillaje",
		stock: 55,
		isActive: true,
		images: [{ url: "/labial-l-quido-mate-rojo.jpg" }],
		variants: [
			{ name: "Color", value: "Rosa Claro" },
			{ name: "Color", value: "Rojo Intenso" },
			{ name: "Color", value: "Nude" },
			{ name: "Color", value: "Marrón" },
			{ name: "Color", value: "Frambuesa" },
		],
	},
	{
		title: "Paleta de Sombras 12 Colores",
		description:
			"Paleta con 12 tonos pigmentados. Acabados mate y brillantes combinados.",
		price: 1890,
		categoryName: "Maquillaje",
		stock: 35,
		isActive: true,
		images: [{ url: "/paleta-sombras-maquillaje.jpg" }],
		variants: [],
	},
	{
		title: "Máscara Capilar Profunda",
		description:
			"Tratamiento intensivo para cabello dañado y reseco. Resultados visibles en una aplicación.",
		price: 1590,
		categoryName: "Cuidado del Cabello",
		stock: 50,
		isActive: true,
		images: [{ url: "/mascara-capilar-tratamiento.jpg" }],
		variants: [],
	},
	{
		title: "Champú Sulfato Free",
		description:
			"Champú suave sin sulfatos. Cuida y nutre el cabello desde la raíz.",
		price: 890,
		categoryName: "Cuidado del Cabello",
		stock: 70,
		isActive: true,
		images: [{ url: "/champu-sin-sulfatos.jpg" }],
		variants: [
			{ name: "Tamaño", value: "250ml" },
			{ name: "Tamaño", value: "500ml" },
		],
	},
	{
		title: "Acondicionador Regenerador",
		description:
			"Acondicionador que repara y suaviza. Ideal para cabello castigado.",
		price: 890,
		categoryName: "Cuidado del Cabello",
		stock: 65,
		isActive: true,
		images: [{ url: "/acondicionador-cabello.jpg" }],
		variants: [],
	},
	{
		title: "Loción Corporal Humectante",
		description:
			"Loción hidratante para todo el cuerpo. Aroma delicado y duradero.",
		price: 1290,
		categoryName: "Cuerpo",
		stock: 80,
		isActive: true,
		images: [{ url: "/locion-corporal-hidratante.jpg" }],
		variants: [],
	},
	{
		title: "Exfoliante Corporal Suave",
		description:
			"Exfoliante con micro esferas. Suave pero efectivo para remover células muertas.",
		price: 1490,
		categoryName: "Cuerpo",
		stock: 45,
		isActive: true,
		images: [{ url: "/exfoliante-corporal.jpg" }],
		variants: [],
	},
	{
		title: "Sérum Antienvejecimiento",
		description:
			"Sérum con retinol y péptidos. Reduce arrugas y firma la piel.",
		price: 3490,
		categoryName: "Tratamientos",
		stock: 30,
		isActive: true,
		images: [{ url: "/serum-antienvejecimiento-retinol.jpg" }],
		variants: [],
	},
];
