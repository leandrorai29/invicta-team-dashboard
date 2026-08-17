import fs from 'fs'
import path from 'path'

export default function Dashboard() {
  const html = fs.readFileSync(
    path.join(process.cwd(), 'dashboard-mejorado.html'),
    'utf-8'
  )
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
