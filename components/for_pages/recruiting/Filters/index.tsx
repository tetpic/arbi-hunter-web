import styles from './index.module.scss'

import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import {  CompensationType,  Currency,  EducationTypes,  EmploymentType, ModalType, ScheduleType, VacancyLookType, WorkExperienceTranslate } from 'types/enums'
import { useEffect, useState } from 'react'
import RadioListField from 'components/fields/RadioListField'
// import AddButton from 'components/ui/AddButton'
import { useAppContext } from 'context/state'
import languages from '@cospired/i18n-iso-languages'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import RemovableItem from 'components/ui/RemovableItem'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISpecializationCategory, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { periods } from 'utils/commonObjects'
// import Accordeon from 'components/ui/Accordeon'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Spacer from 'components/ui/Spacer'
import CheckboxField from '@/components/fields/CheckboxField'
import { TranslateCompensationType,  TranslateCurrency,  TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import { ILangaugesModalArgs } from '@/components/modals/CvModals/Languages'
import P from '@/components/ui/P'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '../../create/utils/TagsRadioList'
import MainSearchBar from '@/components/ui/MainSearchBar'
import Title from '@/components/ui/TitleForSection'

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
      salaryMax: undefined,
      salaryMin: undefined,
      currency: Currency.RUB,
      lookType: undefined,
      countryIds: [],
      cityIds: [],
      education: undefined,
      search: undefined
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
        <div className={styles.top}>
          <Title title={'Поиск резюме'}/>
          <MainSearchBar/>
        </div>
        
        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            Специализация:
          </p>
          <div className={styles.itemContent}>
          {creationContext.activeSubCategory.length === 0 && 
            <P styleType={['medium', 'w500']}>
              Любая
            </P>
          }
          {creationContext.activeSubCategory.length > 0 &&
            creationContext.activeSubCategory.map(el=> {
              return (<RemovableItem key={el.id} onClick={()=>onRemoveCategory(el)} text={el.name} />)
            })
          }
          {!isTabletWidth &&
            // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSpecializationModal()}/>
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            onClick={()=>openSpecializationModal()}
            >
              Указать специализации
            </P>
          }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle}>
            Зарплата:
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
              error='Одно из полей должно быть заполнено'
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
              error='Одно из полей должно быть заполнено'
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
            {isTabletWidth&&<Spacer basis={4}/>}
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
            <span>Показать период</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>}
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
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 1 ? null : 1)}>
            <span>Статус поиска</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 1&&styles.active}/>}
          </p>
            <RadioListField 
            name={'lookType'}
            rootClass={styles.radioField}
            options={[
              // {value: undefined, label: 'Без статуса поиска'},
              {value: VacancyLookType.NotLooking, label: 'Не ищет работу'},
              {value: VacancyLookType.ActivelyLooking, label: 'Активно ищет работу'},
              {value: VacancyLookType.PassivelyLooking, label: 'Рассматривает предложения'},
            ]} 
            />
            {isTabletWidth&&<Spacer basis={4}/>}
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSpecializationModal()}>
            Страна:
          </p>
          <div className={styles.itemContent}>
          {!isTabletWidth &&
            // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSpecializationModal()}/>
            <P 
            styleType={['medium', 'w500', 'underlined', 'blue']}
            >
              Добавить страну
            </P>
          }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'verticals'})}>Вертикали</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeVerticals?.size > 0 &&
              <div className={styles.itemsWrapper}>
               {creationContext.helpObjects && [...creationContext.helpObjects?.activeVerticals?.entries()]
                .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
                )}
              </div>
            }
            {!isTabletWidth &&
              // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'verticals'})}/>
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'verticals'})}              
              >
                Добавить вертикали
              </P>
            }
          </div>
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'sources'})}>Источники трафика:</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeSources?.size > 0 && creationContext.helpObjects && 
              [...creationContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
                <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeSources')}/>
              )
            }
            {!isTabletWidth &&
              // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'sources'})}/>
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'sources'})}
              >
                Добавить источники трафика
              </P>
            }
          </div>
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=>isTabletWidth&&openSourcesModal({type: 'geos'})}>Гео</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.activeGeos?.size > 0 && creationContext.helpObjects && 
                [...creationContext.helpObjects?.activeGeos?.entries()].map(([key, value])=> 
                  <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
                )
            }
            {!isTabletWidth &&
              // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openSourcesModal({type: 'geos'})}/>
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openSourcesModal({type: 'geos'})}            
              >
                Добавить гео
              </P>
            }
          </div>
        </div>


        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 3 ? null : 3)}>
            Тип занятости
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
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 4 ? null : 4)}>
            <span>График работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 4&&styles.active}/>}
          </p>
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
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            <span>Опыт работы</span> {isTabletWidth &&<ArrowDownSvg className={activeAccordeon === 5&&styles.active}/>}
          </p>
            <CheckboxListField 
            name={'experience'} 
            rootClass={styles.radioField}
            options={WorkExperienceTranslate.map(el=> {return {value: el[0], label: el[1]}})}
            />
            {isTabletWidth&&<Spacer basis={4}/>}
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle} onClick={()=> setActiveAccordeon(activeAccordeon === 5 ? null : 5)}>
            Образование
          </p>
            <CheckboxListField 
            name={'education'} 
            rootClass={styles.radioField}
            options={[
              {label: 'Нет образования', value: EducationTypes.No},
              {label: 'Среднее', value: EducationTypes.Secondary},
              {label: 'Средне специальное', value: EducationTypes.SecondarySpecial},
              {label: 'Неоконченное высшее', value: EducationTypes.IncompleteHigher},
              {label: 'Высшее', value: EducationTypes.Higher},
              {label: 'Бакалавр', value: EducationTypes.Bachelor},
              {label: 'Магистр', value:EducationTypes.Master},
              {label: 'Кандидат наук', value:EducationTypes.PhD},
              {label: 'Доктор наук', value: EducationTypes.Doctor},
            ]} 
            />
            {isTabletWidth&&<Spacer basis={4}/>}
        </div>

        <div className={styles.item}>
          <p className={styles.fieldTitle}>Знания языков</p>
          <div className={styles.itemContent}>
            {creationContext.helpObjects?.languageKnowledges?.size > 0 
            && creationContext.helpObjects&& [...creationContext.helpObjects?.languageKnowledges.values()]
              .map((el)=> 
                <RemovableItem 
                key={el.language} 
                onClick={()=>removeLanguage(el)} 
                text={`${languages.getName(el.language, 'ru')}, ${TranslateLanguageKnowLevel(el.level)}`} 
                /> 
              )
            } 
            {!isTabletWidth &&
              // <AddButton className={styles.addButton} title='Добавить' onClick={()=>openLangsModal()}/>
              <P 
              styleType={['medium', 'w500', 'underlined', 'blue']}
              onClick={()=>openLangsModal()}            
              >
                Добавить язык
              </P>
            }
          </div>
        </div>
      </Form> 
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button 
      styleType={['grey']} 
      onClick={formik.handleReset}
      className={styles.resetButton}
      >
        Сбросить всё
      </Button>

      <Button
      styleType={['gradient']}
      onClick={()=>props.onFilterChange(formik.values)}
      >
        Найти
      </Button>
    </div>
  </div>)
}