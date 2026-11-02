
const STORAGE_KEY = "neozoo-products";

let adminProducts = [];
let selectedImageData = "";

const productList = document.getElementById("admin-product-list");
const newProductBtn = document.getElementById("new-product-btn");
const formSection = document.getElementById("product-form-section");
const productForm = document.getElementById("product-form");
const cancelFormBtn = document.getElementById("cancel-form");

const adminSearch = document.getElementById("admin-search");

const imageInput = document.getElementById("product-image");
const dropZone = document.getElementById("image-drop-zone");
const selectImageBtn = document.getElementById("select-image-btn");
const imagePreview = document.getElementById("image-preview");
const imageFileName = document.getElementById("image-file-name");


// 1. Cargar productos guardados o el catálogo original

async function loadAdminProducts() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEY);

        if (savedProducts !== null) {
            adminProducts = JSON.parse(savedProducts);
        } else {
            const response = await fetch("data/products.json");

            if (!response.ok) {
                throw new Error("No se pudo cargar el catálogo");
            }

            adminProducts = await response.json();
            saveProducts();
        }

        renderAdminProducts();
        updateAdminStats();

    } catch (error) {
        console.error(error);
        productList.textContent = "Error al cargar los productos.";
    }
}


// 2. Guardar productos en el navegador

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}


// 3. Mostrar productos y aplicar el buscador

function renderAdminProducts() {
    productList.innerHTML = "";

    const searchText = adminSearch.value.trim().toLowerCase();

    const filteredProducts = adminProducts.filter(product => {
        const searchableText = `
            ${product.name || ""}
            ${product.category || ""}
            ${product.brand || ""}
        `.toLowerCase();

        return searchableText.includes(searchText);
    });

    if (filteredProducts.length === 0) {
        productList.textContent = "No se encontraron productos.";
        return;
    }

    filteredProducts.forEach(product => {
        const article = document.createElement("article");
        article.className = "admin-product-row";

        article.innerHTML = `
            <div>
                <strong>${product.name || "Sin nombre"}</strong>
                <p>${product.category || "Sin categoría"}</p>
            </div>

            <div>
                <strong>$${Number(product.price || 0).toLocaleString("es-AR")}</strong>
            </div>

            <button
                type="button"
                class="delete-product-btn"
                data-id="${product.id}"
                title="Eliminar producto"
                aria-label="Eliminar ${product.name || "producto"}"
            >×</button>
        `;

        productList.appendChild(article);
    });
}


// 4. Actualizar estadísticas

function updateAdminStats() {
    document.getElementById("total-products").textContent =
        adminProducts.length;

    document.getElementById("available-products").textContent =
        adminProducts.filter(product => Number(product.stock) > 0).length;

    document.getElementById("out-of-stock").textContent =
        adminProducts.filter(product => Number(product.stock) <= 0).length;
}


// 5. Buscador en tiempo real

adminSearch.addEventListener("input", () => {
    renderAdminProducts();
});


// 6. Eliminar productos

productList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-product-btn");

    if (!deleteButton) return;

    const productId = deleteButton.dataset.id;

    const product = adminProducts.find(item =>
        String(item.id) === String(productId)
    );

    if (!product) return;

    const confirmation = confirm(
        `¿Seguro que querés eliminar "${product.name}"?`
    );

    if (!confirmation) return;

    adminProducts = adminProducts.filter(item =>
        String(item.id) !== String(productId)
    );

    saveProducts();
    renderAdminProducts();
    updateAdminStats();
});


// 7. Abrir y cerrar el formulario

newProductBtn.addEventListener("click", () => {
    productForm.reset();
    selectedImageData = "";

    imagePreview.src = "";
    imagePreview.hidden = true;
    imageFileName.textContent = "";

    formSection.hidden = false;
    document.getElementById("form-title").textContent = "Agregar producto";

    formSection.scrollIntoView({ behavior: "smooth" });
});

cancelFormBtn.addEventListener("click", () => {
    formSection.hidden = true;
});


// 8. Seleccionar o arrastrar imágenes

selectImageBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    if (imageInput.files.length > 0) {
        handleImage(imageInput.files[0]);
    }
});

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (file) {
        handleImage(file);
    }
});

function handleImage(file) {
    if (!file.type.startsWith("image/")) {
        alert("Seleccioná un archivo de imagen.");
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("La imagen no puede superar 1 MB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        selectedImageData = reader.result;

        imagePreview.src = selectedImageData;
        imagePreview.hidden = false;

        imageFileName.textContent = file.name;
    };

    reader.readAsDataURL(file);
}


// 9. Agregar productos

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newProduct = {
        id: String(Date.now()),
        name: document.getElementById("product-name").value.trim(),
        brand: document.getElementById("product-brand").value.trim(),
        category: document.getElementById("product-category").value.trim(),
        pet: document.getElementById("product-pet").value.trim(),
        price: Number(document.getElementById("product-price").value),
        stock: Number(document.getElementById("product-stock").value),
        image: selectedImageData,
        description: document.getElementById("product-description").value.trim()
    };

    adminProducts.push(newProduct);

    saveProducts();
    renderAdminProducts();
    updateAdminStats();

    productForm.reset();

    selectedImageData = "";
    imagePreview.src = "";
    imagePreview.hidden = true;
    imageFileName.textContent = "";

    formSection.hidden = true;

    alert("¡Producto agregado correctamente!");
});


// Iniciar administrador

loadAdminProducts();
