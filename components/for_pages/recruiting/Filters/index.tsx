import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import { CompensationType, CompensationTypeTranslated, EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect } from 'react'
import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
}

export default function Filters(props: Props) {
  const appContext = useAppContext()
  const creationContext = useCreateVcCvContext()

  const formik = useFormik<IVacancyCvSearchParams>({
    initialValues: {
      employment: [],
      schedule: [],
      compensation: undefined,
      forLastNumberOfDays: undefined,
      languageKnowledges: [],
      experience: []
    },
    onSubmit: null
  })

  const removeLanguage = (l: ILanguageKnowledge) => {
    const helperState = creationContext.helpObjects
    const filteredLangs = helperState.languageKnowledges
    filteredLangs.delete(l.language)
    creationContext.setHelpObjects({...helperState, languageKnowledges: filteredLangs})
  }

  const removeSource = (el: number) => {
    const helperState = creationContext.helpObjects
    helperState.activeSources.delete(el)
    creationContext.setHelpObjects({...helperState})
  }

  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
  }, [])

  useEffect(()=>{
    props.onFilterChange(formik.values)
  }, [formik.values])

  useEffect(()=>{
    const values = {
      ...formik.values,
      languageKnowledges: [...creationContext.helpObjects.languageKnowledges.values()],
      sources:  [...creationContext.helpObjects.activeSources.values()].map(el=> el.id),
    }
    creationContext.activeSubCategory&&(values.categories = Array.isArray(creationContext.activeSubCategory)?creationContext.activeSubCategory.map(el => el.id):[creationContext.activeSubCategory?.id])
    formik.setValues(values)
  }, [creationContext.helpObjects, creationContext.activeSubCategory])

  return (<div className={styles.root}> 
    <FormikProvider value={formik}>
      <Form>
        <p className={styles.fieldTitle}>Показать период</p>
        <RadioListField 
        rootClass={styles.radioField}
        options={[
          {value: null, label: 'За все время'},
          {value: 1, label: 'За сутки'},
          {value: 7, label: 'За неделю'},
          {value: 30, label: 'За месяц'},
          {value: 365, label: 'За год'},
        ]} 
        name={'forLastNumberOfDays'}/>

        <p className={styles.fieldTitle}>Специализация</p>
          {Array.isArray(creationContext.activeSubCategory) && creationContext.activeSubCategory.length > 0 &&
            <div className={styles.itemsWrapper}>
              { creationContext.activeSubCategory.map(el=> {
                return (<RemovableItem key={el.id} onClick={()=>creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f.id !== el.id):state)} text={el.name} />)
              })}
            </div>
          }
        <AddButton className={styles.addButton} title='Добавить' onClick={()=>appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {manyItems: true})}/>

        <p className={styles.fieldTitle}>Оплата</p>
        <RadioListField 
        rootClass={styles.radioField}
        options={CompensationTypeTranslated.map(el=> {return {value: el[0], label: el[1]}})} 
        name={'compensation'}
        />
        {(formik.values.compensation === CompensationType.Commission || formik.values.compensation === CompensationType.Gybrid) &&
          <>
            <p className={styles.fieldTitle}>Комиссия</p>
            <div className={styles.range}>
              {formik.values.compensation === CompensationType.Gybrid && <>
                <InputField styleType={'default'} placeholder='От' color={'white'} name={'gybridCommissionMin'}/>
                <InputField styleType={'default'} placeholder='До' color={'white'} name={'gybridCommissionMax'}/>
              </>}
              {formik.values.compensation === CompensationType.Commission && <>
                <InputField styleType={'default'} placeholder='От' color={'white'} name={'commissionMin'}/>
                <InputField styleType={'default'} placeholder='До' color={'white'} name={'commissionMax'}/>
              </>}
            </div>
          </>
        }
        {(formik.values.compensation === CompensationType.Salary || formik.values.compensation === CompensationType.Gybrid) &&
          <>
            <p className={styles.fieldTitle}>Оклад</p>
            <div className={styles.range}>
              <InputField styleType={'default'} placeholder='От'  color={'white'} name={'salaryMin'}/>
              -
              <InputField styleType={'default'} placeholder='До' color={'white'} name={'salaryMax'}/>
            </div>
          </>
        }

        <p className={styles.fieldTitle}>Источники</p>
        {creationContext.helpObjects.sources.length > 0 &&
          <div className={styles.itemsWrapper}>
           {creationContext.helpObjects && [...creationContext.helpObjects?.activeSources.entries()]
            .map(([key, value])=> 
            <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key)}/>
            )}
          </div>
        }
        <AddButton className={styles.addButton} title='Добавить' onClick={()=>appContext.showModal(ModalType.SourcesModal)}/>

        <p className={styles.fieldTitle}>Занятость</p>
        <CheckboxListField 
        rootClass={styles.radioField}
        name={'employment'} 
        options={[
          {value: EmploymentType.FullTime, label: 'Полная'},
          {value: EmploymentType.PartTime, label: 'Частичная'},
          {value: EmploymentType.Project, label: 'Проектная'}
        ]}/>

        <p className={styles.fieldTitle}>Тип работы</p>
        <CheckboxListField 
        rootClass={styles.radioField}
        name={'schedule'}
        options={[
          {value: ScheduleType.Flexible, label: 'Гибкий график'},
          {value: ScheduleType.FullDay, label: 'Полный день'},
          {value: ScheduleType.Remote, label: 'Удаленная работа'}
        ]} 
        />

        <p className={styles.fieldTitle}>Знания языков</p>
        {creationContext.helpObjects?.languageKnowledges?.size > 0 &&
          <div className={styles.itemsWrapper}>
            {creationContext.helpObjects&& [...creationContext.helpObjects?.languageKnowledges.values()]
            .map((el)=> <RemovableItem key={el.language} onClick={()=>removeLanguage(el)} text={`${languages.getName(el.language, 'ru')}, ${el.level}`} /> )
            }
          </div>
        } 
        <AddButton className={styles.addButton} title='Добавить' onClick={()=>appContext.showModal(ModalType.LanguageModal)}/>

        <p className={styles.fieldTitle}>Опыт работы</p>
        <CheckboxListField 
        name={'experience'} 
        rootClass={styles.radioField}
        options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
        />

      </Form> 
    </FormikProvider>
    <Button className={styles.resetButton} onClick={formik.handleReset}>Сбросить всё</Button>

  </div>)
}