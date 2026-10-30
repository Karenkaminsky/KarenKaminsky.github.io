
/* ==========================================
   PARTICLE NETWORK - KAREN KAMINSKY
   Animação interativa de partículas
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("particles-canvas");
    const background = document.getElementById("particles-background");

    if (!canvas || !background) {
        console.warn("Canvas de partículas não encontrado.");
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Configurações
    const config = {
        particleColor: "0, 190, 255",
        lineColor: "90, 140, 255",
        particleSize: 2,
        speed: 0.35,
        connectionDistance: 135,
        mouseRadius: 160,
        mouseForce: 1.5,
        density: 10000,
        maxParticles: 130
    };

    // Acessibilidade
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Dispositivos e desempenho
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        config.maxParticles = 55;
        config.connectionDistance = 105;
        config.density = 16000;
    }

    // Estado do canvas
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let isVisible = true;

    // Posição do mouse
    const mouse = {
        x: null,
        y: null,
        active: false
    };

    // Ajusta o tamanho do canvas
    function resizeCanvas() {

        const rect = background.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();

        if (reducedMotion.matches) {
            draw();
        }
    }

    // Cria partículas
    function createParticles() {

        particles = [];

        const area = width * height;

        const quantity = Math.min(
            config.maxParticles,
            Math.max(20, Math.floor(area / config.density))
        );

        for (let i = 0; i < quantity; i++) {

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,

                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed,

                size: Math.random() * 1.5 + config.particleSize,
                opacity: Math.random() * 0.5 + 0.35
            });

        }
    }

    // Desenha as partículas e conexões
    function draw() {

        ctx.clearRect(0, 0, width, height);

        // Atualiza e desenha cada partícula
        particles.forEach((particle, index) => {

            if (!reducedMotion.matches) {

                particle.x += particle.vx;
                particle.y += particle.vy;

                // Reflexo nas bordas
                if (particle.x <= 0 || particle.x >= width) {
                    particle.vx *= -1;
                }

                if (particle.y <= 0 || particle.y >= height) {
                    particle.vy *= -1;
                }

                // Interação com o mouse
                if (mouse.active) {

                    const dx = particle.x - mouse.x;
                    const dy = particle.y - mouse.y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.mouseRadius && distance > 0) {

                        const force =
                            (config.mouseRadius - distance) /
                            config.mouseRadius;

                        const directionX = dx / distance;
                        const directionY = dy / distance;

                        particle.x += directionX * force * config.mouseForce;
                        particle.y += directionY * force * config.mouseForce;

                    }
                }

                // Mantém as partículas dentro do canvas
                particle.x = Math.max(0, Math.min(width, particle.x));
                particle.y = Math.max(0, Math.min(height, particle.y));

            }

            // Desenha a partícula
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${config.particleColor}, ${particle.opacity})`;

            ctx.fill();

            // Brilho ao redor da partícula
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size * 3,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${config.particleColor}, 0.06)`;

            ctx.fill();

            // Conecta partículas próximas
            for (let j = index + 1; j < particles.length; j++) {

                const other = particles[j];

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {

                    const opacity =
                        (1 - distance / config.connectionDistance) * 0.35;

                    ctx.beginPath();

                    ctx.moveTo(particle.x, particle.y);

                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle =
                        `rgba(${config.lineColor}, ${opacity})`;

                    ctx.lineWidth = 0.8;

                    ctx.stroke();

                }
            }

        });
    }

    // Loop da animação
    function animate() {

        if (!isVisible) {
            animationId = null;
            return;
        }

        draw();

        if (!reducedMotion.matches) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
        }
    }

    // Reinicia animação quando necessário
    function startAnimation() {

        if (animationId !== null || !isVisible) return;

        animate();
    }

    // Movimento do mouse
    window.addEventListener("pointermove", (event) => {

        if (event.pointerType !== "mouse") return;

        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;

    }, { passive: true });

    // Desativa interação ao sair da tela
    window.addEventListener("pointerleave", () => {

        mouse.active = false;

    });

    // Redimensionamento
    window.addEventListener("resize", resizeCanvas);

    // Pausa quando a aba fica oculta
    document.addEventListener("visibilitychange", () => {

        isVisible = !document.hidden;

        if (isVisible) {
            startAnimation();
        } else if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

    });

    // Mudança da preferência de movimento
    reducedMotion.addEventListener("change", () => {

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        if (reducedMotion.matches) {
            draw();
        } else {
            startAnimation();
        }

    });

    // Inicialização
    resizeCanvas();
    startAnimation();

});
