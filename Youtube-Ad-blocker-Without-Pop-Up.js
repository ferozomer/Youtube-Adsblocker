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

(function()
 {
    
    const adblocker = true;
    const removePopup = true;
    const debug = true;
    const domainsToRemove = [
        '*.youtube-nocookie.com/*'
    ];
    const jsonPathsToRemove = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    const observerConfig = {
        childList: true,
        subtree: true
    };

    const keyEvent = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      keyCode: 75,
      which: 75,
      bubbles: true,
      cancelable: true,
      view: window
    });

    let mouseEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    let unpausedAfterSkip = 0;

    if (debug) console.log("Remove Adblock Thing: Script started");
    // Old variable but could work in some cases
    window.__ytplayer_adblockDetected = false;

    if(adblocker) addblocker();
    if(removePopup) popupRemover();
    if(removePopup) observer.observe(document.body, observerConfig);

    // Remove Them pesski popups
    function popupRemover() {
        removeJsonPaths(domainsToRemove, jsonPathsToRemove);
        setInterval(() => {

            const fullScreenButton = document.querySelector(".ytp-fullscreen-button");
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");
            // const popupButton2 = document.getElementById("ytp-play-button ytp-button");

            const video1 = document.querySelector("#movie_player > video.html5-main-video");
            const video2 = document.querySelector("#movie_player > .html5-video-container > video");

            const bodyStyle = document.body.style;

            bodyStyle.setProperty('overflow-y', 'auto', 'important');

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                if (debug) console.log("Disabling Adblock Feature: Popup identified, proceeding with removal...");

                if(popupButton) popupButton.click();
                // if(popupButton2) popupButton2.click();
                popup.remove();
                unpausedAfterSkip = 2;

                fullScreenButton.dispatchEvent(mouseEvent);
              
                setTimeout(() => {
                  fullScreenButton.dispatchEvent(mouseEvent);
                }, 500);

                if (debug) console.log("Disable Adblock Component: Popup successfully Removed");
            }

            if (!unpausedAfterSkip > 0) return;

            // UnPause The Video
            unPauseVideo(video1);
            unPauseVideo(video2);

        }, 1000);
    }
    function addblocker()
    {
        setInterval(() =>
                    {
            const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
            const ad = [...document.querySelectorAll('.ad-showing')][0];
            const sidAd = document.querySelector('ytd-action-companion-ad-renderer');
            const displayAd = document.querySelector('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
            const sparklesContainer = document.querySelector('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
            const mainContainer = document.querySelector('div#main-container.style-scope.ytd-promoted-video-renderer');
            const feedAd = document.querySelector('ytd-in-feed-ad-layout-renderer');
            const mastheadAd = document.querySelector('.ytd-video-masthead-ad-v3-renderer');
            const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");
            const nonVid = document.querySelector(".ytp-ad-skip-button-modern");

            if (ad)
            {
                const video = document.querySelector('video');
                video.playbackRate = 10;
                video.volume = 0;
                video.currentTime = video.duration;
                skipBtn?.click();
            }

            sidAd?.remove();
            displayAd?.remove();
            sparklesContainer?.remove();
            mainContainer?.remove();
            feedAd?.remove();
            mastheadAd?.remove();
            sponsor?.forEach((element) => {
                 if (element.getAttribute("id") === "panels") {
                    element.childNodes?.forEach((childElement) => {
                      if (childElement.data.targetId && childElement.data.targetId !=="engagement-panel-macro-markers-description-chapters")
                          //Skipping the Chapters section
                            childElement.remove();
                          });
                       } else {
                           element.remove();
                       }
             });
            nonVid?.click();
        }, 50)
    }
    function unPauseVideo(video)
    {
        if (!video) return;
        if (video.paused) {
            document.dispatchEvent(keyEvent);
            unpausedAfterSkip = 0;
            if (debug) console.log("Adblock Component Removed: Resumed video playback with 'P' key");
        } else if (unpausedAfterSkip > 0) unpausedAfterSkip--;
    }
    function removeJsonPaths(domains, jsonPaths)
    {
        const currentDomain = window.location.hostname;
        if (!domains.includes(currentDomain)) return;

        jsonPaths.forEach(jsonPath => {
            const pathParts = jsonPath.split('.');
            let obj = window;
            let previousObj = null;
            let partToSetUndefined = null;
        
            for (const part of pathParts) {
                if (obj.hasOwnProperty(part)) {
                    previousObj = obj;
                    partToSetUndefined = part; 
                    obj = obj[part];
                } else {
                    break; 
                }
            }
        
            if (previousObj && partToSetUndefined !== null) {
                previousObj[partToSetUndefined] = undefined;
            }
        });
    }
    const observer = new MutationObserver(() =>
    {
        removeJsonPaths(domainsToRemove, jsonPathsToRemove);
    });
})();
