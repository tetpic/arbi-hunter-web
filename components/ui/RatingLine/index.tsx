import SmallStarActiveSvg from 'components/svg/SmallStarSvg'
import styles from './index.module.scss'
import SmallStarPassiveSvg from 'components/svg/SmallStarPassiveSvg'
import Formatter from 'utils/formatter'
import classNames from 'classnames'

interface Props {
  rating: number
  starClass?: string
}

export default function RatingLine(props: Props) {

  return (
    <p 
    className={classNames(styles.stars, props.starClass)}
    >
      {Formatter.getMarks(props.rating)
      .map(el=> el===true&&<SmallStarActiveSvg/>
        || 
        Number(el)>0 && <SmallStarPassiveSvg className={styles.halfStar}/>
        ||
        <SmallStarPassiveSvg/>)}
    </p>
 )
}