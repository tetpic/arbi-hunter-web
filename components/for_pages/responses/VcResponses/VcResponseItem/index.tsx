import CvCard from 'components/ui/CvCard'
import { IApplication } from 'data/interfaces/IApplication'
import styles from './index.module.scss'

interface Props {
  cv: IApplication
}

export default function VcResponseItem(props: Props) {

  return (<div className={styles.root}> 
  <CvCard cv={props.cv.cv}/>
  {props.cv.profile.firstName}
  </div>)
}