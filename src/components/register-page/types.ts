import { User } from "../../api/myApi"

export interface RegisterPageProps {
  registrationPage?: number
  currentUser?: User
  setTokenType: (str: string) => void
  setAccessToken: (str: string) => void
  setIsAuth: (log: boolean) => void
  login: (str: string, exp: number) => void
}

export interface ErrorResponse {
  error: {
    detail: {
      message: string
    }
  }
}
