import fs from 'fs'
import path from 'path'

export default function SalesScript() {
  const html = fs.readFileSync(path.join(process.cwd(), 'sales-script.html'), 'utf-8')
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
