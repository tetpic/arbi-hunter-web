import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  Answer,  EmploymentType, Genders,  ScheduleType, VacancyLookType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import {  IVacancyCvSearchParams } from 'data/interfaces/Common'
import Accordeon from 'components/ui/Accordeon'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Spacer from 'components/ui/Spacer'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
}

//TODO: получение категорий, вертикалей, источников, стран, городов, добавить возраст
export default function SideFilters(props: Props) {
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
      gender: [],
      vacancyLookType: [], 
      relocation: [],
    },
    onSubmit: null
  })

 
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
        <p className={styles.fieldTitle}>
          Специализации
        </p>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Статус поиска</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'vacancyLookType'} 
          options={[
            {value: VacancyLookType.ActivelyLooking, label: 'В активном поиске'},
            {value: VacancyLookType.PassivelyLooking, label: 'Рассматривает предложения'},
            {value: VacancyLookType.NotLooking, label: 'Не рассматривает предложения'},
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Страна</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Город</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Переезд</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'relocation'} 
          options={[
            {value: Answer.Yes, label: 'Живут или готовы переехать в регион'},
            {value: Answer.No, label: 'Не готовы к переезду'},
            {value: null, label: 'Не имеет значения'},
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Пол</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'gender'} 
          options={[
            {value: Genders.Female, label: 'Жен'},
            {value: Genders.Male, label: 'Муж'},
            {value: null, label: 'Не имеет значения'},
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Возраст</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
          <span>Тип занятости</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={[
            {value: EmploymentType.FullTime, label: 'Полная занятость'},
            {value: EmploymentType.PartTime, label: 'Частичная занятость'},
            {value: EmploymentType.Project, label: 'Проектная работа'}
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
          <span>График работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'schedule'} 
          options={[
            {label: 'Полный день', value: ScheduleType.FullDay},
            {label: 'Гибкий график', value: ScheduleType.Flexible},
            {label: 'Удаленная работа', value: ScheduleType.Remote},
          ]} 
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

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

        <p className={styles.fieldTitle} >
          Источники
        </p>

        <p className={styles.fieldTitle}>
          Вертикали
        </p>

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