class ContentScannerFeature extends window.ContentFeatureBase {
    copyUsingExecCommand(...args) {
        return __ContentScannerFeature_copyUsingExecCommand(this.ctx, ...args);
    }

    copyTextToClipboard(...args) {
        return __ContentScannerFeature_copyTextToClipboard(this.ctx, ...args);
    }

    clearScanTimer(...args) {
        return __ContentScannerFeature_clearScanTimer(this.ctx, ...args);
    }

    getScanStatus(...args) {
        return __ContentScannerFeature_getScanStatus(this.ctx, ...args);
    }

    finishScan(...args) {
        return __ContentScannerFeature_finishScan(this.ctx, ...args);
    }

    scanStep(...args) {
        return __ContentScannerFeature_scanStep(this.ctx, ...args);
    }

    clampDuration(...args) {
        return __ContentScannerFeature_clampDuration(this.ctx, ...args);
    }

    startQuestionScan(...args) {
        return __ContentScannerFeature_startQuestionScan(this.ctx, ...args);
    }

    copyCurrentQuestion(...args) {
        return __ContentScannerFeature_copyCurrentQuestion(this.ctx, ...args);
    }

    scheduleAutoQuestionCopy(...args) {
        return __ContentScannerFeature_scheduleAutoQuestionCopy(this.ctx, ...args);
    }

    startQuestionObserver(...args) {
        return __ContentScannerFeature_startQuestionObserver(this.ctx, ...args);
    }

    stopQuestionObserver(...args) {
        return __ContentScannerFeature_stopQuestionObserver(this.ctx, ...args);
    }

    applyQuestionAutoCopyState(...args) {
        return __ContentScannerFeature_applyQuestionAutoCopyState(this.ctx, ...args);
    }

    saveQuestionAutoCopyState(...args) {
        return __ContentScannerFeature_saveQuestionAutoCopyState(this.ctx, ...args);
    }

    loadQuestionAutoCopyState(...args) {
        return __ContentScannerFeature_loadQuestionAutoCopyState(this.ctx, ...args);
    }
}

function __ContentScannerFeature_copyUsingExecCommand(ctx, ...args) {
    with (ctx) {
        return (function copyUsingExecCommand(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_error) {
            copied = false;
        }

        textarea.remove();
        return copied;
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_copyTextToClipboard(ctx, ...args) {
    with (ctx) {
        return (function copyTextToClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(text)
                .then(() => true)
                .catch(() => copyUsingExecCommand(text));
        }

        return Promise.resolve(copyUsingExecCommand(text));
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_clearScanTimer(ctx, ...args) {
    with (ctx) {
        return (function clearScanTimer() {
        if (questionCopyState.scan.timerId) {
            clearInterval(questionCopyState.scan.timerId);
            questionCopyState.scan.timerId = null;
        }
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_getScanStatus(ctx, ...args) {
    with (ctx) {
        return (function getScanStatus() {
        const scan = questionCopyState.scan;
        const elapsedMs = scan.active
            ? Date.now() - scan.startedAt
            : scan.lastElapsedMs;

        return {
            active: scan.active,
            ready: scan.ready,
            startedAt: scan.startedAt,
            durationMs: scan.durationMs,
            elapsedMs,
            lastError: scan.lastError,
            foundCount: scan.foundCount,
            lastQuestion: scan.lastQuestion,
            lastOptionsCount: scan.lastOptionsCount
        };
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_finishScan(ctx, ...args) {
    with (ctx) {
        return (function finishScan(success, errorMessage) {
        const scan = questionCopyState.scan;
        scan.active = false;
        scan.lastElapsedMs = Math.max(0, Date.now() - scan.startedAt);
        clearScanTimer();

        if (success) {
            scan.ready = true;
            scan.lastError = '';
            logInfo(`Сканирование завершено успешно за ${scan.lastElapsedMs} мс`, {
                foundCount: scan.foundCount,
                question: scan.lastQuestion,
                options: scan.lastOptionsCount
            });
        } else {
            scan.ready = false;
            scan.lastError = errorMessage || 'Вопрос не найден';
            logWarn(`Сканирование завершено без результата: ${scan.lastError}`);
        }
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_scanStep(ctx, ...args) {
    with (ctx) {
        return (function scanStep() {
        const scan = questionCopyState.scan;
        if (!scan.active) {
            return;
        }

        const elapsedMs = Date.now() - scan.startedAt;
        scan.lastElapsedMs = elapsedMs;

        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        if (elapsedSeconds !== scan.lastLoggedSecond) {
            scan.lastLoggedSecond = elapsedSeconds;
            logInfo(`Сканирование... ${elapsedSeconds}с / ${Math.floor(scan.durationMs / 1000)}с`);
        }

        let scanResult;
        try {
            scanResult = extractQuestionPayloads();
        } catch (error) {
            logError('Ошибка во время сканирования DOM', error);
            finishScan(false, 'Ошибка чтения страницы');
            return;
        }

        if (scanResult.success) {
            const payloads = scanResult.payloads || [];
            const first = payloads[0] || null;

            scan.payloads = payloads;
            scan.foundCount = payloads.length;
            scan.lastQuestion = first ? first.question : '';
            scan.lastOptionsCount = first ? first.options.length : 0;
            finishScan(true, '');
            return;
        }

        if (elapsedMs >= scan.durationMs) {
            finishScan(false, scanResult.error || 'Вопросы не найдены');
        }
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_clampDuration(ctx, ...args) {
    with (ctx) {
        return (function clampDuration(value) {
        const asNumber = Number(value);
        if (!Number.isFinite(asNumber)) {
            return QUESTION_SCAN_DEFAULT_DURATION_MS;
        }

        return Math.min(
            QUESTION_SCAN_MAX_DURATION_MS,
            Math.max(QUESTION_SCAN_MIN_DURATION_MS, Math.round(asNumber))
        );
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_startQuestionScan(ctx, ...args) {
    with (ctx) {
        return (function startQuestionScan(durationMs) {
        const scan = questionCopyState.scan;

        if (scan.active) {
            logInfo('Сканирование уже запущено');
            return {
                success: true,
                status: getScanStatus()
            };
        }

        scan.active = true;
        scan.ready = false;
        scan.startedAt = Date.now();
        scan.durationMs = clampDuration(durationMs);
        scan.lastElapsedMs = 0;
        scan.lastError = '';
        scan.foundCount = 0;
        scan.lastQuestion = '';
        scan.lastOptionsCount = 0;
        scan.payloads = [];
        scan.lastLoggedSecond = -1;

        // При новом сканировании выключаем автокопирование до получения результата.
        questionCopyState.enabled = false;
        stopQuestionObserver();

        logInfo('Запуск сканирования страницы', { durationMs: scan.durationMs });
        scanStep();

        if (scan.active) {
            scan.timerId = setInterval(() => {
                scanStep();
            }, QUESTION_SCAN_TICK_MS);
        }

        return {
            success: true,
            status: getScanStatus()
        };
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_copyCurrentQuestion(ctx, ...args) {
    with (ctx) {
        return (function copyCurrentQuestion(force, promptOverride = null) {
        const scan = questionCopyState.scan;

        if (!scan.ready) {
            return Promise.resolve({
                success: false,
                error: 'Сначала нажмите «Сканировать»'
            });
        }

        let payloads = Array.isArray(scan.payloads) ? scan.payloads : [];
        if (!force || payloads.length === 0) {
            const scanResult = extractQuestionPayloads();
            if (!scanResult.success && payloads.length === 0) {
                return Promise.resolve(scanResult);
            }
            if (scanResult.success) {
                payloads = scanResult.payloads || [];
                scan.payloads = payloads;
                scan.foundCount = payloads.length;
            }
        }

        const combinedText = buildCombinedCopyText(payloads);
        const firstPayload = payloads[0] || { question: '', options: [] };

        const promptPromise = typeof promptOverride === 'string'
            ? Promise.resolve(normalizePromptText(promptOverride))
            : getUserPromptText();

        return promptPromise.then((promptText) => {
            const finalText = applyUserPromptToCopyText(combinedText, promptText);
            const combinedSignature = `${buildCombinedSignature(payloads)}||prompt:${promptText}`;

            if (!force && combinedSignature === questionCopyState.lastSignature) {
                logInfo('Вопросы/задания не изменились, пропуск копирования');
                return {
                    success: true,
                    copied: false,
                    text: finalText,
                    question: firstPayload.question,
                    options: firstPayload.options,
                    foundCount: payloads.length,
                    reason: 'same-question'
                };
            }

            logInfo('Копирование вопросов/заданий', { foundCount: payloads.length, totalTextLength: finalText.length });
            return copyTextToClipboard(finalText).then((copied) => {
                if (!copied) {
                    logError('Не удалось скопировать текст в буфер');
                    return {
                        success: false,
                        error: 'Не удалось скопировать текст в буфер'
                    };
                }

                questionCopyState.lastSignature = combinedSignature;
                questionCopyState.lastText = finalText;

                logInfo('Вопросы/задания скопированы в буфер', {
                    foundCount: payloads.length,
                    question: String(firstPayload.question || '').substring(0, 50),
                    options: (firstPayload.options || []).length
                });

                return {
                    success: true,
                    copied: true,
                    text: finalText,
                    question: firstPayload.question,
                    options: firstPayload.options,
                    foundCount: payloads.length
                };
            });
        });
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_scheduleAutoQuestionCopy(ctx, ...args) {
    with (ctx) {
        return (function scheduleAutoQuestionCopy() {
        if (!questionCopyState.enabled || !questionCopyState.scan.ready) {
            return;
        }

        if (questionCopyState.debounceTimer) {
            clearTimeout(questionCopyState.debounceTimer);
        }

        questionCopyState.debounceTimer = setTimeout(() => {
            copyCurrentQuestion(false).catch((error) => {
                logError('Автокопирование завершилось с ошибкой', error);
            });
        }, QUESTION_AUTOCOPY_DEBOUNCE_MS);
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_startQuestionObserver(ctx, ...args) {
    with (ctx) {
        return (function startQuestionObserver() {
        if (questionCopyState.observer || !questionCopyState.scan.ready) {
            return;
        }

        if (!document.body) {
            return;
        }

        questionCopyState.observer = new MutationObserver(() => {
            scheduleAutoQuestionCopy();
        });

        questionCopyState.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        logInfo('Автокопирование: observer запущен');
        scheduleAutoQuestionCopy();
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_stopQuestionObserver(ctx, ...args) {
    with (ctx) {
        return (function stopQuestionObserver() {
        if (questionCopyState.observer) {
            questionCopyState.observer.disconnect();
            questionCopyState.observer = null;
            logInfo('Автокопирование: observer остановлен');
        }

        if (questionCopyState.debounceTimer) {
            clearTimeout(questionCopyState.debounceTimer);
            questionCopyState.debounceTimer = null;
        }
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_applyQuestionAutoCopyState(ctx, ...args) {
    with (ctx) {
        return (function applyQuestionAutoCopyState(enabled) {
        const canEnable = Boolean(enabled) && questionCopyState.scan.ready;
        questionCopyState.enabled = canEnable;

        if (questionCopyState.enabled) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    startQuestionObserver();
                }, { once: true });
            } else {
                startQuestionObserver();
            }
        } else {
            stopQuestionObserver();
        }
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_saveQuestionAutoCopyState(ctx, ...args) {
    with (ctx) {
        return (function saveQuestionAutoCopyState(enabled, callback) {
        applyQuestionAutoCopyState(enabled);

        chrome.storage.local.set({ [QUESTION_AUTOCOPY_STORAGE_KEY]: questionCopyState.enabled }, () => {
            if (callback) {
                callback();
            }
        });
    
        }).apply(null, args);
    }
}

function __ContentScannerFeature_loadQuestionAutoCopyState(ctx, ...args) {
    with (ctx) {
        return (function loadQuestionAutoCopyState() {
        chrome.storage.local.get([QUESTION_AUTOCOPY_STORAGE_KEY], (result) => {
            const enabled = Boolean(result && result[QUESTION_AUTOCOPY_STORAGE_KEY]);
            applyQuestionAutoCopyState(enabled);
        });
    
        }).apply(null, args);
    }
}

window.ContentScannerFeature = ContentScannerFeature;

