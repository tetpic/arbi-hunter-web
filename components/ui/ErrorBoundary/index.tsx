
import { Component, ErrorInfo } from 'react'
import P from '../P'
import styles from './index.module.scss'

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    debugger
    console.log({ error, errorInfo })
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
    // window.location.reload()
  }
  render() {
    
    //@ts-ignore
    if (this.state.hasError) {
      return (
        <div className={styles.root}>
          <P useThemeColor styleType={['huge', 'w600']}>Oops, there is an error!</P>
          <P useThemeColor styleType={['medium', 'w600']}>You will be redirected to main page.</P>
          {/* <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button> */}
        </div>
      )
    }
        //@ts-ignore
    return this.props.children
  }
}

export default ErrorBoundary
