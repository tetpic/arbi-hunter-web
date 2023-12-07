import { ICV } from 'data/interfaces/ICV'
import Title from '../TitleForSection'
import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import Button from '../Button'
import classNames from 'classnames'
import ShareSvg from 'components/svg/ShareSvg'
import HeartSvg from 'components/svg/HeartSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import SalaryItem from '../SalaryItem'

interface Props {
  title: string
  city?: string
  cv?: ICV
  vc?: IVacancy
  buttonText: string
  onButtonClick?: ()=>void
}

export default function CvVcPageTop(props: Props) {

  return (<div className={styles.top}>
    <div className={styles.left}>
      <Title title={props.title}/>
      {props.city && 
        <p className={styles.city}>г. {props.city}</p>
      }
      <SalaryItem cv={props.cv} vacancy={props.vc} />
    </div>
    <div className={styles.right}>
      <Button className={classNames(styles.button, styles.share)}><ShareSvg/></Button>
      <Button className={classNames(styles.button, styles.heart)}><HeartSvg/></Button>
      <Button className={classNames(styles.button, styles.closeEye)}><CloseEyeSvg/></Button>
      <Button onClick={()=>props.onButtonClick()} className={styles.showContacts}>{props.buttonText}</Button>
    </div>
  </div>)
}