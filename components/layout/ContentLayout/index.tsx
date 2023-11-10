import Head from 'next/head'
import Footer from '../Footer'

interface Props {
  title?: string,
  description?: string 
  children: JSX.Element|JSX.Element[]
  withFooter?: boolean
}

/**
 * @title string
 * @description string 
 * @children JSX.Element|JSX.Element[]
 * @withFooter boolean
 */
export default function ContentLayout(props: Props) {

  return (
  <>
    {
      props.title &&
      <Head>
        <title>{`Arbi Hunter|${props.title}`}</title>
        <meta name='description' content={props.description||props.title}/>
      </Head>
    }
    <div className='contentWrapper'> 
      {props.children}
    </div>
    {props.withFooter &&
      <Footer/>
    }
  </>
  )
}