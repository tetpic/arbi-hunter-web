import { Preset } from 'types/enums'
import { runtimeConfig } from 'config/runtimeConfig'
import { IFile } from 'data/interfaces/Common'

export default class ImageHelper {
  static urlFromFile(file?: IFile, preset: Preset = Preset.mdResize): string {
    if (!file || !file.source) {
      return ''
    }
    const imageParamsStr = file.type === 'IMAGE'||file.mimeType.includes('image')
      ? `w=${this.getImageSize(preset)}&h=${this.getImageSize(preset)}&mode=${this.needCrop(preset) ? 'crop' : 'resize'}&fpx=${file.focalPoint?.x || '0.5'}&fpy=${file.focalPoint?.y || '0.5'}`
      : ''
    return `${runtimeConfig.HOST}/api/asset/files/${file.source}?${imageParamsStr}`
  }
  static urlFromSource(source: string): string {
    return `${runtimeConfig.HOST}/api/asset/files/${source}`
  }

  static getImageSize(preset: Preset): number {
    switch (preset) {
      case Preset.smallIconCrop:
      case Preset.smallIconResize:
        return 80
      case Preset.iconResize:
      case Preset.iconCrop:
        return 150
      case Preset.xsResize:
      case Preset.xsCrop:
        return 300
      case Preset.sResize:
      case Preset.sCrop:
        return 400
      case Preset.smResize:
      case Preset.smCrop:
        return 600
      case Preset.mdResize:
      case Preset.mdCrop:
        return 800
      case Preset.bannerResize:
      case Preset.bannerCrop:
        return 1000
      case Preset.lgResize:
      case Preset.lgCrop:
        return 1200
      case Preset.xlResize:
      case Preset.xlCrop:
        return 1800
    }
  }

  static needCrop(preset: Preset): boolean {
    return (
      preset === Preset.smallIconCrop
      ||preset === Preset.iconCrop
      ||preset === Preset.xsCrop
      ||preset === Preset.sCrop
      ||preset === Preset.smCrop
      ||preset === Preset.mdCrop
      ||preset === Preset.bannerCrop
      ||preset === Preset.lgCrop
      ||preset === Preset.xlCrop
    )
  }
}
