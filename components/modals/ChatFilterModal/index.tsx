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
import { ApplicationStatus } from 'types/enums'
import RadioListField from 'components/fields/RadioListField'
import { useAppContext } from 'context/state'
import { IVacancy } from 'data/interfaces/IVacancy'
import CheckboxListField from 'components/fields/CheckboxListField'
import { IChatsFilter } from 'data/interfaces/IChat'

interface Props {
  isBottomSheet?: boolean
  onClose: () => void
}

enum Pages {
  Main= 'Поиск по фильтрам',
  Vacancies= 'Чаты по вакансиям',
  Status= 'Статус отклика',
  Activity= 'Активность чатов'
}




export interface IChatFilterModalProps {
  vacancies: (IVacancy|null)[],
  filters?: IChatsFilter
  onSubmit?: (data: IChatsFilter)=> void,
  onClear?: () => void
}

export default function ChatFilterModal(props: Props) {

  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Main)
  const appContext = useAppContext()
  const args: IChatFilterModalProps = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  const vacs = args.vacancies.filter(Boolean)

  const submit = (data: IChatsFilter) => {
    args.onSubmit(data)
    props.onClose()
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

  const main = (<>
    <div className={styles.filters}>
      <p className={styles.filter} onClick={()=>setCurrentPage(Pages.Vacancies)}>
        Чаты по вакансиям
        <ArrowRightSvg/>
      </p>
      <p className={styles.filter} onClick={()=>setCurrentPage(Pages.Status)}>
        Статус отклика
        <ArrowRightSvg/>
      </p>
      <p className={styles.filter} onClick={()=>setCurrentPage(Pages.Activity)} >
        Активность чатов
        <ArrowRightSvg/>
      </p>
    </div>
  </>) 

  const vacancies = (<>
    <CheckboxListField options={vacs.map(el=> {return {value: el.id, label: el.name}})} name={'vacanciesIds'}/>
  </>)

  const status = (<>
  <RadioListField
  wrapperClassName={styles.radioWrapper}
  options={[
    {value: 'all', label: 'Все этапы подбора'},
    {value: ApplicationStatus.Applied, label: 'Неразобранные'},
    {value: ApplicationStatus.Accepted, label: 'Приглашение'},
    {value: ApplicationStatus.Rejected, label: 'Отказ'},
  ]} 
  name={'status'}/>
  </>)

  const activity = (<>
    <p className={styles.activity}>
      Показать только непрочитанные 
      <SwitchField 
      onColor={colors.green}
      offColor={colors.grey}
      offHandleColor={colors.white}
      onHandleColor={colors.white}
      name={'unreaded'}/>
    </p>
    <p className={styles.activity}>
      Показать неактивные чаты 
      <SwitchField 
      name={'inactive'}
      onColor={colors.green}
      offColor={colors.grey}
      offHandleColor={colors.white}
      onHandleColor={colors.white}
      />
    </p>
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
    <p className={styles.title}>
      {currentPage}
      <Button onClick={onCloseHandler}><CrossSvg/></Button>
    </p> 
    <FormikProvider value={formik}>
      <Form>
        {currentElement()}
        {currentPage === Pages.Main &&
          <div className={styles.buttons}>
            <Button type='button' onClick={args.onClear} className={styles.greyButton}>Oчистить</Button>
            <Button type='submit' className={styles.yellowButton}>Применить</Button>
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