import { useFormikContext } from 'formik'
import styles from './index.module.scss'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import RichTextField from '@/components/fields/RichTextField'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  title?: string
  fieldName?: string
}

export default function About(props: Props) {
  const {t} = useTranslation()

  const {values} = useFormikContext<IVacancyCreate>()


  

  return (
  <div className={styles.root}>    
    <p className={styles.name}>{values.name}</p>
    <p className={styles.disclaimer}>
      <Trans i18nKey='common:create_infoAboutAgeWarn'components={[<>&nbsp;</>, <>&mdash;</>]} />
    </p>
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