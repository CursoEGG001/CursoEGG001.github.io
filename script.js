// Carga información necesaria
const form = document.getElementById('form');
const productList = document.getElementById('listado-productos');
const addProductBtn = document.getElementById('suma-producto');
const unitSelect = document.getElementById('unidad-medida');
const deleteListBtn = document.getElementById('borra-lista');
const elemProducto = document.getElementById('producto');
const totalPrice = 0;
const sumBtn = document.createElement('button');
const totalText = document.createElement('h2');

var productPrices = productList.querySelectorAll('.precio-producto');
var GenPrecioDB = indexedDB.open("GenPrecioDB", 1100);

// Calcula el valor del precio
function CalcularPrecio(cantidad, valor) {
    return cantidad * valor;
}

// Verifica la información del item
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
            d = 1000; //En caso del valor no sea la de gramos, permite elegir la corrección correcta.
        default:
            break;
    }
    calculo = cuantos * costoUnidad * (d / 1000);
    return parseFloat(calculo).toFixed(2); // Devuelve el valor con 2 decimales.
}

// Para cambiar la unidad de medida,actualiza la etiqueta
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

//Permite borrar el almacen de objetos de la base de datos guardada.
function BorraLista(infoGuardada) {
    const confirmDelete = confirm('¿Está seguro que desea borrar la lista?');
    if (confirmDelete) {
        const prodGuardados = infoGuardada.target.result;
        const transaccion = prodGuardados.transaction("itemsGuardados", 'readwrite');
        const almacen = transaccion.objectStore("itemsGuardados");
        const pedido = almacen.clear();
        pedido.onsuccess = () => {
            productList.innerHTML = '';
            totalText.textContent = '';
        };
    }
}

// Agrega la lista de elementos guardados en la base de datos a la lista de venta.
function AddElementFromDB(infoGuardada) {
    const prodGuardados = infoGuardada.target.result;
    const transaccion = prodGuardados.transaction("itemsGuardados", 'readonly');
    const almacen = transaccion.objectStore("itemsGuardados");
    const guardados = almacen.getAll();
    guardados.onsuccess = (listado) => {
        const listadoProductos = listado.target.result;
        listadoProductos.map(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span id='p${item.id}' class="nombre-producto">${item.prodGuardado.nombreProducto}</span><span class="precio-producto">$ ${item.prodGuardado.precioProducto}</span>`;
            productList.appendChild(listItem); //agrega la lista generada a la lista de ventas.
        });
    };

}

//Agrega elementos a la base de datos.
function AddElementToStore(infoGuardada) {
    var producto = document.getElementById('producto');
    var total = VerificaUnidad();

    const data = {"nombreProducto": producto.value, "precioProducto": total};
    const prodGuardados = infoGuardada.target.result;
    const transaccion = prodGuardados.transaction("itemsGuardados", 'readwrite');
    const almacen = transaccion.objectStore("itemsGuardados");
    const pedido = almacen.add({id: Date.now(), prodGuardado: data});
    pedido.onsuccess = (agrega) => {
        var statusInfo = document.getElementById('status-line');
        statusInfo.textContent = 'Esto se agregó: ';
        statusInfo.textContent = statusInfo.textContent + data.nombreProducto;
        setTimeout(() => {
            statusInfo.textContent = '';
        }, 3000);
    }
    pedido.onerror = (evError) => {
        window.alert("Evento adverso: " + evError)
    };

}

//Info que se fue ingreando en el campo del nombre de producto quedan guardados para después.
function AddElementToSelector() {
    var producto = document.getElementById('producto');
    if (producto.hasAttribute('list')) {
        let otraOpcion = document.createElement('option');
        otraOpcion.value = producto.value;
        document.getElementById('productosAnteriores').appendChild(otraOpcion);
    } else {
        producto.setAttribute('list', 'productosAnteriores');
        let nuevaLista = document.createElement('datalist');
        let nuevaOpcion = document.createElement('option');
        nuevaLista.setAttribute('id', 'productosAnteriores');
        nuevaOpcion.value = producto.value;
        nuevaLista.appendChild(nuevaOpcion);
        producto.appendChild(nuevaLista);
    }
}

GenPrecioDB.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log(db.indexNames);
    // Crea el almacen de objetos si no existe
    db.createObjectStore("itemsGuardados", {keyPath: "id"});
};

GenPrecioDB.onsuccess = (infoGuardada) => {
    var prodGuardados = infoGuardada.target.result;
    AddElementFromDB(infoGuardada);

    deleteListBtn.addEventListener('click', () => {
        BorraLista(infoGuardada);
        productList.innerHTML = '';
        totalText.textContent = '';
    });

    unitSelect.addEventListener('change', updateLabels);

    addProductBtn.addEventListener('click', () => {
        let precioUnidad = document.getElementById('precio-unidad');
        let cantidadUnidad = document.getElementById('cantidad-unidad');
        productList.innerHTML = '';
        totalText.textContent = '';
        if (
                elemProducto.value === '' ||
                precioUnidad.value === '' ||
                precioUnidad.value <= 0 ||
                cantidadUnidad.value == 0 ||
                cantidadUnidad.value === '') {
            window.alert("Ingrese un Nombre y precio para el producto");
        } else {
            AddElementToSelector();
            AddElementToStore(infoGuardada);
            form.reset();
            updateLabels();
            if (totalText !== null)
                totalText.textContent = "";
        }
        AddElementFromDB(infoGuardada);
    });

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

};

GenPrecioDB.onerror = (event) => {
    console.error("Error abriendo base de datos:", event.target.error);
};
