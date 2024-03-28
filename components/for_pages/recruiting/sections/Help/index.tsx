import styles from './index.module.scss'
import Image from 'next/image'
import dialog1 from 'images/recruiting/dialog_1.png'
import dialog2 from 'images/recruiting/dialog_2.png'
import telegram from 'images/recruiting/recruiting_telegram.png'
import Button from 'components/ui/Button'
import { useRef } from 'react'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function Help(props: Props) {
  const {t} = useTranslation()
  const triggerRef = useRef<HTMLDivElement>(null!)
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  useTriggerOnVisible(triggerRef, ()=> {
    document.querySelectorAll(`.${styles.image}`).forEach(el=> el.classList.add(`${styles.image_active}`))
  })

  return (
    <section className={styles.root} ref={triggerRef}>
      <p className={styles.title}>{t('landing_help_needHelp')} <br/> {t('landing_help_leaveOrder')}</p>
      <Button className={styles.button}>
        <Image src={telegram} alt={'telegram icon'}/>
        {t('landing_help_writeUs')}
      </Button>
      {!isTabletWidth && 
      <>
        <Image className={classNames(styles.image, styles.image2)} width={256} height={256} src={dialog2} alt={'faq image'}/>
        <Image className={classNames(styles.image, styles.image1)} width={256} height={256} src={dialog1} alt={'faq image'}/>
      </>
      } 
    </section>
  )
}