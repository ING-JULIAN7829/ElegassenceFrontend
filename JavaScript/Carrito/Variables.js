import { showCart } from "./Funciones.js";


/*LOCAL STORAGE */
//Obtiene los datos de cart en local storage si no devuelve un arreglo vacio
export let cart = JSON.parse(localStorage.getItem("cart")) || [];


/*ACCIONES EN HTML*/
    /*Selecciona los elementos para actualizar el contador */
export const  cartIcon = document.querySelector('.Header__icons img[alt="Carrito de Compras"]');
export const cartCounter = document.createElement('span');
cartCounter.classList.add('cart-counter');
cartCounter.style.display = 'none';
cartIcon.parentNode.appendChild(cartCounter);
cartIcon.addEventListener('click', showCart);



 

  

    