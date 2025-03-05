document.addEventListener("DOMContentLoaded", function () {
    const imageCells = document.querySelectorAll(".image-cell");

    imageCells.forEach(cell => {
        cell.addEventListener("click", function () {
            this.classList.toggle("clicked");
            this.classList.toggle("flipped");
        });
    });
});
