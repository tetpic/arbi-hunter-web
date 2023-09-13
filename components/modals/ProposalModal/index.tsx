import RadioListField from 'components/fields/RadioListField'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import ClosingTitle from 'components/ui/ClosingTitle'
import Spinner from 'components/ui/Spinner'
import { usePatternContext } from 'context/pattern_state'
import { useAppContext } from 'context/state'
import { useVacancyContext } from 'context/vacancy_state'
import { ICV } from 'data/interfaces/ICV'
import { Form, FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { ApplicationBSSelectType, ModalType } from 'types/enums'
import { TranslateApplicationBSSelectType } from 'utils/enumsTranslations'
import styles from './index.module.scss'


interface Props {
  onClose: ()=> void
}

interface FormikState {
  type: ApplicationBSSelectType
  id?: number
}

enum Pager {
  Invite,
  OtherVacancy
}

export default function ProposalModal(props: Props) {
  const patternContext = usePatternContext()
  const [page, setPage] = useState<Pager>(Pager.Invite)
  const [loading, setIsLoading] = useState<boolean>(false)
  const appContext = useAppContext()

  const vacancyContext = useVacancyContext()

  const submit = (data: FormikState) => {
    if(data.type === ApplicationBSSelectType.AnotherVacancy && page === Pager.Invite) {
      setIsLoading(true)
      vacancyContext.setActiveVacancies().then(res=>
        setIsLoading(false)
      )
      setPage(Pager.OtherVacancy)
    }
    else {
      const modalArguments = appContext.modalArguments as [cv: ICV, id: number]
      appContext.showModal(ModalType.ProposalTextModal, {...data, body: modalArguments})
    }
  }

  useEffect(()=>{
    patternContext.setPatterns()
  }, [])

  const formik = useFormik<FormikState>({
    initialValues: {
      type: ApplicationBSSelectType.ThisVacancy,
      id: null,
      
    },
    onSubmit: submit
  })

  const title = (<ClosingTitle title={'Пригласить'} classNames={{wrapper: styles.titleWrapper}} onClose={props.onClose}/>)

  const body = (
    <FormikProvider value={formik} >
      <Form>
        {
        page === Pager.Invite &&
          <RadioListField wrapperClassName={styles.radioWrapper} name={'type'} options={Object.values(ApplicationBSSelectType).map(el=> {
            return {value: el, label: TranslateApplicationBSSelectType(el)}
          })}/>
        ||
        page === Pager.OtherVacancy && !loading &&
          <RadioListField wrapperClassName={styles.radioWrapper} name={'id'} options={[...vacancyContext.activeVacancies.values()].map(el => {
            return {value: el.id, label: el.name}
          })}/>          
        ||
        loading && <Spinner size={24} color={colors.yellow}/>
        }
        <Button type='button' onClick={formik.submitForm} className={styles.buttonYellow}>Продолжить</Button>
      </Form>
    </FormikProvider>
  )

  return (
    <ModalLayout className={styles.layout}>
      <ModalBody>
        {title}
        {body}
      </ModalBody>
    </ModalLayout>
  )
}