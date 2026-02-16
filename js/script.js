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
document.getElementById("registroForm")?.addEventListener("submit", e => {
  e.preventDefault();

  let usuario = {
    nombre: regNombre.value,
    correo: regCorreo.value,
    pass: regPass.value
  };

  localStorage.setItem("tpp_user", JSON.stringify(usuario));
  alert("Usuario creado correctamente");
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();

  let user = JSON.parse(localStorage.getItem("tpp_user"));

  if (!user) {
    alert("No existe el usuario");
    return;
  }

  if (user.correo === loginCorreo.value && user.pass === loginPass.value) {
    sessionStorage.setItem("tpp_session", "ok");
    mostrarPanel();
  } else {
    alert("Credenciales incorrectas");
  }
});

// Mostrar panel
function mostrarPanel() {
  ocultarTodo();
  activar("panel");
  cargarViajes();
}


// Logout
function logout() {
  sessionStorage.clear();
  location.reload();
}

// Cargar viajes demo
function cargarViajes() {
  let viajesDemo = [
    { origen: "Toluca", destino: "Monterrey", estatus: "En tránsito", fecha: "2025-02-10" },
    { origen: "CDMX", destino: "Querétaro", estatus: "Entregado", fecha: "2025-02-12" }
  ];

  let tabla = document.getElementById("tablaViajes");

  viajesDemo.forEach(v => {
    tabla.innerHTML += `
      <tr>
        <td>${v.origen}</td>
        <td>${v.destino}</td>
        <td>${v.estatus}</td>
        <td>${v.fecha}</td>
      </tr>
    `;
  });
}

// Sesión activa
if (sessionStorage.getItem("tpp_session") === "ok") {
  mostrarPanel();
}
