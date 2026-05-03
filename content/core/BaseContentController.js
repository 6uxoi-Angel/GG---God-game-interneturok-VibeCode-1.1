class GodGameContentControllerBase {
    safeInvoke(fn) {
        try {
            return fn();
        } catch (error) {
            console.error('[GodGameContentControllerBase] runtime error', error);
            return null;
        }
    }
}

window.GodGameContentControllerBase = GodGameContentControllerBase;
