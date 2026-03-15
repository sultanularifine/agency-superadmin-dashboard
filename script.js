// ---------- Tailwind Config ----------
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: { primary: '#ff4d4d', darkBg: '#050505', lightBg: '#f8fafc' },
            fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'], mono: ['Fira Code', 'monospace'] }
        }
    }
}

// ---------- Load Templates ----------
function loadHTML(id, file) {
    return fetch(file)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; });
}

// wait for DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadHTML("header", "header.html"),
        loadHTML("sidebar", "sidebar.html")
    ]);

    // All templates loaded → init JS
    initSidebar();
    initMenuToggle();
    initCursor();
    initMagneticButtons();
    initThemeToggle();
    initScrollReveal();
    init3D();
    animate();
});

// ---------- Sidebar Toggle ----------
function initSidebar() {
    const sidebar = document.getElementById('dashboard-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    window.toggleSidebar = function() {
        const isHidden = sidebar.classList.contains('-translate-x-full');
        if (isHidden) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
}

// ---------- Mobile Menu Toggle ----------
function initMenuToggle() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        menuBtn.innerText = mobileMenu.classList.contains('hidden') ? '☰' : '✕';
    });
}

// ---------- Custom Cursor ----------
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    window.addEventListener('mousemove', (e) => {
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });
}

// ---------- Magnetic Buttons ----------
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });
}

// ---------- Theme Toggle ----------
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });
}

// ---------- Scroll Reveal ----------
function initScrollReveal() {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach((el) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" }
        });
    });
}

// ---------- Three.js Particles ----------
let scene, camera, renderer, particles;
function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const pGeometry = new THREE.BufferGeometry();
    const pVertices = [];
    for (let i = 0; i < 1500; i++) {
        pVertices.push(
            THREE.MathUtils.randFloatSpread(50),
            THREE.MathUtils.randFloatSpread(50),
            THREE.MathUtils.randFloatSpread(50)
        );
    }
    pGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pVertices, 3));

    const pMaterial = new THREE.PointsMaterial({ color: 0xff4d4d, size: 0.1, transparent: true, opacity: 0.4 });
    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);
    camera.position.z = 15;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (particles) particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}
