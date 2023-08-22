
export interface ProductModalArguments{

}
export interface AddressModalArguments{

}
export interface IndexFilterModalArguments{

}
export interface ConfirmModalArguments {
  onConfirm: () => Promise<void>
  onCancel?: () => void
  text?: string
  confirm?: string,
  cancel?: string
}
