export interface AddSourceModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  setAddOperation: (arg: boolean) => void
  completedSource: number | null
  setCompletedSource: (arg: number | null) => void
  failedBankBik: string | null
  failedSubName: string | null
  fetchSourcesHand: () => Promise<void>
  setMarketplaceOperation: (arg: boolean) => void
}
export interface ErrorResponse {
  error: {
    detail: {
      message: string
      status: number
    }
  }
}
