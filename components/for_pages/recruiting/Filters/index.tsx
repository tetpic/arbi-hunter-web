import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  CompensationTypeTranslated, EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
// import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
import Accordeon from 'components/ui/Accordeon'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Spacer from 'components/ui/Spacer'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
}

export default function Filters(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const creationContext = useCreateVcCvContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)

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

  const openSpecializationModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<ISpecializationModalProps>(ModalType.SpecializationModal, {
        manyItems: true,
        onClose: ()=>appContext.hideBottomSheet()
      }, 0.9)
      return
    } 
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      manyItems: true})
  }

  const openSourcesModal = () => {
    if (isTabletWidth) {
      appContext.showBottomSheet(ModalType.SourcesModal, {
        onClose: ()=>appContext.hideBottomSheet()
      }, 0.4)
      return
    }
    appContext.showModal(ModalType.SourcesModal)
  }

  const openLangsModal = () => {
    if (isTabletWidth) {
      appContext.showBottomSheet(ModalType.LanguageModal, {
        onClose: ()=>appContext.hideBottomSheet()
      }, 0.9)
      return
    }
    appContext.showModal(ModalType.LanguageModal)    
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
        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
          <span>Показать период</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 1} disabled={!isTabletWidth}>
          <RadioListField 
          rootClass={styles.radioField}
          options={[
            {value: null, label: 'За все время'},
            ...periods.map(el=>{
              return {value: el.value, label: el.name}
            })         
          ]} 
          name={'forLastNumberOfDays'}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>Специализация</p>
          {Array.isArray(creationContext.activeSubCategory) && creationContext.activeSubCategory.length > 0 &&
            <div className={styles.itemsWrapper}>
              { creationContext.activeSubCategory.map(el=> {
                return (<RemovableItem key={el.id} onClick={()=>creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f.id !== el.id):state)} text={el.name} />)
              })}
            </div>
          }
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSpecializationModal()}/>
        }

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Оплата</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 2} disabled={!isTabletWidth}>
          <RadioListField 
          rootClass={styles.radioField}
          options={CompensationTypeTranslated.map(el=> {return {value: el[0], label: el[1]}})} 
          name={'compensation'}
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        {/* {(formik.values.compensation === CompensationType.Commission || formik.values.compensation === CompensationType.Gybrid) &&
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
        } */}

        <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal()}>Источники</p>
        {creationContext.helpObjects.sources.length > 0 &&
          <div className={styles.itemsWrapper}>
           {creationContext.helpObjects && [...creationContext.helpObjects?.activeSources.entries()]
            .map(([key, value])=> 
            <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key)}/>
            )}
          </div>
        }
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal()}/>
        }

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
          <span>Занятость</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={[
            {value: EmploymentType.FullTime, label: 'Полная'},
            {value: EmploymentType.PartTime, label: 'Частичная'},
            {value: EmploymentType.Project, label: 'Проектная'}
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 4 ? null : 4)}>
          <span>Тип работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 4&&styles.active}/>}
        </p>
        <Accordeon  isActive={activeAccordeon === 4} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'schedule'}
          options={[
            {value: ScheduleType.Flexible, label: 'Гибкий график'},
            {value: ScheduleType.FullDay, label: 'Полный день'},
            {value: ScheduleType.Remote, label: 'Удаленная работа'}
          ]} 
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle}>Знания языков</p>
        {creationContext.helpObjects?.languageKnowledges?.size > 0 &&
          <div className={styles.itemsWrapper}>
            {creationContext.helpObjects&& [...creationContext.helpObjects?.languageKnowledges.values()]
            .map((el)=> <RemovableItem key={el.language} onClick={()=>removeLanguage(el)} text={`${languages.getName(el.language, 'ru')}, ${el.level}`} /> )
            }
          </div>
        } 
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openLangsModal()}/>
        }

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
          <span>Опыт работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 5} disabled={!isTabletWidth}>
          <CheckboxListField 
          name={'experience'} 
          rootClass={styles.radioField}
          options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

      </Form> 
    </FormikProvider>
    <Button className={styles.resetButton} onClick={formik.handleReset}>Сбросить всё</Button>

  </div>)
}