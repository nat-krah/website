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
