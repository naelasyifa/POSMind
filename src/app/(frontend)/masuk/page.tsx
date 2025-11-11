import { ReactElement } from 'react'
import MasukForm from './components/MasukForm'

export default async function Page(): Promise<ReactElement> {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <MasukForm />
    </div>
  )
}
