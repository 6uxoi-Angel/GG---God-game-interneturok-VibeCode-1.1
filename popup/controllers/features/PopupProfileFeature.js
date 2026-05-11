class PopupProfileFeature extends window.PopupFeatureBase {
    initProfilePanel(...args) {
        return __PopupProfileFeature_initProfilePanel(this.ctx, ...args);
    }

    makeDefaultTestsSummary(...args) {
        return __PopupProfileFeature_makeDefaultTestsSummary(this.ctx, ...args);
    }

    normalizeProfileInfo(...args) {
        return __PopupProfileFeature_normalizeProfileInfo(this.ctx, ...args);
    }

    renderProfileInfo(...args) {
        return __PopupProfileFeature_renderProfileInfo(this.ctx, ...args);
    }

    saveProfileInfoPatch(...args) {
        return __PopupProfileFeature_saveProfileInfoPatch(this.ctx, ...args);
    }

    loadSavedProfileInfo(...args) {
        return __PopupProfileFeature_loadSavedProfileInfo(this.ctx, ...args);
    }

    showProfileInfoStatus(...args) {
        return __PopupProfileFeature_showProfileInfoStatus(this.ctx, ...args);
    }

    refreshInternetUrokProfileInfo(...args) {
        return __PopupProfileFeature_refreshInternetUrokProfileInfo(this.ctx, ...args);
    }
}

function __PopupProfileFeature_initProfilePanel(ctx, ...args) {
    with (ctx) {
        return (function initProfilePanel() {
        if (!profileSubtabMeBtn || !profileSubtabTestsBtn || !profilePanelMeEl || !profilePanelTestsEl) {
            return;
        }

        const setProfileSubtab = (tabName) => {
            const showMe = tabName !== 'tests';
            profileSubtabMeBtn.classList.toggle('active', showMe);
            profileSubtabTestsBtn.classList.toggle('active', !showMe);
            profilePanelMeEl.classList.toggle('active', showMe);
            profilePanelTestsEl.classList.toggle('active', !showMe);

            if (showMe) {
                refreshInternetUrokProfileInfo();
            }
        };

        profileSubtabMeBtn.addEventListener('click', () => setProfileSubtab('me'));
        profileSubtabTestsBtn.addEventListener('click', () => setProfileSubtab('tests'));
        setProfileSubtab('me');
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_makeDefaultTestsSummary(ctx, ...args) {
    with (ctx) {
        return (function makeDefaultTestsSummary() {
        return 'Проверено ДЗ: 0. Тестов: 0. Ошибок загрузки: 0. Пропущено с оценкой: 0.';
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_normalizeProfileInfo(ctx, ...args) {
    with (ctx) {
        return (function normalizeProfileInfo(rawInfo = {}) {
        let manifest = {};
        try {
            manifest = chrome.runtime && typeof chrome.runtime.getManifest === 'function'
                ? chrome.runtime.getManifest()
                : {};
        } catch (_error) {
            manifest = {};
        }

        return {
            name: String(rawInfo.name || '').trim(),
            className: String(rawInfo.className || '').trim(),
            status: String((manifest && manifest.status) || 'Dev').trim() || 'Dev',
            testsSummary: String(rawInfo.testsSummary || '').trim() || makeDefaultTestsSummary(),
            updatedAt: rawInfo.updatedAt || ''
        };
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_renderProfileInfo(ctx, ...args) {
    with (ctx) {
        return (function renderProfileInfo(info) {
        const safeInfo = normalizeProfileInfo(info || {});
        savedProfileInfo = safeInfo;

        if (profileNameValueEl) {
            profileNameValueEl.textContent = safeInfo.name || 'Не сохранено';
        }

        if (profileClassValueEl) {
            profileClassValueEl.textContent = safeInfo.className || 'Не сохранено';
        }

        if (profileManifestStatusValueEl) {
            profileManifestStatusValueEl.textContent = safeInfo.status || 'Dev';
        }

        if (testsSummaryEl) {
            testsSummaryEl.textContent = safeInfo.testsSummary || makeDefaultTestsSummary();
        }
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_saveProfileInfoPatch(ctx, ...args) {
    with (ctx) {
        return (function saveProfileInfoPatch(patch) {
        const nextInfo = normalizeProfileInfo({
            ...(savedProfileInfo || {}),
            ...(patch || {}),
            updatedAt: new Date().toISOString()
        });

        savedProfileInfo = nextInfo;
        renderProfileInfo(nextInfo);
        chrome.storage.local.set({ [STORAGE_KEY_PROFILE_INFO]: nextInfo });
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_loadSavedProfileInfo(ctx, ...args) {
    with (ctx) {
        return (function loadSavedProfileInfo() {
        chrome.storage.local.get([STORAGE_KEY_PROFILE_INFO], (result) => {
            const storedInfo = result && result[STORAGE_KEY_PROFILE_INFO]
                ? result[STORAGE_KEY_PROFILE_INFO]
                : {};
            renderProfileInfo(storedInfo);
        });
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_showProfileInfoStatus(ctx, ...args) {
    with (ctx) {
        return (function showProfileInfoStatus(message, type = 'info', durationMs = 3000) {
        if (!profileInfoStatusEl) {
            return;
        }

        profileInfoStatusEl.textContent = message;
        profileInfoStatusEl.className = `status show is-${type}`;

        if (profileInfoStatusTimer) {
            clearTimeout(profileInfoStatusTimer);
        }

        profileInfoStatusTimer = setTimeout(() => {
            profileInfoStatusEl.className = 'status';
            profileInfoStatusEl.textContent = '';
        }, durationMs);
    
        }).apply(null, args);
    }
}

function __PopupProfileFeature_refreshInternetUrokProfileInfo(ctx, ...args) {
    with (ctx) {
        return (function refreshInternetUrokProfileInfo() {
        if (!profileNameValueEl && !profileClassValueEl) {
            return;
        }

        sendMessageToActiveTab(
            { action: 'getInternetUrokProfileInfo' },
            (error, response) => {
                if (error || !response || !response.success) {
                    return;
                }

                const nextPatch = {};
                if (response.name) nextPatch.name = response.name;
                if (response.className) nextPatch.className = response.className;

                if (Object.keys(nextPatch).length > 0) {
                    saveProfileInfoPatch(nextPatch);
                }
            }
        );
    
        }).apply(null, args);
    }
}

window.PopupProfileFeature = PopupProfileFeature;

