class PopupBridgeFeature extends window.PopupFeatureBase {
    withFreshContentScript(...args) {
        return __PopupBridgeFeature_withFreshContentScript(this.ctx, ...args);
    }

    isSupportedTabUrl(...args) {
        return __PopupBridgeFeature_isSupportedTabUrl(this.ctx, ...args);
    }

    getActiveTab(...args) {
        return __PopupBridgeFeature_getActiveTab(this.ctx, ...args);
    }

    shouldRetryInjection(...args) {
        return __PopupBridgeFeature_shouldRetryInjection(this.ctx, ...args);
    }

    injectContentScript(...args) {
        return __PopupBridgeFeature_injectContentScript(this.ctx, ...args);
    }

    sendMessageToActiveTab(...args) {
        return __PopupBridgeFeature_sendMessageToActiveTab(this.ctx, ...args);
    }

    refreshCurrentName(...args) {
        return __PopupBridgeFeature_refreshCurrentName(this.ctx, ...args);
    }

    applyNameChange(...args) {
        return __PopupBridgeFeature_applyNameChange(this.ctx, ...args);
    }

    refreshPageInfo(...args) {
        return __PopupBridgeFeature_refreshPageInfo(this.ctx, ...args);
    }

    renderKeys(...args) {
        return __PopupBridgeFeature_renderKeys(this.ctx, ...args);
    }

    reinjectBridge(...args) {
        return __PopupBridgeFeature_reinjectBridge(this.ctx, ...args);
    }
}

function __PopupBridgeFeature_withFreshContentScript(ctx, ...args) {
    with (ctx) {
        return (function withFreshContentScript(callback) {
        getActiveTab((tab) => {
            if (!tab || !tab.id) {
                callback(new Error('Активная вкладка недоступна'));
                return;
            }

            if (!isSupportedTabUrl(tab.url)) {
                callback(new Error(ERR_UNSUPPORTED_TAB));
                return;
            }

            injectContentScript(tab.id, (injectError) => {
                if (injectError) {
                    callback(injectError);
                    return;
                }

                callback(null);
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_isSupportedTabUrl(ctx, ...args) {
    with (ctx) {
        return (function isSupportedTabUrl(url) {
        return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_getActiveTab(ctx, ...args) {
    with (ctx) {
        return (function getActiveTab(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            callback(tabs && tabs[0] ? tabs[0] : null);
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_shouldRetryInjection(ctx, ...args) {
    with (ctx) {
        return (function shouldRetryInjection(errorMessage) {
        if (!errorMessage) {
            return false;
        }

        return /Receiving end does not exist|Could not establish connection|message port closed before a response was received|не удается установить соединение|Передающий конец|порт сообщения закрыт/i
            .test(errorMessage);
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_injectContentScript(ctx, ...args) {
    with (ctx) {
        return (function injectContentScript(tabId, callback) {
        chrome.scripting.executeScript(
            {
                target: { tabId },
                files: ['content.js']
            },
            () => {
                if (chrome.runtime.lastError) {
                    callback(new Error(chrome.runtime.lastError.message || 'Не удалось внедрить content.js'));
                    return;
                }

                callback(null);
            }
        );
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_sendMessageToActiveTab(ctx, ...args) {
    with (ctx) {
        return (function sendMessageToActiveTab(message, callback, options = {}) {
        const { tryInject = true } = options;
        popupInfo('sendMessageToActiveTab:start', { action: message && message.action, tryInject });

        getActiveTab((tab) => {
            if (!tab || !tab.id) {
                popupWarn('Нет активной вкладки');
                callback(new Error('Активная вкладка недоступна'));
                return;
            }

            if (!isSupportedTabUrl(tab.url)) {
                popupWarn('Вкладка не поддерживается для messaging', { url: tab.url });
                callback(new Error(ERR_UNSUPPORTED_TAB));
                return;
            }

            chrome.tabs.sendMessage(tab.id, message, (response) => {
                if (!chrome.runtime.lastError) {
                    callback(null, response);
                    return;
                }

                const errorMessage = chrome.runtime.lastError.message || 'Нет связи с контент-скриптом';
                popupWarn('sendMessageToActiveTab:error', { action: message && message.action, errorMessage });
                if (!tryInject || !shouldRetryInjection(errorMessage)) {
                    callback(new Error(errorMessage));
                    return;
                }

                popupInfo('Пробую переинъекцию content.js', { tabId: tab.id });
                injectContentScript(tab.id, (injectError) => {
                    if (injectError) {
                        popupError('Переинъекция не удалась', injectError.message);
                        callback(injectError);
                        return;
                    }

                    chrome.tabs.sendMessage(tab.id, message, (retryResponse) => {
                        if (chrome.runtime.lastError) {
                            popupError('Ошибка после переинъекции', chrome.runtime.lastError.message);
                            callback(new Error(chrome.runtime.lastError.message || 'Нет связи с контент-скриптом'));
                            return;
                        }

                        popupInfo('sendMessageToActiveTab:retry:ok', { action: message && message.action });
                        callback(null, retryResponse);
                    });
                });
            });
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_refreshCurrentName(ctx, ...args) {
    with (ctx) {
        return (function refreshCurrentName(showConnectedStatus = false) {
        sendMessageToActiveTab({ action: 'getName' }, (error, response) => {
            if (error) {
                currentNameEl.textContent = error.message === ERR_UNSUPPORTED_TAB
                    ? 'Страница не поддерживается'
                    : 'Имя недоступно';

                showMainStatus(
                    error.message === ERR_UNSUPPORTED_TAB
                        ? 'Откройте обычную вкладку сайта для работы с именем'
                        : 'Нет связи с контент-скриптом',
                    'warning'
                );
                return;
            }

            if (response && response.name) {
                currentNameEl.textContent = response.name;
                newNameInput.value = response.name;

                if (showConnectedStatus) {
                    showMainStatus('Связь восстановлена', 'success');
                }
                return;
            }

            currentNameEl.textContent = 'Имя не найдено';
            showMainStatus('Не удалось определить имя', 'warning');
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_applyNameChange(ctx, ...args) {
    with (ctx) {
        return (function applyNameChange() {
        const newName = newNameInput.value.trim();

        if (!newName) {
            showMainStatus('Введите имя перед применением', 'error');
            return;
        }

        setBusy(changeBtn, true, 'Сохраняем...');

        sendMessageToActiveTab({ action: 'setName', name: newName }, (error, response) => {
            setBusy(changeBtn, false, 'Применить имя');

            if (error) {
                showMainStatus('Ошибка связи со страницей', 'error');
                return;
            }

            if (response && response.success) {
                currentNameEl.textContent = newName;
                saveToHistory(newName);
                showMainStatus('Имя успешно изменено', 'success');
            } else {
                showMainStatus('Не удалось изменить имя', 'error');
            }
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_refreshPageInfo(ctx, ...args) {
    with (ctx) {
        return (function refreshPageInfo() {
        getActiveTab((tab) => {
            if (!tab || !tab.url) {
                pageHostEl.textContent = 'Неизвестно';
                renderKeys([]);
                return;
            }

            try {
                const urlObj = new URL(tab.url);
                pageHostEl.textContent = urlObj.hostname;

                const keys = new Set();

                if (urlObj.pathname && urlObj.pathname.length > 1) {
                    const normalizedPath = urlObj.pathname.replace(/^\/|\/$/g, '');
                    normalizedPath
                        .split(/[./_-]+/)
                        .map((part) => part.trim())
                        .filter((part) => part.length > 2)
                        .forEach((part) => keys.add(part));
                }

                urlObj.hostname
                    .split('.')
                    .slice(0, -2)
                    .map((part) => part.trim())
                    .filter((part) => part.length > 2)
                    .forEach((part) => keys.add(part));

                renderKeys(Array.from(keys));
            } catch (_error) {
                pageHostEl.textContent = 'Ошибка URL';
                renderKeys([]);
            }
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_renderKeys(ctx, ...args) {
    with (ctx) {
        return (function renderKeys(keys) {
        keysListEl.innerHTML = '';

        if (!keys || keys.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty';
            emptyEl.textContent = 'Подсказки не найдены';
            keysListEl.appendChild(emptyEl);
            return;
        }

        keys.forEach((key) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chip';
            chip.textContent = key;
            chip.title = 'Подставить в поле имени';
            chip.addEventListener('click', () => {
                newNameInput.value = key;
                newNameInput.focus();
                showMainStatus('Ключ вставлен в поле имени', 'info');
            });
            keysListEl.appendChild(chip);
        });
    
        }).apply(null, args);
    }
}

function __PopupBridgeFeature_reinjectBridge(ctx, ...args) {
    with (ctx) {
        return (function reinjectBridge() {
        getActiveTab((tab) => {
            if (!tab || !tab.id) {
                showMainStatus('Нет активной вкладки', 'error');
                return;
            }

            if (!isSupportedTabUrl(tab.url)) {
                showMainStatus('На этой вкладке инъекция недоступна', 'warning');
                return;
            }

            setBusy(injectBtn, true, 'Обновляем...');

            injectContentScript(tab.id, (error) => {
                setBusy(injectBtn, false, 'Обновить связь');

                if (error) {
                    showMainStatus('Не удалось обновить скрипт', 'error');
                    return;
                }

                refreshPageInfo();
                refreshCurrentName(true);
                syncQuestionPanelState(true);
            });
        });
    
        }).apply(null, args);
    }
}

window.PopupBridgeFeature = PopupBridgeFeature;

