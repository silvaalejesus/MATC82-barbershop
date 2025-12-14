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
        // 1. Tenta recuperar o ID salvo no navegador
        const storedUserId = localStorage.getItem("barber-user-id")

        if (storedUserId) {
          // 2. Se tiver ID, busca os dados ATUALIZADOS no backend
          // Nota: Estamos usando a rota que já existe no seu backend
          const user = await fetcher(`/users/me?userId=${storedUserId}`)
          
          if (user) {
            setUser(user)
          }
        }
      } catch (error) {
        console.error("Sessão expirada ou inválida", error)
        // Se der erro (ex: user deletado), limpamos o storage
        localStorage.removeItem("barber-user-id")
      } finally {
        setIsChecked(true)
      }
    }

    restoreSession()
  }, [setUser])

  // Opcional: Mostra nada até verificar a sessão para evitar "piscada" de conteúdo
  // Se preferir que o site carregue logo, remova este if.
  if (!isChecked) {
    return null // ou return <LoadingSpinner />
  }

  return <>{children}</>
}