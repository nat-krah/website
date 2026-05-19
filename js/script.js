(function () {
  const body = document.body;
  const toggleBtn = document.querySelector(".toggle-btn");
  const THEME_KEY = "theme";

  // Get system preference
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply theme class to body
  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
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
    const isLight = body.classList.contains("dark");
    setTheme(isLight ? "light" : "dark");
  });
})();