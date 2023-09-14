import { ApplicationStatus, ProposalRequestType } from 'types/enums'

export interface IProposal {
  applicationId?: number,
  cvId: number,
  vacancyId: number,
  type: ProposalRequestType,
  coverLetter : string
}

export interface IStat {
  status: ApplicationStatus,
  count: number
}
