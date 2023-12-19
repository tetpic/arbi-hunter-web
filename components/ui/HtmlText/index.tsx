import styles from './index.module.scss'
import classNames from 'classnames'
import {runtimeConfig} from 'config/runtimeConfig'

interface Props {
  text: string
  className?: string
}

export default function HtmlText(props: Props) {
  let filtered = props.text ? props.text.replace(/(<? *script)|(base64)|(onload=)/gi, '') : ''
  if(runtimeConfig.DEV){
  //  filtered = Converter.replaceTextImageSource(filtered)
  }
  return (
    <div className={classNames([styles.root, props.className])} dangerouslySetInnerHTML={{ __html: filtered }}/>
  )
}

