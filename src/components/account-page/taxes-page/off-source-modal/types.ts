export interface OffSourceProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  setWasDeleted: (arg: boolean) => void
  titleModal: string
  account?: string
  source: string
  fetchSourcesHand: () => Promise<void>
  typeSource: number
  source_id?: string | null
}
