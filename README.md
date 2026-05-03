# Changelog: `1.0` -> 1.1

Дата: `2026-05-03`

Сравнение выполнено между:

- Старая версия: `GG---God-game-interneturok-VibeCode-1.0/`
- Текущая версия: корень проекта `./`

## Added

- Добавлен `service-worker.js` для регистрации usage ping и обновления счетчика запусков.
- Добавлены новые вкладки popup: `Ответы` и `Профиль` (было 3 вкладки, стало 5).
- Добавлен профиль (`Я`/`Тесты`) с сохранением данных, поиском тестов и сводкой.
- Добавлены функции для тестов: подсветка на странице, копирование списка, экспорт `.txt`, импорт `.txt`, удаление записей.
- Добавлена подсветка ответов по тексту модели в отдельной вкладке.
- Добавлены настройки разработчика и логов, пользовательский промт, автопромт.
- Добавлен расширенный UI-слой: каталог тем, режимы интерфейса, режимы отображения списка тестов, выбор цвета подсветки.
- Добавлен индикатор версии (с проверкой актуальности через GitHub) и индикатор ping в шапке.

## Changed

- `popup.js` из монолита стал загрузчиком контроллера.
- `content.js` из монолита стал загрузчиком контроллера.
- Основная логика вынесена в feature-модули: `popup/controllers/features/` (`12` файлов) и `content/controllers/features/` (`7` файлов).
- Обновлен `manifest.json`:
- `version`: `1.0` -> 1.1
- Добавлены permissions: `unlimitedStorage`, `tabs`, `webNavigation`.
- Добавлены `background.service_worker`, `host_permissions`, `optional_host_permissions`.
- `content_scripts` изменены с одного `content.js` на цепочку модулей + `content.js`, включены `all_frames` и `match_about_blank`.

## Removed

- Убрана старая аудио-функция в popup (`playAudioBtn`, `audioStatus`).
- Убраны фиксированные кнопки тем `themeLightBtn` и `themeDarkBtn` (заменены на динамический список тем).
- `README.md` из старой сборки отсутствует в текущем корне версии.

## Unchanged

- `injected.js` не изменился (хеш одинаковый).
- Иконки `1.png`, `2.png`, `3.png`, `4.png` не изменились (хеши одинаковые).

## Technical Summary

- `popup.js`: `1094` строк -> `148` строк.
- `content.js`: `1098` строк -> `13` строк.
- `popup.html`: `762` строки -> `292` строки.
- По функционалу контент-скрипта добавлено `7` новых message-action:
- `pingSite`
- `highlightAnswersOnPage`
- `clearHighlightedAnswersOnPage`
- `highlightFoundTests`
- `clearFoundTestsHighlight`
- `findJournalTests`
- `getInternetUrokProfileInfo`
