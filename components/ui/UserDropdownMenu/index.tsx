import styles from './index.module.scss'

import classNames from 'classnames'
import ExitRedSvg from 'components/svg/ExitRedSvg'
import FolderSvg from 'components/svg/FolderSvg'
import HeartSvg from 'components/svg/HeartSvg'
import SettingsSvg from 'components/svg/SettingsSvg'
import ShopSvg from 'components/svg/ShopSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import Image from 'next/image'
import Link from 'next/link'
import Formatter from 'utils/formatter'
import Button from '../Button'
import UserPic from '../UserPic'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import UserSvg from 'components/svg/UserSvg'
import { getUserImageSource } from 'utils/helpers'

interface Props {
  className?: string
  onClose?: ()=> void
  reference?: (r: HTMLDivElement)=>void
}

interface UserData {
  name: string, 
  sub: string
}

export default function UserDropdownMenu(props: Props) {

  const {currentProfile, user, logout} = useUserContext()
  const profileType = currentProfile?.profileType||null

  const getUserData = (): UserData =>  {
    switch (profileType) {
      case ProfileType.Employee: 
        return {
          name: `${currentProfile.firstName} ${currentProfile.lastName}`, 
          sub: `${currentProfile.city?.locName||''}`
        }
      case ProfileType.Hirer: 
        return {
          name: `${currentProfile.company}`,
          sub: 'Компания'
        }
    }
  }

  const getUserMenu = (): {name: string, image: JSX.Element, link: string}[] => {
    let userItems: {name: string, image: JSX.Element, link: string}[]  = []
    switch(profileType) {
      case ProfileType.Employee: 
       userItems = [
        // {name: 'Настройки профиля', image: <SettingsSvg/>, link: '/profile?page=settings'},
        {name: 'Сохраненное', image: <HeartSvg/>, link: '/profile?page=saved'},
        {name: 'Мои резюме', image: <FolderSvg/>, link: '/profile?page=cvs'},
        {name: 'Магазин', image: <ShopSvg/>, link: '/profile?page=shop'},
        {name: 'База знаний', image: <DocumentDoubleSvg/>, link: '/base'},
        {name: 'Персональная страница', image: <UserSvg/>, link: '/personal/my'}

      ]
      return userItems
      case ProfileType.Hirer:
      userItems = [
        {name: 'Настройки профиля', image: <SettingsSvg/>, link: '/profile?page=personal'},
        {name: 'Сохраненное', image: <HeartSvg/>, link: '/profile?page=saved'},
        {name: 'Вакансии', image: <FolderSvg/>, link: '/profile?page=vacancies'},
        {name: 'Магазин', image: <ShopSvg/>, link: '/profile?page=shop'},
        {name: 'База знаний', image: <DocumentDoubleSvg/>, link: '/base'},
        {name: 'Персональная страница', image: <UserSvg/>, link: '/personal/my'}
      ]
      return userItems
    }
  }



  return ( 
    <div className={classNames(styles.root, props.className)} ref={(ref)=> props.reference(ref)}>
      <UserPic size={80} image={getUserImageSource(currentProfile)}/>

      <div className={styles.userData}>
        <p className={styles.name}>{getUserData()?.name}</p>
        <p className={styles.sub}>{getUserData()?.sub}</p>
      </div>

      <div className={styles.balanceWrapper}>
        <p className={styles.title}>Баланс профиля</p>
        <p className={styles.balance}>
          <Image src={'/icons/money.png'} alt={'money image'} width={24} height={24}/>
          {Formatter.formatNumber(user?.balance||0)}
        </p>
        <Button className={styles.moneyAdd} type='button' onClick={()=> {}}>Пополнить</Button>
      </div>

      <div className={styles.itemsWrapper}>
        {getUserMenu()?.map((el, index)=> {
          return <Link key={index} onClick={()=> {props.onClose()}} href={el.link} className={styles.item}>{el.image}  {el.name}</Link>
        })}
      </div>

      <button className={styles.exitButton} onClick={()=>logout()}><ExitRedSvg/>Выйти</button>
    </div>
  )
}