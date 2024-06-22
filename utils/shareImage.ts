let FONT_BUFFER: ArrayBuffer | null
let AH_SHARE_IMAGE_B64: string | null
export const getShareImageBgBase64 = async () => {
  if(AH_SHARE_IMAGE_B64){
    return AH_SHARE_IMAGE_B64
  }
  const response = await fetch( new URL('/public/images/shareImageBg.png', import.meta.url))
  const buffer = await response.arrayBuffer()
  AH_SHARE_IMAGE_B64 =  Buffer.from(buffer).toString('base64')
  return AH_SHARE_IMAGE_B64
}
export const getFont = async () => {
  if(FONT_BUFFER){
    return FONT_BUFFER
  }
  const response = await fetch( new URL('/public/fonts/Montserrat-SemiBold.ttf', import.meta.url))
  const buffer = await response.arrayBuffer()
  FONT_BUFFER= buffer
  return buffer
}
