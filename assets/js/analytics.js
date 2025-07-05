// This script will initialize Google Analytics 4 (GA4)
// It checks for cookie consent before activating non-essential tracking.

document.addEventListener('DOMContentLoaded', () => {
    const COOKIE_CONSENT_KEY = 'modcore_cookie_consent';

    function getCookieConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    function initializeGoogleAnalytics() {
        const consent = getCookieConsent();

        // Default to denied if no consent is found yet, or if analytics is not consented
        const analytics_storage_status = (consent && consent.analytics) ? 'granted' : 'denied';
        const ad_storage_status = (consent && consent.advertising) ? 'granted' : 'denied';

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}

        gtag('consent', 'default', {
            'ad_storage': ad_storage_status,
            'analytics_storage': analytics_storage_status,
            'wait_for_update': 500 // Wait for cookie banner interaction
        });

        gtag('js', new Date());
        gtag('config', 'YOUR_GA4_MEASUREMENT_ID'); // Replace with your GA4 Measurement ID (e.g., G-XXXXXXXXXX)

        console.log('Google Analytics initialized with consent:', {
            ad_storage: ad_storage_status,
            analytics_storage: analytics_storage_status
        });
    }

    // Initialize GA on page load
    initializeGoogleAnalytics();

    // Listen for cookie consent changes from main.js to update GA consent mode
    window.addEventListener('cookieConsentUpdated', () => {
        initializeGoogleAnalytics(); // Re-run to update consent status
    });
});