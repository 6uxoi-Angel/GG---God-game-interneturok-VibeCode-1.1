const COUNTER_NAMESPACE = '6uxoi_angel_site';
const COUNTER_KEY = 'god_game_extension_users';
const STORAGE_KEY = 'godGameUsagePingState';
const MESSAGE_TYPE = 'godGame/registerUsagePing';
const TEST_PING_MESSAGE_TYPE = 'godGame/testSitePing';
const SITE_PING_URL = 'https://6uxoi-angel.github.io/site-main/';
const API_BASE_URL = 'https://gg-counter-api.artemrasputin3.workers.dev';
const COUNTER_HIT_ENDPOINTS = [
    `${API_BASE_URL}/v1/counters/${encodeURIComponent(COUNTER_KEY)}/hit`,
    `https://api.counterapi.dev/v1/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(COUNTER_KEY)}/up`,
    `https://api.countapi.xyz/hit/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(COUNTER_KEY)}`
];

let pingInFlight = null;

async function readState() {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    return data[STORAGE_KEY] || { success: false };
}

async function writeState(state) {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

async function pingSite() {
    const response = await fetch(SITE_PING_URL, {
        method: 'GET',
        cache: 'no-store',
        redirect: 'follow'
    });

    if (!response.ok) {
        throw new Error(`Site ping failed: HTTP ${response.status}`);
    }
}

async function testSitePing() {
    const startedAt = Date.now();
    try {
        const response = await fetch(SITE_PING_URL, {
            method: 'GET',
            cache: 'no-store',
            redirect: 'follow'
        });

        return {
            ok: response.ok,
            status: response.status,
            url: SITE_PING_URL,
            pingMs: Math.max(0, Date.now() - startedAt)
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            url: SITE_PING_URL,
            pingMs: Math.max(0, Date.now() - startedAt),
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

function extractCounterValue(payload) {
    const directValue = payload && typeof payload.value === 'number' ? payload.value : null;
    if (Number.isFinite(directValue)) {
        return directValue;
    }

    const dataValue = payload && payload.data && typeof payload.data.value === 'number' ? payload.data.value : null;
    if (Number.isFinite(dataValue)) {
        return dataValue;
    }

    const countValue = payload && typeof payload.count === 'number' ? payload.count : null;
    if (Number.isFinite(countValue)) {
        return countValue;
    }

    return null;
}

async function hitCounter() {
    const errors = [];

    for (const endpoint of COUNTER_HIT_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                cache: 'no-store'
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
            const text = error instanceof Error ? error.message : String(error);
            errors.push(`${endpoint} -> ${text}`);
        }
    }

    throw new Error(`Counter endpoints failed: ${errors.join(' | ')}`);
}

async function performPing(source) {
    const state = await readState();
    if (state.success === true) {
        return {
            ok: true,
            alreadyRegistered: true,
            value: state.value ?? null,
            provider: state.provider || null
        };
    }

    const attemptAt = new Date().toISOString();
    try {
        await pingSite();

        const counterResult = await hitCounter();
        const value = Number.isFinite(counterResult.value) ? counterResult.value : null;

        await writeState({
            success: true,
            pingedAt: new Date().toISOString(),
            value,
            source,
            site: SITE_PING_URL,
            provider: counterResult.endpoint
        });

        return {
            ok: true,
            alreadyRegistered: false,
            value,
            provider: counterResult.endpoint
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await writeState({
            success: false,
            lastAttemptAt: attemptAt,
            lastError: message,
            source
        });

        return { ok: false, error: message };
    }
}

function registerUsagePing(source) {
    if (!pingInFlight) {
        pingInFlight = performPing(source).finally(() => {
            pingInFlight = null;
        });
    }

    return pingInFlight;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.type) {
        return;
    }

    if (message.type === TEST_PING_MESSAGE_TYPE) {
        testSitePing()
            .then(sendResponse)
            .catch((error) => {
                const text = error instanceof Error ? error.message : String(error);
                sendResponse({ ok: false, status: 0, url: SITE_PING_URL, error: text });
            });

        return true;
    }

    if (message.type !== MESSAGE_TYPE) {
        return;
    }

    const source = sender?.url || sender?.origin || 'runtime-message';
    registerUsagePing(source)
        .then(sendResponse)
        .catch((error) => {
            const text = error instanceof Error ? error.message : String(error);
            sendResponse({ ok: false, error: text });
        });

    return true;
});
