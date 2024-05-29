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

interface Props {
}

export default function MobileBottomMenu(props: Props) {
  const userContext = useUserContext()

  return (<div className={styles.root}> 
  <div className={styles.links}>
    <Button styleType={['icon', 'backTransparent']} href={'/'}><MenuHomeSvg/></Button>
    <Button styleType={['icon', 'backTransparent']} href={'/messenger'}><MenuChatsSvg/></Button>
    <Button styleType={['icon', 'gradient']} href={'/recruiting'}><MenuSearchSvg/></Button>
    {userContext?.currentProfile?.profileType === ProfileType.Hirer &&
      <Button styleType={['icon', 'backTransparent']} href={'/favorites'}>
        <MenuStarSvg/>
      </Button>
      ||
      <Button styleType={['icon', 'backTransparent']} href={'/profile?page=feedbacks'}>
        <MenuFeedbacksSvg color={colors.greyLight}/>
      </Button>
    }
    <Button styleType={['icon', 'backTransparent']} href={'/settings'}><MenuUserSvg/></Button>
  </div>

  </div>)
}