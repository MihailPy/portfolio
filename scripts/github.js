const USERNAME = "MihailPy";
const PORTFOLIO_TOPIC = "portfolio";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function getCache(key) {
  const raw = localStorage.getItem(key);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (Date.now() - parsed.createdAt > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function setCache(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify({
      createdAt: Date.now(),
      value,
    })
  );
}

async function requestJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${url}`);
  }

  return response.json();
}

async function requestText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`File request failed: ${response.status} ${url}`);
  }

  return response.text();
}

export async function getPortfolioRepos() {
  const cacheKey = "portfolio:repos";
  const cached = getCache(cacheKey);

  if (cached) return cached;

  const repos = await requestJson(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
  );

  const result = repos.filter((repo) => repo.topics?.includes(PORTFOLIO_TOPIC));
  setCache(cacheKey, result);

  return result;
}

export async function getPortfolioConfig(repo) {
  const cacheKey = `portfolio:config:${repo.full_name}`;
  const cached = getCache(cacheKey);

  if (cached) return cached;

  const url = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/.portfolio.json`;
  const result = await requestJson(url);

  setCache(cacheKey, result);
  return result;
}

export async function getReadme(repo) {
  const cacheKey = `portfolio:readme:${repo.full_name}`;
  const cached = getCache(cacheKey);

  if (cached) return cached;

  const url = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`;
  const result = await requestText(url);

  setCache(cacheKey, result);
  return result;
}
