import { IPurchase, ITariff } from 'data/interfaces/Common'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { PurchaseType } from 'types/enums'

interface IState {
  packets: Map<number, ITariff>
  purchased: Map<number, IPurchase>
  activeSubscriptions: Map<number, IPurchase>
  setActiveSubscriptions: (types: PurchaseType[]) => Promise<IPurchase[]>
  setPackets: (types: PurchaseType[]) => void
  setPacketsState: Dispatch<SetStateAction<Map<number, ITariff>>>
}



const TariffContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function TariffWrapper(props: Props) {
  const [packets, setPacketsState] =  useState<Map<number, ITariff>>(new Map)
  const [purchased, setPurchasedState] =  useState<Map<number, IPurchase>>(new Map)
  const [activeSubscriptions, setActiveSubscriptionsState] =  useState<Map<number, IPurchase>>(new Map)

  const setPackets = async(types: PurchaseType[]) => {
    const tariffs = await Promise.all(types.map(t=> PurchaseRepository.getTariff(t)))
    tariffs.forEach(el => {
      el.forEach(e=> {
        setPacketsState(state => {
          state.set(e.id, e)
          return new Map(state)
        })
      })
    })


    PurchaseRepository.getPurchasedItems({purchaseType: types.join(','), page: 1, limit: 100, state: 'active'})
    .then(res=> {
      setPurchasedState(state => {
        res.data.forEach(t => state.set(t.id, t))
        return new Map(state)
      })
    })

  }

  const setActiveSubscriptions = async(types: PurchaseType[]):Promise<IPurchase[]> => {
    const res = await PurchaseRepository.getActiveSubscriptions({purchaseType: types})
    setActiveSubscriptionsState(state => {
      res.data.forEach(t => state.set(t.id, t))
      return new Map(state)
    })
    return res.data
  }

  const value: IState = {
    packets,
    setPackets,
    setPacketsState,
    purchased,
    setActiveSubscriptions,
    activeSubscriptions
    
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
