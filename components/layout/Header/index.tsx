import styles from './index.module.scss'
import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface Props {
}

export default function Header(props: Props) {

  //временно
  const [link, changeLink] = useState<'user'|'company'>('user')

  const usrBtn = useRef<HTMLButtonElement>(null!)
  const cmpBtn = useRef<HTMLButtonElement>(null!)




  return ( 
    <div className={styles.root}>
      <Image src={'/favicon.svg'} alt={'logo'} width={50} height={50}/>
      <div className={classnames(styles.contentWrapper, 'contentWrapper')}>
        <div className={styles.modeWrapper}>
          <div className={classnames(styles.buttonBack, link==='company'&&styles.buttonBack_active)} style={{width: link==='company'?cmpBtn.current?.clientWidth: usrBtn?.current?.clientWidth}}></div>
          <button ref={usrBtn} className={classnames(styles.modeButton, link==='user'&&styles.modeButton_active)} onClick={()=>{changeLink('user')}}>Соискатель</button>
          <button ref={cmpBtn} className={classnames(styles.modeButton, link==='company'&&styles.modeButton_active)} onClick={()=>{changeLink('company')}}>Компания</button>
        </div>
        <Link className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
        <Link className={styles.link} href={'/media'}>Медиа</Link>
        <Link className={styles.link} href={'/e-lessons'}>Онлайн обучение</Link>
        <div className={styles.userWrapper}>
          <Link className={classnames(styles.userLink, styles.userLinkReg)} href={'/registration'}>Регистрация</Link>
          <Link className={styles.userLink} href={'/login'}>Вход</Link>
        </div>
      </div>
    </div>
  )
}