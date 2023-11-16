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

interface Props {
  onClose: () => void
}

export default function CourseFeedbackModal(props: Props) {
  const {isPhoneWidth} = useResize()
  const [rate, setRate] = useState<number>(0)
  const [colorsArray, setColors] = useState<string[]>([])

 
  const submit = (data: {feedback: string}) => {
  }

  const goldColor = colors.yellow
  const greyColor = colors.grey

  /** возвращает массив цветов для StarSVG */
  const starsHandler = (choosen?: number): string[] => {
    let items: string[] = []
    for(let i = 0; i < 5; i++) {
      if(choosen>=0 && i <= choosen) {
        items.push(goldColor+ '90')
      } 
      else if(rate > choosen && i <= rate) {
        items.push(goldColor)
      }
      else {
        items.push(greyColor)
      }
    }
    return items   
  }

  const formik = useFormik<{feedback: string}>({
    initialValues: {
      feedback: ''
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
      <Button onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      <p className={styles.title}>Оцените курс</p>
      <div className={styles.starWrapper} onMouseLeave={()=>{mouseEnterHandler(0)}}>
          {colorsArray.map((color, index) => 
            <div className={styles.svgStarWrapper}  
            onClick={()=> setRate(index)} 
            onMouseEnter={()=>{mouseEnterHandler(index)}}
            >
              <StarFilledSvg color={color} className={styles.starSvg}/>
            </div>)
          }
        </div>
      <FormikProvider value={formik}>
        <Form>
          <TextAreaField 
          onChange={(e)=>formik.setValues({feedback: e.target.value})} 
          placeholder='Введите текст' 
          areaClassname={styles.textarea} 
          autoSize={true}
          name={'feedback'}/>
        </Form>
      </FormikProvider>
      <Button className={styles.sendButton}>Отправить</Button>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}