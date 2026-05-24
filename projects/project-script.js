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
      console.log(isLight)
      setTheme(isLight ? "dark" : "light");
  });


  // =============================
  // Image Enlarge
  // =============================
  const overlay = document.getElementById('imageOverlay');
  const overlayImage = document.getElementById('overlayImage');
  const enlargeableImages = document.querySelectorAll('.enlargeable');

  overlay.style.display = 'none';

  //Open overlay on button click
  enlargeableImages.forEach(img =>{
      img.addEventListener('click', ()=>{
          overlay.style.display = 'flex';
          overlayImage.src = img.src;
          document.body.style.overflow = 'hidden';
      })
  })

  //Close overlay
  overlay.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  function closeOverlay(){
      overlay .style.display = 'none';
      overlayImage.src = '';
      document.body.style.overflow = '';
  }

  
  // =============================
  // Hide Side 
  // =============================
  const sidebarContainer = document.querySelector(".sidebar-container");

  document.addEventListener('click', function(e) {
    if (e.target.closest('#hide-side')) {
      sidebarContainer.classList.toggle("sidebar-collapsed");

      const isCollapsed = sidebarContainer.classList.contains("sidebar-collapsed");
      const icon = document.getElementById("hide-side");
      icon.setAttribute("data-feather", isCollapsed ? "chevron-right" : "chevron-left");

      feather.replace();
    }
  });

      

})();