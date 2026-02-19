import { useState, useCallback } from 'react'

interface Module {
  price: number
  duration: number
}

const modules: Record<string, Module> = {
  kasir: { price: 2000000, duration: 2 },
  inventory: { price: 3000000, duration: 3 },
  laporan: { price: 1500000, duration: 1 },
  auth: { price: 1000000, duration: 1 },
  sms: { price: 500000, duration: 0.5 },
  api: { price: 1500000, duration: 2 },
}

export function useEstimation() {
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const basePrice = 5000000
  const baseDuration = 4

  const toggleModule = useCallback((moduleKey: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleKey)
        ? prev.filter(m => m !== moduleKey)
        : [...prev, moduleKey]
    )
  }, [])

  const calculateTotal = useCallback(() => {
    const totalPrice = selectedModules.reduce(
      (sum, key) => sum + (modules[key]?.price || 0),
      basePrice
    )
    const totalDuration = selectedModules.reduce(
      (sum, key) => sum + (modules[key]?.duration || 0),
      baseDuration
    )

    return {
      totalPrice,
      totalDuration,
      selectedModules,
      moduleDetails: selectedModules.map(key => ({
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        price: modules[key]?.price || 0,
        duration: modules[key]?.duration || 0,
      })),
    }
  }, [selectedModules])

  return {
    selectedModules,
    toggleModule,
    calculateTotal,
  }
}
