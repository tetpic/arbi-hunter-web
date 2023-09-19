import CurrentCourse from 'components/for_pages/courses/CurrentCourse'
import { useRouter } from 'next/router'

interface Props {
}

export default function Course(props: Props) {
  const router = useRouter()

  const { id } = router.query

  return <CurrentCourse id={Number(id)}/>
}