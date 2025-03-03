document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-button");

    toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const aboutClubInfo = this.closest(".about-club").querySelector(".about-club-info");

            // 토글 기능
            aboutClubInfo.classList.toggle("show");
            this.classList.toggle("rotated");
        });
    });
});