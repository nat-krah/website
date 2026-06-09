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
    const sidebarContainer = document.querySelector(".sidebar-nav");

    document.addEventListener('click', function(e) {
        if (e.target.closest('#hide-side')) {
            sidebarContainer.classList.toggle("sidebar-collapsed");

            const isCollapsed = sidebarContainer.classList.contains("sidebar-collapsed");
            const icon = document.getElementById("hide-side");
            icon.setAttribute("data-feather", isCollapsed ? "chevron-right" : "chevron-left");

            feather.replace();
        }
    });

    // =============================
    // Hide nav mobile
    // =============================
    const dropdown = document.querySelector(".sidebar-nav");
    const dropdownBtn = document.querySelector(".sidebar-icon-mobile");
    let shown = false;

    body.addEventListener("click", () => {
        if (event.target.closest(".sidebar") == null && !(event.target.classList.contains("sidebar-icon-mobile"))) {
            shown = false;
        }
    });

    dropdownBtn.addEventListener("click", () => {
        if (shown){
            dropdown.classList.remove("mobile-show");
            shown = false;
        } else{
            dropdown.classList.add("mobile-show");
            shown = true;
        }
    });

    
    // =============================
    // Cycle images
    // =============================

    function scrambleText(element, newText) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const duration = 600;   // total animation time in ms
        const steps = 18;       // number of scramble frames
        const interval = duration / steps;

        let frame = 0;

        const tick = setInterval(() => {
            frame++;
            const progress = frame / steps;  

            element.textContent = newText
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    // Characters to the left of the resolve frontier show their real value
                    if (i / newText.length < progress) return char;
                    // Characters still scrambling show a random glyph
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (frame >= steps) {
                clearInterval(tick);
                element.textContent = newText;
            }
        }, interval);
    }

    document.querySelectorAll('.project-content').forEach(section => {
        const images   = JSON.parse(section.dataset.images   || '[]');
        const captions = JSON.parse(section.dataset.captions || '[]');

        if (images.length <= 1) return;

        let current = 0;

        const img     = section.querySelector('.img-project');
        const caption = section.querySelector('.img-caption');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');

        function goTo(index) {
            current = (index + images.length) % images.length;

            img.style.opacity = '0';

            setTimeout(() => {
                img.src = images[current];
                img.alt = captions[current] ?? '';

                img.style.opacity = '1';
            }, 300);

            scrambleText(caption, captions[current] ?? '');
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));
    });
})();