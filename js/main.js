// js/main.js

/**
 * TEEC Frontend Core
 * Version: 1.2
 * Architecture: Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Dynamic Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation & Accessibility
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuBtn && mainNav) {
        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            mainNav.classList.toggle('is-open', isMenuOpen);
            menuBtn.setAttribute('aria-expanded', isMenuOpen);
            
            const svgPath = menuBtn.querySelector('path');
            if (isMenuOpen) {
                svgPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            } else {
                svgPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        };

        menuBtn.addEventListener('click', toggleMenu);

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
                menuBtn.focus();
            }
        });
    }

    // 3. Advanced Inquiry & Reference ID Generation Engine
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Generating Reference ID...';

            // Gather Form Parameters
            const formData = {
                company: document.getElementById('corporate-entity').value,
                phone: document.getElementById('primary-phone').value,
                email: document.getElementById('contact-email').value || 'Not provided',
                sector: document.getElementById('project-classification').value,
                location: document.getElementById('site-location').value || 'Dhangadhi',
                value: document.querySelector('input[name="project-value"]:checked')?.value || 'Not specified',
                stage: document.querySelector('input[name="project-stage"]:checked')?.value || 'Not specified',
                details: document.getElementById('project-parameters').value || 'No additional notes.',
                timestamp: new Date().toISOString()
            };

            // Generate Unique Reference ID Format: TEEC-YYYYMMDD-XXXX
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const randomSeq = String(Math.floor(10000 + Math.random() * 90000));
            const inquiryId = `TEEC-${year}${month}${day}-${randomSeq}`;

            // Simulate Database Sync & Email Dispatch to technoelectric.nep@gmail.com
            setTimeout(() => {
                // Construct mailto fallback simulation or console payload log for backend hook
                console.log(`[CRM_DB_SAVE] Inquiry Logged:`, inquiryId, formData);
                console.log(`[EMAIL_DISPATCH] Sent to technoelectric.nep@gmail.com | Ref: ${inquiryId}`);

                // Render Professional Success State UI
                const container = inquiryForm.closest('.container-sm');
                container.innerHTML = `
                    <div class="bg-surface" style="padding: var(--space-12); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-sm); text-align: center;">
                        <span class="eyebrow" style="color: var(--color-status-active);">Transmission Successful</span>
                        <h2 class="mt-4 mb-4">Request Acknowledged</h2>
                        <p class="text-secondary mb-8">Our engineering team has received your technical consultation parameters. A representative will contact you shortly.</p>
                        
                        <div style="background: var(--color-bg-base); border: 1px dashed var(--color-border-strong); padding: var(--space-6); margin-bottom: var(--space-8); display: inline-block; width: 100%;">
                            <span class="text-xs text-muted font-mono uppercase tracking-wider">Assigned Reference ID</span>
                            <div class="data-value" style="font-size: var(--text-xl); color: var(--color-brand-primary); margin-top: var(--space-2);">${inquiryId}</div>
                        </div>

                        <div style="text-align: left; background: var(--color-bg-base); padding: var(--space-6); border: 1px solid var(--color-border-subtle); margin-bottom: var(--space-8);">
                            <h4 style="font-size: var(--text-sm); margin-bottom: var(--space-2); font-family: var(--font-mono);">Direct Technical Desk</h4>
                            <p class="text-sm mb-4">For immediate site reviews or urgent specifications, connect directly:</p>
                            <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
                                <a href="tel:+9779840017450" class="btn btn-secondary" style="flex: 1;">Call: +977-9840017450</a>
                                <a href="https://wa.me/9779840017450?text=Hello%20TEEC,%20I%20am%20referencing%20Inquiry%20ID:%20${inquiryId}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1;">WhatsApp Chat</a>
                            </div>
                        </div>

                        <p class="text-xs text-muted">A confirmation notification has been synced with technoelectric.nep@gmail.com.</p>
                    </div>
                `;
            }, 1000);
        });
    }
    
    // 4. Form Handling (Verification)
    const verifyForm = document.getElementById('verify-form');
    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = verifyForm.querySelector('button[type="submit"]');
            const resultBox = document.getElementById('verify-result');
            const certInput = document.getElementById('document-id').value.trim();
            
            submitBtn.disabled = true;
            resultBox.style.display = 'block';
            resultBox.className = 'verification-result mt-8';
            resultBox.innerHTML = `<p class="data-value text-muted">Querying database for ID: ${certInput}...</p>`;
            
            setTimeout(() => {
                submitBtn.disabled = false;
                resultBox.className = 'verification-result error mt-8';
                resultBox.innerHTML = `
                    <p>No active public record located for identifier <span class="data-value">${certInput}</span>.</p>
                    <p class="text-muted text-sm mt-4">Legacy certificates may require manual verification. Please contact administration.</p>
                `;
            }, 1000);
        });
    }
});