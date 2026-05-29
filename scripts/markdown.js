export function renderMarkdown(markdown, repo) {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const html = marked.parse(markdown);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  wrapper.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:");

    if (isExternal) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      return;
    }

    link.href = `https://github.com/${repo.full_name}/blob/${repo.default_branch}/${href}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  return wrapper.innerHTML;
}
