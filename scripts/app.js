import { getPortfolioRepos, getPortfolioConfig, getReadme } from "./github.js";
import { renderMarkdown } from "./markdown.js";

const projectsEl = document.querySelector("#projects");
const statusEl = document.querySelector("#status");

const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

dialogClose.addEventListener("click", () => dialog.close());

function createProjectCard(repo, config) {
  const card = document.createElement("article");
  card.className = "card";

  const tags = config.stack
    ?.map((item) => `<span class="tag">${item}</span>`)
    .join("") ?? "";

  card.innerHTML = `
    <h3>${config.title ?? repo.name}</h3>
    <p>${config.summary ?? repo.description ?? "Описание пока не добавлено."}</p>

    <div class="tags">
      ${config.status ? `<span class="tag">${config.status}</span>` : ""}
      ${config.category ? `<span class="tag">${config.category}</span>` : ""}
      ${tags}
    </div>

    <div class="card__actions">
      <button class="button" data-action="readme">Подробнее</button>
      <a class="button button--ghost" href="${repo.html_url}" target="_blank">GitHub</a>
    </div>
  `;

  card.querySelector("[data-action='readme']").addEventListener("click", async () => {
    dialogTitle.textContent = config.title ?? repo.name;
    dialogContent.innerHTML = "<p>Загружаю README...</p>";
    dialog.showModal();

    try {
      const readme = await getReadme(repo);
      dialogContent.innerHTML = renderMarkdown(readme, repo);
    } catch {
      dialogContent.innerHTML = "<p>README не найден или не удалось загрузить.</p>";
    }
  });

  return card;
}

async function init() {
  try {
    const repos = await getPortfolioRepos();

    if (repos.length === 0) {
      statusEl.textContent = "Пока нет репозиториев с topic portfolio.";
      return;
    }

    const projects = [];

    for (const repo of repos) {
      try {
        const config = await getPortfolioConfig(repo);
        projects.push({ repo, config });
      } catch {
        console.warn(`No .portfolio.json for ${repo.full_name}`);
      }
    }

    projects.sort((a, b) => {
      return (a.config.priority ?? 999) - (b.config.priority ?? 999);
    });

    projectsEl.innerHTML = "";
    projects.forEach(({ repo, config }) => {
      projectsEl.append(createProjectCard(repo, config));
    });

    statusEl.textContent = "";
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Не удалось загрузить проекты.";
  }
}

init();
