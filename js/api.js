
const API_URL = "https://ipickpet.com/api/v1/products";

// Convierte los datos externos al formato de Neo Zoo.
function adaptProduct(product) {

    const originalName = product.title || "Producto sin nombre";

    // Creamos un nombre más corto para las tarjetas.
    const shortName = originalName
        .replace(/dry dog food/gi, "")
        .replace(/dry cat food/gi, "")
        .replace(/recipe/gi, "")
        .trim();

    return {
        id: String(product.id),
        name: shortName,
        originalName: originalName,

        category: product.species?.includes("dog")
            ? "Perros"
            : product.species?.includes("cat")
                ? "Gatos"
                : "Otros",

        // La API no proporciona precios.
        price: null,

        image: product.image?.url ?? "",
        description: product.excerpt || originalName,
        brand: product.brandName || "Sin marca",
        nutrition: product.nutrition || null
    };
}

// Obtiene los productos de la API.
async function getProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        const apiProducts = Array.isArray(data)
            ? data
            : data.products ?? data.data ?? [];

        const adaptedProducts = apiProducts.map(adaptProduct);

        console.log("Productos adaptados:", adaptedProducts);
        console.log("Cantidad:", adaptedProducts.length);
        console.log("Primer producto:", adaptedProducts[0]);

        return adaptedProducts;

    } catch (error) {

        console.error("Error al obtener productos:", error);

        return [];

    }
}

// Dejamos la función disponible para app.js.
window.getProducts = getProducts;
