import TextAreaField from 'components/fields/TextAreaField'
import Image from 'next/image'
import styles from './index.module.scss'

interface Props {
}

export default function About(props: Props) {

  return (<div className={styles.root}>
    <p className={styles.title}>О себе<Image src={'/icons/scribe.png'} alt={'about me'} width={24} height={24}/></p>
    <TextAreaField areaClassname={styles.textarea} name={'bio'} autoSize={true}/>

  
  </div>)
}