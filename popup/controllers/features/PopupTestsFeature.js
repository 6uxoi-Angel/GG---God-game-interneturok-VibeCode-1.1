class PopupTestsFeature extends window.PopupFeatureBase {
    hydrateTestsDataFromStorage(...args) {
        return __PopupTestsFeature_hydrateTestsDataFromStorage(this.ctx, ...args);
    }

    initFlexibleTestsSettings(...args) {
        return __PopupTestsFeature_initFlexibleTestsSettings(this.ctx, ...args);
    }

    getFlexibleTestsSettings(...args) {
        return __PopupTestsFeature_getFlexibleTestsSettings(this.ctx, ...args);
    }

    autoHighlightTestsIfNeeded(...args) {
        return __PopupTestsFeature_autoHighlightTestsIfNeeded(this.ctx, ...args);
    }

    loadTestsRegistry(...args) {
        return __PopupTestsFeature_loadTestsRegistry(this.ctx, ...args);
    }

    saveTestsRegistry(...args) {
        return __PopupTestsFeature_saveTestsRegistry(this.ctx, ...args);
    }

    buildJournalPageKey(...args) {
        return __PopupTestsFeature_buildJournalPageKey(this.ctx, ...args);
    }

    buildJournalBaseKey(...args) {
        return __PopupTestsFeature_buildJournalBaseKey(this.ctx, ...args);
    }

    extractQuarterFromUrl(...args) {
        return __PopupTestsFeature_extractQuarterFromUrl(this.ctx, ...args);
    }

    getTestIdentity(...args) {
        return __PopupTestsFeature_getTestIdentity(this.ctx, ...args);
    }

    buildQuarterBuckets(...args) {
        return __PopupTestsFeature_buildQuarterBuckets(this.ctx, ...args);
    }

    flattenQuarterBuckets(...args) {
        return __PopupTestsFeature_flattenQuarterBuckets(this.ctx, ...args);
    }

    buildDisplayBuckets(...args) {
        return __PopupTestsFeature_buildDisplayBuckets(this.ctx, ...args);
    }

    removeTestFromRegistry(...args) {
        return __PopupTestsFeature_removeTestFromRegistry(this.ctx, ...args);
    }

    getCurrentJournalPageContext(...args) {
        return __PopupTestsFeature_getCurrentJournalPageContext(this.ctx, ...args);
    }

    normalizeTestsForStorage(...args) {
        return __PopupTestsFeature_normalizeTestsForStorage(this.ctx, ...args);
    }

    collectAllRegistryTestsResult(...args) {
        return __PopupTestsFeature_collectAllRegistryTestsResult(this.ctx, ...args);
    }

    buildBucketsFromTestsWithQuarter(...args) {
        return __PopupTestsFeature_buildBucketsFromTestsWithQuarter(this.ctx, ...args);
    }

    removeTestByRegistryKey(...args) {
        return __PopupTestsFeature_removeTestByRegistryKey(this.ctx, ...args);
    }

    mapRegistryEntryToResult(...args) {
        return __PopupTestsFeature_mapRegistryEntryToResult(this.ctx, ...args);
    }

    persistTestsResultInRegistry(...args) {
        return __PopupTestsFeature_persistTestsResultInRegistry(this.ctx, ...args);
    }

    downloadTestsSearchLogs(...args) {
        return __PopupTestsFeature_downloadTestsSearchLogs(this.ctx, ...args);
    }

    findJournalTestsFromProfile(...args) {
        return __PopupTestsFeature_findJournalTestsFromProfile(this.ctx, ...args);
    }

    renderTestsResult(...args) {
        return __PopupTestsFeature_renderTestsResult(this.ctx, ...args);
    }

    getTestsForActions(...args) {
        return __PopupTestsFeature_getTestsForActions(this.ctx, ...args);
    }

    formatTestsShareText(...args) {
        return __PopupTestsFeature_formatTestsShareText(this.ctx, ...args);
    }

    normalizeImportedTextValue(...args) {
        return __PopupTestsFeature_normalizeImportedTextValue(this.ctx, ...args);
    }

    parseImportedQuestionsCount(...args) {
        return __PopupTestsFeature_parseImportedQuestionsCount(this.ctx, ...args);
    }

    enrichImportedTestFromUrl(...args) {
        return __PopupTestsFeature_enrichImportedTestFromUrl(this.ctx, ...args);
    }

    parseTestsShareText(...args) {
        return __PopupTestsFeature_parseTestsShareText(this.ctx, ...args);
    }

    importTestsShareFromFile(...args) {
        return __PopupTestsFeature_importTestsShareFromFile(this.ctx, ...args);
    }

    copyTestsShareText(...args) {
        return __PopupTestsFeature_copyTestsShareText(this.ctx, ...args);
    }

    downloadTestsShareText(...args) {
        return __PopupTestsFeature_downloadTestsShareText(this.ctx, ...args);
    }

    applyTestsHighlightOnPage(...args) {
        return __PopupTestsFeature_applyTestsHighlightOnPage(this.ctx, ...args);
    }

    clearTestsHighlightOnPage(...args) {
        return __PopupTestsFeature_clearTestsHighlightOnPage(this.ctx, ...args);
    }

    showTestsStatus(...args) {
        return __PopupTestsFeature_showTestsStatus(this.ctx, ...args);
    }
}


function __PopupTestsFeature_normalizeFlexibleTestsSettings(ctx, ...args) {
    with (ctx) {
        return (function normalizeFlexibleTestsSettings(raw = {}) {
        return {
            subject: String(raw.subject || '').trim(),
            week: String(raw.week || '').trim(),
            autoHighlight: Boolean(raw.autoHighlight)
        };
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_getFlexibleTestsSettings(ctx, ...args) {
    with (ctx) {
        return (function getFlexibleTestsSettings() {
        return __PopupTestsFeature_normalizeFlexibleTestsSettings(ctx, testsFlexibleSettings || {});
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_renderFlexibleTestsSettings(ctx, ...args) {
    with (ctx) {
        return (function renderFlexibleTestsSettings(settings = null) {
        const nextSettings = __PopupTestsFeature_normalizeFlexibleTestsSettings(ctx, settings || testsFlexibleSettings || {});
        testsFlexibleSettings = nextSettings;

        if (flexTestsSubjectInput) flexTestsSubjectInput.value = nextSettings.subject;
        if (flexTestsWeekInput) flexTestsWeekInput.value = nextSettings.week;
        if (flexTestsAutoHighlightToggle) flexTestsAutoHighlightToggle.checked = Boolean(nextSettings.autoHighlight);

        if (flexTestsSettingsStatusEl) {
            const filters = [];
            if (nextSettings.subject) filters.push(`предмет: ${nextSettings.subject}`);
            if (nextSettings.week) filters.push(`неделя: ${nextSettings.week}`);
            const filterText = filters.length > 0 ? filters.join(', ') : 'сканируется всё';
            flexTestsSettingsStatusEl.textContent = `Настройки: ${filterText}. Автоподсветка: ${nextSettings.autoHighlight ? 'включена' : 'выключена'}.`;
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_saveFlexibleTestsSettings(ctx, ...args) {
    with (ctx) {
        return (function saveFlexibleTestsSettings(patch = null, callback = null) {
        const fromUi = patch || {
            subject: flexTestsSubjectInput ? flexTestsSubjectInput.value : '',
            week: flexTestsWeekInput ? flexTestsWeekInput.value : '',
            autoHighlight: flexTestsAutoHighlightToggle ? flexTestsAutoHighlightToggle.checked : false
        };
        const nextSettings = __PopupTestsFeature_normalizeFlexibleTestsSettings(ctx, fromUi);
        testsFlexibleSettings = nextSettings;
        __PopupTestsFeature_renderFlexibleTestsSettings(ctx, nextSettings);
        chrome.storage.local.set({ [STORAGE_KEY_TESTS_FLEX_SETTINGS]: nextSettings }, () => {
            if (typeof callback === 'function') callback(nextSettings);
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_getTestsScanFilters(ctx, ...args) {
    with (ctx) {
        return (function getTestsScanFilters() {
        const settings = __PopupTestsFeature_getFlexibleTestsSettings(ctx);
        return {
            subject: settings.subject,
            week: settings.week
        };
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_isInternetUrokJournalUrl(ctx, ...args) {
    with (ctx) {
        return (function isInternetUrokJournalUrl(url) {
        try {
            const parsed = new URL(String(url || ''));
            return /(^|\.)interneturok\.ru$/i.test(parsed.hostname) && parsed.pathname.startsWith('/h/journal');
        } catch (_error) {
            return false;
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_autoHighlightTestsIfNeeded(ctx, ...args) {
    with (ctx) {
        return (function autoHighlightTestsIfNeeded(silent = true) {
        const settings = __PopupTestsFeature_getFlexibleTestsSettings(ctx);
        if (!settings.autoHighlight || autoTestsHighlightInFlight) {
            return;
        }

        getActiveTab((tab) => {
            if (!tab || !__PopupTestsFeature_isInternetUrokJournalUrl(ctx, tab.url)) {
                return;
            }

            autoTestsHighlightInFlight = true;
            applyTestsHighlightOnPage({ silent, auto: true, done: () => { autoTestsHighlightInFlight = false; } });
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_initFlexibleTestsSettings(ctx, ...args) {
    with (ctx) {
        return (function initFlexibleTestsSettings() {
        if (!flexTestsSettingsBtn && !flexTestsSettingsPanel) {
            return;
        }

        chrome.storage.local.get([STORAGE_KEY_TESTS_FLEX_SETTINGS], (result) => {
            __PopupTestsFeature_renderFlexibleTestsSettings(ctx, result && result[STORAGE_KEY_TESTS_FLEX_SETTINGS] ? result[STORAGE_KEY_TESTS_FLEX_SETTINGS] : {});
            __PopupTestsFeature_autoHighlightTestsIfNeeded(ctx, true);
        });

        if (flexTestsSettingsBtn && flexTestsSettingsPanel) {
            flexTestsSettingsBtn.addEventListener('click', () => {
                flexTestsSettingsPanel.hidden = !flexTestsSettingsPanel.hidden;
            });
        }

        if (saveFlexTestsSettingsBtn) {
            saveFlexTestsSettingsBtn.addEventListener('click', () => {
                __PopupTestsFeature_saveFlexibleTestsSettings(ctx, null, (settings) => {
                    __PopupTestsFeature_renderFlexibleTestsSettings(ctx, settings);
                    showTestsStatus('Гибкая настройка сохранена', 'success');
                    __PopupTestsFeature_autoHighlightTestsIfNeeded(ctx, false);
                });
            });
        }

        if (resetFlexTestsSettingsBtn) {
            resetFlexTestsSettingsBtn.addEventListener('click', () => {
                __PopupTestsFeature_saveFlexibleTestsSettings(ctx, { subject: '', week: '', autoHighlight: false }, (settings) => {
                    __PopupTestsFeature_renderFlexibleTestsSettings(ctx, settings);
                    showTestsStatus('Гибкая настройка сброшена', 'success');
                });
            });
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_hydrateTestsDataFromStorage(ctx, ...args) {
    with (ctx) {
        return (function hydrateTestsDataFromStorage() {
        loadTestsRegistry((registry) => {
            testsRegistry = registry;

            getCurrentJournalPageContext((pageContext) => {
                const existing = pageContext && testsRegistry[pageContext.pageKey]
                    ? testsRegistry[pageContext.pageKey]
                    : null;
                const restored = existing ? mapRegistryEntryToResult(existing) : collectAllRegistryTestsResult();
                if (restored) {
                    lastTestsResult = restored;
                    renderTestsResult(restored);
                    return;
                }

                renderTestsResult(null);
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_loadTestsRegistry(ctx, ...args) {
    with (ctx) {
        return (function loadTestsRegistry(callback) {
        chrome.storage.local.get([STORAGE_KEY_TESTS_REGISTRY], (result) => {
            const raw = result && result[STORAGE_KEY_TESTS_REGISTRY];
            if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
                callback({});
                return;
            }

            callback(raw);
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_saveTestsRegistry(ctx, ...args) {
    with (ctx) {
        return (function saveTestsRegistry(nextRegistry, callback = null) {
        chrome.storage.local.set({ [STORAGE_KEY_TESTS_REGISTRY]: nextRegistry }, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_buildJournalPageKey(ctx, ...args) {
    with (ctx) {
        return (function buildJournalPageKey(url) {
        if (!url) {
            return '';
        }

        try {
            const parsed = new URL(url);
            const quarter = String(parsed.searchParams.get('quarter') || '').trim();
            if (quarter) {
                return `${parsed.origin}${parsed.pathname}?quarter=${quarter}`;
            }
            return `${parsed.origin}${parsed.pathname}`;
        } catch (_error) {
            return '';
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_buildJournalBaseKey(ctx, ...args) {
    with (ctx) {
        return (function buildJournalBaseKey(url) {
        if (!url) {
            return '';
        }

        try {
            const parsed = new URL(url);
            return `${parsed.origin}${parsed.pathname}`;
        } catch (_error) {
            return '';
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_extractQuarterFromUrl(ctx, ...args) {
    with (ctx) {
        return (function extractQuarterFromUrl(url) {
        if (!url) {
            return 0;
        }

        try {
            const parsed = new URL(url);
            const quarter = Number(parsed.searchParams.get('quarter') || 0);
            if (Number.isInteger(quarter) && quarter >= 1 && quarter <= 4) {
                return quarter;
            }
            return 0;
        } catch (_error) {
            return 0;
        }
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_getTestIdentity(ctx, ...args) {
    with (ctx) {
        return (function getTestIdentity(item) {
        const test = item || {};
        return [
            String(test.itemId || ''),
            String(test.lessonId || ''),
            String(test.href || ''),
            String(test.path || ''),
            String(test.subject || ''),
            String(test.week || ''),
            String(test.topic || ''),
            String(test.questionsCount ?? '')
        ].join('||');
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_buildQuarterBuckets(ctx, ...args) {
    with (ctx) {
        return (function buildQuarterBuckets(baseKey, fallbackTests = [], fallbackQuarter = 0) {
        const buckets = { 1: [], 2: [], 3: [], 4: [] };
        const seen = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };

        const pushToBucket = (quarter, item) => {
            if (!buckets[quarter]) {
                return;
            }

            const identity = getTestIdentity(item);
            if (!identity || seen[quarter].has(identity)) {
                return;
            }

            seen[quarter].add(identity);
            buckets[quarter].push(item);
        };

        Object.values(testsRegistry || {}).forEach((entry) => {
            const entryBaseKey = buildJournalBaseKey(entry && entry.pageUrl ? entry.pageUrl : '');
            if (!entryBaseKey) {
                return;
            }

            if (baseKey && entryBaseKey !== baseKey) {
                return;
            }

            const quarter = extractQuarterFromUrl(entry && entry.pageUrl ? entry.pageUrl : '');
            if (!quarter || !Array.isArray(entry && entry.tests)) {
                return;
            }

            entry.tests.forEach((item) => pushToBucket(quarter, item));
        });

        if (Array.isArray(fallbackTests) && fallbackTests.length > 0) {
            const safeFallbackQuarter = fallbackQuarter >= 1 && fallbackQuarter <= 4 ? fallbackQuarter : 1;
            fallbackTests.forEach((item) => pushToBucket(safeFallbackQuarter, item));
        }

        return buckets;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_flattenQuarterBuckets(ctx, ...args) {
    with (ctx) {
        return (function flattenQuarterBuckets(buckets) {
        return [1, 2, 3, 4].reduce((acc, quarter) => {
            const list = buckets && Array.isArray(buckets[quarter]) ? buckets[quarter] : [];
            list.forEach((item) => acc.push(item));
            return acc;
        }, []);
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_buildDisplayBuckets(ctx, ...args) {
    with (ctx) {
        return (function buildDisplayBuckets(baseKey, fallbackTests = [], fallbackQuarter = 0) {
        if (baseKey) {
            return buildQuarterBuckets(baseKey, fallbackTests, fallbackQuarter);
        }

        const buckets = { 1: [], 2: [], 3: [], 4: [] };
        const quarter = fallbackQuarter >= 1 && fallbackQuarter <= 4 ? fallbackQuarter : 1;
        const seen = new Set();
        (Array.isArray(fallbackTests) ? fallbackTests : []).forEach((item) => {
            const identity = getTestIdentity(item);
            if (!identity || seen.has(identity)) {
                return;
            }

            seen.add(identity);
            buckets[quarter].push(item);
        });
        return buckets;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_removeTestFromRegistry(ctx, ...args) {
    with (ctx) {
        return (function removeTestFromRegistry(baseKey, quarter, testItem) {
        if (!baseKey) {
            return false;
        }

        const targetIdentity = getTestIdentity(testItem);
        if (!targetIdentity) {
            return false;
        }

        const nextRegistry = { ...testsRegistry };
        let changed = false;
        const nowIso = new Date().toISOString();

        Object.keys(nextRegistry).forEach((key) => {
            const entry = nextRegistry[key];
            if (!entry || !Array.isArray(entry.tests)) {
                return;
            }

            const entryBaseKey = buildJournalBaseKey(entry.pageUrl || '');
            const entryQuarter = extractQuarterFromUrl(entry.pageUrl || '');
            if (!entryBaseKey || entryBaseKey !== baseKey) {
                return;
            }

            if (quarter && entryQuarter !== quarter) {
                return;
            }

            const filtered = entry.tests.filter((item) => getTestIdentity(item) !== targetIdentity);
            if (filtered.length === entry.tests.length) {
                return;
            }

            changed = true;
            nextRegistry[key] = {
                ...entry,
                updatedAt: nowIso,
                tests: filtered,
                testsFound: filtered.length
            };
        });

        if (!changed) {
            return false;
        }

        testsRegistry = nextRegistry;
        saveTestsRegistry(nextRegistry);

        if (lastTestsResult && Array.isArray(lastTestsResult.tests)) {
            const filtered = lastTestsResult.tests.filter((item) => getTestIdentity(item) !== targetIdentity);
            lastTestsResult = {
                ...lastTestsResult,
                tests: filtered,
                testsFound: filtered.length
            };
        }

        return true;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_getCurrentJournalPageContext(ctx, ...args) {
    with (ctx) {
        return (function getCurrentJournalPageContext(callback) {
        getActiveTab((tab) => {
            if (!tab || !tab.url || !isSupportedTabUrl(tab.url)) {
                callback(null);
                return;
            }

            const pageKey = buildJournalPageKey(tab.url);
            callback(pageKey ? { pageKey, pageUrl: tab.url } : null);
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_normalizeTestsForStorage(ctx, ...args) {
    with (ctx) {
        return (function normalizeTestsForStorage(tests) {
        if (!Array.isArray(tests)) {
            return [];
        }

        return tests
            .map((item) => ({
                subject: item && item.subject ? String(item.subject) : '',
                week: item && item.week ? String(item.week) : '',
                questionsCount: Number.isFinite(Number(item && item.questionsCount))
                    ? Number(item.questionsCount)
                    : null,
                mark: item && item.mark ? String(item.mark) : '',
                topic: item && item.topic ? String(item.topic) : '',
                href: item && item.href ? String(item.href) : '',
                path: item && item.path ? String(item.path) : '',
                itemId: item && item.itemId ? String(item.itemId) : '',
                lessonId: item && item.lessonId ? String(item.lessonId) : '',
                testSignals: Array.isArray(item && item.testSignals) ? item.testSignals.slice(0, 20) : []
            }))
            .slice(0, MAX_TESTS_PER_PAGE);
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_collectAllRegistryTestsResult(ctx, ...args) {
    with (ctx) {
        return (function collectAllRegistryTestsResult() {
        const entries = Object.values(testsRegistry || {})
            .filter((entry) => entry && Array.isArray(entry.tests) && entry.tests.length > 0);
        if (entries.length === 0) {
            return null;
        }

        const tests = [];
        let scanned = 0;
        let failedCount = 0;
        let skippedByMark = 0;
        const seen = new Set();

        entries.forEach((entry) => {
            const quarter = extractQuarterFromUrl(entry.pageUrl || '') || 1;
            scanned += Number(entry.scanned || 0);
            failedCount += Number(entry.failedCount || 0);
            skippedByMark += Number(entry.skippedByMark || 0);

            entry.tests.forEach((item) => {
                const enriched = {
                    ...(item || {}),
                    quarter,
                    __registryPageKey: entry.pageKey || buildJournalPageKey(entry.pageUrl || ''),
                    __registryPageUrl: entry.pageUrl || ''
                };
                const identity = `${quarter}||${getTestIdentity(enriched)}`;
                if (seen.has(identity)) {
                    return;
                }
                seen.add(identity);
                tests.push(enriched);
            });
        });

        return {
            success: true,
            scanned,
            testsFound: tests.length,
            failedCount,
            skippedByMark,
            tests,
            scannedAt: entries.map((entry) => entry.updatedAt || '').sort().pop() || '',
            pageUrl: '',
            globalView: true
        };
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_buildBucketsFromTestsWithQuarter(ctx, ...args) {
    with (ctx) {
        return (function buildBucketsFromTestsWithQuarter(tests) {
        const buckets = { 1: [], 2: [], 3: [], 4: [] };
        const seen = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };

        (Array.isArray(tests) ? tests : []).forEach((item) => {
            const parsedQuarter = Number(item && item.quarter);
            const quarter = Number.isInteger(parsedQuarter) && parsedQuarter >= 1 && parsedQuarter <= 4 ? parsedQuarter : 1;
            const identity = getTestIdentity(item);
            if (!identity || seen[quarter].has(identity)) {
                return;
            }
            seen[quarter].add(identity);
            buckets[quarter].push(item);
        });

        return buckets;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_removeTestByRegistryKey(ctx, ...args) {
    with (ctx) {
        return (function removeTestByRegistryKey(pageKey, testItem) {
        if (!pageKey || !testsRegistry[pageKey]) {
            return false;
        }

        const targetIdentity = getTestIdentity(testItem);
        if (!targetIdentity) {
            return false;
        }

        const entry = testsRegistry[pageKey];
        const filtered = Array.isArray(entry.tests)
            ? entry.tests.filter((item) => getTestIdentity(item) !== targetIdentity)
            : [];

        if (!Array.isArray(entry.tests) || filtered.length === entry.tests.length) {
            return false;
        }

        const nextRegistry = {
            ...testsRegistry,
            [pageKey]: {
                ...entry,
                updatedAt: new Date().toISOString(),
                tests: filtered,
                testsFound: filtered.length
            }
        };

        testsRegistry = nextRegistry;
        saveTestsRegistry(nextRegistry);
        lastTestsResult = collectAllRegistryTestsResult();
        return true;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_mapRegistryEntryToResult(ctx, ...args) {
    with (ctx) {
        return (function mapRegistryEntryToResult(entry) {
        if (!entry || !Array.isArray(entry.tests)) {
            return null;
        }

        return {
            success: true,
            scanned: Number(entry.scanned || 0),
            testsFound: Number(entry.testsFound || entry.tests.length || 0),
            failedCount: Number(entry.failedCount || 0),
            skippedByMark: Number(entry.skippedByMark || 0),
            tests: entry.tests,
            scannedAt: entry.updatedAt || '',
            pageUrl: entry.pageUrl || ''
        };
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_persistTestsResultInRegistry(ctx, ...args) {
    with (ctx) {
        return (function persistTestsResultInRegistry(result, pageContext) {
        if (!pageContext || !result || !Array.isArray(result.tests)) {
            return;
        }

        const pageKey = pageContext.pageKey;
        const nextRegistry = { ...testsRegistry };
        const nowIso = new Date().toISOString();
        nextRegistry[pageKey] = {
            pageKey,
            pageUrl: pageContext.pageUrl,
            updatedAt: nowIso,
            scanned: Number(result.scanned || 0),
            testsFound: Number(result.testsFound || result.tests.length || 0),
            failedCount: Number(result.failedCount || 0),
            skippedByMark: Number(result.skippedByMark || 0),
            tests: normalizeTestsForStorage(result.tests)
        };

        const sortedKeys = Object.keys(nextRegistry).sort((leftKey, rightKey) => {
            const leftTs = Date.parse(nextRegistry[leftKey] && nextRegistry[leftKey].updatedAt ? nextRegistry[leftKey].updatedAt : 0);
            const rightTs = Date.parse(nextRegistry[rightKey] && nextRegistry[rightKey].updatedAt ? nextRegistry[rightKey].updatedAt : 0);
            return rightTs - leftTs;
        });

        const trimmedRegistry = {};
        sortedKeys.slice(0, MAX_TESTS_REGISTRY_PAGES).forEach((key) => {
            trimmedRegistry[key] = nextRegistry[key];
        });

        testsRegistry = trimmedRegistry;
        saveTestsRegistry(trimmedRegistry);
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_downloadTestsSearchLogs(ctx, ...args) {
    with (ctx) {
        return (function downloadTestsSearchLogs() {
        if (!downloadTestsLogsBtn) return;

        setBusy(downloadTestsLogsBtn, true, 'Готовим логи...');

        sendMessageToActiveTab({ action: 'getQuestionScannerLogs' }, (error, response) => {
            setBusy(downloadTestsLogsBtn, false, 'Скачать логи поиска тестов .txt');

            if (error) {
                showTestsStatus('Не удалось получить логи со страницы', 'error');
                return;
            }

            if (!response || !response.success) {
                showTestsStatus((response && response.error) || 'Логи недоступны', 'warning');
                return;
            }

            const text = response.text || 'Логи пустые';
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.href = url;
            link.download = `god-game-tests-logs-${stamp}.txt`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);

            showTestsStatus(`Логи поиска тестов скачаны. Записей: ${Number(response.count || 0)}`, 'success');
        }, { tryInject: false });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_findJournalTestsFromProfile(ctx, ...args) {
    with (ctx) {
        return (function findJournalTestsFromProfile() {
        getCurrentJournalPageContext((pageContext) => {
            if (pageContext && testsRegistry[pageContext.pageKey]) {
                const previous = testsRegistry[pageContext.pageKey];
                showTestsStatus(
                    `На этой странице уже было сканирование (${formatDate(previous.updatedAt)}). Новое сканирование может занять время.`,
                    'info',
                    6500
                );
            }

            setBusy(findTestsBtn, true, 'Ищем...');
            const scanFilters = __PopupTestsFeature_getTestsScanFilters(ctx);
            const filterParts = [];
            if (scanFilters.subject) filterParts.push(`предмет: ${scanFilters.subject}`);
            if (scanFilters.week) filterParts.push(`неделя: ${scanFilters.week}`);
            const filterText = filterParts.length > 0 ? ` Фильтр: ${filterParts.join(', ')}.` : '';
            showTestsStatus(`Проверяю ссылки ДЗ в открытом журнале...${filterText}`, 'info', 120000);

            sendMessageToActiveTab({ action: 'findJournalTests', filters: scanFilters }, (error, response) => {
                setBusy(findTestsBtn, false, 'Найти тесты');

                if (error) {
                    renderTestsResult(null);
                    showTestsStatus(error.message === ERR_UNSUPPORTED_TAB ? 'Откройте любую обычную http/https страницу' : 'Нет связи со страницей', 'error');
                    return;
                }

                if (!response || !response.success) {
                    renderTestsResult(null);
                    showTestsStatus((response && response.error) || 'Не удалось найти тесты', 'warning');
                    return;
                }

                const enrichedResponse = {
                    ...response,
                    pageUrl: pageContext && pageContext.pageUrl ? pageContext.pageUrl : ''
                };
                persistTestsResultInRegistry(enrichedResponse, pageContext);
                lastTestsResult = enrichedResponse;
                renderTestsResult(enrichedResponse);

                const failedCount = Number(response.failedCount || 0);
                const skippedByMark = Number(response.skippedByMark || 0);
                const failedTail = failedCount > 0 ? ` Ошибок загрузки: ${failedCount}.` : '';
                const skippedTail = skippedByMark > 0 ? ` Пропущено с оценкой: ${skippedByMark}.` : '';
                showTestsStatus(`Готово. Найдено тестов: ${Number(response.testsFound || 0)}.${failedTail}${skippedTail}`, 'success');
                __PopupTestsFeature_autoHighlightTestsIfNeeded(ctx, true);
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_renderTestsResult(ctx, ...args) {
    with (ctx) {
        return (function renderTestsResult(result) {
        if (!testsSummaryEl || !testsListEl) return;
        testsListEl.innerHTML = '';
        testsListEl.dataset.testsView = testsViewMode;

        if (!result || !Array.isArray(result.tests)) {
            testsSummaryEl.textContent = (savedProfileInfo && savedProfileInfo.testsSummary) || makeDefaultTestsSummary();
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty';
            emptyEl.textContent = 'Список пуст. Откройте журнал для сканирования или загрузите .txt со списком тестов.'
            testsListEl.appendChild(emptyEl);
            return;
        }

        const scanned = Number(result.scanned || 0);
        const failedCount = Number(result.failedCount || 0);
        const skippedByMark = Number(result.skippedByMark || 0);
        const pageUrl = String(result.pageUrl || '');
        const baseKey = buildJournalBaseKey(pageUrl);
        const currentQuarter = extractQuarterFromUrl(pageUrl);
        const buckets = result.globalView ? buildBucketsFromTestsWithQuarter(result.tests) : buildDisplayBuckets(baseKey, result.tests, currentQuarter);
        const allTests = flattenQuarterBuckets(buckets);

        testsSummaryEl.textContent = `${result.globalView ? 'Всего сохранено' : 'Проверено ДЗ'}: ${scanned}. Тестов: ${allTests.length}. Ошибок загрузки: ${failedCount}. Пропущено с оценкой: ${skippedByMark}.`;
        saveProfileInfoPatch({ testsSummary: testsSummaryEl.textContent });

        if (allTests.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty';
            emptyEl.textContent = scanned > 0 ? 'Среди найденных ДЗ тестов нет' : 'Ссылки ДЗ не найдены';
            testsListEl.appendChild(emptyEl);
            return;
        }

        [1, 2, 3, 4].forEach((quarter) => {
            const quarterTests = Array.isArray(buckets[quarter]) ? buckets[quarter] : [];

            const quarterEl = document.createElement('div');
            quarterEl.className = `quarter-section ${testsViewMode === 'modern' ? 'quarter-section-modern' : 'quarter-section-classic'}`;

            const titleEl = document.createElement('div');
            titleEl.className = 'quarter-title';
            titleEl.textContent = `Четверть ${quarter} (${quarterTests.length})`;

            const listEl = document.createElement('div');
            listEl.className = 'quarter-tests';

            if (quarterTests.length === 0) {
                const emptyEl = document.createElement('div');
                emptyEl.className = 'empty';
                emptyEl.textContent = 'Тестов нет';
                listEl.appendChild(emptyEl);
            } else {
                quarterTests.forEach((item) => {
                    const card = document.createElement('div');
                    card.className = `test-item ${testsViewMode === 'modern' ? 'test-item-modern' : 'test-item-classic'}`;

                    const headEl = document.createElement('div');
                    headEl.className = 'test-head';

                    const subjectEl = document.createElement('div');
                    subjectEl.className = 'test-subject';
                    subjectEl.textContent = item.subject || 'Без предмета';

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'test-delete-btn';
                    deleteBtn.type = 'button';
                    deleteBtn.textContent = 'Удалить';
                    deleteBtn.addEventListener('click', () => {
                        const removed = item.__registryPageKey
                            ? removeTestByRegistryKey(item.__registryPageKey, item)
                            : removeTestFromRegistry(baseKey, quarter, item);
                        if (!removed) {
                            showTestsStatus('Не удалось удалить тест из списка', 'warning');
                            return;
                        }

                        const refreshedResult = result.globalView ? collectAllRegistryTestsResult() : null;
                        const refreshedBuckets = refreshedResult ? buildBucketsFromTestsWithQuarter(refreshedResult.tests) : buildDisplayBuckets(baseKey, [], 0);
                        const refreshedTests = flattenQuarterBuckets(refreshedBuckets);
                        lastTestsResult = refreshedResult || {
                            ...(lastTestsResult || result),
                            pageUrl,
                            tests: refreshedTests,
                            testsFound: refreshedTests.length
                        };

                        renderTestsResult(lastTestsResult);
                        showTestsStatus(`Тест удалён. Осталось: ${refreshedTests.length}`, 'success');
                    });

                    headEl.appendChild(subjectEl);
                    headEl.appendChild(deleteBtn);

                    const metaEl = document.createElement('div');
                    metaEl.className = 'test-meta';
                    const questionsLabel = item.questionsCount ? ` · вопросов: ${item.questionsCount}` : '';
                    const markLabel = item.mark ? ` · оценка: ${item.mark}` : '';
                    metaEl.textContent = `${item.week || 'Неделя не указана'}${questionsLabel}${markLabel}`;

                    const topicEl = document.createElement('div');
                    topicEl.className = 'test-topic';
                    topicEl.textContent = item.topic || 'Тема не распознана';

                    const linkEl = document.createElement('a');
                    linkEl.className = 'test-link';
                    linkEl.href = item.href || item.path || '#';
                    linkEl.target = '_blank';
                    linkEl.rel = 'noopener noreferrer';
                    linkEl.textContent = 'Открыть тест';

                    card.appendChild(headEl);
                    card.appendChild(metaEl);
                    card.appendChild(topicEl);
                    card.appendChild(linkEl);
                    listEl.appendChild(card);
                });
            }

            quarterEl.appendChild(titleEl);
            quarterEl.appendChild(listEl);
            testsListEl.appendChild(quarterEl);
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_getTestsForActions(ctx, ...args) {
    with (ctx) {
        return (function getTestsForActions(callback) {
        if (lastTestsResult && Array.isArray(lastTestsResult.tests)) {
            const pageUrl = String(lastTestsResult.pageUrl || '');
            const baseKey = buildJournalBaseKey(pageUrl);
            const currentQuarter = extractQuarterFromUrl(pageUrl);
            const buckets = buildDisplayBuckets(baseKey, lastTestsResult.tests, currentQuarter);
            const allTests = flattenQuarterBuckets(buckets);
            if (allTests.length > 0) {
                callback(allTests);
                return;
            }
        }

        getCurrentJournalPageContext((pageContext) => {
            if (!pageContext) {
                const globalResult = collectAllRegistryTestsResult();
                callback(globalResult && Array.isArray(globalResult.tests) ? globalResult.tests : []);
                return;
            }

            const entry = testsRegistry[pageContext.pageKey];
            const fallbackTests = entry && Array.isArray(entry.tests) ? entry.tests : (collectAllRegistryTestsResult()?.tests || []);
            const baseKey = buildJournalBaseKey(pageContext.pageUrl || '');
            const currentQuarter = extractQuarterFromUrl(pageContext.pageUrl || '');
            const buckets = buildDisplayBuckets(baseKey, fallbackTests, currentQuarter);
            callback(flattenQuarterBuckets(buckets));
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_formatTestsShareText(ctx, ...args) {
    with (ctx) {
        return (function formatTestsShareText(tests) {
        const safeList = Array.isArray(tests) ? tests : [];
        if (safeList.length === 0) {
            return 'Тесты не найдены.';
        }

        return safeList
            .map((item, index) => {
                const questionsText = Number.isFinite(Number(item.questionsCount))
                    ? String(Number(item.questionsCount))
                    : 'не указано';
                const lines = [
                    `Тест ${index + 1}`,
                    `Название предмета: ${item.subject || 'не указано'}`,
                    `Неделя: ${item.week || 'не указана'}`,
                    `Количество вопросов: ${questionsText}`,
                    `Тема: ${item.topic || 'не указана'}`
                ];

                if (item.mark) lines.push(`Оценка: ${item.mark}`);
                if (item.href) lines.push(`Ссылка: ${item.href}`);
                if (item.path) lines.push(`Путь: ${item.path}`);
                if (item.itemId) lines.push(`Item ID: ${item.itemId}`);
                if (item.lessonId) lines.push(`Lesson ID: ${item.lessonId}`);

                return lines.join('\n');
            })
            .join('\n\n');
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_normalizeImportedTextValue(ctx, ...args) {
    with (ctx) {
        return (function normalizeImportedTextValue(value) {
        const text = String(value || '').trim();
        if (!text || /^не\s+указан[ао]?$/i.test(text) || /^—+$/.test(text)) {
            return '';
        }
        return text;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_parseImportedQuestionsCount(ctx, ...args) {
    with (ctx) {
        return (function parseImportedQuestionsCount(value) {
        const text = String(value || '').trim();
        const match = text.match(/\d+/);
        if (!match) {
            return null;
        }

        const parsed = Number(match[0]);
        return Number.isFinite(parsed) ? parsed : null;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_enrichImportedTestFromUrl(ctx, ...args) {
    with (ctx) {
        return (function enrichImportedTestFromUrl(test) {
        const next = { ...(test || {}) };
        const rawHref = String(next.href || next.path || '').trim();
        if (!rawHref) {
            return next;
        }

        try {
            const parsed = new URL(rawHref, 'https://interneturok.ru');
            const itemId = parsed.searchParams.get('itemId') || '';
            const lessonMatch = parsed.pathname.match(/\/lesson\/(\d+)/);
            if (!next.itemId && itemId) next.itemId = itemId;
            if (!next.lessonId && lessonMatch) next.lessonId = lessonMatch[1];
            if (!next.path) next.path = `${parsed.pathname}${parsed.search}`;
            if (!next.href && /^https?:\/\//i.test(rawHref)) next.href = parsed.href;
        } catch (_error) {
            // no-op: оставляем как есть
        }

        return next;
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_parseTestsShareText(ctx, ...args) {
    with (ctx) {
        return (function parseTestsShareText(rawText) {
        const text = String(rawText || '')
            .replace(/^\uFEFF/, '')
            .replace(/\r\n?/g, '\n')
            .trim();

        if (!text || /^Тесты\s+не\s+найдены\.?$/i.test(text)) {
            return [];
        }

        const blocks = text
            .split(/\n\s*\n(?=\s*(?:Тест\s+\d+|Название\s+предмета\s*:|Предмет\s*:))/i)
            .map((block) => block.trim())
            .filter(Boolean);

        const result = [];
        blocks.forEach((block) => {
            const item = {
                subject: '',
                week: '',
                questionsCount: null,
                mark: '',
                topic: '',
                href: '',
                path: '',
                itemId: '',
                lessonId: '',
                testSignals: ['imported-txt']
            };

            block.split('\n').forEach((line) => {
                const cleanLine = String(line || '').trim();
                if (!cleanLine || /^Тест\s+\d+$/i.test(cleanLine)) {
                    return;
                }

                const pair = cleanLine.match(/^([^:]+):\s*(.*)$/);
                if (!pair) {
                    const urlMatch = cleanLine.match(/https?:\/\/\S+/i);
                    if (urlMatch && !item.href) {
                        item.href = urlMatch[0];
                    }
                    return;
                }

                const key = pair[1].trim().toLowerCase();
                const value = normalizeImportedTextValue(pair[2]);
                if (!value) {
                    return;
                }

                if (key.includes('название предмета') || key === 'предмет' || key === 'subject') {
                    item.subject = value;
                } else if (key.includes('недел') || key === 'week') {
                    item.week = value;
                } else if (key.includes('количество вопросов') || key.includes('вопрос')) {
                    item.questionsCount = parseImportedQuestionsCount(value);
                } else if (key.includes('тем') || key === 'topic') {
                    item.topic = value;
                } else if (key.includes('оцен') || key === 'mark') {
                    item.mark = value;
                } else if (key.includes('ссыл') || key === 'url' || key === 'href') {
                    item.href = value;
                } else if (key.includes('путь') || key === 'path') {
                    item.path = value;
                } else if (key.includes('item')) {
                    item.itemId = value;
                } else if (key.includes('lesson')) {
                    item.lessonId = value;
                }
            });

            const enriched = enrichImportedTestFromUrl(item);
            const hasMatcher = Boolean(enriched.href || enriched.path || enriched.itemId || enriched.lessonId);
            const hasReadableData = Boolean(enriched.subject || enriched.week || enriched.topic);
            if (hasMatcher || hasReadableData) {
                result.push(enriched);
            }
        });

        return normalizeTestsForStorage(result);
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_importTestsShareFromFile(ctx, ...args) {
    with (ctx) {
        return (function importTestsShareFromFile(event) {
        const input = event && event.target ? event.target : importTestsShareInput;
        const file = input && input.files && input.files[0] ? input.files[0] : null;
        if (!file) {
            return;
        }

        setBusy(importTestsShareBtn, true, 'Загружаем...');
        const reader = new FileReader();

        reader.onload = () => {
            const importedTests = parseTestsShareText(reader.result || '');
            if (!Array.isArray(importedTests) || importedTests.length === 0) {
                setBusy(importTestsShareBtn, false, 'Загрузить чужой список .txt');
                showTestsStatus('В .txt не найден список тестов. Нужны строки «Тест N», «Название предмета», «Ссылка» или Item ID.', 'warning', 7000);
                return;
            }

            getCurrentJournalPageContext((pageContext) => {
                const result = {
                    success: true,
                    imported: true,
                    scanned: 0,
                    testsFound: importedTests.length,
                    failedCount: 0,
                    skippedByMark: 0,
                    tests: importedTests,
                    pageUrl: pageContext && pageContext.pageUrl ? pageContext.pageUrl : '',
                    scannedAt: new Date().toISOString()
                };

                if (pageContext) {
                    persistTestsResultInRegistry(result, pageContext);
                }

                lastTestsResult = result;
                renderTestsResult(result);
                setBusy(importTestsShareBtn, false, 'Загрузить чужой список .txt');
                showTestsStatus(`Список загружен. Тестов: ${importedTests.length}. Теперь можно нажать «Подсветить тесты».`, 'success', 7000);
            });
        };

        reader.onerror = () => {
            setBusy(importTestsShareBtn, false, 'Загрузить чужой список .txt');
            showTestsStatus('Не удалось прочитать .txt файл', 'error');
        };

        reader.readAsText(file, 'utf-8');
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_copyTestsShareText(ctx, ...args) {
    with (ctx) {
        return (function copyTestsShareText() {
        setBusy(copyTestsShareBtn, true, 'Копируем...');
        getTestsForActions((tests) => {
            const text = formatTestsShareText(tests);
            copyTextToClipboard(text, (copied) => {
                setBusy(copyTestsShareBtn, false, 'Скопировать список');
                showTestsStatus(copied ? 'Список тестов скопирован' : 'Не удалось скопировать список', copied ? 'success' : 'error');
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_downloadTestsShareText(ctx, ...args) {
    with (ctx) {
        return (function downloadTestsShareText() {
        setBusy(downloadTestsShareBtn, true, 'Готовим .txt...');
        getTestsForActions((tests) => {
            const text = formatTestsShareText(tests);
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.href = url;
            link.download = `god-game-tests-share-${stamp}.txt`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            setBusy(downloadTestsShareBtn, false, 'Скачать список .txt');
            showTestsStatus('Список тестов скачан в .txt', 'success');
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_applyTestsHighlightOnPage(ctx, ...args) {
    with (ctx) {
        return (function applyTestsHighlightOnPage(options = {}) {
        const silent = Boolean(options && options.silent);
        const done = typeof (options && options.done) === 'function' ? options.done : null;
        const finish = () => { if (done) done(); };
        getTestsForActions((tests) => {
            if (!Array.isArray(tests) || tests.length === 0) {
                if (!silent) showTestsStatus('Нет найденных тестов для подсветки', 'warning');
                finish();
                return;
            }

            if (!silent) setBusy(applyTestsHighlightBtn, true, 'Подсвечиваем...');
            const highlightColor = resolveHighlightColorForPage();
            withFreshContentScript((refreshError) => {
                if (refreshError) {
                    if (!silent) setBusy(applyTestsHighlightBtn, false, 'Подсветить тесты');
                    if (!silent) showTestsStatus(refreshError.message || 'Не удалось обновить скрипт на странице', 'error');
                    finish();
                    return;
                }

                sendMessageToActiveTab(
                    { action: 'highlightFoundTests', tests, highlightColor },
                    (error, response) => {
                        if (!silent) setBusy(applyTestsHighlightBtn, false, 'Подсветить тесты');
                        if (error) {
                            if (!silent) showTestsStatus(error.message || 'Не удалось подсветить тесты', 'error');
                            finish();
                            return;
                        }

                        if (!response || !response.success) {
                            if (!silent) showTestsStatus((response && response.error) || 'Подсветка тестов не применена', 'warning');
                            finish();
                            return;
                        }

                        if (!silent) showTestsStatus(`Подсветка применена. Выделено: ${Number(response.highlighted || 0)}.`, 'success');
                        finish();
                    }
                );
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_clearTestsHighlightOnPage(ctx, ...args) {
    with (ctx) {
        return (function clearTestsHighlightOnPage() {
        setBusy(clearTestsHighlightBtn, true, 'Очищаем...');
        sendMessageToActiveTab({ action: 'clearFoundTestsHighlight' }, (error, response) => {
            setBusy(clearTestsHighlightBtn, false, 'Убрать подсветку');
            if (error) {
                showTestsStatus(error.message || 'Не удалось убрать подсветку тестов', 'error');
                return;
            }

            if (!response || !response.success) {
                showTestsStatus((response && response.error) || 'Подсветка тестов не очищена', 'warning');
                return;
            }

            showTestsStatus('Подсветка тестов очищена', 'success');
        });
    
        }).apply(null, args);
    }
}

function __PopupTestsFeature_showTestsStatus(ctx, ...args) {
    with (ctx) {
        return (function showTestsStatus(message, type = 'info', timeoutMs = 3500) {
        if (!testsStatusEl) return;
        testsStatusEl.textContent = message;
        testsStatusEl.className = `status show is-${type}`;

        if (testsStatusTimer) clearTimeout(testsStatusTimer);

        testsStatusTimer = setTimeout(() => {
            testsStatusEl.className = 'status';
            testsStatusEl.textContent = '';
        }, timeoutMs);
    
        }).apply(null, args);
    }
}

window.PopupTestsFeature = PopupTestsFeature;

