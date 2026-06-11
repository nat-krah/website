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

function typeScramble(element, onComplete) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Collect all text nodes inside the element, preserving structure
    function getTextNodes(node) {
        const nodes = [];
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        let current;
        while ((current = walker.nextNode())) {
            if (current.textContent.trim()) nodes.push(current);
        }
        return nodes;
    }

    const textNodes = getTextNodes(element);

    // Build a flat list of { node, index, finalChar } across all text nodes
    const chars_to_reveal = [];
    textNodes.forEach(node => {
        const text = node.textContent;
        // Blank out the node first
        node._original = text;
        node.textContent = '';
        for (let i = 0; i < text.length; i++) {
            chars_to_reveal.push({ node, index: i, finalChar: text[i] });
        }
    });

    const totalChars = chars_to_reveal.length;
    const totalDuration = Math.min(1200, 400 + totalChars * 18); // scale with length, cap at 1.2s
    const frameRate = 30; // fps
    const frameDuration = 1000 / frameRate;
    const totalFrames = totalDuration / frameDuration;

    // Track what's been "typed" so far per node
    const nodeProgress = new Map();
    textNodes.forEach(n => nodeProgress.set(n, ''));

    let frame = 0;

    const tick = setInterval(() => {
        frame++;
        const progress = frame / totalFrames; // 0 → 1
        const resolvedCount = Math.floor(progress * totalChars);

        // Reset all nodes to empty first
        nodeProgress.forEach((_, node) => nodeProgress.set(node, ''));

        // Fill in resolved characters (real) + one scramble character at the frontier
        chars_to_reveal.forEach(({ node, index, finalChar }, i) => {
            const current = nodeProgress.get(node);
            if (i < resolvedCount) {
                nodeProgress.set(node, current + finalChar);
            } else if (i === resolvedCount) {
                if (finalChar === ' ' || finalChar === '\n') {
                    nodeProgress.set(node, current + finalChar);
                } else {
                    nodeProgress.set(node, current + chars[Math.floor(Math.random() * chars.length)]);
                }
            }
            // Characters beyond frontier stay empty (not yet "typed")
        });

        // Write back to DOM
        nodeProgress.forEach((text, node) => node.textContent = text);

        if (frame >= totalFrames) {
            clearInterval(tick);
            // Guarantee clean final state
            textNodes.forEach(node => node.textContent = node._original);
            if (onComplete) onComplete();
        }
    }, frameDuration);
}

document.querySelectorAll('.project-description').forEach(section => {
    const content = section.querySelector('.read-more-content');
    const btn     = section.querySelector('.read-more-btn');

    if (!content || !btn) return;

    btn.addEventListener('click', () => {
        console.log("askjdnakjsnd");
        const isExpanded = content.style.display === 'block';

        if (isExpanded) {
            // Collapse — no animation needed, just hide
            content.style.display = 'none';
            btn.textContent = 'read more';
        } else {
            // Expand — show then animate
            content.style.display = 'block';
            btn.textContent = 'read less';
            typeScramble(content);
        }
    });
});