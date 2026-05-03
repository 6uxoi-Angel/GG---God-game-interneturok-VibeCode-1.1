class PopupUtilityFeature extends window.PopupFeatureBase {
    copyTextToClipboard(...args) {
        return __PopupUtilityFeature_copyTextToClipboard(this.ctx, ...args);
    }

    setBusy(...args) {
        return __PopupUtilityFeature_setBusy(this.ctx, ...args);
    }

    saveToHistory(...args) {
        return __PopupUtilityFeature_saveToHistory(this.ctx, ...args);
    }

    loadHistory(...args) {
        return __PopupUtilityFeature_loadHistory(this.ctx, ...args);
    }

    renderHistory(...args) {
        return __PopupUtilityFeature_renderHistory(this.ctx, ...args);
    }

    loadLastCopiedQuestion(...args) {
        return __PopupUtilityFeature_loadLastCopiedQuestion(this.ctx, ...args);
    }

    saveLastCopiedQuestion(...args) {
        return __PopupUtilityFeature_saveLastCopiedQuestion(this.ctx, ...args);
    }

    formatDate(...args) {
        return __PopupUtilityFeature_formatDate(this.ctx, ...args);
    }

    showMainStatus(...args) {
        return __PopupUtilityFeature_showMainStatus(this.ctx, ...args);
    }
}

function __PopupUtilityFeature_copyTextToClipboard(ctx, ...args) {
    with (ctx) {
        return (function copyTextToClipboard(text, callback) {
        const safeText = String(text || '');
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(safeText)
                .then(() => callback(true))
                .catch(() => {
                    const area = document.createElement('textarea');
                    area.value = safeText;
                    area.setAttribute('readonly', 'readonly');
                    area.style.position = 'fixed';
                    area.style.left = '-9999px';
                    document.body.appendChild(area);
                    area.select();
                    let copied = false;
                    try {
                        copied = document.execCommand('copy');
                    } catch (_error) {
                        copied = false;
                    }
                    area.remove();
                    callback(copied);
                });
            return;
        }

        const area = document.createElement('textarea');
        area.value = safeText;
        area.setAttribute('readonly', 'readonly');
        area.style.position = 'fixed';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_error) {
            copied = false;
        }
        area.remove();
        callback(copied);
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_setBusy(ctx, ...args) {
    with (ctx) {
        return (function setBusy(button, isBusy, busyText) {
        if (!button) {
            return;
        }

        if (!button.dataset.defaultText) {
            button.dataset.defaultText = button.textContent;
        }

        button.disabled = isBusy;
        button.textContent = isBusy ? busyText : button.dataset.defaultText;
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_saveToHistory(ctx, ...args) {
    with (ctx) {
        return (function saveToHistory(name) {
        chrome.storage.local.get([STORAGE_KEY_HISTORY], (result) => {
            const history = Array.isArray(result[STORAGE_KEY_HISTORY]) ? result[STORAGE_KEY_HISTORY] : [];

            const cleanHistory = history.filter((item) => item && item.name && item.name !== name);
            cleanHistory.unshift({ name, date: new Date().toISOString() });

            const nextHistory = cleanHistory.slice(0, MAX_HISTORY_ITEMS);
            chrome.storage.local.set({ [STORAGE_KEY_HISTORY]: nextHistory }, () => {
                renderHistory(nextHistory);
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_loadHistory(ctx, ...args) {
    with (ctx) {
        return (function loadHistory() {
        chrome.storage.local.get([STORAGE_KEY_HISTORY], (result) => {
            const history = Array.isArray(result[STORAGE_KEY_HISTORY]) ? result[STORAGE_KEY_HISTORY] : [];
            renderHistory(history);
        });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_renderHistory(ctx, ...args) {
    with (ctx) {
        return (function renderHistory(history) {
        historyListEl.innerHTML = '';

        if (!history || history.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty';
            emptyEl.textContent = 'История пока пустая';
            historyListEl.appendChild(emptyEl);
            return;
        }

        history.forEach((item) => {
            const entry = document.createElement('button');
            entry.type = 'button';
            entry.className = 'history-item';

            const nameEl = document.createElement('span');
            nameEl.className = 'history-name';
            nameEl.textContent = item.name || 'Без имени';

            const dateEl = document.createElement('span');
            dateEl.className = 'history-date';
            dateEl.textContent = formatDate(item.date);

            entry.appendChild(nameEl);
            entry.appendChild(dateEl);
            entry.addEventListener('click', () => {
                newNameInput.value = item.name || '';
                newNameInput.focus();
                showMainStatus('Имя из истории подставлено', 'info');
            });

            historyListEl.appendChild(entry);
        });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_loadLastCopiedQuestion(ctx, ...args) {
    with (ctx) {
        return (function loadLastCopiedQuestion() {
        chrome.storage.local.get([STORAGE_KEY_LAST_QUESTION_COPY], (result) => {
            if (result && typeof result[STORAGE_KEY_LAST_QUESTION_COPY] === 'string') {
                copiedQuestionEl.value = result[STORAGE_KEY_LAST_QUESTION_COPY];
            }
        });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_saveLastCopiedQuestion(ctx, ...args) {
    with (ctx) {
        return (function saveLastCopiedQuestion(text) {
        chrome.storage.local.set({ [STORAGE_KEY_LAST_QUESTION_COPY]: text });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_formatDate(ctx, ...args) {
    with (ctx) {
        return (function formatDate(rawDate) {
        if (!rawDate) {
            return 'Без даты';
        }

        const parsed = new Date(rawDate);
        if (Number.isNaN(parsed.getTime())) {
            return String(rawDate);
        }

        return parsed.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    
        }).apply(null, args);
    }
}

function __PopupUtilityFeature_showMainStatus(ctx, ...args) {
    with (ctx) {
        return (function showMainStatus(message, type = 'info') {
        if (!statusEl) {
            return;
        }

        statusEl.textContent = message;
        statusEl.className = `status show is-${type}`;

        if (mainStatusTimer) {
            clearTimeout(mainStatusTimer);
        }

        mainStatusTimer = setTimeout(() => {
            statusEl.className = 'status';
            statusEl.textContent = '';
        }, 3200);
    
        }).apply(null, args);
    }
}

window.PopupUtilityFeature = PopupUtilityFeature;

