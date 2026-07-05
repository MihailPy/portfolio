# Contributing

This repository is a personal portfolio website.

The main way to add a new project is not by editing the portfolio code directly,
but by preparing the target GitHub repository.

## Add a project to the portfolio

1. Add the `portfolio` topic to the repository.
2. Add a `.portfolio.json` file to the repository root.
3. Make sure the repository has a useful `README.md`.
4. Push the changes.

The portfolio website will load the project automatically.

## `.portfolio.json` format

```json
{
  "title": "Project title",
  "status": "ready",
  "category": "CLI tool",
  "priority": 1,
  "stack": ["Python", "pytest"],
  "summary": "Short project description.",
  "highlights": [
    "Main feature",
    "Architecture detail",
    "Testing or deployment detail"
  ],
  "demoUrl": "https://example.com/"
}
