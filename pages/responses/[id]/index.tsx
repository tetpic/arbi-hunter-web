import Responses from 'components/for_pages/responses'
import { useRouter } from 'next/router'


interface Props {
}

export default function ResponseItem(props: Props) {
  const router = useRouter()

  const { id } = router.query
  
  return (<div> 
    <Responses id={Number(id)}/>
  </div>)
}