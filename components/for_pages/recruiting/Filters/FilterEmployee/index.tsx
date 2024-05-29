import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  CompensationType,  Currency, EmploymentType, ModalType, ScheduleType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import RadioListField from 'components/fields/RadioListField'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { HelpObject, useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISource, ISpecializationCategory, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
import Spacer from 'components/ui/Spacer'
import CheckboxField from '@/components/fields/CheckboxField'
import { TranslateCompensationType,  TranslateCurrency, TranslateEmploymentType, TranslateScheduleType, TranslateSearchInType } from 'utils/enumsTranslations'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import P from '@/components/ui/P'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '../../../create/utils/TagsRadioList'
import MainSearchBar from '@/components/ui/MainSearchBar'
import Title from '@/components/ui/TitleForSection'
import { useSourcesContext } from 'context/sources_state'
import { ICountryModalProps } from '@/components/modals/CountryModal'
import { useLocationContext } from 'context/location_state'
import CrossSvg from '@/components/svg/CrossSvg'
import { ICityModalArgs } from '@/components/modals/CityModal'
import { IGeoName, ISearchCityResult } from 'data/interfaces/ILocation'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
  initialFields?: IVacancyCvSearchParams
  onCancel?: () => void
}

export default function FilterEmployee(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const creationContext = useCreateVcCvContext()
  const sourcesContext = useSourcesContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)
  const {t} = useTranslation()

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
    vacancyLookType: undefined,
    countries: [],
    cities: [],
    education: [],
    search: undefined,
    searchCompany: '',
    keywords: '',
    exclude: '',

  }

  const formik = useFormik<IVacancyCvSearchParams>({
    initialValues: {
      ...initialValues,
      ...props.initialFields,
    },
    onSubmit: props.onFilterChange
  })

  console.log(props.initialFields)


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
          formik.setFieldValue('categories', data.map(el=> el?.id))
        },
        onClose: ()=>appContext.hideBottomSheet(),
      }, 0.9)
      return
    } 
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      manyItems: true,
      onSubmit: (data)=>{
        creationContext.setActiveSubcategory(data)
        formik.setFieldValue('categories', data.map(el=> el?.id))
      },
    })
  }

  const openSourcesModal = (t: Pick<ISoursesModalArgs, 'type'>) => {
    const dataToSet:ISoursesModalArgs = {
      type: t.type,
      onSubmit: (activeSources)=>{
        const newObject = {...creationContext.helpObjects, [t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']: activeSources}
        creationContext.setHelpObjects(newObject)
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      },
      data: [...sourcesContext[t.type].values()],
      choosenElements: new Map(creationContext.helpObjects[t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals'])
    }
    if (isTabletWidth) {
      appContext.showBottomSheet<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet, t.type ==='verticals'&&380||t.type === 'geos'&&220||460)
      return
    }
    appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet)
  }


  const openCountryModal = () => {
    appContext.showModal<ICountryModalProps>(ModalType.CountryModal, {
      initials: formik.values?.countries?.map(el => locationContext.countries.get(el)),
      onSubmit: (r) => {
        formik.setFieldValue('countries', [...r.map(el => el?.geonameid)])
        locationContext.getCountries(null, r)
        creationContext.setHelpObjects({...creationContext.helpObjects, countries: r})
      },
    })
  }

  const openCityModal = () => {
    appContext.showModal<ICityModalArgs>(ModalType.CityModal, {
      initialCountries: formik.values.countries?.map(el => locationContext.countries.get(el)).filter(Boolean)||[],
      onSubmit: (r) => {
        formik.setFieldValue('cities', [...formik.values.cities, ...r.map(el => el?.id)])
        locationContext.getCities(null, null, r)
        creationContext.setHelpObjects({...creationContext.helpObjects, cities: [...creationContext.helpObjects.cities, ...r]})
      },
    })
  }

  const onRemoveCategory = (category: ISpecializationCategory) => {
    creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f?.id !== category?.id):state)
    formik.setFieldValue('categories', formik.values.categories.filter(f=> f !== category?.id))
  }

  const onRemoveCountry = (el: IGeoName) => {
    formik.setFieldValue('countries', formik.values.countries.filter(f=> f !== el?.geonameid))
    creationContext.setHelpObjects({...creationContext.helpObjects, countries: creationContext.helpObjects.countries.filter(f=> f.geonameid !== el?.geonameid)})
  }

  const onRemoveCity = (el: ISearchCityResult) => {
    formik.setFieldValue('cities', formik.values.cities.filter(f=> f !== el?.id))
    creationContext.setHelpObjects({...creationContext.helpObjects, cities: creationContext.helpObjects.cities.filter(f=> f.id !== el?.id)})
  }

  const resetAll = () => {
    formik.setValues(initialValues)
    creationContext.setActiveSubcategory([])
    const newHelpObject:HelpObject = {
      countries: [],
      cities: [],
      activeGeos: new Map,
      activeSources: new Map,
      activeVerticals: new Map,
      languageKnowledges: new Map,
    }
    creationContext.setHelpObjects(newHelpObject)
  }

  const options = {
    workExperience: WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}}),
    employmentType: Object.values(EmploymentType).map(el => {
      return  {value: el as EmploymentType, label: TranslateEmploymentType(el as EmploymentType, t, true)}
    }),
    schedule: Object.values(ScheduleType).map(el => {
      return  {value: el as ScheduleType, label: TranslateScheduleType(el as ScheduleType, t)}
    }),
    forLastNumbersOfDays: [
      {value: null, label: t('allTheTime')},
      ...periods.map(el=>{
        return {value: el?.value, label: el?.name}
      })         
    ]
  }
  
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    sourcesContext.init(['sources', 'verticals', 'geos'])
  }, [])


  useEffect(()=>{
      const _newGeos: Map<number, ISource> = new Map()
      const _newVerticals: Map<number, ISource> = new Map()
      const _newSources: Map<number, ISource> = new Map()
      props.initialFields?.geos?.forEach(el => {
        _newGeos.set(el, sourcesContext.geos.get(el))
      })
      props.initialFields?.verticals?.forEach(el => {
        _newVerticals.set(el, sourcesContext.verticals.get(el))
      })
      props.initialFields?.sources?.forEach(el => {
        _newSources.set(el, sourcesContext.sources.get(el))
      })

      creationContext.setHelpObjects(
        {...creationContext.helpObjects, 
          activeSources: _newSources,
          activeGeos: _newGeos,
          activeVerticals: _newVerticals,
          countries: props.initialFields?.countries?.map(el => locationContext.countries?.get(el)).filter(Boolean),
          cities: props.initialFields?.cities?.map(el => locationContext.cities?.get(el)).filter(Boolean),
        }
      )
  }, [props.initialFields])


  useEffect(()=>{
    const values = {
      ...formik.values,
      languageKnowledges: [...creationContext.helpObjects.languageKnowledges.values()],
      sources: [...creationContext.helpObjects.activeSources.keys()],
      verticals: [...creationContext.helpObjects.activeVerticals.keys()],
      geos: [...creationContext.helpObjects.activeGeos.keys()],
      countries: creationContext.helpObjects?.countries?.map(el=> el?.geonameid).filter(Boolean),
    }
    creationContext.activeSubCategory&&
    Array.isArray(creationContext.activeSubCategory?creationContext.activeSubCategory.map(el => el?.id):creationContext.activeSubCategory[0])
    formik.setValues(values)
  }, [creationContext.helpObjects, creationContext.activeSubCategory])



  return (<div className={styles.root}> 
    <div className={styles.top}>
      <Title title={t('search_vacancy')} onBackClick={props.onCancel}/>
      <MainSearchBar fullWidth  initialSearch={props.initialFields?.search} onChange={(v)=>formik.setFieldValue('search', v.search).then(_=>formik.submitForm())} />
    </div>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_keywords')}
          </p>
          <div className={styles.itemContent}>
            <InputField               
            className={styles.input} 
            styleType={'default'} 
            color={'default'} 
            name={'keywords'}
            suffix={<CrossSvg onClick={() => formik.setFieldValue('keywords', '')}/>}
            />
            <P className={styles.subTitle} useThemeColor styleType={['w500', 'medium']}>{t('filters_searchOnlyIn')}</P>
            {isTabletWidth &&
              <TagsRadioList 
              className={styles.tags} 
              name={'searchIn'} 
              options={TranslateSearchInType.map(el => ({value: el[0], label: el[1]}))}/>
              ||
            <RadioListField 
            itemClassName={styles.radioField}
            name={'searchIn'}
            options={TranslateSearchInType.map(el => ({value: el[0], label: el[1]}))}            
            />
          }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_findCompany')}
          </p>
          <div className={styles.itemContent}>
            <InputField               
            className={styles.input} 
            styleType={'default'} 
            color={'default'} 
            name={'searchCompany'}
            suffix={<CrossSvg onClick={() => formik.setFieldValue('searchCompany', '')}/>}
            />
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_eliminateWords')}
          </p>
          <div className={styles.itemContent}>
            <InputField               
            className={styles.input} 
            styleType={'default'} 
            color={'default'} 
            name={'exclude'}
            placeholder={t('filters_eliminateWords')}
            suffix={<CrossSvg onClick={() => formik.setFieldValue('exclude', '')}/>}
            />
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle}>
            {t('filters_incomeLevel')}
          </p>
          <div className={styles.itemContent}>
            <div className={styles.inputsWrapper}>
              <InputField  
              isNumbersOnly
              maxLength={12} 
              className={styles.input} 
              styleType={'default'} 
              color={'default'} 
              name={'salaryMin'} 
              label={t('from')} 
              labelType={'static'}
              labelClassName={styles.label}
              priceFormatting
              error={t('create_oneOfFieldsMustBeFilled')}
              suffix={<P styleType={['medium', 'greyLight']} >{TranslateCurrency(formik.values.currency)}</P>}
              />
              <span> – </span>
              <InputField  
              isNumbersOnly
              labelType={'static'}
              labelClassName={styles.label}
              maxLength={12} 
              className={styles.input} 
              styleType={'default'} 
              color={'default'} 
              name={'salaryMax'} 
              label={t('to')} 
              priceFormatting
              error={t('create_oneOfFieldsMustBeFilled')}
              suffix={<P styleType={['medium', 'greyLight']} >{TranslateCurrency(formik.values.currency)}</P>}
              />
            </div>

            <TagsRadioList className={styles.tags} name={'currency'} options={[
              {value: Currency.RUB, label: 'Руб'},
              {value: Currency.USD, label: Currency.USD},
              {value: Currency.EUR, label: 'Euro'},
              {value: Currency.GRN, label: 'Гривны'},
            ]}/>
            
            <CheckboxField 
            itemClassName={styles.radioField} 
            name={'compensation'} 
            label={TranslateCompensationType(CompensationType.Contract, t)} 
            value={CompensationType.Contract} 
            />
            {isTabletWidth&&<Spacer basis={4}/>}
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'verticals'})}>{t('filters_verticals')}</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeVerticals?.size > 0 && creationContext.helpObjects && 
              [...creationContext.helpObjects?.activeVerticals?.entries()]
              .map(([key, value])=> 
              <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
              )
            }
            {
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'verticals'})}              
              >
                {t('filters_addVerticals')}
              </P>             
            }
          </div>
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_specs')}
          </p>
          <div className={styles.itemContent}>
          {creationContext.activeSubCategory?.length === 0 && 
            <P styleType={['medium', 'w500']} useThemeColor>
              {t('filters_any')}
            </P>
          }
          {creationContext.activeSubCategory?.length > 0 &&
            creationContext.activeSubCategory?.map(el=> {
              return (<RemovableItem key={el?.id} onClick={()=>onRemoveCategory(el)} text={el?.name} />)
            })
          }
          <P 
          styleType={['medium', 'w500', 'underlined', 'blue']}
          onClick={()=>openSpecializationModal()}
          >
            {t('filters_addSpecs')}
          </P>
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_country')}
          </p>
          <div className={styles.itemContent}>
          {creationContext.helpObjects?.countries?.length > 0 &&
            creationContext.helpObjects.countries.map(el=> {
              return (<RemovableItem key={el?.geonameid} onClick={()=>{onRemoveCountry(el)}} text={el?.locName} />)
            })
          }
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            onClick={openCountryModal}
            >
              {t('filters_addCountry')}
            </P>
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openCityModal()}>
            {t('filters_region')}
          </p>
          <div className={styles.itemContent}>
          {creationContext.helpObjects?.cities?.length > 0 &&
            creationContext.helpObjects.cities.map(el=> {
              return (<RemovableItem key={el?.id} onClick={()=>onRemoveCity(el)} text={el?.name} />)
            })
          }
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            onClick={openCityModal}
            >
              {t('filters_addRegion')}
            </P>
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'sources'})}>
            {t('filters_sources')}
          </p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeSources?.size > 0 && creationContext.helpObjects && 
              [...creationContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeSources')}/>
              )
            }
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'sources'})}
              >
                {t('filters_addSources')}
              </P>
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'geos'})}>{t('filters_geos')}</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeGeos?.size > 0 && creationContext.helpObjects && 
                [...creationContext.helpObjects?.activeGeos?.entries()].map(([key, value])=> 
                  <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
                )
            }
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'geos'})}            
              >
                {t('filters_addGeos')}
              </P>
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            <span>{t('filters_experience')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>*/}
          </p>
          {isTabletWidth && 
            <TagsRadioList 
            checkbox
            className={styles.tags} 
            name={'experience'} 
            options={options.workExperience}/>
            ||
            <CheckboxListField 
            name={'experience'} 
            rootClass={styles.radioField}
            options={options.workExperience}
            />
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            {t('filters_employmentType')}
          </p>
          {isTabletWidth &&
            <TagsRadioList 
            checkbox
            className={styles.tags} 
            name={'employment'} 
            options={options.employmentType}/>
            ||
            
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'employment'} 
            options={options.employmentType}/>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 4 ? null : 4)}>
            <span>{t('filters_schedule')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 4&&styles.active}/>*/}
          </p>
          {isTabletWidth &&
            <TagsRadioList 
            checkbox
            className={styles.tags} 
            name={'schedule'} 
            options={options.schedule}/>
            ||
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'schedule'}
            options={options.schedule} 
            />
          }
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
            <span>{t('filters_publishedAt')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>*/}
          </p>
          {isTabletWidth &&
            <TagsRadioList 
            className={styles.tags} 
            name={'forLastNumberOfDays'} 
            options={options.forLastNumbersOfDays}/>
            ||
            <RadioListField 
            name={'forLastNumberOfDays'}
            rootClass={styles.radioField}
            options={options.forLastNumbersOfDays} 
            />
          }
        </div>

      </Form> 
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button 
      styleType={['grey']} 
      altStyleType={['whitePurple']}
      onClick={resetAll}
      className={styles.resetButton}
      >
        {t('filters_clearAll')}
      </Button>

      <Button
      styleType={['gradient']}
      onClick={()=>props.onFilterChange(formik.values)}
      >
        {t('searchAlt')}
      </Button>
    </div>
  </div>)
}