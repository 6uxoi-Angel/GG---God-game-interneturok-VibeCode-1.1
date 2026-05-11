class PopupTabsFeature extends window.PopupFeatureBase {
    initTabs(...args) {
        return __PopupTabsFeature_initTabs(this.ctx, ...args);
    }

    setActiveTab(...args) {
        return __PopupTabsFeature_setActiveTab(this.ctx, ...args);
    }
}

function __PopupTabsFeature_initTabs(ctx, ...args) {
    with (ctx) {
        return (function initTabs() {
        if (!tabJitsiBtn
            || !tabQuestionBtn
            || !tabGradesBtn
            || !tabHighlightBtn
            || !tabProfileBtn
            || !panelJitsiEl
            || !panelQuestionEl
            || !panelGradesEl
            || !panelHighlightEl
            || !panelProfileEl) {
            return;
        }

        tabJitsiBtn.addEventListener('click', () => setActiveTab(TAB_JITSI));
        tabQuestionBtn.addEventListener('click', () => {
            setActiveTab(TAB_QUESTION);
            syncQuestionPanelState(false);
        });

        tabGradesBtn.addEventListener('click', () => {
            setActiveTab(TAB_GRADES);
        });

        tabHighlightBtn.addEventListener('click', () => {
            setActiveTab(TAB_HIGHLIGHT);
        });

        tabProfileBtn.addEventListener('click', () => {
            setActiveTab(TAB_PROFILE);
            refreshInternetUrokProfileInfo();
        });

        setActiveTab(TAB_JITSI);
    
        }).apply(null, args);
    }
}

function __PopupTabsFeature_setActiveTab(ctx, ...args) {
    with (ctx) {
        return (function setActiveTab(tabName) {
        const showJitsi = tabName === TAB_JITSI;
        const showQuestion = tabName === TAB_QUESTION;
        const showGrades = tabName === TAB_GRADES;
        const showHighlight = tabName === TAB_HIGHLIGHT;
        const showProfile = tabName === TAB_PROFILE;

        tabJitsiBtn.classList.toggle('active', showJitsi);
        tabQuestionBtn.classList.toggle('active', showQuestion);
        tabGradesBtn.classList.toggle('active', showGrades);
        tabHighlightBtn.classList.toggle('active', showHighlight);
        tabProfileBtn.classList.toggle('active', showProfile);

        panelJitsiEl.classList.toggle('active', showJitsi);
        panelQuestionEl.classList.toggle('active', showQuestion);
        panelGradesEl.classList.toggle('active', showGrades);
        panelHighlightEl.classList.toggle('active', showHighlight);
        panelProfileEl.classList.toggle('active', showProfile);
    
        }).apply(null, args);
    }
}

window.PopupTabsFeature = PopupTabsFeature;

