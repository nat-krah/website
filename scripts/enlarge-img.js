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