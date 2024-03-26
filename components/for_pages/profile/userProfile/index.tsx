import styles from './index.module.scss'

import Title from 'components/ui/TitleForSection'
import Saved from './Saved'
import Feedbacks from './Feedbacks'
import CVs from './CVs'
import { NavigationSet } from 'types/types'
import { ProfilePages } from 'context/profile_page_state'
import UserEditor from './UserEditor'
import Personal from '../Personal'
import { TariffWrapper } from 'context/tariff_state'

interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet<ProfilePages>[]
  onBackClick?: ()=>void
  titleButton?: JSX.Element
}

export default function UserProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)
  const title = (
    <Title title={choosenNav?.name} onBackClick={props.onBackClick} rightButton={props.titleButton}/>
  )

  const body = (()=>{
    switch(props.currentPage) {
      case ProfilePages.Edit:
        return <UserEditor/>
      case ProfilePages.Personal:
      return <Personal/>
      case ProfilePages.FeedBacks:
        return <Feedbacks/>
      case ProfilePages.Saved:
        return <Saved/>
      case ProfilePages.Cvs:
        return <TariffWrapper>
        <CVs/>
        </TariffWrapper>
        
      // case ProfilePages.Shop:
      // return <Shop/>
      // case ProfilePages.Patterns:
      // return <Patterns/>
    }
  })()


  return (
   <div className={styles.root}>
   {title}
   {body}
   </div>
  )
}