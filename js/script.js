
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS DO MENU
    const menuButton = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    // MENU RESPONSIVO
    if (menuButton && mainNav) {

        // Abrir e fechar menu
        menuButton.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("active");

            menuButton.setAttribute("aria-expanded", isOpen);
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );

            const icon = menuButton.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }

        });

        // Fechar menu ao clicar em um link
        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {
                closeMenu();
            });

        });

        // Fechar menu com a tecla ESC
        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Função para fechar o menu
        function closeMenu() {

            mainNav.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menu");

            const icon = menuButton.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    }

});
