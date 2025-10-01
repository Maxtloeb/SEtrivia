import React from 'react'

type Item = { label: string; loader: () => Promise<unknown> }

const checks: Item[] = [
  { label: '@/layouts/Layout', loader: () => import('@/layouts/Layout') },
  { label: '@/pages/Quiz', loader: () => import('@/pages/Quiz') },
  { label: '@/components/quiz/QuizFilters', loader: () => import('@/components/quiz/QuizFilters') },
  { label: '@/components/quiz/QuestionDisplay', loader: () => import('@/components/quiz/QuestionDisplay') },
  { label: '@/components/quiz/QuizResults', loader: () => import('@/components/quiz/QuizResults') },
  { label: '@/entities/Question', loader: () => import('@/entities/Question') },
  { label: '@/entities/QuizSession', loader: () => import('@/entities/QuizSession') },
  { label: '@/entities/User', loader: () => import('@/entities/User') },
  { label: '@/utils/index', loader: () => import('@/utils') },
]

export default function Debug() {
  const [results, setResults] = React.useState<Record<string, 'ok'|'fail'|'pending'>>(
    Object.fromEntries(checks.map(c => [c.label, 'pending']))
  )

  React.useEffect(() => {
    (async () => {
      for (const c of checks) {
        try {
          await c.loader()
          setResults(r => ({ ...r, [c.label]: 'ok' }))
        } catch {
          setResults(r => ({ ...r, [c.label]: 'fail' }))
        }
      }
    })()
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Project Debug</h1>
      <p style={{ marginBottom: 12 }}>
        Each row tries to import a file. ✅ = found, ❌ = missing/wrong path.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Module</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map(c => (
            <tr key={c.label}>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{c.label}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                {results[c.label] === 'pending' && '…'}
                {results[c.label] === 'ok' && '✅'}
                {results[c.label] === 'fail' && '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
