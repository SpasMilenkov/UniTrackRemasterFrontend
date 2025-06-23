export interface SubjectExcusedUnexcusedDto {
  subjectId: string;
  subjectName: string;
  excusedCount: number;
  unexcusedCount: number;
  total: number;
  excusedPercentage: number;
  unexcusedPercentage: number;
}
