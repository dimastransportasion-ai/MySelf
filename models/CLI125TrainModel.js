// Advanced CLI-125 3D Model Creator with Watermark Integration
// Creates a detailed, accurate representation of KRL CLI-125

class CLI125TrainModel {
    constructor(scene) {
        this.scene = scene;
        this.trainGroup = new THREE.Group();
        this.scene.add(this.trainGroup);
        this.createTrain();
    }

    createTrain() {
        // Create 12 train cars
        for (let i = 0; i < 12; i++) {
            if (i === 0) {
                this.createHeadCar(i);
            } else {
                this.createPassengerCar(i);
            }
        }
        // Add watermark on side
        this.addWatermarkOnTrain();
    }

    createHeadCar(index) {
        const carGroup = new THREE.Group();

        // Main body - rounded front
        const bodyGeometry = new THREE.BoxGeometry(0.9, 0.48, 0.32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDC143C,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.z = 0.01;
        carGroup.add(body);

        // Front windshield - large curved
        const windshieldGeometry = new THREE.BoxGeometry(0.5, 0.35, 0.08);
        const windshieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            shininess: 80
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.z = 0.22;
        windshield.position.x = 0.25;
        carGroup.add(windshield);

        // Headlights
        this.createHeadlights(carGroup, 0.3);

        // Door
        const doorGeometry = new THREE.BoxGeometry(0.25, 0.4, 0.02);
        const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.x = -0.15;
        door.position.z = 0.18;
        carGroup.add(door);

        // S21 Panel (mudur/maju indicator)
        const s21Geometry = new THREE.BoxGeometry(0.08, 0.12, 0.03);
        const s21Material = new THREE.MeshPhongMaterial({ color: 0xFF4500 });
        const s21 = new THREE.Mesh(s21Geometry, s21Material);
        s21.position.x = -0.35;
        s21.position.y = 0.2;
        s21.position.z = 0.2;
        s21.userData.isS21 = true;
        carGroup.add(s21);

        // Red line (mundur indicator)
        const redLineGeometry = new THREE.BoxGeometry(0.02, 0.4, 0.02);
        const redLineMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const redLine = new THREE.Mesh(redLineGeometry, redLineMaterial);
        redLine.position.x = -0.4;
        redLine.position.z = 0.2;
        redLine.userData.isRedLine = true;
        carGroup.add(redLine);

        // Bogie
        this.createBogie(carGroup);

        // Pantograph (atap)
        this.createPantograph(carGroup);

        // Windows side
        this.createSideWindows(carGroup, 3);

        carGroup.position.x = (index - 5.5) * 0.95;
        this.trainGroup.add(carGroup);
    }

    createPassengerCar(index) {
        const carGroup = new THREE.Group();

        // Determine livery - gerbong 1-6 merah naik, 7-12 wave
        const isFirstHalf = index < 6;
        const bodyColor = isFirstHalf ? 0xDC143C : 0xFFFFFF;
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(0.9, 0.48, 0.32);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: bodyColor,
            shininess: 80
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.z = 0.01;
        carGroup.add(body);

        // Livery stripe detail
        if (isFirstHalf) {
            // Red stripe naik (1-6)
            const stripeGeometry = new THREE.BoxGeometry(0.9, 0.1, 0.03);
            const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.y = 0.18;
            stripe.position.z = 0.17;
            carGroup.add(stripe);
        } else {
            // Wave pattern (7-12)
            for (let w = 0; w < 3; w++) {
                const waveGeometry = new THREE.BoxGeometry(0.25, 0.08, 0.03);
                const waveMaterial = new THREE.MeshPhongMaterial({ color: 0xDC143C });
                const wave = new THREE.Mesh(waveGeometry, waveMaterial);
                wave.position.x = -0.3 + (w * 0.45);
                wave.position.y = -0.15;
                wave.position.z = 0.17;
                carGroup.add(wave);
            }
        }

        // Doors (2 per car)
        for (let d = 0; d < 2; d++) {
            const doorGeometry = new THREE.BoxGeometry(0.2, 0.38, 0.02);
            const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.x = -0.3 + (d * 0.6);
            door.position.z = 0.18;
            carGroup.add(door);
        }

        // Windows (4 per car)
        this.createSideWindows(carGroup, 4);

        // Bogie
        this.createBogie(carGroup);

        // Pantograph
        this.createPantograph(carGroup);

        carGroup.position.x = (index - 5.5) * 0.95;
        this.trainGroup.add(carGroup);
    }

    createHeadlights(carGroup, xOffset) {
        // Left headlight
        const lightGeometry = new THREE.CircleGeometry(0.08, 32);
        const lightMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFF99,
            emissive: 0xFFFF00
        });
        const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
        leftLight.position.set(xOffset, 0.1, 0.24);
        carGroup.add(leftLight);

        const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
        rightLight.position.set(xOffset, -0.1, 0.24);
        carGroup.add(rightLight);
    }

    createSideWindows(carGroup, count) {
        for (let i = 0; i < count; i++) {
            const windowGeometry = new THREE.BoxGeometry(0.14, 0.18, 0.03);
            const windowMaterial = new THREE.MeshPhongMaterial({
                color: 0x87CEEB,
                emissive: 0x4da6ff,
                shininess: 100
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.x = -0.3 + (i * 0.225);
            window.position.z = 0.2;
            carGroup.add(window);
        }
    }

    createBogie(carGroup) {
        // Bogie frame
        const bogieFrameGeometry = new THREE.BoxGeometry(0.85, 0.08, 0.25);
        const bogieMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        const bogieFrame = new THREE.Mesh(bogieFrameGeometry, bogieMaterial);
        bogieFrame.position.y = -0.28;
        carGroup.add(bogieFrame);

        // Wheels
        for (let w = 0; w < 4; w++) {
            const wheelGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 32);
            const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.y = -0.28;
            wheel.position.x = -0.3 + (w * 0.2);
            carGroup.add(wheel);
        }
    }

    createPantograph(carGroup) {
        // Pantograph - di atas atap
        const pantographGroup = new THREE.Group();

        // Main rod
        const rodGeometry = new THREE.BoxGeometry(0.02, 0.25, 0.02);
        const rodMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x696969,
            shininess: 60
        });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.y = 0.3;
        pantographGroup.add(rod);

        // Horizontal arms
        for (let a = 0; a < 2; a++) {
            const armGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.02);
            const arm = new THREE.Mesh(armGeometry, rodMaterial);
            arm.position.y = 0.35 - (a * 0.08);
            pantographGroup.add(arm);
        }

        // Contact shoe
        const shoeGeometry = new THREE.BoxGeometry(0.15, 0.01, 0.02);
        const shoeMaterial = new THREE.MeshPhongMaterial({ color: 0x8B7355 });
        const shoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        shoe.position.y = 0.4;
        pantographGroup.add(shoe);

        carGroup.add(pantographGroup);
    }

    addWatermarkOnTrain() {
        // Watermark text on side of middle car (gerbong 6)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = 'rgba(220, 20, 60, 0.8)';
        ctx.fillRect(0, 0, 256, 64);

        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('By Dimas', 128, 32);

        // Gold outline
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeText('By Dimas', 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(0.6, 0.15);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const watermark = new THREE.Mesh(geometry, material);
        
        watermark.position.set(0.15, 0, 0.18);
        watermark.userData.isWatermark = true;

        // Add to 6th car (index 5)
        const cars = this.trainGroup.children;
        if (cars[5]) {
            cars[5].add(watermark);
        }
    }

    getTrainGroup() {
        return this.trainGroup;
    }

    rotateTrain(speed = 0.003) {
        this.trainGroup.rotation.y += speed;
    }

    // Toggle mundur/maju state
    setMundurMode(isMundur) {
        this.trainGroup.traverse((child) => {
            if (child.userData.isS21) {
                child.visible = isMundur;
            }
            if (child.userData.isRedLine) {
                child.visible = isMundur;
            }
        });
    }
}

// Export untuk digunakan di script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLI125TrainModel;
}
