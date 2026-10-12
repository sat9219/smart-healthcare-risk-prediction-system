/**
 * SmartHealth AI — Universal 3D Ambient Medical Background Animation Engine
 * Features: 3D Particle Constellations, Synaptic Neural Connections, Rotating DNA Helix Waves,
 * and Interactive 3D Cursor Parallax. Zero dependencies, ultra-smooth 60fps canvas render.
 */

(function() {
    // Prevent multiple initializations
    if (window._3dBackgroundInitialized) return;
    window._3dBackgroundInitialized = true;

    function create3DCanvas() {
        // Remove existing if present
        let existing = document.getElementById('global3DCanvas');
        if (existing) existing.remove();

        const canvas = document.createElement('canvas');
        canvas.id = 'global3DCanvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 0;
            pointer-events: none;
            opacity: 0.92;
        `;

        // Insert as very first element in body
        if (document.body.firstChild) {
            document.body.insertBefore(canvas, document.body.firstChild);
        } else {
            document.body.appendChild(canvas);
        }

        // Add ambient glowing orbs behind canvas
        if (!document.querySelector('.ambient-aurora-orbs')) {
            const orbs = document.createElement('div');
            orbs.className = 'ambient-aurora-orbs';
            orbs.innerHTML = `
                <div style="position:fixed; width:650px; height:650px; border-radius:50%; background:radial-gradient(circle, rgba(0,210,255,0.14), transparent 70%); top:-120px; right:-100px; filter:blur(90px); pointer-events:none; z-index:0; animation: floatOrb1 18s ease-in-out infinite alternate;"></div>
                <div style="position:fixed; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%); bottom:-150px; left:120px; filter:blur(100px); pointer-events:none; z-index:0; animation: floatOrb2 22s ease-in-out infinite alternate-reverse;"></div>
                <div style="position:fixed; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%); top:35%; right:22%; filter:blur(85px); pointer-events:none; z-index:0; animation: floatOrb1 20s ease-in-out infinite alternate;"></div>
                <style>
                    @keyframes floatOrb1 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(45px, 35px) scale(1.08); } 100% { transform: translate(-35px, 60px) scale(0.95); } }
                    @keyframes floatOrb2 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px, -40px) scale(1.1); } 100% { transform: translate(40px, -30px) scale(0.92); } }
                </style>
            `;
            document.body.insertBefore(orbs, canvas);
        }

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // 3D Parallax Camera
        let mouseX = 0, mouseY = 0;
        let targetRotX = 0, targetRotY = 0;
        let rotX = 0, rotY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - width / 2) / (width / 2);
            mouseY = (e.clientY - height / 2) / (height / 2);
            targetRotY = mouseX * 0.4;
            targetRotX = -mouseY * 0.4;
        });

        // 3D Particle Cloud
        const PARTICLE_COUNT = 150;
        const particles = [];
        const fov = 480;
        const colors = ['#00d2ff', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'];

        class Particle3D {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = (Math.random() - 0.5) * 1500;
                this.y = (Math.random() - 0.5) * 1000;
                this.z = Math.random() * 1100 - 250;
                this.vx = (Math.random() - 0.5) * 0.55;
                this.vy = (Math.random() - 0.5) * 0.55;
                this.vz = (Math.random() - 0.5) * 0.75;
                this.radius = Math.random() * 2.6 + 1.2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;

                if (this.x > 750) this.x = -750;
                if (this.x < -750) this.x = 750;
                if (this.y > 500) this.y = -500;
                if (this.y < -500) this.y = 500;
                if (this.z > 850) this.z = -250;
                if (this.z < -250) this.z = 850;
            }
        }

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle3D());
            }
        }
        initParticles();

        // 3D Rotating DNA Helix Animation
        let helixAngle = 0;

        function animate3D() {
            ctx.clearRect(0, 0, width, height);

            rotX += (targetRotX - rotX) * 0.05;
            rotY += (targetRotY - rotY) * 0.05;
            helixAngle += 0.018;

            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            const projected = [];

            // 1. Render 3D Particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();

                let x1 = p.x * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.x * sinY;
                let y1 = p.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.y * sinX;

                const scale = fov / (fov + z2 + 350);
                if (scale > 0) {
                    const x2d = x1 * scale + width / 2;
                    const y2d = y1 * scale + height / 2;
                    const r2d = p.radius * scale;

                    projected.push({ x: x2d, y: y2d, z: z2, scale, color: p.color, r: r2d });

                    ctx.beginPath();
                    ctx.arc(x2d, y2d, Math.max(r2d, 0.7), 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 6 * scale;
                    ctx.globalAlpha = Math.min(Math.max((scale - 0.15) * 1.5, 0.08), 0.85);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // 2. Render 3D Synaptic Connecting Rays
            ctx.lineWidth = 0.55;
            for (let i = 0; i < projected.length; i++) {
                for (let j = i + 1; j < projected.length; j++) {
                    const p1 = projected[i];
                    const p2 = projected[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 105) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const alpha = (1 - dist / 105) * 0.22 * Math.min(p1.scale, p2.scale);
                        ctx.strokeStyle = p1.color;
                        ctx.globalAlpha = Math.max(alpha, 0);
                        ctx.stroke();
                    }
                }
            }

            // 3. Render 3D Floating DNA Ribbon Waves
            ctx.globalAlpha = 0.28;
            ctx.lineWidth = 1.6;
            for (let strand = 0; strand < 2; strand++) {
                const phase = strand * Math.PI;
                ctx.beginPath();
                for (let k = -35; k <= 35; k++) {
                    const t = k * 0.13 + helixAngle;
                    const x3d = k * 30;
                    const y3d = Math.sin(t + phase) * 135;
                    const z3d = Math.cos(t + phase) * 175 + 80;

                    let xRot = x3d * cosY - z3d * sinY;
                    let zRot = z3d * cosY + x3d * sinY;
                    let yRot = y3d * cosX - zRot * sinX;
                    let zFin = zRot * cosX + y3d * sinX;

                    const scale = fov / (fov + zFin + 350);
                    const x2 = xRot * scale + width / 2;
                    const y2 = yRot * scale + height / 2;

                    if (k === -35) ctx.moveTo(x2, y2);
                    else ctx.lineTo(x2, y2);

                    // Cross rungs connecting DNA strands
                    if (strand === 0 && k % 4 === 0) {
                        const yOpp = Math.sin(t + Math.PI) * 135;
                        const zOpp = Math.cos(t + Math.PI) * 175 + 80;
                        let xR2 = x3d * cosY - zOpp * sinY;
                        let zR2 = zOpp * cosY + x3d * sinY;
                        let yR2 = yOpp * cosX - zR2 * sinX;
                        let zF2 = zR2 * cosX + yOpp * sinX;
                        const sc2 = fov / (fov + zF2 + 350);
                        const xOpp2d = xR2 * sc2 + width / 2;
                        const yOpp2d = yR2 * sc2 + height / 2;

                        ctx.moveTo(x2, y2);
                        ctx.lineTo(xOpp2d, yOpp2d);
                    }
                }
                ctx.strokeStyle = strand === 0 ? '#00d2ff' : '#10b981';
                ctx.stroke();
            }

            requestAnimationFrame(animate3D);
        }

        animate3D();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', create3DCanvas);
    } else {
        create3DCanvas();
    }
})();
