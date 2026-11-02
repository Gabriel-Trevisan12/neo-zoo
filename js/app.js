
/* =========================================
   1. CONFIGURACIÓN Y DATOS
========================================= */

// Catálogo de productos
let PRODUCTS = window.NEOZOO_PRODUCTS || [];

// Número de WhatsApp del negocio
const WHATSAPP_NUMBER = "5493413539527";

// Clave del carrito en LocalStorage
const CART_KEY = "neozoo-cart";


/* =========================================
   2. FUNCIONES GENERALES
========================================= */

// Formatear precios en pesos argentinos
const money = value => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(value);
};
// Obtener la dirección correcta de la imagen.
function getImageUrl(image) {

    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `img/${image}`;
}


// Mostrar el precio o indicar que todavía no está definido.
function getPriceLabel(price) {

    return price == null
        ? "Precio a definir"
        : money(price);
}


// Obtener carrito guardado
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
}


// Guardar carrito
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCount();
}


// Actualizar contador del carrito
function updateCount() {
    const el = document.getElementById("cart-count");

    if (!el) return;

    const total = getCart().reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    el.textContent = total;
}


// Normalizar texto para búsquedas
// Permite buscar sin importar mayúsculas o acentos
function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


/* =========================================
   3. FUNCIONES DEL CARRITO
========================================= */

// Agregar producto al carrito
function addToCart(id, quantity = 1) {

    const cart = getCart();

    const found = cart.find(item => item.id === id);

    if (found) {
        found.quantity += quantity;
    } else {
        cart.push({
            id,
            quantity
        });
    }

    saveCart(cart);
}


// Modificar cantidad de un producto
function changeCartQuantity(id, delta) {

    const cart = getCart();

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity = Math.max(0, item.quantity + delta);

    const updatedCart = cart.filter(item => item.quantity > 0);

    saveCart(updatedCart);
}


// Eliminar producto del carrito
function removeFromCart(id) {

    const updatedCart = getCart().filter(item => {
        return item.id !== id;
    });

    saveCart(updatedCart);
}


/* =========================================
   4. TARJETAS DE PRODUCTOS
========================================= */

// Generar tarjeta individual
function productCard(product) {

    return `
        <article class="product-card">

            <a href="producto.html?id=${encodeURIComponent(product.id)}">

                <div class="product-image">

                    <img
                        src="${getImageUrl(product.image)}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>

            </a>


            <div class="product-info">

                <span class="category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="price">
                    ${getPriceLabel(product.price)}
                </p>


                <div class="card-actions">

                    <a
                        class="small-btn"
                        href="producto.html?id=${encodeURIComponent(product.id)}"
                    >
                        Ver detalle
                    </a>

                    <button
                        class="small-btn add"
                        data-add="${product.id}"
                    >
                        Agregar
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================
   5. PÁGINA PRINCIPAL Y CATÁLOGO
========================================= */

function initHome() {

    const grid = document.getElementById("product-grid");

    if (!grid) return;


    // Elementos del HTML
    const filters = document.getElementById("filters");
    const searchInput = document.getElementById("search-input");


    // Obtener categorías disponibles
    const categories = [
        "Todos",
        ...new Set(PRODUCTS.map(product => product.category))
    ];


    // Estados del catálogo
    let activeCategory = "Todos";
    let searchTerm = "";


    // Mostrar filtros
    function renderFilters() {

        filters.innerHTML = categories.map(category => {

            return `
                <button
                    class="filter ${category === activeCategory ? "active" : ""}"
                    data-filter="${category}"
                >
                    ${category}
                </button>
            `;

        }).join("");
    }


    // Mostrar productos filtrados
    function renderProducts() {

        const filteredProducts = PRODUCTS.filter(product => {

            // Comprobar categoría
            const matchesCategory =
                activeCategory === "Todos" ||
                product.category === activeCategory;


            // Comprobar búsqueda
            const searchableText = normalizeText(
                `${product.name} ${product.category} ${product.description || ""}`
            );

            const matchesSearch =
                searchableText.includes(searchTerm);


            return matchesCategory && matchesSearch;

        });


        // Mostrar resultados
        if (filteredProducts.length > 0) {

            grid.innerHTML = filteredProducts
                .map(productCard)
                .join("");

        } else {

            grid.innerHTML = `
                <div class="empty">

                    <h3>No encontramos productos</h3>

                    <p>
                        Probá con otro nombre o categoría.
                    </p>

                </div>
            `;
        }

    }


    // Actualizar catálogo completo
    function render() {
        renderFilters();
        renderProducts();
    }


    // Evento de filtros
    filters.addEventListener("click", event => {

        const button = event.target.closest("[data-filter]");

        if (!button) return;

        activeCategory = button.dataset.filter;

        render();
    });


    // Evento del buscador
    if (searchInput) {

        searchInput.addEventListener("input", event => {

            searchTerm = normalizeText(event.target.value);

            renderProducts();

        });

    }


    // Evento para agregar productos
    grid.addEventListener("click", event => {

        const button = event.target.closest("[data-add]");

        if (!button) return;

        addToCart(button.dataset.add);

        button.textContent = "¡Agregado!";

        setTimeout(() => {
            button.textContent = "Agregar";
        }, 900);

    });


    // Primera carga
    render();
}


/* =========================================
   6. PÁGINA DE INFORMACIÓN DEL PRODUCTO
========================================= */

function initProduct() {

    const root = document.getElementById("product-detail");

    if (!root) return;


    // Obtener ID desde la URL
    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");


    // Buscar producto
    const product = PRODUCTS.find(item => item.id === id);


    // Si no existe el producto
    if (!product) {

        root.innerHTML = `
            <div class="empty">

                <h2>Producto no encontrado</h2>

                <a class="primary" href="index.html">
                    Volver a la tienda
                </a>

            </div>
        `;

        return;
    }


    // Mostrar información del producto
    root.innerHTML = `

        <section class="detail">

            <div class="detail-image">

                <img
                    src="${getImageUrl(product.image)}"
                    alt="${product.name}"
                >

            </div>


            <div class="detail-copy">

                <span class="category">
                    ${product.category}
                </span>

                <h1>
                    ${product.name}
                </h1>

                <p class="price">
                    ${getPriceLabel(product.price)}
                </p>

                <p class="description">
                    ${product.description}
                </p>


                <!-- Selector de cantidad -->

                <div class="qty">

                    <button id="minus" aria-label="Restar">
                        −
                    </button>

                    <span id="qty">1</span>

                    <button id="plus" aria-label="Sumar">
                        +
                    </button>

                </div>


                <button class="primary" id="add-detail">
                    Agregar al carrito
                </button>

                <p class="description">
                    Pedido y coordinación de entrega por WhatsApp.
                </p>

            </div>

        </section>
    `;


    // Control de cantidad
    let quantity = 1;

    const display = root.querySelector("#qty");


    // Restar cantidad
    root.querySelector("#minus").onclick = () => {

        quantity = Math.max(1, quantity - 1);

        display.textContent = quantity;

    };


    // Sumar cantidad
    root.querySelector("#plus").onclick = () => {

        quantity = Math.min(99, quantity + 1);

        display.textContent = quantity;

    };


    // Agregar producto y abrir carrito
    root.querySelector("#add-detail").onclick = () => {

        addToCart(product.id, quantity);

        window.location.href = "carrito.html";

    };

}


/* =========================================
   7. PÁGINA DEL CARRITO
========================================= */

function initCart() {

    const root = document.getElementById("cart-content");

    if (!root) return;


    // Renderizar carrito

function render() {

    const cart = getCart();

    // Generar filas de productos
    const rows = cart.map(item => {

        const product = PRODUCTS.find(p => p.id === item.id);

        if (!product) return "";

        const subtotal = product.price == null
            ? "A coordinar"
            : money(product.price * item.quantity);

        return `
            <article class="cart-row">

                <img
                    src="${getImageUrl(product.image)}"
                    alt="${product.name}"
                >

                <div>

                    <h3>${product.name}</h3>

                    <p>
                        ${getPriceLabel(product.price)} por unidad
                    </p>

                    <div class="cart-controls">

                        <button data-dec="${product.id}">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button data-inc="${product.id}">
                            +
                        </button>

                        <button
                            class="remove"
                            data-remove="${product.id}"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

                <strong>${subtotal}</strong>

            </article>
        `;

    }).join("");


    // Calcular total
    const total = cart.reduce((sum, item) => {

        const product = PRODUCTS.find(p => p.id === item.id);

        return sum + (
            product && product.price != null
                ? product.price * item.quantity
                : 0
        );

    }, 0);


    // Comprobar si hay productos sin precio
    const hasUndefinedPrices = cart.some(item => {

        const product = PRODUCTS.find(p => p.id === item.id);

        return product && product.price == null;

    });


    // Calcular cantidad de productos
    const totalQuantity = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);


    // Carrito vacío
    if (!cart.length || !totalQuantity) {

        root.innerHTML = `

            <div class="cart-panel empty">

                <h2>Tu carrito está vacío</h2>

                <p>
                    ¡Hay muchas cosas para tu mascota!
                </p>

                <a class="primary" href="index.html#productos">
                    Ver productos
                </a>

            </div>

        `;

        return;
    }


    // Mostrar carrito y resumen
    root.innerHTML = `

        <div class="cart-layout">

            <section class="cart-panel">

                ${rows}

            </section>

            <aside class="summary">

                <h2>Resumen</h2>

                <div class="summary-line">

                    <span>Productos</span>

                    <strong>${totalQuantity}</strong>

                </div>

                <div class="summary-line">

                    <span>Total</span>

                    <strong>
                        ${hasUndefinedPrices
                            ? "A coordinar"
                            : money(total)}
                    </strong>

                </div>

                <button class="primary" id="checkout">
                    Enviar pedido por WhatsApp
                </button>

                <p class="description">
                    El envío y los medios de pago se coordinan
                    al confirmar el pedido.
                </p>

            </aside>

        </div>

    `;


    // Eventos de los botones
    root.querySelectorAll("[data-inc]").forEach(button => {

        button.onclick = () => {
            changeCartQuantity(button.dataset.inc, 1);
            render();
        };

    });


    root.querySelectorAll("[data-dec]").forEach(button => {

        button.onclick = () => {
            changeCartQuantity(button.dataset.dec, -1);
            render();
        };

    });


    root.querySelectorAll("[data-remove]").forEach(button => {

        button.onclick = () => {
            removeFromCart(button.dataset.remove);
            render();
        };

    });


    // Finalizar pedido por WhatsApp
    root.querySelector("#checkout").onclick = () => {

        const lines = cart.map(item => {

            const product = PRODUCTS.find(p => p.id === item.id);

            if (!product) return "";

            const priceText = product.price == null
                ? "Precio a coordinar"
                : money(product.price * item.quantity);

            return `${product.name} x ${item.quantity} — ${priceText}`;

        }).filter(Boolean);


        const totalText = hasUndefinedPrices
            ? "A coordinar"
            : money(total);


        const message = `
Hola Neo Zoo, quiero hacer este pedido:

${lines.join("\n")}

Total estimado: ${totalText}
        `.trim();


        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");

    };

}



    // Primera carga del carrito
    render();

}


/* =========================================
   8. INICIALIZACIÓN DE LA APLICACIÓN
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

    updateCount();

    try {
        const response = await fetch("data/products.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar el catálogo");
        }

        PRODUCTS = await response.json();

        console.log("Catálogo local cargado:", PRODUCTS);
        console.log("Cantidad de productos:", PRODUCTS.length);

    } catch (error) {
        console.error("Error al cargar productos:", error);
        PRODUCTS = [];
    }

    initHome();
    initProduct();
    initCart();

});