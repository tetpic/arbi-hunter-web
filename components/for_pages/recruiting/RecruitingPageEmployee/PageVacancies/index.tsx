import { IVacancy } from 'data/interfaces/IVacancy'
import Spinner from 'components/ui/Spinner'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import VacancyItem from 'components/ui/VacancyItem'

interface Props {
  loading: boolean
  vacancies: IVacancy[]
  onChange: (data: IVacancyCvSearchParams) => void
  filters: IVacancyCvSearchParams
}

export default function PageVacancies({loading, vacancies, onChange, filters}: Props) {

 

  return ( <>
  {loading &&
    <Spinner size={24} />
    ||
    !loading && vacancies?.length > 0 && vacancies?.map(vacancy=> {
      return <VacancyItem vacancy={vacancy} onChangeItem={()=>onChange(filters)}/>
    })
    ||
    <p className='empty'>Нет найденных вакансий</p>
    }
  </>
  )
}