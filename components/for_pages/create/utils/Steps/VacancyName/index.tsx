import InputField from 'components/fields/InputField'
import Image from 'next/image'
import styles from './index.module.scss'
import Specialization from '../Specialization'


interface Props {
}

export default function VacancyName(props: Props) {

  return (
  <>
    <div className={styles.root}>
      <p className={styles.title}>Введите название вакансии <Image alt={'insert vacancy name'} src={'/icons/scribe.png'} width={24} height={24} /> </p>
      <InputField className={styles.input} value='' styleType={'default'} color={'default'} name={'name'} placeholder={'Введите текст'} />
    </div>
    <Specialization />
    </>
  
  )
}