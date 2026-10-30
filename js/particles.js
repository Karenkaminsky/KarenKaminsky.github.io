document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particles-canvas");
    const background = document.getElementById("particles-background");

    if (!canvas || !background) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
        particleColor: "0, 190, 255",
        lineColor: "90, 140, 255",
        particleSize: 2,
        speed: 0.35,
        connectionDistance: 135,
        mouseRadius: 160,
        mouseForce: 1.5,
        maxParticles: 130
    };

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        config.maxParticles = 55;
        config.connectionDistance = 105;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame;
    let mouse = {
        x: null,
        y: null
    };

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();
    }

    function createParticles() {
        particles = [];

        const area = width * height;
        const amount = Math.min(
            config.maxParticles,
            Math.floor(area / 10000)
        );

        for (let i = 0; i < amount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed,
                size: Math.random() * config.particleSize + 0.5
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius && distance > 0) {
                    const force =
                        (config.mouseRadius - distance) /
                        config.mouseRadius;

                    particle.x +=
                        (dx / distance) * force * config.mouseForce;

                    particle.y +=
                        (dy / distance) * force * config.mouseForce;
                }
            }

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(${config.particleColor}, 0.8)`;
            ctx.fill();
        });

        connectParticles();
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    const opacity =
                        1 - distance / config.connectionDistance;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    ctx.strokeStyle =
                        `rgba(${config.lineColor}, ${opacity * 0.25})`;

                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        drawParticles();
        animationFrame = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", event => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("mouseout", event => {
        if (!event.relatedTarget) {
            mouse.x = null;
            mouse.y = null;
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else if (!reducedMotion) {
            animate();
        }
    });

    resizeCanvas();

    if (!reducedMotion) {
        animate();
    } else {
        drawParticles();
    }
});