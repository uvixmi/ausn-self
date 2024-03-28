export const getSourceText = (
  sourceName: string,
  accountNumber?: string | null,
  shortName?: string | null
) => {
  if (shortName && shortName !== null) {
    const last4Digits = accountNumber
      ? `${shortName} *${accountNumber.slice(-4)}`
      : sourceName
    return last4Digits
  } else {
    const last4Digits = accountNumber
      ? `${sourceName} *${accountNumber.slice(-4)}`
      : sourceName
    return last4Digits
  }
}
