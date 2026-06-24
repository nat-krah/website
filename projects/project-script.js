(function () {

    // =============================
    // Hide sidebar (desktop toggle)
    // =============================
    const sidebarContainer = document.querySelector(".sidebar-nav");

    document.addEventListener('click', function (e) {
        if (e.target.closest('#hide-side')) {
            sidebarContainer.classList.toggle("sidebar-collapsed");

            const isCollapsed = sidebarContainer.classList.contains("sidebar-collapsed");
            const icon = document.getElementById("hide-side");
            icon.setAttribute("data-feather", isCollapsed ? "chevron-right" : "chevron-left");

            feather.replace();
        }
    });


    // =============================
    // Hide nav on mobile
    // =============================
    const dropdown = document.querySelector(".sidebar-nav");
    const dropdownBtn = document.querySelector(".sidebar-icon-mobile");
    let shown = false;

    body.addEventListener("click", (event) => {
        if (event.target.closest(".sidebar") == null && !(event.target.classList.contains("sidebar-icon-mobile"))) {
            dropdown.classList.remove("mobile-show");
            shown = false;
        }
    });

    dropdownBtn.addEventListener("click", () => {
        if (shown) {
            dropdown.classList.remove("mobile-show");
            shown = false;
        } else {
            dropdown.classList.add("mobile-show");
            shown = true;
        }
    });

    
    // =============================
    // Cycle images
    // =============================
    function scrambleText(element, newText) {
        const chars    = '!<>-_\\/[]{}—=+*^?#________';
        const duration = 600;   // total animation time in ms
        const steps    = 18;    // number of scramble frames
        const interval = duration / steps;
        let frame = 0;

        const tick = setInterval(() => {
            frame++;
            const progress = frame / steps;

            element.textContent = newText
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i / newText.length < progress) return char;
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
        const images   = JSON.parse(section.dataset.img      || '[]');
        const captions = JSON.parse(section.dataset.captions || '[]');

        if (images.length <= 1) return;

        // Preload all images so cycling feels instant
        images.forEach(src => { new Image().src = src; });

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


    // =============================
    // Read more btn
    // =============================
    function typeScramble(element, onComplete) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';

        function getTextNodes(node) {
            const nodes  = [];
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
            let current;
            while ((current = walker.nextNode())) {
                if (current.textContent.trim()) nodes.push(current);
            }
            return nodes;
        }

        const textNodes = getTextNodes(element);

        const chars_to_reveal = [];
        textNodes.forEach(node => {
            const text = node.textContent;
            node._original   = text;
            node.textContent = '';
            for (let i = 0; i < text.length; i++) {
                chars_to_reveal.push({ node, index: i, finalChar: text[i] });
            }
        });

        const totalChars    = chars_to_reveal.length;
        const totalDuration = Math.min(1800, 400 + totalChars * 18);
        const frameRate     = 120;
        const frameDuration = 1000 / frameRate;
        const totalFrames   = totalDuration / frameDuration;

        const nodeProgress = new Map();
        textNodes.forEach(n => nodeProgress.set(n, ''));

        let frame = 0;

        const tick = setInterval(() => {
            frame++;
            const progress      = frame / totalFrames;
            const resolvedCount = Math.floor(progress * totalChars);

            nodeProgress.forEach((_, node) => nodeProgress.set(node, ''));

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
            });

            nodeProgress.forEach((text, node) => node.textContent = text);

            if (frame >= totalFrames) {
                clearInterval(tick);
                textNodes.forEach(node => node.textContent = node._original);
                if (onComplete) onComplete();
            }
        }, frameDuration);
    }

    document.querySelectorAll('.read-more-btn').forEach(btn => {
        const section = btn.closest('section');
        const content = section.querySelector('.read-more-content');

        if (!content) return;

        btn.addEventListener('click', () => {
            const isExpanded = content.style.display === 'block';

            if (isExpanded) {
                content.style.display = 'none';
                btn.querySelector('p').textContent = 'Read more';
            } else {
                content.style.display = 'block';
                btn.querySelector('p').textContent = 'Read less';
                typeScramble(content);
            }
        });
    });


    // =============================
    // Sync sidebar height to content
    // =============================
    function syncSidebarHeight() {
        const sidebarMobile = document.querySelector('.sidebar-icon-mobile-container');
        const sidebar       = document.querySelector('.sidebar');
        const pageContent   = document.querySelector('.project-list');

        if (!sidebar || !sidebarMobile || !pageContent) return;

        // Reset first so we measure the page's natural height,
        // not a value previously inflated by this function.
        sidebar.style.height       = '';
        sidebarMobile.style.height = '';

        const targetHeight = pageContent.scrollHeight;
        sidebar.style.height       = `${targetHeight}px`;
        sidebarMobile.style.height = `${targetHeight}px`;
    }

    window.addEventListener('load',   syncSidebarHeight);
    window.addEventListener('resize', syncSidebarHeight);

    // Watch the content column for size changes (images loading,
    // read-more expanding, etc.) to avoid feedback loops.
    const pageContentEl = document.querySelector('.project-list');
    if (pageContentEl) {
        const observer = new ResizeObserver(syncSidebarHeight);
        observer.observe(pageContentEl);
    }

})();