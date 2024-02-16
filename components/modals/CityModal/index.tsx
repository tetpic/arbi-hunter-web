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
  const args: ICityModalArgs = appContext.modalArguments

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
    locationContext.getCities({search: formik.values.search}, args.initialCountries.map(el=> el.country))  
  }, [formik.values.search])

  useEffect(()=>{
    locationContext.getCities(null, args.initialCountries.map(el=> el.country))
  }, [])

  const body = (
    <div className={styles.root}> 
    <InputField styleType={'default'} color={'white'} name={'search'} prefix={<LoupeSvg/>}/>
    <CheckboxListField name={'cities'} options={
      [...locationContext.cities.values()].map(el=> ({label: el.name, value: el}))
    }/>
    <div className={styles.buttonsWrapper}>
      <Button styleType={['grey']} type='button' onClick={props.onClose}>Отменить</Button>
      <Button styleType={['gradient']} type='submit'>Выбрать</Button>
    </div>

    </div>
  )

  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody>
        <FormikProvider value={formik}>
          <Form>
            {body}
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}