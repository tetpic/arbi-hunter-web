import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import CrossSvg from 'components/svg/CrossSvg'
import Button from 'components/ui/Button'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import SwitchField from 'components/fields/SwitchField'
import { colors } from 'styles/variables'
import { AppTheme, ApplicationStatus } from 'types/enums'
import RadioListField from 'components/fields/RadioListField'
import { useAppContext } from 'context/state'
import { IVacancy } from 'data/interfaces/IVacancy'
import CheckboxListField from 'components/fields/CheckboxListField'
import { IChatsFilter } from 'data/interfaces/IChat'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  isBottomSheet?: boolean
  onClose: () => void
}

enum Pages {
  Main= 'main',
  Vacancies= 'vacancies',
  Status= 'status',
  Activity= 'activity'
}

const pagesTitleTranslations = (p: Pages, t: Translate) => {
  switch(p) {
    case Pages.Main:
      return t('chatFilterModal_title_main')
    case Pages.Activity:
      return t('chatFilterModal_title_activity')
    case Pages.Status:
      return t('chatFilterModal_title_status')
    case Pages.Vacancies:
      return t('chatFilterModal_title_vacancies')
  }
}



export interface IChatFilterModalProps {
  vacancies: (IVacancy|null)[],
  filters?: IChatsFilter
  onSubmit?: (data: IChatsFilter)=> void,
  onClear?: () => void
}

export default function ChatFilterModal(props: Props) {
  const {t} = useTranslation()
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Main)
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const args: IChatFilterModalProps = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  const vacs = args.vacancies.filter(Boolean)

  const submit = (data: IChatsFilter) => {
    args.onSubmit(data)
    props.onClose()
  }

  const initialValues:IChatsFilter = {
    vacanciesIds: [],
    status: 'all',
    unreaded: false,
    inactive:false
  }

  const formik = useFormik<IChatsFilter>({
    initialValues: {
      vacanciesIds: args.filters?.vacanciesIds||[],
      status: args.filters?.status||'all',
      unreaded: args.filters?.unreaded||false,
      inactive: args.filters?.inactive||false
    },
    onSubmit: submit
  })

  const onClear = () => {
    formik.setValues(initialValues)
  }

  const main = (<>
    <div className={styles.filters}>
      <P styleType={['medium', 'w500']} useThemeColor className={styles.filter} onClick={()=>setCurrentPage(Pages.Vacancies)}>
        {t('chatFilterModal_title_vacancies')}
        <ArrowRightSvg color={isLightTheme&&colors.black}/>
      </P>
      <P styleType={['medium', 'w500']} useThemeColor className={styles.filter} onClick={()=>setCurrentPage(Pages.Status)}>
        {t('chatFilterModal_title_status')}
        <ArrowRightSvg color={isLightTheme&&colors.black}/>
      </P>
      <P styleType={['medium', 'w500']} useThemeColor className={styles.filter} onClick={()=>setCurrentPage(Pages.Activity)} >
        {t('chatFilterModal_title_activity')}
        <ArrowRightSvg color={isLightTheme&&colors.black}/>
      </P>
    </div>
  </>) 

  const vacancies = (<>
    <CheckboxListField options={vacs.map(el=> {return {value: el.id, label: el.name}})} name={'vacanciesIds'}/>
  </>)

  const status = (<>
  <RadioListField
  wrapperClassName={styles.radioWrapper}
  options={[
    {value: 'all', label: t('chatFilterModal_allStages')},
    {value: ApplicationStatus.Applied, label: t('chatFilterModal_unsorted')},
    {value: ApplicationStatus.Accepted, label: t('chatFilterModal_accepted')},
    {value: ApplicationStatus.Rejected, label: t('chatFilterModal_rejected')},
  ]} 
  name={'status'}/>
  </>)

  const activity = (<>
    <P styleType={['large', 'w500']} useThemeColor  className={styles.activity}>
      {t('chatFilterModal_showUnread')} 
      <SwitchField 
      onColor={colors.green}
      offColor={colors.greyLight}
      offHandleColor={colors.white}
      onHandleColor={colors.white}
      name={'unreaded'}/>
    </P>
    <P styleType={['large', 'w500']} useThemeColor className={styles.activity}>
      {t('chatFilterModal_showUnactive')} 
      <SwitchField 
      name={'inactive'}
      onColor={colors.green}
      offColor={colors.greyLight}
      offHandleColor={colors.white}
      onHandleColor={colors.white}
      />
    </P>
  </>)

  const currentElement = (): JSX.Element => {
    switch(currentPage) {
      case Pages.Main:
        return main
      case Pages.Activity:
        return activity
      case Pages.Status: 
        return status
      case Pages.Vacancies:
        return vacancies
    }
  }

  const onCloseHandler = () => {
    currentPage === Pages.Main
    ?props.onClose()
    :setCurrentPage(Pages.Main)
  }
  

  const body = (<div className={styles.body}>
    <P styleType={['large', 'w600']} className={styles.title} useThemeColor>
      {pagesTitleTranslations(currentPage, t)}
      <Button altStyleType={['invertSvg']} onClick={onCloseHandler}><CrossSvg/></Button>
    </P> 
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        {currentElement()}
        {currentPage === Pages.Main &&
          <div className={styles.buttons}>
            <Button type='button' onClick={onClear} styleType={['grey', 'phoneWide']} altStyleType={['white']}>{t('clear')}</Button>
            <Button type='submit' styleType={['gradient', 'phoneWide']}>{t('apply')}</Button>
          </div>
        }
      </Form>
    </FormikProvider>
  </div>)


  if(props.isBottomSheet ) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}