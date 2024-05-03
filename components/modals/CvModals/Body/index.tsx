import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import LoupeSvg from 'components/svg/LoupeSvg'
import Button from 'components/ui/Button'
import { ChangeEvent} from 'react'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onSave: () => void
  children: JSX.Element | JSX.Element[]
  title?: string
  placeholder?: string
  withInput?: boolean|undefined
  disabledButton?: boolean|undefined
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

  const {isPhoneWidth} = useResize()


  return (<>
  {props.title &&
    <P useThemeColor styleType={['large', 'w600']} className={styles.title}>
      {isPhoneWidth && 
        <Button className={styles.buttonSmall} onClick={()=>props.onClose()}><ArrowDownSvg className={styles.arrow}/></Button>
      }
      {props.title}
    </P>
  }
    {props.withInput !== false&&
      <div className={styles.inputWrapper}>
        <LoupeSvg className={styles.loupeSvg}/>
          <input className={styles.input} type="text" data-cy={'modal_search'} onChange={props.onChange} placeholder={props.placeholder} />
      </div>
    }
      <div className={classNames(styles.positionsWrapper, !props.title&&styles.noTitle)}>
        {props.children}
      </div>
  <div className={styles.buttonsWrapper}>
    {!isPhoneWidth && 
      <Button styleType={['grey']} altStyleType={['whitePurple']} type='button' onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        props.onClose()}} >{t('cancel')}</Button>
    }
    <Button 
    styleType={['gradient']}
    disabled={props.disabledButton}
    onClick={props.onSave} 
    title={'saveSkill'}>
      {t('set')}
    </Button>
  </div>
  </>)
}