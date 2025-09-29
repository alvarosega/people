import axios from 'axios';

window.axios = axios;

// Necesario para peticiones AJAX
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Agregar token CSRF desde la meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
    console.error("CSRF token not found: make sure <meta name=\"csrf-token\"> is in your <head>!");
}
