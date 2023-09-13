import CvCard from 'components/ui/CvCard'
import { IApplication } from 'data/interfaces/IApplication'
import styles from './index.module.scss'

interface Props {
  cv: IApplication
  vcId: number
}

export default function VcResponseItem(props: Props) {

  return (<div className={styles.root}> 
  <CvCard cv={props.cv.cv} vcId={0}/>
  {props.cv.profile.firstName}
  </div>)
}