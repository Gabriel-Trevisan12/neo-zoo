# Neo Zoo — versión simplificada

Proyecto de tienda web estática hecho con HTML, CSS y JavaScript. No necesita PHP ni base de datos para esta primera versión.

## Páginas
- `index.html`: catálogo y filtros por categoría.
- `producto.html?id=1`: detalle de producto.
- `carrito.html`: carrito persistente con LocalStorage y pedido por WhatsApp.

## Cómo ejecutarlo
Abrí la carpeta en Visual Studio Code y ejecutá `index.html` con la extensión **Live Server**. También podés abrir `index.html` directamente en el navegador.

## Personalizar productos
Editá `js/products.js`. Los precios incluidos son valores de demostración y deben reemplazarse por los precios reales de Neo Zoo. Las imágenes reutilizan recursos del proyecto original.

## Nota
El carrito se guarda en el navegador mediante `localStorage`. Esta versión no procesa pagos ni reserva stock en un servidor. El pedido se envía a WhatsApp para coordinar la compra.
