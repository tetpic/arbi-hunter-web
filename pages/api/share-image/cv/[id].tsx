import { ImageResponse } from 'next/server'
import { ICV } from 'data/interfaces/ICV'
import { getSalary } from 'utils/getSalary'
import { getFont, getShareImageBgBase64} from 'utils/shareImage'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  const cv: ICV = await fetch(
    `${process.env.HOST_INNER}/api/cv/${id}`,
    { next: { revalidate: 0 } }
  ).then((res) => res.json() as Promise<ICV>)

  const salary = getSalary({cv})||'Договорная'
  const location = [cv.country?.locName, cv?.city?.locName]
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
          backgroundImage: `url("data:image/png;base64,${await getShareImageBgBase64()}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
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
          <div style={{ display: 'flex', fontSize: '40px', lineHeight: '20px', fontWeight: 600, height: '92.44px'}}>

          </div>
          <div style={{ display: 'flex', width: '100%', fontSize: '52px', fontWeight: 600, marginTop: '52px', lineHeight: '32px'  }}>
            {cv.categories?.[0]?.name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row',  flexWrap: 'wrap',  alignItems: 'center', marginTop: 'auto', fontSize: '42px', lineHeight: '52px', fontWeight: 600 }}>
            {salary || ''}
            {!!location && <div style={{width: '8px', height: '8px', borderRadius: '8px', backgroundColor: '#ffffff', marginLeft: '16px', marginRight: '16px'}}></div> }
            {location ?? ''}
            {<div style={{width: '8px', height: '8px', borderRadius: '8px', backgroundColor: '#ffffff', marginLeft: '16px', marginRight: '16px'}}></div> }
            {cv.isRemote ? 'Удаленно' : 'Офис'}
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
        },
      ],
    }
  )
}
