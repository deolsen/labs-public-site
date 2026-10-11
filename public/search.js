(() => {
  'use strict'

  const script = document.currentScript
  const root = script ? new URL('.', script.src) : new URL('./', document.baseURI)
  let indexPromise

  function normalizeShell() {
    const style = document.createElement('style')
    style.dataset.ruiShellRuntime = 'v1.3.1'
    style.textContent = `
      .header{grid-template-columns:auto minmax(0,1fr) auto!important}
      .searchbox{justify-self:end!important;width:min(34rem,100%)!important}
      .hdr-actions{justify-self:end!important}
      .layout{max-width:none!important;width:100%!important;margin:0!important}
      .main{min-width:0!important;width:100%!important;max-width:none!important;padding-inline:clamp(1rem,1.8vw,2.2rem)!important}
      .main>section{width:100%!important;max-width:none!important}
      .main>.lede,.main>section>.prose,.main>section>p{max-width:none!important;width:100%!important}
      .main>section>.callout,.main>section>.sectionbox,.main>section>.agent,.main>section>.research-rationale{max-width:none!important;width:100%!important}
      .main>section>.prose>p,.main>section>.prose>ul,.main>section>.prose>ol{max-width:none!important}
      .reading-measure,.longform-prose{max-width:78ch!important;width:auto!important}
      .archetype-note{max-width:none!important}
      .specimen{max-width:none!important}
      .agent-rules{display:block!important;max-width:none!important;width:100%!important;padding-left:1.25rem!important;margin:1rem 0!important}
      .agent-rules li{list-style:disc!important;position:static!important;padding:.16rem 0!important;border:0!important;background:transparent!important}
      .agent-rules li::before{display:none!important;content:none!important}
      .searchbox{cursor:pointer!important}
      .side .nav-parent{position:relative;margin-top:.1rem;padding-left:1.22rem!important;font-weight:700;color:var(--text,#17212b)}
      .side .nav-parent::before{content:"▾";position:absolute;left:.42rem;top:50%;transform:translateY(-52%);font-size:.62rem;line-height:1;color:var(--muted,#5c6a78)}
      .side .nav-parent.nav-parent-active{background:color-mix(in srgb,var(--brand,#7a0019) 5%,transparent);color:var(--brand,#7a0019)}
      .side .nav-subtree{position:relative;margin:.08rem 0 .72rem .95rem;padding:.12rem 0 .12rem 1.05rem;border-left:1px solid var(--rule-strong,#a7b4c0)}
      .side .nav-subtree a{position:relative;margin:.02rem 0;padding:.28rem .46rem!important;border-left:0!important;border-radius:.2rem!important;font-size:.78rem!important;line-height:1.35;color:var(--muted,#5c6a78)}
      .side .nav-subtree a::before{content:"";position:absolute;left:-1.06rem;top:50%;width:.58rem;border-top:1px solid var(--rule-strong,#a7b4c0)}
      .side .nav-subtree a:hover{color:var(--text,#17212b)}
      .side .nav-subtree a.current{background:color-mix(in srgb,var(--brand,#7a0019) 9%,var(--surface,#fff))!important;color:var(--brand,#7a0019)!important;font-weight:700!important;box-shadow:inset 2px 0 var(--brand,#7a0019)}
      .side .nav-subtree a.current::before{border-top-color:var(--brand,#7a0019);border-top-width:2px}
      html[data-theme="dark"] .side .nav-parent.nav-parent-active{background:color-mix(in srgb,var(--accent,#ffcc33) 8%,transparent);color:var(--accent,#ffcc33)}
      html[data-theme="dark"] .side .nav-subtree a.current{background:color-mix(in srgb,var(--accent,#ffcc33) 10%,var(--surface,#151e27))!important;color:var(--accent,#ffcc33)!important;box-shadow:inset 2px 0 var(--accent,#ffcc33)}
      html[data-theme="dark"] .side .nav-subtree a.current::before{border-top-color:var(--accent,#ffcc33)}
      .iconbtn.quiet{border-color:transparent!important;background:transparent!important}
      .iconbtn.quiet:hover,.iconbtn.quiet:focus-visible{border-color:var(--rule-strong,#a7b4c0)!important;background:var(--surface2,#f2f5f7)!important}
      .iconbtn[aria-pressed="true"]{border-color:var(--brand,#7a0019)!important;background:color-mix(in srgb,var(--surface,#fff) 88%,var(--brand,#7a0019) 12%)!important;color:var(--brand,#7a0019)!important}
      .rui-action-cell{width:2.6rem!important;text-align:right!important;vertical-align:middle!important;white-space:nowrap;position:relative}
      .rui-kebab{display:inline-grid;place-items:center;width:1.9rem;height:1.9rem;padding:0;border:1px solid transparent;border-radius:.25rem;background:transparent;color:inherit;font:800 1rem/1 var(--body,system-ui);cursor:default}
      .rui-kebab:hover,.rui-kebab:focus-visible{border-color:var(--rule-strong,#a7b4c0);background:var(--surface2,#f2f5f7);outline:none}
      .rui-menu{--rui-menu-bg:var(--surface,#fff);--rui-menu-text:var(--text,#17212b);--rui-menu-rule:var(--rule,#d3dce4);--rui-menu-danger:var(--danger,#b52b3a);position:relative;display:inline-flex}
      .rui-menu-popover{position:absolute;z-index:30;top:calc(100% + .2rem);right:0;min-width:11rem;padding:.25rem 0;border:1px solid var(--rui-menu-rule);border-radius:.3rem;background:var(--rui-menu-bg);color:var(--rui-menu-text);box-shadow:0 .4rem 1rem rgba(0,0,0,.18);text-align:left}
      .rui-menu-item{display:block;padding:.42rem .62rem;font-size:.72rem;line-height:1.3;white-space:nowrap}
      .rui-menu-item+.rui-menu-item{margin-top:.02rem}.rui-menu-sep{height:1px;background:var(--rui-menu-rule);margin:.22rem 0}.rui-menu-item.danger{color:var(--rui-menu-danger)}
      .acx .rui-menu{--rui-menu-bg:var(--x-surface);--rui-menu-text:var(--x-text);--rui-menu-rule:var(--x-rule);--rui-menu-danger:var(--x-danger)}
      .ae .rui-menu{--rui-menu-bg:var(--a-surface);--rui-menu-text:var(--a-text);--rui-menu-rule:var(--a-rule);--rui-menu-danger:var(--a-danger)}
      .ana .rui-menu{--rui-menu-bg:var(--a-surface);--rui-menu-text:var(--a-text);--rui-menu-rule:var(--a-rule);--rui-menu-danger:var(--a-danger)}
      .pol .rui-menu{--rui-menu-bg:var(--p-surface);--rui-menu-text:var(--p-text);--rui-menu-rule:var(--p-rule);--rui-menu-danger:var(--p-danger)}
      .geo .rui-menu{--rui-menu-bg:var(--g-surface);--rui-menu-text:var(--g-text);--rui-menu-rule:var(--g-rule);--rui-menu-danger:var(--g-danger)}
      .docsys .rui-menu{--rui-menu-bg:var(--d-surface);--rui-menu-text:var(--d-text);--rui-menu-rule:var(--d-rule);--rui-menu-danger:var(--d-danger)}
      .sci .rui-menu{--rui-menu-bg:var(--s-surface);--rui-menu-text:var(--s-text);--rui-menu-rule:var(--s-rule);--rui-menu-danger:var(--s-danger)}
      .acx .rui-kebab:hover,.acx .rui-kebab:focus-visible{background:var(--x-surface2);border-color:var(--x-rule2)}
      .ae .rui-kebab:hover,.ae .rui-kebab:focus-visible,.ana .rui-kebab:hover,.ana .rui-kebab:focus-visible{background:var(--a-surface2);border-color:var(--a-rule2)}
      .pol .rui-kebab:hover,.pol .rui-kebab:focus-visible{background:var(--p-surface2);border-color:var(--p-rule2)}
      .geo .rui-kebab:hover,.geo .rui-kebab:focus-visible{background:var(--g-surface2);border-color:var(--g-rule2)}
      .docsys .rui-kebab:hover,.docsys .rui-kebab:focus-visible{background:var(--d-surface2);border-color:var(--d-rule2)}
      .sci .rui-kebab:hover,.sci .rui-kebab:focus-visible{background:var(--s-surface2);border-color:var(--s-rule2)}
      .rui-search-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(8,15,22,.58);display:grid;place-items:start center;padding:10vh 1rem 1rem}
      .rui-search-dialog{width:min(48rem,100%);max-height:78vh;overflow:hidden;background:var(--surface,#fff);color:var(--text,#17212b);border:1px solid var(--rule-strong,#a7b4c0);border-radius:.55rem;box-shadow:0 1.2rem 4rem rgba(0,0,0,.28);display:grid;grid-template-rows:auto minmax(0,1fr)}
      .rui-search-field{display:flex;gap:.55rem;align-items:center;padding:.75rem;border-bottom:1px solid var(--rule,#d3dce4)}
      .rui-search-field input{width:100%;min-height:2.65rem;padding:.55rem .7rem;border:1px solid var(--rule-strong,#a7b4c0);border-radius:.35rem;background:var(--surface,#fff);color:var(--text,#17212b)}
      .rui-search-results{overflow:auto;padding:.45rem}
      .rui-search-result{display:block;padding:.65rem .7rem;border-radius:.35rem;color:inherit;text-decoration:none}
      .rui-search-result:hover,.rui-search-result[aria-selected="true"]{background:var(--surface2,#f2f5f7)}
      .rui-search-result strong{display:block}
      .rui-search-result span{display:block;margin-top:.12rem;color:var(--muted,#5c6a78);font-size:.78rem}
      .rui-search-state{padding:1rem;color:var(--muted,#5c6a78)}
      html[data-theme="dark"] .rui-search-backdrop{background:rgba(0,0,0,.72)}
      @media(max-width:760px){.searchbox{display:flex!important;width:auto!important;min-width:2.6rem!important}.searchbox span{display:none}.rui-search-backdrop{padding-top:1rem}.rui-search-dialog{max-height:calc(100vh - 2rem)}}
    `
    document.head.append(style)

    document.querySelectorAll('ol.agent-rules').forEach((list) => {
      const replacement = document.createElement('ul')
      for (const attr of list.attributes) replacement.setAttribute(attr.name, attr.value)
      while (list.firstChild) replacement.append(list.firstChild)
      list.replaceWith(replacement)
    })

    const trigger = document.querySelector('.searchbox')
    if (trigger) {
      trigger.setAttribute('role', 'button')
      trigger.setAttribute('tabindex', '0')
      trigger.setAttribute('aria-haspopup', 'dialog')
      trigger.setAttribute('aria-label', 'Search the home lab documentation')
    }
  }

  const sidebarTrees = [
    {
      id: 'design-principles',
      parentHref: 'principles.html',
      label: 'Design principles',
      children: [
        ['principle-task-information.html', 'Task, information, and hierarchy'],
        ['principle-state-consequence.html', 'State, consequence, and recovery'],
        ['principle-accessibility-inclusion.html', 'Accessibility and inclusive interaction'],
        ['principle-research-semantics.html', 'Research and scientific semantics'],
        ['principle-adaptation-reuse.html', 'Adaptation, reuse, and implementation']
      ]
    },
    {
      id: 'layout-archetypes',
      parentHref: 'layouts.html',
      label: 'Layout archetypes',
      children: [
        ['layout-public-discovery.html', 'Public / discovery'],
        ['layout-operational-workspace.html', 'Operational workspace'],
        ['layout-list-detail-inspector.html', 'List-detail + inspector'],
        ['layout-modeling-studio.html', 'Modeling studio'],
        ['layout-scientific-instrument.html', 'Scientific instrument / viewer'],
        ['layout-participant-task.html', 'Focused participant task'],
        ['layout-documentation.html', 'Documentation / knowledge']
      ]
    }
  ]

  function findSidebarParent(side, parentHref) {
    return [...side.querySelectorAll('a[href]')].find((link) => {
      try {
        return new URL(link.getAttribute('href'), root).pathname.endsWith('/' + parentHref)
      } catch {
        return false
      }
    })
  }

  function enhanceSidebarHierarchy(side) {
    if (!side) return
    for (const tree of sidebarTrees) {
      const parent = findSidebarParent(side, tree.parentHref)
      if (!parent) continue
      parent.classList.add('nav-parent')
      parent.dataset.ruiNavTreeParent = tree.id

      let subtree = side.querySelector(`[data-rui-nav-subtree="${tree.id}"]`)
      if (!subtree) {
        subtree = document.createElement('div')
        subtree.dataset.ruiNavSubtree = tree.id
        subtree.dataset.ruiNavParent = tree.parentHref
        subtree.setAttribute('aria-label', tree.label)
        subtree.innerHTML = tree.children.map(([href, label]) =>
          `<a href="${new URL(href, root)}">${label}</a>`
        ).join('')
        parent.insertAdjacentElement('afterend', subtree)
      }
      subtree.classList.add('nav-subtree')
    }
  }

  function markCurrentSidebarLink(side) {
    if (!side) return
    side.querySelectorAll('a.current').forEach((link) => link.classList.remove('current'))
    side.querySelectorAll('[aria-current="page"]').forEach((link) => link.removeAttribute('aria-current'))
    side.querySelectorAll('.nav-parent-active').forEach((link) => link.classList.remove('nav-parent-active'))

    const currentPath = location.pathname.replace(/\/+$/, '')
    let currentLink = null
    for (const link of side.querySelectorAll('a[href]')) {
      const linkPath = new URL(link.getAttribute('href'), root).pathname.replace(/\/+$/, '')
      if (linkPath === currentPath) {
        currentLink = link
        break
      }
    }
    if (!currentLink) return

    currentLink.classList.add('current')
    currentLink.setAttribute('aria-current', 'page')
    const subtree = currentLink.closest('[data-rui-nav-subtree]')
    if (subtree) {
      const parentHref = subtree.dataset.ruiNavParent
      findSidebarParent(side, parentHref)?.classList.add('nav-parent-active')
    }
  }

  async function syncGlobalSidebar() {
    const currentSide = document.querySelector('.side')
    if (!currentSide || currentSide.dataset.ruiNavigation === '2') return

    const groupTitles = [...currentSide.querySelectorAll('.ngt')]
      .map((node) => node.textContent.trim())
    if (!groupTitles.includes('Get started')) return

    try {
      const response = await fetch(new URL('index.html', root))
      if (!response.ok) return
      const source = await response.text()
      const doc = new DOMParser().parseFromString(source, 'text/html')
      const canonicalSide = doc.querySelector('.side')
      if (!canonicalSide) return

      currentSide.innerHTML = canonicalSide.innerHTML
      enhanceSidebarHierarchy(currentSide)
      markCurrentSidebarLink(currentSide)
      preserveNavigationScroll(currentSide)
    } catch {
      // Static documentation remains usable with its embedded sidebar if canonical sync fails.
    }
  }

  function navigationScrollKey(side) {
    const groupTitles = [...side.querySelectorAll('.ngt')].map((node) => node.textContent.trim())
    if (groupTitles.includes('Get started')) return 'rui:nav-scroll:global'
    const firstRootLink = side.querySelector('a[data-rui-root="1"]')?.getAttribute('href')
    if (firstRootLink) return 'rui:nav-scroll:' + location.pathname.split('/').slice(0, -1).join('/')
    return 'rui:nav-scroll:' + location.pathname.split('/').slice(0, -1).join('/')
  }

  function preserveNavigationScroll(side) {
    if (!side || side.dataset.ruiScrollPersistence === 'true') return
    side.dataset.ruiScrollPersistence = 'true'
    const key = navigationScrollKey(side)
    const saved = sessionStorage.getItem(key)
    if (saved !== null) {
      const scrollTop = Number(saved)
      if (Number.isFinite(scrollTop)) requestAnimationFrame(() => { side.scrollTop = scrollTop })
    }

    const save = () => sessionStorage.setItem(key, String(side.scrollTop))
    side.addEventListener('scroll', save, { passive: true })
    side.addEventListener('click', (event) => {
      if (event.target.closest('a[href]')) save()
    })
  }

  function cleanText(value) {
    return value.replace(/\s+/g, ' ').trim()
  }

  async function buildIndex() {
    const response = await fetch(new URL('contracts/documentation-search-index.json', root))
    if (!response.ok) throw new Error('Unable to load the documentation search index; browse by area instead.')
    const data = await response.json()
    if (data.version !== 1 || !Array.isArray(data.pages) || !data.pages.every(page =>
      ['href', 'title', 'summary', 'text'].every(key => typeof page[key] === 'string'))) {
      throw new Error('Invalid documentation search index; browse by area instead.')
    }
    return data.pages
  }

  function search(index, query) {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return index.map(page => {
      const title = page.title.toLocaleLowerCase()
      const aliases = (page.aliases || []).join(' ').toLocaleLowerCase()
      const summary = page.summary.toLocaleLowerCase()
      const text = page.text.toLocaleLowerCase()
      if (!terms.every(term => (title + ' ' + aliases + ' ' + summary + ' ' + text).includes(term))) return {page, score: 0}
      const score = terms.reduce((total, term) => total + (title.includes(term) || aliases.includes(term) ? 12 : summary.includes(term) ? 5 : 1), 0)
      return {page, score}
    }).filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
      .slice(0, 20)
  }

  function openSearch() {
    const existing = document.querySelector('dialog.rui-search-native[open]')
    if (existing) { existing.querySelector('input').focus(); return }
    const invoker = document.activeElement
    const dialog = document.createElement('dialog')
    dialog.className = 'rui-search-native'
    dialog.setAttribute('aria-label', 'Search the home lab documentation')
    dialog.innerHTML = `
      <form class="rui-search-field" method="dialog">
        <label class="rui-search-label" for="rui-doc-query">Search the home lab documentation</label>
        <div class="rui-search-input-row"><input id="rui-doc-query" type="search" autocomplete="off" placeholder="Runbooks, services, architecture, and recovery">
        <button type="button" data-rui-search-close>Close</button></div>
      </form>
      <p class="rui-search-status" role="status" aria-live="polite">Type to search the home lab documentation.</p>
      <div class="rui-search-results"></div>`
    document.body.append(dialog)
    const input = dialog.querySelector('input')
    const results = dialog.querySelector('.rui-search-results')
    const status = dialog.querySelector('.rui-search-status')
    let current = []
    let version = 0
    const close = () => dialog.close()
    dialog.addEventListener('close', () => {
      version += 1
      dialog.remove()
      if (invoker?.isConnected && typeof invoker.focus === 'function') invoker.focus()
    }, {once: true})
    dialog.querySelector('[data-rui-search-close]').addEventListener('click', close)
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect()
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close()
    })
    async function render() {
      const request = ++version
      const query = input.value.trim()
      current = []
      results.replaceChildren()
      if (!query) { status.textContent = 'Type to search the home lab documentation.'; return }
      status.textContent = 'Searching…'
      try {
        const index = await (indexPromise ||= buildIndex())
        if (request !== version || !dialog.open) return
        current = search(index, query)
        status.textContent = current.length ? `${current.length} matching results. Use Tab or Arrow down to browse.` : 'No matching documentation.'
        const list = document.createElement('ul')
        list.className = 'rui-search-result-list'
        for (const {page} of current) {
          const item = document.createElement('li')
          const link = document.createElement('a')
          link.className = 'rui-search-result'
          link.href = new URL(page.href, root)
          const title = document.createElement('strong')
          title.textContent = page.title
          const summary = document.createElement('span')
          summary.textContent = page.summary || page.text.slice(0, 170)
          link.append(title, summary)
          item.append(link)
          list.append(item)
        }
        results.append(list)
      } catch {
        indexPromise = undefined
        if (request === version && dialog.open) status.textContent = 'Search could not be loaded. Browse the home lab documentation areas, or close and retry.'
      }
    }
    input.addEventListener('input', render)
    input.addEventListener('keydown', event => { if (event.key === 'Enter' && event.isComposing) event.preventDefault() })
    dialog.querySelector('form').addEventListener('submit', event => {
      event.preventDefault()
      if (!event.isComposing && current.length) location.href = new URL(current[0].page.href, root)
    })
    dialog.addEventListener('keydown', event => {
      if (event.isComposing) return
      if (event.key === 'Escape') { event.preventDefault(); close(); return }
      const links = [...results.querySelectorAll('a')]
      if (event.key === 'Tab') {
        const focusable = [input, dialog.querySelector('[data-rui-search-close]'), ...links]
        if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus() }
        else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); input.focus() }
        return
      }
      const position = links.indexOf(document.activeElement)
      if (event.key === 'ArrowDown' && document.activeElement === input && links.length) {
        event.preventDefault(); links[0].focus()
      } else if (event.key === 'ArrowDown' && position >= 0 && position < links.length - 1) {
        event.preventDefault(); links[position + 1].focus()
      } else if (event.key === 'ArrowUp' && position >= 0) {
        event.preventDefault(); (position ? links[position - 1] : input).focus()
      }
    })
    dialog.showModal()
    input.focus()
  }

  normalizeShell()
  void syncGlobalSidebar()

  document.querySelector('.searchbox')?.addEventListener('click', openSearch)
  document.querySelector('.searchbox')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openSearch()
    }
  })
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      openSearch()
    }
  })
})()

/* Research UI system-menu fixture loader. */
;(() => {
  const current = document.currentScript
  if (!current?.src || !document.querySelector('link[data-system-command-style]')) return
  if (document.querySelector('script[data-rui-system-menu-fixtures]')) return
  const script = document.createElement('script')
  script.setAttribute('data-rui-system-menu-fixtures', '')
  script.src = new URL('system-menu-fixtures.js', current.src).href
  document.head.append(script)
})()
