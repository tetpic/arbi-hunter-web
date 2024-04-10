import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  CompensationType,  Currency,  EducationTypes,  EmploymentType, ModalType, ScheduleType, VacancyLookType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import RadioListField from 'components/fields/RadioListField'
import { useAppContext } from 'context/state'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISource, ISpecializationCategory, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
import Spacer from 'components/ui/Spacer'
import CheckboxField from '@/components/fields/CheckboxField'
import { TranslateCompensationType,  TranslateCurrency,  TranslateEducationType,  TranslateEmploymentType,  TranslateLanguage,  TranslateLanguageKnowLevel, TranslateScheduleType, TranslateVacancyLookType } from 'utils/enumsTranslations'
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
import AddButton from '@/components/ui/AddButton'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
  onFilterChange: (data: IVacancyCvSearchParams) => void
  initialFields?: IVacancyCvSearchParams
}

export default function FilterHirer(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const creationContext = useCreateVcCvContext()
  const sourcesContext = useSourcesContext()
  const locationContext = useLocationContext()
  const [activeAccordeon, setActiveAccordeon] = useState<number>(null)

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
  }

  const formik = useFormik<IVacancyCvSearchParams>({
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

  const openCountryModal = () => {
    appContext.showModal<ICountryModalProps>(ModalType.CountryModal, {
      initials: formik.values.countries?.map(el => locationContext.countries.get(el)),
      onSubmit: (r) => {
        formik.setFieldValue('countries', [...r.map(el => el.geonameid)])
        locationContext.getCountries(null, r)
        creationContext.setHelpObjects({...creationContext.helpObjects, countries: r})
      },
    })
  }

  const onRemoveCategory = (category: ISpecializationCategory) => {
    creationContext.setActiveSubcategory(state=>Array.isArray(state)?state.filter(f=> f.id !== category.id):state)
    formik.setFieldValue('categories', formik.values.categories.filter(f=> f !== category.id))
  }

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
          countries: props.initialFields?.countries?.map(el => locationContext.countries.get(el)).filter(Boolean)||[],
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
      countries: creationContext.helpObjects?.countries?.map(el=> el.geonameid).filter(Boolean),
    }
    creationContext.activeSubCategory&&
    Array.isArray(creationContext.activeSubCategory?creationContext.activeSubCategory.map(el => el.id):creationContext.activeSubCategory[0])
    formik.setValues(values)
  }, [creationContext.helpObjects, creationContext.activeSubCategory])


  return (<div className={styles.root}> 
    <div className={styles.top}>
      <Title title={'Поиск резюме'}/>
      <MainSearchBar fullWidth initialSearch={props.initialFields?.search} onChange={(v)=>formik.setFieldValue('search', v.search).then(_=>formik.submitForm())} />
    </div>
    <FormikProvider value={formik}>
      <Form>
        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_specs')}
          </p>
          <div className={styles.itemContent}>
          {creationContext.activeSubCategory&&creationContext.activeSubCategory?.length === 0 && 
            <P styleType={['medium', 'w500']}>
              {t('filters_any')}
            </P>
          }
          {creationContext.activeSubCategory&&creationContext.activeSubCategory.length > 0 &&
            creationContext.activeSubCategory.map(el=> {
              return (<RemovableItem key={el.id} onClick={()=>onRemoveCategory(el)} text={el.name} />)
            })
          }
          {!isTabletWidth &&
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            onClick={()=>openSpecializationModal()}
            >
              {t('filters_addSpecs')}
            </P>
            ||
            <AddButton className={styles.addButton} text={t('filters_addSpecs')} onClick={()=>openSpecializationModal()}/>
          }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle}>
            {t('filters_salary')}
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
              label={'oт'} 
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
              label={'до'} 
              priceFormatting
              error={t('filters_oneFieldShouldBeFilled')}
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
            label={TranslateCompensationType(CompensationType.Contract)} 
            value={CompensationType.Contract} 
            />
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
            <span>{t('filters_showPeriod')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>*/}
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
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
            <span>{t('filters_vacancyLookType')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>*/}
          </p>
            <CheckboxListField 
            name={'vacancyLookType'}
            rootClass={styles.radioField}
            options={[
              {value: VacancyLookType.NotLooking, label: TranslateVacancyLookType(VacancyLookType.NotLooking, ProfileType.Hirer, t)},
              {value: VacancyLookType.ActivelyLooking, label: TranslateVacancyLookType(VacancyLookType.ActivelyLooking, ProfileType.Hirer, t)},
              {value: VacancyLookType.PassivelyLooking, label: TranslateVacancyLookType(VacancyLookType.PassivelyLooking, ProfileType.Hirer, t)},
            ]} 
            />
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            {t('filters_country')}
          </p>
          <div className={styles.itemContent}>
          {creationContext.helpObjects?.countries?.length > 0 &&
            creationContext.helpObjects.countries.map(el=> {
              return (<RemovableItem key={el.geonameid} onClick={()=>{}} text={el.locName} />)
            })
          }
          {!isTabletWidth &&
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            onClick={openCountryModal}
            >
             {t('filters_addCountry')}
            </P>
            ||
            <AddButton className={styles.addButton} text={t('filters_addCountry')} onClick={openCountryModal}/>
          }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'verticals'})}>
            {t('filters_verticals')}
          </p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeVerticals?.size > 0 && creationContext.helpObjects && 
              [...creationContext.helpObjects?.activeVerticals?.entries()]
              .map(([key, value])=> 
              <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
              )
            }
            {!isTabletWidth &&
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'verticals'})}              
              >
                {t('filters_addVerticals')}
              </P>
              ||
              <AddButton className={styles.addButton} text={t('filters_addVerticals')} onClick={()=>openSourcesModal({type: 'verticals'})}/>
            }
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
            {!isTabletWidth &&
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'sources'})}
              >
                {t('filters_addSources')}
              </P>
              ||
              <AddButton className={styles.addButton} text={t('filters_addSources')} onClick={()=>openSourcesModal({type: 'sources'})}/>
            }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'geos'})}>
            {t('filters_geos')}
          </p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeGeos?.size > 0 && creationContext.helpObjects && 
                [...creationContext.helpObjects?.activeGeos?.entries()].map(([key, value])=> 
                  <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
                )
            }
            {!isTabletWidth &&
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'geos'})}            
              >
                {t('filters_addGeos')}
              </P>
              ||
              <AddButton className={styles.addButton} text={t('filters_addGeos')} onClick={()=>openSourcesModal({type: 'geos'})}/>
            }
          </div>
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            {t('filters_employmentType')}
          </p>
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'employment'} 
            options={[
              {value: EmploymentType.FullTime, label: TranslateEmploymentType(EmploymentType.FullTime, t, true)},
              {value: EmploymentType.PartTime, label: TranslateEmploymentType(EmploymentType.PartTime, t, true)},
              {value: EmploymentType.Project, label: TranslateEmploymentType(EmploymentType.Project, t, true)}
            ]}/>           
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 4 ? null : 4)}>
            <span>{t('filters_schedule')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 4&&styles.active}/>*/}
          </p>
            <CheckboxListField 
            rootClass={styles.radioField}
            name={'schedule'}
            options={[
              {value: ScheduleType.Flexible, label:  TranslateScheduleType(ScheduleType.Flexible, t)},
              {value: ScheduleType.FullDay, label:  TranslateScheduleType(ScheduleType.FullDay, t)},
              {value: ScheduleType.Remote, label:  TranslateScheduleType(ScheduleType.Remote, t)}
            ]} 
            />          
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            <span>{t('filters_experience')}</span> {/*isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>*/}
          </p>
            <CheckboxListField 
            name={'experience'} 
            rootClass={styles.radioField}
            options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
            />           
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            {t('filters_education')}
          </p>
            <CheckboxListField 
            name={'education'} 
            rootClass={styles.radioField}
            options={[
              {label: TranslateEducationType(EducationTypes.No, t), value: EducationTypes.No},
              {label: TranslateEducationType(EducationTypes.Secondary, t), value: EducationTypes.Secondary},
              {label: TranslateEducationType(EducationTypes.SecondarySpecial, t), value: EducationTypes.SecondarySpecial},
              {label: TranslateEducationType(EducationTypes.IncompleteHigher, t), value: EducationTypes.IncompleteHigher},
              {label: TranslateEducationType(EducationTypes.Higher, t), value: EducationTypes.Higher},
              {label: TranslateEducationType(EducationTypes.Bachelor, t), value: EducationTypes.Bachelor},
              {label: TranslateEducationType(EducationTypes.Master, t), value:EducationTypes.Master},
              {label: TranslateEducationType(EducationTypes.PhD, t), value:EducationTypes.PhD},
              {label: TranslateEducationType(EducationTypes.Doctor, t), value: EducationTypes.Doctor},
            ]} 
            />
            {isTabletWidth&&<Spacer basis={4}/>}
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle}>{t('filters_languageKnowledgedges')}</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.languageKnowledges?.size > 0 
            && creationContext.helpObjects&& [...creationContext.helpObjects?.languageKnowledges.values()]
              .map((el)=> 
                <RemovableItem 
                key={el.language} 
                onClick={()=>removeLanguage(el)} 
                text={`${TranslateLanguage(el.language, t)}, ${TranslateLanguageKnowLevel(el.level, true)}`} 
                /> 
              )
            } 
            {!isTabletWidth &&
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openLangsModal()}            
              >
                {t('filters_addLanguage')}
              </P>
              ||
              <AddButton className={styles.addButton} text={t('filters_addLanguage')} onClick={()=>openLangsModal()}/>
            }
          </div>
        </div>
      </Form> 
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button 
      styleType={['grey']} 
      onClick={()=>formik.setValues(initialValues)}
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