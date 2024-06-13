import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  AppTheme, CompensationType,  Currency,  EducationTypes,  EmploymentType, ModalType, ScheduleType, VacancyLookType, WorkExperience } from 'types/enums'
import { useEffect, useState } from 'react'
import RadioListField from 'components/fields/RadioListField'
import { useAppContext } from 'context/state'
import { HelpObject, useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISource, ISpecializationCategory, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
import CheckboxField from '@/components/fields/CheckboxField'
import { TranslateCompensationType,  TranslateCurrency,  TranslateEducationType,  TranslateEmploymentType,  TranslateLanguage,  TranslateLanguageKnowLevel, TranslateScheduleType, TranslateVacancyLookType, TranslateWorkExperience } from 'utils/enumsTranslations'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import { ILangaugesModalArgs } from '@/components/modals/CvModals/Languages'
import P from '@/components/ui/P'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '../../../create/utils/TagsRadioList'
import MainSearchBar from '@/components/ui/MainSearchBar'
import Title from '@/components/ui/TitleForSection'
import { useSourcesContext } from 'context/sources_state'
import { ICountryModalProps } from '@/components/modals/CountryModal'
import { useLocationContext } from 'context/location_state'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import { HirerFieldType, HirerFieldsModalArgs } from '@/components/modals/HirerFieldsModal'
import { SalaryModalArgs } from '@/components/modals/SalaryModal'
import { colors } from 'styles/variables'
import { IGeoName } from 'data/interfaces/ILocation'

interface Props {
  onFilterChange: (data: Partial<IVacancyCvSearchParams>) => void
  initialFields?: IVacancyCvSearchParams
  onCancel?: () => void
}

export default function FilterHirer(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light
  const creationContext = useCreateVcCvContext()
  const sourcesContext = useSourcesContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)

  const initialValues:Partial<IVacancyCvSearchParams> = {
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
      ...props.initialFields
    },
    onSubmit: props.onFilterChange
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
    const _args: ISpecializationModalProps = {
      manyItems: true,
      activeSubCategories: creationContext.activeSubCategory,
      onSubmit: (data)=>{
        const categoriesMap: Map<number, ISpecializationCategory> = new Map()
        creationContext.activeSubCategory.map(el => categoriesMap.set(el?.id, el))
        data.forEach(el => categoriesMap.set(el?.id, el))
        creationContext.setActiveSubcategory([...categoriesMap.values()])
        formik.setFieldValue('categories', [...categoriesMap.keys()])
      },
      onClose: ()=>{appContext.hideBottomSheet(), appContext.hideModal()},
    }
    isTabletWidth
    ?appContext.showBottomSheet<ISpecializationModalProps>(ModalType.SpecializationModal, _args, 0.9)
    :appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, _args)
  }

  const openCompensationModal = (title: string) => {
    if(isTabletWidth) {
      appContext.showBottomSheet<SalaryModalArgs>(ModalType.SalaryModal, {
        initialValues: {
          salaryMax: formik.values.salaryMax,
          salaryMin: formik.values.salaryMin,
          currency: formik.values.currency
        },
        title,
        onSubmit: (data)=>{
          formik.setValues({...formik.values, ...data})
          appContext.hideBottomSheet()
        }
      }, 300)
    }
  }

  const openSourcesModal = (t: Pick<ISoursesModalArgs, 'type'>) => {
    const dataToSet:ISoursesModalArgs = {
      type: t.type,
      onSubmit: (activeSources)=>{
        const newObject = {...creationContext.helpObjects, [t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']: activeSources}
        creationContext.setHelpObjects(newObject)
        appContext.hideModal()
        appContext.hideBottomSheet()
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

  const openCountryModal = () => {
    appContext.showModal<ICountryModalProps>(ModalType.CountryModal, {
      initials: formik.values.countries?.map(el => locationContext.countries.get(Number(el))),
      onSubmit: (r) => {
        formik.setFieldValue('countries', [...r.map(el => el?.geonameid)])
        locationContext.getCountries(null, r)
        creationContext.setHelpObjects({...creationContext.helpObjects, countries: r})
      },
    })
  }

  const onRemoveCategory = (category: ISpecializationCategory) => {
    creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f.id !== category.id):state)
    formik.setFieldValue('categories', formik.values.categories.filter(f=> f !== category.id))
  }

  const resetAll = () => {
    formik.setValues(initialValues)
    creationContext.setActiveSubcategory([])
    const newHelpObject:HelpObject = {
      countries: [],
      activeGeos: new Map,
      activeSources: new Map,
      activeVerticals: new Map,
      languageKnowledges: new Map,
    }
    creationContext.setHelpObjects(newHelpObject)
  }

  const onRemoveCountry = (el: IGeoName) => {
    formik.setFieldValue('countries', formik.values.countries.filter(f=> f !== el?.geonameid))
    creationContext.setHelpObjects({...creationContext.helpObjects, countries: creationContext.helpObjects.countries.filter(f=> f.geonameid !== el?.geonameid)})
  }

  const openFieldsModal = (type: HirerFieldType, title: string, height: number) => {
    if(isTabletWidth) {
      appContext.showBottomSheet<HirerFieldsModalArgs>(ModalType.HirerFieldsModal, {
        type,
        title,
        initialFields: {[type]: formik.values[type]},
        onSubmit: (data)=>{
          formik.setValues({...formik.values, ...data})
          appContext.hideBottomSheet()
        },
      }, height)
      return
    } 
  }

  useEffect(()=>{
    sourcesContext.init(['sources', 'verticals', 'geos'])
  }, [])

  useEffect(()=>{
      const _newGeos: Map<number, ISource> = new Map()
      const _newVerticals: Map<number, ISource> = new Map()
      const _newSources: Map<number, ISource> = new Map()
      const _newLangs: Map<string, ILanguageKnowledge> = new Map()

      props.initialFields?.geos?.forEach(el => {
        _newGeos.set(el, sourcesContext.geos.get(el))
      })
      props.initialFields?.verticals?.forEach(el => {
        _newVerticals.set(el, sourcesContext.verticals.get(el))
      })
      props.initialFields?.sources?.forEach(el => {
        _newSources.set(el, sourcesContext.sources.get(el))
      })
      props.initialFields.languageKnowledges.map(el => {
        _newLangs.set(el?.language, el)
      })

      creationContext.setHelpObjects(
        {...creationContext.helpObjects, 
          activeSources: _newSources,
          activeGeos: _newGeos,
          languageKnowledges: _newLangs,
          activeVerticals: _newVerticals,
          countries: props.initialFields?.countries?.map(el => locationContext.countries.get(el as number)).filter(Boolean)||[],
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
      <Title onBackClick={()=>props?.onCancel?.()} title={t('search_cv')}/>
      <MainSearchBar fullWidth initialSearch={props.initialFields?.search} onChange={(v)=>formik.setFieldValue('search', v.search).then(_=>formik.submitForm())} />
    </div>
    <FormikProvider value={formik}>
      <Form>
        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=>{
            isTabletWidth&&openSpecializationModal()
          }}
          >
            <span>{t('filters_specs')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
          <div className={styles.itemContent}>
          {creationContext.activeSubCategory&&creationContext.activeSubCategory?.length === 0 && !isTabletWidth &&
            <P styleType={['medium', 'w500']} useThemeColor>
              {t('filters_any')}
            </P>
          }
          {creationContext.activeSubCategory&&creationContext.activeSubCategory.length > 0 &&
            creationContext.activeSubCategory.map(el=> {
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
          ||
          creationContext.activeSubCategory&&creationContext.activeSubCategory.length > 0 &&
          <div className={styles.itemContent}>
            {
              creationContext.activeSubCategory.map(el=> {
                return (<RemovableItem key={el?.id} onClick={()=>onRemoveCategory(el)} text={el?.name} />)
              })
            }
          </div>

          }
        </div>

        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=>openCompensationModal(t('filters_salary'))}
          >
            <span>{t('filters_salary')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black} />}
          </p>
          {!isTabletWidth &&
          <div className={styles.itemContent}>
            {!formik.values.compensation &&
              <>
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
                error={t('filters_oneFieldShouldBeFilled')}
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
                error={t('filters_oneFieldShouldBeFilled')}
                suffix={<P styleType={['medium', 'greyLight']} >{TranslateCurrency(formik.values.currency)}</P>}
                />
              </div>

              <TagsRadioList className={styles.tags} name={'currency'} options={[
                {value: Currency.RUB, label: t('rubShort')},
                {value: Currency.USD, label: Currency.USD},
                {value: Currency.EUR, label: 'Euro'},
                {value: Currency.GRN, label: t('grivnes')},
              ]}/>
            </>
            }
            
            <CheckboxField 
            itemClassName={styles.radioField} 
            name={'compensation'} 
            label={TranslateCompensationType(CompensationType.Contract, t)} 
            value={CompensationType.Contract} 
            />
          </div>
          ||
          (formik.values.salaryMin||formik.values.salaryMax||formik.values.compensation) &&
          <div className={styles.itemContent}>
            <RemovableItem 
            onClick={()=>formik.setValues({...formik.values, compensation: undefined, salaryMax: undefined, salaryMin: undefined, currency: undefined})}
            text={
              formik.values.compensation
              ?TranslateCompensationType(formik.values.compensation, t)
              :[formik.values.salaryMin && t('fromCapitalized') + ' ' + formik.values.salaryMin, formik.values.salaryMax && t('to') + ' ' + formik.values.salaryMax].filter(Boolean).join(' - ') + ' ' + TranslateCurrency(formik.values.currency)
            }/>
          </div>
          }

        </div>

        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=> openFieldsModal('forLastNumberOfDays',t('filters_showPeriod'), 306)}
          >
            <span>{t('filters_showPeriod')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <RadioListField 
            name={'forLastNumberOfDays'}
            rootClass={styles.radioField}
            options={[
              {value: null, label: t('allTheTime')},
              ...periods.map(el=>{
                return {value: el?.value, label: el?.name}
              })         
            ]} 
            />
            ||
            formik.values.forLastNumberOfDays &&
            <div className={styles.itemContent}>
              <RemovableItem 
              text={periods.find(el => el?.value === formik.values.forLastNumberOfDays).name}
              onClick={()=>formik.setFieldValue('forLastNumberOfDays', null)}
              /> 
            </div>
          }
        </div>

        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=> openFieldsModal('vacancyLookType', t('filters_vacancyLookType'), 300)}
          >
            <span>{t('filters_vacancyLookType')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <CheckboxListField 
            name={'vacancyLookType'}
            rootClass={styles.radioField}
            options={Object.values(VacancyLookType).map(el => {
              return {value: el, label: TranslateVacancyLookType(el, ProfileType.Hirer, t)}
            })} 
            />
            ||
            formik.values.vacancyLookType?.length > 0 &&
            <div className={styles.itemContent}>
              {
                formik.values.vacancyLookType.map(el => {
                  return <RemovableItem 
                  text={TranslateVacancyLookType(el, ProfileType.Hirer, t)}
                  onClick={()=>formik.setFieldValue('vacancyLookType', formik.values.vacancyLookType.filter(f => f !== el))}
                  />
                })
              }
            </div>
          }
        </div>

        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=>{
            isTabletWidth&&openCountryModal()
            setActiveAccordeon(activeAccordeon === 5 ? null : 5)
          }}
          >
            <span>{t('filters_country')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
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
             <span>{t('filters_addCountry')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
            </P>
          </div>
          ||
          creationContext.helpObjects?.countries?.length > 0 &&
          <div className={styles.itemContent}>
            {
              creationContext.helpObjects.countries.map(el=> {
                return (<RemovableItem key={el?.geonameid} onClick={()=>{onRemoveCountry(el)}} text={el?.locName} />)
              })
            }
          </div>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'verticals'})}>
            <span>{t('filters_verticals')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeVerticals?.size > 0 && creationContext.helpObjects && 
              [...creationContext.helpObjects?.activeVerticals?.entries()]
              .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
              )
            }
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'verticals'})}              
              >
                <span>{t('filters_addVerticals')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
              </P>
          </div>
          ||
          creationContext.helpObjects?.activeVerticals?.size > 0 && creationContext.helpObjects &&
          <div className={styles.itemContent}>
            {
              [...creationContext.helpObjects?.activeVerticals?.entries()]
              .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
              )
            }
          </div>
          }
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'sources'})}>
            <span>{t('filters_sources')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
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
                <span>{t('filters_addSources')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
              </P>
          </div>
          ||
          creationContext.helpObjects?.activeSources?.size > 0 && creationContext.helpObjects && 
          <div className={styles.itemContent}>
            {
              [...creationContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeSources')}/>
              )
            }
          </div>
          }
        </div>

        <div className={styles.item}>
          <p 
          className={styles.fieldTitle} 
          onClick={()=>isTabletWidth&&openSourcesModal({type: 'geos'})}
          >
            <span>{t('filters_geos')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
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
                <span>{t('filters_addGeos')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
              </P>
            </div>
            ||
            creationContext.helpObjects?.activeGeos?.size > 0 && creationContext.helpObjects &&
            <div className={styles.itemContent}>
              {creationContext.helpObjects?.activeGeos?.size > 0 && creationContext.helpObjects && 
                [...creationContext.helpObjects?.activeGeos?.entries()].map(([key, value])=> 
                    <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
                )
              }
            </div>
          }
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> openFieldsModal('employment', t('filters_employmentType'), 300)}>
            <span>{t('filters_employmentType')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'employment'} 
            options={Object.values(EmploymentType).map(el => {return {label: TranslateEmploymentType(el, t), value: el}})}/>           
            ||
            formik.values.employment?.length > 0 &&
            <div className={styles.itemContent}>
              {
                formik.values.employment.map(el =>{
                  return <RemovableItem 
                  text={TranslateEmploymentType(el, t)} 
                  onClick={() => formik.setFieldValue('employment', formik.values.employment.filter(item => item !== el))}
                  />
                })
              }
            </div>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> openFieldsModal('schedule', t('filters_schedule'), 300)
          }>
            <span>{t('filters_schedule')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'schedule'}
            options={Object.values(ScheduleType).map(el => {
              return {label: TranslateScheduleType(el, t), value: el}
            })} 
            />          
            ||
            formik.values.schedule?.length > 0 &&
            <div className={styles.itemContent}>
              {
                formik.values.schedule.map(el => {
                  return <RemovableItem 
                  text={TranslateScheduleType(el, t)}
                  onClick={() => formik.setFieldValue('schedule', formik.values.schedule.filter(item => item !== el))}
                  />
                })
              }
            </div>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> openFieldsModal('experience', t('filters_experience'), 340)}>
            <span>{t('filters_experience')}</span> {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <CheckboxListField 
            name={'experience'} 
            rootClass={styles.radioField}
            options={Object.values(WorkExperience).map(el => {
              return {label: TranslateWorkExperience(el, t), value: el}
            })}
            />           
            ||
            formik.values.experience.length > 0 &&
            <div className={styles.itemContent}>
              {
                formik.values.experience.map(el => {
                  return <RemovableItem 
                  text={TranslateWorkExperience(el, t)}
                  onClick={()=>formik.setFieldValue('experience', formik.values.experience.filter(f=> f !== el))}
                  />
                })
              }
            </div>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> openFieldsModal('education', t('filters_education'), 542)}>
            <span>{t('filters_education')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
            <CheckboxListField 
            name={'education'} 
            rootClass={styles.radioField}
            options={
              Object.values(EducationTypes).map(el=>{
                return {label: TranslateEducationType(el, t), value: el}
              })} 
            />
            ||
            formik.values.education.length > 0 &&
            <div className={styles.itemContent}>
              {
                formik.values.education.map(el => {
                  return <RemovableItem 
                  text={TranslateEducationType(el, t)}
                  onClick={()=>formik.setFieldValue('education', formik.values.education.filter(f=> f !== el))}
                  />
                })
              }
            </div>
          }
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>openLangsModal()}>
            <span>{t('filters_languageKnowledgedges')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
          </p>
          {!isTabletWidth &&
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.languageKnowledges?.size > 0 
            && creationContext.helpObjects&& [...creationContext.helpObjects?.languageKnowledges.values()]
              .map((el)=> 
                <RemovableItem 
              key={el?.language} 
              onClick={()=>removeLanguage(el)} 
              text={`${TranslateLanguage(el?.language, t)}, ${TranslateLanguageKnowLevel(el?.level, true)}`} 
              /> 
            )
            } 
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openLangsModal()}            
              >
                <span>{t('filters_addLanguage')}</span>  {isTabletWidth &&<ArrowDownSvg color={isLightTheme&&colors.black}/>}
              </P>
          </div>
          ||
          creationContext.helpObjects?.languageKnowledges?.size > 0 && creationContext.helpObjects &&
          <div className={styles.itemContent}>
            {
              [...creationContext.helpObjects?.languageKnowledges.values()]
              .map((el)=> 
                <RemovableItem 
                key={el?.language} 
                onClick={()=>removeLanguage(el)} 
                text={`${TranslateLanguage(el?.language, t)}, ${TranslateLanguageKnowLevel(el?.level, true)}`} 
                /> 
              )
            }

          </div>
          }
        </div>
      </Form> 
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button 
      styleType={['grey']} 
      altStyleType={['white']}
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