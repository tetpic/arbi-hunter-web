import { runtimeConfig } from 'config/runtimeConfig'


export enum AppMetricaEvent {
  StartRegistration ='startRegistration',
  FinishRegistration ='finishRegistration',
  OpenListSearch ='openListSearch',
  OpenTinderSearch ='openTinderSearch',
  CreateCv ='createCv',
  CreateVacancy ='createVacancy',
  GoToStore ='goToStore',
  GoToReplenishment ='goToReplenishment',
  CreateManager ='createManager',
  CreateCharacter ='createCharacter',
  AddToSaved ='addToSaved',
  RemoveFromSaved ='removeFromSaved'
}

export function sendToMetrika(data: AppMetricaEvent) {
  const yaId = runtimeConfig.YA_METRIKA_ID
  debugger
  // @ts-ignore
  console.log(ym)
  
  // @ts-ignore
  ym(yaId, 'reachGoal', data)
  // @ts-ignore
  // gtag('event', data)
}