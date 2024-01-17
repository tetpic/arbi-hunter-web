import SmallStarActiveSvg from 'components/svg/SmallStarSvg'
import styles from './index.module.scss'
import SmallStarPassiveSvg from 'components/svg/SmallStarPassiveSvg'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import { colors } from 'styles/variables'

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
      .map((el, index)=> el===true&&<SmallStarActiveSvg key={index}/>
        || 
        Number(el)>0 && <SmallStarPassiveSvg key={index} className={styles.halfStar}/>
        ||
        <SmallStarPassiveSvg key={index} color={colors.greyLight}/>)}
    </p>
 )
}