import {formatRelative} from 'date-fns'
import {ru} from 'date-fns/locale'

const PNF = require('google-libphonenumber').PhoneNumberFormat
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

const pluralizeNative = require('numeralize-ru').pluralize

export default class Formatter {
  static pluralize(number: number, word1: string, word2: string, word3: string) {
    return pluralizeNative(number, word1, word2, word3)
  }

  static cleanPhone(phone: string) {
    if (phone) {
      let phoneCleaned = `${phone}`.replace(/[^\+0-9]/g, '')
      if (!phoneCleaned.startsWith('+')) {
        phoneCleaned = '+' + phoneCleaned
      }
      return phoneCleaned
    }
    return phone
  }

  static formatDateRelative(date: string | Date) {
    const formatRelativeLocale: { [key: string]: string } = {
      'yesterday': 'Вчера в HH:mm',
      'today': ' в HH:mm',
      'tomorrow': 'Завтра в HH:mm',
      'other': 'dd.MM.yyyy HH:mm', // Difference: Add time to the date
    }

    const locale = {
      ...ru,
      formatRelative: (token: string) =>
        formatRelativeLocale[token] || formatRelativeLocale['other'],
    }
    if (!date) {
      return ''
    }
    return formatRelative(typeof date === 'string' ? new Date(date) : date, new Date(), {locale})
  }

  static formatPhone(phone: string) {
    try {
      const number = phoneUtil.parseAndKeepRawInput(this.cleanPhone(`${phone}`), 'RU')
      return phoneUtil.format(number, PNF.INTERNATIONAL)
    } catch (e) {
      return phone
    }
  }


  /** get formatted phone number +7 999 999 99 99, return +7 999 ***-**-99 */
  static hideSomePhoneNumbers(phone: string) {
    let phoneResult = phone.split('').map((e, index)=> {
      return (index > 6 && index < 10)||(index > 10 && index < 13) ? '*': e
    })
    return phoneResult.join('')
  }

  static pad(pad: string, str: string, padLeft = true) {
    if (typeof str === 'undefined')
      return pad
    if (padLeft) {
      return (pad + str).slice(-pad.length)
    } else {
      return (str + pad).substring(0, pad.length)
    }
  }

  static formatNumber(num: number, separator?: string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
  }

  static formatProductPrice(price: { value?: number, min?: number, max?: number }) {
    const pr = price?.value || price.min
    return this.formatPrice(pr)
  }

  static formatPrice(price: number) {
    if (!price) {
      return
    }
    return `${this.formatNumber(Math.ceil(price))} ₽`
  }

  static formatDeliveryPeriod(minPeriod: number, maxPeriod: number) {
    return (maxPeriod || minPeriod) && (maxPeriod === minPeriod ? `${minPeriod} ${this.pluralize(minPeriod, 'день', 'дня', 'дней')}` : `${minPeriod} - ${maxPeriod} ${this.pluralize(maxPeriod, 'день', 'дня', 'дней')}`) || ''
  }

  static formatBonuses(bonuses: number, withStr = false) {
    const number = bonuses ? Math.ceil(bonuses / 100) : 0
    return `${this.formatNumber(number)}${withStr ? ` ${this.pluralize(number, 'балл', 'балла', 'баллов')}` : ''}`
  }

  static formatAddressSuggestionSubTitle(subTitle: string): string {
    return subTitle?.split(',').map((e) => e.trim()).reverse().join(', ')
  }

  static formatDeliveryTime({minDeliveryTime, maxDeliveryTime}: {minDeliveryTime?: number, maxDeliveryTime?: number}) {
    return `${minDeliveryTime ?? ''}${minDeliveryTime != null && maxDeliveryTime != null ? '-' : ''}${maxDeliveryTime ?? ''}${minDeliveryTime != null || maxDeliveryTime != null ? ' мин' : ''}`
  }
  static formatPreOrderTime(date: Date) {
    return Formatter.formatDateRelative(date)
  }

  /** return HH:mm:ss format time */
  static formatSecondtToTime(s: number) {
    let date = new Date(0)
    date.setSeconds(s)
    return date.toISOString().substring(14, 19)
  }

  /** return dd.MM.yy HH:mm date format */ 
  static formatToShortYear(date: string|Date) {
    const locale = {
      ...ru,
      formatRelative: () =>
      'dd.MM.yy HH:mm',
    }
    if (!date) {
      return ''
    }
    return formatRelative(typeof date === 'string' ? new Date(date) : date, new Date(), {locale})
  }

  /** get arr like [['02.2022', '03.2023'], ['02.1992', '03.1993']], return for example '2 года 2 месяца' */
  static fullTimeLine = (arr: string[][]) => {
    let allMonths = arr.map((el) => {

      let oldString = el[0].split('.')
      let oldDate = new Date(+oldString[1], +oldString[0] - 1)
      let newString = el[1]?el[1]?.split('.'):[new Date().getMonth, new Date().getFullYear()]
      let newDate = new Date(+newString[1], +newString[0] - 1)
      let m1=oldDate.getMonth()+(oldDate.getFullYear()*12)
      let m2=newDate.getMonth()+(newDate.getFullYear()*12)
      return (m2-m1)+1
    })
    .reduce((p, c)=>{return p+c}, 0)
  
    let years = ~~(allMonths/12)
    let months = allMonths%12
    let yearsString = years>0 ? (years + ' ' + Formatter.pluralize(years, 'год', 'года', 'лет')):''
    let monthsString = months > 0 ? months +' '+ Formatter.pluralize(months, 'месяц', 'месяца', 'месяцев'):''
    return (yearsString?yearsString + ' ':'') + monthsString
  }

  /** get array, return some random elements from it with limit */
  static randomElementsFromArray = <T>(arr: any[], limit: number): T[] => {
    const arrLength = arr.length
    let newArray = []
    while (newArray.length < (arrLength<=limit?arrLength:limit)) {
      let randomInt = ~~(Math.random() * (arrLength))
      newArray.push(arr[randomInt])
      newArray = newArray.filter((v, i, arr) => arr.indexOf(v) == i)
    }
    return newArray
  }

  static getMarks = (n: number): (boolean|number)[] => {
    let result: (boolean|number)[] = []
    for(let i = 0; i < 5; i++) {
      if((n-i) < 1 && n%1>0 && i<n) {
        result.push(n%1)
      } 
      else {
        result.push(i<n)
      }
    }
    return result
  }


}

export const pad = Formatter.pad
