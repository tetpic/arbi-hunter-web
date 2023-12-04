import { useResize } from 'components/hooks/useResize'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import LoupeSvg from 'components/svg/LoupeSvg'
import Button from 'components/ui/Button'
import { ChangeEvent, ReactElement } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onSave: () => void
  children: ReactElement | ReactElement[]
  title?: string
  placeholder?: string
  withInput?: boolean|undefined
  disabledButton?: boolean|undefined
}

export default function Body(props: Props) {

  const {isPhoneWidth} = useResize()

  return (<>
  <p className={styles.title}>
    {isPhoneWidth && 
      <Button className={styles.buttonSmall} onClick={props.onClose}><ArrowDownSvg className={styles.arrow}/></Button>
    }
    {props.title}
  </p>
    {props.withInput !== false&&
      <div className={styles.inputWrapper}>
        <LoupeSvg className={styles.loupeSvg}/>
          <input className={styles.input} type="text" onChange={props.onChange} placeholder={props.placeholder} />
      </div>
    }
      <div className={styles.positionsWrapper}>
        {props.children}
      </div>
  <div className={styles.buttonsWrapper}>
    {!isPhoneWidth && 
      <Button className={styles.buttonDefault} onClick={props.onClose} >Отменить</Button>
    }
    <Button className={classNames(styles.buttonYellow, props.disabledButton&&styles.disabled)} onClick={props.onSave} title={'Выберите позицию из списка'}>Выбрать</Button>
  </div>
  </>)
}