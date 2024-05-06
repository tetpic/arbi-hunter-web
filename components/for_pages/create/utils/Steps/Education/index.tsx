import styles from './index.module.scss'
import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { EducationInfo } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { EducationTypes, ModalType } from 'types/enums'
import { useAppContext } from 'context/state'
import { ICVCreate } from 'data/interfaces/ICV'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'
import P from '@/components/ui/P'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import useTranslation from 'next-translate/useTranslation'
import { TranslateEducationType } from 'utils/enumsTranslations'

interface Props {
  name: string
}

export default function Education(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {values, setFieldValue, setFieldError, setFieldTouched} = useFormikContext<ICVCreate>()

  const removeItem = (e: EducationInfo) => {
    setFieldValue('educationInfo', values.educationInfo?.filter(el=> el !== e))
  }

  const onAddButtonClick = (initial?: EducationInfo, index?: number) => {
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      values: {
        educationInfo: [{
          institution: '',
          speciality: '',
          fromDate: '',
          toDate: '',
          toPresent: true,
          faculty: '',
        }]
      },
      initialValues: initial? {educationInfo: [{...initial, toPresent: !initial.toDate}]}:null,

      type: 'educationInfo',
      onSubmit: (data) => {
        const educationInfo = values.educationInfo
        if(index !== undefined) {
          educationInfo[index] = data.educationInfo[0]
          if(educationInfo[index].toPresent) {
            delete educationInfo[index].toDate
          }
        }
        else {
          educationInfo?.push(data.educationInfo[0])
        }
        setFieldValue('educationInfo', educationInfo)
        appContext.hideModal()
      },
      onDelete: (data) => {
        const educationInfo = values.educationInfo
        const filtered =educationInfo.filter((_, i) => i !== index)
        setFieldValue('educationInfo', filtered)
      },
    })
  }

  return (<>
  <RadioListField 
  wrapperClassName={styles.radiosWrapper}
  options={[
    {label: TranslateEducationType(undefined, t), value: undefined},
    {label: TranslateEducationType(EducationTypes.Secondary, t), value: EducationTypes.Secondary},
    {label: TranslateEducationType(EducationTypes.SecondarySpecial, t), value: EducationTypes.SecondarySpecial},
    {label: TranslateEducationType(EducationTypes.IncompleteHigher, t), value: EducationTypes.IncompleteHigher},
    {label: TranslateEducationType(EducationTypes.Higher, t), value: EducationTypes.Higher},
    {label: TranslateEducationType(EducationTypes.Bachelor, t), value: EducationTypes.Bachelor},
    {label: TranslateEducationType(EducationTypes.Master, t), value:EducationTypes.Master},
    {label: TranslateEducationType(EducationTypes.PhD, t), value:EducationTypes.PhD},
    {label: TranslateEducationType(EducationTypes.Doctor, t), value: EducationTypes.Doctor},
  ]} 
  name={'education'} 
  />

  {values.educationInfo&&values.educationInfo.length>0&& 
    <div className={styles.educationItems}>
      {values.educationInfo.map((el, index)=> {
        return (
          <div 
          key={el.date} 
          className={styles.educationWrapper} 
          onClick={()=> onAddButtonClick(el, index)}
          >
            <P useThemeColor styleType={['large', 'w600']} >{el.institution}</P>
            <P useThemeColor styleType={['medium', 'w500']} >{el.speciality}</P>
            <P useThemeColor styleType={['small', 'greyLight']} >{el.fromDate} {el.toDate?'- '+el.toDate:' - '+t('toPresentLong')}</P>
            <Button type={'button'} altStyleType={['invertSvg']} className={styles.trashButton}><ArrowRightSvg/></Button>
          </div>)
        }) 
      }
    </div>
  }
  {values.education !== undefined && values.education !== EducationTypes.Secondary &&
  <AddButton test={'addEducation'} onClick={()=> onAddButtonClick()} text={t('create_addEducationPlace')}/>
  }
  </>)
}