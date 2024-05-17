import { useFormikContext } from 'formik'
import styles from './index.module.scss'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import RichTextField from '@/components/fields/RichTextField'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  title?: string
  fieldName?: string
}

export default function About(props: Props) {
  const {t} = useTranslation()

  const {values} = useFormikContext<IVacancyCreate>()

  

  return (
  <div className={styles.root}>    
    <P styleType={['large', 'w600']} useThemeColor className={styles.name}>{values.name}</P>
    {/* <p className={styles.disclaimer}>
      <Trans i18nKey='common:create_infoAboutAgeWarn'components={[<>&nbsp;</>, <>&mdash;</>]} />
    </p> */}
    <RichTextField name={props.fieldName||'bio'} 
    className={styles.textField}
    hideButtons={{helpers: true, headings: [2,3]}}
    returnValueType={'html'}
    placeholderClassName={styles.placeholder}
    editorClassName={styles.editor}
    label={t('create_vacancy_writeBoutVacancy')}
    labelClassName={styles.label}
    />
  </div>)
}