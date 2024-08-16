import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import Button from '@/components/ui/Button'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from '@/components/fields/InputField'
import P from '@/components/ui/P'

interface Props {
  onClose: () => void
}

export interface SearchModalArgs {
  onSearch: (s: string) => void
  placeholder?: string,
  suggestions?: string[]
  initialValue?: string
}

export default function SearchModal(props: Props) {
  const appContext = useAppContext()
  const args: SearchModalArgs = appContext.modalArguments

  const formik = useFormik<{search: string}>({
    initialValues: {
      search: args.initialValue||'',
    },
    onSubmit: ()=>{}
  })

  const onBackClick = () => {
    args.onSearch(formik.values.search)
    props.onClose()
  }



  const body = (
    <FormikProvider value={formik}>
      <Form>
        <div className={styles.root}>
          <div className={styles.top}>
            <Button styleType={['icon', 'black']} altStyleType={['white', 'icon', 'invertSvg']} onClick={()=>onBackClick()} ><ArrowLeftSvg/></Button>
            <InputField styleType={'default'} color={'white'} name={'search'} className={styles.input} placeholder={args.placeholder}/>
          </div>
          <div className={styles.suggestions}>
            {args.suggestions.map(el => {
              return <P useThemeColor styleType={['w500', 'large']} onClick={()=>{formik.setFieldValue('search', el)}}>{el}</P>
            })
            }
          </div>
        </div>
      </Form>
    </FormikProvider>
  )

  return (<ModalLayout mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>

  )
}