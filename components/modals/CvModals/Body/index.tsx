import styles from './index.module.scss'

import LoupeSvg from 'components/svg/LoupeSvg'
import Button from 'components/ui/Button'
import { ChangeEvent} from 'react'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'


interface Props {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onSave: () => void
  children: JSX.Element | JSX.Element[]
  title?: string
  placeholder?: string
  withInput?: boolean|undefined
  disabledButton?: boolean|undefined
  disableBackButton?: boolean
  className?: string
}



/**
 * @onChange  (e: ChangeEvent<HTMLInputElement>) => void
 * @onClose () => void
 * @onSave () => void
 * @children ReactElement | ReactElement[]
 * @title  string
 * @placeholder  string
 * @withInput  boolean|undefined
 * @disabledButton  boolean|undefined
 */
export default function Body(props: Props) {
  const {t} = useTranslation()

  const appContext = useAppContext()
  const {isPhoneWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light


  return (<>
  {props.title &&
    <P useThemeColor styleType={['large', 'w600', 'alignCenter']} className={classNames(styles.title, props.disableBackButton && styles.title_noBack)}>
      {/* {!isPhoneWidth &&  */}
      {!props.disableBackButton && 
        <Button styleType={['icon', 'black']} altStyleType={['icon', 'white', 'invertSvg']} onClick={()=>props.onClose()}><ArrowLeftSvg className={styles.arrow}/></Button>
      }
      {/* } */}
      {props.title}
    </P>
  }
    {props.withInput !== false&&
      <div className={classNames(styles.inputWrapper, isLightTheme&&styles.inputWrapper_light)}>
        <LoupeSvg className={styles.loupeSvg}/>
          <input className={styles.input} type="text" data-cy={'modal_search'} onChange={props.onChange} placeholder={props.placeholder} />
      </div>
    }
      <div className={classNames(styles.positionsWrapper, !props.title&&styles.noTitle)}>
        {props.children}
      </div>
  <div className={styles.buttonsWrapper}>
    {!isPhoneWidth && 
      <Button styleType={['grey', 'whiteText']} altStyleType={['whitePurple']} type='button' onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        props.onClose()}} >{t('cancel')}</Button>
    }
    <Button 
    styleType={['gradient', 'phoneWide']}
    disabled={props.disabledButton}
    onClick={props.onSave} 
    title={'saveSkill'}>
      {t('save')}
    </Button>
  </div>
  </>)
}