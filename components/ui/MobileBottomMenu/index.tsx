import styles from './index.module.scss'
import MenuHomeSvg from '@/components/svg/MenuHomeSvg'
import MenuChatsSvg from '@/components/svg/MenuChatsSvg'
import MenuSearchSvg from '@/components/svg/MenuSearchSvg'
import MenuHeartSvg from '@/components/svg/MenuHeartSvg'
import MenuUserSvg from '@/components/svg/MenuUserSvg'
import Button from '../Button'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import MenuStarSvg from '@/components/svg/MenuStarSvg'

interface Props {
}

export default function MobileBottomMenu(props: Props) {
  const userContext = useUserContext()

  return (<div className={styles.root}> 
  <div className={styles.links}>
    <Button styleType={['icon', 'backTransparent']} href={'/'}><MenuHomeSvg/></Button>
    <Button styleType={['icon', 'backTransparent']} href={'/messenger'}><MenuChatsSvg/></Button>
    <Button styleType={['icon', 'gradient']} href={'/recruiting'}><MenuSearchSvg/></Button>
    <Button styleType={['icon', 'backTransparent']} href={'/favorites'}>
      {userContext.currentProfile.profileType === ProfileType.Employee
      ?<MenuHeartSvg/>
      :<MenuStarSvg/>}
    </Button>
    <Button styleType={['icon', 'backTransparent']} href={'/personal/my'}><MenuUserSvg/></Button>
  </div>

  </div>)
}