import { useEffect, useState } from 'react'

interface Props {
  html: string|TrustedHTML
}

export default function TextNode(props: Props) {
  const [text, setText] = useState<string>()

  useEffect(()=>{
    const textNode = document.createElement('div')
    textNode.insertAdjacentHTML('afterbegin', props.html.toString())
    setText(textNode.innerText.toString())
  }, [props.html])

  return (<>{text}</>)
}