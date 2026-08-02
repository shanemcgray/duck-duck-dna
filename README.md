# Duck Duck DNA

A tiny 4-page static site (Home, About, Projects, Contact) with a few interactive bits: a mobile nav toggle, a project filter, and a validated contact form. No build step — just HTML, CSS, and vanilla JS.

## Hosting on GitHub Pages

1. Create a new repository on GitHub (public repos get free Pages hosting).
2. Push these files to the repo, keeping the folder structure as-is (`index.html` at the root, `css/`, `js/`).
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick your default branch (e.g. `main`) and `/ (root)` as the folder, then save.
5. GitHub will give you a URL, usually `https://<your-username>.github.io/<repo-name>/`, live within a minute or two.

Any time you push new commits to that branch, the site redeploys automatically.
