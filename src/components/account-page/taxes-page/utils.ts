export const getSourceText = (
  sourceName: string,
  accountNumber?: string | null
) => {
  const last4Digits = accountNumber
    ? `${sourceName} *${accountNumber.slice(-4)}`
    : "1234"
  return last4Digits
}
