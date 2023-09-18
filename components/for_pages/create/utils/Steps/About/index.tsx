import TextAreaField from 'components/fields/TextAreaField'
import { useResize } from 'components/hooks/useResize'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useFormikContext } from 'formik'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import styles from './index.module.scss'

interface Props {
  title?: string
  fieldName?: string
}

export default function About(props: Props) {

  const cvContext = useCreateVcCvContext()
  const {isPhoneWidth} = useResize()
  const {values, setFieldValue } = useFormikContext()

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    cvContext.setCurrentCv({...cvContext.currentCv, bio: e.currentTarget.value})
    setFieldValue(props.fieldName||'bio', e.currentTarget.value)
  }

  return (
  <div className={styles.root}>
    <p className={styles.title}>
      {props.title}
      {!props.title &&(isPhoneWidth ? 'Расскажите о себе': 'О себе')}
      <Image src={'/icons/scribe.png'} alt={'about me'} width={24} height={24}/>
      </p>
    <TextAreaField areaClassname={styles.textarea} name={props.fieldName||'bio'} value={cvContext.currentCv?.bio||cvContext.currentVc?.description} onChange={onTextAreaChange}  autoSize={true}/>
  </div>)
}