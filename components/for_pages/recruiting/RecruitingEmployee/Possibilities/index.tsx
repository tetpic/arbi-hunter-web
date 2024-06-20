import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
// import beats from 'images/recruiting/recruiting_mock_company.png' //55*55
import Button from 'components/ui/Button'
import dynamic from 'next/dynamic'
import { useMemo, useRef, useState } from 'react'
import { ICompany } from './Planet'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
const RatingLine = dynamic(()=>import('components/ui/RatingLine'), {ssr: false})
const Planet = dynamic(()=>import('./Planet'), {ssr: false})

interface Props {
}

export default function Possibilities(props: Props) {
  const {t} = useTranslation()
  const companies: ICompany[] = [
    {name: 'Beats',  
      logo: '/images/companyLogos/planetCompany1.png', 
      id: 1,
      descriptions: [
        'Dre (Beats) — ведущий бренд в мире музыки, созданный Dr. Dre и Джимми Айовином в 2006 году.',
        'Компания выпускает первоклассные наушники с оголовьем, вставные наушники и колонки. Главное отличие продукции Beats — потрясающее качество звука.'
      ]
    },
    {name: 'Google',  
      logo: '/images/companyLogos/planetCompany2.jpg', 
      id: 2,
      descriptions: [
        'Google (Google) — американская компания, созданная в 1998 году и основанная в 2004 году. ',
        'Гугол — это число, состоящее из единицы и ста нулей — 1×10100. Позднее в рекламной кампании было заявлено, что оно было выбрано, чтобы показать, что поисковая система хочет обеспечить людей большим количеством информации'
      ]
    },
    {name: 'The North Face',  
      logo: '/images/companyLogos/planetCompany3.png', 
      id: 3,
      descriptions: [
        'The North Face (рус. Северный склон) — американская компания, специализирующаяся на производстве высококачественной технологичной спортивной, горной одежды, туристического инвентаря.',
        'Продукция предназначается для альпинистов, скалолазов, туристов и людей, ведущих активный образ жизни.'
      ]
    },
    {name: 'The North Face',  
      logo: '/images/companyLogos/planetCompany4.png', 
      id: 4,
      descriptions: [
        'The North Face (рус. Северный склон) — американская компания, специализирующаяся на производстве высококачественной технологичной спортивной, горной одежды, туристического инвентаря.',
        'Продукция предназначается для альпинистов, скалолазов, туристов и людей, ведущих активный образ жизни.'
      ]
    },
    {name: 'The North Face',  
      logo: '/images/companyLogos/planetCompany5.jpg', 
      id: 5,
      descriptions: [
        'The North Face (рус. Северный склон) — американская компания, специализирующаяся на производстве высококачественной технологичной спортивной, горной одежды, туристического инвентаря.',
        'Продукция предназначается для альпинистов, скалолазов, туристов и людей, ведущих активный образ жизни.'
      ]
    },
  ]

  const triggerRef = useRef<HTMLDivElement>(null!)
  const [active, setActive] = useState<boolean>(false)

  useTriggerOnVisible(triggerRef, ()=>{setActive(true)}, {offset: 100})  

  const [currentCompany, setCurrentCompany] = useState<ICompany>(companies[0])

  const memoedPlanet = useMemo(()=><Planet active={active}  companies={companies} onClick={(id)=>{
    setCurrentCompany(companies.find(el => el.id === id))}
  }/>, [active])

  return (<section className={styles.root} ref={triggerRef}>
    <div className={styles.imageWrapper}>
      {memoedPlanet}
    </div>
    <div className={styles.body}>
      <P styleType={['fs32', 'w600']} useThemeColor className={styles.title}>{t('landing_em_possibilities')}</P>
      <div className={styles.card}>
        <UserPic className={styles.card_pic} image={currentCompany.logo} size={55}/>
        <P styleType={['huge', 'w500']} useThemeColor className={styles.card_title}>{currentCompany.name}</P>
        <div className={styles.rating}>
          <span className={styles.rating_stats}>4,9</span>
          <RatingLine rating={4}/>
          <span className={styles.rating_feeds}>23 отзыва</span>
        </div>
      </div>
      {currentCompany.descriptions.map((el, i)=>{
        return <p key={i} className={styles.desc}>{el}</p>
      })}
      <Button styleType={['grey', 'whiteText']} altStyleType={['gradient']} className={styles.button}>{t('landing_em_possibilities_open')}</Button>
    </div>

  </section>)
}