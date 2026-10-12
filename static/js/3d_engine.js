/**
 * SmartHealth AI — 3D Interactive UI & Parallax Hologram Engine
 * Implements 3D Perspective Tilt, Holographic Specular Glare, and AJAX Dataset Synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
    init3DTilt();
    initGovReloadButton();
    init3DFloatingElements();
});

/**
 * 1. PURE 3D PERSPECTIVE TILT & SPECULAR GLARE
 */
function init3DTilt() {
    const tiltElements = document.querySelectorAll(
        '.card, .panel-card, .risk-card, .table-card, .stat-card, .intel-card, .vital-box, .ambient-card, [data-tilt]'
    );

    tiltElements.forEach(el => {
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = 'transform 0.15s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out';
        
        if (!el.querySelector('.glare-3d')) {
            const glare = document.createElement('div');
            glare.className = 'glare-3d';
            glare.style.cssText = `
                position: absolute;
                inset: 0;
                pointer-events: none;
                border-radius: inherit;
                background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.25s ease-out;
                z-index: 2;
            `;
            el.style.position = 'relative';
            el.appendChild(glare);
        }

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -9;
            const rotateY = ((x - centerX) / centerX) * 9;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
            el.style.boxShadow = `0 20px 40px -10px rgba(37, 99, 235, 0.22), 0 0 1px 1px rgba(255,255,255,0.9) inset`;
            
            const glare = el.querySelector('.glare-3d');
            if (glare) {
                glare.style.opacity = '1';
                glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.4) 0%, transparent 65%)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            el.style.boxShadow = '';
            const glare = el.querySelector('.glare-3d');
            if (glare) glare.style.opacity = '0';
        });
    });
}

/**
 * 2. 3D FLOATING ELEMENTS & PARALLAX GLOW
 */
function init3DFloatingElements() {
    const badges = document.querySelectorAll('.triage-badge, .avatar-circle, .brand-icon, .logo-icon');
    badges.forEach(b => {
        b.style.transformStyle = 'preserve-3d';
        b.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        b.addEventListener('mouseenter', () => {
            b.style.transform = 'scale(1.15) translateZ(25px) rotateZ(4deg)';
        });
        b.addEventListener('mouseleave', () => {
            b.style.transform = 'scale(1) translateZ(0px) rotateZ(0deg)';
        });
    });
}

/**
 * 3. RELIABLE AJAX RELOAD GOVERNMENT DATASETS HANDLER (WITH LIVE SPINNER & TOAST)
 */
function initGovReloadButton() {
    const reloadBtns = document.querySelectorAll('a[href="/import_gov_dataset"], #btnReloadGovDataset, .btn-reload-gov');
    
    reloadBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <span class="spinner-3d" style="display:inline-block; animation: spin3D 0.8s linear infinite; margin-right: 6px;">🔄</span>
                <span>Connecting to CDC &amp; NIH Repositories...</span>
            `;
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.85';
            btn.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.6)';

            try {
                const response = await fetch('/api/import_gov_dataset', { method: 'POST' });
                const result = await response.json();
                
                show3DToast(result.message || "✅ Successfully Synchronized 16 Government Clinical Cohorts!", "success");
                
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } catch (err) {
                window.location.href = '/import_gov_dataset';
            }
        });
    });
}

/**
 * 4. 3D FLOATING TOAST NOTIFICATION
 */
function show3DToast(message, type = 'success') {
    let toast = document.getElementById('toast3D');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast3D';
        toast.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            color: #ffffff;
            border: 1px solid rgba(0, 210, 255, 0.4);
            border-left: 5px solid #10b981;
            border-radius: 14px;
            padding: 16px 24px;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(16, 185, 129, 0.3);
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateY(100px) scale(0.9);
            opacity: 0;
            transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            backdrop-filter: blur(16px);
        `;
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 16px;">
            ${type === 'success' ? '✔' : 'ℹ'}
        </div>
        <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #34d399; letter-spacing: 0.5px;">Government Clinical Data Sync</div>
            <div>${message}</div>
        </div>
    `;

    setTimeout(() => {
        toast.style.transform = 'translateY(0) scale(1)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(100px) scale(0.9)';
        toast.style.opacity = '0';
    }, 4000);
}

const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes spin3D {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);
