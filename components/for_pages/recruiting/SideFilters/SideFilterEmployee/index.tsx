import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import { Currency,  EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import {  IVacancyCvSearchParams } from 'data/interfaces/Common'
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
import TagsRadioList from '@/components/for_pages/create/utils/TagsRadioList'
import { periods } from 'utils/commonObjects'
import RadioListField from '@/components/fields/RadioListField'


interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
  initialFields: IVacancyCvSearchParams
}

export default function SideFilterEmployee(props: Props) {
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
      geos: [],
      ageMax: undefined,
      ageMin: undefined,
      countries: [],
      cities: [],
      exclude: ''
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
      initials: formik.values.countries.map(el => locationContext.countries.get(el)),
      onSubmit: (r) => {
        
        formik.setFieldValue('countries', [...r.map(el => el.geonameid)])
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

  const init = async() => {
    sourcesContext.init(['sources', 'verticals', 'geos'])
    creationContext.setSubCategories({search: undefined, withCVsCount: true})   
    locationContext.getCountries({page: 1, limit: 3})
    locationContext.getInitialGeonames({countries: props.initialFields.countries, cities: props.initialFields.cities})
    formik.setValues((v) => ({...v, ...props.initialFields}))
  }
 
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    init()
  }, [])

  useEffect(()=>{
    if(formik.values.countries.length > 0) {
      locationContext.countries.size > 0 && locationContext.getCities({page: 1, limit: 3}, formik.values?.countries?.map(el=> locationContext.countries?.get(el)?.country))      
    }
  }, [formik.values.countries, locationContext.countries])

  useEffect(()=>{
    creationContext.setActiveSubcategory(_=>{
      const result = formik.values.categories.map(el=> creationContext.subCategories.get(el))
      return result
    })
  }, [formik.values.categories, creationContext.subCategories])

  useEffect(()=>{
    props.onFilterChange(formik.values)
  }, [formik.values])




  return (<div className={styles.root}> 
    <FormikProvider value={formik}>
      <Form>

        <p className={styles.fieldTitle}>
          <span>Специализации </span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <CheckboxListField 
        rootClass={styles.radioField}
        name={'categories'} 
        itemLabelClassName={styles.categoryLabel}
        options={
          [...creationContext.activeSubCategory.filter(Boolean),
            ...[...creationContext.subCategories.entries()].filter(([k, v])=> !formik.values.categories.includes(k)).map(el=> el[1]).slice(0, 3)
          ].map(el=> {
            return {value: el.id, label: <P className={styles.categoryLabel}>{el.name} <span>{el.cvsCount}</span></P> }
          })
        }/>
        {isTabletWidth&&<Spacer basis={4}/>}
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openSpecModal}
        >
          Выбрать еще
        </P>
        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>Исключить слова</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <InputField styleType={'default'} color={'white'} name={'exclude'} placeholder='Исключить слова'/>
        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>Уровень дохода</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <div className={styles.inputsWrapper}>
          <InputField 
          styleType={'hidden'} 
          color={'white'} 
          name={'salaryMax'}
          label='от'
          labelType={'static'}
          />
          <span>-</span>
          <InputField 
          styleType={'hidden'} 
          color={'white'} 
          name={'salaryMin'}
          label='до'
          labelType={'static'}
          />
        </div>
        <TagsRadioList className={styles.tags} name={'currency'} options={[
          {value: Currency.RUB, label: 'Рубли'},
          {value: Currency.USD, label: 'Доллары'},
          {value: Currency.EUR, label: 'Евро'},
          {value: Currency.GRN, label: 'Гривны'},
        ]}/>
        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>Вертикаль</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
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
        <div className={styles.divider}></div>



        {!showMore &&
        <>
          <P styleType={['medium', 'w500', 'blue']} className={styles.addFilters}
          onClick={()=> setShowMore(true)}
          >
            Показать еще фильтры <ChevronDownSvg/>
          </P>
        </>
        }

        {showMore && <>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
            <span>Страна</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
          </p>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'countries'} 
          options={[...locationContext.countries?.entries()].map(el=>{
            return {value: el[0], label: el[1].locName}
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
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
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'cities'} 
            options={[...locationContext.cities.entries()].map(el=> {
              return {value: el[0], label: el[1].name}
            })}/>
            {isTabletWidth&&<Spacer basis={4}/>}
            <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
            onClick={openCityModal}
            >
              Выбрать еще
            </P>
            <div className={styles.divider}></div>
          </>}

          <p className={styles.fieldTitle} >
            <span>Источники</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
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
          <div className={styles.divider}></div>

          <p className={styles.fieldTitle} >
            <span>Гео</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <CheckboxListField 
          name={'geos'} 
          rootClass={styles.radioField}
          options={
            [...sourcesContext.geos.values()].map(el=> {
              return {
                value: el.id,
                label: el.title
              }
            })
          }
          />
          {isTabletWidth&&<Spacer basis={4}/>}
          <div className={styles.divider}></div>

          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            <span>Требуемый опыт работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>}
          </p>
          <CheckboxListField 
          name={'experience'} 
          rootClass={styles.radioField}
          options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
          />
          {isTabletWidth&&<Spacer basis={4}/>}
         <div className={styles.divider}></div>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>Тип занятости</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={[
            {value: EmploymentType.FullTime, label: 'Полная занятость'},
            {value: EmploymentType.PartTime, label: 'Частичная занятость'},
            {value: EmploymentType.Project, label: 'Проектная работа'}
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
          <div className={styles.divider}></div>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>График работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
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
          <div className={styles.divider}></div>

          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>Время публикации</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <RadioListField 
            name={'forLastNumberOfDays'}
            rootClass={styles.radioField}
            options={[
              {value: null, label: 'Все время'},
              ...periods.map(el=>{
                return {value: el.value, label: el.name}
              })         
            ]} 
            />
          {isTabletWidth&&<Spacer basis={4}/>}

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