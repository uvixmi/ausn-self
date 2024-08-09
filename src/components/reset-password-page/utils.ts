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

export const validateEmail = (email: string) => {
  const emailRegex: RegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  if (!emailRegex.test(email)) {
    return true
  }

  return false
}
