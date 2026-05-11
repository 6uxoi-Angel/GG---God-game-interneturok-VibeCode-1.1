class ContentQuestionFeature extends window.ContentFeatureBase {
    stripHtmlTags(...args) {
        return __ContentQuestionFeature_stripHtmlTags(this.ctx, ...args);
    }

    normalizeText(...args) {
        return __ContentQuestionFeature_normalizeText(this.ctx, ...args);
    }

    normalizeComparableText(...args) {
        return __ContentQuestionFeature_normalizeComparableText(this.ctx, ...args);
    }

    isVisibleElement(...args) {
        return __ContentQuestionFeature_isVisibleElement(this.ctx, ...args);
    }

    getPracticeScope(...args) {
        return __ContentQuestionFeature_getPracticeScope(this.ctx, ...args);
    }

    findQuestionElement(...args) {
        return __ContentQuestionFeature_findQuestionElement(this.ctx, ...args);
    }

    findModernQuestionBlock(...args) {
        return __ContentQuestionFeature_findModernQuestionBlock(this.ctx, ...args);
    }

    pushOptionLine(...args) {
        return __ContentQuestionFeature_pushOptionLine(this.ctx, ...args);
    }

    getReadableText(...args) {
        return __ContentQuestionFeature_getReadableText(this.ctx, ...args);
    }

    extractQuestionCondition(...args) {
        return __ContentQuestionFeature_extractQuestionCondition(this.ctx, ...args);
    }

    extractQuestionComment(...args) {
        return __ContentQuestionFeature_extractQuestionComment(this.ctx, ...args);
    }

    extractMultipleChoiceOptions(...args) {
        return __ContentQuestionFeature_extractMultipleChoiceOptions(this.ctx, ...args);
    }

    extractDragMatchOptions(...args) {
        return __ContentQuestionFeature_extractDragMatchOptions(this.ctx, ...args);
    }

    extractInputQuestionOptions(...args) {
        return __ContentQuestionFeature_extractInputQuestionOptions(this.ctx, ...args);
    }

    extractOptionLines(...args) {
        return __ContentQuestionFeature_extractOptionLines(this.ctx, ...args);
    }

    ensureOptionPrefix(...args) {
        return __ContentQuestionFeature_ensureOptionPrefix(this.ctx, ...args);
    }

    buildCopyText(...args) {
        return __ContentQuestionFeature_buildCopyText(this.ctx, ...args);
    }

    buildCombinedCopyText(...args) {
        return __ContentQuestionFeature_buildCombinedCopyText(this.ctx, ...args);
    }

    normalizePromptText(...args) {
        return __ContentQuestionFeature_normalizePromptText(this.ctx, ...args);
    }

    getUserPromptText(...args) {
        return __ContentQuestionFeature_getUserPromptText(this.ctx, ...args);
    }

    applyUserPromptToCopyText(...args) {
        return __ContentQuestionFeature_applyUserPromptToCopyText(this.ctx, ...args);
    }

    buildCombinedSignature(...args) {
        return __ContentQuestionFeature_buildCombinedSignature(this.ctx, ...args);
    }

    removeAssignmentNoise(...args) {
        return __ContentQuestionFeature_removeAssignmentNoise(this.ctx, ...args);
    }

    getReadableAssignmentText(...args) {
        return __ContentQuestionFeature_getReadableAssignmentText(this.ctx, ...args);
    }

    isLikelyOrdinaryAssignmentText(...args) {
        return __ContentQuestionFeature_isLikelyOrdinaryAssignmentText(this.ctx, ...args);
    }

    findOrdinaryAssignmentElement(...args) {
        return __ContentQuestionFeature_findOrdinaryAssignmentElement(this.ctx, ...args);
    }

    extractOrdinaryAssignmentPayloads(...args) {
        return __ContentQuestionFeature_extractOrdinaryAssignmentPayloads(this.ctx, ...args);
    }

    extractQuestionPayloads(...args) {
        return __ContentQuestionFeature_extractQuestionPayloads(this.ctx, ...args);
    }
}

function __ContentQuestionFeature_stripHtmlTags(ctx, ...args) {
    with (ctx) {
        return (function stripHtmlTags(html) {
        return String(html || '').replace(/<[^>]*>/g, '');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_normalizeText(ctx, ...args) {
    with (ctx) {
        return (function normalizeText(value) {
        return stripHtmlTags(String(value || ''))
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_normalizeComparableText(ctx, ...args) {
    with (ctx) {
        return (function normalizeComparableText(value) {
        return normalizeText(value)
            .toLowerCase()
            .replace(/ё/g, 'е')
            .replace(/[.,;:!?()[\]{}"'`«»]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_isVisibleElement(ctx, ...args) {
    with (ctx) {
        return (function isVisibleElement(element) {
        if (!element) {
            return false;
        }

        const style = window.getComputedStyle(element);
        if (!style) {
            return true;
        }

        return style.display !== 'none' && style.visibility !== 'hidden';
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_getPracticeScope(ctx, ...args) {
    with (ctx) {
        return (function getPracticeScope() {
        return document.querySelector('.b-popup.b-practice') || document.querySelector('.b-practice') || document;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_findQuestionElement(ctx, ...args) {
    with (ctx) {
        return (function findQuestionElement(scope) {
        const selectors = [
            '.b-practice__question',
            '.b-practice__condition',
            '.b-practice .b-practice__question'
        ];

        for (const selector of selectors) {
            const nodes = scope.querySelectorAll(selector);
            for (const node of nodes) {
                const text = normalizeText(node.textContent);
                if (!text || text.length < 3) {
                    continue;
                }

                if (!isVisibleElement(node)) {
                    continue;
                }

                return node;
            }
        }

        return null;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_findModernQuestionBlock(ctx, ...args) {
    with (ctx) {
        return (function findModernQuestionBlock(scope) {
        const blocks = scope.querySelectorAll('[class*="question-basestyles__SQuestion"]');
        for (const block of blocks) {
            if (!isVisibleElement(block)) {
                continue;
            }

            const headerNode = block.querySelector(
                '[class*="question-basestyles__SQuestionHeader"] .header,' +
                ' [class*="question-basestyles__SQuestionHeader"] [class*="header"]'
            );

            const headerText = normalizeText(headerNode?.textContent || '');
            if (!headerText || headerText.length < 3) {
                continue;
            }

            return {
                block,
                questionText: headerText
            };
        }

        return null;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_pushOptionLine(ctx, ...args) {
    with (ctx) {
        return (function pushOptionLine(target, seen, line, questionText) {
        const normalized = normalizeText(line);
        if (!normalized) {
            return;
        }

        if (normalized === questionText) {
            return;
        }

        if (seen.has(normalized)) {
            return;
        }

        seen.add(normalized);
        target.push(normalized);
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_getReadableText(ctx, ...args) {
    with (ctx) {
        return (function getReadableText(element) {
        if (!element) return '';

        const clone = element.cloneNode(true);

        clone.querySelectorAll('.math, .katex').forEach((mathNode) => {
            const annotation = mathNode.querySelector('annotation[encoding="application/x-tex"]');
            const tex = normalizeText(annotation ? annotation.textContent : '');
            if (tex) {
                mathNode.replaceWith(document.createTextNode(tex));
            }
        });

        clone.querySelectorAll('script, style, svg, button, input, textarea, select, label, .result-icon, .katex-mathml, [aria-hidden="true"]').forEach((node) => {
            node.remove();
        });

        clone.querySelectorAll('img').forEach((img) => {
            const alt = normalizeText(img.getAttribute('alt') || 'изображение');
            const src = img.getAttribute('src') || '';
            img.replaceWith(document.createTextNode(src ? `[${alt}: ${src}]` : `[${alt}]`));
        });

        return normalizeText(clone.textContent || '');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractQuestionCondition(ctx, ...args) {
    with (ctx) {
        return (function extractQuestionCondition(contextNode) {
        const conditionNodes = contextNode.querySelectorAll(
            '[class*="question-basestyles__SQuestionText"],' +
            ' [class*="input-questionstyles__SInputQuestionText"]'
        );

        const conditions = [];
        conditionNodes.forEach((node) => {
            const text = getReadableText(node);
            if (text && !conditions.includes(text)) {
                conditions.push(text);
            }
        });

        return conditions.join(' ');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractQuestionComment(ctx, ...args) {
    with (ctx) {
        return (function extractQuestionComment(contextNode) {
        const commentNodes = contextNode.querySelectorAll('[class*="question-basestyles__SQuestionComment"]');
        const comments = [];
        commentNodes.forEach(node => {
            const text = getReadableText(node);
            if (text && !comments.includes(text)) {
                comments.push(text);
            }
        });
        return comments.join(' ');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractMultipleChoiceOptions(ctx, ...args) {
    with (ctx) {
        return (function extractMultipleChoiceOptions(questionRoot, questionText) {
        const lines = [];
        const seen = new Set();
        const items = questionRoot.querySelectorAll(
            '[class*="one-from-manystyles__SAnswerBaseFromMany"],' +
            ' [class*="many-from-manystyles__SAnswerBaseFromMany"], .answer'
        );

        items.forEach((item) => {
            const textNode = item.querySelector('.answer__text') || item.querySelector('[class*="SAnswerText"]') || item;
            pushOptionLine(lines, seen, getReadableText(textNode), questionText);
        });

        return lines;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractDragMatchOptions(ctx, ...args) {
    with (ctx) {
        return (function extractDragMatchOptions(questionRoot, questionText) {
        const lines = [];
        const seen = new Set();

        const leftParts = [];
        questionRoot.querySelectorAll('[class*="drop-sectionstyles__SDropSectionContainer"] p').forEach((node) => {
            const text = getReadableText(node);
            if (text && !leftParts.includes(text)) {
                leftParts.push(text);
            }
        });

        const rightParts = [];
        questionRoot.querySelectorAll('[class*="drag-answerstyles__SAnswer"] span').forEach((node) => {
            const text = getReadableText(node);
            if (text && !rightParts.includes(text)) {
                rightParts.push(text);
            }
        });

        leftParts.forEach((line) => pushOptionLine(lines, seen, `Поле: ${line}`, questionText));
        rightParts.forEach((line) => pushOptionLine(lines, seen, `Ответ: ${line}`, questionText));

        return lines;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractInputQuestionOptions(ctx, ...args) {
    with (ctx) {
        return (function extractInputQuestionOptions(questionRoot, questionText) {
        const lines = [];
        const inputs = questionRoot.querySelectorAll('input[type="text"], textarea');
        if (inputs.length > 0) {
            lines.push(inputs.length === 1 ? 'Поле для текстового ответа' : `Поля для текстового ответа: ${inputs.length}`);
        }
        return lines.filter((line) => line !== questionText);
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractOptionLines(ctx, ...args) {
    with (ctx) {
        return (function extractOptionLines(scope, questionText, contextNode = null) {
        const questionRoot = contextNode || scope;
        const lines = [];
        const seen = new Set();

        extractMultipleChoiceOptions(questionRoot, questionText).forEach((line) => pushOptionLine(lines, seen, line, questionText));
        extractDragMatchOptions(questionRoot, questionText).forEach((line) => pushOptionLine(lines, seen, line, questionText));
        extractInputQuestionOptions(questionRoot, questionText).forEach((line) => pushOptionLine(lines, seen, line, questionText));

        logInfo('Извлечены варианты/элементы вопроса', {
            count: lines.length,
            question: questionText.substring(0, 50)
        });

        return lines;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_ensureOptionPrefix(ctx, ...args) {
    with (ctx) {
        return (function ensureOptionPrefix(line, index) {
        if (/^[A-Za-zА-Яа-я0-9]+\)/.test(line)) {
            return line;
        }

        return `${index + 1}) ${line}`;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_buildCopyText(ctx, ...args) {
    with (ctx) {
        return (function buildCopyText(question, options, condition = '', comment = '') {
        const parts = [`Вопрос:\n${question}`];

        if (comment) {
            parts.push(`Условия:\n${comment}`);
        }

        if (condition) {
            parts.push(`Текст:\n${condition}`);
        }

        if (options.length > 0) {
            const optionLines = options.map((line, index) => ensureOptionPrefix(line, index));
            parts.push(`Варианты ответа:\n${optionLines.join('\n')}`);
        }

        return parts.join('\n\n');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_buildCombinedCopyText(ctx, ...args) {
    with (ctx) {
        return (function buildCombinedCopyText(payloads) {
        if (!payloads || payloads.length === 0) {
            return '';
        }

        if (payloads.length === 1) {
            return payloads[0].text;
        }

        return payloads
            .map((payload, index) => {
                const label = payload.type === 'assignment' ? 'Задание' : 'Вопрос';
                return `=== ${label} ${index + 1} ===\n${payload.text || buildCopyText(payload.question, payload.options, payload.condition, payload.comment)}`;
            })
            .join('\n\n');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_normalizePromptText(ctx, ...args) {
    with (ctx) {
        return (function normalizePromptText(value) {
        return String(value || '')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n')
            .map((line) => line.trimEnd())
            .join('\n')
            .trim();
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_getUserPromptText(ctx, ...args) {
    with (ctx) {
        return (function getUserPromptText() {
        return new Promise((resolve) => {
            try {
                chrome.storage.local.get([USER_PROMPT_STORAGE_KEY], (result) => {
                    resolve(normalizePromptText(result && result[USER_PROMPT_STORAGE_KEY]));
                });
            } catch (_error) {
                resolve('');
            }
        });
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_applyUserPromptToCopyText(ctx, ...args) {
    with (ctx) {
        return (function applyUserPromptToCopyText(text, prompt) {
        const safeText = String(text || '').trim();
        const safePrompt = normalizePromptText(prompt);
        if (!safePrompt) {
            return safeText;
        }
        return `${safePrompt}\n\n${safeText}`;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_buildCombinedSignature(ctx, ...args) {
    with (ctx) {
        return (function buildCombinedSignature(payloads) {
        if (!payloads || payloads.length === 0) {
            return '';
        }

        return payloads.map((payload) => payload.signature).join('||#||');
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_removeAssignmentNoise(ctx, ...args) {
    with (ctx) {
        return (function removeAssignmentNoise(clone) {
        clone.querySelectorAll('script, style, svg, button, input, textarea, select, label, [aria-hidden="true"]').forEach((node) => {
            node.remove();
        });

        clone.querySelectorAll('*').forEach((node) => {
            const style = String(node.getAttribute('style') || '').toLowerCase();
            const className = String(node.className || '').toLowerCase();
            const id = String(node.id || '').toLowerCase();
            if (style.includes('display: none') || style.includes('visibility: hidden') || id === 'lesson-text-fullscreen' || className.includes('muibackdrop-root')) {
                node.remove();
                return;
            }

            const text = normalizeText(node.textContent || '');
            if (/мы\s+не\s+рекомендуем\s+использовать\s+искусственный\s+интеллект/i.test(text) && text.length < 900) {
                node.remove();
            }
        });
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_getReadableAssignmentText(ctx, ...args) {
    with (ctx) {
        return (function getReadableAssignmentText(element) {
        if (!element) {
            return '';
        }

        const clone = element.cloneNode(true);
        removeAssignmentNoise(clone);

        clone.querySelectorAll('.math, .katex').forEach((mathNode) => {
            const annotation = mathNode.querySelector('annotation[encoding="application/x-tex"]');
            const tex = normalizeText(annotation ? annotation.textContent : '');
            if (tex) {
                mathNode.replaceWith(document.createTextNode(tex));
            }
        });

        clone.querySelectorAll('img').forEach((img) => {
            const alt = normalizeText(img.getAttribute('alt') || 'изображение');
            const src = img.getAttribute('src') || '';
            img.replaceWith(document.createTextNode(src ? `\n[${alt}: ${src}]\n` : `\n[${alt}]\n`));
        });

        clone.querySelectorAll('br').forEach((node) => node.replaceWith(document.createTextNode('\n')));
        clone.querySelectorAll('li').forEach((node) => {
            node.insertBefore(document.createTextNode('\n- '), node.firstChild);
            node.appendChild(document.createTextNode('\n'));
        });
        clone.querySelectorAll('p, div, section, article, main, h1, h2, h3, h4, h5, h6, ol, ul, table, tr').forEach((node) => {
            node.appendChild(document.createTextNode('\n'));
        });

        return String(clone.textContent || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+/g, ' ')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .join('\n')
            .trim();
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_isLikelyOrdinaryAssignmentText(ctx, ...args) {
    with (ctx) {
        return (function isLikelyOrdinaryAssignmentText(text) {
        const normalized = normalizeText(text);
        if (normalized.length < 40) {
            return false;
        }

        // Старый код видел только тесты и задания вида «Задание 1».
        // На новых страницах InternetUrok обычное ДЗ часто приходит как
        // «Домашнее задание» + «Задание: выполнить ...» без номера.
        const hasHomeworkContext = /(Домашнее\s+задание|Задания\s+для\s+проверки\s+учителем|Срок\s+выполнения\s+ДЗ)/i.test(normalized);
        const hasAssignmentTitle = /(^|\s)Задани[ея]\s*(\d+)?\s*[:.\-\s]/i.test(normalized)
            || /Задание\s+\d+\s+выполн/i.test(normalized);
        const hasTaskWords = /(ответьте|дайте|решите|выполните|выполнить|сохраните|пришлите|покажите|сравните|идентификац(?:ия|ию)|определите|определить|загрузите|загрузить)/i.test(normalized);
        const hasUsefulHomeworkMaterial = /(Варианты|№\s*обучающегося|Заданная\s+профессия|Дополнительные\s+материалы|Шаблон|ГОСТ)/i.test(normalized);

        return hasAssignmentTitle && (hasTaskWords || hasHomeworkContext || hasUsefulHomeworkMaterial);
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_findOrdinaryAssignmentElement(ctx, ...args) {
    with (ctx) {
        return (function findOrdinaryAssignmentElement() {
        // Сначала ищем явный блок с текстом ДЗ в новых styled-components страницах.
        // У пользователя пример: <main> ... <div class="sc-e2d468f2-0 ..."> ... Задание: выполнить ... </div>
        const preferredSelectors = [
            '[class*="sc-e2d468f2"]',
            '[class*="sc-a97f398b"]',
            'main [data-testid="info"] ~ *',
            'main'
        ];

        const candidates = [];
        preferredSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((node) => {
                if (!candidates.includes(node)) {
                    candidates.push(node);
                }
            });
        });

        document.querySelectorAll('article, main, section, div').forEach((node) => {
            if (!candidates.includes(node)) {
                candidates.push(node);
            }
        });

        let best = null;

        candidates.forEach((node) => {
            if (!isVisibleElement(node)) {
                return;
            }

            const text = getReadableAssignmentText(node);
            if (!isLikelyOrdinaryAssignmentText(text)) {
                return;
            }

            // Не отсекаем большие ДЗ слишком рано: новые страницы содержат таблицы,
            // ссылки на материалы и описания картинок. Но огромные контейнеры всё же режем.
            if (text.length > 60000) {
                return;
            }

            const isPreferred = preferredSelectors.some((selector) => {
                try {
                    return node.matches(selector);
                } catch (_error) {
                    return false;
                }
            });
            const hasSeveralAssignments = /Задани[ея]\s*1/i.test(text) && /Задани[ея]\s*2/i.test(text);
            const hasHomeworkShell = /(Домашнее\s+задание|Срок\s+выполнения\s+ДЗ|Загрузить\s+решение|Распечатать)/i.test(text);

            // Выбираем самый маленький подходящий блок, но даём бонус явному контентному контейнеру.
            // Так не копируется весь <main> с кнопками, если есть внутренний блок с самим заданием.
            const score = text.length
                - (isPreferred ? 12000 : 0)
                - (hasSeveralAssignments ? 5000 : 0)
                + (hasHomeworkShell && !isPreferred ? 8000 : 0);

            if (!best || score < best.score) {
                best = { node, text, score };
            }
        });

        return best;
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractOrdinaryAssignmentPayloads(ctx, ...args) {
    with (ctx) {
        return (function extractOrdinaryAssignmentPayloads() {
        const match = findOrdinaryAssignmentElement();
        if (!match || !match.text) {
            return {
                success: false,
                error: 'Обычное задание на странице не найдено'
            };
        }

        const text = match.text;
        const firstLine = text.split('\n').find(Boolean) || 'Обычное задание';
        const signature = `assignment||${text}`;

        logInfo('Обычное задание найдено', {
            title: firstLine.substring(0, 80),
            textLength: text.length
        });

        return {
            success: true,
            payloads: [
                {
                    type: 'assignment',
                    question: firstLine,
                    options: [],
                    condition: text,
                    comment: '',
                    text: `Задание:\n${text}`,
                    signature
                }
            ]
        };
    
        }).apply(null, args);
    }
}

function __ContentQuestionFeature_extractQuestionPayloads(ctx, ...args) {
    with (ctx) {
        return (function extractQuestionPayloads() {
        const scope = getPracticeScope();
        const payloads = [];
        const signatureSet = new Set();

        const modernBlocks = scope.querySelectorAll('div[id][class*="question-basestyles__SQuestion"]');
        modernBlocks.forEach((block) => {
            if (!isVisibleElement(block)) {
                return;
            }

            const headerNode = block.querySelector(
                ':scope > [class*="question-basestyles__SQuestionHeader"] .header,' +
                ' :scope > [class*="question-basestyles__SQuestionHeader"] [class*="header"]'
            );

            if (!headerNode) {
                logInfo('Пропущен вложенный/служебный блок без прямого заголовка вопроса', {
                    id: block.id || '',
                    className: String(block.className || '').slice(0, 80)
                });
                return;
            }

            const questionText = normalizeText(headerNode?.textContent || '');
            if (!questionText || questionText.length < 3) {
                return;
            }

            const condition = extractQuestionCondition(block);
            const comment = extractQuestionComment(block);
            const options = extractOptionLines(scope, questionText, block);
            const signature = `${questionText}||${condition}||${comment}||${options.join('||')}`;
            if (signatureSet.has(signature)) {
                logInfo('Дубликат вопроса пропущен', { question: questionText.substring(0, 50) });
                return;
            }

            signatureSet.add(signature);
            logInfo('Вопрос найден', { id: block.id, question: questionText.substring(0, 50), optionsCount: options.length, conditionLength: condition.length, commentLength: comment.length, condition: condition.substring(0, 50), comment: comment.substring(0, 50) });
            payloads.push({
                question: questionText,
                options,
                condition,
                comment,
                text: buildCopyText(questionText, options, condition, comment),
                signature
            });
        });

        if (payloads.length > 0) {
            return {
                success: true,
                payloads
            };
        }

        const questionElement = findQuestionElement(scope);

        if (!questionElement) {
            const assignmentResult = extractOrdinaryAssignmentPayloads();
            if (assignmentResult.success) {
                return assignmentResult;
            }

            return {
                success: false,
                error: 'Вопрос или обычное задание на странице не найдено'
            };
        }

        const questionText = normalizeText(questionElement.textContent);
        if (!questionText) {
            return {
                success: false,
                error: 'Текст вопроса пустой'
            };
        }

        const condition = '';
        const comment = '';
        const options = extractOptionLines(scope, questionText, questionElement);
        const text = buildCopyText(questionText, options, condition, comment);
        const signature = `${questionText}||${condition}||${comment}||${options.join('||')}`;

        return {
            success: true,
            payloads: [
                {
                    question: questionText,
                    options,
                    condition,
                    comment,
                    text,
                    signature
                }
            ]
        };
    
        }).apply(null, args);
    }
}

window.ContentQuestionFeature = ContentQuestionFeature;

