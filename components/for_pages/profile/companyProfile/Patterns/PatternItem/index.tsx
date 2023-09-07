import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import styles from './index.module.scss'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import InputField from 'components/fields/InputField'
import { IPattern, IPatternBase } from 'data/interfaces/IPattern'
import { PatternTypes } from 'types/enums'
import { TranslatePatternType } from 'utils/enumsTranslations'

interface Props {
  pattern: IPattern
}


export default function PatternItem(props: Props) {

  const [isActive, setActive] = useState<boolean>(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
     
    ],
    content: props.pattern.template
  })


  const submit = (data: IPatternBase) => {
    let html = editor.getText()
    
    
  }

  const formik = useFormik<IPatternBase>({
    initialValues: {
      type: props.pattern.type||PatternTypes.InfoRequest,
      template: ''
    },
    onSubmit: submit
  })

  return (  <Accordeon 
    isActive={isActive}
    classNames={{content: styles.itemContent, root: styles.itemRoot}}
    body={
      <div
      onClick={()=>setActive(!isActive)}
      className={styles.item}
      >
        {TranslatePatternType(props.pattern.type)}
        <ArrowDownSvg className={classNames(styles.arrow, isActive&&styles.arrow_active)}/>
      </div>
    } 
    >
      <>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <InputField type={'hidden'} className={styles.hiddenInput} value={''} name='template' styleType={'hidden'} color={'white'}/>
          <EditorContent editor={editor} />
          <Button className={styles.button}>Сохранить</Button>
        </Form>
      </FormikProvider>
      </>
    </Accordeon>)
}


