# Developer Portfolio

English | Русский

---

# English

Personal developer portfolio built as a static website and deployed with GitHub Pages.

## What it does

The website automatically loads selected public GitHub repositories and displays them as portfolio projects.

A repository appears on the website if:

- it has the portfolio topic;
- it contains a .portfolio.json file.

Project details are loaded from the repository README.md.

## Features

- Static website without a backend
- GitHub API integration
- Automatic project discovery by repository topic
- Project cards from .portfolio.json
- README rendering in a modal window
- Dark minimal developer-focused design

## Project config example

json {   "title": "Sun Set",   "status": "in-development",   "category": "Desktop app",   "priority": 1,   "stack": ["Python", "PyQt6", "astral", "pytest"],   "summary": "Desktop application for calculating, editing and exporting sunset schedules by city." }

## Local run

bash python3 -m http.server 8000

Then open:

text <http://localhost:8000>

## Deployment

The site is deployed with GitHub Pages.

text <https://mihailpy.github.io/portfolio/>

## License

MIT

---

# Русский

Персональное портфолио разработчика в виде статического сайта, размещённого на GitHub Pages.

## Что делает проект

Сайт автоматически загружает выбранные публичные репозитории GitHub и отображает их как проекты портфолио.

Репозиторий попадает на сайт, если:

- у него есть topic portfolio;
- в корне присутствует файл .portfolio.json.

Подробное описание проекта загружается из файла README.md.

## Возможности

- Статический сайт без бэкенда
- Интеграция с GitHub API
- Автоматический поиск проектов по topic
- Карточки проектов на основе .portfolio.json
- Отображение README в модальном окне
- Минималистичный тёмный интерфейс

## Пример конфигурации проекта

json {   "title": "Sun Set",   "status": "in-development",   "category": "Desktop app",   "priority": 1,   "stack": ["Python", "PyQt6", "astral", "pytest"],   "summary": "Desktop-приложение для расчёта, редактирования и экспорта расписания закатов по городам." }

## Локальный запуск

bash python3 -m http.server 8000

После запуска откройте:

text <http://localhost:8000>

## Деплой

Сайт публикуется через GitHub Pages.

text <https://mihailpy.github.io/portfolio/>

## Лицензия

MIT
