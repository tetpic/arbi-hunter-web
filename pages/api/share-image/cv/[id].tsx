import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(request: NextApiRequest, response: NextApiResponse<{id: string}>) {
  console.log(response)
  const {id} = request.query
  return response.end(`lol ${id}`)

}