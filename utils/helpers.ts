import { ProfileType } from 'data/interfaces/IRegistration'
import { IUserProfile } from 'data/interfaces/IUser'
import { FILES } from 'types/constants'

export const getUserImageSource = (userProfile: IUserProfile): string|null => {
  switch(userProfile?.profileType) {
    case ProfileType.Employee:
      if(userProfile.useOwnLogo && userProfile.logo){
        return FILES + userProfile.logo.source
      }
      else if(!userProfile.useOwnLogo && userProfile?.image){
        return FILES + userProfile?.image?.source
      }
      else {
        return null
      }
    case ProfileType.Hirer:
      if(userProfile.logo){
        return FILES + userProfile.logo.source
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

export const clearObject = (obj: any, type?: 'string' | 'array') => {
  const clearedQuery: {[key: string]: any} = {...obj}
  if(type === 'string') {
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(!Boolean(value) || (typeof value === 'string' && value.trim().length === 0)) delete clearedQuery[key]
    })
    
  }
  else{    
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(!Boolean(value)
      ||value===0
      ||(Array.isArray(value) && value.length === 0)  
      ||(typeof value === 'string' && value.trim().length === 0)
      // ||Object.keys(value).length === 0
      // ||Object.values(value).filter(Boolean).length === 0
      ) delete clearedQuery[key]
    })
  }

  return clearedQuery
}