import { ImageResponse } from 'next/server'
import { IVacancy } from 'data/interfaces/IVacancy'
import { getSalary } from 'utils/getSalary'
import {AH_FOOTER_IMAGE, AH_FULL_LOGO_IMAGE, getFont} from 'utils/shareImage'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  const vacancy: IVacancy = await fetch(
    `${process.env.HOST_INNER}/api/vacancy/${id}`,
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
          paddingTop: '80px',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          color: 'white',
          backgroundColor: '#f1f1f1',
          backgroundImage: `url("${AH_FOOTER_IMAGE}"), linear-gradient(60deg, #22222a 20%, #a46cdc 65%,  #586de4 100%)`,
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
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            height: '460px',
            padding: '0 100px',
            minWidth: '1000px'
          }}
        >
          <div style={{ display: 'flex', fontSize: '40px', lineHeight: '20px', fontWeight: 800}}>
            <img src={AH_FULL_LOGO_IMAGE} alt="" width={320}  />
          </div>
          <div style={{ display: 'flex', fontSize: '40px', lineHeight: '20px', marginTop: '66px', fontWeight: 800}}>
            {vacancy.company}
          </div>
          <div style={{ display: 'flex', width: '100%', fontSize: '52px', fontWeight: 900, marginTop: '32px', lineHeight: '32px'  }}>
            {vacancy.categories[0].name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap',  alignItems: 'center', marginTop: 'auto', fontSize: '42px', lineHeight: '52px', fontWeight: 700 }}>
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
