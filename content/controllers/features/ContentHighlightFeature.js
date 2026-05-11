class ContentHighlightFeature extends window.ContentFeatureBase {
    parseHighlightColorToRgb(...args) {
        return __ContentHighlightFeature_parseHighlightColorToRgb(this.ctx, ...args);
    }

    ensureAnswerHighlightStyles(...args) {
        return __ContentHighlightFeature_ensureAnswerHighlightStyles(this.ctx, ...args);
    }

    clearAnswerHighlights(...args) {
        return __ContentHighlightFeature_clearAnswerHighlights(this.ctx, ...args);
    }

    ensureTestHighlightStyles(...args) {
        return __ContentHighlightFeature_ensureTestHighlightStyles(this.ctx, ...args);
    }

    clearFoundTestsHighlight(...args) {
        return __ContentHighlightFeature_clearFoundTestsHighlight(this.ctx, ...args);
    }

    normalizeTestLinkForCompare(...args) {
        return __ContentHighlightFeature_normalizeTestLinkForCompare(this.ctx, ...args);
    }

    collectTestMatchers(...args) {
        return __ContentHighlightFeature_collectTestMatchers(this.ctx, ...args);
    }

    matchHomeworkLinkByTestMatchers(...args) {
        return __ContentHighlightFeature_matchHomeworkLinkByTestMatchers(this.ctx, ...args);
    }

    highlightFoundTests(...args) {
        return __ContentHighlightFeature_highlightFoundTests(this.ctx, ...args);
    }

    addQuestionAnswerNote(...args) {
        return __ContentHighlightFeature_addQuestionAnswerNote(this.ctx, ...args);
    }

    parseAnswerIndexes(...args) {
        return __ContentHighlightFeature_parseAnswerIndexes(this.ctx, ...args);
    }

    parseMatchPairs(...args) {
        return __ContentHighlightFeature_parseMatchPairs(this.ctx, ...args);
    }

    parseModelAnswerText(...args) {
        return __ContentHighlightFeature_parseModelAnswerText(this.ctx, ...args);
    }

    findOptionRows(...args) {
        return __ContentHighlightFeature_findOptionRows(this.ctx, ...args);
    }

    highlightChoiceAnswers(...args) {
        return __ContentHighlightFeature_highlightChoiceAnswers(this.ctx, ...args);
    }

    findTextNodeByNeedle(...args) {
        return __ContentHighlightFeature_findTextNodeByNeedle(this.ctx, ...args);
    }

    highlightMatchAnswers(...args) {
        return __ContentHighlightFeature_highlightMatchAnswers(this.ctx, ...args);
    }

    applyModelAnswersHighlight(...args) {
        return __ContentHighlightFeature_applyModelAnswersHighlight(this.ctx, ...args);
    }
}

function __ContentHighlightFeature_parseHighlightColorToRgb(ctx, ...args) {
    with (ctx) {
        return (function parseHighlightColorToRgb(rawValue) {
        const text = String(rawValue || '').trim();
        if (!text) {
            return null;
        }

        const hexMatch = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexMatch) {
            const hexRaw = hexMatch[1];
            const normalizedHex = hexRaw.length === 3
                ? hexRaw.split('').map((ch) => ch + ch).join('')
                : hexRaw;

            return {
                r: parseInt(normalizedHex.slice(0, 2), 16),
                g: parseInt(normalizedHex.slice(2, 4), 16),
                b: parseInt(normalizedHex.slice(4, 6), 16)
            };
        }

        const rgbMatch = text.match(/^rgb\s*\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/i)
            || text.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
        if (!rgbMatch) {
            return null;
        }

        const channels = [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((item) => Number(item));
        if (channels.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
            return null;
        }

        return {
            r: channels[0],
            g: channels[1],
            b: channels[2]
        };
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_ensureAnswerHighlightStyles(ctx, ...args) {
    with (ctx) {
        return (function ensureAnswerHighlightStyles(highlightColorValue = null) {
        const defaultRgb = { r: 34, g: 197, b: 94 };
        const rgb = parseHighlightColorToRgb(highlightColorValue) || defaultRgb;
        const colorKey = `${rgb.r},${rgb.g},${rgb.b}|v2`;
        let style = document.getElementById(ANSWER_HIGHLIGHT_STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = ANSWER_HIGHLIGHT_STYLE_ID;
            (document.head || document.documentElement).appendChild(style);
        } else if (style.dataset.colorKey === colorKey) {
            return rgb;
        }

        style.dataset.colorKey = colorKey;
        style.textContent = `
            .${ANSWER_HIGHLIGHT_CLASS} {
                background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16) !important;
                border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55) !important;
                box-shadow: 0 0 0 2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.32) inset !important;
                border-radius: 10px !important;
            }

            .${ANSWER_HIGHLIGHT_QUESTION_CLASS} {
                box-shadow: 0 0 0 2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35) inset !important;
                border-radius: 12px !important;
            }

            .${ANSWER_HIGHLIGHT_NOTE_CLASS} {
                margin-top: 8px;
                padding: 8px 10px;
                border-radius: 10px;
                border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45);
                background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12);
                color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});
                font-size: 12px;
                line-height: 1.35;
                font-weight: 700;
            }

            .god-game-match-color-node {
                --gg-match-r: ${rgb.r};
                --gg-match-g: ${rgb.g};
                --gg-match-b: ${rgb.b};
                position: relative !important;
                background: rgba(var(--gg-match-r), var(--gg-match-g), var(--gg-match-b), 0.18) !important;
                border-color: rgba(var(--gg-match-r), var(--gg-match-g), var(--gg-match-b), 0.7) !important;
                box-shadow:
                    0 0 0 2px rgba(var(--gg-match-r), var(--gg-match-g), var(--gg-match-b), 0.5) inset,
                    0 8px 22px rgba(var(--gg-match-r), var(--gg-match-g), var(--gg-match-b), 0.18) !important;
                border-radius: 10px !important;
            }

            .god-game-match-color-node::before {
                content: attr(data-gg-match-index);
                position: absolute !important;
                top: -8px !important;
                right: -8px !important;
                min-width: 20px !important;
                height: 20px !important;
                padding: 0 6px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 999px !important;
                background: rgb(var(--gg-match-r), var(--gg-match-g), var(--gg-match-b)) !important;
                color: #fff !important;
                font-size: 11px !important;
                line-height: 20px !important;
                font-weight: 800 !important;
                z-index: 3 !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22) !important;
            }
        `;

        return rgb;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_clearAnswerHighlights(ctx, ...args) {
    with (ctx) {
        return (function clearAnswerHighlights() {
        document.querySelectorAll(`.${ANSWER_HIGHLIGHT_CLASS}`).forEach((node) => {
            node.classList.remove(ANSWER_HIGHLIGHT_CLASS);
        });

        document.querySelectorAll(`.${ANSWER_HIGHLIGHT_QUESTION_CLASS}`).forEach((node) => {
            node.classList.remove(ANSWER_HIGHLIGHT_QUESTION_CLASS);
        });

        answerHighlightState.notes.forEach((node) => {
            try {
                node.remove();
            } catch (_error) {
                // no-op
            }
        });
        answerHighlightState.notes = [];

        document.querySelectorAll('.god-game-match-arrow-overlay').forEach((node) => {
            try {
                node.remove();
            } catch (_error) {
                // no-op
            }
        });

        document.querySelectorAll('.god-game-match-color-node').forEach((node) => {
            node.classList.remove('god-game-match-color-node');
            node.removeAttribute('data-gg-match-index');
            node.style.removeProperty('--gg-match-r');
            node.style.removeProperty('--gg-match-g');
            node.style.removeProperty('--gg-match-b');
        });
        answerHighlightState.arrows = [];
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_ensureTestHighlightStyles(ctx, ...args) {
    with (ctx) {
        return (function ensureTestHighlightStyles(highlightColorValue = null) {
        const defaultRgb = { r: 34, g: 197, b: 94 };
        const rgb = parseHighlightColorToRgb(highlightColorValue) || defaultRgb;
        const colorKey = `${rgb.r},${rgb.g},${rgb.b}|v2`;
        let style = document.getElementById(TEST_HIGHLIGHT_STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = TEST_HIGHLIGHT_STYLE_ID;
            (document.head || document.documentElement).appendChild(style);
        } else if (style.dataset.colorKey === colorKey) {
            return rgb;
        }

        style.dataset.colorKey = colorKey;
        style.textContent = `
            .${TEST_HIGHLIGHT_CLASS} {
                background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14) !important;
                border-radius: 8px !important;
                box-shadow: 0 0 0 2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) inset !important;
            }

            .${TEST_HIGHLIGHT_CELL_CLASS} {
                outline: 2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45) !important;
                outline-offset: -2px !important;
                border-radius: 8px !important;
            }

            .god-game-test-question-badge {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 18px !important;
                margin-left: 4px !important;
                padding: 1px 5px !important;
                border-radius: 999px !important;
                border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55) !important;
                background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18) !important;
                color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) !important;
                font-size: 11px !important;
                line-height: 1.2 !important;
                font-weight: 900 !important;
                vertical-align: middle !important;
            }
        `;

        return rgb;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_clearFoundTestsHighlight(ctx, ...args) {
    with (ctx) {
        return (function clearFoundTestsHighlight() {
        testHighlightState.links.forEach((node) => {
            try {
                node.classList.remove(TEST_HIGHLIGHT_CLASS);
            } catch (_error) {
                // no-op
            }
        });

        testHighlightState.cells.forEach((node) => {
            try {
                node.classList.remove(TEST_HIGHLIGHT_CELL_CLASS);
            } catch (_error) {
                // no-op
            }
        });

        (Array.isArray(testHighlightState.questionBadges) ? testHighlightState.questionBadges : []).forEach((node) => {
            try {
                node.remove();
            } catch (_error) {
                // no-op
            }
        });

        testHighlightState.links = [];
        testHighlightState.cells = [];
        testHighlightState.questionBadges = [];
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_normalizeTestLinkForCompare(ctx, ...args) {
    with (ctx) {
        return (function normalizeTestLinkForCompare(rawHref) {
        const href = String(rawHref || '').trim();
        if (!href) {
            return { absolute: '', path: '', itemId: '', lessonId: '' };
        }

        let absolute = '';
        let path = '';
        let itemId = '';
        let lessonId = '';

        try {
            const parsed = new URL(href, window.location.origin);
            parsed.hash = '';
            absolute = parsed.href;
            path = `${parsed.pathname}${parsed.search}`;
            itemId = parsed.searchParams.get('itemId') || '';
            const lessonMatch = parsed.pathname.match(/\/lesson\/(\d+)/);
            lessonId = lessonMatch ? lessonMatch[1] : '';
        } catch (_error) {
            absolute = href;
        }

        return {
            absolute: String(absolute || ''),
            path: String(path || ''),
            itemId: String(itemId || ''),
            lessonId: String(lessonId || '')
        };
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_collectTestMatchers(ctx, ...args) {
    with (ctx) {
        return (function collectTestMatchers(tests) {
        const hrefs = new Set();
        const paths = new Set();
        const itemIds = new Set();
        const lessonIds = new Set();

        (Array.isArray(tests) ? tests : []).forEach((item) => {
            const hrefInfo = normalizeTestLinkForCompare(item && item.href ? item.href : '');
            const pathInfo = normalizeTestLinkForCompare(item && item.path ? item.path : '');

            [hrefInfo, pathInfo].forEach((entry) => {
                if (entry.absolute) hrefs.add(entry.absolute);
                if (entry.path) paths.add(entry.path);
                if (entry.itemId) itemIds.add(entry.itemId);
                if (entry.lessonId) lessonIds.add(entry.lessonId);
            });

            if (item && item.itemId) itemIds.add(String(item.itemId));
            if (item && item.lessonId) lessonIds.add(String(item.lessonId));
        });

        return { hrefs, paths, itemIds, lessonIds };
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_matchHomeworkLinkByTestMatchers(ctx, ...args) {
    with (ctx) {
        return (function matchHomeworkLinkByTestMatchers(link, matchers) {
        const hrefInfo = normalizeTestLinkForCompare(link ? (link.getAttribute('href') || link.href || '') : '');
        if (!hrefInfo.absolute && !hrefInfo.path && !hrefInfo.itemId && !hrefInfo.lessonId) {
            return false;
        }

        if (hrefInfo.itemId && matchers.itemIds.has(hrefInfo.itemId)) {
            return true;
        }

        if (hrefInfo.absolute && matchers.hrefs.has(hrefInfo.absolute)) {
            return true;
        }

        if (hrefInfo.path && matchers.paths.has(hrefInfo.path)) {
            return true;
        }

        if (hrefInfo.lessonId && matchers.lessonIds.has(hrefInfo.lessonId)) {
            return true;
        }

        return false;
    
        }).apply(null, args);
    }
}


function __ContentHighlightFeature_findMatchedTestForLink(ctx, ...args) {
    with (ctx) {
        return (function findMatchedTestForLink(link, tests) {
        const safeTests = Array.isArray(tests) ? tests : [];
        for (const item of safeTests) {
            const matchers = collectTestMatchers([item]);
            if (matchHomeworkLinkByTestMatchers(link, matchers)) {
                return item;
            }
        }
        return null;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_appendQuestionsCountBadge(ctx, ...args) {
    with (ctx) {
        return (function appendQuestionsCountBadge(link, testItem) {
        const questionsCount = Number(testItem && testItem.questionsCount);
        if (!Number.isFinite(questionsCount) || questionsCount <= 0 || !link) {
            return null;
        }

        const dzSpan = Array.from(link.querySelectorAll('span, div')).find((node) => /^ДЗ$/i.test(normalizeText(node.textContent || '')));
        const target = dzSpan || link;
        if (target.parentElement && target.parentElement.querySelector('.god-game-test-question-badge')) {
            return null;
        }

        const badge = document.createElement('span');
        badge.className = 'god-game-test-question-badge';
        badge.textContent = String(questionsCount);
        badge.title = `Количество вопросов: ${questionsCount}`;
        target.insertAdjacentElement('afterend', badge);
        testHighlightState.questionBadges.push(badge);
        return badge;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_getMatchPairColor(ctx, ...args) {
    with (ctx) {
        return (function getMatchPairColor(index) {
        const palette = [
            { r: 239, g: 68, b: 68 },
            { r: 37, g: 99, b: 235 },
            { r: 16, g: 185, b: 129 },
            { r: 245, g: 158, b: 11 },
            { r: 168, g: 85, b: 247 },
            { r: 236, g: 72, b: 153 },
            { r: 20, g: 184, b: 166 },
            { r: 249, g: 115, b: 22 },
            { r: 99, g: 102, b: 241 },
            { r: 132, g: 204, b: 22 }
        ];

        return palette[Math.abs(Number(index) || 0) % palette.length];

        }).apply(null, args);
    }
}

function __ContentHighlightFeature_applyMatchPairColor(ctx, ...args) {
    with (ctx) {
        return (function applyMatchPairColor(node, rgb, index) {
        if (!node || !rgb) {
            return;
        }

        node.classList.add(ANSWER_HIGHLIGHT_CLASS);
        node.classList.add('god-game-match-color-node');
        node.dataset.ggMatchIndex = String((Number(index) || 0) + 1);
        node.style.setProperty('--gg-match-r', String(rgb.r));
        node.style.setProperty('--gg-match-g', String(rgb.g));
        node.style.setProperty('--gg-match-b', String(rgb.b));

        }).apply(null, args);
    }
}

function __ContentHighlightFeature_drawMatchAnswerArrow(ctx, ...args) {
    with (ctx) {
        return (function drawMatchAnswerArrow(questionBlock, leftContainer, rightContainer, rgb) {
        if (!questionBlock || !leftContainer || !rightContainer) {
            return null;
        }

        const blockRect = questionBlock.getBoundingClientRect();
        const leftRect = leftContainer.getBoundingClientRect();
        const rightRect = rightContainer.getBoundingClientRect();
        if (!blockRect.width || !blockRect.height || !leftRect.width || !rightRect.width) {
            return null;
        }

        const computed = window.getComputedStyle(questionBlock);
        if (computed && computed.position === 'static') {
            questionBlock.style.position = 'relative';
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'god-game-match-arrow-overlay');
        svg.setAttribute('viewBox', `0 0 ${Math.max(1, blockRect.width)} ${Math.max(1, blockRect.height)}`);
        svg.setAttribute('preserveAspectRatio', 'none');

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        const markerId = `god-game-arrow-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        marker.setAttribute('id', markerId);
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
        path.setAttribute('fill', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        marker.appendChild(path);
        defs.appendChild(marker);
        svg.appendChild(defs);

        const startX = rightRect.left - blockRect.left;
        const startY = rightRect.top - blockRect.top + rightRect.height / 2;
        const endX = leftRect.right - blockRect.left;
        const endY = leftRect.top - blockRect.top + leftRect.height / 2;
        const midX = (startX + endX) / 2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('class', 'god-game-match-arrow-line');
        line.setAttribute('fill', 'none');
        line.setAttribute('d', `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`);
        line.setAttribute('marker-end', `url(#${markerId})`);
        svg.appendChild(line);

        questionBlock.appendChild(svg);
        answerHighlightState.arrows.push(svg);
        return svg;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_highlightFoundTests(ctx, ...args) {
    with (ctx) {
        return (function highlightFoundTests(tests, highlightColorValue = null) {
        clearFoundTestsHighlight();
        ensureTestHighlightStyles(highlightColorValue);

        const matchers = collectTestMatchers(tests);
        if (matchers.hrefs.size === 0 && matchers.paths.size === 0 && matchers.itemIds.size === 0 && matchers.lessonIds.size === 0) {
            return { success: true, highlighted: 0, highlightedCells: 0 };
        }

        const links = Array.from(
            document.querySelectorAll('a[href*="type=homework"], a[href*="fromJournal=true"], table a[href]')
        );
        const touchedCells = new Set();
        let highlighted = 0;

        links.forEach((link) => {
            if (!matchHomeworkLinkByTestMatchers(link, matchers)) {
                return;
            }

            const matchedTest = __ContentHighlightFeature_findMatchedTestForLink(ctx, link, tests);
            link.classList.add(TEST_HIGHLIGHT_CLASS);
            testHighlightState.links.push(link);
            __ContentHighlightFeature_appendQuestionsCountBadge(ctx, link, matchedTest);
            highlighted += 1;

            const cell = link.closest('td');
            if (cell && !touchedCells.has(cell)) {
                touchedCells.add(cell);
                cell.classList.add(TEST_HIGHLIGHT_CELL_CLASS);
                testHighlightState.cells.push(cell);
            }
        });

        return {
            success: true,
            highlighted,
            highlightedCells: touchedCells.size
        };
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_addQuestionAnswerNote(ctx, ...args) {
    with (ctx) {
        return (function addQuestionAnswerNote(questionBlock, text) {
        if (!questionBlock || !text) {
            return;
        }

        const header = questionBlock.querySelector('[class*="question-basestyles__SQuestionHeader"]');
        const note = document.createElement('div');
        note.className = ANSWER_HIGHLIGHT_NOTE_CLASS;
        note.textContent = text;

        if (header && header.parentNode) {
            header.parentNode.insertBefore(note, header.nextSibling);
        } else {
            questionBlock.insertBefore(note, questionBlock.firstChild);
        }

        answerHighlightState.notes.push(note);
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_parseAnswerIndexes(ctx, ...args) {
    with (ctx) {
        return (function parseAnswerIndexes(text) {
        const matches = String(text || '').match(/\d+/g);
        if (!matches) {
            return [];
        }

        const unique = new Set();
        matches.forEach((match) => {
            const parsed = Number(match);
            if (Number.isInteger(parsed) && parsed > 0) {
                unique.add(parsed);
            }
        });

        return Array.from(unique.values()).sort((a, b) => a - b);
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_parseMatchPairs(ctx, ...args) {
    with (ctx) {
        return (function parseMatchPairs(rawAnswer) {
        const pairs = [];
        String(rawAnswer || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .forEach((line) => {
                const cleanLine = line.replace(/^[-•*]\s*/, '');
                const parts = cleanLine.split(/\s*=>\s*/);
                if (parts.length < 2) {
                    return;
                }

                const left = normalizeText(parts[0]);
                const right = normalizeText(parts.slice(1).join(' => '));
                if (!left || !right) {
                    return;
                }

                pairs.push({ left, right });
            });

        return pairs;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_parseModelAnswerText(ctx, ...args) {
    with (ctx) {
        return (function parseModelAnswerText(rawText) {
        const text = String(rawText || '')
            .replace(/\r\n?/g, '\n')
            .trim();

        if (!text) {
            return [];
        }

        const lines = text.split('\n');
        const blocks = [];
        let current = null;
        let collectingAnswer = false;
        let answerLines = [];

        const flushCurrent = () => {
            if (!current) {
                return;
            }

            const joinedAnswer = answerLines.join('\n').trim();
            const type = (current.type || '').toLowerCase();
            const parsed = {
                number: current.number,
                type,
                rawAnswer: joinedAnswer,
                indexes: [],
                pairs: [],
                answerText: joinedAnswer
            };

            if (type === 'single' || type === 'multiple') {
                parsed.indexes = parseAnswerIndexes(joinedAnswer);
            } else if (type === 'match') {
                parsed.pairs = parseMatchPairs(joinedAnswer);
            }

            blocks.push(parsed);
            current = null;
            collectingAnswer = false;
            answerLines = [];
        };

        lines.forEach((line) => {
            const taskMatch = line.match(/^\s*Задани[ея]\s*(\d+)\b/i);
            if (taskMatch) {
                flushCurrent();
                current = {
                    number: Number(taskMatch[1]),
                    type: ''
                };
                return;
            }

            if (!current) {
                return;
            }

            const typeMatch = line.match(/^\s*Тип\s*:\s*(.+)\s*$/i);
            if (typeMatch) {
                current.type = normalizeText(typeMatch[1]).toLowerCase();
                collectingAnswer = false;
                return;
            }

            const answerMatch = line.match(/^\s*Ответ\s*:\s*(.*)$/i);
            if (answerMatch) {
                collectingAnswer = true;
                answerLines = [];
                const tail = normalizeText(answerMatch[1]);
                if (tail) {
                    answerLines.push(tail);
                }
                return;
            }

            if (/^\s*Пояснение\s*:/i.test(line)) {
                collectingAnswer = false;
                return;
            }

            if (collectingAnswer) {
                answerLines.push(line);
            }
        });

        flushCurrent();
        return blocks;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_findOptionRows(ctx, ...args) {
    with (ctx) {
        return (function findOptionRows(questionBlock) {
        const rows = Array.from(questionBlock.querySelectorAll(
            '[class*="one-from-manystyles__SAnswerBaseFromMany"],' +
            ' [class*="many-from-manystyles__SAnswerBaseFromMany"]'
        ));

        if (rows.length > 0) {
            return rows;
        }

        return Array.from(questionBlock.querySelectorAll('.answer')).filter((node) => isVisibleElement(node));
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_highlightChoiceAnswers(ctx, ...args) {
    with (ctx) {
        return (function highlightChoiceAnswers(questionBlock, indexes) {
        if (!questionBlock || !Array.isArray(indexes) || indexes.length === 0) {
            return 0;
        }

        const rows = findOptionRows(questionBlock);
        let highlighted = 0;

        indexes.forEach((index) => {
            const row = rows[index - 1];
            if (!row) {
                return;
            }

            const target = row.querySelector('.answer') || row;
            target.classList.add(ANSWER_HIGHLIGHT_CLASS);
            highlighted += 1;
        });

        if (highlighted > 0) {
            questionBlock.classList.add(ANSWER_HIGHLIGHT_QUESTION_CLASS);
        }

        return highlighted;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_findTextNodeByNeedle(ctx, ...args) {
    with (ctx) {
        return (function findTextNodeByNeedle(nodes, needle) {
        const normalizedNeedle = normalizeComparableText(needle);
        if (!normalizedNeedle) {
            return null;
        }

        let exactMatch = null;
        for (const node of nodes) {
            const nodeText = normalizeComparableText(node.textContent || '');
            if (!nodeText) {
                continue;
            }

            if (nodeText === normalizedNeedle) {
                exactMatch = node;
                break;
            }
        }

        if (exactMatch) {
            return exactMatch;
        }

        for (const node of nodes) {
            const nodeText = normalizeComparableText(node.textContent || '');
            if (!nodeText) {
                continue;
            }

            if (nodeText.includes(normalizedNeedle) || normalizedNeedle.includes(nodeText)) {
                return node;
            }
        }

        return null;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_highlightMatchAnswers(ctx, ...args) {
    with (ctx) {
        return (function highlightMatchAnswers(questionBlock, pairs, rgbUsed = { r: 34, g: 197, b: 94 }) {
        if (!questionBlock || !Array.isArray(pairs) || pairs.length === 0) {
            return 0;
        }

        const leftNodes = Array.from(questionBlock.querySelectorAll('[class*="drop-sectionstyles__SDropSectionContainer"] p'));
        const rightNodes = Array.from(questionBlock.querySelectorAll('[class*="drag-answerstyles__SAnswer"] span'));
        let highlighted = 0;

        pairs.forEach((pair, index) => {
            const leftNode = findTextNodeByNeedle(leftNodes, pair.left);
            const rightNode = findTextNodeByNeedle(rightNodes, pair.right);

            const leftContainer = leftNode
                ? (leftNode.closest('[class*="drop-sectionstyles__SDropSectionContainer"]') || leftNode)
                : null;
            const rightContainer = rightNode
                ? (rightNode.closest('[class*="drag-answerstyles__SAnswer"]') || rightNode)
                : null;

            const pairColor = __ContentHighlightFeature_getMatchPairColor(ctx, index);

            if (leftContainer) {
                __ContentHighlightFeature_applyMatchPairColor(ctx, leftContainer, pairColor, index);
                highlighted += 1;
            }

            if (rightContainer) {
                __ContentHighlightFeature_applyMatchPairColor(ctx, rightContainer, pairColor, index);
                highlighted += 1;
            }
        });

        if (highlighted > 0) {
            questionBlock.classList.add(ANSWER_HIGHLIGHT_QUESTION_CLASS);
        }

        return highlighted;
    
        }).apply(null, args);
    }
}

function __ContentHighlightFeature_applyModelAnswersHighlight(ctx, ...args) {
    with (ctx) {
        return (function applyModelAnswersHighlight(rawText, highlightColorValue = null) {
        const parsed = parseModelAnswerText(rawText);
        if (!parsed || parsed.length === 0) {
            return {
                success: false,
                error: 'Не удалось распознать блоки «Задание N / Ответ»'
            };
        }

        const questionBlocks = Array.from(document.querySelectorAll('div[id][class*="question-basestyles__SQuestion"]'))
            .filter((node) => isVisibleElement(node));

        if (questionBlocks.length === 0) {
            return {
                success: false,
                error: 'Вопросы на текущей странице не найдены'
            };
        }

        const rgbUsed = ensureAnswerHighlightStyles(highlightColorValue);
        clearAnswerHighlights();

        let highlightedItems = 0;
        let touchedQuestions = 0;
        const warnings = [];

        parsed.forEach((entry) => {
            const index = Number.isInteger(entry.number) && entry.number > 0 ? entry.number - 1 : -1;
            const questionBlock = index >= 0 ? questionBlocks[index] : null;
            if (!questionBlock) {
                warnings.push(`Задание ${entry.number}: вопрос на странице не найден`);
                return;
            }

            touchedQuestions += 1;

            if (entry.type === 'single' || entry.type === 'multiple') {
                const count = highlightChoiceAnswers(questionBlock, entry.indexes);
                highlightedItems += count;
                if (count === 0) {
                    warnings.push(`Задание ${entry.number}: не удалось подсветить варианты по индексам`);
                }
                return;
            }

            if (entry.type === 'match') {
                const count = highlightMatchAnswers(questionBlock, entry.pairs, rgbUsed);
                highlightedItems += count;
                if (entry.rawAnswer) {
                    addQuestionAnswerNote(questionBlock, `Ответ: ${entry.rawAnswer.replace(/\n+/g, ' | ')}`);
                }
                if (count === 0) {
                    warnings.push(`Задание ${entry.number}: не удалось сопоставить элементы соответствия`);
                }
                return;
            }

            if (entry.rawAnswer) {
                questionBlock.classList.add(ANSWER_HIGHLIGHT_QUESTION_CLASS);
                addQuestionAnswerNote(questionBlock, `Ответ: ${entry.rawAnswer}`);
                highlightedItems += 1;
            } else {
                warnings.push(`Задание ${entry.number}: ответ пустой`);
            }
        });

        logInfo('Подсветка ответов применена', {
            parsedCount: parsed.length,
            touchedQuestions,
            highlightedItems,
            warningsCount: warnings.length
        });

        return {
            success: true,
            parsedCount: parsed.length,
            touchedQuestions,
            highlightedItems,
            colorUsed: `rgb(${rgbUsed.r}, ${rgbUsed.g}, ${rgbUsed.b})`,
            warnings
        };
    
        }).apply(null, args);
    }
}

window.ContentHighlightFeature = ContentHighlightFeature;

