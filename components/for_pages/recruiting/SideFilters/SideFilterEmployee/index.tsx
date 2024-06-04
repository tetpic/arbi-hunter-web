import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import { AppTheme, CompensationType, Currency,  EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
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
import { TranslateCompensationType, TranslateEmploymentType, TranslateScheduleType } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'
import CheckboxField from '@/components/fields/CheckboxField'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'


interface Props {
  onFilterChange: (data:  Partial<IVacancyCvSearchParams>, _page?: number) => void
  initialFields:  Partial<IVacancyCvSearchParams>
}

export default function SideFilterEmployee(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const sourcesContext = useSourcesContext()
  const creationContext = useCreateVcCvContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)
  const [showMore, setShowMore] = useState(false)
  const {t} = useTranslation()
  const isLightTheme = appContext.theme === AppTheme.Light
  const isInited = useRef<boolean>(false)




  const formik = useFormik< Partial<IVacancyCvSearchParams>>({
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
      exclude: '',
      isRemote: undefined,
      salaryMin: '',
      salaryMax: '',
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
    })
  }

  const openCountryModal = () => {
    appContext.showModal<ICountryModalProps>(ModalType.CountryModal, {
      initials: formik.values.countries.map(el => locationContext.countries.get(Number(el))),
      onSubmit: (r) => {   
        formik.setFieldValue('countries', [...r.map(el => el.geonameid)])
        locationContext.getCountries(null, r)
      },
    })
  }

  const openCityModal = () => {
    appContext.showModal<ICityModalArgs>(ModalType.CityModal, {
      initialCountries: formik.values.countries.map(el => locationContext.countries.get(Number(el))).filter(Boolean),
      onSubmit: (r) => {
        formik.setFieldValue('cities', [...formik.values.cities, ...r.map(el => el.id)])
        locationContext.getCities(null, null, r)
        setTimeout(()=> {appContext.hideModal()}, 50)
      },
    })
  }

  const init = async() => {
    sourcesContext.init(['sources', 'verticals', 'geos'])
    // такой лимит поставлен потому что нет метода для получения списка именно субкатегорий по id
    creationContext.setSubCategories({search: undefined, withVacanciesCount: true, limit: 2000})   
    locationContext.getCountries({page: 1, limit: 195})
    locationContext.getInitialGeonames({countries: props.initialFields.countries as number[], cities: props.initialFields.cities})

    formik.setValues((v) => ({...v, ...props.initialFields}))
    setTimeout(()=>{
      isInited.current = true
    }, 1000)
  }
 
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    init()
  }, [])

  useEffect(()=>{
    if(formik.values.countries.length > 0) {
      locationContext.countries.size > 0 && locationContext.getCities({page: 1, limit: 3}, formik.values?.countries?.map(el=> locationContext.countries?.get(Number(el))?.country))      
    }
  }, [formik.values.countries, locationContext.countries])

  useEffect(()=>{
    creationContext.setActiveSubcategory(_=>{
      const result = formik.values.categories.map(el=> creationContext.subCategories.get(el))
      return [...result]
    })
  }, [formik.values.categories, creationContext.subCategories])

  useEffect(()=>{
    if(!isInited.current) return
    props.onFilterChange(formik.values, 1)
  }, [formik.values])




  return (<div className={classNames(styles.root, isLightTheme&&styles.root_light)}> 
    <FormikProvider value={formik}>
      <Form>
        <p className={styles.fieldTitle}>
          <span>{t('filters_specializations')} </span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <CheckboxListField 
        rootClass={styles.radioField}
        name={'categories'} 
        itemLabelClassName={styles.categoryLabel}
        options={
          [
            ...creationContext.activeSubCategory.filter(Boolean),
            ...[...creationContext.subCategories.entries()].filter(([k, v])=> !formik.values.categories.includes(k)).map(el=> el[1]).slice(0, 3)
          ].map(el=> {
            return {value: el?.id, label: <P useThemeColor className={styles.categoryLabel}>{el?.name} {el?.vacanciesCount &&<span>{el?.vacanciesCount}</span>}</P> }
          })
        }/>
        {isTabletWidth&&<Spacer basis={4}/>}
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openSpecModal}
        >
          {t('filters_chooseMore')}
        </P>
        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>{t('filters_eliminateWords')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <InputField styleType={'default'} color={'white'} name={'exclude'} placeholder={t('filters_eliminateWords')}/>
        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>{t('filters_incomeLevel')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <div className={styles.inputsWrapper}>
          <InputField 
          styleType={'hidden'} 
          color={'white'} 
          name={'salaryMin'}
          label={t('from')}
          labelType={'static'}
          isNumbersOnly
          priceFormatting
          />
          <span>-</span>
          <InputField 
          styleType={'hidden'} 
          color={'white'} 
          name={'salaryMax'}
          label={t('to')}
          labelType={'static'}
          isNumbersOnly
          priceFormatting

          />
        </div>
        <TagsRadioList wrap className={styles.tags} name={'currency'} options={[
          {value: Currency.RUB, label: t('rubFull')},
          {value: Currency.USD, label: t('dollars')},
          {value: Currency.EUR, label: t('euro')},
          {value: Currency.GRN, label: t('grivnes')},
        ]}/>
        <Spacer basis={16}/>
        <CheckboxField 
        itemClassName={styles.radioField} 
        name={'compensation'} 
        label={TranslateCompensationType(CompensationType.Contract, t)} 
        value={CompensationType.Contract} 
        />

        <div className={styles.divider}></div>


        <p className={styles.fieldTitle}>
          <span>{t('filters_vertical')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
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
            {t('filters_showMoreFilters')} <ChevronDownSvg/>
          </P>
        </>
        }

        {showMore && <>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
            <span>{t('country')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
          </p>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'countries'} 
          options={[
            ...formik.values.countries.map(el => locationContext.countries.get(Number(el))), 
            ...[...locationContext.countries?.values()].filter(el => !formik.values.countries.includes(el.geonameid)).slice(0, 3)]
            .map(el=>{
            return {value: el.geonameid, label: el.locName}
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
          <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
          onClick={openCountryModal}
          >
            {t('filters_chooseMore')}
          </P>
          <div className={styles.divider}></div>
        
          {formik.values.countries && formik.values.countries.length > 0 && <>
            <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
              <span>{t('city')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
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
              {t('filters_chooseMore')}
            </P>
            <div className={styles.divider}></div>
          </>}

          <p className={styles.fieldTitle} >
            <span>{t('filters_sourcesAlt')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
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
            <span>{t('filters_geos')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
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
            <span>{t('filters_workExperience')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>}
          </p>
          <CheckboxListField 
          name={'experience'} 
          rootClass={styles.radioField}
          options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
          />
          {isTabletWidth&&<Spacer basis={4}/>}
         <div className={styles.divider}></div>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>{t('filters_employmentType')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={[
            {value: EmploymentType.FullTime, label: TranslateEmploymentType(EmploymentType.FullTime, t, true)},
            {value: EmploymentType.PartTime, label:  TranslateEmploymentType(EmploymentType.PartTime, t, true)},
            {value: EmploymentType.Project, label:  TranslateEmploymentType(EmploymentType.Project, t, true)}
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
          <div className={styles.divider}></div>


          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>{t('filters_schedule')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'schedule'} 
          options={[
            {label: TranslateScheduleType(ScheduleType.FullDay, t), value: ScheduleType.FullDay},
            {label: TranslateScheduleType(ScheduleType.Flexible, t), value: ScheduleType.Flexible},
            // {label: TranslateScheduleType(ScheduleType.Remote, t), value: ScheduleType.Remote},
          ]} 
          />
          <CheckboxField 
          rootClass={styles.radioField}
          name={'isRemote'} 
          value={true}
          label={TranslateScheduleType(ScheduleType.Remote, t)}
          // options={[
          //   // {label: TranslateScheduleType(ScheduleType.FullDay, t), value: ScheduleType.FullDay},
          //   // {label: TranslateScheduleType(ScheduleType.Flexible, t), value: ScheduleType.Flexible},
          //   {label: TranslateScheduleType(ScheduleType.Remote, t), value: ScheduleType.Remote},
          // ]} 
          />
          {isTabletWidth&&<Spacer basis={4}/>}
          <div className={styles.divider}></div>

          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            <span>{t('filters_publishedAt')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
          </p>
          <RadioListField 
            name={'forLastNumberOfDays'}
            rootClass={styles.radioField}
            options={[
              {value: null, label: t('allTheTime')},
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
    altStyleType={['whitePurple', 'wide']}
    onClick={formik.handleReset}
    className={styles.resetButton}
    >
      {t('filters_clearAll')}
    </Button>

  </div>)
}