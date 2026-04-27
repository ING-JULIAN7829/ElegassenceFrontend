(function () {
  /* ===== Función para rotar las tarjetas del carrusel ===== */
  function rotarProductos(selector, intervalo) {
    const contenedor = document.querySelector(selector);
    if (!contenedor) return;
    const tarjetas = contenedor.querySelectorAll('.product-card');
    let indice = 0;
    function rotar() {
      tarjetas.forEach((tarjeta, i) => {
        tarjeta.style.display = i === indice ? 'block' : 'none';
      });
      indice = (indice + 1) % tarjetas.length;
    }
    rotar();
    setInterval(rotar, intervalo);
  }

  // Inicia la rotación en cada carrusel al cargar la ventana
  window.addEventListener('load', () => {
    rotarProductos('.carousel-slide:nth-child(1) .main__products-row', 7000);
    rotarProductos('.carousel-slide:nth-child(2) .main__products-row', 7000);
    rotarProductos('.carousel-slide:nth-child(3) .main__products-row', 7000);
  });

  /* ===== Función para redirigir al catálogo aplicando un filtro de categoría ===== */
  function redirigirAlCatalogo(filtro) {
    console.log('Redirigiendo al catálogo con filtro:', filtro);
    localStorage.setItem('categoryFilter', filtro);
    setTimeout(() => {
      window.location.href = 'Catalogo.html';
    }, 100);
  }

  /* ===== Asigna eventos a las Hero Cards ===== */
  document.addEventListener('DOMContentLoaded', () => {
    const heroCards = document.querySelectorAll('.Hero__card');
    if (heroCards.length) {
      heroCards.forEach(card => {
        card.addEventListener('click', function (event) {
          event.preventDefault();
          const titleElem = this.querySelector('.Hero__card-title');
          if (!titleElem) return;
          const title = titleElem.textContent.trim().toLowerCase();
          let filtro = '';
          if (title.includes('más vendidos')) {
            filtro = 'mas-vendidos';
          } else if (title.includes('destacados')) {
            filtro = 'destacados';
          } else if (title.includes('lo nuevo')) {
            filtro = 'lo-nuevo';
          }
          if (filtro) {
            redirigirAlCatalogo(filtro);
          }
        });
      });
    }
  });

  /* ===== Función para manejar el clic en los botones de las tarjetas ===== */
  function handleButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    // Si el botón muestra "ver más", se realiza el filtrado (sin agregar al carrito)
    if (button.textContent.trim().toLowerCase() === 'ver más') {
      const productCard = button.closest('.product-card');
      if (!productCard) {
        console.error("No se encontró la tarjeta del producto.");
        return;
      }
      const productNameElem = productCard.querySelector('.product-card__name');
      if (!productNameElem) {
        console.error("No se encontró el nombre del producto.");
        return;
      }
      const productName = productNameElem.textContent.trim();
      localStorage.setItem('searchQuery', productName);
      window.location.href = 'Catalogo.html';
    } else {
      // Si no es "ver más", se asume que es "Agregar al carrito"
      addToCartHandler(event);
    }
  }

  /* ===== Asigna eventos a los botones de las tarjetas ===== */
  function assignButtonEvents() {
    const buttons = document.querySelectorAll('.product-card__button');
    console.log(buttons);
    buttons.forEach(button => {
      button.removeEventListener('click', handleButtonClick);
      button.addEventListener('click', handleButtonClick);
    });
  }
  document.addEventListener('DOMContentLoaded', assignButtonEvents);

  /* ===== Funciones del carrito (para otros botones, si existen) ===== */
  function addToCartHandler(event) {
    console.log("Botón 'Agregar al Carrito' presionado");
    const productCard = event.target.closest('.product-card');
    if (!productCard) {
      console.log("No se encontró la tarjeta de producto");
      return;
    }
    const product = {
      name: productCard.getAttribute("data-name"),
      price: productCard.getAttribute("data-price"),
      image: productCard.querySelector('.product-card__image').src
    };
    console.log("Producto a agregar:", product);
    addToCart(product);
  }

  function addToCart(product) {
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

  /* ===== Transición en todas las imágenes ===== */
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

  /* ===== Código del carrito ===== */
  
  const cartIcon = document.querySelector('.Header__icons img[alt="Carrito de Compras"]');
  if (!cartIcon) {
    console.error("No se encontró el ícono del carrito. Verifica el HTML.");
    return;
  }
  const cartCounter = document.createElement('span');
  cartCounter.classList.add('cart-counter');
  cartCounter.style.display = 'none';
  cartIcon.parentNode.appendChild(cartCounter);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCounter();

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCounter() {
    cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
  }

  let cartModal = null;

  function applyImageTransition(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  function showCart() {
    if (!cartModal) {
      cartModal = document.createElement('div');
      cartModal.classList.add('cart-modal');
      cartModal.innerHTML = `<div class="cart-content"><h2>Carrito de Compras</h2></div>`;
      document.body.appendChild(cartModal);
      cartModal.classList.add('active');
      cartModal.addEventListener('click', (event) => {
        if (event.target === cartModal) {
          closeCart();
        }
      });
    }
    updateCartModal();
  }

  function closeCart() {
    if (cartModal) {
      cartModal.classList.remove('active');
      setTimeout(() => {
        cartModal.remove();
        cartModal = null;
      }, 400);
    }
  }

  function updateCartModal() {
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

    applyImageTransition(cartModal);
  }

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

  function showThankYouMessage(nombre) {
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
  }

  const init = () => {
    assignButtonEvents();
    cartIcon.addEventListener('click', showCart);
    updateCartCounter();
  };

  document.addEventListener('DOMContentLoaded', init);
})();

document.addEventListener('DOMContentLoaded', () => {
  const savedCategory = localStorage.getItem("categoryFilter");
  if (savedCategory) {
    console.log('Filtro recibido en catálogo:', savedCategory);
    const radio = document.querySelector(`input[name="category"][value="${savedCategory}"]`);
    if (radio) {
      radio.checked = true;
    }
    if (typeof filtrarCategorias === 'function') {
      filtrarCategorias(savedCategory);
    }
    localStorage.removeItem("categoryFilter");
  }
});

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

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.querySelector("#Catalogo__search-bar");
  const savedQuery = localStorage.getItem("searchQuery");
  if (savedQuery && searchBar) {
    searchBar.value = savedQuery;
    searchBar.dispatchEvent(new Event("input"));
    localStorage.removeItem("searchQuery");
  }
});
