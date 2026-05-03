class ContentJournalFeature extends window.ContentFeatureBase {
    getDirectTableCells(...args) {
        return __ContentJournalFeature_getDirectTableCells(this.ctx, ...args);
    }

    getSubjectNameFromCell(...args) {
        return __ContentJournalFeature_getSubjectNameFromCell(this.ctx, ...args);
    }

    calculateFinalMark(...args) {
        return __ContentJournalFeature_calculateFinalMark(this.ctx, ...args);
    }

    extractJournalGrades(...args) {
        return __ContentJournalFeature_extractJournalGrades(this.ctx, ...args);
    }

    getJournalWeekLabels(...args) {
        return __ContentJournalFeature_getJournalWeekLabels(this.ctx, ...args);
    }

    normalizeHomeworkHref(...args) {
        return __ContentJournalFeature_normalizeHomeworkHref(this.ctx, ...args);
    }

    isHomeworkMarkGraded(...args) {
        return __ContentJournalFeature_isHomeworkMarkGraded(this.ctx, ...args);
    }

    extractHomeworkMarkFromCell(...args) {
        return __ContentJournalFeature_extractHomeworkMarkFromCell(this.ctx, ...args);
    }

    extractHomeworkLinksFromJournal(...args) {
        return __ContentJournalFeature_extractHomeworkLinksFromJournal(this.ctx, ...args);
    }

    extractLessonTopicFromDocument(...args) {
        return __ContentJournalFeature_extractLessonTopicFromDocument(this.ctx, ...args);
    }

    extractQuestionsCountFromDocument(...args) {
        return __ContentJournalFeature_extractQuestionsCountFromDocument(this.ctx, ...args);
    }

    getHomeworkTestSignals(...args) {
        return __ContentJournalFeature_getHomeworkTestSignals(this.ctx, ...args);
    }

    detectHomeworkTestPage(...args) {
        return __ContentJournalFeature_detectHomeworkTestPage(this.ctx, ...args);
    }

    waitForIframeDocument(...args) {
        return __ContentJournalFeature_waitForIframeDocument(this.ctx, ...args);
    }

    inspectHomeworkViaIframe(...args) {
        return __ContentJournalFeature_inspectHomeworkViaIframe(this.ctx, ...args);
    }

    inspectHomeworkViaFetch(...args) {
        return __ContentJournalFeature_inspectHomeworkViaFetch(this.ctx, ...args);
    }

    shouldRecheckHomeworkViaFetch(...args) {
        return __ContentJournalFeature_shouldRecheckHomeworkViaFetch(this.ctx, ...args);
    }

    inspectHomeworkForTest(...args) {
        return __ContentJournalFeature_inspectHomeworkForTest(this.ctx, ...args);
    }

    findJournalTests(...args) {
        return __ContentJournalFeature_findJournalTests(this.ctx, ...args);
    }
}

function __ContentJournalFeature_getDirectTableCells(ctx, ...args) {
    with (ctx) {
        return (function getDirectTableCells(row) {
        return Array.from(row.children).filter((child) => child && child.tagName === 'TD');
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_getSubjectNameFromCell(ctx, ...args) {
    with (ctx) {
        return (function getSubjectNameFromCell(cell) {
        if (!cell) return '';
        const titledNode = cell.querySelector('[title]');
        const title = normalizeText(titledNode ? titledNode.getAttribute('title') : '');
        return title || normalizeText(cell.textContent);
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_calculateFinalMark(ctx, ...args) {
    with (ctx) {
        return (function calculateFinalMark(average) {
        if (!Number.isFinite(average)) return null;
        if (average >= 4.5) return 5;
        if (average >= 3.5) return 4;
        if (average >= 2.5) return 3;
        return 2;
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_extractJournalGrades(ctx, ...args) {
    with (ctx) {
        return (function extractJournalGrades() {
        const journalTable = document.querySelector('table[data-sticky-table="true"]') || document.querySelector('table');
        if (!journalTable) {
            return { success: false, error: 'Таблица журнала на странице не найдена' };
        }

        const bodyRows = Array.from(journalTable.querySelectorAll(':scope > tbody > tr'));
        if (bodyRows.length === 0) {
            return { success: false, error: 'Строки с предметами не найдены' };
        }

        const subjects = [];
        bodyRows.forEach((row) => {
            const cells = getDirectTableCells(row);
            if (cells.length < 2) return;

            const subjectName = getSubjectNameFromCell(cells[0]);
            if (!subjectName) return;

            const gradeCells = cells.slice(1, Math.max(1, cells.length - 1));
            const marks = [];

            gradeCells.forEach((cell) => {
                cell.querySelectorAll('.default-mark').forEach((node) => {
                    const mark = Number(normalizeText(node.textContent));
                    if ([2, 3, 4, 5].includes(mark)) marks.push(mark);
                });
            });

            const sum = marks.reduce((acc, value) => acc + value, 0);
            const average = marks.length > 0 ? sum / marks.length : null;
            const finalMark = calculateFinalMark(average);

            subjects.push({
                subject: subjectName,
                marks,
                marksCount: marks.length,
                average: average === null ? null : Number(average.toFixed(2)),
                finalMark
            });
        });

        if (subjects.length === 0) {
            return { success: false, error: 'Предметы в таблице не распознаны' };
        }

        return {
            success: true,
            subjects,
            totalSubjects: subjects.length,
            subjectsWithMarks: subjects.filter((item) => item.marksCount > 0).length
        };
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_getJournalWeekLabels(ctx, ...args) {
    with (ctx) {
        return (function getJournalWeekLabels(journalTable) {
        const headerRows = Array.from(journalTable.querySelectorAll('thead tr'));
        const weekRow = headerRows.length > 1 ? headerRows[1] : null;
        if (!weekRow) {
            return [];
        }

        return Array.from(weekRow.querySelectorAll('td')).map((cell) => {
            const lines = Array.from(cell.querySelectorAll('div'))
                .map((node) => normalizeText(node.textContent))
                .filter(Boolean);
            const uniqueLines = [];
            lines.forEach((line) => {
                if (!uniqueLines.includes(line)) uniqueLines.push(line);
            });
            return uniqueLines.join(', ') || normalizeText(cell.textContent);
        });
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_normalizeHomeworkHref(ctx, ...args) {
    with (ctx) {
        return (function normalizeHomeworkHref(rawHref) {
        const href = String(rawHref || '').trim();
        if (!href) {
            return '';
        }

        try {
            return new URL(href, window.location.origin).href;
        } catch (_error) {
            return href;
        }
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_isHomeworkMarkGraded(ctx, ...args) {
    with (ctx) {
        return (function isHomeworkMarkGraded(rawMark) {
        const text = normalizeText(rawMark);
        if (!text) {
            return false;
        }

        if (/\b[2-5]\b/.test(text)) {
            return true;
        }

        if (/(зач|зачет|зачёт|credit|pass)/i.test(text)) {
            return true;
        }

        return false;
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_extractHomeworkMarkFromCell(ctx, ...args) {
    with (ctx) {
        return (function extractHomeworkMarkFromCell(cell, link) {
        const candidates = [];
        if (link) {
            candidates.push(...Array.from(link.querySelectorAll('.default-mark')));
        }
        if (cell) {
            candidates.push(...Array.from(cell.querySelectorAll('.default-mark')));
        }

        for (const node of candidates) {
            const text = normalizeText(node ? node.textContent : '');
            if (text) {
                return text;
            }
        }

        return '';
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_extractHomeworkLinksFromJournal(ctx, ...args) {
    with (ctx) {
        return (function extractHomeworkLinksFromJournal() {
        const journalTable = document.querySelector('table[data-sticky-table="true"]') || document.querySelector('table');
        if (!journalTable) {
            return { success: false, error: 'Таблица журнала на странице не найдена', homeworks: [], skippedByMark: 0 };
        }

        const bodyRows = Array.from(journalTable.querySelectorAll(':scope > tbody > tr'));
        if (bodyRows.length === 0) {
            return { success: false, error: 'Строки с предметами не найдены', homeworks: [], skippedByMark: 0 };
        }

        const weekLabels = getJournalWeekLabels(journalTable);
        const seen = new Set();
        const homeworks = [];
        let skippedByMark = 0;

        bodyRows.forEach((row) => {
            const cells = getDirectTableCells(row);
            if (cells.length < 2) return;

            const subjectName = getSubjectNameFromCell(cells[0]);
            if (!subjectName) return;

            const homeworkCells = cells.slice(1, Math.max(1, cells.length - 1));
            homeworkCells.forEach((cell, weekIndex) => {
                const links = Array.from(cell.querySelectorAll('a[href*="type=homework"], a[href*="fromJournal=true"]'));
                links.forEach((link) => {
                    const href = normalizeHomeworkHref(link.getAttribute('href'));
                    if (!href || seen.has(href)) return;
                    seen.add(href);

                    const mark = extractHomeworkMarkFromCell(cell, link);
                    if (isHomeworkMarkGraded(mark)) {
                        skippedByMark += 1;
                        logInfo('Пропуск ДЗ с оценкой', {
                            subject: subjectName,
                            week: weekLabels[weekIndex] || `${weekIndex + 1} неделя`,
                            mark,
                            path: href.replace(window.location.origin, '')
                        });
                        return;
                    }

                    const itemIdMatch = href.match(/[?&]itemId=([^&]+)/);
                    const lessonMatch = href.match(/\/lesson\/(\d+)/);

                    homeworks.push({
                        href,
                        path: href.replace(window.location.origin, ''),
                        subject: subjectName,
                        week: weekLabels[weekIndex] || `${weekIndex + 1} неделя`,
                        journalText: normalizeText(link.textContent),
                        mark,
                        itemId: itemIdMatch ? decodeURIComponent(itemIdMatch[1]) : '',
                        lessonId: lessonMatch ? lessonMatch[1] : ''
                    });
                });
            });
        });

        return { success: true, homeworks, skippedByMark };
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_extractLessonTopicFromDocument(ctx, ...args) {
    with (ctx) {
        return (function extractLessonTopicFromDocument(doc) {
        const selectors = [
            '#lesson-header [class*="sc-ade04777-6"] span',
            '#lesson-header [class*="sc-ade04777-6"]',
            '[class*="lesson-title"]',
            'h1'
        ];

        for (const selector of selectors) {
            const node = doc.querySelector(selector);
            const text = normalizeText(node ? node.textContent : '');
            if (text && text.length > 2 && !/^домашнее\s+задание$/i.test(text)) {
                return text;
            }
        }

        const title = normalizeText(doc.title || '');
        return title || '';
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_extractQuestionsCountFromDocument(ctx, ...args) {
    with (ctx) {
        return (function extractQuestionsCountFromDocument(doc, htmlText) {
        const text = normalizeText(doc.body ? doc.body.textContent : htmlText);
        const match = text.match(/Количество\s+вопросов\s*:\s*(\d+)/i);
        return match ? Number(match[1]) : null;
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_getHomeworkTestSignals(ctx, ...args) {
    with (ctx) {
        return (function getHomeworkTestSignals(doc, htmlText = '') {
        const bodyText = normalizeText(doc && doc.body ? doc.body.textContent : htmlText);
        const rawHtml = String(htmlText || (doc && doc.documentElement ? doc.documentElement.outerHTML : ''));
        const signals = [];
        const hasStartButton = Boolean(doc && doc.querySelector('#start-text-button'));
        const hasStartButtonClass = Boolean(doc && doc.querySelector('[class*="start-teststyles__SSubmitButton"]'));
        const hasStartWrapperClass = /start-teststyles__/i.test(rawHtml);
        const hasQuestionBlock = Boolean(doc && doc.querySelector('div[id][class*="question-basestyles__SQuestion"]'));
        const hasTestControlClass = /test-controlstyles__/i.test(rawHtml);
        const hasLessonStepper = Boolean(doc && doc.querySelector('#lesson-stepper'));
        const hasJournalBackLink = Boolean(doc && doc.querySelector('a[href="/h/journal"], a[href*="/h/journal"]'));
        const hasHomeworkInfoBlock = Boolean(doc && doc.querySelector('[class*="start-teststyles__SInfoContainer"]'));
        const hasStartTestText = /Начать\s+тест/i.test(bodyText);
        const hasQuestionsCountText = /Количество\s+вопросов\s*:\s*\d+/i.test(bodyText);
        const hasTestResultText = /После\s+выполнения\s+теста\s+вы\s+сразу\s+увидите\s+результат/i.test(bodyText);

        if (hasStartButton) {
            signals.push('button#start-text-button');
        }
        if (hasStartButtonClass) {
            signals.push('class:start-teststyles__SSubmitButton');
        }
        if (hasStartWrapperClass) {
            signals.push('class:start-teststyles');
        }
        if (hasQuestionBlock) {
            signals.push('class:question-basestyles__SQuestion');
        }
        if (hasTestControlClass) {
            signals.push('class:test-controlstyles');
        }
        if (hasHomeworkInfoBlock) {
            signals.push('class:start-teststyles__SInfoContainer');
        }
        if (hasStartTestText) {
            signals.push('text:start-test');
        }
        if (hasQuestionsCountText) {
            signals.push('text:questions-count');
        }
        if (hasTestResultText) {
            signals.push('text:test-result-hint');
        }

        return {
            isTest: signals.length > 0,
            signals,
            hasLessonStepper,
            hasJournalBackLink,
            bodyTextLength: bodyText.length,
            htmlLength: rawHtml.length,
            snippet: bodyText.slice(0, MAX_TEST_DEBUG_SNIPPET)
        };
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_detectHomeworkTestPage(ctx, ...args) {
    with (ctx) {
        return (function detectHomeworkTestPage(doc, htmlText) {
        return getHomeworkTestSignals(doc, htmlText).isTest;
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_waitForIframeDocument(ctx, ...args) {
    with (ctx) {
        return (async function waitForIframeDocument(iframe, timeoutMs = TEST_SCAN_TIMEOUT_MS) {
        const startedAt = Date.now();
        let lastReadyState = '';
        let lastTextLength = 0;
        let lastError = '';
        let lastSnapshot = '';
        let stableSince = Date.now();

        while (Date.now() - startedAt < timeoutMs) {
            try {
                const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                if (doc) {
                    lastReadyState = doc.readyState || '';
                    const text = normalizeText(doc.body ? doc.body.textContent : '');
                    lastTextLength = text.length;
                    const htmlText = doc.documentElement ? doc.documentElement.outerHTML : '';
                    const signals = getHomeworkTestSignals(doc, htmlText);
                    const snapshot = `${lastReadyState}|${signals.signals.join('|')}|${signals.bodyTextLength}|${signals.htmlLength}`;

                    if (snapshot !== lastSnapshot) {
                        lastSnapshot = snapshot;
                        stableSince = Date.now();
                    }

                    if (signals.isTest) {
                        return { doc, htmlText, readyState: lastReadyState, loadedBySignal: true, signals };
                    }

                    const elapsedMs = Date.now() - startedAt;
                    const stableForMs = Date.now() - stableSince;
                    const hasLessonShell = Boolean(
                        doc.querySelector('#lesson-header')
                        || doc.querySelector('#lesson-stepper')
                        || doc.querySelector('a[href="/h/journal"], a[href*="/h/journal"]')
                        || /lesson-stepper|MuiStepper|sc-61aa5773|start-teststyles__/i.test(htmlText)
                    );

                    if ((lastReadyState === 'complete' || lastReadyState === 'interactive')
                        && hasLessonShell
                        && elapsedMs >= TEST_SCAN_MIN_READY_MS
                        && stableForMs >= TEST_SCAN_STABLE_MS) {
                        await wait(TEST_SCAN_POLL_MS);
                        const finalDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document) || doc;
                        const finalHtml = finalDoc.documentElement ? finalDoc.documentElement.outerHTML : htmlText;
                        return {
                            doc: finalDoc,
                            htmlText: finalHtml,
                            readyState: finalDoc.readyState || lastReadyState,
                            loadedBySignal: false,
                            signals: getHomeworkTestSignals(finalDoc, finalHtml)
                        };
                    }
                }
            } catch (error) {
                lastError = error && error.message ? error.message : String(error);
            }

            await wait(TEST_SCAN_POLL_MS);
        }

        throw new Error(`timeout iframe ${timeoutMs}ms; readyState=${lastReadyState || 'unknown'}; textLength=${lastTextLength}; ${lastError || ''}`.trim());
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_inspectHomeworkViaIframe(ctx, ...args) {
    with (ctx) {
        return (async function inspectHomeworkViaIframe(homework) {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.setAttribute('aria-hidden', 'true');
        iframe.src = makeAbsoluteUrl(homework.href);

        try {
            document.documentElement.appendChild(iframe);
            const loaded = await waitForIframeDocument(iframe);
            const doc = loaded.doc;
            const htmlText = loaded.htmlText || (doc.documentElement ? doc.documentElement.outerHTML : '');
            const signals = loaded.signals || getHomeworkTestSignals(doc, htmlText);

            logInfo('Проверено ДЗ через iframe', {
                subject: homework.subject,
                week: homework.week,
                path: homework.path,
                isTest: signals.isTest,
                signals: signals.signals,
                readyState: loaded.readyState,
                loadedBySignal: loaded.loadedBySignal,
                bodyTextLength: signals.bodyTextLength,
                htmlLength: signals.htmlLength,
                snippet: signals.snippet
            });

            return {
                ...homework,
                href: makeAbsoluteUrl(homework.href),
                isTest: signals.isTest,
                testSignals: signals.signals,
                signalDebug: {
                    source: 'iframe',
                    readyState: loaded.readyState || '',
                    loadedBySignal: Boolean(loaded.loadedBySignal),
                    bodyTextLength: Number(signals.bodyTextLength || 0),
                    htmlLength: Number(signals.htmlLength || 0),
                    snippet: signals.snippet || ''
                },
                topic: extractLessonTopicFromDocument(doc),
                questionsCount: extractQuestionsCountFromDocument(doc, htmlText),
                error: ''
            };
        } finally {
            try {
                iframe.remove();
            } catch (_error) {
                // no-op
            }
        }
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_inspectHomeworkViaFetch(ctx, ...args) {
    with (ctx) {
        return (async function inspectHomeworkViaFetch(homework) {
        const absoluteHref = makeAbsoluteUrl(homework.href);
        const response = await fetch(absoluteHref, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const signals = getHomeworkTestSignals(doc, htmlText);

        logInfo('Проверено ДЗ через fetch', {
            subject: homework.subject,
            week: homework.week,
            path: homework.path,
            isTest: signals.isTest,
            signals: signals.signals,
            bodyTextLength: signals.bodyTextLength,
            htmlLength: signals.htmlLength,
            snippet: signals.snippet
        });

        return {
            ...homework,
            href: absoluteHref,
            isTest: signals.isTest,
            testSignals: signals.signals,
            signalDebug: {
                source: 'fetch',
                readyState: '',
                loadedBySignal: false,
                bodyTextLength: Number(signals.bodyTextLength || 0),
                htmlLength: Number(signals.htmlLength || 0),
                snippet: signals.snippet || ''
            },
            topic: extractLessonTopicFromDocument(doc),
            questionsCount: extractQuestionsCountFromDocument(doc, htmlText),
            error: ''
        };
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_shouldRecheckHomeworkViaFetch(ctx, ...args) {
    with (ctx) {
        return (function shouldRecheckHomeworkViaFetch(result) {
        if (!result || result.isTest) {
            return false;
        }

        const hasSignals = Array.isArray(result.testSignals) && result.testSignals.length > 0;
        if (hasSignals) {
            return false;
        }

        const debug = result.signalDebug || {};
        const bodyTextLength = Number(debug.bodyTextLength || 0);
        const htmlLength = Number(debug.htmlLength || 0);

        if (bodyTextLength === 0) {
            return true;
        }

        if (bodyTextLength <= 2200) {
            return true;
        }

        if (htmlLength >= 150000 && bodyTextLength <= 3000) {
            return true;
        }

        return false;
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_inspectHomeworkForTest(ctx, ...args) {
    with (ctx) {
        return (async function inspectHomeworkForTest(homework) {
        logInfo('Начинаю проверку ДЗ на тест', {
            subject: homework.subject,
            week: homework.week,
            path: homework.path,
            itemId: homework.itemId,
            lessonId: homework.lessonId
        });

        let iframeResult = null;

        try {
            iframeResult = await inspectHomeworkViaIframe(homework);
            if (!shouldRecheckHomeworkViaFetch(iframeResult)) {
                return iframeResult;
            }

            logInfo('Iframe result is ambiguous, rechecking via fetch', {
                path: homework.path,
                bodyTextLength: iframeResult && iframeResult.signalDebug ? iframeResult.signalDebug.bodyTextLength : 0,
                htmlLength: iframeResult && iframeResult.signalDebug ? iframeResult.signalDebug.htmlLength : 0
            });
        } catch (iframeError) {
            logWarn('Iframe-проверка ДЗ не удалась, пробую fetch', {
                path: homework.path,
                error: iframeError && iframeError.message ? iframeError.message : String(iframeError)
            });
        }

        try {
            const fetchResult = await inspectHomeworkViaFetch(homework);
            if (!iframeResult) {
                return fetchResult;
            }

            if (fetchResult.isTest) {
                return fetchResult;
            }

            const fetchHasSignals = Array.isArray(fetchResult.testSignals) && fetchResult.testSignals.length > 0;
            if (fetchHasSignals) {
                return fetchResult;
            }

            return {
                ...iframeResult,
                signalDebug: fetchResult.signalDebug || iframeResult.signalDebug
            };
        } catch (error) {
            if (iframeResult) {
                logWarn('Fetch-проверка не удалась, использую iframe-результат', {
                    path: homework.path,
                    error: error && error.message ? error.message : String(error)
                });
                return iframeResult;
            }

            const message = error && error.message ? error.message : 'Ошибка загрузки ДЗ';
            logError('Не удалось проверить ДЗ на тест', {
                path: homework.path,
                subject: homework.subject,
                week: homework.week,
                error: message
            });
            return {
                ...homework,
                href: makeAbsoluteUrl(homework.href),
                isTest: false,
                testSignals: [],
                signalDebug: {
                    source: 'none',
                    readyState: '',
                    loadedBySignal: false,
                    bodyTextLength: 0,
                    htmlLength: 0,
                    snippet: ''
                },
                error: message
            };
        }
    
        }).apply(null, args);
    }
}

function __ContentJournalFeature_findJournalTests(ctx, ...args) {
    with (ctx) {
        return (async function findJournalTests() {
        logInfo('Запуск поиска тестов в журнале', { url: location.href });
        const extracted = extractHomeworkLinksFromJournal();
        if (!extracted.success) {
            logWarn('Не удалось извлечь ссылки ДЗ из журнала', extracted);
            return extracted;
        }

        const homeworks = extracted.homeworks || [];
        const skippedByMark = Number(extracted.skippedByMark || 0);
        logInfo('Из журнала извлечены ссылки ДЗ', {
            count: homeworks.length,
            skippedByMark,
            firstItems: homeworks.slice(0, 8).map((item) => ({
                subject: item.subject,
                week: item.week,
                path: item.path,
                itemId: item.itemId,
                lessonId: item.lessonId,
                text: item.journalText
            }))
        });

        if (homeworks.length === 0) {
            if (skippedByMark === 0) {
                return {
                    success: false,
                    error: 'Ссылки на ДЗ в журнале не найдены',
                    tests: [],
                    scanned: 0,
                    testsFound: 0,
                    failedCount: 0,
                    skippedByMark: 0,
                    failed: [],
                    inspected: []
                };
            }

            return {
                success: true,
                error: '',
                tests: [],
                scanned: 0,
                testsFound: 0,
                failedCount: 0,
                skippedByMark,
                failed: [],
                inspected: []
            };
        }

        const inspected = [];
        for (const homework of homeworks) {
            // Последовательно, чтобы не устроить всплеск запросов к сайту.
            // eslint-disable-next-line no-await-in-loop
            inspected.push(await inspectHomeworkForTest(homework));
        }

        const tests = inspected.filter((item) => item.isTest);
        const failed = inspected.filter((item) => item.error);

        logInfo('Поиск тестов завершён', {
            scanned: inspected.length,
            testsFound: tests.length,
            failedCount: failed.length,
            skippedByMark,
            tests: tests.map((item) => ({
                subject: item.subject,
                week: item.week,
                topic: item.topic,
                questionsCount: item.questionsCount,
                path: item.path,
                signals: item.testSignals
            })),
            failed: failed.slice(0, 10).map((item) => ({ path: item.path, error: item.error }))
        });

        return {
            success: true,
            scanned: inspected.length,
            testsFound: tests.length,
            failedCount: failed.length,
            skippedByMark,
            tests,
            failed,
            inspected
        };
    
        }).apply(null, args);
    }
}

window.ContentJournalFeature = ContentJournalFeature;

