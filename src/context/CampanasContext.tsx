'use client'
// src/context/CampanasContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { CampanaConfig } from '@/types'

interface CampanasCtx {
  campanas: CampanaConfig[]
  labelOf: (codigo: string) => string
  reload: () => void
}

const CampanasContext = createContext<CampanasCtx>({
  campanas: [],
  labelOf: (c) => c,
  reload: () => {},
})

export function CampanasProvider({ children }: { children: ReactNode }) {
  const [campanas, setCampanas] = useState<CampanaConfig[]>([])

  function load() {
    fetch('/api/campanas')
      .then(r => r.json())
      .then(d => { if (d.data) setCampanas(d.data) })
      .catch(() => {})
  }

  useEffect(() => { load() }, [])

  function labelOf(codigo: string): string {
    return campanas.find(c => c.codigo === codigo)?.nombre ?? codigo
  }

  return (
    <CampanasContext.Provider value={{ campanas, labelOf, reload: load }}>
      {children}
    </CampanasContext.Provider>
  )
}

export function useCampanas() {
  return useContext(CampanasContext)
}
