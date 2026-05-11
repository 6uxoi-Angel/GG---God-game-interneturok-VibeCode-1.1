class PopupBrandFeature extends window.PopupFeatureBase {
    getExtensionManifest(...args) {
        return __PopupBrandFeature_getExtensionManifest(this.ctx, ...args);
    }

    initManifestInfo(...args) {
        return __PopupBrandFeature_initManifestInfo(this.ctx, ...args);
    }

    setBrandVersionText(...args) {
        return __PopupBrandFeature_setBrandVersionText(this.ctx, ...args);
    }

    normalizeVersionPart(...args) {
        return __PopupBrandFeature_normalizeVersionPart(this.ctx, ...args);
    }

    compareVersions(...args) {
        return __PopupBrandFeature_compareVersions(this.ctx, ...args);
    }

    setGithubVersionStatus(...args) {
        return __PopupBrandFeature_setGithubVersionStatus(this.ctx, ...args);
    }

    checkGithubVersion(...args) {
        return __PopupBrandFeature_checkGithubVersion(this.ctx, ...args);
    }

    renderBrandPingState(...args) {
        return __PopupBrandFeature_renderBrandPingState(this.ctx, ...args);
    }

    getBrandPingStateClass(...args) {
        return __PopupBrandFeature_getBrandPingStateClass(this.ctx, ...args);
    }

    requestBrandPing(...args) {
        return __PopupBrandFeature_requestBrandPing(this.ctx, ...args);
    }

    startBrandPingMonitor(...args) {
        return __PopupBrandFeature_startBrandPingMonitor(this.ctx, ...args);
    }
}

function __PopupBrandFeature_getExtensionManifest(ctx, ...args) {
    with (ctx) {
        return (function getExtensionManifest() {
        try {
            return chrome.runtime && typeof chrome.runtime.getManifest === 'function'
                ? chrome.runtime.getManifest()
                : {};
        } catch (_error) {
            return {};
        }
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_initManifestInfo(ctx, ...args) {
    with (ctx) {
        return (function initManifestInfo() {
        const manifest = getExtensionManifest();
        const version = manifest && manifest.version ? String(manifest.version) : '';
        const manifestStatus = manifest && manifest.status ? String(manifest.status) : 'Dev';

        setBrandVersionText('', version);

        if (profileManifestStatusValueEl) {
            profileManifestStatusValueEl.textContent = manifestStatus;
        }
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_setBrandVersionText(ctx, ...args) {
    with (ctx) {
        return (function setBrandVersionText(_statusEmoji, version) {
        if (!brandVersionTextEl) {
            return;
        }

        const safeVersion = String(version || '').trim();
        brandVersionTextEl.textContent = safeVersion ? `v: ${safeVersion}` : '';
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_normalizeVersionPart(ctx, ...args) {
    with (ctx) {
        return (function normalizeVersionPart(value) {
        const parsed = Number.parseInt(String(value || '0').replace(/\D+/g, ''), 10);
        return Number.isFinite(parsed) ? parsed : 0;
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_compareVersions(ctx, ...args) {
    with (ctx) {
        return (function compareVersions(leftVersion, rightVersion) {
        const left = String(leftVersion || '').split('.').map(normalizeVersionPart);
        const right = String(rightVersion || '').split('.').map(normalizeVersionPart);
        const length = Math.max(left.length, right.length, 3);

        for (let index = 0; index < length; index += 1) {
            const leftPart = left[index] || 0;
            const rightPart = right[index] || 0;
            if (leftPart > rightPart) return 1;
            if (leftPart < rightPart) return -1;
        }

        return 0;
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_setGithubVersionStatus(ctx, ...args) {
    with (ctx) {
        return (function setGithubVersionStatus(emoji, className, tooltipText, updateUrl) {
        if (!brandVersionStatusEl) {
            return;
        }

        const safeEmoji = String(emoji || '').trim();
        const safeTooltipText = String(tooltipText || '').trim();
        const safeUpdateUrl = String(updateUrl || '').trim();
        const statusHelpText = safeTooltipText || 'Проверяем актуальность версии через GitHub.';
        const ariaText = `Статус версии. ${statusHelpText}`;

        brandVersionStatusEl.className = `brand-version-status ${className || ''}`.trim();
        brandVersionStatusEl.textContent = '';
        brandVersionStatusEl.title = ariaText;
        brandVersionStatusEl.setAttribute('aria-label', ariaText);

        if (safeEmoji) {
            brandVersionStatusEl.appendChild(document.createTextNode(safeEmoji));
        }

        const tooltip = document.createElement('span');
        tooltip.className = 'brand-version-tooltip';

        const title = document.createElement('span');
        title.className = 'brand-version-tooltip-title';
        title.textContent = 'Статус версии';
        tooltip.appendChild(title);

        const legend = document.createElement('span');
        legend.textContent = '✓ актуально · ! есть обновление · … проверка';
        tooltip.appendChild(legend);
        tooltip.appendChild(document.createElement('br'));

        const text = document.createElement('span');
        text.textContent = statusHelpText;
        tooltip.appendChild(text);

        if (safeUpdateUrl) {
            tooltip.appendChild(document.createElement('br'));
            const link = document.createElement('a');
            link.className = 'brand-version-tooltip-link';
            link.href = safeUpdateUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Скачать обновлённую версию';
            tooltip.appendChild(link);
        }

        brandVersionStatusEl.appendChild(tooltip);
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_checkGithubVersion(ctx, ...args) {
    with (ctx) {
        return (async function checkGithubVersion() {
        const manifest = getExtensionManifest();
        const localVersion = manifest && manifest.version ? String(manifest.version) : '';

        if (!localVersion) {
            setGithubVersionStatus('!', 'is-error', 'Локальная версия отсутствует в manifest.json.');
            return;
        }

        setBrandVersionText('', localVersion);
        setGithubVersionStatus('…', 'is-loading', 'Сверяем вашу версию с версией на GitHub.');

        try {
            const response = await fetch(`${GITHUB_MANIFEST_URL}?gg_version_check=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`GitHub вернул HTTP ${response.status}`);
            }

            const remoteManifest = await response.json();
            const remoteVersion = remoteManifest && remoteManifest.version
                ? String(remoteManifest.version)
                : '';

            if (!remoteVersion) {
                throw new Error('В manifest.json на GitHub нет поля version');
            }

            const comparison = compareVersions(localVersion, remoteVersion);
            if (comparison >= 0) {
                setBrandVersionText('', localVersion);
                setGithubVersionStatus(
                    '✓',
                    'is-current',
                    `Версия актуальна. Установлена: v${localVersion}.`
                );
                return;
            }

            setBrandVersionText('', localVersion);
            setGithubVersionStatus(
                '!',
                'is-outdated',
                `Версия неактуальна. Установлена: v${localVersion}. Доступна: v${remoteVersion}.`,
                GITHUB_REPO_URL
            );
        } catch (error) {
            const message = error && error.message ? error.message : 'неизвестная ошибка';
            setBrandVersionText('', localVersion);
            setGithubVersionStatus('!', 'is-error', `Не удалось проверить версию: ${message}`);
        }
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_renderBrandPingState(ctx, ...args) {
    with (ctx) {
        return (function renderBrandPingState(stateClass, label) {
        if (!brandPingEl) {
            return;
        }

        brandPingEl.className = `brand-ping ${stateClass}`;
        brandPingEl.textContent = `ping: ${label}`;
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_getBrandPingStateClass(ctx, ...args) {
    with (ctx) {
        return (function getBrandPingStateClass(pingMs) {
        if (pingMs <= 120) {
            return 'ping-good';
        }

        if (pingMs <= 260) {
            return 'ping-warn';
        }

        return 'ping-bad';
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_requestBrandPing(ctx, ...args) {
    with (ctx) {
        return (function requestBrandPing() {
        if (!brandPingEl) {
            return;
        }

        renderBrandPingState('ping-loading', '...');

        sendMessageToActiveTab(
            { action: 'pingSite' },
            (error, response) => {
                if (error || !response || !response.success) {
                    renderBrandPingState('ping-error', 'n/a');
                    return;
                }

                const pingMs = Number(response.pingMs);
                if (!Number.isFinite(pingMs)) {
                    renderBrandPingState('ping-error', 'n/a');
                    return;
                }

                const normalizedPing = Math.max(0, Math.round(pingMs));
                renderBrandPingState(getBrandPingStateClass(normalizedPing), `${normalizedPing} ms`);
            }
        );
    
        }).apply(null, args);
    }
}

function __PopupBrandFeature_startBrandPingMonitor(ctx, ...args) {
    with (ctx) {
        return (function startBrandPingMonitor() {
        if (!brandPingEl) {
            return;
        }

        requestBrandPing();

        if (brandPingTimer) {
            clearInterval(brandPingTimer);
        }

        brandPingTimer = setInterval(requestBrandPing, BRAND_PING_INTERVAL_MS);

        window.addEventListener('beforeunload', () => {
            if (brandPingTimer) {
                clearInterval(brandPingTimer);
                brandPingTimer = null;
            }
        }, { once: true });
    
        }).apply(null, args);
    }
}

window.PopupBrandFeature = PopupBrandFeature;

