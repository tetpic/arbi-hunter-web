import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import Button from 'components/ui/Button'
import CrossSvg from 'components/svg/CrossSvg'
import { Form, FormikProvider, useFormik } from 'formik'
import TextAreaField from 'components/fields/TextAreaField'
import StarFilledSvg from 'components/svg/StarFilledSvg'
import { useCallback, useEffect, useState } from 'react'
import { useResize } from 'components/hooks/useResize'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { SnackbarType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  onClose: () => void
}

export interface ICourseFeedbackModalProps {
  courseId: number
}

export default function CourseFeedbackModal(props: Props) {
  const {t} = useTranslation()
  const {isPhoneWidth} = useResize()
  const [rate, setRate] = useState<number>(0)
  const [colorsArray, setColors] = useState<string[]>([])
  const appContext = useAppContext()
  const args = appContext.modalArguments as {courseId: number}

 
  const submit = async(data: {content: string}) => {
    if(rate === 0) {
      appContext.showSnackbar(t('courses_rateCourse'), SnackbarType.error)
      return
    }
    const dataToSend = {
      ...data,
      mark: rate,
      courseId: args.courseId
    }
    await CoursesRepository.sendCourseFeedback(dataToSend)
    appContext.showSnackbar(t('courses_thanksForFeedback'), SnackbarType.success)
    appContext.hideModal()
  }

  const goldColor = colors.blue
  const greyColor = colors.greyLight

  const starsHandler = (choosen?: number): string[] => {
    let items: string[] = []
    for(let i = 0; i < 5; i++) {
      if(choosen>0 && i < choosen) {
        items.push(goldColor)
      } 
      else if(rate > choosen && i < rate) {
        items.push(goldColor)
      }
      else {
        items.push(greyColor)
      }
    }
    return items   
  }

  const formik = useFormik<{content: string}>({
    initialValues: {
      content: null
    },
    onSubmit: submit
  })

  const mouseEnterHandler = useCallback((index: number) => {   
    if(isPhoneWidth) {return}
    let items = starsHandler(index) 
    setColors(items)
  }, [rate])

  useEffect(()=> {
    let items = starsHandler(0)
    setColors(items)
  }, [])
  
  const body = (
    <div className={styles.root}>
      <Button onClick={props.onClose} altStyleType={['invertSvg']} className={styles.closeButton}><CrossSvg/></Button>
      <P useThemeColor className={styles.title} styleType={['large', 'w600', 'textCenter']}>{t('courses_rateAlt')}</P>
      <div className={styles.starWrapper} onMouseLeave={()=>{mouseEnterHandler(0)}}>
          {colorsArray.map((color, index) => 
            <div className={styles.svgStarWrapper}  
            onClick={()=> setRate(index+1)} 
            onMouseEnter={()=>{mouseEnterHandler(index+1)}}
            onTouchStart={()=> mouseEnterHandler(index+1)}
            >
              <StarFilledSvg color={color} className={styles.starSvg}/>
            </div>)
          }
        </div>
      <FormikProvider value={formik}>
        <Form>
          <TextAreaField 
          onChange={(e)=>formik.setValues({content: e.target.value})} 
          placeholder={t('fields_insertText')} 
          areaClassname={styles.textarea} 
          autoSize={true}
          name={'content'}/>
        </Form>
      </FormikProvider>
      <Button onClick={formik.submitForm} className={styles.sendButton}>{t('send')}</Button>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout} mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}