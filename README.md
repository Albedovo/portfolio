# Xiwen Yan / Echo — Portfolio

Personal portfolio featuring interaction design, physical products, service design, and interactive web experiments.

Website: https://portfolio.xiwenyan.top/ (bio: https://bio.xiwenyan.top/)

## Edit

- `index.html`: page content and bilingual copy
- `style.css`: responsive layout and visual styles
- `app.js`: project content, filters, galleries, and language switching
- `assets/`: portfolio images, award marks, and résumé
- `inn-trovert.html`, `inn-showcase.css`, `inn-showcase.js`: curated bilingual Inn-trovert presentation with composed interface groups and optional enlarged views
- `inn-screens.css`: original interface styles used by the inert screen excerpts
- `inn-trovert-process.html`: full original research boards and clickable prototype, linked from the presentation
- `what-are-you-doing.html`, `trace-showcase.css`: space, time, AR and sensor presentation
- `cityweave.html`, `city-showcase.css`: skill exchange and service-system presentation
- `portfolio-showcase.css`, `portfolio-showcase.js`: shared device rendering, bilingual text and enlarged interface views
- `trace-screens.css`, `city-screens.css`: original interface styles
- `what-are-you-doing-process.html`, `cityweave-process.html`: preserved full prototypes and folded original research boards

## Preview locally

```sh
python3 -m http.server 4173
```

Visit http://localhost:4173/portfolio/ only when this folder is served beneath that prefix; otherwise open http://localhost:4173/.

## Deploy

GitHub Pages publishes the `main` branch from `/ (root)`. Changes pushed to `main` automatically update the site. `.nojekyll` serves the site as static HTML.

## Presentation design

`editorial-v4.css` owns the current presentation layout. Project interfaces retain their original styles and enlarge to a full view. `assets/editorial/` contains scalable concept illustrations and a native-resolution crop of Inn-trovert interfaces. Illustrations describe the design concept and are labelled as illustrative; they do not represent measured research results.
