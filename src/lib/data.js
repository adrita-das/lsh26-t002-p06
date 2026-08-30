// src/lib/data.js
import rawData from '../../P06_client_digest_public.json'

// The JSON holds an array of test cases — we work with PUB-01 for now
export function getCase(caseId = 'PUB-01') {
  const found = rawData.cases.find(c => c.case_id === caseId)
  if (!found) throw new Error(`Case ${caseId} not found`)
  return found
}