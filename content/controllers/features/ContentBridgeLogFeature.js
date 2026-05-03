class ContentBridgeLogFeature extends window.ContentFeatureBase {
    stringifyLogDetails(...args) {
        return __ContentBridgeLogFeature_stringifyLogDetails(this.ctx, ...args);
    }

    appendScannerLog(...args) {
        return __ContentBridgeLogFeature_appendScannerLog(this.ctx, ...args);
    }

    exportScannerLogsText(...args) {
        return __ContentBridgeLogFeature_exportScannerLogsText(this.ctx, ...args);
    }

    logInfo(...args) {
        return __ContentBridgeLogFeature_logInfo(this.ctx, ...args);
    }

    logWarn(...args) {
        return __ContentBridgeLogFeature_logWarn(this.ctx, ...args);
    }

    logError(...args) {
        return __ContentBridgeLogFeature_logError(this.ctx, ...args);
    }

    makeRequestId(...args) {
        return __ContentBridgeLogFeature_makeRequestId(this.ctx, ...args);
    }

    injectPageBridge(...args) {
        return __ContentBridgeLogFeature_injectPageBridge(this.ctx, ...args);
    }

    sendToPage(...args) {
        return __ContentBridgeLogFeature_sendToPage(this.ctx, ...args);
    }

    wait(...args) {
        return __ContentBridgeLogFeature_wait(this.ctx, ...args);
    }

    makeAbsoluteUrl(...args) {
        return __ContentBridgeLogFeature_makeAbsoluteUrl(this.ctx, ...args);
    }

    measureSitePing(...args) {
        return __ContentBridgeLogFeature_measureSitePing(this.ctx, ...args);
    }
}

function __ContentBridgeLogFeature_stringifyLogDetails(ctx, ...args) {
    with (ctx) {
        return (function stringifyLogDetails(details) {
        if (details === undefined) {
            return '';
        }

        if (details instanceof Error) {
            return `${details.name}: ${details.message}`;
        }

        try {
            return JSON.stringify(details);
        } catch (_error) {
            return String(details);
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_appendScannerLog(ctx, ...args) {
    with (ctx) {
        return (function appendScannerLog(level, message, details) {
        const entry = {
            ts: new Date().toISOString(),
            level,
            message: String(message || ''),
            details: stringifyLogDetails(details)
        };

        scannerLogs.push(entry);
        if (scannerLogs.length > MAX_SCANNER_LOGS) {
            scannerLogs.splice(0, scannerLogs.length - MAX_SCANNER_LOGS);
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_exportScannerLogsText(ctx, ...args) {
    with (ctx) {
        return (function exportScannerLogsText() {
        const lines = [
            `God Game Question Scanner logs`,
            `Generated: ${new Date().toISOString()}`,
            `URL: ${location.href}`,
            `Stored entries: ${scannerLogs.length}`,
            ''
        ];

        scannerLogs.forEach((entry) => {
            lines.push(`[${entry.ts}] ${entry.level.toUpperCase()} ${entry.message}${entry.details ? ` | ${entry.details}` : ''}`);
        });

        return lines.join('\n');
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_logInfo(ctx, ...args) {
    with (ctx) {
        return (function logInfo(message, details) {
        appendScannerLog('info', message, details);
        if (details !== undefined) {
            console.info(SCAN_LOG_PREFIX, message, details);
        } else {
            console.info(SCAN_LOG_PREFIX, message);
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_logWarn(ctx, ...args) {
    with (ctx) {
        return (function logWarn(message, details) {
        appendScannerLog('warn', message, details);
        if (details !== undefined) {
            console.warn(SCAN_LOG_PREFIX, message, details);
        } else {
            console.warn(SCAN_LOG_PREFIX, message);
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_logError(ctx, ...args) {
    with (ctx) {
        return (function logError(message, details) {
        appendScannerLog('error', message, details);
        if (details !== undefined) {
            console.error(SCAN_LOG_PREFIX, message, details);
        } else {
            console.error(SCAN_LOG_PREFIX, message);
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_makeRequestId(ctx, ...args) {
    with (ctx) {
        return (function makeRequestId() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }

        return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_injectPageBridge(ctx, ...args) {
    with (ctx) {
        return (function injectPageBridge() {
        if (bridgeInjected || document.getElementById(INJECTED_SCRIPT_MARKER)) {
            return;
        }

        bridgeInjected = true;
        const script = document.createElement('script');
        script.id = INJECTED_SCRIPT_MARKER;
        script.src = chrome.runtime.getURL('injected.js');
        script.async = false;

        script.onload = () => {
            script.remove();
        };

        script.onerror = () => {
            bridgeInjected = false;
            logError('Не удалось загрузить injected.js');
        };

        (document.head || document.documentElement).appendChild(script);
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_sendToPage(ctx, ...args) {
    with (ctx) {
        return (function sendToPage(type, payload, sendResponse) {
        injectPageBridge();

        const requestId = makeRequestId();
        const timeoutId = setTimeout(() => {
            if (!pendingRequests.has(requestId)) {
                return;
            }

            pendingRequests.delete(requestId);
            sendResponse({ success: false, error: 'Timeout waiting for page response' });
        }, REQUEST_TIMEOUT_MS);

        pendingRequests.set(requestId, { sendResponse, timeoutId });

        window.postMessage(
            {
                source: EXT_TO_PAGE_SOURCE,
                type,
                requestId,
                ...payload
            },
            '*'
        );
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_wait(ctx, ...args) {
    with (ctx) {
        return (function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_makeAbsoluteUrl(ctx, ...args) {
    with (ctx) {
        return (function makeAbsoluteUrl(url) {
        try {
            return new URL(url, window.location.origin).href;
        } catch (_error) {
            return String(url || '');
        }
    
        }).apply(null, args);
    }
}

function __ContentBridgeLogFeature_measureSitePing(ctx, ...args) {
    with (ctx) {
        return (async function measureSitePing() {
        const timestamp = Date.now();
        const targets = [];

        try {
            const current = new URL(window.location.href);
            targets.push(`${current.origin}/favicon.ico?gg_ping=${timestamp}`);
            targets.push(`${current.origin}/?gg_ping=${timestamp}`);
        } catch (_error) {
            // no-op
        }

        targets.push(window.location.href);

        const measureViaImage = (targetUrl, timeoutMs = 7000) => (
            new Promise((resolve) => {
                const startedAt = performance.now();
                const img = new Image();
                let finished = false;

                const finish = (ok) => {
                    if (finished) {
                        return;
                    }
                    finished = true;
                    clearTimeout(timerId);
                    img.onload = null;
                    img.onerror = null;

                    if (!ok) {
                        resolve(null);
                        return;
                    }

                    resolve(Math.round(performance.now() - startedAt));
                };

                const timerId = setTimeout(() => finish(false), timeoutMs);
                img.onload = () => finish(true);
                img.onerror = () => finish(true);

                const separator = targetUrl.includes('?') ? '&' : '?';
                img.src = `${targetUrl}${separator}gg_img_ping=${Date.now()}_${Math.random().toString(16).slice(2)}`;
            })
        );

        let lastError = '';
        for (const target of targets) {
            const startedAt = performance.now();

            try {
                const headResponse = await fetch(target, {
                    method: 'HEAD',
                    credentials: 'include',
                    cache: 'no-store',
                    redirect: 'follow'
                });

                return {
                    success: true,
                    pingMs: Math.round(performance.now() - startedAt),
                    status: Number(headResponse.status || 0),
                    url: target
                };
            } catch (headError) {
                lastError = headError && headError.message ? headError.message : String(headError);
            }

            try {
                const getResponse = await fetch(target, {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-store',
                    redirect: 'follow'
                });

                return {
                    success: true,
                    pingMs: Math.round(performance.now() - startedAt),
                    status: Number(getResponse.status || 0),
                    url: target
                };
            } catch (getError) {
                lastError = getError && getError.message ? getError.message : String(getError);
            }

            try {
                const imagePingMs = await measureViaImage(target);
                if (Number.isFinite(imagePingMs)) {
                    return {
                        success: true,
                        pingMs: Number(imagePingMs),
                        status: 0,
                        method: 'img',
                        url: target
                    };
                }
            } catch (imgError) {
                lastError = imgError && imgError.message ? imgError.message : String(imgError);
            }
        }

        return {
            success: false,
            error: lastError || 'Ping failed'
        };
    
        }).apply(null, args);
    }
}

window.ContentBridgeLogFeature = ContentBridgeLogFeature;

