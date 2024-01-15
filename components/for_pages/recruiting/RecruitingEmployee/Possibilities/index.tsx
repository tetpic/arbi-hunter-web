import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
// import beats from 'images/recruiting/recruiting_mock_company.png' //55*55
import Button from 'components/ui/Button'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ICompany } from './Planet'
const RatingLine = dynamic(()=>import('components/ui/RatingLine'), {ssr: false})
const Planet = dynamic(()=>import('./Planet'), {ssr: false})

interface Props {
}

export default function Possibilities(props: Props) {
  const companies: [ICompany, ICompany, ICompany] = [
    {name: 'Beats',  
      logo: '/images/companyLogos/beatsLogo.png', 
      id: 1,
      descriptions: [
        'Dre (Beats) — ведущий бренд в мире музыки, созданный Dr. Dre и Джимми Айовином в 2006 году.',
        'Компания выпускает первоклассные наушники с оголовьем, вставные наушники и колонки. Главное отличие продукции Beats — потрясающее качество звука.'
      ]
    },
    {name: 'Google',  
      logo: '/images/companyLogos/googleLogo.png', 
      id: 2,
      descriptions: [
        'Google (Google) — американская компания, созданная в 1998 году и основанная в 2004 году. ',
        'Гугол — это число, состоящее из единицы и ста нулей — 1×10100. Позднее в рекламной кампании было заявлено, что оно было выбрано, чтобы показать, что поисковая система хочет обеспечить людей большим количеством информации'
      ]
    },
    {name: 'The North Face',  
      logo: '/images/companyLogos/northFaceLogo.png', 
      id: 3,
      descriptions: [
        'The North Face (рус. Северный склон) — американская компания, специализирующаяся на производстве высококачественной технологичной спортивной, горной одежды, туристического инвентаря.',
        'Продукция предназначается для альпинистов, скалолазов, туристов и людей, ведущих активный образ жизни.'
      ]
    },
  ]

  const triggerRef = useRef<HTMLDivElement>(null!)
  const [active, setActive] = useState<boolean>(false)


  useEffect(()=>{
    if(window !== undefined) {
      const load = async () => {
        if (typeof window !== undefined) {
          const scrollmagic = (await import('scrollmagic')).default
          const controller = new scrollmagic.Controller()
          new scrollmagic.Scene({
            triggerElement: triggerRef.current,
            offset: -250
          })
          .on('enter', ()=> {
            setActive(true)
          })
          .addTo(controller)
        }
      }
      load()
    }
  }, [])

  

  const [currentCompany, setCurrentCompany] = useState<ICompany>(companies[0])

  const memoedPlanet = useMemo(()=><Planet active={active} companies={companies} onClick={(id)=>{
    setCurrentCompany(companies.find(el => el.id === id))}
  }/>, [active])

  return (<section className={styles.root} ref={triggerRef}>
    <div className={styles.imageWrapper}>
      {memoedPlanet}
    </div>
    <div className={styles.body}>
      <p className={styles.title}>Откройте дверь в новый мир возможностей!</p>
      <div className={styles.card}>
        <UserPic className={styles.card_pic} image={currentCompany.logo} size={55}/>
        <p className={styles.card_title}>{currentCompany.name}</p>
        <div className={styles.rating}>
          <span className={styles.rating_stats}>4,9</span>
          <RatingLine rating={4}/>
          <span className={styles.rating_feeds}>23 отзыва</span>
        </div>
      </div>
      {currentCompany.descriptions.map((el, i)=>{
        return <p key={i} className={styles.desc}>{el}</p>
      })}
      <Button className={styles.button}>Открыть страницу компании</Button>
    </div>

  </section>)
}