import styles from './index.module.scss'
import classNames from 'classnames'
import {runtimeConfig} from 'config/runtimeConfig'
import { CSSProperties } from 'react'

interface Props {
  text: string
  className?: string
  style?: CSSProperties
}

/**
 * @param text :string
 * @param className :string
 */
export default function HtmlText(props: Props) {
  let filtered = props.text ? props.text.replace(/(<? *script)|(base64)|(onload=)/gi, '') : ''
  if(runtimeConfig.DEV){
  //  filtered = Converter.replaceTextImageSource(filtered)
  }
  return (
    <div style={props.style} className={classNames([styles.root, props.className])} dangerouslySetInnerHTML={{ __html: filtered }}/>
  )
}

