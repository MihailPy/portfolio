import { getPortfolioRepos, getPortfolioConfig, getReadme } from "./github.js";
import { renderMarkdown } from "./markdown.js";

const projectsEl = document.querySelector("#projects");
const statusEl = document.querySelector("#status");

const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

const filtersEl = document.querySelector("#filters");

let allProjects = [];
let activeFilter = "All";

dialogClose.addEventListener("click", () => {
  dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("is-dialog-open");
});

function createProjectCard(repo, config) {
  const card = document.createElement("article");
  card.className = "card";

  const tags = config.stack
    ?.map((item) => `<span class="tag">${item}</span>`)
    .join("") ?? "";

  const liveUrl = config.demoUrl ?? (
    repo.has_pages ? `https://mihailpy.github.io/${repo.name}/` : null
  );

  const liveButton = liveUrl
    ? `<a class="button" href="${liveUrl}" target="_blank">Live</a>`
    : "";

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
      ${liveButton}
      <a class="button button--ghost" href="${repo.html_url}" target="_blank">GitHub</a>
    </div>
  `;

  card.querySelector("[data-action='readme']").addEventListener("click", async () => {
    dialogTitle.textContent = config.title ?? repo.name;
    dialogContent.innerHTML = "<p>Загружаю README...</p>";
    dialog.showModal();
    document.body.classList.add("is-dialog-open");

    try {
      const readme = await getReadme(repo);
      dialogContent.innerHTML = renderMarkdown(readme, repo);
    } catch {
      dialogContent.innerHTML = "<p>README не найден или не удалось загрузить.</p>";
    }
  });

  return card;
}

function renderProjects(projects) {
  projectsEl.innerHTML = "";

  projects.forEach(({ repo, config }) => {
    projectsEl.append(createProjectCard(repo, config));
  });
}

function renderFilters(projects) {
  const stacks = new Set();

  projects.forEach(({ config }) => {
    config.stack?.forEach((item) => stacks.add(item));
  });

  const filters = ["All", ...Array.from(stacks).sort()];

  filtersEl.innerHTML = filters
    .map((filter) => {
      const activeClass = filter === activeFilter ? "is-active" : "";

      return `
        <button class="filter ${activeClass}" data-filter="${filter}">
          ${filter}
        </button>
      `;
    })
    .join("");

  filtersEl.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      const filteredProjects =
        activeFilter === "All"
          ? allProjects
          : allProjects.filter(({ config }) =>
            config.stack?.includes(activeFilter)
          );

      renderFilters(allProjects);
      renderProjects(filteredProjects);
    });
  });
}

function setStatus(type, message) {
  statusEl.innerHTML = `
    <div class="notice notice--${type}">
      ${message}
    </div>
  `;
}

async function init() {
  try {
    const repos = await getPortfolioRepos();

    if (repos.length === 0) {
      setStatus(
        "empty",
        "<strong>Проекты не найдены.</strong><br>Добавь topic <code>portfolio</code> и файл <code>.portfolio.json</code> в нужные репозитории."
      );
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

    allProjects = projects;
    renderFilters(allProjects);
    renderProjects(allProjects);

    statusEl.innerHTML = "";
  } catch (error) {
    console.error(error);
    setStatus(
      "error",
      "<strong>Не удалось загрузить проекты.</strong><br>Проверь подключение или лимиты GitHub API."
    );
  }
}

init();
