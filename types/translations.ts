export default function translateEnum(a: {[key: string]: string}, strings: string[]) {
  return Object.values(a).map((el, index)=> {return [el, strings[index]]})
}