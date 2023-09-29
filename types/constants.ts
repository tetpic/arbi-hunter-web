
export const CONTACTS = {
  instagram: '#',
  facebook: '#',
  vk: '#',
  telegram: '#',
  whatsapp: '#',
  odnoklassniki: '#'
}

export const LINKS = {
  header: {
    all: '/',
    actions: '#',
    sushi: '#',
    pizza: '#',
    burgers: '#',
    fastfood: '#',
    shashlik: '#',
    deserts: '#',
    healthyfood: '#'
  },

  footer: {
    forRestaurants: '#',
    forCouriers: '#',
    forCompanies: '#',
    actions: '#',
    aboutUs: '#'
  }
}

export const APPS = {
  appStore: '#',
  googlePlay: '#'
}


export const CookiesLifeTime: {
  accessToken: number,
  sessionId: number,

} = {
  accessToken: 365 * 3 * 60 * 60 * 24 ,
  sessionId: 365 * 3 * 60 * 60 * 24 ,
}
export const Timers: {

} = {

}

export const LOAD_LIMIT:number|string = process.env.NEXT_PUBLIC_LOAD_LIMIT

export const FILES = process.env.files
