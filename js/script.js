/* VARIABLES */
const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");

/* Todas las secciones SPA */
const secciones = document.querySelectorAll(".seccion");

/* FUNCIONES */
function activar(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("activo");
}

function desactivar(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("activo");
}

function ocultarTodo() {
  secciones.forEach(s => s.classList.remove("activo"));
}

/* 🔵 INICIO AL CARGAR LA PÁGINA (inicio, manos-seguras, expertos) */
function inicioCorto() {
  ocultarTodo();
  activar("inicio");
  activar("manos-seguras");
  activar("expertos");
}

/* 🔵 INICIO DESDE EL MENÚ (bienvenida + clientes) */
function inicioMenu() {
  ocultarTodo();
  activar("bienvenida");
  activar("clientes");
}

/* 🚀 Al cargar la página */
window.addEventListener("DOMContentLoaded", () => {

  /* 🔥 FIX: evitar que cualquier sección quede activa por HTML o CSS */
  secciones.forEach(s => s.classList.remove("activo"));

  /* Activar solo las secciones correctas al inicio */
  inicioCorto();
});


/* MENÚ MÓVIL */
if (menuToggle && menuNav) {
  menuToggle.addEventListener("click", () => {
    menuNav.classList.toggle("active");
  });
}

/* SPA — CONTROL DE NAVEGACIÓN */
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return;

    const id = href.replace("#", "");
    e.preventDefault();

    switch (id) {

      /* 🔥 CUANDO DAS CLIC EN INICIO */
      case "inicio":
        inicioMenu();
        break;

      case "servicios":
        ocultarTodo();
        activar("servicios");
        break;

      case "quienes-somos":
        ocultarTodo();
        activar("quienes-somos");
        activar("esencia");
        activar("politica");
        break;

      case "cotizacion":
        ocultarTodo();
        activar("cotizacion");
        break;

      case "contacto":
        ocultarTodo();
        activar("contacto");
        break;

      case "login":
        ocultarTodo();
        activar("login");
        break;

      case "panel":
        ocultarTodo();
        activar("panel");
        break;


    }

    /* Cerrar menú móvil */
    if (menuNav.classList.contains("active")) {
      menuNav.classList.remove("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* FORMULARIO */
const form = document.getElementById("formCotizacion");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Anti-bots (honeypot)
    const hp = form.querySelector('input[name="empresa"]');
    if (hp && hp.value.trim() !== "") return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      await emailjs.sendForm(
        "service_cmb2udt",
        "template_m41zuk5",
        form
      );

      alert("✅ Tu solicitud fue enviada. En breve te contactaremos.");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo enviar. Intenta de nuevo o contáctanos por teléfono.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// ===== SISTEMA LOGIN TPP =====

// Registro
document.getElementById("registroForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const datos = {
    nombre: regNombre.value,
    correo: regCorreo.value,
    pass: regPass.value
  };

  const res = await fetch("api/registro.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  const json = await res.json();

  if (json.ok) {
    alert("Registro exitoso. Tu ID de cliente es: " + json.cliente_id);
    ocultarTodo();
    activar("login");
  } else {
    alert(json.error);
  }
});


// Login
async function loginReal(correo, password) {

  let res = await fetch("api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password })
  });

  let data = await res.json();

  if (data.ok) {
    sessionStorage.setItem("tpp_user", JSON.stringify(data));
    abrirPanel(data);
  } else {
    alert("Credenciales incorrectas");
  }
}
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  loginReal(loginCorreo.value, loginPass.value);
});


// Mostrar panel
function abrirPanel(user) {

  ocultarTodo();
  activar("panel");

  panelTitulo.textContent = "Panel " + user.rol.toUpperCase();

  if (user.rol === "admin") {
    panelMenu.innerHTML = `
      <button onclick="verViajesAdmin()">Viajes</button>
      <button onclick="crearViajeForm()">Crear viaje</button>
      <button onclick="logout()">Salir</button>
    `;
    verViajesAdmin();
  }

  if (user.rol === "operador") {
    panelMenu.innerHTML = `
      <button onclick="verViajesOperador()">Mis viajes</button>
      <button onclick="logout()">Salir</button>
    `;
  }

  if (user.rol === "cliente") {
    panelMenu.innerHTML = `
      <button onclick="verMisViajes()">Mis viajes</button>
      <button onclick="logout()">Salir</button>
    `;
    verMisViajes();
  }
}



// Logout
function logout() {
  sessionStorage.clear();
  location.reload();
}

// Cargar viajes demo
async function verViajesAdmin() {

  let res = await fetch("api/admin_viajes.php");
  let data = await res.json();

  let html = `<table>
  <tr><th>Folio</th><th>Origen</th><th>Destino</th><th>Estatus</th></tr>`;

  data.forEach(v => {
    html += `<tr>
      <td>${v.folio}</td>
      <td>${v.origen}</td>
      <td>${v.destino}</td>
      <td>
          <select onchange="cambiarEstatus(${v.id}, this.value)">
            <option value="1" ${v.estatus == "Programado" ? 'selected' : ''}>Programado</option>
            <option value="2" ${v.estatus == "Cargando" ? 'selected' : ''}>Cargando</option>
            <option value="3" ${v.estatus == "En tránsito" ? 'selected' : ''}>En tránsito</option>
            <option value="4" ${v.estatus == "En aduana" ? 'selected' : ''}>En aduana</option>
            <option value="5" ${v.estatus == "Detenido" ? 'selected' : ''}>Detenido</option>
            <option value="6" ${v.estatus == "Incidencia" ? 'selected' : ''}>Incidencia</option>
            <option value="7" ${v.estatus == "Entregado" ? 'selected' : ''}>Entregado</option>
            <option value="8" ${v.estatus == "Cancelado" ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
    </tr>`;
  });

  html += "</table>";

  panelContenido.innerHTML = html;
}

async function cambiarEstatus(id, estatus) {
  const res = await fetch("api/actualizar_estatus.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, estatus })
  });

  const json = await res.json();

  if (json.ok) {
    verViajesAdmin();   // 🔥 recarga la tabla
  } else {
    alert("Error al actualizar estatus");
  }
}


async function verMisViajes() {

  let user = JSON.parse(sessionStorage.getItem("tpp_user"));

  let res = await fetch("api/viajes.php?id=" + user.id);
  let data = await res.json();

  let html = `<table>
  <tr><th>Folio</th><th>Origen</th><th>Destino</th><th>Estatus</th></tr>`;

  data.forEach(v => {
    html += `<tr>
      <td>${v.folio}</td>
      <td>${v.origen}</td>
      <td>${v.destino}</td>
      <td>${v.estatus}</td>
    </tr>`;
  });

  html += "</table>";

  panelContenido.innerHTML = html;
}

function crearViajeForm() {
  ocultarTodo();
  activar("crear-viaje");
  cargarFormularioViaje();
}
function cargarFormularioViaje() {
  const cont = document.getElementById("crear-viaje");

  cont.innerHTML = `
    <div class="panel-box">
      <h2>Crear nuevo viaje</h2>

      <form id="formCrearViaje" class="form-panel">

        <input type="text" id="origen" placeholder="Origen" required>
        <input type="text" id="destino" placeholder="Destino" required>
        <input type="text" id="tipo_carga" placeholder="Tipo de carga" required>

        <textarea id="descripcion" placeholder="Descripción"></textarea>

        <input type="datetime-local" id="fecha_salida" required>
<input type="number" id="cliente_id" placeholder="ID del Cliente" required>

        <button type="submit">Guardar viaje</button>
      </form>
    </div>
  `;

  document.getElementById("formCrearViaje").addEventListener("submit", guardarViaje);
}
async function guardarViaje(e) {
  e.preventDefault();

  const datos = {
    cliente_id: cliente_id.value,
    origen: origen.value,
    destino: destino.value,
    tipo_carga: tipo_carga.value,
    descripcion: descripcion.value,
    fecha_salida: fecha_salida.value
  };

  const res = await fetch("api/crear_viaje.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  const json = await res.json();

  if (json.ok) {
    alert("Viaje creado correctamente");

    ocultarTodo();
    activar("panel");
    mostrarPanel();
    cargarViajesAdmin();  // recarga la tabla
  }
  else {
    alert("❌ Error al crear viaje");
  }
}



// Sesión activa
async function verificarSesion() {
  const res = await fetch("api/session.php");
  const json = await res.json();

  if (json.ok) {
    mostrarPanel();
    verViajesAdmin(); // 🔥 carga directa
  }
}

verificarSesion();

