import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  Answer,  EmploymentType, Genders,  ModalType,  ScheduleType, VacancyLookType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import {  IVacancyCvSearchParams } from 'data/interfaces/Common'
import Accordeon from 'components/ui/Accordeon'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Spacer from 'components/ui/Spacer'
import { useSourcesContext } from 'context/sources_state'
import InputField from '@/components/fields/InputField'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import P from '@/components/ui/P'
import { ISpecializationModalProps } from '@/components/modals/CvModals/Specialization'
import ChevronDownSvg from '@/components/svg/ChevronDownSvg'
import { useLocationContext } from 'context/location_state'
import { ICountryModalProps } from '@/components/modals/CountryModal'
import { ICityModalArgs } from '@/components/modals/CityModal'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
  initialFields: IVacancyCvSearchParams
}

//TODO: получение категорий, вертикалей, источников, стран, городов, добавить возраст
export default function SideFilters(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const sourcesContext = useSourcesContext()
  const creationContext = useCreateVcCvContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)
  const [showMore, setShowMore] = useState(false)


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
      verticals: [],
      sources: [],
      ageMax: undefined,
      ageMin: undefined,
      countries: [],
      cities: [],
      ...props.initialFields
    },
    onSubmit: null
  })

  const openSpecModal = () => {
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      manyItems: true,
      activeSubCategories: formik.values.categories.map(el => creationContext.subCategories.get(el)).filter(Boolean),
      onSubmit: (r) => {
        creationContext.setSubCategories(null, r)
        formik.setFieldValue('categories', [...formik.values.categories, ...r.map(el => el.id)])
      },
      onClose: null,
    })
  }

  const openCountryModal = () => {
    appContext.showModal<ICountryModalProps>(ModalType.CountryModal, {
      onSubmit: (r) => {
        formik.setFieldValue('countries', [...formik.values.countries, ...r.map(el => el.geonameid)])
        locationContext.getCountries(null, r)
      },
    })
  }

  const openCityModal = () => {
    appContext.showModal<ICityModalArgs>(ModalType.CityModal, {
      initialCountries: formik.values.countries.map(el => locationContext.countries.get(el)).filter(Boolean),
      onSubmit: (r) => {
        formik.setFieldValue('cities', [...formik.values.cities, ...r.map(el => el.id)])
        locationContext.getCities(null, null, r)
      },
    })
  }
 
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    sourcesContext.init(['source', 'vertical'])
    creationContext.setSubCategories({search: undefined, page: 1, withCVsCount: true, limit: 3})
    locationContext.getCountries({page: 1, limit: 3})
  }, [])

  useEffect(()=>{
    if(formik.values.countries.length > 0){
      formik.setFieldValue('cities', [])
      locationContext.getCities({page: 1, limit: 3}, formik.values?.countries?.map(el=> locationContext.countries?.get(el)?.country))      
    }
  }, [formik.values.countries])

  useEffect(()=>{
    props.onFilterChange(formik.values)
  }, [formik.values])

  return (<div className={styles.root}> 
    <FormikProvider value={formik}>
      <Form>
        <p className={styles.fieldTitle}>
          <span>Специализации </span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'categories'} 
          itemLabelClassName={styles.categoryLabel}
          options={[...creationContext.subCategories.values()].map(el=> {
            return {value: el.id, label: <P className={styles.categoryLabel}>{el.name} <span>{el.cvsCount}</span></P> }
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openSpecModal}
        >
          Выбрать еще
        </P>

        <div className={styles.divider}></div>


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

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Страна</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'countries'} 
          options={[...locationContext.countries.entries()].map(el=>{
            return {value: el[0], label: el[1].locName}
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openCountryModal}
        >
          Выбрать еще
        </P>

        <div className={styles.divider}></div>
        
        {formik.values.countries && formik.values.countries.length > 0 && <>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
            <span>Город</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
          </p>
          <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'cities'} 
            options={[...locationContext.cities.entries()].map(el=> {
              return {value: el[0], label: el[1].name}
            })}/>

            {isTabletWidth&&<Spacer basis={4}/>}
          </Accordeon>
          <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
          onClick={openCityModal}
          >
            Выбрать еще
          </P>

          <div className={styles.divider}></div>
        </>}

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


        {!showMore &&
        <>
          <div className={styles.divider}></div>

          <P styleType={['medium', 'w500', 'blue']} className={styles.addFilters}
          onClick={()=> setShowMore(true)}
          >
            Показать еще фильтры <ChevronDownSvg/>
          </P>
        </>
        }

        {showMore && <>
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

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>Возраст</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <div className={styles.inputsWrapper}>
          <InputField  
          isNumbersOnly
          maxLength={2} 
          className={styles.input} 
          styleType={'default'} 
          color={'default'} 
          name={'ageMin'} 
          label={'от'} 
          labelType={'static'}
          labelClassName={styles.label}
          priceFormatting
          error='Одно из полей должно быть заполнено'
          />
          <span> – </span>
          <InputField  
          isNumbersOnly
          labelType={'static'}
          labelClassName={styles.label}
          maxLength={2} 
          className={styles.input} 
          styleType={'default'} 
          color={'default'} 
          name={'ageMax'} 
          label={'до'} 
          priceFormatting
          error='Одно из полей должно быть заполнено'
          />
        </div>

        <div className={styles.divider}></div>

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

        <div className={styles.divider}></div>

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

        <div className={styles.divider}></div>

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

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} >
          <span>Источники</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 5} disabled={!isTabletWidth}>
          <CheckboxListField 
          name={'sources'} 
          rootClass={styles.radioField}
          options={
            [...sourcesContext.sources.values()].map(el=> {
              return {
                value: el.id,
                label: el.title
              }
            })
          }
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle}>
          <span>Вертикали</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 5} disabled={!isTabletWidth}>
          <CheckboxListField 
          name={'verticals'} 
          rootClass={styles.radioField}
          options={
            [...sourcesContext.verticals.values()].map(el=> {
              return {
                value: el.id,
                label: el.title
              }
            })
          }
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        </>}

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