import { IPurchase, ITariff } from 'data/interfaces/Common'
import { ProfileType } from 'data/interfaces/IRegistration'
import TariffRepository from 'data/repositories/TariffRepository'
import { createContext, useContext, useState } from 'react'
import { PurchaseType } from 'types/enums'

interface IState {
  packets: Map<number, ITariff>
  purchased: Map<number, IPurchase>
  setPackets: (profileType: ProfileType) => Promise<void>
  
}



const TariffContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function TariffWrapper(props: Props) {
  const [packets, setPacketsState] =  useState<Map<number, ITariff>>(new Map)
  const [purchased, setPurchasedState] =  useState<Map<number, IPurchase>>(new Map)

  const setPackets = async(profileType: ProfileType) => {
    if(profileType === ProfileType.Employee) {
      const [cvTariffs, modelTariffs] = await Promise.all([
        TariffRepository.getTariff(PurchaseType.CvTariff),
        TariffRepository.getTariff(PurchaseType.Character)
      ])
      setPacketsState(state => {
        cvTariffs.forEach(t => state.set(t.id, t))
        modelTariffs.forEach(t => state.set(t.id, t))
        return new Map(state)
      })
    }

    TariffRepository.getPurchasedItems({page: 1, limit: 10, state: 'active'})
    .then(res=> {
      setPurchasedState(state => {
        res.data.forEach(t => state.set(t.id, t))
        return new Map(state)
      })
    })

  }

  const value: IState = {
    packets,
    setPackets,
    purchased
  }

  return (
    <TariffContext.Provider value={value}>
      {props.children}
    </TariffContext.Provider>
  )
}

export function useTariffContext() {
  return useContext(TariffContext)
}
