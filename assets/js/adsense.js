// This script specifically handles Google AdSense loading based on consent.

document.addEventListener('DOMContentLoaded', () => {
    const COOKIE_CONSENT_KEY = 'modcore_cookie_consent';

    function getCookieConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    function loadAdSense() {
        const consent = getCookieConsent();
        if (consent && consent.advertising) {
            // Ensure the adsbygoogle array exists
            window.adsbygoogle = window.adsbygoogle || [];
            // Push any pending ad units. The main script already has the async tag.
            // This re-pushes ads if consent was granted after initial page load.
            document.querySelectorAll('ins.adsbygoogle').forEach(adUnit => {
                if (!adUnit.getAttribute('data-ad-client')) {
                    adUnit.setAttribute('data-ad-client', 'YOUR_ADSENSE_PUBLISHER_ID'); // Replace
                    adUnit.setAttribute('data-ad-slot', 'YOUR_ADSENSE_AD_UNIT_SLOT_ID'); // Replace
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            });
            console.log('Google AdSense ads pushed/loaded.');
        } else {
            console.log('Google AdSense blocked due to consent preferences.');
            // Optionally hide or remove ad units if consent is denied
            document.querySelectorAll('ins.adsbygoogle').forEach(adUnit => {
                adUnit.style.display = 'none'; // Hide ads if consent not given
            });
        }
    }

    // Initial load check
    loadAdSense();

    // Listen for cookie consent changes from main.js
    window.addEventListener('cookieConsentUpdated', loadAdSense);
});