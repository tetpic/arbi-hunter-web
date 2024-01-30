import HtmlText from '../HtmlText'
import styles from './index.module.scss'

interface Props {
  title: string
  text?: string
  link?: string
  titleClassName?: string
}

/**
 *  @title : string
 *  @text : string
 *  @link : string
*/
export default function CvVcAbout(props: Props) {

  return (<div className={styles.about}>
    <p className={props.titleClassName}>{props.title}</p>
    {props.link &&     
      <a href={(props.link?.startsWith('http')?'':'https://')+props.link} target='_blank' className={styles.description}>{props.link}</a>
      ||
      <HtmlText className={styles.description} text={props.text}/>

      // <div className={styles.description}>{props.text}</div>
    }
  </div>)
}