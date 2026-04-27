import { updateCartCounter , showCart , addToCart ,assignButtonEvents}  from "./Carrito/Funciones.js";


document.addEventListener('DOMContentLoaded', () => {

    console.log("%cⓒ 2025 Elegassence | Creado por David Mauricio Herazo López y Julian Joel Jimenez", "color: #ff4500; font-size: 16px;");

    /* VARIABLES GLOBALES */
    let productos = Array.from(document.querySelectorAll('.Product-card'));
    let searchQuery = "";
    
    /* BARRA DE BÚSQUEDA */
    const inputBusqueda = document.querySelector('#Catalogo__search-bar');
    inputBusqueda.addEventListener('input', function() {
        searchQuery = this.value.toLowerCase().trim();
        filtrarProductos();
    });

    /* FILTROS GUARDADOS EN LOCAL STORAGE */
    const filtrosGuardados = JSON.parse(localStorage.getItem("filtros")) || {
        categoria: "all",
        aromas: [],
        precioMax: 600000
    };

    /* SELECTORES DE LOS FILTROS */
    const radiosCategoria = document.querySelectorAll('input[name="category"]');
    const checkboxesAroma = document.querySelectorAll('input[name="aroma"]');
    const inputPrecio = document.querySelector('#Catalogo__filter-price');
    const textoPrecio = document.querySelector('#Catalogo__price-value');

    /* FILTROS POR CATEGORIA */
    radiosCategoria.forEach(radio => {
        if (radio.value === filtrosGuardados.categoria) {
            radio.checked = true;
        }
        radio.addEventListener('change', () => {
            filtrosGuardados.categoria = radio.value;
            if (radio.value === "all") {
                filtrosGuardados.precioMax = 600000;
                filtrosGuardados.aromas = [];
                inputPrecio.value = filtrosGuardados.precioMax;
                textoPrecio.textContent = `Hasta $${Number(filtrosGuardados.precioMax).toLocaleString()}`;
            }
            guardarFiltros();
            filtrarProductos();
        });
    });

    /* FILTROS POR AROMA */
    checkboxesAroma.forEach(checkbox => {
        if (filtrosGuardados.aromas.includes(checkbox.value)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener('change', () => {
            filtrosGuardados.aromas = Array.from(checkboxesAroma)
                                        .filter(chk => chk.checked)
                                        .map(chk => chk.value);
            guardarFiltros();
            filtrarProductos();
        });
    });

    /* FILTRO POR PRECIO */
    inputPrecio.value = filtrosGuardados.precioMax;
    textoPrecio.textContent = `Hasta $${Number(filtrosGuardados.precioMax).toLocaleString()}`;
    inputPrecio.addEventListener('input', () => {
        filtrosGuardados.precioMax = Number(inputPrecio.value);
        textoPrecio.textContent = `Hasta $${filtrosGuardados.precioMax.toLocaleString()}`;
        guardarFiltros();
        filtrarProductos();
    });

    /* GUARDAR LOS FILTROS EN LOCAL STORAGE */
    function guardarFiltros() {
        localStorage.setItem("filtros", JSON.stringify(filtrosGuardados));
    }

    /* FUNCION QUE SE USA PARA FILTRAR LOS PRODUCTOS */
    function filtrarProductos() {
        productos = Array.from(document.querySelectorAll('.Product-card'));

        // Arreglo de productos destacados (los nombres deben coincidir en minúsculas)
        const destacados = [
            'bharara viking',
            'blade glory de lattafa',
            'blade honor de lattafa',
            'fakhar lattafa silver',
            "bade'e al oud amethyst",
            'khamrah lattafa',
            'asad',
            'yara moi lattafa',
            'yara tous lattafa',
            'haya lattafa',
            'mayar de lattafa',
            'bahar rose al haramain',
            'ariana grande cloud'
        ];

        productos.forEach(producto => {
            const productoNombre = producto.dataset.name ? producto.dataset.name.toLowerCase().trim() : "";
            const productoCategoria = producto.dataset.category ? producto.dataset.category.toLowerCase().trim() : "";
            const productoAroma = producto.dataset.aroma ? producto.dataset.aroma.toLowerCase().trim() : "";
            const productoPrecio = producto.dataset.price ? parseInt(producto.dataset.price) : 0;

            let mostrar = true;

            if (filtrosGuardados.categoria !== "all") {
                if (filtrosGuardados.categoria === "destacados") {
                    mostrar = destacados.includes(productoNombre);
                } else if (filtrosGuardados.categoria === "mas-vendidos") {
                    const vendidos = [
                        'khamrah lattafa',
                        'jean paul gaultier le male elixir',
                        'bharara viking',
                        'club de nuit'
                    ];
                    mostrar = vendidos.includes(productoNombre);
                } else {
                    mostrar = productoCategoria === filtrosGuardados.categoria;
                }
            }

            if (mostrar && filtrosGuardados.aromas.length > 0) {
                mostrar = filtrosGuardados.aromas.includes(productoAroma);
            }

            if (mostrar) {
                mostrar = productoPrecio <= filtrosGuardados.precioMax;
            }

            if (mostrar && searchQuery) {
                mostrar = productoNombre.includes(searchQuery);
            }

            producto.style.display = mostrar ? 'flex' : 'none';
        });
    }

    filtrarProductos();

   

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

    return {
        init,
        addToCart,
        showCart,
    };
});

document.addEventListener('DOMContentLoaded', () => {
    // Si se guardó un filtro de categoría en localStorage, se aplica
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


  document.addEventListener("DOMContentLoaded", () => {
    // Reinicia los filtros guardados para que cada vez se use el valor por defecto
    localStorage.removeItem("filtros");
    localStorage.removeItem("categoryFilter");
    
    // Opcional: Establece los filtros por defecto en localStorage (si tu código de filtrado los usa)
    const defaultFilters = {
      categoria: "all",
      aromas: [],
      precioMax: 600000
    };
    localStorage.setItem("filtros", JSON.stringify(defaultFilters));
    
    // Limpia el input de búsqueda
    const searchBar = document.querySelector("#Catalogo__search-bar");
    if (searchBar) {
      searchBar.value = "";
    }
    
    // Aquí puedes llamar a tu función de filtrado, si es necesaria
    if (typeof filtrarProductos === "function") {
      filtrarProductos();
    }


      /* CARRITO DE COMPRAS */
    
   
  
      updateCartCounter();
  
      assignButtonEvents(); 

      /* EVENTO AL CLIKEAR EL ÍCONO DEL CARRITO */

   
  });
  let historial = []

  const chatBtn =  document.querySelector('.boton-flotante' );
  const modal = document.querySelector('#miModal');
  chatBtn.addEventListener('click' , () => {
    if(modal.style.display == 'none') { 
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
  })

  const input_prompt = document.querySelector('#prompt');
  const cuadroTexto = document.querySelector('#cuadro')
  input_prompt.addEventListener('keydown' , (e) => {
    if(e.key === 'Enter'){ 
     const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje');
    mensaje.textContent = e.target.value.trim();

    cuadroTexto.appendChild(mensaje);
    cuadroTexto.scrollTop = cuadroTexto.scrollHeight; // auto-scroll al final
    historial.push({ role: 'user', content: mensaje.textContent });
    preguntarModelo(mensaje.textContent);
    e.target.value = ''; // limpiar input

    }

  })


  async function preguntarModelo(mensaje) {
    input_prompt.disabled = true;
    cuadroTexto.textContent = 'Cargando...'
    const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma2:2b',
          messages: [
            {
              role: 'system',
              content: ' Eres un asistente de Elegassence, una perfumería exclusiva. Responde solo sobre perfumes, fragancias o notas olfativas en 1-2 frases, usando el historial para mantener el contexto. Si la pregunta no es sobre perfumes o fragancias , di: "Lo siento, solo hablo de perfumes. ¿Qué fragancia buscas?" Ejemplo: Usuario: "¿Qué es React?". Respuesta: "Lo siento, solo hablo de perfumes. ¿Qué fragancia buscas? "'
            },
            ...historial.slice(-4),
            { role: 'user', content: mensaje }
          ],
          options: {
            temperature: 0.6 , 
            top_p: 0.8 ,
            max_tokens: 150 ,
            num_ctx: 2048

          } , 
          stream: true,
          keep_alive: '30m' // Mantiene el modelo cargado
        })


    })
    const reader = res.body.getReader();
    let respuestamodel = '';
    cuadroTexto.textContent = '';
    const rta = document.createElement('div');
    
    cuadroTexto.appendChild(rta);
    while(true) {
        const {done , value} = await reader.read();
      
        if(done) break;
    
        
    
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n')
        
        for(const line of lines) {
            if(line.trim()) { 
                try { 
                const data = JSON.parse(line);
                if(data.message && data.message.content) { 
                    respuestamodel += data.message.content;
                    rta.textContent = respuestamodel;
                }
              } catch(error) {
                    console.log('no se pudo parsear ')
              }
            }
        }

    }
    historial.push({ role: 'assistant', content: respuestamodel });
    input_prompt.disabled = false;
}