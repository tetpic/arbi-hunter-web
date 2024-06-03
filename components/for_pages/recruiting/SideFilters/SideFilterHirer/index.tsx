import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  Answer,  EmploymentType, Genders,  ModalType,  ScheduleType, VacancyLookType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
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
import {   TranslateEmploymentType, TranslateScheduleType, TranslateVacancyLookType } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import CheckboxField from '@/components/fields/CheckboxField'

interface Props {
  onFilterChange: (data: Partial<IVacancyCvSearchParams>) => void
  initialFields: Partial<IVacancyCvSearchParams>
}

export default function SideFilterHirer(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const sourcesContext = useSourcesContext()
  const creationContext = useCreateVcCvContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)
  const [showMore, setShowMore] = useState(false)
  const {t} = useTranslation()

  const initialValues:Partial<IVacancyCvSearchParams> = {
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
    isRemote: undefined,
  }


  const formik = useFormik<Partial<IVacancyCvSearchParams>>({
    initialValues,
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
      initials: formik.values.countries.map(el => locationContext.countries.get(el as number)),
      onSubmit: (r) => {
        formik.setFieldValue('countries', [...r.map(el => el?.geonameid)])
        locationContext.getCountries(null, r)
      },
    })
  }

  const openCityModal = () => {
    appContext.showModal<ICityModalArgs>(ModalType.CityModal, {
      initialCountries: formik.values.countries.map(el => locationContext.countries.get(el as number)).filter(Boolean),
      onSubmit: (r) => {
        formik.setFieldValue('cities', [...formik.values.cities, ...r.map(el => el.id)])
        locationContext.getCities(null, null, r)
      },
    })
  }

  const init = async() => {
    sourcesContext.init(['sources', 'verticals', 'geos'])
    creationContext.setSubCategories({search: undefined, withCVsCount: true})   
    locationContext.getCountries({page: 1, limit: 195})
    locationContext.getCities({page: 1, limit: 3}, [])
    locationContext.getInitialGeonames({countries: props.initialFields.countries as number[], cities: props.initialFields.cities as number[]})
    formik.setValues((v) => ({...v, ...props.initialFields}))
  }
 
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    init()
  }, [])


  useEffect(()=>{
    if(formik.values.countries.length > 0) {
      locationContext.countries.size > 0 && locationContext.getCities({page: 1, limit: 3}, formik.values?.countries?.map(el=> locationContext.countries?.get(el as number)?.country))  
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
          <span>{t('filters_specializations')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'categories'} 
          itemLabelClassName={styles.categoryLabel}
          options={
            [...creationContext.activeSubCategory.filter(Boolean),
              ...[...creationContext.subCategories.entries()].filter(([k, v])=> !formik.values.categories.includes(k)).map(el=> el[1]).slice(0, 3)
            ].map(el=> {
              return {value: el.id, label: <P useThemeColor className={styles.categoryLabel}>{el.name} <span>{el.cvsCount}</span></P> }
            })
          }/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openSpecModal}
        >
          {t('filters_chooseMore')}
        </P>

        <div className={styles.divider}></div>


        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('filters_vacancyLookType')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'vacancyLookType'} 
          options={Object.values(VacancyLookType).map(el => {
              return {value: el, label: TranslateVacancyLookType(el, ProfileType.Hirer, t)}
            })
          }/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <div className={styles.divider}></div>       

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('country')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'countries'} 
          options={[
            ...formik.values.countries?.map(el => locationContext.countries.get(el as number)), 
            ...[...locationContext.countries?.values()].filter(el => !formik.values.countries.includes(el?.geonameid)).slice(0, 3)]
            .map(el=>{
            return {value: el?.geonameid, label: el?.locName}
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openCountryModal}
        >
          {t('filters_chooseMore')}
        </P>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('city')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'cities'} 
          options={[
            ...formik.values.cities?.map(el => locationContext.cities.get(el as number)),
            ...[...locationContext.cities.values()].filter(c => !formik.values.cities.includes(c?.id))].map(el=> {
            return {value: el?.id, label: el?.name}
          })}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>
        <P styleType={['medium', 'w500', 'blue', 'alignEnd']} className={styles.viewMore}
        onClick={openCityModal}
        >
          {t('filters_chooseMore')}
        </P>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('filters_relocation')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'relocation'} 
          options={[
            {value: Answer.Yes, label: t('filters_relocationYes')},
            {value: Answer.No, label: t('filters_relocationNo')},
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>


        {!showMore &&
        <>
          <div className={styles.divider}></div>

          <P styleType={['medium', 'w500', 'blue']} className={styles.addFilters}
          onClick={()=> setShowMore(true)}
          >
            {t('filters_showMoreFilters')} <ChevronDownSvg/>
          </P>
        </>
        }


        {showMore && <>
        
        <div className={styles.divider}></div>
        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('gender')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'gender'} 
          options={[
            {value: Genders.Female, label: t('gender_female')},
            {value: Genders.Male, label: t('gender_male')},
          ]}/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 2 ? null : 2)}>
          <span>{t('age')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 2&&styles.active}/>}
        </p>
        <div className={styles.inputsWrapper}>        
          <InputField  
          isNumbersOnly
          maxLength={2} 
          className={styles.input} 
          styleType={'default'} 
          color={'default'} 
          name={'ageMin'} 
          value={formik.values.ageMin}
          label={t('from')} 
          labelType={'static'}
          labelClassName={styles.label}          
          error={t('create_oneOfFieldsMustBeFilled')}
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
          value={formik.values.ageMax}
          label={t('to')}           
          error={t('create_oneOfFieldsMustBeFilled')}
          />
        </div>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
          <span>{t('filters_employmentType')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'employment'} 
          options={
            Object.values(EmploymentType).map((el) => {return {label: TranslateEmploymentType(el, t, true), value: el}})
          }/>
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
          <span>{t('filters_schedule')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
        </p>
        <Accordeon isActive={activeAccordeon === 3} disabled={!isTabletWidth}>
          <CheckboxListField 
          rootClass={styles.radioField}
          name={'schedule'} 
          options={[
            {label: TranslateScheduleType(ScheduleType.FullDay, t), value: ScheduleType.FullDay},
            {label: TranslateScheduleType(ScheduleType.Flexible, t), value: ScheduleType.Flexible},
          ]} 
          />
           <CheckboxField 
          rootClass={styles.radioField}
          name={'isRemote'} 
          value={true}
          label={TranslateScheduleType(ScheduleType.Remote, t)}
          />
          {isTabletWidth&&<Spacer basis={4}/>}
        </Accordeon>

        <div className={styles.divider}></div>

        <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
          <span>{t('filters_experience')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>}
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
          <span>{t('filters_sourcesAlt')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
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
          <span>{t('filters_verticals')}</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 3&&styles.active}/>}
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
    type={'button'}
    styleType={['grey', 'wide']} 
    altStyleType={['whitePurple', 'wide']}
    onClick={()=>formik.setValues(initialValues)}
    className={styles.resetButton}
    >
      {t('filters_clearAll')}
    </Button>

  </div>)
}