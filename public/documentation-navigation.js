(() => {
  'use strict'
  const narrow = window.matchMedia('(max-width: 1280px)')
  const browse = document.querySelector('.rui-browse')
  const setBrowseMode = () => {
    if (!browse) return
    if (narrow.matches && browse.contains(document.activeElement) && document.activeElement !== browse.querySelector('summary')) {
      browse.querySelector('summary')?.focus()
    }
    browse.open = !narrow.matches
  }
  setBrowseMode()
  narrow.addEventListener('change', setBrowseMode)
  const shortcut = document.querySelector('.header .searchbox kbd')
  if (shortcut && /Mac|iPhone|iPad/.test(navigator.platform)) shortcut.textContent = '⌘ K'
  const header = document.querySelector('.header')
  const setHeaderOffset = () => {
    if (header) document.documentElement.style.setProperty('--rui-doc-offset', `${Math.ceil(header.getBoundingClientRect().height) + 12}px`)
  }
  setHeaderOffset()
  if (header && 'ResizeObserver' in window) new ResizeObserver(setHeaderOffset).observe(header)

  // Only measured documentation overflow enters the tab order; specimens keep their own contract.
  const specimenScope = '.example,.stage,.specimen,.example-grid,.archetype-app,[data-primary-specimen]'
  const tableScrollers = [...document.querySelectorAll('.main table.spec,.main .rui-table-wrap')]
    .filter(element => !element.closest(specimenScope))
  const managedScrollAttributes = new Map()
  function updateTableScrollFocus() {
    for (const element of tableScrollers) {
      const overflow = getComputedStyle(element).overflowX
      const scrolls = ['auto', 'scroll'].includes(overflow) && element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1
      if (scrolls && !element.hasAttribute('tabindex')) {
        const attributes = {tabindex: '0', 'data-rui-doc-scroll': ''}
        const table = element.matches('table') ? element : element.querySelector('table')
        const caption = table?.caption?.textContent.trim()
        const heading = element.closest('section')?.querySelector('h2,h3')?.textContent.trim()
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          if (element.matches('.rui-table-wrap') && !element.hasAttribute('role')) {
            attributes.role = 'region'
            attributes['aria-label'] = caption || heading || 'Reference table'
          } else if (element.matches('table') && !caption) {
            attributes['aria-label'] = heading || 'Reference table'
          }
        }
        for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
        managedScrollAttributes.set(element, attributes)
      } else if (!scrolls && managedScrollAttributes.has(element)) {
        for (const [name, value] of Object.entries(managedScrollAttributes.get(element))) {
          if (element.getAttribute(name) === value) element.removeAttribute(name)
        }
        managedScrollAttributes.delete(element)
      }
    }
  }
  updateTableScrollFocus()
  if ('ResizeObserver' in window) {
    const tableResizeObserver = new ResizeObserver(updateTableScrollFocus)
    for (const element of tableScrollers) tableResizeObserver.observe(element)
  } else {
    window.addEventListener('resize', updateTableScrollFocus)
  }
  document.fonts?.ready.then(updateTableScrollFocus)

  const query = document.querySelector('[data-rui-catalog-query]')
  const category = document.querySelector('[data-rui-catalog-category]')
  const items = [...document.querySelectorAll('.rui-catalog-item')]
  function filterCatalog() {
    if (!query || !category) return
    const terms = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
    let visible = 0
    for (const item of items) {
      const text = item.dataset.search.toLocaleLowerCase()
      item.hidden = Boolean(category.value && category.value !== item.dataset.category) || !terms.every(term => text.includes(term))
      if (!item.hidden) visible += 1
    }
    document.querySelector('[data-rui-catalog-count]').textContent = `${visible} of ${items.length} documented component pages`
    document.querySelector('[data-rui-catalog-empty]').hidden = visible !== 0
  }
  query?.addEventListener('input', filterCatalog)
  category?.addEventListener('change', filterCatalog)

  const outlines = [...document.querySelectorAll('.toc a[href^="#"], .rui-mobile-toc a[href^="#"]')]
  const entries = [...new Map(outlines.map(link => {
    const id = decodeURIComponent(link.hash.slice(1))
    return [id, {id, target: document.getElementById(id)}]
  })).values()].filter(entry => entry.target)
  let scheduled = false
  function updateOutline() {
    scheduled = false
    const offset = (header?.getBoundingClientRect().height || 0) + 36
    let current = entries[0]?.id
    for (const entry of entries) {
      if (entry.target.getBoundingClientRect().top <= offset) current = entry.id
    }
    for (const link of outlines) {
      if (decodeURIComponent(link.hash.slice(1)) === current) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateOutline) }
  }, {passive: true})
  window.addEventListener('resize', updateOutline)
  updateOutline()
  for (const link of outlines) {
    link.addEventListener('click', () => {
      const section = document.getElementById(decodeURIComponent(link.hash.slice(1)))
      const target = section?.querySelector('h2') || section
      if (!target) return
      requestAnimationFrame(() => {
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1')
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true})
        }
        target.focus({preventScroll: true})
      })
    })
  }
})()
