// =========================================================
// TAKTSTOCK - Lightweight Portfolio Script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // ----- Header scroll effect -----
    const header = document.getElementById('site-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = y;
        }, { passive: true });
    }

    // ----- Mobile menu toggle -----
    const toggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ----- Smooth anchor scroll -----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ----- Mouse Trail (Subtle Monotone Baton) -----
    const canvas = document.getElementById('trail-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const maxPoints = 28; // Shorter, subtler trail
        const points = [];
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Touch support
        window.addEventListener('touchmove', (e) => {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }, { passive: true });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            points.push({ x: mouseX, y: mouseY });

            if (points.length > maxPoints) {
                points.shift();
            }

            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);

                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }

                ctx.quadraticCurveTo(
                    points[points.length - 1].x,
                    points[points.length - 1].y,
                    mouseX,
                    mouseY
                );

                const grad = ctx.createLinearGradient(
                    points[0].x, points[0].y, mouseX, mouseY
                );

                // Monotone: subtle white/gray trail
                grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                grad.addColorStop(0.5, 'rgba(200, 200, 200, 0.12)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0.35)');

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ----- Scroll Reveal Animations (IntersectionObserver) -----
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Staggered children reveal
    const staggerContainers = document.querySelectorAll('.stagger-children');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.12}s`;
                    child.classList.add('revealed');
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    staggerContainers.forEach(el => staggerObserver.observe(el));

    // ----- Hero Animation (from hero.js) -----
    if (typeof gsap !== 'undefined') {
        const chars = document.querySelectorAll('.hero-title .char');
        const subtitle = document.querySelector('.hero-subtitle');
        if (chars.length > 0 && subtitle) {
            const tl = gsap.timeline({ delay: 1.8 }); 
            tl.to(chars, { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power4.out" })
              .to(subtitle, { opacity: 1, duration: 1, ease: "power2.out" }, "-=1.0");
        }
        if (document.querySelector('.hero-content')) {
            gsap.to('.hero-content', {
                yPercent: 50, ease: "none",
                scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
            });
        }
    }

    // ----- Projects Animation (from projects.js) -----
    if (typeof gsap !== 'undefined') {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            gsap.from(card, {
                y: 100, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" }
            });
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const img = card.querySelector('.card-image');
                if(img) {
                    gsap.to(img, { x: (x - rect.width / 2) / 20, y: (y - rect.height / 2) / 20, duration: 0.5, ease: "power2.out" });
                }
            });
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('.card-image');
                if(img) {
                    gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
                }
            });
        });
    }

});
