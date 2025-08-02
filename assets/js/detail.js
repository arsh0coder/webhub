// Get folder name from query params
const urlParams = new URLSearchParams(window.location.search);
const folder = urlParams.get("id") || urlParams.get("folder");

const details = {
  container: document.getElementById("templateContainer"),
  name: document.getElementById("templateName"),
  desc: document.getElementById("templateDescription"),
  tags: document.getElementById("tags"),
  image: document.getElementById("previewImage"),
  meta: document.getElementById("metaInfo"),
  tech: document.getElementById("techStack"),
  live: document.getElementById("liveLink"),
  source: document.getElementById("sourceLink"),
};

if (!folder) {
  details.container.innerHTML = `<p class="p-6 text-red-600 font-bold">Invalid template folder.</p>`;
  throw new Error("Missing folder parameter.");
}

fetch(`../templates/${folder}/templates.json`)
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch templates.json");
    }
    return res.json();
  })
  .then(data => {
    const template = data.templates.find(t => t.folder === folder);
    if (!template) {
      details.container.innerHTML = `<p class="p-6 text-red-600 font-bold">Template not found.</p>`;
      return;
    }

    // Fill in details
    details.name.textContent = template.name;
    details.desc.textContent = template.description;
    details.image.src = template.previewImage;

    details.tags.innerHTML = template.tags.map(tag =>
      `<span class="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white px-3 py-1 rounded-full">${tag}</span>`
    ).join(" ");

    details.meta.innerHTML = `
      <strong>Author:</strong> ${template.author} ·
      <strong>License:</strong> ${template.license} ·
      <strong>Category:</strong> ${template.category} ·
      <strong>Difficulty:</strong> ${template.difficulty} ·
      <strong>Created:</strong> ${template.created}
    `;

    details.tech.innerHTML = `<strong>Tech Stack:</strong> ${template.techStack.join(", ")}`;

    details.live.href = template.liveUrl || "#";
    details.source.href = template.sourceUrl || "#";
  })
  .catch(err => {
    console.error(err);
    details.container.innerHTML = `<p class="p-6 text-red-600 font-bold">Error loading template details.</p>`;
  });
