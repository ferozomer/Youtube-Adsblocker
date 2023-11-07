// ==UserScript==
// @name         YouTube Wthout Ads Experience
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Improve your YouTube experience by removing ads and popups.
// @author       Ferozomer
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options
    const config = {
        adblockerEnabled: true,
        removePopupEnabled: true,
        debugEnabled: true
    };

    
    const debugLog = (message) => {
        if (config.debugEnabled) console.log(`[YT Enhancer]: ${message}`);
    };

    // Remove specific JSON paths from YouTube responses
    const removeJSONPaths = (jsonPaths) => {
        jsonPaths.forEach((path) => {
            let obj = window;
            path.split('.').forEach((part) => {
                if (obj.hasOwnProperty(part)) {
                    delete obj[part];
                    obj = obj[part];
                }
            });
        });
    };

   
    const handleAds = () => {
        const selectors = {
            skipButton: '.videoAdUiSkipButton, .ytp-ad-skip-button',
            adOverlay: '.ad-showing',
            sidebarAd: 'ytd-action-companion-ad-renderer',
            displayAd: '#root.style-scope.ytd-display-ad-renderer',
            sparklesAd: '#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer',
            videoAd: 'ytd-promoted-video-renderer',
            feedAd: 'ytd-in-feed-ad-layout-renderer',
            mastheadAd: '.ytd-video-masthead-ad-v3-renderer',
            sponsorSection: 'div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy',
            nonVideoAd: '.ytp-ad-skip-button-modern'
        };

        // Skip ads
        const skipAd = () => {
            const skipBtn = document.querySelector(selectors.skipButton);
            if (skipBtn) skipBtn.click();
        };

        // Remove ad elements
        const removeAdElements = () => {
            Object.values(selectors).forEach((selector) => {
                document.querySelectorAll(selector).forEach((el) => el.remove());
            });
        };

        skipAd();
        removeAdElements();
    };

    
    const handlePopups = () => {
        const popupSelectors = [
            'tp-yt-iron-overlay-backdrop',
            '.style-scope ytd-enforcement-message-view-model',
            '#dismiss-button'
        ];

        popupSelectors.forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.click ? element.click() : element.remove();
                debugLog('Popup removed.');
            }
        });
    };

    
    const main = () => {
        if (config.adblockerEnabled) handleAds();
        if (config.removePopupEnabled) handlePopups();
    };

    
    main();
    setInterval(main, 1000);

    
    if (config.removePopupEnabled) {
        const observer = new MutationObserver(main);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    
    window.YTEnhancer = { debugLog, config };
})();
