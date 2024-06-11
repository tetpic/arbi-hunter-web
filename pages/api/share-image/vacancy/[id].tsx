import { ImageResponse } from 'next/server'
import { IVacancy } from 'data/interfaces/IVacancy'
import { getSalary } from 'utils/getSalary'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  const getFont = async () => {
    const response = await fetch(`${process.env.host}/fonts/Montserrat-SemiBold.ttf`)
     const buffer = await response.arrayBuffer()
     return buffer
   }

  const vacancy: IVacancy = await fetch(
    `${process.env.host}/api/vacancy/${id}`,
    { next: { revalidate: 0 } }
  ).then((res) => res.json() as Promise<IVacancy>)
  const salary = getSalary({vacancy})
  const location = [vacancy.country?.locName, vacancy?.city?.locName]
    .filter((i) => !!i)
    .join(', ')
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '100px',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          color: 'white',
          backgroundColor: '#f1f1f1',
          backgroundImage: `url("${process.env.host}/images/ahFooter.svg"), linear-gradient(60deg, #22222a 20%, #a46cdc 65%,  #586de4 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 120%',
          backgroundPosition: 'bottom center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '120px',
            lineHeight: '62px',
            flexDirection: 'column',
            padding: '0 82px',
            minWidth: '900px'
          }}
        >
          <div style={{ display: 'flex', fontSize: '40px', lineHeight: '20px', fontWeight: 800}}>
            <img src={`${process.env.host}/images/ahFullLogo.svg`} alt="" width={320}  />
          </div>
          <div style={{ display: 'flex', fontSize: '40px', lineHeight: '20px', marginTop: '66px', fontWeight: 800}}>
            {vacancy.company}
          </div>
          <div style={{ display: 'flex', width: '100%', fontSize: '52px', fontWeight: 900, marginTop: '32px', lineHeight: '32px'  }}>
            {vacancy.categories[0].name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', marginTop: '144px', fontSize: '32px', lineHeight: '20px', fontWeight: 700 }}>
            {salary ?? ''}
            {!!location && <div style={{width: '8px', height: '8px', borderRadius: '8px', backgroundColor: '#ffffff', marginLeft: '16px', marginRight: '16px'}}></div> }
            {location ?? ''}
            {<div style={{width: '8px', height: '8px', borderRadius: '8px', backgroundColor: '#ffffff', marginLeft: '16px', marginRight: '16px'}}></div> }
            {vacancy.isRemote ? 'Удаленно' : 'Офис'}
          </div>
        </div>
      </div>
    ),
    {
      fonts: [
        {
          name: 'Montserrat',
          data: await getFont(),
          style: 'normal',
          weight: 600
        }
      ],
    }
  )
}
