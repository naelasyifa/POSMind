'use client'


import {ReactElement} from 'react'
import DaftarBisnisForm from './components/DaftarBisnisForm'

export default async function page():
Promise<ReactElement> {
  return (
    <div className="h-[calc(100vh-3rem)]">
      <DaftarBisnisForm></DaftarBisnisForm>
    </div>
  )
}