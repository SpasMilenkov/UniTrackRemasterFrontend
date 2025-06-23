export interface GradeScaleDto {
  id: string;
  grade: string;
  description?: string;
  minimumScore: number;
  maximumScore: number;
  gpaValue: number;
  status?: 'pass' | 'fail' | 'conditional';
}