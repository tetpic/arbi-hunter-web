import { ProfileType } from 'data/interfaces/IRegistration'
import { IUserProfile } from 'data/interfaces/IUser'
import Formatter from './formatter'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { TranslateCompensationType, TranslateCurrency } from './enumsTranslations'
import { CompensationType, Preset } from 'types/enums'
import ImageHelper from './ImageHelper'
import { Translate } from 'next-translate'

export const getUserImageSource = (userProfile: IUserProfile, preset?: Preset): string|null => {
  switch(userProfile?.profileType) {
    case ProfileType.Employee:
      if(userProfile.useOwnLogo && userProfile.logo){
        return ImageHelper.urlFromFile(userProfile.logo, preset||Preset.xsResize)
      }
      else if(!userProfile.useOwnLogo && userProfile?.image){
        return ImageHelper.urlFromFile(userProfile?.image, preset||Preset.xsResize)
      }
      else {
        return null
      }
    case ProfileType.Hirer:
      if(userProfile.logo){
        return ImageHelper.urlFromFile(userProfile.logo, Preset.xsResize)
      }
      else {
        return null
      }
    default:
      return null
  }
}

export const shareData = async(data: ShareData) => { 
  try{
    await navigator.share(data)
  }
  catch( err) {
    // eslint-disable-next-line no-console
    console.warn(err)
  }
}

export const clearObject = <T>(obj: T, type?: 'string' | 'array') => {
  const clearedQuery: {[key: string]: any} = {...obj}
  if(type === 'string') {
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(!Boolean(value) || (typeof value === 'string' && value.trim().length === 0)) delete clearedQuery[key]
    })
    
  }
  else{    
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(value===null
      ||value===undefined
      ||value===0
      ||(Array.isArray(value) && value.length === 0)  
      ||(typeof value === 'string' && value.trim().length === 0)
      // ||Object.keys(value).length === 0
      // ||Object.values(value).filter(Boolean).length === 0
      ) delete clearedQuery[key]
    })
  }

  return clearedQuery as T
}

export const getAge = (age: number): string => {
  if(!age) {
    return null
  }
  return age + ' ' + Formatter.pluralize(age, 'год', 'года', 'лет')
}

export const getSalary = (data: {cv?: ICV, vacancy?: IVacancy}, t?: Translate):string|null => {
  const salary = data.cv&&(Formatter.formatNumber(Number(data.cv?.salary)) + ' ' + TranslateCurrency(data.cv?.currency))
  ||data.vacancy&&
    [
      data.vacancy?.salaryMin&&('от '+ Formatter.formatNumber(data.vacancy?.salaryMin) + TranslateCurrency(data.vacancy?.currency)), 
      data.vacancy?.salaryMax&&('до '+Formatter.formatNumber(data.vacancy?.salaryMax) + TranslateCurrency(data.vacancy?.currency))
    ].filter(Boolean).join(' ')
  const compensation = data.vacancy?.compensation||data.cv?.compensation

  

  if((!Boolean(salary?.trim()) && compensation === CompensationType.Salary)) {
    return null
  }

  switch(compensation) {
    case CompensationType.Contract:
      return TranslateCompensationType(compensation, t)
    case CompensationType.Salary:
      return salary
    default: 
      return salary
  }
}

export const getUserName = (profile: IUserProfile):string => {
  return [profile?.firstName, profile?.patronymic, profile?.lastName].filter(Boolean).join(' ')
}

export function copyToClipboard(text: string):boolean {
  //  если поддерживается navigator.clipboard
  if(navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return true
  }
  else {
    const isIos = navigator.userAgent.match(/ipad|iphone/i)
    const textarea = document.createElement('textarea')
    // create textarea
    textarea.value = text
    // ios will zoom in on the input if the font-size is < 16px
    textarea.style.fontSize = '20px'
    document.body.appendChild(textarea)

    // select text
    if (isIos) {
      const range = document.createRange()
      range.selectNodeContents(textarea)

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, 999999)
    } else {
      textarea.select()
    }

    // copy selection
    document.execCommand('copy')

    // cleanup
    document.body.removeChild(textarea)
  } 
}

export function daysBetween(startDate: Date, endDate: Date) {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Применяйте корректные объекты Date.')
  }
  
  const diffTime = Math.abs(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
                            Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export function decodeOgg(arrayBuffer: ArrayBuffer, callback?: (blob: Blob) => void) {

  const typedArray: Uint8Array = new Uint8Array(arrayBuffer)
  const decoderWorker = new Worker('./decoderWorker.min.js')
  const wavWorker = new Worker('./waveWorker.min.js')
  const desiredSampleRate = parseInt('16000',10)

  decoderWorker.postMessage({ 
    command:'init',
    decoderSampleRate: desiredSampleRate,
    outputBufferSampleRate: desiredSampleRate
  })

  wavWorker.postMessage({ 
    command:'init',
    wavBitDepth: parseInt('16',10),
    wavSampleRate: desiredSampleRate
  })

  decoderWorker.onmessage = function(e){
    console.log(e)
    // null means decoder is finished
    if (e.data === null) {
      wavWorker.postMessage({ command: 'done' })
    }

    // e.data contains decoded buffers as float32 values
    else {
      wavWorker.postMessage({
        command: 'encode',
        buffers: e.data
      }, e.data.map(function(typedArray: Uint8Array){
        return typedArray.buffer
      }))
    }
  }

  wavWorker.onmessage = function(e) {    
    if (e.data.message === 'page') {
      console.log(e.data)
      var fileName = new Date().toISOString() + '.wav'
      var dataBlob = new Blob( [ e.data.page ], { type: 'audio/wav' } )
      callback?.(dataBlob)
      // setBlob(dataBlob)
      // return dataBlob
      // var url = URL.createObjectURL( dataBlob );
      

      // var audio = document.createElement('audio');
      // audio.controls = true;
      // audio.src = URL.createObjectURL( dataBlob );

      // var link = document.createElement('a');
      // link.href = url;
      // link.download = fileName;
      // link.innerHTML = link.download;

      // var li = document.createElement('li');
      // li.appendChild(link);
      // li.appendChild(audio);

      // recordingslist.appendChild(li);
    }
  }

  decoderWorker.postMessage({
    command: 'decode',
    pages: typedArray
  }, [typedArray.buffer] )
};