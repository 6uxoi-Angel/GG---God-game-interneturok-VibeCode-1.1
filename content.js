(() => {
    const controller = new window.GodGameContentController();
    controller.run();

    // Register extension usage once (service worker keeps successful state).
    if (window === window.top && chrome?.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'godGame/registerUsagePing' }, () => {
            if (chrome.runtime.lastError) {
                console.warn('[GodGame] usage ping message failed:', chrome.runtime.lastError.message);
            }
        });
    }
})();
