export interface CourseGradeDto {
  id: string;
  code: string;
  name: string;
  instructor: string;
  score: number;
  grade: string;
  credits?: number;
  term: string;
  semesterId?: string;
  semesterName: string;
  status: string;
}
