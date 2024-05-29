import styles from './index.module.scss'
import { SpinnerCircular } from 'spinners-react'
import { colors } from 'styles/variables'
import classNames from 'classnames'
import { AppTheme } from 'types/enums'
import { useAppContext } from 'context/state'

interface Props {
  size: number
  color?: string
  secondaryColor?: string
  center?: boolean
  className?: string
}

export default function Spinner(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return <></>
  
  return (
    <div className={classNames({
      [styles.root]: true,
      [styles.center]: props.center,
    }, props.className)}>
      <SpinnerCircular
        size={props.size}
        color={props.color ?? colors.blue}
        secondaryColor={props.secondaryColor ?? isLightTheme?colors.white:colors.black}
        thickness={150}
      />
    </div>
  )
}

