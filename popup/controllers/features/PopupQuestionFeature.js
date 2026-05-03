class PopupQuestionFeature extends window.PopupFeatureBase {
    setupQuestionPanelDefaults() {
        const c = this.ctx;
        this.stopScanPolling();
        this.setQuestionActionsEnabled(false);
        this.setScanProgress('Сканирование не запущено', false);

        if (c.scanBtn) {
            c.scanBtn.disabled = false;
            c.scanBtn.textContent = 'Сканировать';
        }

        c.questionAutoEnabled = false;
        this.renderQuestionAutoButton();
    }

    setQuestionActionsEnabled(enabled) {
        const c = this.ctx;
        if (c.autoCopyBtn) c.autoCopyBtn.disabled = !enabled;
        if (c.copyNowBtn) c.copyNowBtn.disabled = !enabled;
        if (c.autoPromptBtn) c.autoPromptBtn.disabled = !enabled;
    }

    setScanProgress(text, isActive) {
        const c = this.ctx;
        if (!c.scanProgressEl) return;

        c.scanProgressEl.textContent = text;
        c.scanProgressEl.classList.toggle('is-active', Boolean(isActive));
    }

    formatMs(ms) {
        const value = Math.max(0, Number(ms) || 0);
        return `${(value / 1000).toFixed(1)} с`;
    }

    renderScanStatus(status) {
        const c = this.ctx;

        if (!status) {
            c.scanActive = false;
            c.scanReady = false;
            this.setQuestionActionsEnabled(false);
            this.renderQuestionAutoButton();
            this.setScanProgress('Сканирование не запущено', false);
            return;
        }

        c.scanActive = Boolean(status.active);
        c.scanReady = Boolean(status.ready);

        if (c.scanActive) {
            const elapsedMs = Number(status.elapsedMs || status.lastElapsedMs || 0);
            const durationMs = Number(status.durationMs || 0);
            const foundCount = Number(status.foundCount || 0);
            const elapsedLabel = this.formatMs(elapsedMs);
            const durationLabel = durationMs > 0 ? this.formatMs(durationMs) : '...';
            this.setScanProgress(`Сканирование: ${elapsedLabel} / ${durationLabel}. Найдено: ${foundCount}`, true);
        } else if (c.scanReady) {
            const foundCount = Number(status.foundCount || 0);
            this.setScanProgress(`Сканирование завершено. Найдено: ${foundCount}`, false);
        } else if (status.lastError) {
            this.setScanProgress(`Сканирование остановлено: ${status.lastError}`, false);
        } else {
            this.setScanProgress('Сканирование не запущено', false);
        }

        this.setQuestionActionsEnabled(c.scanReady);
        if (!c.scanReady) {
            c.questionAutoEnabled = false;
        }

        this.renderQuestionAutoButton();
    }

    requestScanStatus(callback, options = {}) {
        const c = this.ctx;
        const { tryInject = true } = options;

        c.sendMessageToActiveTab({ action: 'getQuestionScanStatus' }, (error, response) => {
            if (error) {
                callback(error);
                return;
            }

            if (!response || !response.success) {
                callback(new Error((response && response.error) || 'Не удалось получить статус сканирования'));
                return;
            }

            callback(null, response.status || null);
        }, { tryInject });
    }

    startScanPolling() {
        const c = this.ctx;
        if (c.scanPollingTimer) {
            return;
        }

        c.scanPollingTimer = setInterval(() => {
            this.requestScanStatus((error, status) => {
                if (error) {
                    this.stopScanPolling();
                    this.showQuestionStatus('Не удалось обновить статус сканирования', 'warning');
                    return;
                }

                this.renderScanStatus(status);
                if (status && !status.active) {
                    this.stopScanPolling();
                    this.refreshQuestionAutoState(false);
                }
            }, { tryInject: false });
        }, c.SCAN_POLL_INTERVAL_MS || 500);
    }

    stopScanPolling() {
        const c = this.ctx;
        if (c.scanPollingTimer) {
            clearInterval(c.scanPollingTimer);
            c.scanPollingTimer = null;
        }
    }

    syncQuestionPanelState(showStatusOnSuccess) {
        this.requestScanStatus((error, status) => {
            if (error) {
                this.showQuestionStatus('Не удалось получить состояние сканера', 'warning');
                this.renderScanStatus(null);
                return;
            }

            this.renderScanStatus(status);
            if (status && status.active) {
                this.startScanPolling();
            }

            this.refreshQuestionAutoState(false);

            if (showStatusOnSuccess) {
                this.showQuestionStatus('Состояние сканера обновлено', 'success');
            }
        });
    }

    startQuestionScan() {
        const c = this.ctx;
        c.popupInfo('Пользователь запустил сканирование');

        c.setBusy(c.scanBtn, true, 'Запуск...');
        this.setQuestionActionsEnabled(false);

        c.sendMessageToActiveTab({ action: 'startQuestionScan' }, (error, response) => {
            c.setBusy(c.scanBtn, false, 'Сканировать');

            if (error) {
                this.showQuestionStatus(error.message || 'Не удалось запустить сканирование', 'error');
                this.renderScanStatus(null);
                return;
            }

            if (!response || !response.success) {
                this.showQuestionStatus((response && response.error) || 'Сканирование не запущено', 'warning');
                return;
            }

            this.showQuestionStatus('Сканирование запущено', 'info');
            this.renderScanStatus(response.status || { active: true, ready: false, foundCount: 0 });
            this.startScanPolling();
            this.refreshQuestionAutoState(false);
        });
    }

    refreshQuestionAutoState(showStatusOnSuccess) {
        const c = this.ctx;

        c.sendMessageToActiveTab({ action: 'getQuestionAutoCopyState' }, (error, response) => {
            if (error) {
                c.questionAutoEnabled = false;
                this.renderQuestionAutoButton();
                if (showStatusOnSuccess) {
                    this.showQuestionStatus('Автокопирование недоступно', 'warning');
                }
                return;
            }

            c.questionAutoEnabled = Boolean(response && response.enabled && c.scanReady);
            this.renderQuestionAutoButton();

            if (showStatusOnSuccess) {
                this.showQuestionStatus(c.questionAutoEnabled ? 'Автокопирование включено' : 'Автокопирование выключено', 'info');
            }
        }, { tryInject: false });
    }

    toggleQuestionAutoCopy() {
        const c = this.ctx;

        if (!c.scanReady) {
            this.showQuestionStatus('Сначала нажмите «Сканировать»', 'warning');
            return;
        }

        const nextValue = !c.questionAutoEnabled;
        c.setBusy(c.autoCopyBtn, true, nextValue ? 'Включаем...' : 'Выключаем...');

        c.sendMessageToActiveTab({ action: 'setQuestionAutoCopy', enabled: nextValue }, (error, response) => {
            c.setBusy(c.autoCopyBtn, false, c.questionAutoEnabled ? 'Выключить автокопирование' : 'Включить автокопирование');

            if (error) {
                this.showQuestionStatus(error.message || 'Не удалось переключить автокопирование', 'error');
                return;
            }

            if (!response || !response.success) {
                this.showQuestionStatus((response && response.error) || 'Не удалось переключить автокопирование', 'warning');
                return;
            }

            c.questionAutoEnabled = Boolean(response.enabled);
            this.renderQuestionAutoButton();
            this.showQuestionStatus(c.questionAutoEnabled ? 'Автокопирование включено' : 'Автокопирование выключено', 'success');
        }, { tryInject: false });
    }

    renderQuestionAutoButton() {
        const c = this.ctx;
        if (!c.autoCopyBtn) {
            return;
        }

        c.autoCopyBtn.classList.toggle('is-active', Boolean(c.questionAutoEnabled));
        c.autoCopyBtn.textContent = c.questionAutoEnabled
            ? 'Выключить автокопирование'
            : 'Включить автокопирование (Не трогать если не знаешь зачем!)';
    }

    copyQuestionNow() {
        const c = this.ctx;

        if (!c.scanReady) {
            this.showQuestionStatus('Сначала нажмите «Сканировать»', 'warning');
            return;
        }

        c.setBusy(c.copyNowBtn, true, 'Копируем...');

        c.sendMessageToActiveTab({ action: 'copyQuestionNow', force: true }, (error, response) => {
            c.setBusy(c.copyNowBtn, false, 'Скопировать сейчас');

            if (error) {
                this.showQuestionStatus(error.message || 'Не удалось скопировать текст', 'error');
                return;
            }

            if (!response || !response.success) {
                this.showQuestionStatus((response && response.error) || 'Копирование не выполнено', 'warning');
                return;
            }

            if (response.text && c.copiedQuestionEl) {
                c.copiedQuestionEl.value = response.text;
                c.saveLastCopiedQuestion(response.text);
            }

            const foundCount = Number(response.foundCount || 0);
            const copiedLabel = foundCount > 1
                ? `Скопировано. Вопросов: ${foundCount}`
                : 'Вопрос или задание скопировано';

            if (response.copied) {
                this.showQuestionStatus(copiedLabel, 'success');
            } else {
                this.showQuestionStatus('Буфер уже содержит этот текст', 'info');
            }
        }, { tryInject: false });
    }

    copyQuestionWithAutoPrompt() {
        const c = this.ctx;

        if (!c.scanReady) {
            this.showQuestionStatus('Сначала нажмите «Сканировать»', 'warning');
            return;
        }

        c.setBusy(c.autoPromptBtn, true, 'Копируем...');

        c.sendMessageToActiveTab({
            action: 'copyQuestionNow',
            force: true,
            promptOverride: c.AUTO_PROMPT_TEXT
        }, (error, response) => {
            c.setBusy(c.autoPromptBtn, false, 'Скопировать с автопромптом');

            if (error) {
                this.showQuestionStatus(error.message || 'Не удалось скопировать с автопромптом', 'error');
                return;
            }

            if (!response || !response.success) {
                this.showQuestionStatus((response && response.error) || 'Копирование с автопромптом не выполнено', 'warning');
                return;
            }

            if (response.text && c.copiedQuestionEl) {
                c.copiedQuestionEl.value = response.text;
                c.saveLastCopiedQuestion(response.text);
            }

            const foundCount = Number(response.foundCount || 0);
            const copiedLabel = foundCount > 1
                ? `Скопировано с автопромптом. Вопросов: ${foundCount}`
                : 'Вопрос или задание скопировано с автопромптом';

            if (response.copied) {
                this.showQuestionStatus(copiedLabel, 'success');
            } else {
                this.showQuestionStatus('Буфер уже содержит этот текст с автопромптом', 'info');
            }
        }, { tryInject: false });
    }

    downloadQuestionScannerLogs() {
        const c = this.ctx;
        c.setBusy(c.downloadQuestionLogsBtn, true, 'Готовим логи...');

        c.sendMessageToActiveTab({ action: 'getQuestionScannerLogs' }, (error, response) => {
            c.setBusy(c.downloadQuestionLogsBtn, false, 'Скачать логи сканера .txt');

            if (error) {
                this.showQuestionStatus(error.message || 'Не удалось получить логи', 'error');
                return;
            }

            if (!response || !response.success) {
                this.showQuestionStatus((response && response.error) || 'Логи недоступны', 'warning');
                return;
            }

            const text = response.text || 'Логи пустые';
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.href = url;
            link.download = `god-game-question-logs-${stamp}.txt`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);

            this.showQuestionStatus(`Логи скачаны. Записей: ${Number(response.count || 0)}`, 'success');
        }, { tryInject: false });
    }

    showQuestionStatus(message, type = 'info') {
        const c = this.ctx;
        if (!c.questionStatusEl) return;

        c.questionStatusEl.textContent = message;
        c.questionStatusEl.className = `status show is-${type}`;

        if (c.questionStatusTimer) clearTimeout(c.questionStatusTimer);

        c.questionStatusTimer = setTimeout(() => {
            c.questionStatusEl.className = 'status';
            c.questionStatusEl.textContent = '';
        }, 3500);
    }
}

window.PopupQuestionFeature = PopupQuestionFeature;
