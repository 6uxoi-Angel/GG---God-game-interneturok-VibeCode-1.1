(function bootstrapPopupAppearanceCatalog(globalScope) {
    const themeChoices = [
        { id: 'themeLightBtn', value: 'light', title: 'Светлая тема', description: 'Мягкий светлый интерфейс.' },
        { id: 'themeDarkBtn', value: 'dark', title: 'Тёмная тема', description: 'Стеклянный тёмный интерфейс.' },
        { id: 'themeSunsetBtn', value: 'sunset', title: 'Закатная тема', description: 'Тёплая палитра оранжево-янтарных оттенков.' },
        { id: 'themeMintBtn', value: 'mint', title: 'Мятная тема', description: 'Свежий светлый интерфейс в зелёно-бирюзовых тонах.' },
        { id: 'themeOceanBtn', value: 'ocean', title: 'Ocean', description: 'Холодный бирюзово-синий интерфейс.' },
        { id: 'themeRoseBtn', value: 'rose', title: 'Rose', description: 'Нежная розово-лавандовая тема.' },
        { id: 'themeMidnightBtn', value: 'midnight', title: 'Midnight', description: 'Глубокая ночная тема с неоновым акцентом.' },
        { id: 'themeNeonBtn', value: 'neon', title: 'Neon', description: 'Кибер-неон с цианом и розовым свечением.' },
        { id: 'themeAuroraBtn', value: 'aurora', title: 'Aurora', description: 'Северное сияние: зелёный, бирюза и мягкий контраст.' },
        { id: 'themeGraphiteBtn', value: 'graphite', title: 'Graphite', description: 'Строгая тёмная тема без лишней яркости.' },
        { id: 'themeCandyBtn', value: 'candy', title: 'Candy', description: 'Светлая сладкая тема в розово-фиолетовых тонах.' },
        { id: 'themeForestBtn', value: 'forest', title: 'Forest', description: 'Глубокая зелёная тема для спокойной работы.' },
        { id: 'themeRoyalBtn', value: 'royal', title: 'Royal', description: 'Премиальный фиолетово-золотой стиль.' },
        { id: 'themeMatrixBtn', value: 'matrix', title: 'Matrix', description: 'Тёмный терминальный стиль с зелёным свечением.' },
        { id: 'themeIceBtn', value: 'ice', title: 'Ice', description: 'Холодный светлый стиль со стеклянными синими акцентами.' },
        { id: 'themeLavaBtn', value: 'lava', title: 'Lava', description: 'Контрастный тёмный стиль с красно-оранжевой энергией.' }
    ];

    const uiModeChoices = [
        { id: 'uiModeNewBtn', value: 'new', title: 'New', description: 'Исправленный современный вид с удобными табами.' },
        { id: 'uiModeCompactBtn', value: 'compact', title: 'Compact', description: 'Максимально плотный режим.' },
        { id: 'uiModeFocusBtn', value: 'focus', title: 'Focus', description: 'Более крупный и выразительный интерфейс.' },
        { id: 'uiModePremiumBtn', value: 'premium', title: 'Premium', description: 'Новая компоновка: боковые вкладки, глубина и анимации.' },
        { id: 'uiModeDockBtn', value: 'dock', title: 'Dock', description: 'Вкладки как нижняя док-панель, больше места под контент.' },
        { id: 'uiModeCardsBtn', value: 'cards', title: 'Cards', description: 'Карточный вид с крупными блоками и мягкой сеткой.' },
        { id: 'uiModeSplitBtn', value: 'split', title: 'Split', description: 'Двухколоночная компоновка для широкого popup.' },
        { id: 'uiModeOldBtn', value: 'old', title: 'Old', description: 'Классический вид расширения.' }
    ];

    const themeHighlightColors = {
        dark: '#22c55e',
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
        royal: '#fbbf24',
        matrix: '#22c55e',
        ice: '#0ea5e9',
        lava: '#f97316'
    };

    function escapeHtml(value) {
        return String(value || '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function buildThemeChoicesMarkup() {
        return themeChoices.map((choice) => {
            return [
                `<button id="${escapeHtml(choice.id)}" class="theme-choice" type="button" data-theme-choice="${escapeHtml(choice.value)}">`,
                `    <strong>${escapeHtml(choice.title)}</strong>`,
                `    <span>${escapeHtml(choice.description)}</span>`,
                '</button>'
            ].join('\n');
        }).join('\n');
    }

    function buildUiModeChoicesMarkup() {
        return uiModeChoices.map((choice) => {
            return [
                `<button id="${escapeHtml(choice.id)}" class="mode-choice" type="button" data-ui-mode-choice="${escapeHtml(choice.value)}">`,
                `    <strong>${escapeHtml(choice.title)}</strong>`,
                `    <span>${escapeHtml(choice.description)}</span>`,
                '</button>'
            ].join('\n');
        }).join('\n');
    }

    function renderSettingsChoices() {
        const themeChoicesContainer = document.getElementById('themeChoices');
        const uiModeChoicesContainer = document.getElementById('uiModeChoices');

        if (themeChoicesContainer) {
            themeChoicesContainer.innerHTML = buildThemeChoicesMarkup();
        }

        if (uiModeChoicesContainer) {
            uiModeChoicesContainer.innerHTML = buildUiModeChoicesMarkup();
        }

        return {
            themesRendered: Boolean(themeChoicesContainer),
            uiModesRendered: Boolean(uiModeChoicesContainer)
        };
    }

    const catalog = {
        fallbackTheme: 'dark',
        fallbackUiMode: 'new',
        themeChoices,
        uiModeChoices,
        themeHighlightColors,
        getAllowedThemes() {
            return themeChoices.map((choice) => choice.value);
        },
        getAllowedUiModes() {
            return uiModeChoices.map((choice) => choice.value);
        },
        getThemeHighlightColor(themeName) {
            const safeTheme = String(themeName || '').trim().toLowerCase();
            return themeHighlightColors[safeTheme] || themeHighlightColors.dark;
        },
        renderSettingsChoices
    };

    globalScope.PopupAppearanceCatalog = catalog;

    const renderResult = renderSettingsChoices();
    if (!renderResult.themesRendered || !renderResult.uiModesRendered) {
        document.addEventListener('DOMContentLoaded', renderSettingsChoices, { once: true });
    }
})(window);

