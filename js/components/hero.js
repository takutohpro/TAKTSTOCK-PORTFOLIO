export function initHero() {
    // Reveal Text Animation
    const chars = document.querySelectorAll('.hero-title .char');
    const subtitle = document.querySelector('.hero-subtitle');

    const tl = gsap.timeline({ delay: 1.8 }); // Wait for loader

    tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out"
    })
        .to(subtitle, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=1.0");

    // Parallax Effect on Scroll
    gsap.to('.hero-content', {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}
