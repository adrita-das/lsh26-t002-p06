import './tailwind.css'
import { getCase } from './lib/data.js'
import { processBatch, getMeasureNames } from './lib/metrics.js'
import { renderClientCard, renderAlertControl } from './lib/render.js'

const testCase = getCase()
const measureNames = getMeasureNames(testCase)

let currentAlert = { ...testCase.alerts[0] }

const app = document.querySelector('#app')

function render() {
  const batch = processBatch(testCase, [currentAlert])

  app.innerHTML = `
    <div class="max-w-6xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">Client Reporting Digest</h1>
      ${renderAlertControl(measureNames, currentAlert)}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${batch.map(renderClientCard).join('')}
      </div>
    </div>
  `

  document.querySelector('#alert-apply').addEventListener('click', () => {
    currentAlert = {
      measure: document.querySelector('#alert-measure').value,
      direction: document.querySelector('#alert-direction').value,
      level: document.querySelector('#alert-level').value
    }
    render()
  })
}

render()