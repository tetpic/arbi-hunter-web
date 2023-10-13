export interface MessageFilterOptions {
  vacanciesId?: number[];
  type?: any // UserCvOrVacancyStatus
  search?: string
  folderId?: number ;
  onlyUnread?: boolean;
  inactive?: boolean;
  page?: number;
  limit?: number;
}