import { IJob } from "./IJob"

export interface IVacancyCreate extends IJob {
    name : string,
    description : string,
    experience : string,//"from3to6"
    contactName : string,//"Пупкин Василий Иванович"
    company : string, //"ООО Александрия"
    isRemote: boolean,
}