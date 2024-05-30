import styles from './index.module.scss'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import RadioListField from '@/components/fields/RadioListField'
import { periods } from 'utils/commonObjects'
import P from '@/components/ui/P'
import CheckboxListField from '@/components/fields/CheckboxListField'
import { EducationTypes, EmploymentType, ScheduleType, VacancyLookType, WorkExperience } from 'types/enums'
import { TranslateEducationType, TranslateEmploymentType, TranslateScheduleType, TranslateVacancyLookType, TranslateWorkExperience } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'
import Button from '@/components/ui/Button'
import { clearObject } from 'utils/helpers'

interface Props {
  isBottomSheet: boolean
  onClose: () => void
}

export type HirerFieldType = 'experience'|'education'|'employment'|'vacancyLookType'|'forLastNumberOfDays'|'schedule'|'education'

export interface HirerFieldsModalArgs {
  type: HirerFieldType
  onSubmit: (data: Partial<Omit<IVacancyCvSearchParams, 'countries'>>) => void
  initialFields?: Partial<Omit<IVacancyCvSearchParams, 'countries'>>
  title: string
  
}



export default function HirerFieldsModal(props: Props) {
  const appContext = useAppContext()
  const {t} = useTranslation()
  const args: HirerFieldsModalArgs = appContext.bottomSheetArguments

  const submit = (data: Partial<IVacancyCvSearchParams>) => {
    const _clearedObject = clearObject(data)
    args.onSubmit(_clearedObject)
    props.onClose()
  }

  const initialValues:IVacancyCvSearchParams = {
    employment: [],
    schedule: [],
    compensation: undefined,
    forLastNumberOfDays: undefined,
    languageKnowledges: [],
    experience: [],
    categories: [],
    salaryMax: undefined,
    salaryMin: undefined,
    currency: undefined,
    vacancyLookType: [],
    countries: [],
    cities: [],
    education: [],
    search: undefined,
  }

  const formik = useFormik<Partial<IVacancyCvSearchParams>>({
    initialValues: {
      ...initialValues,
      ...args.initialFields
    },
    onSubmit: submit
  })

  const item = (
    () => {
      switch(args.type) {
        case  'experience': {
          return   <CheckboxListField 
          name={'experience'} 
          rootClass={styles.radioField}
          options={Object.values(WorkExperience).map(el => {
            return {label: TranslateWorkExperience(el, t), value: el}
          })}/>           
        }
        case 'forLastNumberOfDays':{
          return <RadioListField 
          name={'forLastNumberOfDays'}
          rootClass={styles.radioField}
          options={[
            {value: null, label: 'Все время'},
            ...periods.map(el=>{
              return {value: el.value, label: el.name}
            })         
          ]} />
        }
        case 'vacancyLookType': {
          return <CheckboxListField 
          name={'vacancyLookType'}
          rootClass={styles.radioField}
          options={Object.values(VacancyLookType).map(el => {
            return {value: el, label: TranslateVacancyLookType(el, ProfileType.Hirer, t)}
          })} />
        }
        case 'employment': {
          return  <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={Object.values(EmploymentType).map(el => {
            return {label: TranslateEmploymentType(el, t), value: el}
          })}/> 
        }
        case 'schedule': {
          return <CheckboxListField 
          rootClass={styles.radioField}
          name={'schedule'}
          options={Object.values(ScheduleType).map(el => {
            return {label: TranslateScheduleType(el, t), value: el}
          })} /> 
        }
        case 'education': {
          return  <CheckboxListField 
          name={'education'} 
          rootClass={styles.radioField}
          options={
            Object.values(EducationTypes).map(el=>{
              return {label: TranslateEducationType(el, t), value: el}
            })} 
          />
        } 


      }
    }
  )()

  return (<BottomSheetLayout>
    <BottomSheetBody>
      <FormikProvider value={formik}>
        <Form>
          <div className={styles.root}>        
            <P styleType={['w600', 'large']} useThemeColor>{args.title}</P>
            {item}
            <Button type='submit' styleType={['gradient','wide']}>{t('apply')}</Button>
          </div>
        </Form>
      </FormikProvider>
    </BottomSheetBody>
  </BottomSheetLayout>
  )
}