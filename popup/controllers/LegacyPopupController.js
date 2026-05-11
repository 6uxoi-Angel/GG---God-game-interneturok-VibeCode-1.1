const STORAGE_KEY_HISTORY = 'jitsi_name_history';
const STORAGE_KEY_LAST_QUESTION_COPY = 'question_last_copy_text';
const STORAGE_KEY_THEME = 'god_game_theme';
const STORAGE_KEY_UI_MODE = 'god_game_ui_mode';
const STORAGE_KEY_HIGHLIGHT_COLOR_MODE = 'god_game_highlight_color_mode';
const STORAGE_KEY_HIGHLIGHT_COLOR_VALUE = 'god_game_highlight_color_value';
const STORAGE_KEY_USER_PROMPT = 'god_game_user_prompt';
const STORAGE_KEY_TESTS_REGISTRY = 'god_game_tests_registry_v1';
const STORAGE_KEY_PROFILE_INFO = 'god_game_profile_info_v1';
const STORAGE_KEY_DEVELOPER_MODE = 'god_game_developer_mode';
const STORAGE_KEY_TESTS_VIEW_MODE = 'god_game_tests_view_mode';
const STORAGE_KEY_TESTS_FLEX_SETTINGS = 'god_game_tests_flex_settings_v1';
const MAX_HISTORY_ITEMS = 50;
const MAX_TESTS_REGISTRY_PAGES = 30;
const MAX_TESTS_PER_PAGE = 150;

const TAB_JITSI = 'jitsi';
const TAB_QUESTION = 'question';
const TAB_GRADES = 'grades';
const TAB_HIGHLIGHT = 'highlight';
const TAB_PROFILE = 'profile';
const SCAN_POLL_INTERVAL_MS = 500;
const BRAND_PING_INTERVAL_MS = 30000;
const GITHUB_REPO_URL = 'https://github.com/6uxoi-Angel/GG---God-game-interneturok-VibeCode';
const GITHUB_MANIFEST_URL = 'https://raw.githubusercontent.com/6uxoi-Angel/GG---God-game-interneturok-VibeCode/1.0/manifest.json';

const ERR_UNSUPPORTED_TAB = 'На этой вкладке функция недоступна';
const POPUP_LOG_PREFIX = '[PopupScanner]';

const AUTO_PROMPT_TEXT = `Ты получишь один или несколько вопросов теста.

Ответь строго в таком формате:

Задание N
Тип: single | multiple | match | input
Ответ: ...
Пояснение: ...

Правила:
1. Для single укажи номер одного варианта: Ответ: 2
2. Для multiple укажи номера вариантов через запятую: Ответ: 1, 2, 4
3. Для input укажи только слово или фразу: Ответ: таблиц
4. Для match укажи соответствия:
Ответ:
- левый элемент => правый элемент
5. Если не уверен, напиши: Ответ: не уверен
6. Не добавляй лишний текст вне этого формата.`;


class LegacyPopupController extends window.GodGameExtensionControllerBase {
    initialize() {
    const currentNameEl = document.getElementById('currentName');
    const newNameInput = document.getElementById('newName');
    const changeBtn = document.getElementById('changeBtn');
    const injectBtn = document.getElementById('injectBtn');
    const statusEl = document.getElementById('status');
    const historyListEl = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const pageHostEl = document.getElementById('pageHost');
    const brandPingEl = document.getElementById('brandPing');
    const brandVersionTextEl = document.getElementById('brandVersionText');
    const brandVersionStatusEl = document.getElementById('brandVersionStatus');
    const keysListEl = document.getElementById('keysList');
    const settingsToggleBtn = document.getElementById('settingsToggle');
    const settingsMenuEl = document.getElementById('settingsMenu');
    const themeChoiceButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
    const uiModeButtons = Array.from(document.querySelectorAll('[data-ui-mode-choice]'));
    const developerModeToggle = document.getElementById('developerModeToggle');
    const developerModeStatusEl = document.getElementById('developerModeStatus');
    const highlightColorThemeBtn = document.getElementById('highlightColorThemeBtn');
    const highlightColorCustomBtn = document.getElementById('highlightColorCustomBtn');
    const highlightColorButtons = [highlightColorThemeBtn, highlightColorCustomBtn].filter(Boolean);
    const highlightColorInput = document.getElementById('highlightColorInput');
    const saveHighlightColorBtn = document.getElementById('saveHighlightColorBtn');
    const resetHighlightColorBtn = document.getElementById('resetHighlightColorBtn');
    const highlightColorStatusEl = document.getElementById('highlightColorStatus');
    const userPromptInput = document.getElementById('userPromptInput');
    const savePromptBtn = document.getElementById('savePromptBtn');
    const clearPromptBtn = document.getElementById('clearPromptBtn');
    const promptSettingsStatusEl = document.getElementById('promptSettingsStatus');

    const tabJitsiBtn = document.getElementById('tabJitsi');
    const tabQuestionBtn = document.getElementById('tabQuestion');
    const tabGradesBtn = document.getElementById('tabGrades');
    const tabHighlightBtn = document.getElementById('tabHighlight');
    const tabProfileBtn = document.getElementById('tabProfile');
    const panelJitsiEl = document.getElementById('panelJitsi');
    const panelQuestionEl = document.getElementById('panelQuestion');
    const panelGradesEl = document.getElementById('panelGrades');
    const panelHighlightEl = document.getElementById('panelHighlight');
    const panelProfileEl = document.getElementById('panelProfile');

    const scanBtn = document.getElementById('scanBtn');
    const scanProgressEl = document.getElementById('scanProgress');
    const autoCopyBtn = document.getElementById('autoCopyBtn');
    const copyNowBtn = document.getElementById('copyNowBtn');
    const autoPromptBtn = document.getElementById('autoPromptBtn');
    const clearCopiedBtn = document.getElementById('clearCopiedBtn');
    const downloadQuestionLogsBtn = document.getElementById('downloadQuestionLogsBtn');
    const copiedQuestionEl = document.getElementById('copiedQuestion');
    const questionStatusEl = document.getElementById('questionStatus');
    const refreshGradesBtn = document.getElementById('refreshGradesBtn');
    const gradesSummaryEl = document.getElementById('gradesSummary');
    const gradesListEl = document.getElementById('gradesList');
    const gradesStatusEl = document.getElementById('gradesStatus');
    const highlightInputEl = document.getElementById('highlightInput');
    const highlightStatusEl = document.getElementById('highlightStatus');
    const clearHighlightBtn = document.getElementById('clearHighlightBtn');
    const applyHighlightBtn = document.getElementById('applyHighlightBtn');
    const clearPageHighlightBtn = document.getElementById('clearPageHighlightBtn');
    const findTestsBtn = document.getElementById('findTestsBtn');
    const applyTestsHighlightBtn = document.getElementById('applyTestsHighlightBtn');
    const clearTestsHighlightBtn = document.getElementById('clearTestsHighlightBtn');
    const copyTestsShareBtn = document.getElementById('copyTestsShareBtn');
    const downloadTestsShareBtn = document.getElementById('downloadTestsShareBtn');
    const importTestsShareBtn = document.getElementById('importTestsShareBtn');
    const importTestsShareInput = document.getElementById('importTestsShareInput');
    const downloadTestsLogsBtn = document.getElementById('downloadTestsLogsBtn');
    const flexTestsSettingsBtn = document.getElementById('flexTestsSettingsBtn');
    const flexTestsSettingsPanel = document.getElementById('flexTestsSettingsPanel');
    const flexTestsSubjectInput = document.getElementById('flexTestsSubjectInput');
    const flexTestsWeekInput = document.getElementById('flexTestsWeekInput');
    const flexTestsAutoHighlightToggle = document.getElementById('flexTestsAutoHighlightToggle');
    const saveFlexTestsSettingsBtn = document.getElementById('saveFlexTestsSettingsBtn');
    const resetFlexTestsSettingsBtn = document.getElementById('resetFlexTestsSettingsBtn');
    const flexTestsSettingsStatusEl = document.getElementById('flexTestsSettingsStatus');
    const testsSummaryEl = document.getElementById('testsSummary');
    const testsStatusEl = document.getElementById('testsStatus');
    const testsListEl = document.getElementById('testsList');
    const testsViewModernBtn = document.getElementById('testsViewModernBtn');
    const testsViewClassicBtn = document.getElementById('testsViewClassicBtn');
    const testsViewButtons = [testsViewModernBtn, testsViewClassicBtn].filter(Boolean);
    const profileSubtabMeBtn = document.getElementById('profileSubtabMe');
    const profileSubtabTestsBtn = document.getElementById('profileSubtabTests');
    const profilePanelMeEl = document.getElementById('profilePanelMe');
    const profilePanelTestsEl = document.getElementById('profilePanelTests');
    const profileNameValueEl = document.getElementById('profileNameValue');
    const profileClassValueEl = document.getElementById('profileClassValue');
    const profileManifestStatusValueEl = document.getElementById('profileManifestStatusValue');
    const profileInfoStatusEl = document.getElementById('profileInfoStatus');

    let mainStatusTimer = null;
    let questionStatusTimer = null;
    let gradesStatusTimer = null;
    let highlightStatusTimer = null;
    let testsStatusTimer = null;
    let questionAutoEnabled = false;
    let scanPollingTimer = null;
    let scanReady = false;
    let scanActive = false;
    let brandPingTimer = null;
    let highlightColorMode = 'theme';
    let highlightColorValue = '';
    let lastTestsResult = null;
    let testsRegistry = {};
    let profileInfoStatusTimer = null;
    let savedProfileInfo = null;
    let testsViewMode = 'modern';
    let testsFlexibleSettings = { subject: '', week: '', autoHighlight: false };
    let autoTestsHighlightInFlight = false;

    function popupInfo(message, details) {
        if (details !== undefined) {
            console.info(POPUP_LOG_PREFIX, message, details);
        } else {
            console.info(POPUP_LOG_PREFIX, message);
        }
    }

    function popupWarn(message, details) {
        if (details !== undefined) {
            console.warn(POPUP_LOG_PREFIX, message, details);
        } else {
            console.warn(POPUP_LOG_PREFIX, message);
        }
    }

    function popupError(message, details) {
        if (details !== undefined) {
            console.error(POPUP_LOG_PREFIX, message, details);
        } else {
            console.error(POPUP_LOG_PREFIX, message);
        }
    }


    const popupFeatureContext = {};

    function bindPopupFeatureState(key, getter, setter) {
        Object.defineProperty(popupFeatureContext, key, {
            configurable: true,
            enumerable: true,
            get: getter,
            set: setter
        });
    }

    bindPopupFeatureState('questionAutoEnabled', () => questionAutoEnabled, (value) => { questionAutoEnabled = value; });
    bindPopupFeatureState('scanPollingTimer', () => scanPollingTimer, (value) => { scanPollingTimer = value; });
    bindPopupFeatureState('scanReady', () => scanReady, (value) => { scanReady = value; });
    bindPopupFeatureState('scanActive', () => scanActive, (value) => { scanActive = value; });
    bindPopupFeatureState('questionStatusTimer', () => questionStatusTimer, (value) => { questionStatusTimer = value; });
    bindPopupFeatureState('gradesStatusTimer', () => gradesStatusTimer, (value) => { gradesStatusTimer = value; });
    bindPopupFeatureState('mainStatusTimer', () => mainStatusTimer, (value) => { mainStatusTimer = value; });
    bindPopupFeatureState('highlightStatusTimer', () => highlightStatusTimer, (value) => { highlightStatusTimer = value; });
    bindPopupFeatureState('testsStatusTimer', () => testsStatusTimer, (value) => { testsStatusTimer = value; });
    bindPopupFeatureState('brandPingTimer', () => brandPingTimer, (value) => { brandPingTimer = value; });
    bindPopupFeatureState('highlightColorMode', () => highlightColorMode, (value) => { highlightColorMode = value; });
    bindPopupFeatureState('highlightColorValue', () => highlightColorValue, (value) => { highlightColorValue = value; });
    bindPopupFeatureState('lastTestsResult', () => lastTestsResult, (value) => { lastTestsResult = value; });
    bindPopupFeatureState('testsRegistry', () => testsRegistry, (value) => { testsRegistry = value; });
    bindPopupFeatureState('profileInfoStatusTimer', () => profileInfoStatusTimer, (value) => { profileInfoStatusTimer = value; });
    bindPopupFeatureState('savedProfileInfo', () => savedProfileInfo, (value) => { savedProfileInfo = value; });
    bindPopupFeatureState('testsViewMode', () => testsViewMode, (value) => { testsViewMode = value; });
    bindPopupFeatureState('testsFlexibleSettings', () => testsFlexibleSettings, (value) => { testsFlexibleSettings = value; });
    bindPopupFeatureState('autoTestsHighlightInFlight', () => autoTestsHighlightInFlight, (value) => { autoTestsHighlightInFlight = value; });

    Object.assign(popupFeatureContext, {
        STORAGE_KEY_HISTORY,
        STORAGE_KEY_LAST_QUESTION_COPY,
        STORAGE_KEY_THEME,
        STORAGE_KEY_UI_MODE,
        STORAGE_KEY_HIGHLIGHT_COLOR_MODE,
        STORAGE_KEY_HIGHLIGHT_COLOR_VALUE,
        STORAGE_KEY_USER_PROMPT,
        STORAGE_KEY_TESTS_REGISTRY,
        STORAGE_KEY_PROFILE_INFO,
        STORAGE_KEY_DEVELOPER_MODE,
        STORAGE_KEY_TESTS_VIEW_MODE,
        STORAGE_KEY_TESTS_FLEX_SETTINGS,
        MAX_HISTORY_ITEMS,
        MAX_TESTS_REGISTRY_PAGES,
        MAX_TESTS_PER_PAGE,
        TAB_JITSI,
        TAB_QUESTION,
        TAB_GRADES,
        TAB_HIGHLIGHT,
        TAB_PROFILE,
        SCAN_POLL_INTERVAL_MS,
        BRAND_PING_INTERVAL_MS,
        GITHUB_REPO_URL,
        GITHUB_MANIFEST_URL,
        ERR_UNSUPPORTED_TAB,
        POPUP_LOG_PREFIX,
        AUTO_PROMPT_TEXT,
        currentNameEl,
        newNameInput,
        changeBtn,
        injectBtn,
        statusEl,
        historyListEl,
        clearHistoryBtn,
        pageHostEl,
        brandPingEl,
        brandVersionTextEl,
        brandVersionStatusEl,
        keysListEl,
        settingsToggleBtn,
        settingsMenuEl,
        themeChoiceButtons,
        uiModeButtons,
        developerModeToggle,
        developerModeStatusEl,
        highlightColorThemeBtn,
        highlightColorCustomBtn,
        highlightColorButtons,
        highlightColorInput,
        saveHighlightColorBtn,
        resetHighlightColorBtn,
        highlightColorStatusEl,
        userPromptInput,
        savePromptBtn,
        clearPromptBtn,
        promptSettingsStatusEl,
        tabJitsiBtn,
        tabQuestionBtn,
        tabGradesBtn,
        tabHighlightBtn,
        tabProfileBtn,
        panelJitsiEl,
        panelQuestionEl,
        panelGradesEl,
        panelHighlightEl,
        panelProfileEl,
        scanBtn,
        scanProgressEl,
        autoCopyBtn,
        copyNowBtn,
        autoPromptBtn,
        clearCopiedBtn,
        downloadQuestionLogsBtn,
        copiedQuestionEl,
        questionStatusEl,
        refreshGradesBtn,
        gradesSummaryEl,
        gradesListEl,
        gradesStatusEl,
        highlightInputEl,
        highlightStatusEl,
        clearHighlightBtn,
        applyHighlightBtn,
        clearPageHighlightBtn,
        findTestsBtn,
        applyTestsHighlightBtn,
        clearTestsHighlightBtn,
        copyTestsShareBtn,
        downloadTestsShareBtn,
        importTestsShareBtn,
        importTestsShareInput,
        downloadTestsLogsBtn,
        flexTestsSettingsBtn,
        flexTestsSettingsPanel,
        flexTestsSubjectInput,
        flexTestsWeekInput,
        flexTestsAutoHighlightToggle,
        saveFlexTestsSettingsBtn,
        resetFlexTestsSettingsBtn,
        flexTestsSettingsStatusEl,
        testsSummaryEl,
        testsStatusEl,
        testsListEl,
        testsViewModernBtn,
        testsViewClassicBtn,
        testsViewButtons,
        profileSubtabMeBtn,
        profileSubtabTestsBtn,
        profilePanelMeEl,
        profilePanelTestsEl,
        profileNameValueEl,
        profileClassValueEl,
        profileManifestStatusValueEl,
        profileInfoStatusEl,
        popupInfo,
        popupWarn,
        popupError
    });

    const popupQuestionFeature = new window.PopupQuestionFeature(popupFeatureContext);
    const popupGradesFeature = new window.PopupGradesFeature(popupFeatureContext);

    const popupSettingsFeature = new window.PopupSettingsFeature(popupFeatureContext);
    const popupTabsFeature = new window.PopupTabsFeature(popupFeatureContext);
    const popupBrandFeature = new window.PopupBrandFeature(popupFeatureContext);
    const popupProfileFeature = new window.PopupProfileFeature(popupFeatureContext);
    const popupAnswerFeature = new window.PopupAnswerFeature(popupFeatureContext);
    const popupBridgeFeature = new window.PopupBridgeFeature(popupFeatureContext);
    const popupTestsFeature = new window.PopupTestsFeature(popupFeatureContext);
    const popupUtilityFeature = new window.PopupUtilityFeature(popupFeatureContext);

    function getExtensionManifest(...args) {
        return popupBrandFeature.getExtensionManifest(...args);
    }

    function initManifestInfo(...args) {
        return popupBrandFeature.initManifestInfo(...args);
    }

    function setBrandVersionText(...args) {
        return popupBrandFeature.setBrandVersionText(...args);
    }

    function normalizeVersionPart(...args) {
        return popupBrandFeature.normalizeVersionPart(...args);
    }

    function compareVersions(...args) {
        return popupBrandFeature.compareVersions(...args);
    }

    function setGithubVersionStatus(...args) {
        return popupBrandFeature.setGithubVersionStatus(...args);
    }

    function checkGithubVersion(...args) {
        return popupBrandFeature.checkGithubVersion(...args);
    }

    function renderBrandPingState(...args) {
        return popupBrandFeature.renderBrandPingState(...args);
    }

    function getBrandPingStateClass(...args) {
        return popupBrandFeature.getBrandPingStateClass(...args);
    }

    function requestBrandPing(...args) {
        return popupBrandFeature.requestBrandPing(...args);
    }

    function startBrandPingMonitor(...args) {
        return popupBrandFeature.startBrandPingMonitor(...args);
    }

    function initThemeSettings(...args) {
        return popupSettingsFeature.initThemeSettings(...args);
    }

    function initUiModeSettings(...args) {
        return popupSettingsFeature.initUiModeSettings(...args);
    }

    function initDeveloperModeSettings(...args) {
        return popupSettingsFeature.initDeveloperModeSettings(...args);
    }

    function initTestsViewModeSettings(...args) {
        return popupSettingsFeature.initTestsViewModeSettings(...args);
    }

    function initHighlightColorSettings(...args) {
        return popupSettingsFeature.initHighlightColorSettings(...args);
    }

    function getThemeHighlightColor(...args) {
        return popupSettingsFeature.getThemeHighlightColor(...args);
    }

    function normalizeColorInput(...args) {
        return popupSettingsFeature.normalizeColorInput(...args);
    }

    function refreshHighlightColorHint(...args) {
        return popupSettingsFeature.refreshHighlightColorHint(...args);
    }

    function resolveHighlightColorForPage(...args) {
        return popupSettingsFeature.resolveHighlightColorForPage(...args);
    }

    function initPromptSettings(...args) {
        return popupSettingsFeature.initPromptSettings(...args);
    }

    function initHighlightPanel(...args) {
        return popupAnswerFeature.initHighlightPanel(...args);
    }

    function applyAnswersHighlightOnPage(...args) {
        return popupAnswerFeature.applyAnswersHighlightOnPage(...args);
    }

    function clearAnswersHighlightOnPage(...args) {
        return popupAnswerFeature.clearAnswersHighlightOnPage(...args);
    }

    function showHighlightStatus(...args) {
        return popupAnswerFeature.showHighlightStatus(...args);
    }

    function initProfilePanel(...args) {
        return popupProfileFeature.initProfilePanel(...args);
    }

    function makeDefaultTestsSummary(...args) {
        return popupProfileFeature.makeDefaultTestsSummary(...args);
    }

    function normalizeProfileInfo(...args) {
        return popupProfileFeature.normalizeProfileInfo(...args);
    }

    function renderProfileInfo(...args) {
        return popupProfileFeature.renderProfileInfo(...args);
    }

    function saveProfileInfoPatch(...args) {
        return popupProfileFeature.saveProfileInfoPatch(...args);
    }

    function loadSavedProfileInfo(...args) {
        return popupProfileFeature.loadSavedProfileInfo(...args);
    }

    function showProfileInfoStatus(...args) {
        return popupProfileFeature.showProfileInfoStatus(...args);
    }

    function refreshInternetUrokProfileInfo(...args) {
        return popupProfileFeature.refreshInternetUrokProfileInfo(...args);
    }

    function withFreshContentScript(...args) {
        return popupBridgeFeature.withFreshContentScript(...args);
    }

    function isSupportedTabUrl(...args) {
        return popupBridgeFeature.isSupportedTabUrl(...args);
    }

    function getActiveTab(...args) {
        return popupBridgeFeature.getActiveTab(...args);
    }

    function shouldRetryInjection(...args) {
        return popupBridgeFeature.shouldRetryInjection(...args);
    }

    function injectContentScript(...args) {
        return popupBridgeFeature.injectContentScript(...args);
    }

    function sendMessageToActiveTab(...args) {
        return popupBridgeFeature.sendMessageToActiveTab(...args);
    }

    function refreshCurrentName(...args) {
        return popupBridgeFeature.refreshCurrentName(...args);
    }

    function applyNameChange(...args) {
        return popupBridgeFeature.applyNameChange(...args);
    }

    function refreshPageInfo(...args) {
        return popupBridgeFeature.refreshPageInfo(...args);
    }

    function renderKeys(...args) {
        return popupBridgeFeature.renderKeys(...args);
    }

    function reinjectBridge(...args) {
        return popupBridgeFeature.reinjectBridge(...args);
    }

    function hydrateTestsDataFromStorage(...args) {
        return popupTestsFeature.hydrateTestsDataFromStorage(...args);
    }

    function initFlexibleTestsSettings(...args) {
        return popupTestsFeature.initFlexibleTestsSettings(...args);
    }

    function getFlexibleTestsSettings(...args) {
        return popupTestsFeature.getFlexibleTestsSettings(...args);
    }

    function autoHighlightTestsIfNeeded(...args) {
        return popupTestsFeature.autoHighlightTestsIfNeeded(...args);
    }

    function loadTestsRegistry(...args) {
        return popupTestsFeature.loadTestsRegistry(...args);
    }

    function saveTestsRegistry(...args) {
        return popupTestsFeature.saveTestsRegistry(...args);
    }

    function buildJournalPageKey(...args) {
        return popupTestsFeature.buildJournalPageKey(...args);
    }

    function buildJournalBaseKey(...args) {
        return popupTestsFeature.buildJournalBaseKey(...args);
    }

    function extractQuarterFromUrl(...args) {
        return popupTestsFeature.extractQuarterFromUrl(...args);
    }

    function getTestIdentity(...args) {
        return popupTestsFeature.getTestIdentity(...args);
    }

    function buildQuarterBuckets(...args) {
        return popupTestsFeature.buildQuarterBuckets(...args);
    }

    function flattenQuarterBuckets(...args) {
        return popupTestsFeature.flattenQuarterBuckets(...args);
    }

    function buildDisplayBuckets(...args) {
        return popupTestsFeature.buildDisplayBuckets(...args);
    }

    function removeTestFromRegistry(...args) {
        return popupTestsFeature.removeTestFromRegistry(...args);
    }

    function getCurrentJournalPageContext(...args) {
        return popupTestsFeature.getCurrentJournalPageContext(...args);
    }

    function normalizeTestsForStorage(...args) {
        return popupTestsFeature.normalizeTestsForStorage(...args);
    }

    function collectAllRegistryTestsResult(...args) {
        return popupTestsFeature.collectAllRegistryTestsResult(...args);
    }

    function buildBucketsFromTestsWithQuarter(...args) {
        return popupTestsFeature.buildBucketsFromTestsWithQuarter(...args);
    }

    function removeTestByRegistryKey(...args) {
        return popupTestsFeature.removeTestByRegistryKey(...args);
    }

    function mapRegistryEntryToResult(...args) {
        return popupTestsFeature.mapRegistryEntryToResult(...args);
    }

    function persistTestsResultInRegistry(...args) {
        return popupTestsFeature.persistTestsResultInRegistry(...args);
    }

    function downloadTestsSearchLogs(...args) {
        return popupTestsFeature.downloadTestsSearchLogs(...args);
    }

    function findJournalTestsFromProfile(...args) {
        return popupTestsFeature.findJournalTestsFromProfile(...args);
    }

    function renderTestsResult(...args) {
        return popupTestsFeature.renderTestsResult(...args);
    }

    function getTestsForActions(...args) {
        return popupTestsFeature.getTestsForActions(...args);
    }

    function formatTestsShareText(...args) {
        return popupTestsFeature.formatTestsShareText(...args);
    }

    function normalizeImportedTextValue(...args) {
        return popupTestsFeature.normalizeImportedTextValue(...args);
    }

    function parseImportedQuestionsCount(...args) {
        return popupTestsFeature.parseImportedQuestionsCount(...args);
    }

    function enrichImportedTestFromUrl(...args) {
        return popupTestsFeature.enrichImportedTestFromUrl(...args);
    }

    function parseTestsShareText(...args) {
        return popupTestsFeature.parseTestsShareText(...args);
    }

    function importTestsShareFromFile(...args) {
        return popupTestsFeature.importTestsShareFromFile(...args);
    }

    function copyTestsShareText(...args) {
        return popupTestsFeature.copyTestsShareText(...args);
    }

    function downloadTestsShareText(...args) {
        return popupTestsFeature.downloadTestsShareText(...args);
    }

    function applyTestsHighlightOnPage(...args) {
        return popupTestsFeature.applyTestsHighlightOnPage(...args);
    }

    function clearTestsHighlightOnPage(...args) {
        return popupTestsFeature.clearTestsHighlightOnPage(...args);
    }

    function showTestsStatus(...args) {
        return popupTestsFeature.showTestsStatus(...args);
    }

    function copyTextToClipboard(...args) {
        return popupUtilityFeature.copyTextToClipboard(...args);
    }

    function setBusy(...args) {
        return popupUtilityFeature.setBusy(...args);
    }

    function saveToHistory(...args) {
        return popupUtilityFeature.saveToHistory(...args);
    }

    function loadHistory(...args) {
        return popupUtilityFeature.loadHistory(...args);
    }

    function renderHistory(...args) {
        return popupUtilityFeature.renderHistory(...args);
    }

    function loadLastCopiedQuestion(...args) {
        return popupUtilityFeature.loadLastCopiedQuestion(...args);
    }

    function saveLastCopiedQuestion(...args) {
        return popupUtilityFeature.saveLastCopiedQuestion(...args);
    }

    function formatDate(...args) {
        return popupUtilityFeature.formatDate(...args);
    }

    function showMainStatus(...args) {
        return popupUtilityFeature.showMainStatus(...args);
    }

    function initTabs(...args) {
        return popupTabsFeature.initTabs(...args);
    }

    function setActiveTab(...args) {
        return popupTabsFeature.setActiveTab(...args);
    }
    function setupQuestionPanelDefaults(...args) {
        return popupQuestionFeature.setupQuestionPanelDefaults(...args);
    }

    function setQuestionActionsEnabled(...args) {
        return popupQuestionFeature.setQuestionActionsEnabled(...args);
    }

    function setScanProgress(...args) {
        return popupQuestionFeature.setScanProgress(...args);
    }

    function formatMs(...args) {
        return popupQuestionFeature.formatMs(...args);
    }

    function renderScanStatus(...args) {
        return popupQuestionFeature.renderScanStatus(...args);
    }

    function requestScanStatus(...args) {
        return popupQuestionFeature.requestScanStatus(...args);
    }

    function startScanPolling(...args) {
        return popupQuestionFeature.startScanPolling(...args);
    }

    function stopScanPolling(...args) {
        return popupQuestionFeature.stopScanPolling(...args);
    }

    function syncQuestionPanelState(...args) {
        return popupQuestionFeature.syncQuestionPanelState(...args);
    }

    function startQuestionScan(...args) {
        return popupQuestionFeature.startQuestionScan(...args);
    }

    function refreshQuestionAutoState(...args) {
        return popupQuestionFeature.refreshQuestionAutoState(...args);
    }

    function toggleQuestionAutoCopy(...args) {
        return popupQuestionFeature.toggleQuestionAutoCopy(...args);
    }

    function renderQuestionAutoButton(...args) {
        return popupQuestionFeature.renderQuestionAutoButton(...args);
    }

    function copyQuestionNow(...args) {
        return popupQuestionFeature.copyQuestionNow(...args);
    }

    function copyQuestionWithAutoPrompt(...args) {
        return popupQuestionFeature.copyQuestionWithAutoPrompt(...args);
    }

    function downloadQuestionScannerLogs(...args) {
        return popupQuestionFeature.downloadQuestionScannerLogs(...args);
    }

    function showQuestionStatus(...args) {
        return popupQuestionFeature.showQuestionStatus(...args);
    }

    function refreshGrades(...args) {
        return popupGradesFeature.refreshGrades(...args);
    }

    function renderGradesResult(...args) {
        return popupGradesFeature.renderGradesResult(...args);
    }

    function showGradesStatus(...args) {
        return popupGradesFeature.showGradesStatus(...args);
    }

    Object.assign(popupFeatureContext, {
        setupQuestionPanelDefaults,
        setQuestionActionsEnabled,
        setScanProgress,
        formatMs,
        renderScanStatus,
        requestScanStatus,
        startScanPolling,
        stopScanPolling,
        syncQuestionPanelState,
        startQuestionScan,
        refreshQuestionAutoState,
        toggleQuestionAutoCopy,
        renderQuestionAutoButton,
        copyQuestionNow,
        copyQuestionWithAutoPrompt,
        downloadQuestionScannerLogs,
        showQuestionStatus,
        refreshGrades,
        renderGradesResult,
        showGradesStatus,
        getExtensionManifest,
        initManifestInfo,
        setBrandVersionText,
        normalizeVersionPart,
        compareVersions,
        setGithubVersionStatus,
        checkGithubVersion,
        renderBrandPingState,
        getBrandPingStateClass,
        requestBrandPing,
        startBrandPingMonitor,
        initThemeSettings,
        initUiModeSettings,
        initDeveloperModeSettings,
        initTestsViewModeSettings,
        initHighlightColorSettings,
        getThemeHighlightColor,
        normalizeColorInput,
        refreshHighlightColorHint,
        resolveHighlightColorForPage,
        initPromptSettings,
        initHighlightPanel,
        applyAnswersHighlightOnPage,
        clearAnswersHighlightOnPage,
        showHighlightStatus,
        initProfilePanel,
        makeDefaultTestsSummary,
        normalizeProfileInfo,
        renderProfileInfo,
        saveProfileInfoPatch,
        loadSavedProfileInfo,
        showProfileInfoStatus,
        refreshInternetUrokProfileInfo,
        withFreshContentScript,
        isSupportedTabUrl,
        getActiveTab,
        shouldRetryInjection,
        injectContentScript,
        sendMessageToActiveTab,
        refreshCurrentName,
        applyNameChange,
        refreshPageInfo,
        renderKeys,
        reinjectBridge,
        hydrateTestsDataFromStorage,
        initFlexibleTestsSettings,
        getFlexibleTestsSettings,
        autoHighlightTestsIfNeeded,
        loadTestsRegistry,
        saveTestsRegistry,
        buildJournalPageKey,
        buildJournalBaseKey,
        extractQuarterFromUrl,
        getTestIdentity,
        buildQuarterBuckets,
        flattenQuarterBuckets,
        buildDisplayBuckets,
        removeTestFromRegistry,
        getCurrentJournalPageContext,
        normalizeTestsForStorage,
        collectAllRegistryTestsResult,
        buildBucketsFromTestsWithQuarter,
        removeTestByRegistryKey,
        mapRegistryEntryToResult,
        persistTestsResultInRegistry,
        downloadTestsSearchLogs,
        findJournalTestsFromProfile,
        renderTestsResult,
        getTestsForActions,
        formatTestsShareText,
        normalizeImportedTextValue,
        parseImportedQuestionsCount,
        enrichImportedTestFromUrl,
        parseTestsShareText,
        importTestsShareFromFile,
        copyTestsShareText,
        downloadTestsShareText,
        applyTestsHighlightOnPage,
        clearTestsHighlightOnPage,
        showTestsStatus,
        copyTextToClipboard,
        setBusy,
        saveToHistory,
        loadHistory,
        renderHistory,
        loadLastCopiedQuestion,
        saveLastCopiedQuestion,
        formatDate,
        showMainStatus,
        initTabs,
        setActiveTab
    });
    initThemeSettings();
    initUiModeSettings();
    initDeveloperModeSettings();
    initHighlightColorSettings();
    initPromptSettings();
    initTabs();
    initProfilePanel();
    initTestsViewModeSettings();
    initHighlightPanel();
    initManifestInfo();
    checkGithubVersion();
    loadSavedProfileInfo();
    loadHistory();
    loadLastCopiedQuestion();
    hydrateTestsDataFromStorage();
    initFlexibleTestsSettings();
    refreshPageInfo();
    startBrandPingMonitor();
    refreshCurrentName();
    setupQuestionPanelDefaults();
    syncQuestionPanelState(false);

    if (newNameInput) {
        newNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyNameChange();
            }
        });
    }

    if (changeBtn) {
        changeBtn.addEventListener('click', applyNameChange);
    }

    if (injectBtn) {
        injectBtn.addEventListener('click', reinjectBridge);
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            chrome.storage.local.remove([STORAGE_KEY_HISTORY], () => {
                renderHistory([]);
                showMainStatus('История очищена', 'info');
            });
        });
    }

    if (scanBtn) {
        scanBtn.addEventListener('click', startQuestionScan);
    }

    if (copyNowBtn) {
        copyNowBtn.addEventListener('click', copyQuestionNow);
    }

    if (autoPromptBtn) {
        autoPromptBtn.addEventListener('click', copyQuestionWithAutoPrompt);
    }

    if (autoCopyBtn) {
        autoCopyBtn.addEventListener('click', toggleQuestionAutoCopy);
    }

    if (clearCopiedBtn) {
        clearCopiedBtn.addEventListener('click', () => {
            copiedQuestionEl.value = '';
            chrome.storage.local.remove([STORAGE_KEY_LAST_QUESTION_COPY], () => {
                showQuestionStatus('Текст очищен', 'info');
            });
        });
    }

    if (downloadQuestionLogsBtn) {
        downloadQuestionLogsBtn.addEventListener('click', downloadQuestionScannerLogs);
    }

    if (refreshGradesBtn) {
        refreshGradesBtn.addEventListener('click', refreshGrades);
    }

    if (findTestsBtn) {
        findTestsBtn.addEventListener('click', findJournalTestsFromProfile);
    }

    autoHighlightTestsIfNeeded(true);
    setInterval(() => autoHighlightTestsIfNeeded(true), 2500);

    if (applyTestsHighlightBtn) {
        applyTestsHighlightBtn.addEventListener('click', applyTestsHighlightOnPage);
    }

    if (clearTestsHighlightBtn) {
        clearTestsHighlightBtn.addEventListener('click', clearTestsHighlightOnPage);
    }

    if (copyTestsShareBtn) {
        copyTestsShareBtn.addEventListener('click', copyTestsShareText);
    }

    if (downloadTestsShareBtn) {
        downloadTestsShareBtn.addEventListener('click', downloadTestsShareText);
    }

    if (importTestsShareBtn && importTestsShareInput) {
        importTestsShareBtn.addEventListener('click', () => {
            importTestsShareInput.value = '';
            importTestsShareInput.click();
        });
        importTestsShareInput.addEventListener('change', importTestsShareFromFile);
    }

    if (downloadTestsLogsBtn) {
        downloadTestsLogsBtn.addEventListener('click', downloadTestsSearchLogs);
    }

    }
}

window.GodGamePopupController = LegacyPopupController;



