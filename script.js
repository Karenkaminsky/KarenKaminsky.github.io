/* 📌 LINHA 1: SELECIONA O BOTÃO E O ÍCONE NO HTML */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

/* 📌 LINHA 5: ADICIONA O EVENTO DE CLIQUE AO BOTÃO */
themeToggleBtn.addEventListener('click', () => {
    
    /* 📌 LINHA 8: VERIFICA QUAL TEMA ESTÁ ATIVO NO MOMENTO */
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    /* 📌 LINHA 11: CONDICIONAL QUE TROCA ENTRE MODO CLARO E ESCURO */
    if (currentTheme === 'light') {
        // Se estiver claro, muda para escuro e coloca o ícone de lua
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
    } else {
        // Se estiver escuro, muda para claro e coloca o ícone de sol
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
    }
});