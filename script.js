/* =========================
   TEMA CLARO / ESCURO
========================= */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn?.querySelector('i');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (themeIcon) {
        themeIcon.className = theme === 'light'
            ? 'fas fa-sun'
            : 'fas fa-moon';
    }

    themeToggleBtn?.setAttribute(
        'aria-label',
        theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
    );

    themeToggleBtn?.setAttribute(
        'title',
        theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
    );
}

let savedTheme = null;

try {
    savedTheme = localStorage.getItem('portfolio-theme');
} catch (error) {
    // O site continua funcionando mesmo se o navegador bloquear localStorage.
}

applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(nextTheme);

    try {
        localStorage.setItem('portfolio-theme', nextTheme);
    } catch (error) {
        // A preferência será aplicada nesta visita, mesmo sem armazenamento.
    }
});


/* =========================
   MENU RESPONSIVO
========================= */
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Fechar menu' : 'Abrir menu'
    );

    const icon = menuToggle.querySelector('i');

    if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
});

mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');

        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Abrir menu');

        const icon = menuToggle?.querySelector('i');

        if (icon) {
            icon.className = 'fas fa-bars';
        }
    });
});


/* =========================
   JANELA "SOBRE MIM"
========================= */
const aboutToggle = document.getElementById('about-toggle');
const aboutModal = document.getElementById('about-modal');
const aboutClose = document.getElementById('about-close');
const aboutCard = aboutModal?.querySelector('.about-card');

let previouslyFocusedElement = null;

function openAbout() {
    if (!aboutModal) return;

    previouslyFocusedElement = document.activeElement;

    aboutModal.classList.add('active');
    aboutModal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('modal-open');

    aboutClose?.focus();
}

function closeAbout() {
    if (!aboutModal) return;

    aboutModal.classList.remove('active');
    aboutModal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('modal-open');

    if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === 'function'
    ) {
        previouslyFocusedElement.focus();
    } else {
        aboutToggle?.focus();
    }
}

aboutToggle?.addEventListener('click', openAbout);
aboutClose?.addEventListener('click', closeAbout);

aboutModal?.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        closeAbout();
    }
});

document.addEventListener('keydown', (event) => {
    if (
        event.key === 'Escape' &&
        aboutModal?.classList.contains('active')
    ) {
        closeAbout();
    }

    /* Mantém a navegação por teclado dentro da janela aberta */
    if (
        event.key === 'Tab' &&
        aboutModal?.classList.contains('active')
    ) {
        const focusable = aboutModal.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {
            event.preventDefault();
            last.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    }
});


/* =========================
   DESTAQUE DO LINK DA SEÇÃO
========================= */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                const active =
                    link.getAttribute('href') === `#${entry.target.id}`;

                if (active) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
}