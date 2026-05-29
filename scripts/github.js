const USERNAME = "MihailPy";
const PORTFOLIO_TOPIC = "portfolio";

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
  const repos = await requestJson(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
  );

  return repos.filter((repo) => repo.topics?.includes(PORTFOLIO_TOPIC));
}

export async function getPortfolioConfig(repo) {
  const url = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/.portfolio.json`;
  return requestJson(url);
}

export async function getReadme(repo) {
  const url = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`;
  return requestText(url);
}
