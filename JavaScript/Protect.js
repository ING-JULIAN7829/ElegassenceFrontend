setTimeout(() => {
  console.log("%cⓒ 2025 Elegassence | Creado por David Mauricio Herazo López +57 3194316780 y Julian Joel Jimenez +57 3178199636", "color: #ff4500; font-size: 16px;");
}, 3000);


const heroCardsContainer = document.querySelector('.Hero__cards');
const heroCards = document.querySelectorAll('.Hero__card');
let isUserInteracting = false;
let currentCardIndex = 0;

function autoScrollHero() {
  if (!isUserInteracting) {
    currentCardIndex = (currentCardIndex + 1) % heroCards.length;
    const cardWidth = heroCards[0].offsetWidth + 16; 
    heroCardsContainer.scrollTo({
      left: currentCardIndex * cardWidth,
      behavior: 'smooth'
    });
  }
}

  heroCardsContainer.addEventListener('mouseover', () => isUserInteracting = true);
  heroCardsContainer.addEventListener('mouseleave', () => isUserInteracting = false);

  setInterval(autoScrollHero, 2000);


/* Carrusel */

function rotarProductos(sectionSelector, intervalo) {
  const section = document.querySelector(sectionSelector);
  const products = section.querySelectorAll('.product-card');

  let currentIndex = 0;

  function mostrarProducto() {
    products.forEach((product, index) => {
      product.style.display = index === currentIndex ? 'block' : 'none';
    });

    currentIndex = (currentIndex + 1) % products.length;
  }

  mostrarProducto();

  setInterval(mostrarProducto, intervalo);
}

window.addEventListener('load', () => {
  rotarProductos('.carousel-slide:nth-child(1) .main__products-row', 7000);
  rotarProductos('.carousel-slide:nth-child(2) .main__products-row', 7000);
  rotarProductos('.carousel-slide:nth-child(3) .main__products-row', 7000);
});



/* Blog */


document.addEventListener('DOMContentLoaded', () => {
  const blogCards = document.querySelector('.Blog__cards');
  let scrollInterval;

  function autoScroll() {
      scrollInterval = setInterval(() => {
          const maxScrollLeft = blogCards.scrollWidth - blogCards.clientWidth;

          if (blogCards.scrollLeft >= maxScrollLeft) {
              blogCards.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
              blogCards.scrollBy({ left: 300, behavior: 'smooth' });
          }
      }, 3000);
  }

  function stopAutoScroll() {
      clearInterval(scrollInterval);
  }

  blogCards.addEventListener('wheel', stopAutoScroll);
  blogCards.addEventListener('mouseenter', stopAutoScroll);

  blogCards.addEventListener('mouseleave', autoScroll);

  autoScroll();
});


setTimeout(() => {
  console.log("%cⓒ 2025 Elegassence | Creado por David Mauricio Herazo López +57 3194316780 y Julian Joel Jimenez +57 8199693", "color: #ff4500; font-size: 16px;");
}, 3000);

