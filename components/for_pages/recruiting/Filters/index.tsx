import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  CompensationType,  EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISpecializationCategory, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
import Accordeon from 'components/ui/Accordeon'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Spacer from 'components/ui/Spacer'
import CheckboxField from '@/components/fields/CheckboxField'
import { TranslateCompensationType, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import { ILangaugesModalArgs } from '@/components/modals/CvModals/Languages'

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
      experience: [],
      categories: [],
    },
    onSubmit: null
  })

  const removeLanguage = (l: ILanguageKnowledge) => {
    const helperState = creationContext.helpObjects
    const filteredLangs = helperState.languageKnowledges
    filteredLangs.delete(l.language)
    creationContext.setHelpObjects({...helperState, languageKnowledges: filteredLangs})
  }

  const removeSource = (el: number, type: 'activeSources'|'activeGeos'|'activeVerticals') => {
    const helperState = creationContext.helpObjects
    helperState[type].delete(el)
    creationContext.setHelpObjects({...helperState})
  }

  const openSpecializationModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<ISpecializationModalProps>(ModalType.SpecializationModal, {
        manyItems: true,
        onSubmit: (data)=>{
          creationContext.setActiveSubcategory(data)
          formik.setFieldValue('categories', data.map(el=> el.id))
        },
        onClose: ()=>appContext.hideBottomSheet(),
      }, 0.9)
      return
    } 
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      manyItems: true,
      onSubmit: (data)=>{
        creationContext.setActiveSubcategory(data)
        formik.setFieldValue('categories', data.map(el=> el.id))
      },
    })
  }

  const openSourcesModal = (t: Pick<ISoursesModalArgs, 'type'>) => {
    const dataToSet:ISoursesModalArgs = {
      type: t.type,
      onClose: (activeSources)=>{
        const newObject = {...creationContext.helpObjects, [t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']: activeSources}
        creationContext.setHelpObjects(newObject)
        appContext.hideModal()
      },
      data: creationContext.helpObjects[t.type === 'sources'? 'sources':t.type === 'geos'? 'geos':'verticals'],
      choosenElements: creationContext.helpObjects[t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']
    }
    if (isTabletWidth) {
      appContext.showBottomSheet<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet, 0.4)
      return
    }
    appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet)
  }

  const openLangsModal = () => {
    const args: ILangaugesModalArgs = {
      onSubmit: (data) => {
        const lansgKnown = creationContext.helpObjects?.languageKnowledges||new Map
        lansgKnown.set(data.language, data)
        creationContext.setHelpObjects({languageKnowledges: new Map(lansgKnown)})
        appContext.hideModal()
      }
    }
    if (isTabletWidth) {
      appContext.showBottomSheet<ILangaugesModalArgs>(ModalType.LanguageModal, args, 0.9)
      return
    }
    appContext.showModal<ILangaugesModalArgs>(ModalType.LanguageModal, args)    
  }

  const onRemoveCategory = (category: ISpecializationCategory) => {
    creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f.id !== category.id):state)
    formik.setFieldValue('categories', formik.values.categories.filter(f=> f !== category.id))
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
      sources:  [...creationContext.helpObjects?.activeSources?.values()].map(el=> el.id),
      geos:  [...creationContext.helpObjects?.activeGeos?.values()].map(el=> el.id),
      verticals:  [...creationContext.helpObjects?.activeVerticals?.values()].map(el=> el.id),
    }
    creationContext.activeSubCategory&&
    Array.isArray(creationContext.activeSubCategory?creationContext.activeSubCategory.map(el => el.id):creationContext.activeSubCategory[0])
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

          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            Специализация
          </p>
          {Array.isArray(creationContext.activeSubCategory) && creationContext.activeSubCategory.length > 0 &&
            <div className={styles.itemsWrapper}>
              { creationContext.activeSubCategory.map(el=> {
                return (<RemovableItem key={el.id} onClick={()=>onRemoveCategory(el)} text={el.name} />)
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
          <CheckboxField 
          itemClassName={styles.radioField} 
          name={'compensation'} 
          label={TranslateCompensationType(CompensationType.Contract)} 
          value={CompensationType.Contract} 
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

        <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'sources'})}>Источники</p>
        {creationContext.helpObjects?.activeSources?.size > 0 &&
          <div className={styles.itemsWrapper}>
           {creationContext.helpObjects && [...creationContext.helpObjects?.activeSources.entries()]
            .map(([key, value])=> 
            <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeSources')}/>
            )}
          </div>
        }
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'sources'})}/>
        }

        <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'geos'})}>Гео</p>
        {creationContext.helpObjects?.activeGeos?.size > 0 &&
          <div className={styles.itemsWrapper}>
           {creationContext.helpObjects && [...creationContext.helpObjects?.activeGeos?.entries()]
            .map(([key, value])=> 
            <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
            )}
          </div>
        }
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'geos'})}/>
        }

        <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'verticals'})}>Вертикали</p>
        {creationContext.helpObjects?.activeVerticals?.size > 0 &&
          <div className={styles.itemsWrapper}>
           {creationContext.helpObjects && [...creationContext.helpObjects?.activeVerticals?.entries()]
            .map(([key, value])=> 
            <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
            )}
          </div>
        }
        {!isTabletWidth &&
          <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'verticals'})}/>
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
            .map((el)=> <RemovableItem key={el.language} onClick={()=>removeLanguage(el)} text={`${languages.getName(el.language, 'ru')}, ${TranslateLanguageKnowLevel(el.level)}`} /> )
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
    <Button 
    styleType={['grey', 'wide']} 
    onClick={formik.handleReset}
    className={styles.resetButton}
    >
      Сбросить всё
    </Button>

  </div>)
}