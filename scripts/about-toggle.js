// =============================
// About overlay toggle
// =============================
const aboutBtn = document.getElementById("aboutBtn");
const aboutSec = document.querySelector(".about");

function toggleAbout() {
    aboutSec.classList.toggle("show");
}

aboutBtn.addEventListener("click", toggleAbout);
aboutSec.addEventListener("click", toggleAbout);