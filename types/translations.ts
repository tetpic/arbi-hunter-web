import { Translate } from 'next-translate'

export default function translateEnum(a: {[key: string]: string}, strings: string[], t: Translate) {
  return Object.values(a).map((el, index)=> {return [el, t(strings[index])]})
}