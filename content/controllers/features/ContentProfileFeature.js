class ContentProfileFeature extends window.ContentFeatureBase {
    extractInternetUrokProfileInfo(...args) {
        return __ContentProfileFeature_extractInternetUrokProfileInfo(this.ctx, ...args);
    }
}

function __ContentProfileFeature_extractInternetUrokProfileInfo(ctx, ...args) {
    with (ctx) {
        return (function extractInternetUrokProfileInfo() {
        const nameEl = document.querySelector('#sidebar__user-name');
        const name = normalizeText(nameEl ? nameEl.textContent : '');

        const classCandidates = Array.from(document.querySelectorAll('span, div'))
            .map((node) => normalizeText(node.textContent || ''))
            .filter(Boolean)
            .filter((text) => /^[0-9]{1,2}[А-ЯЁA-Z]{2,}[0-9A-ZА-ЯЁ]*$/i.test(text));

        let className = '';
        const preferredClassNode = Array.from(document.querySelectorAll('.filters-grid span, [class*="filters-grid"] span, [class*="e2cef282"] span'))
            .map((node) => normalizeText(node.textContent || ''))
            .find((text) => /^[0-9]{1,2}[А-ЯЁA-Z]{2,}[0-9A-ZА-ЯЁ]*$/i.test(text));

        if (preferredClassNode) {
            className = preferredClassNode;
        } else if (classCandidates.length > 0) {
            className = classCandidates[0];
        }

        if (!name && !className) {
            return {
                success: false,
                error: 'Данные профиля InternetUrok на странице не найдены'
            };
        }

        return {
            success: true,
            name,
            className
        };
    
        }).apply(null, args);
    }
}

window.ContentProfileFeature = ContentProfileFeature;

