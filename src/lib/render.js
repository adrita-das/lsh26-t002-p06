function formatNumber(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function directionColor(direction) {
  if (direction === 'up') return 'text-emerald-600'
  if (direction === 'down') return 'text-rose-600'
  return 'text-slate-400'
}

function directionArrow(direction) {
  if (direction === 'up') return '▲'
  if (direction === 'down') return '▼'
  return '—'
}

function renderMeasureRow(m, topMoverNames) {
  const pctText = m.percentChange === null ? 'N/A' : `${Math.abs(m.percentChange).toFixed(1)}%`
  const isTop = topMoverNames.includes(m.measure)

  return `
    <div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 ${isTop ? 'bg-amber-50 -mx-2 px-2 rounded' : ''}">
      <span class="text-sm ${isTop ? 'font-semibold text-slate-900' : 'text-slate-600'}">${m.measure}${isTop ? ' ★' : ''}</span>
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-slate-900">${formatNumber(m.current)}</span>
        <span class="text-xs font-medium ${directionColor(m.direction)} w-16 text-right">
          ${directionArrow(m.direction)} ${pctText}
        </span>
      </div>
    </div>
  `
}

export function renderClientCard(client) {
  const hasAlert = client.alertsTriggered.length > 0
  const topMoverNames = client.topMovers.map(m => m.measure)

  return `
    <div class="bg-white rounded-xl shadow-sm border ${hasAlert ? 'border-rose-300' : 'border-slate-200'} p-5 flex flex-col gap-4">
      <div class="flex items-start justify-between">
        <h3 class="text-lg font-semibold text-slate-900">${client.name}</h3>
        ${hasAlert ? `<span class="text-xs font-medium bg-rose-100 text-rose-700 px-2 py-1 rounded-full">⚠ Alert</span>` : ''}
      </div>
      <p class="text-sm text-slate-600 leading-relaxed">${client.summary}</p>
      <div class="flex flex-col">
        ${client.measures.map(m => renderMeasureRow(m, topMoverNames)).join('')}
      </div>
      ${hasAlert ? `
        <div class="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">
          ${client.alertsTriggered.map(a => `${a.measure} is ${a.direction} ${a.level} (currently ${formatNumber(a.currentVal)})`).join('; ')}
        </div>
      ` : ''}
    </div>
  `
}

export function renderAlertControl(measureNames, current) {
  const options = measureNames.map(name =>
    `<option value="${name}" ${name === current.measure ? 'selected' : ''}>${name}</option>`
  ).join('')

  return `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 flex flex-wrap items-end gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-slate-500">Measure</label>
        <select id="alert-measure" class="border border-slate-300 rounded-lg px-3 py-2 text-sm">${options}</select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-slate-500">Direction</label>
        <select id="alert-direction" class="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="below" ${current.direction === 'below' ? 'selected' : ''}>Below</option>
          <option value="above" ${current.direction === 'above' ? 'selected' : ''}>Above</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-slate-500">Level</label>
        <input id="alert-level" type="number" step="0.01" value="${current.level}" class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-32" />
      </div>
      <button id="alert-apply" class="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700">Apply Alert</button>
    </div>
  `
}