import { useAppContext } from 'context/state'

interface Props {
  flex?: number
  mobileOnly?: boolean
  desktopOnly?: boolean
  basis?: number
  hide?: boolean
}

/**
 * @flex number
 * @mobileOnly boolean 
 * @desktopOnly boolean
 * @basis number  
 */
export default function Spacer(props: Props) {
  const appContext = useAppContext()

  if (props.mobileOnly) {
    return null
  }

  if (props.desktopOnly && appContext.isMobile) {
    return null
  }

  if(props.hide ) {
    return null
  }

  return (
    <div className="spacer" style={{height: props.basis+'px', display: 'block'}}>
      <style jsx>{`
        .spacer{
          flex: ${props.flex ?? 1} 0 ${props.basis ? `${props.basis}px` : 'auto'};
        }
      `}</style>
    </div>
  )
}

