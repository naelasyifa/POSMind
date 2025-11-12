<<<<<<< HEAD
import {ReactElement} from 'react'
=======
import { ReactElement } from 'react'
>>>>>>> 0659c319be3c6b15675a600a3869328546856bf4
import DaftarBisnisForm from './components/DaftarBisnisForm'

export default async function page(): Promise<ReactElement> {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <DaftarBisnisForm></DaftarBisnisForm>
    </div>
  )
}
