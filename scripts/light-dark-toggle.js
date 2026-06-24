// =============================
// Light / dark mode toggle
// =============================
const body      = document.body;
const toggleBtn = document.querySelector("#theme-toggle");
const THEME_KEY = "theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}

function getPreferredTheme() {
  if (localStorage.getItem(THEME_KEY) != null){
    return localStorage.getItem(THEME_KEY)
  } else{
    return getSystemTheme();
  }
}

function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Initialise on load
setTheme(getPreferredTheme());

// Toggle on button click
toggleBtn.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});