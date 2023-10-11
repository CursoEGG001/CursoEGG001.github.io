
const form = document.getElementById('form');
const productList = document.getElementById('listado-productos');
const addProductBtn = document.getElementById('suma-producto');
const unitSelect = document.getElementById('unidad-medida');
const deleteListBtn = document.getElementById('borra-lista');
const elemProducto = document.getElementById('producto')
var producto = elemProducto.value;
var precioUnidad = document.getElementById('precio-unidad');
var cantidadUnidad = document.getElementById('cantidad-unidad');
var unit = document.getElementById('unidad-medida').value;
const totalPrice = 0;

var productPrices = productList.querySelectorAll('.precio-producto');

unitSelect.addEventListener('change', updateLabels);

function updateLabels() {
    const unit = unitSelect.value;
    const pesoEtiqueta = document.querySelector('label[for="cantidad-unidad"]');
    const precioEtiqueta = document.querySelector('label[for="precio-unidad"]');

    if (unit === 'g') {
        pesoEtiqueta.textContent = 'Peso (gr.):';
        precioEtiqueta.textContent = 'Precio por kg:';
    } else if (unit === 'kg') {
        pesoEtiqueta.textContent = 'Peso ( kg ):';
        precioEtiqueta.textContent = 'Precio por kg:';
    } else if (unit === 'unit') {
        pesoEtiqueta.textContent = 'Cantidad:';
        precioEtiqueta.textContent = 'Precio por unidad:';
    }
}

function BorraLista() {
    const confirmDelete = confirm('¿Está seguro que desea borrar la lista?');
    if (confirmDelete) {
        productList.innerHTML = '';
        totalText.textContent = '';
    }
}
deleteListBtn.addEventListener('click', () => {
    BorraLista();
});

function VerificaUnidad() {
    let total = 0;
    switch (unit) {
        case "g":
            total = cantidadUnidad.value * precioUnidad.value / 1000;
            break;
        case "kg", "unit":
            total = cantidadUnidad.value * precioUnidad.value;
            break;
        default:
            break;
    }
    return total
}

addProductBtn.addEventListener('click', () => {
    unit = document.getElementById('unidad-medida').value;
    producto = document.getElementById('producto');
    precioUnidad = document.getElementById('precio-unidad');
    cantidadUnidad = document.getElementById('cantidad-unidad');
    let total = VerificaUnidad();
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="nombre-producto">${producto.value}</span><span class="precio-producto">$ ${parseFloat(total).toFixed(2)}</span>`;
    productList.appendChild(listItem);
    form.reset();
    updateLabels();
    if (totalText !== null)
        totalText.textContent = "";

});

const sumBtn = document.createElement('button');
const totalText = document.createElement('h2');
totalText.setAttribute('class', 'suma-total');
sumBtn.textContent = 'Sumar todo';
productList.insertAdjacentElement('afterend', sumBtn);
sumBtn.insertAdjacentElement('afterend', totalText);
sumBtn.addEventListener('click', () => {

    productPrices = productList.querySelectorAll('.precio-producto');
    let total = 0;
    productPrices.forEach(price => {
        total += parseFloat(price.textContent.slice(1));
    });
    totalText.textContent = `Total: $${total.toFixed(2)}`;

});
elemProducto.addEventListener('input', console.log(`Cambio producto a ${elemProducto.value}`));
