class PopupGradesFeature extends window.PopupFeatureBase {
    refreshGrades() {
        const c = this.ctx;

        c.setBusy(c.refreshGradesBtn, true, 'Считаем...');
        this.showGradesStatus('Читаю таблицу журнала на странице...', 'info');

        c.sendMessageToActiveTab({ action: 'calculateJournalGrades' }, (error, response) => {
            c.setBusy(c.refreshGradesBtn, false, 'Посчитать оценки');

            if (error) {
                this.renderGradesResult(null);
                this.showGradesStatus(
                    error.message === c.ERR_UNSUPPORTED_TAB
                        ? 'Откройте обычную страницу журнала'
                        : 'Нет связи со страницей',
                    'error'
                );
                return;
            }

            if (!response || !response.success) {
                this.renderGradesResult(null);
                this.showGradesStatus((response && response.error) || 'Не удалось прочитать оценки', 'warning');
                return;
            }

            this.renderGradesResult(response);
            this.showGradesStatus('Итоговые оценки рассчитаны', 'success');
        });
    }

    renderGradesResult(result) {
        const c = this.ctx;
        if (!c.gradesSummaryEl || !c.gradesListEl) return;
        c.gradesListEl.innerHTML = '';

        if (!result || !Array.isArray(result.subjects) || result.subjects.length === 0) {
            c.gradesSummaryEl.textContent = 'Оценки не найдены';
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty';
            emptyEl.textContent = 'Откройте журнал и нажмите «Посчитать оценки»';
            c.gradesListEl.appendChild(emptyEl);
            return;
        }

        c.gradesSummaryEl.textContent = `Найдено предметов: ${result.totalSubjects}. С оценками: ${result.subjectsWithMarks}. Формула: среднее арифметическое.`;

        result.subjects.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'grade-item';

            const head = document.createElement('div');
            head.className = 'grade-head';

            const subjectEl = document.createElement('div');
            subjectEl.className = 'grade-subject';
            subjectEl.textContent = item.subject || 'Без названия';

            const finalEl = document.createElement('div');
            finalEl.className = 'grade-final';
            finalEl.textContent = item.finalMark || '—';
            finalEl.title = 'Предполагаемая итоговая оценка';

            head.appendChild(subjectEl);
            head.appendChild(finalEl);

            const metaEl = document.createElement('div');
            metaEl.className = 'grade-meta';
            metaEl.textContent = item.marksCount > 0
                ? `Средний балл: ${Number(item.average).toFixed(2)} · Оценок: ${item.marksCount}`
                : 'Оценок для расчёта нет';

            const marksEl = document.createElement('div');
            marksEl.className = 'grade-marks';
            marksEl.textContent = item.marksCount > 0 ? `Оценки: ${item.marks.join(', ')}` : 'Оценки: —';

            card.appendChild(head);
            card.appendChild(metaEl);
            card.appendChild(marksEl);
            c.gradesListEl.appendChild(card);
        });
    }

    showGradesStatus(message, type = 'info') {
        const c = this.ctx;
        if (!c.gradesStatusEl) return;

        c.gradesStatusEl.textContent = message;
        c.gradesStatusEl.className = `status show is-${type}`;

        if (c.gradesStatusTimer) clearTimeout(c.gradesStatusTimer);

        c.gradesStatusTimer = setTimeout(() => {
            c.gradesStatusEl.className = 'status';
            c.gradesStatusEl.textContent = '';
        }, 3500);
    }
}

window.PopupGradesFeature = PopupGradesFeature;
