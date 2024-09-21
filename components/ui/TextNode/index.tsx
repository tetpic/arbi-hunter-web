import { useEffect, useState } from 'react'

interface Props {
  html: string|TrustedHTML
}

export function getTextFromHTML(html: string) {
  const textNode = document.createElement('div')
  textNode.insertAdjacentHTML('afterbegin', (html || '').toString() || '')
  return textNode?.innerText?.toString() || ''
}

export default function TextNode(props: Props) {
  const [text, setText] = useState<string>(undefined)

  useEffect(()=>{
    if(props.html) {

      const result = getTextFromHTML((props.html || '').toString())
      setText(result)
    }
  }, [props.html])

  return (<>{text}</>)
}