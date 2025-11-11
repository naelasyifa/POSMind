import React, { ReactElement, ReactNode } from 'react'
import './styles.css'

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-posmint min-h-screen text-poswhite">
        <main>{children}</main>
      </body>
    </html>
  )
}
