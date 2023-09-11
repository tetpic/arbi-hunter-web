import Title from 'components/ui/TitleForSection'
import { NavigationSet, ProfilePages } from '..'

interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet[]
  onBackClick?: ()=>void
}

export default function UserProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)

  const title = (
    <Title title={choosenNav.name} onBackClick={props.onBackClick}/>
  )
  

  const body = (()=>{
    
  })()


  return (
   <>
   {title}
   {body}
   </>
  )
}