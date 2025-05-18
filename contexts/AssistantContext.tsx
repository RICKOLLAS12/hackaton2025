'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type AssistantContextType = {
  isOpen: boolean
  openAssistant: () => void
  closeAssistant: () => void
  toggleAssistant: () => void
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openAssistant = () => setIsOpen(true)
  const closeAssistant = () => setIsOpen(false)
  const toggleAssistant = () => setIsOpen(prev => !prev)

  return (
    <AssistantContext.Provider value={{ isOpen, openAssistant, closeAssistant, toggleAssistant }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  const context = useContext(AssistantContext)
  if (context === undefined) {
    throw new Error('useAssistant doit être utilisé à l\'intérieur d\'un AssistantProvider')
  }
  return context
}