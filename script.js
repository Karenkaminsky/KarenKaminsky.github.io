/* SELEÇÃO DOS ELEMENTOS DO BOTÃO DE TEMA E ÍCONE */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

/* ESCUTADOR DE EVENTO DE CLIQUE PARA ALTERNÂNCIA DE TEMAS */
themeToggleBtn.addEventListener('click', () => {
    
    /* Mapeia qual é o tema selecionado no momento */
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    /* Alterna entre o modo escuro e modo claro */
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
    }
});