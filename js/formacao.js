
document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        ".academic-item, " +
        ".formation-section-heading, " +
        ".formation-footer-message"
    );

    // Verifica suporte ao Intersection Observer
    if (!("IntersectionObserver" in window)) {
        animatedElements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });


    animatedElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

});
