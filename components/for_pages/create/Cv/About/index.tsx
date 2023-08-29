import TextAreaField from 'components/fields/TextAreaField'
import { useResize } from 'components/hooks/useResize'
import { useCvContext } from 'context/cv_state'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function About(props: Props) {

  const cvContext = useCvContext()
  const {isPhoneWidth} = useResize()

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    cvContext.setCurrentCv({...cvContext.currentCv, bio: e.currentTarget.value})
  }

  return (
  <div className={styles.root}>
    <p className={styles.title}>{isPhoneWidth? 'Расскажите о себе': <>О себе<Image src={'/icons/scribe.png'} alt={'about me'} width={24} height={24}/></>}</p>
    <TextAreaField areaClassname={styles.textarea} name='bio' value={cvContext.currentCv?.bio} onChange={onTextAreaChange}  autoSize={true}/>
  </div>)
}