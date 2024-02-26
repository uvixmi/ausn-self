export const getSourceText = (
  sourceName: string,
  accountNumber?: string | null
) => {
  const last4Digits = accountNumber
    ? `${sourceName} *${accountNumber.slice(-4)}`
    : sourceName
  return last4Digits
}
