// cart.js

/* 
const CartModule = (() => {
    // Estado del carrito (se persiste en localStorage)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Referencias al ícono del carrito y contador
    const cartIcon = document.querySelector('.Header__icons img[alt="Carrito de compras"]');
    const cartCounter = document.createElement('span');
    cartCounter.classList.add('cart-counter');
    cartCounter.style.display = 'none';
    cartIcon.parentNode.appendChild(cartCounter);
  
    let cartModal = null;
  
    // Guarda el carrito en localStorage
    const saveCart = () => {
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  
    // Actualiza el contador del carrito
    const updateCartCounter = () => {
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      cartCounter.textContent = totalQuantity;
      cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
    };
  
    // Agrega un producto o aumenta la cantidad
    const addToCart = (product) => {
      const existingProduct = cart.find(item => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
      updateCartCounter();
      saveCart();
      // Si el modal está abierto, se actualiza su contenido
      if (cartModal) updateCartModal();
    };
  
    // Manejador para el botón "Agregar al carrito"
    const addToCartHandler = (event) => {
      const productCard = event.target.closest('.Product-card') || event.target.closest('.product-card');
      if (!productCard) return;
      const product = {
        name: productCard.getAttribute("data-name"),
        price: productCard.getAttribute("data-price"),
        image: productCard.querySelector('img').src
      };
      addToCart(product);
    };
  
    // Asigna eventos a botones de "Agregar"
    const assignButtonEvents = () => {
      document.querySelectorAll('.Product-card__button, .product-card__button').forEach(button => {
        // Se remueve para evitar duplicados
        button.removeEventListener('click', addToCartHandler);
        button.addEventListener('click', addToCartHandler);
      });
    };
  
    // Muestra el modal del carrito
    const showCart = () => {
      if (!cartModal) {
        cartModal = document.createElement('div');
        cartModal.classList.add('cart-modal');
        // Se usa la estructura base del modal
        cartModal.innerHTML = `<div class="cart-content"><h2>Carrito de Compras</h2></div>`;
        document.body.appendChild(cartModal);
  
        // Cierra el modal si se hace click fuera del contenido
        cartModal.addEventListener('click', (event) => {
          if (event.target === cartModal) closeCart();
        });
      }
      updateCartModal();
    };
  
    // Cierra el modal del carrito
    const closeCart = () => {
      if (cartModal) {
        cartModal.classList.remove('active');
        setTimeout(() => {
          cartModal.remove();
          cartModal = null;
        }, 400);
      }
    };
  
    // Actualiza el contenido del modal según el estado del carrito
    const updateCartModal = () => {
      if (!cartModal) return;
      const cartContent = cartModal.querySelector('.cart-content');
      cartContent.innerHTML = `<h2>Carrito de Compras</h2>`;
      
      if (cart.length === 0) {
        // Carrito vacío: muestra un mensaje y solo botón "Cerrar"
        cartContent.innerHTML += `<p class="empty-cart">Tu carrito está vacío.</p>`;
      } else {
        // Recorre los productos y crea la estructura con controles de cantidad
        cart.forEach((product, index) => {
          const formattedPrice = `$${Number(product.price).toLocaleString("es-CO")}`;
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
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
  
        // Subtotal
        const subtotal = cart.reduce((total, product) => total + (Number(product.price) * product.quantity), 0);
        cartContent.innerHTML += `<p class="subtotal">Subtotal: $ ${subtotal.toLocaleString("es-CO")} </p>`;
        
        // Input para el nombre del cliente
        const nameInputContainer = document.createElement('div');
        nameInputContainer.classList.add('customer-name-container');
        nameInputContainer.innerHTML = `
          <label for="customer-name" class="customer-name">Ingresa tu nombre:</label>
          <input type="text" id="customer-name" placeholder="Tu nombre" />
        `;
        cartContent.appendChild(nameInputContainer);
        
        // Botón para finalizar la compra (redirige a WhatsApp)
        const checkoutButton = document.createElement('button');
        checkoutButton.classList.add('cart-button');
        checkoutButton.textContent = 'Finalizar Compra';
        checkoutButton.addEventListener('click', () => {
          const nombreCliente = document.getElementById('customer-name').value;
          if (!nombreCliente || nombreCliente.trim() === "") {
            // Muestra alerta si el nombre está vacío
            if (!nameInputContainer.querySelector('.alerta')) {
              const alerta = document.createElement('p');
              alerta.textContent = 'Por favor digite su nombre';
              alerta.classList.add('alerta');
              nameInputContainer.insertBefore(alerta, nameInputContainer.firstChild);
              setTimeout(() => { alerta.remove(); }, 5000);
            }
            return;
          }
          let message = "Hola, Elegassence.\n\nHe realizado el siguiente pedido:\n\n";
          cart.forEach(item => {
            const itemPrice = Number(item.price).toLocaleString("es-CO");
            message += `• ${item.name} x ${item.quantity} | $${itemPrice}\n`;
          });
          message += `\nSubtotal: $${subtotal.toLocaleString("es-CO")}\n\n`;
          message += "Por favor, infórmenme sobre las opciones de pago y envío.\n\n";
          message += "Saludos cordiales,\n" + nombreCliente.trim();
          
          window.open(`https://wa.me/573178199636?text=${encodeURIComponent(message)}`, "_blank");
  
          showThankYouMessage(nombreCliente.trim());
          cart = [];
          saveCart();
          updateCartCounter();
          closeCart();
        });
        cartContent.appendChild(checkoutButton);
        
        // Botón "Volver al Catálogo" (solo si el carrito tiene productos)
        const catalogButton = document.createElement('button');
        catalogButton.classList.add('cart-button');
        catalogButton.textContent = 'Volver al Catálogo';
        catalogButton.addEventListener('click', () => {
          closeCart();
          window.location.href = "catalogo.html";
        });
        cartContent.appendChild(catalogButton);
      }
  
      // Botón siempre presente para cerrar el modal
      const closeButton = document.createElement('button');
      closeButton.classList.add('cart-button', 'close-button');
      closeButton.textContent = 'Cerrar';
      closeButton.addEventListener('click', closeCart);
      cartContent.appendChild(closeButton);
  
      // Asigna eventos para los botones de aumentar/disminuir cantidad
      cartContent.querySelectorAll('.decrease, .increase').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
      });
    };
  
    // Maneja el cambio de cantidad
    const handleQuantityChange = (event) => {
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
    };
  
    // Muestra un modal de agradecimiento
    const showThankYouMessage = (nombre) => {
      const thankYouModal = document.createElement('div');
      thankYouModal.classList.add('thank-you-modal');
      thankYouModal.innerHTML = `
        <div class="thank-you-content">
          <h2>¡Gracias por tu compra, ${nombre}!</h2>
          <p>Agradecemos tu preferencia. Nos pondremos en contacto para coordinar el pago y envío.</p>
        </div>
      `;
      document.body.appendChild(thankYouModal);
      setTimeout(() => { thankYouModal.classList.add('active'); }, 100);
      setTimeout(() => {
        thankYouModal.classList.remove('active');
        setTimeout(() => { thankYouModal.remove(); }, 500);
      }, 5000);
    };
  
    // Inicializa el módulo asignando los eventos
    const init = () => {
      assignButtonEvents();
      cartIcon.addEventListener('click', showCart);
      updateCartCounter();
    };
  
    // Exponemos las funciones públicas que se puedan necesitar en otras partes
    return {
      init,
      addToCart,
      showCart,
    };
  })(); */
  
  document.addEventListener('DOMContentLoaded', () => {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }); 


  