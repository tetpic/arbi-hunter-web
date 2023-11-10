import Title from 'components/ui/TitleForSection'
import Managers from './Managers'
import Patterns from './Patterns'
import Personal from './Personal'
import Saved from './Saved'
import Shop from './Shop'
import Vacancies from './Vacancies'
import styles from './index.module.scss'
import { NavigationSet } from 'types/types'
import { ProfilePages } from 'context/profile_page_state'


interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet<ProfilePages>[]
  onBackClick?: ()=> void
}

export default function CompanyProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)

  const title =  (
    <Title title={choosenNav.name} onBackClick={props.onBackClick}/>
  )

  const body = ((): JSX.Element=> {
    switch(props.currentPage) {
      case ProfilePages.Personal:
      return <Personal/>
      case ProfilePages.Managers:
      return <Managers/>
      case ProfilePages.Saved:
      return <Saved/>
      case ProfilePages.Vacancies:
      return <Vacancies/>
      case ProfilePages.Shop:
      return <Shop/>
      case ProfilePages.Patterns:
      return <Patterns/>
      }
    }
  )()

  return (
   <div className={styles.root}>
   {title||null}
   {body||null}
   </div>
  )
}