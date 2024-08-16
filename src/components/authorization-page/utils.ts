import { ErrorResponse } from "./types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    obj &&
    obj.error &&
    obj.error.detail &&
    obj.error.detail.message !== undefined
  )
}

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_!%,@$^&*()\-+=]{8,}$/

  return passwordRegex.test(password)
}
