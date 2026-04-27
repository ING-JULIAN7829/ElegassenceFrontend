    import { cart  , cartCounter } from "./Variables.js";
   /*LOCALSTORAGE*/
   
   /* FUNCION PARA GUARDAR EL CARRITO EN LOCAL STORAGE */
 

   export function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }



    /*ACCIONES EN HTML*/

    /* ACTUALIZA EL CONTADOR DE PRODUCTOS EN EL CARRITO */
   

    export function updateCartCounter() {
        cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
    }

    /* SELECCIONA EL PRODUCTO CON SU IMAGEN PARA MOSTRAR EN EL CARRITO DEL HTML */
    export function addToCartHandler(event) {
        console.log("Botón 'Agregar al Carrito' presionado");
        const productCard = event.target.closest('.Product-card');
        if (!productCard) {
            console.log("No se encontró la tarjeta de producto");
            return;
        }
        const product = {
            name: productCard.getAttribute("data-name"),
            price: productCard.getAttribute("data-price"),
            image: productCard.querySelector('.Product-card__image').src
        };
        console.log("Producto a agregar:", product);
        addToCart(product);
    } 

    /* MOSTRAR EL CARRITO LUEGO DE DAR CLICK */
    let cartModal = null;
    export function showCart() {
        if (!cartModal) {
            cartModal = document.createElement('div');
            cartModal.classList.add('cart-modal');
            cartModal.innerHTML = `<div class="cart-content"><h2>Carrito de Compras</h2></div>`;
            document.body.appendChild(cartModal);

            cartModal.classList.add('active'); // Para transiciones en CSS

            cartModal.addEventListener('click', (event) => {
                if (event.target === cartModal) {
                    closeCart();
                }
            });
        }
        updateCartModal();
    }

    /* CERRAR EL CARRITO */
    export function closeCart() {
        if (cartModal) {
            cartModal.classList.remove('active');
            setTimeout(() => {
                cartModal.remove();
                cartModal = null;
            }, 400);
        }
    }

    /*Evalua la cantidad del producto */

    function handleQuantityChange(event) {
        const index = event.target.dataset.index;
        if (event.target.classList.contains('decrease')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
        } else if (event.target.classList.contains('increase')) {
            cart[index].quantity += 1;
        }
        saveCart();
        updateCartCounter();
        updateCartModal();
    }


    /* MUESTRA TODO EL CONTENIDO DEL CART*/
    export function updateCartModal() {
        if (!cartModal) return;

        const cartContent = cartModal.querySelector('.cart-content');
        cartContent.innerHTML = `<h2>Carrito de Compras</h2>`;

        if (cart.length === 0) {
            cartContent.innerHTML += `<p class="empty-cart">Tu carrito está vacío.</p>`;
        } else {
            cart.forEach((product, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                const formattedPrice = `$${Number(product.price).toLocaleString("es-CO")}`;

                cartItem.innerHTML = `
                  <img src="${product.image}" alt="${product.name}">
                  <div>
                      <p>${product.name}</p>
                      <p class="price">${formattedPrice}</p>
                      <div class="quantity-controls">
                          <button class="cart-button decrease" data-index="${index}">-</button>
                          <span>${product.quantity}</span>
                          <button class="cart-button increase" data-index="${index}">+</button>
                      </div>
                  </div>
                `;
                cartContent.appendChild(cartItem);
            });

            const subtotal = cart.reduce((total, product) => total + (Number(product.price) * product.quantity), 0);
            cartContent.innerHTML += `<p class="subtotal">Subtotal: $${subtotal.toLocaleString("es-CO")}</p>`;

            const nameInputContainer = document.createElement('div');
            nameInputContainer.classList.add('customer-name-container');
            nameInputContainer.innerHTML = `
              <label for="customer-name" class="customer-name">Ingresa tu nombre:</label>
              <input type="text" id="customer-name" placeholder="Tu nombre" />
            `;
            cartContent.appendChild(nameInputContainer);

            const checkoutButton = document.createElement('button');
            checkoutButton.classList.add('cart-button');
            checkoutButton.textContent = 'Finalizar Compra';
            checkoutButton.addEventListener('click', () => {
                const nombreCliente = document.getElementById('customer-name').value;
                const divCarrito = document.querySelector('div .customer-name-container');
                if (!nombreCliente || nombreCliente.trim() === "") {
                    const alerta = document.createElement('p');
                    alerta.textContent = 'Por favor digite su nombre';
                    alerta.classList.add('alerta');
                    if (divCarrito.firstElementChild.classList[0] !== 'alerta') {
                        divCarrito.insertBefore(alerta, divCarrito.firstChild);
                        setTimeout(() => {
                            alerta.remove();
                        }, 5000);
                    }
                    return;
                }

                let message = "Hola, Elegassence.\n\n";
                message += "He realizado el siguiente pedido:\n\n";
                cart.forEach(item => {
                    const itemPrice = Number(item.price).toLocaleString("es-CO");
                    message += `• ${item.name} x ${item.quantity} | $${itemPrice}\n`;
                });
                message += `\nSubtotal: $${subtotal.toLocaleString("es-CO")}\n\n`;
                message += "Por favor, infórmenme sobre las opciones de pago y envío.\n\n";
                message += "Saludos cordiales,\n";
                message += nombreCliente.trim();

                window.open(`https://wa.me/573178199636?text=${encodeURIComponent(message)}`, "_blank");

                showThankYouMessage(nombreCliente.trim());
                cart = [];
                saveCart();
                updateCartCounter();
                closeCart();
            });
            cartContent.appendChild(checkoutButton);
        }

        const closeButton = document.createElement('button');
        closeButton.classList.add('cart-button', 'close-button');
        closeButton.textContent = 'Cerrar';
        closeButton.addEventListener('click', closeCart);
        cartContent.appendChild(closeButton);

        document.querySelectorAll('.decrease, .increase').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });





        
        // Aplica la transición a las imágenes dentro del modal
        applyImageTransition(cartModal);
    }


    /*OPERACIONES EN EL ARREGLO PRODUCT*/
    
    /* AÑADE UN PRODUCTO AL CARRITO O AUMENTA SU CANTIDAD */
    export function addToCart(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        updateCartCounter();
        saveCart();
        updateCartModal();
    } 



    /*OPERACIONES EN EL CATALOGO*/
    /* ASIGNA EVENTOS A LOS BOTONES "Agregar al Carrito" */
    export function assignButtonEvents() {
        document.querySelectorAll('.Product-card__button').forEach(button => {
            button.removeEventListener('click', addToCartHandler);
            button.addEventListener('click', addToCartHandler);
        });
    }
   

    /* FUNCIÓN PARA APLICAR TRANSICIÓN A LAS IMÁGENES */
    function applyImageTransition(container) {
        const images = container.querySelectorAll('img');
        console.log(images);
        images.forEach(img => {
            if (img.complete) {
                img.style.opacity = '1';
                // O alternativamente: img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    // O alternativamente: img.classList.add('loaded');
                });
            }
        });
    }
   