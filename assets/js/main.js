document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Cookie Banner Implementation (Open Source - Basic Example) ---
    // For a more robust, commercially-viable open-source solution, consider:
    // - CookieConsent (OrestBida/cookieconsent on GitHub)
    // - Klaro! (kiprotect/klaro on GitHub)
    // - Silktide's free cookie banner (silktide.com/consent-manager) - requires their script

    // For simplicity and demonstration, here's a basic custom one.
    // **Highly recommend integrating a dedicated open-source cookie consent library for full GDPR compliance.**

    const cookieBannerContainer = document.getElementById('cookie-banner-container');
    const COOKIE_CONSENT_KEY = 'modcore_cookie_consent';

    function showCookieBanner() {
        if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
            cookieBannerContainer.innerHTML = `
                <div id="cookie-banner">
                    <p>We use cookies to improve your experience and for analytics and advertising purposes. By clicking "Accept All", you consent to the use of ALL cookies. You can customize your preferences below.</p>
                    <div id="cookie-preferences">
                        <label>
                            <input type="checkbox" id="cookie-necessary" checked disabled> Necessary
                        </label>
                        <label>
                            <input type="checkbox" id="cookie-analytics"> Analytics
                        </label>
                        <label>
                            <input type="checkbox" id="cookie-advertising"> Advertising
                        </label>
                    </div>
                    <div>
                        <button id="accept-all-cookies">Accept All</button>
                        <button id="accept-selected-cookies">Accept Selected</button>
                        <button id="decline-all-cookies">Decline All</button>
                    </div>
                </div>
            `;
            const acceptAllBtn = document.getElementById('accept-all-cookies');
            const acceptSelectedBtn = document.getElementById('accept-selected-cookies');
            const declineAllBtn = document.getElementById('decline-all-cookies');
            const analyticsCheckbox = document.getElementById('cookie-analytics');
            const advertisingCheckbox = document.getElementById('cookie-advertising');

            acceptAllBtn.addEventListener('click', () => {
                setCookieConsent({ necessary: true, analytics: true, advertising: true });
                hideCookieBanner();
            });

            acceptSelectedBtn.addEventListener('click', () => {
                setCookieConsent({
                    necessary: true,
                    analytics: analyticsCheckbox.checked,
                    advertising: advertisingCheckbox.checked
                });
                hideCookieBanner();
            });

            declineAllBtn.addEventListener('click', () => {
                setCookieConsent({ necessary: true, analytics: false, advertising: false });
                hideCookieBanner();
            });
        }
    }

    function hideCookieBanner() {
        if (cookieBannerContainer) {
            cookieBannerContainer.innerHTML = '';
        }
    }

    function setCookieConsent(consentObject) {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentObject));
        // Trigger re-initialization of GA/AdSense based on consent
        window.dispatchEvent(new Event('cookieConsentUpdated'));
    }

    function getCookieConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    // Show cookie banner on page load
    showCookieBanner();

    // Event listener for cookie consent updates (used by analytics.js and adsense.js)
    window.addEventListener('cookieConsentUpdated', () => {
        console.log('Cookie consent updated:', getCookieConsent());
        // Re-evaluate if GA and AdSense scripts should run
        if (getCookieConsent() && getCookieConsent().analytics) {
            // Re-initialize analytics if consent given
            window.gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted'
            });
            console.log('Google Analytics consent granted.');
        } else {
             window.gtag('consent', 'update', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
            });
            console.log('Google Analytics consent denied or not yet given.');
        }

        if (getCookieConsent() && getCookieConsent().advertising) {
             // Re-initialize AdSense if consent given
             // Note: AdSense is primarily controlled by the 'adsbygoogle.js' script.
             // You might need to reload or re-push ads if consent changes.
             // Google Consent Mode v2 helps here.
             console.log('Google AdSense consent granted.');
             // You might want to re-push ads if they were blocked initially
             // For simplicity, we assume adsense.js handles initial load based on consent.
        } else {
            console.log('Google AdSense consent denied or not yet given.');
        }
    });

    // Trigger an initial consent check for scripts that load after the banner
    window.dispatchEvent(new Event('cookieConsentUpdated'));
});