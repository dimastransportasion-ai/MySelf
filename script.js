// GSAP Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ===== THREE.JS SETUP FOR HERO =====
let heroScene, heroCamera, heroRenderer;
let trainModel;

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    heroScene.add(directionalLight);

    // Create simplified train model for hero
    createTrainModel();

    heroCamera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (trainModel) {
            trainModel.rotation.y += 0.003;
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

function createTrainModel() {
    const group = new THREE.Group();

    // Create 12 train cars
    for (let i = 0; i < 12; i++) {
        const carGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
        let carMaterial;

        // Determine livery - Gerbong 1-6 merah naik, 7-12 merah wave
        if (i < 6) {
            carMaterial = new THREE.MeshPhongMaterial({ color: 0xDC143C });
        } else {
            carMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        }

        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.x = i * 0.25 - 1.5;
        group.add(car);

        // Add window details
        const windowGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.05);
        const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.z = 0.18;
        window.position.x = i * 0.25 - 1.5 + 0.1;
        group.add(window);
    }

    heroScene.add(group);
    trainModel = group;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Fade in cards on scroll
    const cards = document.querySelectorAll('.fade-in-up');
    cards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2
        });
    });

    // Hover effect for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, { duration: 0.3, scale: 1.05 });
        });
        item.addEventListener('mouseleave', function() {
            gsap.to(this, { duration: 0.3, scale: 1 });
        });
    });
}

// ===== INTERACTIVE 3D CANVAS =====
let interactiveScene, interactiveCamera, interactiveRenderer;
let interactiveTrainModel;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

function initInteractiveScene() {
    const canvas = document.getElementById('interactive-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    interactiveScene = new THREE.Scene();
    interactiveScene.background = new THREE.Color(0xf5f5f5);

    interactiveCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    interactiveCamera.position.z = 4;

    interactiveRenderer = new THREE.WebGLRenderer({ antialias: true });
    interactiveRenderer.setSize(width, height);
    interactiveRenderer.setPixelRatio(window.devicePixelRatio);
    canvas.appendChild(interactiveRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    interactiveScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    interactiveScene.add(directionalLight);

    // Create detailed train
    createDetailedTrain();

    // Mouse events
    document.addEventListener('mousemove', onMouseMove);
    interactiveRenderer.domElement.addEventListener('wheel', onMouseWheel);
    interactiveRenderer.domElement.addEventListener('dblclick', resetView);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (interactiveTrainModel) {
            interactiveTrainModel.rotation.y += (targetRotation.y - interactiveTrainModel.rotation.y) * 0.1;
            interactiveTrainModel.rotation.x += (targetRotation.x - interactiveTrainModel.rotation.x) * 0.1;
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

function createDetailedTrain() {
    const group = new THREE.Group();

    // Create 12 detailed train cars with livery
    for (let i = 0; i < 12; i++) {
        const carGroup = new THREE.Group();

        // Car body
        const carGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.25);
        let carColor = i < 6 ? 0xDC143C : 0xFFFFFF; // Red for 1-6, white for 7-12
        const carMaterial = new THREE.MeshPhongMaterial({ color: carColor });
        const carMesh = new THREE.Mesh(carGeometry, carMaterial);
        carGroup.add(carMesh);

        // Windows
        const windowGeometry = new THREE.BoxGeometry(0.12, 0.15, 0.03);
        const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB, emissive: 0x4da6ff });
        for (let w = 0; w < 3; w++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.x = -0.2 + w * 0.2;
            window.position.z = 0.13;
            carGroup.add(window);
        }

        // Livery detail stripe
        if (i < 6) {
            const stripeGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.26);
            const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.y = 0.15;
            stripe.position.z = 0.002;
            carGroup.add(stripe);
        }

        carGroup.position.x = (i - 5.5) * 0.85;
        group.add(carGroup);
    }

    interactiveScene.add(group);
    interactiveTrainModel = group;
}

function onMouseMove(event) {
    const canvas = document.getElementById('interactive-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    targetRotation.y = mouse.x * Math.PI;
    targetRotation.x = mouse.y * Math.PI * 0.5;
}

function onMouseWheel(event) {
    event.preventDefault();
    interactiveCamera.position.z += event.deltaY * 0.005;
    interactiveCamera.position.z = Math.max(2, Math.min(10, interactiveCamera.position.z));
}

function resetView() {
    if (interactiveTrainModel) {
        gsap.to(interactiveTrainModel.rotation, { duration: 0.8, x: 0, y: 0 });
        gsap.to(interactiveCamera.position, { duration: 0.8, z: 4 });
        targetRotation = { x: 0, y: 0 };
    }
}

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    initHeroScene();
    initScrollAnimations();
    setTimeout(() => initInteractiveScene(), 500);
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';