import classnames from 'classnames'
import PlusSvg from 'components/svg/PlusSvg'
import styles from './index.module.scss'
import P from '../P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClick: ()=>void
  text?: string
  title?: string
  className?: string
  test?:string
}

export default function AddButton(props: Props) {
  const {t} = useTranslation()

  return ( <>
    <P 
    styleType={['medium', 'w500']} 
    useThemeColor 
    className={classnames(styles.link, props.className)} 
    data-cy={props.test} 
    title={props.title} 
    onClick={props.onClick}
    >
      <PlusSvg className={styles.plusSvg} />{props.text?props.text: t('add')}
    </P>
  </>)
}