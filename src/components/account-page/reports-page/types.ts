export interface ActionsPageProps {
  setTokenType: (str: string) => void
  setAccessToken: (str: string) => void
  setIsAuth: (log: boolean) => void
  login: (str: string) => void
}
