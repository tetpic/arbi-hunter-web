import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { IGeoName, ISearchCityResult } from 'data/interfaces/ILocation'
import { Form, FormikProvider, useFormik } from 'formik'
import { LocationWrapper, useLocationContext } from 'context/location_state'
import InputField from '@/components/fields/InputField'
import LoupeSvg from '@/components/svg/LoupeSvg'
import CheckboxListField from '@/components/fields/CheckboxListField'
import { useAppContext } from 'context/state'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import Title from '@/components/ui/TitleForSection'
import { clearObject } from 'utils/helpers'

export interface ICityModalArgs {
  initialCountries: IGeoName[]
  onSubmit: (cities: ISearchCityResult[]) => void
}
 
interface Props {
  onClose: () => void
}

export default function CityModal(props: Props) {
  return (
    <LocationWrapper>
        <CityModalInner {...props}/>
    </LocationWrapper>
  )
}

function CityModalInner(props: Props) {
  const locationContext = useLocationContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const args: ICityModalArgs = appContext.modalArguments
  const {t} = useTranslation()

  const submit = (data: {search: string, cities: ISearchCityResult[]}) => {
    args.onSubmit(data.cities)
    props.onClose()
  }

  const formik = useFormik<{search: string, cities: ISearchCityResult[]}>(
    {
      initialValues: {
        search: '',
        cities: [],
      },
      onSubmit: submit
    }
  )

  useEffect(()=>{
    locationContext.getCities(clearObject({search: formik.values.search, limit: 1000}), args.initialCountries.map(el=> el.country))  
  }, [formik.values.search])

  const body = (
    <div className={styles.root}> 
    {isTabletWidth &&<Title title={t('cities')} onBackClick={props.onClose}/>}
   
    <InputField styleType={'default'} color={'white'} name={'search'} prefix={<LoupeSvg/>}/>
    <div className={styles.list}>
      <CheckboxListField name={'cities'} options={
        [...locationContext.cities.values()].map(el=> ({label: el.name, value: el}))
      }/>
    </div>
    <div className={styles.buttonsWrapper}>
      {!isTabletWidth && 
        <Button styleType={['grey', 'whiteText']} onClick={props.onClose}>{t('cancel')}</Button>
      }
      <Button styleType={['gradient', 'phoneWide']} type='submit'>{t('save')}</Button>
    </div>

    </div>
  )

  return (
    <ModalLayout className={styles.modalLayout} mobileFullScreen>
      <ModalBody>
        <FormikProvider value={formik}>
          <Form className={styles.form}>
            {body}
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}