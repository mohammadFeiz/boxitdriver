import { WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';
const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_AUTORITY as string,
  client_id: import.meta.env.VITE_CLIENT_ID as string,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI as string,
  client_secret: import.meta.env.VITE_CLIENT_SECRET as string,
  scope: 'profile',
  disablePKCE: true,
  userStore:
    typeof window !== 'undefined'
      ? new WebStorageStateStore({ store: window.localStorage })
      : undefined,
  client_authentication: 'client_secret_basic',
  loadUserInfo: true,
  automaticSilentRenew: true,
  monitorSession: false,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, '/')
  },
}

export default oidcConfig