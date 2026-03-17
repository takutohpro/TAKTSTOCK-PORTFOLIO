export function initProjects() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Scroll Appearance
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // Trigger when top of card hits 85% of viewport height
                toggleActions: "play none none reverse"
            }
        });

        // Magnetic / Tilt effect on hover (Simple version)
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Move image slightly
            const img = card.querySelector('.card-image');
            const xMove = (x - rect.width / 2) / 20;
            const yMove = (y - rect.height / 2) / 20;

            gsap.to(img, {
                x: xMove,
                y: yMove,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.card-image');
            gsap.to(img, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}
