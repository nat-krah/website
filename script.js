(function () {
    
    // =============================
    // Light/dark mode toggle
    // =============================
    const body = document.body;
    const toggleBtn = document.querySelector("#theme-toggle");
    const THEME_KEY = "theme";

    const temp = document.querySelector("#faveicon");
    console.log(temp)

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
        console.log(isLight)
        setTheme(isLight ? "dark" : "light");
    });
})();



/*
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
    setTheme(isLight ? "dark" : "light");
  });
})();

// footer email copy
document.querySelector(".footer-email-copy").addEventListener("click", () => {
  navigator.clipboard.writeText("hello@iamsajid.com");

  const footerEmailMsg = document.querySelector(".footer-email-copied");
  footerEmailMsg.style.display = "block";

  setTimeout(() => {
    footerEmailMsg.style.display = "none";
  }, 2000);
});*/