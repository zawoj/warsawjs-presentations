const escapeHTML = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const slideNumber = (id) => String(id).padStart(2, '0')

const notes = (note) => `<aside class="notes">${escapeHTML(note)}</aside>`

const decorations = (id, draft = false) => `
  <div class="blueprint-grid" aria-hidden="true"></div>
  <div class="grid-coordinate" aria-hidden="true">52°13′N / 21°00′E</div>
  <div class="theme-meta"><span>${slideNumber(id)}</span><span>Payload CMS</span></div>
  ${draft ? '<span class="draft-badge">MINI DRAFT</span>' : ''}`

const openSection = (slide, extra = '') => `
<section class="theme-grid ${slide.type}-slide" data-background-color="#e9edef" data-slide-id="${slideNumber(slide.id)}" ${extra}>
  ${decorations(slide.id, slide.draft)}`

const closeSection = (slide) => `${notes(slide.note)}
</section>`

const headline = (slide) => `
  <div class="content-head">
    <p class="kicker">${escapeHTML(slide.kicker)}</p>
    <h1>${escapeHTML(slide.title)}</h1>
  </div>`

const renderTitle = (slide) => `
<section class="title-slide" data-background-color="#e9edef" data-slide-id="01">
  <div class="blueprint-grid" aria-hidden="true"></div>
  <div class="title-coordinate" aria-hidden="true">WARSAW / 2026</div>
  <div class="title-layout">
    <div class="title-copy">
      <p class="speaker-name">Kacper Zawojski <span>/ WarsawJS</span></p>
      <h1>PayloadCMS:<br />Why <span>Figma</span> bought it</h1>
      <p class="title-summary">${escapeHTML(slide.summary)}</p>
    </div>
    <div class="title-visual" aria-label="Payload connects with Figma">
      <div class="visual-axis" aria-hidden="true"></div>
      <div class="brand-node brand-node--payload">
        <span class="brand-node__index">01</span>
        <img class="payload-logo" src="/payload-logo.svg" alt="Payload" />
        <small>CMS framework</small>
      </div>
      <div class="connection" aria-hidden="true"><span></span><i>→</i><span></span></div>
      <div class="brand-node brand-node--figma">
        <span class="figma-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <strong>Figma</strong><small>Design platform</small>
      </div>
    </div>
  </div>
  ${notes(slide.note)}
</section>`

const renderTree = (slide) => {
  const tree = slide.tree
    .map(({ label, payload }) => `<li data-id="tree-${escapeHTML(label)}" class="${payload ? 'file-tree__payload' : ''}">${escapeHTML(label)}</li>`)
    .join('')

  return `${openSection(slide, 'data-auto-animate data-auto-animate-id="project-tree" data-auto-animate-duration="0.7"')}
    <div class="assertion-layout">
      ${headline(slide)}
      <div class="file-tree-panel" data-id="project-tree-panel">
        <div class="window-bar"><span>PROJECT ROOT</span><b>APP ROUTER</b></div>
        <ol class="file-tree">${tree}</ol>
      </div>
    </div>
    ${closeSection(slide)}`
}

const codeWindow = (slide, code) => `
  <div class="grid-window" data-id="code-window-${slide.id}">
    <div class="window-bar"><span>${escapeHTML(slide.file)}</span><b>TYPE-SAFE</b></div>
    <pre data-id="code-block-${slide.id}"><code class="language-typescript" data-trim data-line-numbers>${escapeHTML(code)}</code></pre>
  </div>`

const renderCodeStep = (slide, code, stepIndex) => `${openSection(
  slide,
  `data-auto-animate data-auto-animate-id="${slide.autoAnimate || `code-${slide.id}`}" data-auto-animate-duration="0.7"${stepIndex === 0 ? ' data-auto-animate-restart' : ''}`,
)}
  <div class="slide-grid">
    <div class="copy-column">${headline(slide)}</div>
    <div class="demo-column">${codeWindow(slide, code)}</div>
  </div>
  ${closeSection(slide)}`

const renderCode = (slide) => {
  const steps = slide.codeSteps.map((code, index) => renderCodeStep(slide, code, index))
  return steps.length === 1 ? steps[0] : `<section class="vertical-stack">${steps.join('')}</section>`
}

const imageFrame = (slide) => `
  <figure class="evidence-frame">
    <img src="${escapeHTML(slide.image)}" alt="${escapeHTML(slide.imageAlt)}" />
    ${slide.caption ? `<figcaption>${escapeHTML(slide.caption)}</figcaption>` : ''}
  </figure>`

const renderScreenshot = (slide) => `${openSection(slide)}
  <div class="evidence-layout">
    ${headline(slide)}
    ${imageFrame(slide)}
  </div>
  ${closeSection(slide)}`

const renderSplit = (slide) => `${openSection(slide)}
  <div class="split-layout">
    ${headline(slide)}
    <div class="split-evidence">
      ${codeWindow(slide, slide.code)}
      ${imageFrame(slide)}
    </div>
  </div>
  ${closeSection(slide)}`

const renderDiagram = (slide) => `${openSection(slide)}
  <div class="diagram-layout">
    ${headline(slide)}
    <div class="framework-map">
      <div class="framework-map__core"><img src="/payload-logo.svg" alt="Payload" /><span>Config</span></div>
      ${slide.nodes.map((node, index) => `<div class="framework-map__node" style="--node:${index}"><span>${slideNumber(index + 1)}</span>${escapeHTML(node)}</div>`).join('')}
    </div>
  </div>
  ${closeSection(slide)}`

const renderAI = (slide) => `${openSection(slide)}
  <div class="ai-layout">
    ${headline(slide)}
    <div class="agent-context">
      <div class="agent-context__repo"><span>REPOSITORY CONTEXT</span>${slide.items.map((item) => `<b>${escapeHTML(item)}</b>`).join('')}</div>
      <div class="agent-context__flow"><span>read</span><i>→</i><span>change</span><i>→</i><span>typecheck</span><i>→</i><span>diff</span></div>
    </div>
  </div>
  ${closeSection(slide)}`

const renderFuture = (slide) => `${openSection(slide)}
  <div class="future-layout">
    ${headline(slide)}
    <div class="future-content">
      ${imageFrame(slide)}
      <div class="future-list">${slide.items.map((item, index) => `<span><b>${slideNumber(index + 1)}</b>${escapeHTML(item)}</span>`).join('')}</div>
    </div>
  </div>
  ${closeSection(slide)}`

const renderConclusion = (slide) => `${openSection(slide)}
  <div class="conclusion-layout">
    <p class="kicker">${escapeHTML(slide.kicker)}</p>
    <h1>Payload turns content infrastructure into <span>product code.</span></h1>
    <div class="conclusion-lockup"><img src="/payload-logo.svg" alt="Payload" /><span>×</span><strong>Figma</strong></div>
  </div>
  ${closeSection(slide)}`

const renderStats = (slide) => `${openSection(slide)}
  <div class="stats-layout">
    ${headline(slide)}
    <div class="stat-grid">${slide.stats.map(([value, label]) => `<div><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('')}</div>
  </div>
  ${closeSection(slide)}`

const renderQuiz = (slide) => `${openSection(slide)}
  <div class="quiz-layout">
    ${headline(slide)}
    <ol class="quiz-list">${slide.questions.map((question, index) => `<li class="fragment quiz-question"><span>${slideNumber(index + 1)}</span>${escapeHTML(question)}</li>`).join('')}</ol>
  </div>
  ${closeSection(slide)}`

const renderers = {
  ai: renderAI,
  code: renderCode,
  conclusion: renderConclusion,
  diagram: renderDiagram,
  future: renderFuture,
  quiz: renderQuiz,
  screenshot: renderScreenshot,
  split: renderSplit,
  stats: renderStats,
  title: renderTitle,
  tree: renderTree,
}

export const renderDeck = (slides) =>
  slides.map((slide) => {
    const renderer = renderers[slide.type]
    if (!renderer) throw new Error(`Unknown slide type: ${slide.type}`)
    return renderer(slide)
  }).join('')
