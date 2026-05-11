class PopupAnswerFeature extends window.PopupFeatureBase {
    initHighlightPanel(...args) {
        return __PopupAnswerFeature_initHighlightPanel(this.ctx, ...args);
    }

    applyAnswersHighlightOnPage(...args) {
        return __PopupAnswerFeature_applyAnswersHighlightOnPage(this.ctx, ...args);
    }

    clearAnswersHighlightOnPage(...args) {
        return __PopupAnswerFeature_clearAnswersHighlightOnPage(this.ctx, ...args);
    }

    showHighlightStatus(...args) {
        return __PopupAnswerFeature_showHighlightStatus(this.ctx, ...args);
    }
}

function __PopupAnswerFeature_initHighlightPanel(ctx, ...args) {
    with (ctx) {
        return (function initHighlightPanel() {
        if (!highlightInputEl) {
            return;
        }

        if (clearHighlightBtn) {
            clearHighlightBtn.addEventListener('click', () => {
                highlightInputEl.value = '';
                highlightInputEl.focus();
            });
        }

        if (applyHighlightBtn) {
            applyHighlightBtn.addEventListener('click', applyAnswersHighlightOnPage);
        }

        if (clearPageHighlightBtn) {
            clearPageHighlightBtn.addEventListener('click', clearAnswersHighlightOnPage);
        }
    
        }).apply(null, args);
    }
}

function __PopupAnswerFeature_applyAnswersHighlightOnPage(ctx, ...args) {
    with (ctx) {
        return (function applyAnswersHighlightOnPage() {
        if (!highlightInputEl) {
            return;
        }

        const rawText = String(highlightInputEl.value || '').trim();
        if (!rawText) {
            showHighlightStatus('Вставьте ответ модели перед подсветкой', 'warning');
            return;
        }

        setBusy(applyHighlightBtn, true, 'Подсвечиваем...');
        const highlightColor = resolveHighlightColorForPage();
        withFreshContentScript((refreshError) => {
            if (refreshError) {
                setBusy(applyHighlightBtn, false, 'Подсветить на странице');
                showHighlightStatus(refreshError.message || 'Не удалось обновить скрипт на странице', 'error');
                return;
            }

            sendMessageToActiveTab(
                { action: 'highlightAnswersOnPage', rawText, highlightColor },
                (error, response) => {
                    setBusy(applyHighlightBtn, false, 'Подсветить на странице');

                    if (error) {
                        showHighlightStatus(error.message || 'Не удалось применить подсветку на странице', 'error');
                        return;
                    }

                    if (!response || !response.success) {
                        showHighlightStatus((response && response.error) || 'Подсветка не применена', 'warning');
                        return;
                    }

                    const usedColor = response.colorUsed ? ` Цвет: ${response.colorUsed}.` : '';
                    const baseMessage = `Подсветка применена. Заданий: ${Number(response.parsedCount || 0)}, элементов: ${Number(response.highlightedItems || 0)}.${usedColor}`;
                    const warnings = Array.isArray(response.warnings) ? response.warnings : [];
                    if (warnings.length > 0) {
                        showHighlightStatus(`${baseMessage} Есть замечания: ${warnings[0]}`, 'warning');
                    } else {
                        showHighlightStatus(baseMessage, 'success');
                    }
                },
                { tryInject: false }
            );
        });
    
        }).apply(null, args);
    }
}

function __PopupAnswerFeature_clearAnswersHighlightOnPage(ctx, ...args) {
    with (ctx) {
        return (function clearAnswersHighlightOnPage() {
        setBusy(clearPageHighlightBtn, true, 'Очищаем...');

        withFreshContentScript((refreshError) => {
            if (refreshError) {
                setBusy(clearPageHighlightBtn, false, 'Убрать подсветку');
                showHighlightStatus(refreshError.message || 'Не удалось обновить скрипт на странице', 'error');
                return;
            }

            sendMessageToActiveTab({ action: 'clearHighlightedAnswersOnPage' }, (error, response) => {
                setBusy(clearPageHighlightBtn, false, 'Убрать подсветку');

                if (error) {
                    showHighlightStatus(error.message || 'Не удалось очистить подсветку', 'error');
                    return;
                }

                if (!response || !response.success) {
                    showHighlightStatus((response && response.error) || 'Не удалось очистить подсветку', 'warning');
                    return;
                }

                showHighlightStatus('Подсветка на странице очищена', 'success');
            }, { tryInject: false });
        });
    
        }).apply(null, args);
    }
}

function __PopupAnswerFeature_showHighlightStatus(ctx, ...args) {
    with (ctx) {
        return (function showHighlightStatus(message, type = 'info') {
        if (!highlightStatusEl) {
            return;
        }

        highlightStatusEl.textContent = message;
        highlightStatusEl.className = `status show is-${type}`;

        if (highlightStatusTimer) {
            clearTimeout(highlightStatusTimer);
        }

        highlightStatusTimer = setTimeout(() => {
            highlightStatusEl.className = 'status';
            highlightStatusEl.textContent = '';
        }, 4200);
    
        }).apply(null, args);
    }
}

window.PopupAnswerFeature = PopupAnswerFeature;

