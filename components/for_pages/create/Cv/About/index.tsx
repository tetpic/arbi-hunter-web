import TextAreaField from 'components/fields/TextAreaField'
import { useCvContext } from 'context/cv_state'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function About(props: Props) {

  const cvContext = useCvContext()

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    cvContext.setCurrentCv({...cvContext.currentCv, bio: e.currentTarget.value})
  }

  return (
  <div className={styles.root}>
    <p className={styles.title}>О себе<Image src={'/icons/scribe.png'} alt={'about me'} width={24} height={24}/></p>
    <TextAreaField areaClassname={styles.textarea} name='bio' value={cvContext.currentCv?.bio} onChange={onTextAreaChange}  autoSize={true}/>
  </div>)
}