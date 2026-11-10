/* =========================================
   NEO ZOO · admin.js (panel de administración)

   Usa PRODUCTOS, getBaseProducts(), CATALOGO_KEY y getImageUrl()
   de js/app.js, que tiene que cargarse antes que este archivo.
========================================= */

let catalogo = [];
let editingId = null;
let selectedImageData = "";

const productList = document.getElementById("admin-product-list");
const adminSearch = document.getElementById("admin-search");
const newProductBtn = document.getElementById("new-product-btn");
const restoreBtn = document.getElementById("restore-btn");
const formSection = document.getElementById("product-form-section");
const formTitle = document.getElementById("form-title");
const productForm = document.getElementById("product-form");
const cancelFormBtn = document.getElementById("cancel-form");

const imageInput = document.getElementById("product-image");
const dropZone = document.getElementById("image-drop-zone");
const selectImageBtn = document.getElementById("select-image-btn");
const imagePreview = document.getElementById("image-preview");
const imageFileName = document.getElementById("image-file-name");


/* 1. Datos */

// Escapa texto para mostrarlo dentro del HTML
function esc(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
}

// Código visible del producto (si no tiene, se genera a partir del id)
function codigoDe(producto) {
    return producto.sku || "NZ-" + String(producto.id).padStart(3, "0");
}

// Próximo id numérico disponible
function siguienteId() {
    const mayor = Math.max(0, ...catalogo.map((p) => Number(p.id) || 0));
    return String(mayor + 1);
}

function cargarCatalogo() {
    catalogo = getBaseProducts().map((p) => ({ ...p }));
}

function guardarCatalogo() {
    try {
        localStorage.setItem(CATALOGO_KEY, JSON.stringify(catalogo));
        return true;
    } catch {
        alert("No se pudo guardar en este navegador.");
        return false;
    }
}


/* 2. Tabla y estadísticas */

function renderTabla() {
    const texto = adminSearch.value.trim().toLowerCase();

    const lista = catalogo.filter((p) =>
        `${p.name} ${p.sku || ""} ${p.category || ""} ${p.brand || ""}`
            .toLowerCase()
            .includes(texto)
    );

    if (lista.length === 0) {
        productList.innerHTML = `<p class="admin-vacio">No se encontraron productos.</p>`;
        return;
    }

    productList.innerHTML = lista.map((p) => {
        const stock = Number(p.stock) || 0;

        return `
            <article class="admin-row">
                <div>
                    <strong>${esc(p.name)}</strong>
                    <small>${esc(p.category)} · ${esc(p.brand || "Sin marca")}</small>
                </div>

                <span class="col-codigo">${esc(codigoDe(p))}</span>

                <span class="col-stock ${stock <= 0 ? "sin-stock" : ""}">
                    ${stock <= 0 ? "Sin stock" : stock}
                </span>

                <span class="col-precio">${p.price == null ? "A definir" : "$" + Number(p.price).toLocaleString("es-AR")}</span>

                <div class="admin-actions">
                    <button type="button" class="editar" data-edit="${esc(p.id)}">Editar</button>
                    <button type="button" class="eliminar" data-delete="${esc(p.id)}">Eliminar</button>
                </div>
            </article>`;
    }).join("");
}

function actualizarStats() {
    document.getElementById("total-products").textContent = catalogo.length;
    document.getElementById("available-products").textContent =
        catalogo.filter((p) => Number(p.stock) > 0).length;
    document.getElementById("out-of-stock").textContent =
        catalogo.filter((p) => Number(p.stock) <= 0).length;
}

function refrescar() {
    renderTabla();
    actualizarStats();
}


/* 3. Formulario (agregar y editar) */

function mostrarImagenActual(src) {
    imagePreview.src = src;
    imagePreview.hidden = !src;
}

function abrirFormulario(producto = null) {
    productForm.reset();
    editingId = producto ? String(producto.id) : null;
    selectedImageData = "";

    if (producto) {
        document.getElementById("product-name").value = producto.name || "";
        document.getElementById("product-sku").value = producto.sku || codigoDe(producto);
        document.getElementById("product-brand").value = producto.brand || "";
        document.getElementById("product-category").value = producto.category || "";
        document.getElementById("product-price").value = producto.price ?? "";
        document.getElementById("product-stock").value = producto.stock ?? 0;
        document.getElementById("product-description").value = producto.description || "";
        mostrarImagenActual(getImageUrl(producto.image));
        imageFileName.textContent = producto.image && !producto.image.startsWith("data:") ? producto.image : "";
        formTitle.textContent = "Editar producto";
    } else {
        mostrarImagenActual("");
        imageFileName.textContent = "";
        formTitle.textContent = "Agregar producto";
    }

    formSection.hidden = false;
    formSection.scrollIntoView({ behavior: "smooth" });
}

function cerrarFormulario() {
    formSection.hidden = true;
    editingId = null;
}

function leerImagen(file) {
    if (!file.type.startsWith("image/")) {
        alert("Seleccioná un archivo de imagen.");
        return;
    }

    // leerFoto() viene de app.js: reduce la imagen antes de guardarla
    leerFoto(file).then((data) => {
        if (!data) {
            alert("No se pudo leer la imagen.");
            return;
        }

        selectedImageData = data;
        mostrarImagenActual(data);
        imageFileName.textContent = file.name;
    });
}


/* 4. Eventos */

adminSearch.addEventListener("input", renderTabla);

newProductBtn.addEventListener("click", () => abrirFormulario());

cancelFormBtn.addEventListener("click", cerrarFormulario);

// Botones Editar y Eliminar de cada fila
productList.addEventListener("click", (e) => {
    const editar = e.target.closest("[data-edit]");
    const eliminar = e.target.closest("[data-delete]");

    if (editar) {
        const producto = catalogo.find((p) => String(p.id) === editar.dataset.edit);
        if (producto) abrirFormulario(producto);
        return;
    }

    if (eliminar) {
        const producto = catalogo.find((p) => String(p.id) === eliminar.dataset.delete);
        if (!producto) return;

        if (!confirm(`¿Seguro que querés eliminar "${producto.name}"?`)) return;

        catalogo = catalogo.filter((p) => String(p.id) !== String(producto.id));
        guardarCatalogo();
        refrescar();

        if (editingId === String(producto.id)) cerrarFormulario();
    }
});

// Volver al catálogo original (el de app.js)
restoreBtn.addEventListener("click", () => {
    if (!confirm("¿Restaurar el catálogo original? Se pierden los cambios hechos en este navegador.")) return;

    localStorage.removeItem(CATALOGO_KEY);
    cargarCatalogo();
    refrescar();
    cerrarFormulario();
});

// Imagen: botón o arrastrar y soltar
selectImageBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
    if (imageInput.files.length > 0) leerImagen(imageInput.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    if (e.dataTransfer.files[0]) leerImagen(e.dataTransfer.files[0]);
});

// Guardar: crea uno nuevo o actualiza el que se está editando
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo = document.getElementById("product-sku").value.trim();

    const repetido = catalogo.some((p) =>
        String(p.id) !== editingId && codigo && (p.sku || "") === codigo
    );

    if (repetido) {
        alert("Ya existe un producto con ese código.");
        return;
    }

    const existente = editingId ? catalogo.find((p) => String(p.id) === editingId) : null;

    const datos = {
        name: document.getElementById("product-name").value.trim(),
        sku: codigo,
        brand: document.getElementById("product-brand").value.trim() || "Sin marca",
        category: document.getElementById("product-category").value.trim(),
        price: Number(document.getElementById("product-price").value),
        stock: Number(document.getElementById("product-stock").value),
        image: selectedImageData || (existente ? existente.image : ""),
        description: document.getElementById("product-description").value.trim()
    };

    if (existente) {
        Object.assign(existente, datos);
    } else {
        catalogo.push({ id: siguienteId(), ...datos });
    }

    if (!guardarCatalogo()) return;

    refrescar();
    cerrarFormulario();
});


/* 5. Inicio */

cargarCatalogo();
refrescar();