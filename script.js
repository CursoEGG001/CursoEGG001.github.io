
const form = document.getElementById('form');
const productList = document.getElementById('listado-productos');
const addProductBtn = document.getElementById('suma-producto');
const unitSelect = document.getElementById('unidad-medida');
const deleteListBtn = document.getElementById('borra-lista');
const elemProducto = document.getElementById('producto');
const totalPrice = 0;

var productPrices = productList.querySelectorAll('.precio-producto');

unitSelect.addEventListener('change', updateLabels);

function updateLabels() {
    const unit = unitSelect.value;
    const pesoEtiqueta = document.querySelector('label[for="cantidad-unidad"]');
    const precioEtiqueta = document.querySelector('label[for="precio-unidad"]');

    switch (unit) {
        case 'g':
            pesoEtiqueta.textContent = 'Peso (gr.):';
            precioEtiqueta.textContent = 'Precio por kg:';
            break;
        case 'kg':
            pesoEtiqueta.textContent = 'Peso ( kg ):';
            precioEtiqueta.textContent = 'Precio por kg:';
            break;
        case 'unit':
            pesoEtiqueta.textContent = 'Cantidad:';
            precioEtiqueta.textContent = 'Precio por unidad:';
            break;
        default:
            console.log('Unidad no válida');
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

function CalcularPrecio(cantidad, valor) {
    return cantidad * valor;
}

function VerificaUnidad() {

    let calculo;
    let precioUnidad = document.getElementById('precio-unidad');
    let cantidadUnidad = document.getElementById('cantidad-unidad');
    let cuantos = cantidadUnidad.value;
    let costoUnidad = precioUnidad.value;
    let d;
    switch (unitSelect.value) {
        case "g":
            d = 1;
            break;
        case "kg":
        case "unit":
            d = 1000;
        default:
            break;
    }
    calculo = cuantos * costoUnidad * (d / 1000);
    return parseFloat(calculo).toFixed(2);
}

addProductBtn.addEventListener('click', () => {

    var producto = document.getElementById('producto');
    if (producto.hasAttribute('list')) {
        let otraOpcion = document.createElement('option')
        otraOpcion.value=producto.value
        document.getElementById('productosAnteriores').appendChild(otraOpcion)
    } else {
        producto.setAttribute('list', 'productosAnteriores')
        let nuevaLista = document.createElement('datalist')
        let nuevaOpcion = document.createElement('option')
        nuevaLista.setAttribute('id', 'productosAnteriores')
        nuevaOpcion.value = producto.value
        nuevaLista.appendChild(nuevaOpcion)
        producto.appendChild(nuevaLista)

    }

    var total = VerificaUnidad();
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="nombre-producto">${producto.value}</span><span class="precio-producto">$ ${total}</span>`;
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
