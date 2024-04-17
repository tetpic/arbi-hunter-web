import { PatternTypes, ProposalRequestType } from 'types/enums'
import { TimeStamp } from './Common'

export interface IPatternBase {
  type?: ProposalRequestType,
  template?: string
}

export interface IPattern extends TimeStamp, IPatternBase{
  id?: number,
  profileId?: number,
}

export interface IPatternRequest {
  type: PatternTypes,
  cvId: number,
  vacancyId: number
}

export interface IPatternResponce extends IPattern {
  message: string
}