// Load CLI125TrainModel class
const script = document.createElement('script');
script.src = 'models/CLI125TrainModel.js';
document.head.appendChild(script);

// GSAP Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ===== THREE.JS SETUP FOR HERO =====
let heroScene, heroCamera, heroRenderer;
let cli125Model;

function initHeroScene() {
    const canvas = document.getElementById('canvas-container');
    const width = window.innerWidth;
    const height = window.innerHeight;

    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    heroRenderer.setSize(width, height);
    heroRenderer.setClearColor(0x1a1a1a, 1);
    canvas.appendChild(heroRenderer.domElement);

    // Advanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(8, 8, 8);
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    heroScene.add(directionalLight);

    // Red accent light (cinematic)
    const redLight = new THREE.PointLight(0xDC143C, 0.4, 20);
    redLight.position.set(5, 3, 5);
    heroScene.add(redLight);

    // Create CLI-125 train model with delay
    setTimeout(() => {
        if (typeof CLI125TrainModel !== 'undefined') {
            cli125Model = new CLI125TrainModel(heroScene);
        }
    }, 100);

    heroCamera.position.z = 6;
    heroCamera.position.y = 0.5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (cli125Model) {
            const trainGroup = cli125Model.getTrainGroup();
            trainGroup.rotation.y += 0.005;
            // Subtle floating motion
            trainGroup.position.y = Math.sin(Date.now() * 0.0005) * 0.15;
        }
        
        heroRenderer.render(heroScene, heroCamera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        heroCamera.aspect = newWidth / newHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(newWidth, newHeight);
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Fade in info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 75%',
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: index * 0.15
        });
    });

    // Gallery items with stagger
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 75%',
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: index * 0.1
        });

        // Hover effects
        item.addEventListener('mouseenter', function() {
            gsap.to(this, { 
                duration: 0.4, 
                scale: 1.08, 
                boxShadow: '0 25px 50px rgba(220,20,60,0.4)',
                ease: 'power2.out'
            });
        });
        item.addEventListener('mouseleave', function() {
            gsap.to(this, { 
                duration: 0.4, 
                scale: 1, 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                ease: 'power2.out'
            });
        });
    });

    // Spec items animation
    const specItems = document.querySelectorAll('.spec-item');
    specItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Livery content animation
    const liveryItems = document.querySelectorAll('.livery-car');
    liveryItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            opacity: 0,
            x: index === 0 ? -30 : 30,
            duration: 0.8,
            delay: index * 0.2
        });
    });
}

// ===== INTERACTIVE 3D CANVAS =====
let interactiveScene, interactiveCamera, interactiveRenderer;
let interactiveTrainModel;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let isDragging = false;

function initInteractiveScene() {
    const canvas = document.getElementById('interactive-canvas');
    if (!canvas || !canvas.parentElement) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    interactiveScene = new THREE.Scene();
    interactiveScene.background = new THREE.Color(0xf5f5f5);

    interactiveCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    interactiveCamera.position.z = 5.5;

    interactiveRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    interactiveRenderer.setSize(width, height);
    interactiveRenderer.setPixelRatio(window.devicePixelRatio);
    interactiveRenderer.shadowMap.enabled = true;
    canvas.appendChild(interactiveRenderer.domElement);

    // Cinematic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    interactiveScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.95);
    directionalLight.position.set(10, 8, 10);
    directionalLight.castShadow = true;
    interactiveScene.add(directionalLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0x87CEEB, 0.35);
    rimLight.position.set(-10, 3, -10);
    interactiveScene.add(rimLight);

    // Create CLI-125 train
    if (typeof CLI125TrainModel !== 'undefined') {
        interactiveTrainModel = new CLI125TrainModel(interactiveScene);
    }

    // Mouse events
    canvas.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onMouseWheel, { passive: false });
    canvas.addEventListener('dblclick', resetView);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    });
    document.addEventListener('touchend', () => { isDragging = false; });
    canvas.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        }
    }, { passive: true });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (interactiveTrainModel) {
            const trainGroup = interactiveTrainModel.getTrainGroup();
            trainGroup.rotation.y += (targetRotation.y - trainGroup.rotation.y) * 0.08;
            trainGroup.rotation.x += (targetRotation.x - trainGroup.rotation.x) * 0.08;
        }
        interactiveRenderer.render(interactiveScene, interactiveCamera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;
        interactiveCamera.aspect = newWidth / newHeight;
        interactiveCamera.updateProjectionMatrix();
        interactiveRenderer.setSize(newWidth, newHeight);
    });
}

function onMouseMove(event) {
    if (!isDragging) return;

    const canvas = document.getElementById('interactive-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    targetRotation.y = mouse.x * Math.PI * 0.8;
    targetRotation.x = mouse.y * Math.PI * 0.4;
}

function onMouseWheel(event) {
    event.preventDefault();
    interactiveCamera.position.z += event.deltaY * 0.008;
    interactiveCamera.position.z = Math.max(2, Math.min(12, interactiveCamera.position.z));
}

function resetView() {
    if (interactiveTrainModel) {
        const trainGroup = interactiveTrainModel.getTrainGroup();
        gsap.to(trainGroup.rotation, { duration: 0.8, x: 0, y: 0, ease: 'back.out' });
        gsap.to(interactiveCamera.position, { duration: 0.8, z: 5.5, ease: 'back.out' });
        targetRotation = { x: 0, y: 0 };
    }
}

// ===== FOOTER WATERMARK =====
function initFooterWatermark() {
    const footer = document.querySelector('.footer');
    if (footer) {
        const watermarkSpan = document.createElement('span');
        watermarkSpan.style.cssText = 'position: relative; display: inline-block; margin-left: 1.5rem; color: #FFD700; font-weight: bold; font-size: 1rem; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);';
        watermarkSpan.innerHTML = '✦ By Dimas ✦';
        footer.appendChild(watermarkSpan);
    }
}

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    initHeroScene();
    initScrollAnimations();
    initFooterWatermark();
    setTimeout(() => {
        initInteractiveScene();
    }, 500);
});

// Smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';
