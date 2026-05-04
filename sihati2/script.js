/* ============================================================
   SI-HATI — script.js
   Fungsi global: session, navigasi, toast, navbar
============================================================ */

/* ---- KONSTANTA ---- */
var SESSION_KEY   = "sihati_user";
var SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik

/* ============================================================
   MANAJEMEN SESSION
============================================================ */

/* Simpan data user setelah login */
function sessionSave(email, username) {
  var data = {
    email:     email,
    username:  username,
    loginTime: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

/* Ambil data user yang sedang login (null jika tidak ada / expired) */
function sessionGet() {
  var raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  var user = JSON.parse(raw);
  // Cek apakah session masih berlaku
  if (Date.now() - user.loginTime > SESSION_DURATION) {
    localStorage.removeItem(SESSION_KEY); // hapus jika expired
    return null;
  }
  return user;
}

/* Hapus session (logout) */
function sessionClear() {
  localStorage.removeItem(SESSION_KEY);
}

/* Cek apakah user sedang login */
function isLoggedIn() {
  return sessionGet() !== null;
}

/* ============================================================
   REDIRECT UNTUK HALAMAN PROTECTED
   Panggil di awal halaman yang butuh login
============================================================ */
function requireLogin() {
  if (!isLoggedIn()) {
    // Simpan halaman yang dituju agar bisa redirect balik setelah login
    localStorage.setItem("sihati_redirect", window.location.href);
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/* ============================================================
   NAVBAR — render dinamis sesuai status login
============================================================ */
function renderNavbar() {
  var authDiv = document.getElementById("nav-auth-area");
  if (!authDiv) return;

  var user = sessionGet();
  if (user) {
    // Sudah login: tampilkan nama + tombol logout
    authDiv.innerHTML =
      '<div class="nav-user">' +
        '<span class="nav-username">Halo, ' + user.username + '</span>' +
        '<button class="btn btn-outline btn-sm" onclick="doLogout()">Keluar</button>' +
      '</div>';
  } else {
    // Belum login: tampilkan tombol masuk & daftar
    authDiv.innerHTML =
      '<div class="nav-auth">' +
        '<a href="login.html" class="btn btn-outline">Masuk</a>' +
        '<a href="register.html" class="btn btn-solid">Daftar</a>' +
      '</div>';
  }
}

/* ============================================================
   LOGOUT
============================================================ */
function doLogout() {
  sessionClear();
  showToast("Kamu berhasil keluar.");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 800);
}

/* ============================================================
   NAVIGASI KE HALAMAN PROTECTED
   Dipanggil saat klik menu yang butuh login
============================================================ */
function goProtected(url) {
  if (isLoggedIn()) {
    window.location.href = url;
  } else {
    localStorage.setItem("sihati_redirect", url);
    window.location.href = "login.html";
  }
}

/* ============================================================
   TOAST NOTIFIKASI
============================================================ */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2800);
}

/* ============================================================
   AKTIFKAN LINK NAVBAR SESUAI HALAMAN SAAT INI
============================================================ */
function setActiveNav() {
  var page = window.location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ============================================================
   INISIALISASI — jalankan saat DOM siap
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  renderNavbar();
  setActiveNav();
});
