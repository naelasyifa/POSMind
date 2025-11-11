import { ReactElement } from 'react'
import DaftarForm from './components/DaftarForm'

export default async function page(): Promise<ReactElement> {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <DaftarForm></DaftarForm>
    </div>
  )
}
