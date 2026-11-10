/* =========================================
   NEO ZOO · app.js (todo en un solo archivo)

   Para cambiar productos: editá la lista PRODUCTOS.
   Para cambiar el número de WhatsApp: WHATSAPP_NUMBER.
========================================= */


/* =========================================
   1. CONFIGURACIÓN
========================================= */

const WHATSAPP_NUMBER = "5493364609342";
const CART_KEY = "neozoo-cart";
const DEMO_KEY = "neozoo-demo-productos";
const CATALOGO_KEY = "neozoo-catalogo"; // lo usa el panel de administración


/* =========================================
   2. PRODUCTOS
   Cada producto necesita: id (único), name, category,
   brand, price, image (nombre del archivo en img/), description.
========================================= */

const PRODUCTOS = [
    { id: "1",  name: "Alimento para gato Whiskas",  category: "Gatos",      brand: "Whiskas",   price: 12500, image: "alimento-gato.avif",       stock: 10, sku: "NZ-001", description: "Alimento seco para gatos adultos." },
    { id: "2",  name: "Alimento para perro Pro Plan", category: "Perros",     brand: "Pro Plan",  price: 28900, image: "alimento-perro.avif",      stock: 10, sku: "NZ-002", description: "Alimento balanceado para perros adultos." },
    { id: "3",  name: "Arnés para perro",             category: "Perros",     brand: "Sin marca", price: 15900, image: "arnes-mini.jpg",           stock: 10, sku: "NZ-003", description: "Arnés cómodo y ajustable para paseos." },
    { id: "4",  name: "Collar de cuero",              category: "Perros",     brand: "Sin marca", price: 9800,  image: "collar-cuero.jpg",         stock: 10, sku: "NZ-004", description: "Collar de cuero con hebilla metálica." },
    { id: "5",  name: "Bandeja sanitaria",            category: "Gatos",      brand: "Sin marca", price: 18900, image: "bandeja-sanitaria.webp",   stock: 10, sku: "NZ-005", description: "Bandeja sanitaria fácil de limpiar." },
    { id: "6",  name: "Correa para perro",            category: "Perros",     brand: "Sin marca", price: 7500,  image: "correa-perro.jpg",         stock: 10, sku: "NZ-006", description: "Correa para los paseos diarios." },
    { id: "7",  name: "Pelota de juego",              category: "Perros",     brand: "Sin marca", price: 4900,  image: "pelota-perro.webp",        stock: 10, sku: "NZ-007", description: "Juguete texturado para jugar." },
    { id: "8",  name: "Old Prince Cordero 15 kg",     category: "Perros",     brand: "Old Prince", price: 23500, image: "old-prince-cordero.webp", stock: 10, sku: "NZ-008", description: "Alimento de cordero para perros adultos. Presentación grande." },
    { id: "9",  name: "Old Prince Cordero 3 kg",      category: "Perros",     brand: "Old Prince", price: 9800,  image: "old-prince-3kg.webp",     stock: 10, sku: "NZ-009", description: "Alimento de cordero para perros adultos. Presentación chica." },
    { id: "10", name: "Old Prince Cordero 7,5 kg",    category: "Perros",     brand: "Old Prince", price: 14900, image: "old-prince-7-5kg.webp",   stock: 10, sku: "NZ-010", description: "Alimento de cordero para perros adultos. Presentación mediana." },
    { id: "11", name: "Pedigree Adulto 1 kg",         category: "Perros",     brand: "Pedigree",  price: 6900,  image: "pedigree-1kg.webp",        stock: 10, sku: "NZ-011", description: "Alimento para perros adultos. Presentación chica." },
    { id: "12", name: "Pedigree Adulto 3 kg",         category: "Perros",     brand: "Pedigree",  price: 15900, image: "pedigree-3kg.webp",        stock: 10, sku: "NZ-012", description: "Alimento para perros adultos. Presentación mediana." },
    { id: "13", name: "Pedigree Adulto 8 kg",         category: "Perros",     brand: "Pedigree",  price: 42000, image: "pedigree-8kg.webp",         stock: 10, sku: "NZ-013", description: "Alimento para perros adultos. Presentación grande." },
    { id: "14", name: "Correa para gato",             category: "Gatos",      brand: "Sin marca", price: 6200,  image: "correa-gato.png",          stock: 10, sku: "NZ-014", description: "Correa para paseos de gatos acostumbrados al arnés." },
    { id: "15", name: "Bebedero",                     category: "Accesorios", brand: "Sin marca", price: 8900,  image: "bebedero.avif",            stock: 10, sku: "NZ-015", description: "Bebedero práctico para el día a día." },
    { id: "16", name: "Corta pelo para mascotas",     category: "Accesorios", brand: "Sin marca", price: 39900, image: "peladora-oveja-negra.webp", stock: 10, sku: "NZ-016", description: "Máquina de corte con accesorios." }
];


/* =========================================
   3. FUNCIONES GENERALES
========================================= */

// Imagen de respaldo para productos sin foto (se genera en el código, no hace falta archivo)
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e7f1df"/><stop offset="1" stop-color="#d9efb2"/>
  </linearGradient></defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#246b45">Foto próximamente</text>
</svg>`;
const PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(PLACEHOLDER_SVG);

// Si una imagen no carga, muestra el respaldo en vez de un recuadro roto
document.addEventListener("error", (e) => {
    if (e.target.tagName === "IMG" && !e.target.dataset.fallback) {
        e.target.dataset.fallback = "1";
        e.target.src = PLACEHOLDER;
    }
}, true);

const money = (value) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
}).format(value);

const priceLabel = (price) => price == null ? "Precio a definir" : money(price);

// Devuelve la ruta correcta de la imagen
function getImageUrl(image) {
    if (!image) return PLACEHOLDER;
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return `img/${image}`;
}

// Quita acentos y mayúsculas para buscar
function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}


/* =========================================
   4. CATÁLOGO (base + productos de prueba)
========================================= */

function getDemoProducts() {
    try {
        return JSON.parse(sessionStorage.getItem(DEMO_KEY) || "[]");
    } catch {
        return [];
    }
}

function setDemoProducts(lista) {
    try {
        sessionStorage.setItem(DEMO_KEY, JSON.stringify(lista));
        return true;
    } catch {
        return false;
    }
}

// Catálogo base: el guardado desde el panel si existe, si no PRODUCTOS
function getBaseProducts() {
    try {
        const saved = localStorage.getItem(CATALOGO_KEY);
        if (saved !== null) {
            const data = JSON.parse(saved);
            if (Array.isArray(data)) return data;
        }
    } catch (error) {
        console.error("Error al leer el catálogo guardado:", error);
    }
    return PRODUCTOS;
}

function getAllProducts() {
    return [...getBaseProducts(), ...getDemoProducts()];
}

function refreshCatalog() {
    window.dispatchEvent(new Event("productos-actualizados"));
}


/* =========================================
   5. CARRITO
========================================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch { /* sin espacio o navegación privada */ }
    updateCount();
}

function updateCount() {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll("#cart-count, [data-contador]").forEach((el) => {
        if (el.textContent !== String(total)) {
            el.textContent = total;
            el.classList.remove("bump");
            void el.offsetWidth; // reinicia la animación
            el.classList.add("bump");
        }
    });
}

function addToCart(id, quantity = 1) {
    const cart = getCart();
    const found = cart.find((item) => item.id === id);

    if (found) {
        found.quantity += quantity;
    } else {
        cart.push({ id, quantity });
    }

    saveCart(cart);
}

function changeCartQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.quantity = Math.max(0, item.quantity + delta);
    saveCart(cart.filter((i) => i.quantity > 0));
}

function removeFromCart(id) {
    saveCart(getCart().filter((i) => i.id !== id));
}


/* =========================================
   6. TARJETAS DE PRODUCTOS
========================================= */

function productCard(product, index = 0) {
    const id = encodeURIComponent(product.id);
    const sinStock = Number(product.stock) <= 0;

    return `
        <article class="product-card" style="--i:${index}">
            <a href="producto.html?id=${id}">
                <div class="product-image">
                    <img src="${getImageUrl(product.image)}" alt="${product.name}" loading="lazy">
                </div>
            </a>

            <div class="product-info">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">${priceLabel(product.price)}</p>

                <div class="card-actions">
                    <a class="small-btn" href="producto.html?id=${id}">Ver detalle</a>
                    <button class="small-btn add" data-add="${product.id}" ${sinStock ? "disabled" : ""}>${sinStock ? "Sin stock" : "Agregar"}</button>
                </div>
            </div>
        </article>`;
}


/* =========================================
   7. PÁGINA PRINCIPAL (index.html)
========================================= */

function initHome() {
    const grid = document.getElementById("product-grid");
    const filters = document.getElementById("filters");
    if (!grid || !filters) return;

    const searchInput = document.getElementById("search-input");
    let activeCategory = "Todos";
    let searchTerm = "";

    function renderFilters() {
        const categories = ["Todos", ...new Set(getAllProducts().map((p) => p.category))];

        filters.innerHTML = categories.map((c) => `
            <button class="filter ${c === activeCategory ? "active" : ""}" data-filter="${c}">${c}</button>
        `).join("");
    }

    function renderProducts() {
        const lista = getAllProducts().filter((p) => {
            const coincideCategoria = activeCategory === "Todos" || p.category === activeCategory;
            const texto = normalizeText(`${p.name} ${p.category} ${p.description || ""}`);
            return coincideCategoria && texto.includes(searchTerm);
        });

        grid.innerHTML = lista.length
            ? lista.map(productCard).join("")
            : `<div class="empty"><h3>No encontramos productos</h3><p>Probá con otro nombre o categoría.</p></div>`;
    }

    function render() {
        renderFilters();
        renderProducts();
    }

    filters.addEventListener("click", (e) => {
        const boton = e.target.closest("[data-filter]");
        if (!boton) return;
        activeCategory = boton.dataset.filter;
        render();
    });

    searchInput?.addEventListener("input", (e) => {
        searchTerm = normalizeText(e.target.value);
        renderProducts();
    });

    grid.addEventListener("click", (e) => {
        const boton = e.target.closest("[data-add]");
        if (!boton) return;

        addToCart(boton.dataset.add);
        boton.textContent = "¡Agregado!";
        boton.classList.add("ok");

        setTimeout(() => {
            boton.textContent = "Agregar";
            boton.classList.remove("ok");
        }, 900);
    });

    window.addEventListener("productos-actualizados", render);
    render();
}


/* =========================================
   8. PÁGINA DE PRODUCTO (producto.html)
========================================= */

function initProduct() {
    const root = document.getElementById("product-detail");
    if (!root) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const product = getAllProducts().find((p) => p.id === id);

    if (!product) {
        root.innerHTML = `
            <div class="empty">
                <h2>Producto no encontrado</h2>
                <a class="primary" href="index.html">Volver a la tienda</a>
            </div>`;
        return;
    }

    document.title = `${product.name} | Neo Zoo`;

    root.innerHTML = `
        <section class="detail">
            <div class="detail-image">
                <img src="${getImageUrl(product.image)}" alt="${product.name}">
            </div>

            <div class="detail-copy">
                <span class="category">${product.category}</span>
                <h1>${product.name}</h1>
                <p class="price">${priceLabel(product.price)}</p>
                <p class="description">${product.description}</p>

                <div class="qty">
                    <button id="minus" aria-label="Restar">−</button>
                    <span id="qty">1</span>
                    <button id="plus" aria-label="Sumar">+</button>
                </div>

                <button class="primary" id="add-detail">Agregar al carrito</button>

                <p class="description">Pedido y coordinación de entrega por WhatsApp.</p>
            </div>
        </section>`;

    let quantity = 1;
    const display = root.querySelector("#qty");

    root.querySelector("#minus").onclick = () => {
        quantity = Math.max(1, quantity - 1);
        display.textContent = quantity;
    };

    root.querySelector("#plus").onclick = () => {
        quantity = Math.min(99, quantity + 1);
        display.textContent = quantity;
    };

    root.querySelector("#add-detail").onclick = () => {
        addToCart(product.id, quantity);
        window.location.href = "carrito.html";
    };
}


/* =========================================
   9. PÁGINA DEL CARRITO (carrito.html)
========================================= */

function initCart() {
    const root = document.getElementById("cart-content");
    if (!root) return;

    function render() {
        const cart = getCart();
        const productos = getAllProducts();

        const rows = cart.map((item) => {
            const product = productos.find((p) => p.id === item.id);
            if (!product) return "";

            const subtotal = product.price == null
                ? "A coordinar"
                : money(product.price * item.quantity);

            return `
                <article class="cart-row">
                    <img src="${getImageUrl(product.image)}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${priceLabel(product.price)} por unidad</p>
                        <div class="cart-controls">
                            <button data-dec="${item.id}">−</button>
                            <span>${item.quantity}</span>
                            <button data-inc="${item.id}">+</button>
                            <button class="remove" data-remove="${item.id}">Eliminar</button>
                        </div>
                    </div>
                    <strong>${subtotal}</strong>
                </article>`;
        }).join("");

        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (!totalQuantity) {
            root.innerHTML = `
                <div class="cart-panel empty">
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Hay muchas cosas para tu mascota!</p>
                    <a class="primary" href="index.html#productos">Ver productos</a>
                </div>`;
            return;
        }

        const hayPrecioPendiente = cart.some((item) => {
            const product = productos.find((p) => p.id === item.id);
            return product && product.price == null;
        });

        const total = cart.reduce((sum, item) => {
            const product = productos.find((p) => p.id === item.id);
            return sum + (product && product.price != null ? product.price * item.quantity : 0);
        }, 0);

        root.innerHTML = `
            <div class="cart-layout">
                <section class="cart-panel">${rows}</section>

                <aside class="summary">
                    <h2>Resumen</h2>
                    <div class="summary-line"><span>Productos</span><strong>${totalQuantity}</strong></div>
                    <div class="summary-line"><span>Total</span><strong>${hayPrecioPendiente ? "A coordinar" : money(total)}</strong></div>
                    <button class="primary" id="checkout">Enviar pedido por WhatsApp</button>
                    <p class="description">El envío y los medios de pago se coordinan al confirmar el pedido.</p>
                </aside>
            </div>`;

        root.querySelectorAll("[data-inc]").forEach((b) => b.onclick = () => { changeCartQuantity(b.dataset.inc, 1); render(); });
        root.querySelectorAll("[data-dec]").forEach((b) => b.onclick = () => { changeCartQuantity(b.dataset.dec, -1); render(); });
        root.querySelectorAll("[data-remove]").forEach((b) => b.onclick = () => { removeFromCart(b.dataset.remove); render(); });

        root.querySelector("#checkout").onclick = () => {
            const lineas = cart
                .map((item) => {
                    const product = productos.find((p) => p.id === item.id);
                    if (!product) return "";
                    const precio = product.price == null
                        ? "Precio a coordinar"
                        : money(product.price * item.quantity);
                    return `${product.name} x ${item.quantity} — ${precio}`;
                })
                .filter(Boolean);

            const mensaje = `Hola Neo Zoo, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal estimado: ${hayPrecioPendiente ? "A coordinar" : money(total)}`;

            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, "_blank");
        };
    }

    render();
}


/* =========================================
   10. PRODUCTOS DE PRUEBA (formulario de index.html)
   Se guardan en sessionStorage: solo en esta pestaña.
========================================= */

// Reduce la foto para que ocupe poco espacio
function leerFoto(file) {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith("image/")) return resolve("");

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                const max = 500;
                const escala = Math.min(1, max / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * escala);
                canvas.height = Math.round(img.height * escala);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };

            img.onerror = () => resolve("");
            img.src = reader.result;
        };

        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
    });
}

function iniciarFormularioDemo() {
    const form = document.getElementById("form-demo");
    if (!form) return;

    const msg = document.getElementById("demo-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = new FormData(form);
        const nombre = String(datos.get("nombre") || "").trim();

        if (!nombre) {
            msg.textContent = "Poné un nombre para el producto.";
            return;
        }

        const imagen = await leerFoto(datos.get("foto"));

        if (!imagen) {
            msg.textContent = "Subí una foto para el producto.";
            return;
        }

        const precioTexto = String(datos.get("precio") || "").trim();

        const producto = {
            id: "demo-" + Date.now(),
            name: nombre,
            category: String(datos.get("categoria") || "Otros"),
            brand: "Sin marca",
            price: precioTexto === "" ? null : Math.max(0, Math.round(Number(precioTexto))),
            image: imagen,
            description: String(datos.get("descripcion") || "").trim() || "Producto de prueba creado desde la página."
        };

        if (!setDemoProducts([...getDemoProducts(), producto])) {
            msg.textContent = "No hay espacio para guardar. Probá con una foto más chica.";
            return;
        }

        form.reset();
        msg.textContent = `"${nombre}" ya aparece en el catálogo.`;
        refreshCatalog();
        document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("borrar-demo")?.addEventListener("click", () => {
        setDemoProducts([]);
        msg.textContent = "Se borraron los productos de prueba.";
        refreshCatalog();
    });
}


/* =========================================
   11. INICIALIZACIÓN
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateCount();

    // Quita del carrito los productos de prueba que ya no existen
    const carritoActual = getCart();
    const carritoValido = carritoActual.filter((i) => getAllProducts().some((p) => p.id === i.id));
    if (carritoValido.length !== carritoActual.length) saveCart(carritoValido);

    // Sombra del header al hacer scroll
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        header?.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });

    initHome();
    initProduct();
    initCart();
    iniciarFormularioDemo();
});