import {ReactElement} from 'react'

interface Props {
  children: ReactElement
}

/**
 * Shows child elements on all screens except mobile (XS)
 */
export default function HiddenXs(props: Props): JSX.Element | null {

    return props.children

}

