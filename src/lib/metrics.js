export function calculateChange(last, current) {
  const lastNum = parseFloat(last)
  const currentNum = parseFloat(current)
  const diff = currentNum - lastNum

  let percentChange
  if (lastNum === 0) {
    percentChange = currentNum === 0 ? 0 : null
  } else {
    percentChange = (diff / lastNum) * 100
  }

  return {
    last: lastNum,
    current: currentNum,
    diff,
    percentChange,
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  }
}

export function processClient(client) {
  const measures = client.measures.map(m => ({
    measure: m.measure,
    ...calculateChange(m.last, m.current)
  }))

  const rankable = measures.filter(m => m.percentChange !== null)
  const topMovers = [...rankable]
    .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
    .slice(0, 2)

  return { id: client.id, name: client.name, measures, topMovers }
}

export function generateSummary(processedClient) {
  const { name, topMovers } = processedClient
  if (topMovers.length === 0) return `${name} showed no significant measurable change this month.`

  const describeMovement = (m) => {
    const pct = Math.abs(m.percentChange).toFixed(1)
    const verb = m.direction === 'up' ? 'improved' : 'dropped'
    return `${m.measure} ${verb} by ${pct}%`
  }

  const parts = topMovers.map(describeMovement)
  if (parts.length === 1) return `${name}: ${parts[0]}.`
  return `${name} saw ${parts[0]}, while ${parts[1]}.`
}

export function checkAlerts(client, alerts) {
  const triggered = []
  for (const alert of alerts) {
    const measure = client.measures.find(m => m.measure === alert.measure)
    if (!measure) continue

    const currentVal = parseFloat(measure.current)
    const level = parseFloat(alert.level)
    const crossed =
      alert.direction === 'above' ? currentVal > level :
      alert.direction === 'below' ? currentVal < level : false

    if (crossed) {
      triggered.push({ measure: alert.measure, direction: alert.direction, level, currentVal })
    }
  }
  return triggered
}

export function processBatch(testCase, alerts = testCase.alerts) {
  return testCase.clients.map(client => {
    const processed = processClient(client)
    return {
      ...processed,
      summary: generateSummary(processed),
      alertsTriggered: checkAlerts(client, alerts)
    }
  })
}

export function getMeasureNames(testCase) {
  const names = new Set()
  testCase.clients.forEach(c => c.measures.forEach(m => names.add(m.measure)))
  return [...names]
}