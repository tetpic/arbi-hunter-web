import styles from './index.module.scss'
import MenuHomeSvg from '@/components/svg/MenuHomeSvg'
import MenuChatsSvg from '@/components/svg/MenuChatsSvg'
import MenuSearchSvg from '@/components/svg/MenuSearchSvg'
import MenuUserSvg from '@/components/svg/MenuUserSvg'
import Button from '../Button'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { colors } from 'styles/variables'
import MenuFeedbacksSvg from '@/components/svg/MenuFeedbacksSvg'
import MenuStarSvg from '@/components/svg/MenuStarSvg'
import { useRouter } from 'next/router'

interface Props {
}

export default function MobileBottomMenu(props: Props) {
  const userContext = useUserContext()
  const router = useRouter()
  const path = router.pathname
  
  const routes = {
    home: '/',
    messenger: '/messenger',
    recruiting: '/recruiting',
    favorites: '/favorites',
    feedbacks: '/profile?page=feedbacks',
    settings: '/settings'
  }

  return (<div className={styles.root}> 
  <div className={styles.links}>
    <Button styleType={['icon', 'backTransparent']} href={routes.home}><MenuHomeSvg color={path === routes.home ? colors.blue : colors.greyLight} /></Button>
    <Button styleType={['icon', 'backTransparent']} href={routes.messenger}><MenuChatsSvg  color={path === routes.messenger ? colors.blue : colors.greyLight}/></Button>
    <Button styleType={['icon', 'gradient']} href={routes.recruiting}><MenuSearchSvg/></Button>
    {userContext?.currentProfile?.profileType === ProfileType.Hirer &&
      <Button styleType={['icon', 'backTransparent']} href={routes.favorites}>
        <MenuStarSvg  color={path === routes.favorites ? colors.blue : colors.greyLight}/>
      </Button>
      ||
      <Button styleType={['icon', 'backTransparent']} href={routes.feedbacks}>
        <MenuFeedbacksSvg color={path === routes.feedbacks ? colors.blue : colors.greyLight}/>
      </Button>
    }
    <Button styleType={['icon', 'backTransparent']} href={routes.settings} ><MenuUserSvg  color={path === routes.settings ? colors.blue : colors.greyLight}/></Button>
  </div>

  </div>)
}