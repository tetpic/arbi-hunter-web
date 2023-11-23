import Title from 'components/ui/TitleForSection'
import Saved from './Saved'
import styles from './index.module.scss'
import Feedbacks from './Feedbacks'
import CVs from './CVs'
import { NavigationSet } from 'types/types'
import { ProfilePages } from 'context/profile_page_state'
import UserEditor from './UserEditor'

interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet<ProfilePages>[]
  onBackClick?: ()=>void
}

export default function UserProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)

  const title = (
    <Title title={choosenNav?.name} onBackClick={props.onBackClick}/>
  )

  const body = (()=>{
    switch(props.currentPage) {
      case ProfilePages.Edit:
        return <UserEditor/>
      // case ProfilePages.Personal:
      // return <Personal/>
      case ProfilePages.FeedBacks:
        return <Feedbacks/>
      case ProfilePages.Saved:
        return <Saved/>
      case ProfilePages.Cvs:
        return <CVs/>
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