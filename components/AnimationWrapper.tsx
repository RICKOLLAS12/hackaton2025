'use client'

import { LazyMotion, domAnimation, m } from "framer-motion"

export default function AnimationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}