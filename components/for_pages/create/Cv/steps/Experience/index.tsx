import styles from './index.module.scss'

import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { ExperienceInfo } from 'data/interfaces/Common'
import { ICVCreate } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'
import P from '@/components/ui/P'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  name: string
}

export default function Experience(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const formikContext = useFormikContext<ICVCreate>()
  const values = formikContext.values

  const removeExp = (e: ExperienceInfo) => {
    const filtered = formikContext.values.experienceInfo.filter(exp => exp !== e)
    formikContext.setValues({...formikContext.values, experienceInfo: filtered})
  }

  const onAddButtonClick = (initial?: ExperienceInfo, index?: number) => {
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      type: 'experienceInfo', 
      values: {
        experienceInfo:[{
          company: '',
          position: '',
          toDate: '',
          fromDate: '',
          toPresent: true,
          description: '',
        }]
      },
      initialValues: initial? {experienceInfo: [{...initial, toPresent: !initial.toDate}]}:null,
      onSubmit: (data) => {        
        const exp = formikContext.values.experienceInfo
        if(index !== undefined) {
          exp[index] = data.experienceInfo[0]
          if(exp[index].toPresent) {
            delete exp[index].toDate
          }
        }
        else {
          exp.push(...data.experienceInfo)
        }
        formikContext.setValues({...formikContext.values, experienceInfo:  exp})
        appContext.hideModal()
      },
      onDelete: (data) => {
        const exp = formikContext.values.experienceInfo
        const filtered = exp.filter((_, i) => i !== index)
        formikContext.setValues({...formikContext.values, experienceInfo: filtered})
      }
    })
  }


  return (
    <div className={styles.root}>
      { values.experienceInfo.length>0
      &&values.experienceInfo
      .map((el, index)=> {
        return (<div 
          key={index}
          onClick={()=>onAddButtonClick(el, index)}
        className={styles.experienceWrapper} 
        >
          <P useThemeColor styleType={['large', 'w600']} >{el.position}</P>
          <P useThemeColor styleType={['medium', 'w500']} >{el.company}</P>
          <P useThemeColor styleType={['small', 'greyLight']} >{el.fromDate} {el.toDate?'- '+el.toDate:' - ' + t('toPresent')}</P>
          <Button className={styles.trashButton} type='button' styleType={['icon', 'backTransparent']} altStyleType={['icon', 'backTransparent', 'invertSvg']}  ><ArrowRightSvg/></Button>
        </div>)
      }) 
      }
      <AddButton test={'addWorkPlace'} onClick={()=>onAddButtonClick()} text={t('create_cv_addWorkPlace')}/>
    </div>
  )
}