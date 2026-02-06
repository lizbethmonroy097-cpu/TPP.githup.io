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
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Tu solicitud ha sido enviada correctamente.");
    form.reset();
  });
}
