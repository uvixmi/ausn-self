export interface OffSourceProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  setWasDeleted: (arg: boolean) => void
  titleModal: string
  account?: string
  source: string
  typeSource: number
  source_id?: string | null
}
