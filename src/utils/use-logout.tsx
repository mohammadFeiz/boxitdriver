import { useAuth } from 'react-oidc-context'

export default function useLogout() {
  const auth = useAuth()

  function logout() {
    //dispatch(clearUserPermissions())
    window.location.href = import.meta.env.VITE_LOGOUT as string

    auth.removeUser()

    setTimeout(() => {
      window.location.href = import.meta.env.VITE_LOGOUT as string
    }, 200)
  }

  return logout
}
