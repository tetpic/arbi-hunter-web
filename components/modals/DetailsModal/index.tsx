import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import SectionSubtitle from '@/components/for_pages/create/utils/SectionSubtitle'
import DateField from '@/components/fields/DateField'
import InputField from '@/components/fields/InputField'
import TextAreaField from '@/components/fields/TextAreaField'
import SwitchField from '@/components/fields/SwitchField'
import { ICVCreate } from 'data/interfaces/ICV'
import Button from '@/components/ui/Button'
import Spacer from '@/components/ui/Spacer'
import Validator from 'utils/Validator'
import CrossSvg from '@/components/svg/CrossSvg'
import Title from '@/components/ui/TitleForSection'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'


interface Props {
  onClose: ()=> void
}

export interface IDetailsModalProps {
  type: 'experienceInfo'|'educationInfo'|'coursesInfo'
  values?: Partial<ICVCreate>
  initialValues?: Partial<ICVCreate>
  onSubmit?: (data: Partial<ICVCreate>) => void
  onDelete?: (data: Partial<ICVCreate>) => void
}

export default function DetailsModal(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const args: IDetailsModalProps = appContext.modalArguments
  const {t}= useTranslation()

  const formik = useFormik<Partial<ICVCreate>>({
    initialValues: {
      ...args.values,
      ...args.initialValues,
    },
    onSubmit: args.onSubmit
  })


  const deleteHandler = () => {
    args.onDelete?.(formik.values)
    props.onClose()
  }

  useEffect(()=>{
    if(
      new Date(
        [formik.values.experienceInfo?.[0].toDate?.split('.')[0], '01', formik.values.experienceInfo?.[0]?.toDate?.split('.')[1]].join('/')
      ) < 
      new Date(
        [formik.values.experienceInfo?.[0].fromDate?.split('.')[0], '01', formik.values.experienceInfo?.[0]?.fromDate?.split('.')[1]].join('/')
      )
    ) {
        formik.setFieldValue('experienceInfo[0].toDate', null)
      }
  }, [formik.values?.experienceInfo?.[0]?.fromDate, formik.values?.experienceInfo?.[0]?.toDate])

  useEffect(()=>{
    if(new Date('01/01/'+formik.values?.educationInfo?.[0]?.toDate) < new Date('01/01/'+formik.values?.educationInfo?.[0]?.fromDate)) {
      formik.setFieldValue('educationInfo[0].toDate', null)
    }
  }, [formik.values?.educationInfo?.[0]?.fromDate])



  const experienceInfoForm = (<>
    {isTabletWidth && 
    <Title title={t('create_cv_workplace')} onBackClick={props.onClose} className={styles.mobileTitle}/>
    ||
    <SectionSubtitle text={t('create_cv_workplace')} title={t('create_cv_workplace')} className={styles.title}/>
    }
    {isTabletWidth &&
      <SectionSubtitle text={t('create_cv_workPeriod')} className={styles.title}/>
    }
    <div className={styles.period}>
      <DateField 
      name={'experienceInfo[0].fromDate'} 
      styleType={'default'} 
      label={t('create_cv_workStart')} 
      dateFormat='MM/yyyy'
      showMonthYearPicker
      formatOptions={{
        formatMatcher: 'best fit', year: 'numeric', month: '2-digit'
      }}
      className={styles.dateField}
      validate={Validator.required}
      />
      {!formik.values?.experienceInfo?.[0]?.toPresent &&
        <DateField 
        name={'experienceInfo[0].toDate'} 
        styleType={'default'} 
        label={t('create_cv_workEnd')} 
        showMonthYearPicker
        minDate={formik.values?.experienceInfo
          &&([formik.values.experienceInfo?.[0].fromDate?.split('.')[0], '01', formik.values.experienceInfo?.[0]?.fromDate.split('.')[1]].join('/'))}
        formatOptions={{
          formatMatcher: 'best fit', year: 'numeric', month: '2-digit'
        }}
        dateFormat='MM/yyyy'
        className={styles.dateField}
        validate={Validator.required}
        />
      }
    </div>
    <div className={styles.toPresent} >
      <P styleType={['medium', 'w500']} useThemeColor>{t('create_cv_tillPresent')}</P> 
      <SwitchField name={'experienceInfo[0].toPresent'}/> 
    </div>

    <SectionSubtitle text={t('create_cv_company')} className={styles.title}/>
    <div className={styles.inputsWrapper}>
      <InputField 
      name={'experienceInfo[0].company'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_companyName')} 
      labelType='top'
      validate={Validator.required}

      />
      <InputField 
      name={'experienceInfo[0].position'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_position')} 
      labelType='top'
      validate={Validator.required}
      />
    </div>
    <SectionSubtitle text={t('create_cv_achivements')} className={styles.title} />
    <TextAreaField 
    autoSize 
    name={'experienceInfo[0].description'} 
    value={formik.values.experienceInfo?.[0]?.description} 
    onChange={(val)=>{formik.setFieldValue('experienceInfo[0].description', val.currentTarget.value)}}/>
  </>)

  const educationInfoForm = (<>
    {isTabletWidth && 
    <Title title={t('create_cv_educationPlace')} onBackClick={props.onClose} className={styles.mobileTitle}/>
    ||
    <SectionSubtitle text={t('create_cv_educationPlace')} title={t('create_cv_educationPlace')} className={styles.title}/>
    }
    
    <SectionSubtitle text={t('create_cv_educationYears')} className={styles.title}/>
    
    <div className={styles.period}>
      <DateField 
      name={'educationInfo[0].fromDate'} 
      styleType={'default'} 
      label={t('create_cv_educationStart')} 
      dateFormat='yyyy'      
      showYearPicker
      formatOptions={{
        year: 'numeric'
      }}
      className={styles.dateField}
      validate={Validator.required}
      />
      {!formik.values.educationInfo?.[0].toPresent &&
        <DateField 
        name={'educationInfo[0].toDate'} 
        styleType={'default'} 
        label={t('create_cv_educationEnd')} 
        dateFormat='yyyy'        
        showYearPicker
        minDate={new Date('01/01/' +formik.values?.educationInfo?.[0]?.fromDate)}

        formatOptions={{
          year: 'numeric'
        }}
        className={styles.dateField}
        validate={Validator.required}
        />
      }
    </div>
    <div className={styles.toPresent} >
      <P styleType={['medium', 'w500']} useThemeColor>{t('create_cv_tillPresent')}</P> 
      <SwitchField name={'educationInfo[0].toPresent'}/> 
    </div>

    <div className={styles.inputsWrapper}>
      <InputField 
      name={'educationInfo[0].institution'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_universityName')} 
      labelType='top'
      validate={Validator.required}
      />
      <InputField 
      name={'educationInfo[0].faculty'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_faculity')} 
      labelType='top'
      />
      <InputField 
      name={'educationInfo[0].speciality'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_specialty')}
      labelType='top'
      validate={Validator.required}
      />
    </div>
  </>)

  const coursesInfoForm = (<>
    {isTabletWidth && 
    <Title title={t('create_cv_courses')} onBackClick={props.onClose} className={styles.mobileTitle}/>
    ||
    <SectionSubtitle text={t('create_cv_courses')} title={t('create_cv_setStartOfEducation')} className={styles.title}/>
    }
    <Spacer basis={24}/>
    <div className={styles.period}>
      <DateField 
      visibleYearSelector
      visibleMonthSelector={false}
      dateFormat='yyyy'
      name={'coursesInfo[0].date'} 
      showMonthYearPicker
      styleType={'default'} 
      label={t('create_cv_endYear')} 
      className={styles.dateField}

      />
    </div>
    <div className={styles.inputsWrapper}>
      <InputField 
      name={'coursesInfo[0].name'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_coursesCompanyName')} 
      labelType='top'
      validate={Validator.required}
      />
      <InputField 
      name={'coursesInfo[0].location'} 
      styleType={'default'} 
      color={'default'} 
      label={t('create_cv_coursesName')} 
      labelType='top'
      validate={Validator.required}
      />
    </div>
  </>)

  return (
    <ModalLayout mobileFullScreen  className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        <FormikProvider value={formik}>
          {!isTabletWidth &&
            <Button styleType={['backTransparent', 'icon']} className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
          }
          <Form className={styles.form}>
            <div className={styles.detailsRoot}>
              {args.type === 'experienceInfo' && formik.values.experienceInfo && experienceInfoForm}
              {args.type === 'educationInfo' && educationInfoForm}
              {args.type === 'coursesInfo' && coursesInfoForm}
            </div>
            <div className={styles.buttonWrapper}>
              {!isTabletWidth &&
                <Button styleType={['grey']} altStyleType={['whitePurple']} title='closeModal' type='button' onClick={args.initialValues?deleteHandler:props.onClose}>{args.initialValues?t('delete'):t('cancelAlt')}</Button>
              }
              <Button styleType={['phoneWide']} className={styles.sendButton} title='addButton' type='button' onClick={formik.submitForm}>{args.initialValues?t('save'):t('continue')}</Button>
            </div>
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}