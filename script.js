(function () {
  
  // =============================
  // Light/dark mode toggle
  // =============================
  const body = document.body;
  const toggleBtn = document.querySelector("#theme-toggle");
  const THEME_KEY = "theme";

  // Get system preference
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  }

  // Apply theme class to body
  function applyTheme(theme) {
    if (theme === "light") {
    body.classList.add("light");
    } else {
    body.classList.remove("light");
    }
  }

  // Get preferred theme (localStorage > system)
  function getPreferredTheme() {
    return localStorage.getItem(THEME_KEY) || getSystemTheme();
  }

  // Set theme and persist
  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme on load
  setTheme(getPreferredTheme());

  // Toggle theme on button click
  toggleBtn.addEventListener("click", () => {
    const isLight = body.classList.contains("light");
    console.log(isLight);
    setTheme(isLight ? "dark" : "light");
  });


  // =============================
  // About toggle
  // =============================
  const aboutbtn = document.getElementById("aboutBtn");
  const aboutSec = document.querySelector(".about");
  function toggleAbout(){
    aboutSec.classList.toggle("show");
  }

  aboutbtn.addEventListener("click", () => {
    toggleAbout();
  });
  aboutSec.addEventListener("click", () => {
    toggleAbout();
  });



})();

