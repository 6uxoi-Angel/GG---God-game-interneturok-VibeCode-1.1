class PopupSettingsFeature extends window.PopupFeatureBase {
    initThemeSettings(...args) {
        return __PopupSettingsFeature_initThemeSettings(this.ctx, ...args);
    }

    initUiModeSettings(...args) {
        return __PopupSettingsFeature_initUiModeSettings(this.ctx, ...args);
    }

    initDeveloperModeSettings(...args) {
        return __PopupSettingsFeature_initDeveloperModeSettings(this.ctx, ...args);
    }

    initTestsViewModeSettings(...args) {
        return __PopupSettingsFeature_initTestsViewModeSettings(this.ctx, ...args);
    }

    initHighlightColorSettings(...args) {
        return __PopupSettingsFeature_initHighlightColorSettings(this.ctx, ...args);
    }

    getThemeHighlightColor(...args) {
        return __PopupSettingsFeature_getThemeHighlightColor(this.ctx, ...args);
    }

    normalizeColorInput(...args) {
        return __PopupSettingsFeature_normalizeColorInput(this.ctx, ...args);
    }

    refreshHighlightColorHint(...args) {
        return __PopupSettingsFeature_refreshHighlightColorHint(this.ctx, ...args);
    }

    resolveHighlightColorForPage(...args) {
        return __PopupSettingsFeature_resolveHighlightColorForPage(this.ctx, ...args);
    }

    initPromptSettings(...args) {
        return __PopupSettingsFeature_initPromptSettings(this.ctx, ...args);
    }
}

function __PopupSettingsFeature_initThemeSettings(ctx, ...args) {
    with (ctx) {
        return (function initThemeSettings() {
        const appearanceCatalog = window.PopupAppearanceCatalog || null;
        const fallbackTheme = appearanceCatalog && appearanceCatalog.fallbackTheme
            ? appearanceCatalog.fallbackTheme
            : 'dark';
        const allowedThemeValues = appearanceCatalog && typeof appearanceCatalog.getAllowedThemes === 'function'
            ? appearanceCatalog.getAllowedThemes()
            : ['dark', 'light', 'sunset', 'mint', 'ocean', 'rose', 'midnight', 'neon', 'aurora', 'graphite', 'candy', 'forest', 'royal', 'matrix', 'ice', 'lava'];
        const allowedThemes = new Set(allowedThemeValues);

        function normalizeTheme(themeName) {
            const value = String(themeName || '').trim().toLowerCase();
            return allowedThemes.has(value) ? value : fallbackTheme;
        }

        function applyTheme(themeName) {
            const safeTheme = normalizeTheme(themeName);
            document.body.dataset.theme = safeTheme;

            themeChoiceButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.themeChoice === safeTheme);
            });

            refreshHighlightColorHint();
        }

        chrome.storage.local.get([STORAGE_KEY_THEME], (result) => {
            applyTheme(result && result[STORAGE_KEY_THEME] ? result[STORAGE_KEY_THEME] : fallbackTheme);
        });

        if (settingsToggleBtn && settingsMenuEl) {
            settingsToggleBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                settingsMenuEl.classList.toggle('open');
            });

            settingsMenuEl.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            document.addEventListener('click', () => {
                settingsMenuEl.classList.remove('open');
            });
        }

        themeChoiceButtons.forEach((button) => {
            if (!button) {
                return;
            }

            button.addEventListener('click', () => {
                const nextTheme = normalizeTheme(button.dataset.themeChoice);
                applyTheme(nextTheme);
                chrome.storage.local.set({ [STORAGE_KEY_THEME]: nextTheme });

                if (settingsMenuEl) {
                    settingsMenuEl.classList.remove('open');
                }
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_initUiModeSettings(ctx, ...args) {
    with (ctx) {
        return (function initUiModeSettings() {
        const appearanceCatalog = window.PopupAppearanceCatalog || null;
        const fallbackMode = appearanceCatalog && appearanceCatalog.fallbackUiMode
            ? appearanceCatalog.fallbackUiMode
            : 'new';
        const allowedModeValues = appearanceCatalog && typeof appearanceCatalog.getAllowedUiModes === 'function'
            ? appearanceCatalog.getAllowedUiModes()
            : ['new', 'compact', 'focus', 'premium', 'dock', 'cards', 'split', 'old'];
        const allowedModes = new Set(allowedModeValues);

        function normalizeUiMode(modeName) {
            const value = String(modeName || '').trim().toLowerCase();
            return allowedModes.has(value) ? value : fallbackMode;
        }

        function applyUiMode(modeName) {
            const safeMode = normalizeUiMode(modeName);
            document.body.dataset.uiMode = safeMode;

            uiModeButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.uiModeChoice === safeMode);
            });
        }

        chrome.storage.local.get([STORAGE_KEY_UI_MODE], (result) => {
            applyUiMode(result && result[STORAGE_KEY_UI_MODE] ? result[STORAGE_KEY_UI_MODE] : fallbackMode);
        });

        uiModeButtons.forEach((button) => {
            if (!button) {
                return;
            }

            button.addEventListener('click', () => {
                const nextMode = normalizeUiMode(button.dataset.uiModeChoice);
                applyUiMode(nextMode);
                chrome.storage.local.set({ [STORAGE_KEY_UI_MODE]: nextMode });

                if (settingsMenuEl) {
                    settingsMenuEl.classList.remove('open');
                }
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_initDeveloperModeSettings(ctx, ...args) {
    with (ctx) {
        return (function initDeveloperModeSettings() {
        function applyDeveloperMode(enabled) {
            const isEnabled = Boolean(enabled);
            document.body.dataset.devMode = isEnabled ? 'true' : 'false';

            if (developerModeToggle) {
                developerModeToggle.checked = isEnabled;
            }

            if (developerModeStatusEl) {
                developerModeStatusEl.textContent = isEnabled
                    ? 'Режим разработчика включён: кнопки логов отображаются.'
                    : 'Режим разработчика выключен: кнопки логов скрыты.';
            }
        }

        chrome.storage.local.get([STORAGE_KEY_DEVELOPER_MODE], (result) => {
            applyDeveloperMode(Boolean(result && result[STORAGE_KEY_DEVELOPER_MODE]));
        });

        if (developerModeToggle) {
            developerModeToggle.addEventListener('change', () => {
                const nextValue = Boolean(developerModeToggle.checked);
                applyDeveloperMode(nextValue);
                chrome.storage.local.set({ [STORAGE_KEY_DEVELOPER_MODE]: nextValue });
            });
        }
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_initTestsViewModeSettings(ctx, ...args) {
    with (ctx) {
        return (function initTestsViewModeSettings() {
        const fallbackMode = 'modern';
        const allowedModes = new Set(['modern', 'classic']);

        function normalizeMode(value) {
            const mode = String(value || '').trim().toLowerCase();
            return allowedModes.has(mode) ? mode : fallbackMode;
        }

        function applyMode(value) {
            testsViewMode = normalizeMode(value);
            if (testsListEl) {
                testsListEl.dataset.testsView = testsViewMode;
            }
            testsViewButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.testsViewChoice === testsViewMode);
            });
            if (lastTestsResult && Array.isArray(lastTestsResult.tests)) {
                renderTestsResult(lastTestsResult);
            }
        }

        chrome.storage.local.get([STORAGE_KEY_TESTS_VIEW_MODE], (result) => {
            applyMode(result && result[STORAGE_KEY_TESTS_VIEW_MODE] ? result[STORAGE_KEY_TESTS_VIEW_MODE] : fallbackMode);
        });

        testsViewButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const nextMode = normalizeMode(button.dataset.testsViewChoice);
                chrome.storage.local.set({ [STORAGE_KEY_TESTS_VIEW_MODE]: nextMode }, () => applyMode(nextMode));
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_initHighlightColorSettings(ctx, ...args) {
    with (ctx) {
        return (function initHighlightColorSettings() {
        const fallbackMode = 'theme';

        function normalizeMode(value) {
            const mode = String(value || '').trim().toLowerCase();
            return mode === 'custom' ? 'custom' : fallbackMode;
        }

        function setStatus(text) {
            if (!highlightColorStatusEl) {
                return;
            }

            highlightColorStatusEl.textContent = text || '';
        }

        function applyState(mode, colorValue) {
            highlightColorMode = normalizeMode(mode);
            highlightColorValue = String(colorValue || '').trim();

            highlightColorButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.highlightColorMode === highlightColorMode);
            });

            if (highlightColorInput) {
                highlightColorInput.disabled = highlightColorMode !== 'custom';
                if (highlightColorMode === 'custom') {
                    highlightColorInput.value = highlightColorValue;
                }
            }

            refreshHighlightColorHint(setStatus);
        }

        chrome.storage.local.get([STORAGE_KEY_HIGHLIGHT_COLOR_MODE, STORAGE_KEY_HIGHLIGHT_COLOR_VALUE], (result) => {
            applyState(
                result && result[STORAGE_KEY_HIGHLIGHT_COLOR_MODE],
                result && result[STORAGE_KEY_HIGHLIGHT_COLOR_VALUE]
            );
        });

        highlightColorButtons.forEach((button) => {
            if (!button) {
                return;
            }

            button.addEventListener('click', () => {
                const nextMode = normalizeMode(button.dataset.highlightColorMode);
                highlightColorMode = nextMode;

                if (nextMode === 'theme') {
                    chrome.storage.local.set({ [STORAGE_KEY_HIGHLIGHT_COLOR_MODE]: 'theme' }, () => {
                        applyState('theme', highlightColorValue);
                    });
                    return;
                }

                chrome.storage.local.set({ [STORAGE_KEY_HIGHLIGHT_COLOR_MODE]: 'custom' }, () => {
                    applyState('custom', highlightColorValue);
                    if (highlightColorInput) {
                        highlightColorInput.focus();
                        highlightColorInput.select();
                    }
                });
            });
        });

        if (saveHighlightColorBtn) {
            saveHighlightColorBtn.addEventListener('click', () => {
                const rawValue = highlightColorInput ? highlightColorInput.value : '';
                const normalizedColor = normalizeColorInput(rawValue);
                if (!normalizedColor) {
                    setStatus('Некорректный формат. Используйте HEX (#22c55e) или RGB (rgb(34, 197, 94)).');
                    if (highlightColorInput) {
                        highlightColorInput.focus();
                    }
                    return;
                }

                chrome.storage.local.set({
                    [STORAGE_KEY_HIGHLIGHT_COLOR_MODE]: 'custom',
                    [STORAGE_KEY_HIGHLIGHT_COLOR_VALUE]: normalizedColor
                }, () => {
                    applyState('custom', normalizedColor);
                    setStatus(`Пользовательский цвет сохранён: ${normalizedColor}`);
                });
            });
        }

        if (resetHighlightColorBtn) {
            resetHighlightColorBtn.addEventListener('click', () => {
                chrome.storage.local.remove([STORAGE_KEY_HIGHLIGHT_COLOR_VALUE], () => {
                    chrome.storage.local.set({ [STORAGE_KEY_HIGHLIGHT_COLOR_MODE]: 'theme' }, () => {
                        applyState('theme', '');
                        setStatus('Цвет подсветки возвращён к режиму «От темы».');
                    });
                });
            });
        }

        if (highlightColorInput) {
            highlightColorInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (saveHighlightColorBtn) {
                        saveHighlightColorBtn.click();
                    }
                }
            });
        }
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_getThemeHighlightColor(ctx, ...args) {
    with (ctx) {
        return (function getThemeHighlightColor(themeName) {
        const safeTheme = String(themeName || '').toLowerCase();
        if (window.PopupAppearanceCatalog && typeof window.PopupAppearanceCatalog.getThemeHighlightColor === 'function') {
            return window.PopupAppearanceCatalog.getThemeHighlightColor(safeTheme);
        }

        const themeColors = {
            light: '#4f46e5',
            sunset: '#fb923c',
            mint: '#0d9488',
            ocean: '#06b6d4',
            rose: '#ec4899',
            midnight: '#8b5cf6',
            neon: '#22d3ee',
            aurora: '#34d399',
            graphite: '#cbd5e1',
            candy: '#a855f7',
            forest: '#84cc16',
            royal: '#fbbf24'
        };

        return themeColors[safeTheme] || '#22c55e';
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_normalizeColorInput(ctx, ...args) {
    with (ctx) {
        return (function normalizeColorInput(value) {
        const text = String(value || '').trim();
        if (!text) {
            return '';
        }

        const hexMatch = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexMatch) {
            const hexRaw = hexMatch[1].toLowerCase();
            if (hexRaw.length === 3) {
                const expanded = hexRaw.split('').map((ch) => ch + ch).join('');
                return `#${expanded}`;
            }
            return `#${hexRaw}`;
        }

        const rgbMatch = text.match(/^rgb\s*\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/i)
            || text.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);

        if (!rgbMatch) {
            return '';
        }

        const channels = [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((item) => Number(item));
        if (channels.some((valueItem) => !Number.isInteger(valueItem) || valueItem < 0 || valueItem > 255)) {
            return '';
        }

        return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_refreshHighlightColorHint(ctx, ...args) {
    with (ctx) {
        return (function refreshHighlightColorHint(customSetStatus) {
        const setStatus = typeof customSetStatus === 'function'
            ? customSetStatus
            : (text) => {
                if (highlightColorStatusEl) {
                    highlightColorStatusEl.textContent = text || '';
                }
            };

        const currentTheme = document.body && document.body.dataset
            ? (document.body.dataset.theme || 'dark')
            : 'dark';
        const themeColor = getThemeHighlightColor(currentTheme);

        if (highlightColorMode === 'theme') {
            setStatus(`Цвет подсветки берётся от темы: ${themeColor}`);
            return;
        }

        const normalized = normalizeColorInput(highlightColorValue || (highlightColorInput ? highlightColorInput.value : ''));
        if (!normalized) {
            setStatus('Введите свой цвет в формате HEX или RGB.');
            return;
        }

        setStatus(`Пользовательский цвет: ${normalized}`);
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_resolveHighlightColorForPage(ctx, ...args) {
    with (ctx) {
        return (function resolveHighlightColorForPage() {
        const themeColor = getThemeHighlightColor(document.body && document.body.dataset ? document.body.dataset.theme : 'dark');
        if (highlightColorMode !== 'custom') {
            return themeColor;
        }

        const normalized = normalizeColorInput(highlightColorValue || (highlightColorInput ? highlightColorInput.value : ''));
        return normalized || themeColor;
    
        }).apply(null, args);
    }
}

function __PopupSettingsFeature_initPromptSettings(ctx, ...args) {
    with (ctx) {
        return (function initPromptSettings() {
        if (!userPromptInput) {
            return;
        }

        function setPromptStatus(text) {
            if (promptSettingsStatusEl) {
                promptSettingsStatusEl.textContent = text || '';
            }
        }

        chrome.storage.local.get([STORAGE_KEY_USER_PROMPT], (result) => {
            userPromptInput.value = result && result[STORAGE_KEY_USER_PROMPT]
                ? String(result[STORAGE_KEY_USER_PROMPT])
                : '';
            setPromptStatus(userPromptInput.value.trim() ? 'Промт сохранён и будет добавляться перед копируемым текстом.' : 'Промт пустой. Копирование будет без добавочного текста.');
        });

        if (savePromptBtn) {
            savePromptBtn.addEventListener('click', () => {
                const promptText = userPromptInput.value.trim();
                chrome.storage.local.set({ [STORAGE_KEY_USER_PROMPT]: promptText }, () => {
                    setPromptStatus(promptText ? 'Промт сохранён.' : 'Промт очищен.');
                });
            });
        }

        if (clearPromptBtn) {
            clearPromptBtn.addEventListener('click', () => {
                userPromptInput.value = '';
                chrome.storage.local.remove([STORAGE_KEY_USER_PROMPT], () => {
                    setPromptStatus('Промт очищен.');
                });
            });
        }
    
        }).apply(null, args);
    }
}

window.PopupSettingsFeature = PopupSettingsFeature;

