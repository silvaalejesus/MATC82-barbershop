"use client"

import { useEffect, useState } from "react"
import { useSetAtom } from "jotai"
import { userAtom } from "@/lib/store"
import { fetcher } from "@/lib/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUserId = localStorage.getItem("barber-user-id")

        if (storedUserId) {
          const user = await fetcher(`/users/me?userId=${storedUserId}`)
          
          if (user) {
            setUser(user)
          }
        }
      } catch (error) {
        console.error("Sessão expirada ou inválida", error)
        localStorage.removeItem("barber-user-id")
      } finally {
        setIsChecked(true)
      }
    }

    restoreSession()
  }, [setUser])

  if (!isChecked) {
    return null 
  }

  return <>{children}</>
}