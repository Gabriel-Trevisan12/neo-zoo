// Cargar productos desde el JSON local.
async function getProducts() {

    try {

        const response = await fetch("data/products.json");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("El catálogo no tiene un formato válido");
        }

        const products = data.map(product => ({

            id: String(product.id),

            name: product.name || product.nombre || "Producto sin nombre",

            category: product.category || product.categoria || "Otros",

            price: product.price ?? product.precio ?? null,

            image: product.image || product.imagen_url || "",

            description: product.description || product.descripcion || "",

            brand: product.brand || product.marca || "Sin marca",

            stock: product.stock ?? 0,

            featured: product.featured ?? product.destacado ?? false,

            pet: product.pet || product.mascota || "Otros",

            sku: product.sku || ""

        }));

        console.log("Catálogo cargado:", products);
        console.log("Cantidad de productos:", products.length);

        return products;

    } catch (error) {

        console.error("Error al cargar el catálogo:", error);

        return [];

    }
}

window.getProducts = getProducts;