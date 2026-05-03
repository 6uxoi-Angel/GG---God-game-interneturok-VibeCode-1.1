class LegacyContentController extends window.GodGameContentControllerBase {
    run() {
const EXT_TO_PAGE_SOURCE = 'JITSI_NAME_EXT';
const PAGE_TO_EXT_SOURCE = 'JITSI_NAME_PAGE';
const INJECTED_SCRIPT_MARKER = 'jitsi-name-injected-script';
const REQUEST_TIMEOUT_MS = 4000;

const QUESTION_AUTOCOPY_STORAGE_KEY = 'iu_question_autocopy_enabled';
const USER_PROMPT_STORAGE_KEY = 'god_game_user_prompt';
const QUESTION_AUTOCOPY_DEBOUNCE_MS = 350;
const QUESTION_SCAN_TICK_MS = 500;
const QUESTION_SCAN_DEFAULT_DURATION_MS = 20000;
const QUESTION_SCAN_MIN_DURATION_MS = 5000;
const QUESTION_SCAN_MAX_DURATION_MS = 60000;
const ANSWER_HIGHLIGHT_STYLE_ID = 'god-game-answer-highlight-style';
const ANSWER_HIGHLIGHT_CLASS = 'god-game-answer-highlight';
const ANSWER_HIGHLIGHT_QUESTION_CLASS = 'god-game-question-highlight';
const ANSWER_HIGHLIGHT_NOTE_CLASS = 'god-game-answer-note';
const TEST_HIGHLIGHT_STYLE_ID = 'god-game-test-highlight-style';
const TEST_HIGHLIGHT_CLASS = 'god-game-test-highlight';
const TEST_HIGHLIGHT_CELL_CLASS = 'god-game-test-cell-highlight';
const SCAN_LOG_PREFIX = '[QuestionScanner]';
const TEST_SCAN_TIMEOUT_MS = 12000;
const TEST_SCAN_POLL_MS = 350;
const TEST_SCAN_MIN_READY_MS = 3200;
const TEST_SCAN_STABLE_MS = 900;
const MAX_TEST_DEBUG_SNIPPET = 500;
const MAX_SCANNER_LOGS = 500;

const previousRuntime = window.__godGameContentRuntime;
if (previousRuntime && typeof previousRuntime.runtimeMessageListener === 'function') {
    try {
        chrome.runtime.onMessage.removeListener(previousRuntime.runtimeMessageListener);
    } catch (_error) {
        // no-op
    }
}
    const pendingRequests = new Map();
    let bridgeInjected = false;
    const scannerLogs = [];

    const questionCopyState = {
        enabled: false,
        observer: null,
        debounceTimer: null,
        lastSignature: '',
        lastText: '',
        scan: {
            active: false,
            ready: false,
            startedAt: 0,
            durationMs: QUESTION_SCAN_DEFAULT_DURATION_MS,
            timerId: null,
            lastElapsedMs: 0,
            lastError: '',
            foundCount: 0,
            lastQuestion: '',
            lastOptionsCount: 0,
            payloads: [],
            lastLoggedSecond: -1
        }
    };

    const answerHighlightState = {
        notes: []
    };

    const testHighlightState = {
        links: [],
        cells: []
    };

    window.addEventListener('message', (event) => {
        if (event.source !== window) {
            return;
        }

        const data = event.data;
        if (!data || data.source !== PAGE_TO_EXT_SOURCE || !data.requestId) {
            return;
        }

        const pending = pendingRequests.get(data.requestId);
        if (!pending) {
            return;
        }

        clearTimeout(pending.timeoutId);
        pendingRequests.delete(data.requestId);

        if (data.type === 'JITSI_NAME_RESPONSE') {
            pending.sendResponse({ name: data.name, error: data.error || null });
            return;
        }

        if (data.type === 'JITSI_SET_NAME_RESPONSE') {
            pending.sendResponse({ success: Boolean(data.success), error: data.error || null });
        }
    });

    const contentFeatureContext = {};

    Object.defineProperty(contentFeatureContext, 'bridgeInjected', {
        configurable: true,
        enumerable: true,
        get: () => bridgeInjected,
        set: (value) => { bridgeInjected = value; }
    });

    Object.assign(contentFeatureContext, {
        EXT_TO_PAGE_SOURCE,
        PAGE_TO_EXT_SOURCE,
        INJECTED_SCRIPT_MARKER,
        REQUEST_TIMEOUT_MS,
        QUESTION_AUTOCOPY_STORAGE_KEY,
        USER_PROMPT_STORAGE_KEY,
        QUESTION_AUTOCOPY_DEBOUNCE_MS,
        QUESTION_SCAN_TICK_MS,
        QUESTION_SCAN_DEFAULT_DURATION_MS,
        QUESTION_SCAN_MIN_DURATION_MS,
        QUESTION_SCAN_MAX_DURATION_MS,
        ANSWER_HIGHLIGHT_STYLE_ID,
        ANSWER_HIGHLIGHT_CLASS,
        ANSWER_HIGHLIGHT_QUESTION_CLASS,
        ANSWER_HIGHLIGHT_NOTE_CLASS,
        TEST_HIGHLIGHT_STYLE_ID,
        TEST_HIGHLIGHT_CLASS,
        TEST_HIGHLIGHT_CELL_CLASS,
        SCAN_LOG_PREFIX,
        TEST_SCAN_TIMEOUT_MS,
        TEST_SCAN_POLL_MS,
        TEST_SCAN_MIN_READY_MS,
        TEST_SCAN_STABLE_MS,
        MAX_TEST_DEBUG_SNIPPET,
        MAX_SCANNER_LOGS,
        pendingRequests,
        scannerLogs,
        questionCopyState,
        answerHighlightState,
        testHighlightState
    });

    const contentBridgeLogFeature = new window.ContentBridgeLogFeature(contentFeatureContext);
    const contentHighlightFeature = new window.ContentHighlightFeature(contentFeatureContext);
    const contentQuestionFeature = new window.ContentQuestionFeature(contentFeatureContext);
    const contentJournalFeature = new window.ContentJournalFeature(contentFeatureContext);
    const contentScannerFeature = new window.ContentScannerFeature(contentFeatureContext);
    const contentProfileFeature = new window.ContentProfileFeature(contentFeatureContext);

    function stringifyLogDetails(...args) {
        return contentBridgeLogFeature.stringifyLogDetails(...args);
    }

    function appendScannerLog(...args) {
        return contentBridgeLogFeature.appendScannerLog(...args);
    }

    function exportScannerLogsText(...args) {
        return contentBridgeLogFeature.exportScannerLogsText(...args);
    }

    function logInfo(...args) {
        return contentBridgeLogFeature.logInfo(...args);
    }

    function logWarn(...args) {
        return contentBridgeLogFeature.logWarn(...args);
    }

    function logError(...args) {
        return contentBridgeLogFeature.logError(...args);
    }

    function makeRequestId(...args) {
        return contentBridgeLogFeature.makeRequestId(...args);
    }

    function injectPageBridge(...args) {
        return contentBridgeLogFeature.injectPageBridge(...args);
    }

    function sendToPage(...args) {
        return contentBridgeLogFeature.sendToPage(...args);
    }

    function wait(...args) {
        return contentBridgeLogFeature.wait(...args);
    }

    function makeAbsoluteUrl(...args) {
        return contentBridgeLogFeature.makeAbsoluteUrl(...args);
    }

    function measureSitePing(...args) {
        return contentBridgeLogFeature.measureSitePing(...args);
    }

    function parseHighlightColorToRgb(...args) {
        return contentHighlightFeature.parseHighlightColorToRgb(...args);
    }

    function ensureAnswerHighlightStyles(...args) {
        return contentHighlightFeature.ensureAnswerHighlightStyles(...args);
    }

    function clearAnswerHighlights(...args) {
        return contentHighlightFeature.clearAnswerHighlights(...args);
    }

    function ensureTestHighlightStyles(...args) {
        return contentHighlightFeature.ensureTestHighlightStyles(...args);
    }

    function clearFoundTestsHighlight(...args) {
        return contentHighlightFeature.clearFoundTestsHighlight(...args);
    }

    function normalizeTestLinkForCompare(...args) {
        return contentHighlightFeature.normalizeTestLinkForCompare(...args);
    }

    function collectTestMatchers(...args) {
        return contentHighlightFeature.collectTestMatchers(...args);
    }

    function matchHomeworkLinkByTestMatchers(...args) {
        return contentHighlightFeature.matchHomeworkLinkByTestMatchers(...args);
    }

    function highlightFoundTests(...args) {
        return contentHighlightFeature.highlightFoundTests(...args);
    }

    function addQuestionAnswerNote(...args) {
        return contentHighlightFeature.addQuestionAnswerNote(...args);
    }

    function parseAnswerIndexes(...args) {
        return contentHighlightFeature.parseAnswerIndexes(...args);
    }

    function parseMatchPairs(...args) {
        return contentHighlightFeature.parseMatchPairs(...args);
    }

    function parseModelAnswerText(...args) {
        return contentHighlightFeature.parseModelAnswerText(...args);
    }

    function findOptionRows(...args) {
        return contentHighlightFeature.findOptionRows(...args);
    }

    function highlightChoiceAnswers(...args) {
        return contentHighlightFeature.highlightChoiceAnswers(...args);
    }

    function findTextNodeByNeedle(...args) {
        return contentHighlightFeature.findTextNodeByNeedle(...args);
    }

    function highlightMatchAnswers(...args) {
        return contentHighlightFeature.highlightMatchAnswers(...args);
    }

    function applyModelAnswersHighlight(...args) {
        return contentHighlightFeature.applyModelAnswersHighlight(...args);
    }

    function stripHtmlTags(...args) {
        return contentQuestionFeature.stripHtmlTags(...args);
    }

    function normalizeText(...args) {
        return contentQuestionFeature.normalizeText(...args);
    }

    function normalizeComparableText(...args) {
        return contentQuestionFeature.normalizeComparableText(...args);
    }

    function isVisibleElement(...args) {
        return contentQuestionFeature.isVisibleElement(...args);
    }

    function getPracticeScope(...args) {
        return contentQuestionFeature.getPracticeScope(...args);
    }

    function findQuestionElement(...args) {
        return contentQuestionFeature.findQuestionElement(...args);
    }

    function findModernQuestionBlock(...args) {
        return contentQuestionFeature.findModernQuestionBlock(...args);
    }

    function pushOptionLine(...args) {
        return contentQuestionFeature.pushOptionLine(...args);
    }

    function getReadableText(...args) {
        return contentQuestionFeature.getReadableText(...args);
    }

    function extractQuestionCondition(...args) {
        return contentQuestionFeature.extractQuestionCondition(...args);
    }

    function extractQuestionComment(...args) {
        return contentQuestionFeature.extractQuestionComment(...args);
    }

    function extractMultipleChoiceOptions(...args) {
        return contentQuestionFeature.extractMultipleChoiceOptions(...args);
    }

    function extractDragMatchOptions(...args) {
        return contentQuestionFeature.extractDragMatchOptions(...args);
    }

    function extractInputQuestionOptions(...args) {
        return contentQuestionFeature.extractInputQuestionOptions(...args);
    }

    function extractOptionLines(...args) {
        return contentQuestionFeature.extractOptionLines(...args);
    }

    function ensureOptionPrefix(...args) {
        return contentQuestionFeature.ensureOptionPrefix(...args);
    }

    function buildCopyText(...args) {
        return contentQuestionFeature.buildCopyText(...args);
    }

    function buildCombinedCopyText(...args) {
        return contentQuestionFeature.buildCombinedCopyText(...args);
    }

    function normalizePromptText(...args) {
        return contentQuestionFeature.normalizePromptText(...args);
    }

    function getUserPromptText(...args) {
        return contentQuestionFeature.getUserPromptText(...args);
    }

    function applyUserPromptToCopyText(...args) {
        return contentQuestionFeature.applyUserPromptToCopyText(...args);
    }

    function buildCombinedSignature(...args) {
        return contentQuestionFeature.buildCombinedSignature(...args);
    }

    function removeAssignmentNoise(...args) {
        return contentQuestionFeature.removeAssignmentNoise(...args);
    }

    function getReadableAssignmentText(...args) {
        return contentQuestionFeature.getReadableAssignmentText(...args);
    }

    function isLikelyOrdinaryAssignmentText(...args) {
        return contentQuestionFeature.isLikelyOrdinaryAssignmentText(...args);
    }

    function findOrdinaryAssignmentElement(...args) {
        return contentQuestionFeature.findOrdinaryAssignmentElement(...args);
    }

    function extractOrdinaryAssignmentPayloads(...args) {
        return contentQuestionFeature.extractOrdinaryAssignmentPayloads(...args);
    }

    function extractQuestionPayloads(...args) {
        return contentQuestionFeature.extractQuestionPayloads(...args);
    }

    function getDirectTableCells(...args) {
        return contentJournalFeature.getDirectTableCells(...args);
    }

    function getSubjectNameFromCell(...args) {
        return contentJournalFeature.getSubjectNameFromCell(...args);
    }

    function calculateFinalMark(...args) {
        return contentJournalFeature.calculateFinalMark(...args);
    }

    function extractJournalGrades(...args) {
        return contentJournalFeature.extractJournalGrades(...args);
    }

    function getJournalWeekLabels(...args) {
        return contentJournalFeature.getJournalWeekLabels(...args);
    }

    function normalizeHomeworkHref(...args) {
        return contentJournalFeature.normalizeHomeworkHref(...args);
    }

    function isHomeworkMarkGraded(...args) {
        return contentJournalFeature.isHomeworkMarkGraded(...args);
    }

    function extractHomeworkMarkFromCell(...args) {
        return contentJournalFeature.extractHomeworkMarkFromCell(...args);
    }

    function extractHomeworkLinksFromJournal(...args) {
        return contentJournalFeature.extractHomeworkLinksFromJournal(...args);
    }

    function extractLessonTopicFromDocument(...args) {
        return contentJournalFeature.extractLessonTopicFromDocument(...args);
    }

    function extractQuestionsCountFromDocument(...args) {
        return contentJournalFeature.extractQuestionsCountFromDocument(...args);
    }

    function getHomeworkTestSignals(...args) {
        return contentJournalFeature.getHomeworkTestSignals(...args);
    }

    function detectHomeworkTestPage(...args) {
        return contentJournalFeature.detectHomeworkTestPage(...args);
    }

    function waitForIframeDocument(...args) {
        return contentJournalFeature.waitForIframeDocument(...args);
    }

    function inspectHomeworkViaIframe(...args) {
        return contentJournalFeature.inspectHomeworkViaIframe(...args);
    }

    function inspectHomeworkViaFetch(...args) {
        return contentJournalFeature.inspectHomeworkViaFetch(...args);
    }

    function shouldRecheckHomeworkViaFetch(...args) {
        return contentJournalFeature.shouldRecheckHomeworkViaFetch(...args);
    }

    function inspectHomeworkForTest(...args) {
        return contentJournalFeature.inspectHomeworkForTest(...args);
    }

    function findJournalTests(...args) {
        return contentJournalFeature.findJournalTests(...args);
    }

    function copyUsingExecCommand(...args) {
        return contentScannerFeature.copyUsingExecCommand(...args);
    }

    function copyTextToClipboard(...args) {
        return contentScannerFeature.copyTextToClipboard(...args);
    }

    function clearScanTimer(...args) {
        return contentScannerFeature.clearScanTimer(...args);
    }

    function getScanStatus(...args) {
        return contentScannerFeature.getScanStatus(...args);
    }

    function finishScan(...args) {
        return contentScannerFeature.finishScan(...args);
    }

    function scanStep(...args) {
        return contentScannerFeature.scanStep(...args);
    }

    function clampDuration(...args) {
        return contentScannerFeature.clampDuration(...args);
    }

    function startQuestionScan(...args) {
        return contentScannerFeature.startQuestionScan(...args);
    }

    function copyCurrentQuestion(...args) {
        return contentScannerFeature.copyCurrentQuestion(...args);
    }

    function scheduleAutoQuestionCopy(...args) {
        return contentScannerFeature.scheduleAutoQuestionCopy(...args);
    }

    function startQuestionObserver(...args) {
        return contentScannerFeature.startQuestionObserver(...args);
    }

    function stopQuestionObserver(...args) {
        return contentScannerFeature.stopQuestionObserver(...args);
    }

    function applyQuestionAutoCopyState(...args) {
        return contentScannerFeature.applyQuestionAutoCopyState(...args);
    }

    function saveQuestionAutoCopyState(...args) {
        return contentScannerFeature.saveQuestionAutoCopyState(...args);
    }

    function loadQuestionAutoCopyState(...args) {
        return contentScannerFeature.loadQuestionAutoCopyState(...args);
    }

    function extractInternetUrokProfileInfo(...args) {
        return contentProfileFeature.extractInternetUrokProfileInfo(...args);
    }

    Object.assign(contentFeatureContext, {
        stringifyLogDetails,
        appendScannerLog,
        exportScannerLogsText,
        logInfo,
        logWarn,
        logError,
        makeRequestId,
        injectPageBridge,
        sendToPage,
        wait,
        makeAbsoluteUrl,
        measureSitePing,
        parseHighlightColorToRgb,
        ensureAnswerHighlightStyles,
        clearAnswerHighlights,
        ensureTestHighlightStyles,
        clearFoundTestsHighlight,
        normalizeTestLinkForCompare,
        collectTestMatchers,
        matchHomeworkLinkByTestMatchers,
        highlightFoundTests,
        addQuestionAnswerNote,
        parseAnswerIndexes,
        parseMatchPairs,
        parseModelAnswerText,
        findOptionRows,
        highlightChoiceAnswers,
        findTextNodeByNeedle,
        highlightMatchAnswers,
        applyModelAnswersHighlight,
        stripHtmlTags,
        normalizeText,
        normalizeComparableText,
        isVisibleElement,
        getPracticeScope,
        findQuestionElement,
        findModernQuestionBlock,
        pushOptionLine,
        getReadableText,
        extractQuestionCondition,
        extractQuestionComment,
        extractMultipleChoiceOptions,
        extractDragMatchOptions,
        extractInputQuestionOptions,
        extractOptionLines,
        ensureOptionPrefix,
        buildCopyText,
        buildCombinedCopyText,
        normalizePromptText,
        getUserPromptText,
        applyUserPromptToCopyText,
        buildCombinedSignature,
        removeAssignmentNoise,
        getReadableAssignmentText,
        isLikelyOrdinaryAssignmentText,
        findOrdinaryAssignmentElement,
        extractOrdinaryAssignmentPayloads,
        extractQuestionPayloads,
        getDirectTableCells,
        getSubjectNameFromCell,
        calculateFinalMark,
        extractJournalGrades,
        getJournalWeekLabels,
        normalizeHomeworkHref,
        isHomeworkMarkGraded,
        extractHomeworkMarkFromCell,
        extractHomeworkLinksFromJournal,
        extractLessonTopicFromDocument,
        extractQuestionsCountFromDocument,
        getHomeworkTestSignals,
        detectHomeworkTestPage,
        waitForIframeDocument,
        inspectHomeworkViaIframe,
        inspectHomeworkViaFetch,
        shouldRecheckHomeworkViaFetch,
        inspectHomeworkForTest,
        findJournalTests,
        copyUsingExecCommand,
        copyTextToClipboard,
        clearScanTimer,
        getScanStatus,
        finishScan,
        scanStep,
        clampDuration,
        startQuestionScan,
        copyCurrentQuestion,
        scheduleAutoQuestionCopy,
        startQuestionObserver,
        stopQuestionObserver,
        applyQuestionAutoCopyState,
        saveQuestionAutoCopyState,
        loadQuestionAutoCopyState,
        extractInternetUrokProfileInfo
    });
    const runtimeMessageListener = (request, _sender, sendResponse) => {
        try {
            if (!request || !request.action) {
                return false;
            }


            if (request.action === 'getName') {
                sendToPage('JITSI_GET_NAME', {}, sendResponse);
                return true;
            }

            if (request.action === 'setName') {
                sendToPage('JITSI_SET_NAME', { name: request.name }, sendResponse);
                return true;
            }

            if (request.action === 'startQuestionScan') {
                const result = startQuestionScan(request.durationMs);
                sendResponse(result);
                return false;
            }

            if (request.action === 'getQuestionScanStatus') {
                sendResponse({
                    success: true,
                    status: getScanStatus()
                });
                return false;
            }

            if (request.action === 'copyQuestionNow') {
                copyCurrentQuestion(Boolean(request.force), request.promptOverride)
                    .then((result) => sendResponse(result))
                    .catch((error) => {
                        logError('Ошибка ручного копирования', error);
                        sendResponse({
                            success: false,
                            error: error && error.message ? error.message : 'Ошибка копирования вопроса'
                        });
                    });
                return true;
            }

            if (request.action === 'setQuestionAutoCopy') {
                if (Boolean(request.enabled) && !questionCopyState.scan.ready) {
                    sendResponse({
                        success: false,
                        error: 'Сначала нажмите «Сканировать»'
                    });
                    return false;
                }

                saveQuestionAutoCopyState(Boolean(request.enabled), () => {
                    sendResponse({
                        success: true,
                        enabled: questionCopyState.enabled
                    });
                });
                return true;
            }

            if (request.action === 'getQuestionAutoCopyState') {
                sendResponse({
                    success: true,
                    enabled: questionCopyState.enabled && questionCopyState.scan.ready
                });
                return false;
            }

            if (request.action === 'getQuestionScannerLogs') {
                sendResponse({
                    success: true,
                    text: exportScannerLogsText(),
                    count: scannerLogs.length
                });
                return false;
            }

            if (request.action === 'getInternetUrokProfileInfo') {
                sendResponse(extractInternetUrokProfileInfo());
                return false;
            }

            if (request.action === 'pingSite') {
                measureSitePing()
                    .then((result) => sendResponse(result))
                    .catch((error) => {
                        sendResponse({
                            success: false,
                            error: error && error.message ? error.message : 'Ping failed'
                        });
                    });
                return true;
            }

            if (request.action === 'highlightAnswersOnPage') {
                sendResponse(applyModelAnswersHighlight(request.rawText, request.highlightColor));
                return false;
            }

            if (request.action === 'clearHighlightedAnswersOnPage') {
                clearAnswerHighlights();
                sendResponse({
                    success: true
                });
                return false;
            }

            if (request.action === 'highlightFoundTests') {
                sendResponse(highlightFoundTests(request.tests, request.highlightColor));
                return false;
            }

            if (request.action === 'clearFoundTestsHighlight') {
                clearFoundTestsHighlight();
                sendResponse({
                    success: true
                });
                return false;
            }


            if (request.action === 'calculateJournalGrades') {
                sendResponse(extractJournalGrades());
                return false;
            }

            if (request.action === 'findJournalTests') {
                findJournalTests()
                    .then((result) => sendResponse(result))
                    .catch((error) => {
                        logError('Ошибка поиска тестовых ДЗ', error);
                        sendResponse({
                            success: false,
                            error: error && error.message ? error.message : 'Ошибка поиска тестовых ДЗ'
                        });
                    });
                return true;
            }

            return false;
        } catch (error) {
            logError('Исключение в runtimeMessageListener', error);
            try {
                sendResponse({
                    success: false,
                    error: error && error.message ? error.message : 'Внутренняя ошибка content.js'
                });
            } catch (_sendError) {
                // no-op
            }
            return false;
        }
    };

    chrome.runtime.onMessage.addListener(runtimeMessageListener);

    window.__godGameContentApi = {
        ensureBridge: injectPageBridge
    };

    window.__godGameContentRuntime = {
        runtimeMessageListener,
        ensureBridge: injectPageBridge,
        version: 2
    };

    logInfo('content.js инициализирован', {
        href: window.location.href,
        version: window.__godGameContentRuntime.version
    });

    injectPageBridge();
    loadQuestionAutoCopyState();

    }
}

window.GodGameContentController = LegacyContentController;


