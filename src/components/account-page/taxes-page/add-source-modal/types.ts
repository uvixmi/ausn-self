export interface AddSourceModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  setAddOperation: (arg: boolean) => void
  completedSource: number | null
  setCompletedSource: (arg: number | null) => void
  fetchSourcesHand: () => Promise<void>
}
export interface ErrorResponse {
  error: {
    detail: {
      message: string
      status: number
    }
  }
}
