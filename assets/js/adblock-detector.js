document.addEventListener('DOMContentLoaded', () => {
    const adBlockerMessage = document.getElementById('ad-blocker-message');
    const closeAdBlockerMessage = document.getElementById('close-ad-blocker-message');

    // Create a dummy ad element that ad blockers typically hide
    const testAd = document.createElement('div');
    testAd.className = 'adsbox'; // Common class name for ads
    testAd.style.position = 'absolute';
    testAd.style.left = '-9999px'; // Position off-screen
    testAd.style.top = '-9999px';
    testAd.style.height = '1px';
    testAd.style.width = '1px';
    document.body.appendChild(testAd);

    setTimeout(() => {
        const isAdBlocked = window.getComputedStyle(testAd).getPropertyValue('display') === 'none' ||
                           window.getComputedStyle(testAd).getPropertyValue('visibility') === 'hidden' ||
                           testAd.offsetHeight === 0 ||
                           testAd.offsetWidth === 0;

        if (isAdBlocked) {
            adBlockerMessage.classList.remove('hidden');
            console.log('Ad blocker detected!');
        } else {
            console.log('No ad blocker detected or it did not hide the test element.');
        }

        // Remove the test ad element
        document.body.removeChild(testAd);
    }, 100); // Give ad blockers a moment to act

    // Allow user to dismiss the message
    if (closeAdBlockerMessage) {
        closeAdBlockerMessage.addEventListener('click', () => {
            adBlockerMessage.classList.add('hidden');
        });
    }
});