import Title from "components/ui/TitleForSection"
import { NavigationSet, ProfilePages } from ".."

interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet[]
}

export default function UserProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)

  const title = (
    <Title title={choosenNav.name}/>
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