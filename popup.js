document.addEventListener('DOMContentLoaded', () => {
    const controller = new window.GodGamePopupController();
    controller.initialize();

    const SITE_PING_URL = 'https://6uxoi-angel.github.io/site-main/';
    const API_BASE_URL = 'https://gg-counter-api.artemrasputin3.workers.dev';
    const COUNTER_KEY = 'god_game_extension_users';
    const STORAGE_KEY = 'godGameUsagePingState';
    const COUNTER_HIT_ENDPOINTS = [
        `${API_BASE_URL}/v1/counters/${COUNTER_KEY}/hit`,
        'https://api.counterapi.dev/v1/6uxoi_angel_site/god_game_extension_users/up',
        'https://api.countapi.xyz/hit/6uxoi_angel_site/god_game_extension_users'
    ];

    function extractCounterValue(payload) {
        if (payload && typeof payload.value === 'number') {
            return payload.value;
        }

        if (payload && payload.data && typeof payload.data.value === 'number') {
            return payload.data.value;
        }

        if (payload && typeof payload.count === 'number') {
            return payload.count;
        }

        return null;
    }

    async function readUsageState() {
        try {
            const data = await chrome.storage.local.get(STORAGE_KEY);
            return data && data[STORAGE_KEY] ? data[STORAGE_KEY] : { success: false };
        } catch (error) {
            return { success: false, lastError: error instanceof Error ? error.message : String(error) };
        }
    }

    async function writeUsageState(state) {
        await chrome.storage.local.set({ [STORAGE_KEY]: state });
    }

    async function pingSite() {
        const startedAt = Date.now();

        try {
            const response = await fetch(SITE_PING_URL, {
                method: 'GET',
                cache: 'no-store',
                redirect: 'follow'
            });

            return {
                ok: Boolean(response.ok),
                status: Number(response.status || 0),
                pingMs: Math.max(0, Date.now() - startedAt),
                url: SITE_PING_URL,
                error: ''
            };
        } catch (error) {
            return {
                ok: false,
                status: 0,
                pingMs: Math.max(0, Date.now() - startedAt),
                url: SITE_PING_URL,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    async function hitCounter() {
        const errors = [];

        for (const endpoint of COUNTER_HIT_ENDPOINTS) {
            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    cache: 'no-store',
                    redirect: 'follow'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const payload = await response.json();
                return {
                    value: extractCounterValue(payload),
                    endpoint
                };
            } catch (error) {
                errors.push(`${endpoint} -> ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        throw new Error(errors.join(' | '));
    }

    async function registerUsageFromPopup(source) {
        const currentState = await readUsageState();
        if (currentState.success === true) {
            return { ok: true, alreadyRegistered: true, value: currentState.value ?? null };
        }

        const attemptAt = new Date().toISOString();

        try {
            const siteResult = await pingSite();
            if (!siteResult.ok) {
                throw new Error(`Site ping failed: status ${siteResult.status || 0}${siteResult.error ? `, ${siteResult.error}` : ''}`);
            }

            const counterResult = await hitCounter();
            const value = Number.isFinite(counterResult.value) ? counterResult.value : null;

            await writeUsageState({
                success: true,
                pingedAt: new Date().toISOString(),
                source,
                site: SITE_PING_URL,
                siteStatus: siteResult.status,
                sitePingMs: siteResult.pingMs,
                provider: counterResult.endpoint,
                value
            });

            return { ok: true, alreadyRegistered: false, value };
        } catch (error) {
            const text = error instanceof Error ? error.message : String(error);

            await writeUsageState({
                success: false,
                lastAttemptAt: attemptAt,
                source,
                lastError: text
            });

            return { ok: false, error: text };
        }
    }

    registerUsageFromPopup('popup-open').then((result) => {
        if (!result.ok) {
            console.warn('[GodGame] popup usage registration failed:', result.error || 'unknown error');
        }
    });
});
