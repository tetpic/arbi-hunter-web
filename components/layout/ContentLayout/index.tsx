import Head from 'next/head'

interface Props {
  title?: string,
  description?: string 
  children: JSX.Element|JSX.Element[]
}

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
  </>
  )
}