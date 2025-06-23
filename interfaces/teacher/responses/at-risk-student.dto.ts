export interface AtRiskStudentDto {
  id: string;
  firstName: string;
  lastName: string;
  gradeId: string;
  gradeName: string;
  totalAbsences: number;
  absenceRate: number;
  riskLevel: 'high' | 'medium';
  recentPattern: Array<'present' | 'absent' | 'late'>;
}
