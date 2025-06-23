// interfaces/academic/semester.ts
export enum SemesterType {
  // Higher Education Terms
  Fall = 'Fall',
  Spring = 'Spring',
  Summer = 'Summer',
  Winter = 'Winter',
  Intersession = 'Intersession',
  
  // K-12 Quarter System
  FirstQuarter = 'FirstQuarter',
  SecondQuarter = 'SecondQuarter', 
  ThirdQuarter = 'ThirdQuarter',
  FourthQuarter = 'FourthQuarter',
  
  // K-12 Trimester System
  FirstTrimester = 'FirstTrimester',
  SecondTrimester = 'SecondTrimester',
  ThirdTrimester = 'ThirdTrimester'
}

export enum SemesterStatus {
  Upcoming = 'Upcoming',
  Active = 'Active',
  Completed = 'Completed',
  Archived = 'Archived',
  Cancelled = 'Cancelled'
}
// Helper functions for semantic grouping
export function isHigherEducationTerm(type: SemesterType): boolean {
  return [
    SemesterType.Fall,
    SemesterType.Spring,
    SemesterType.Summer,
    SemesterType.Winter,
    SemesterType.Intersession
  ].includes(type);
}

export function isQuarterTerm(type: SemesterType): boolean {
  return [
    SemesterType.FirstQuarter,
    SemesterType.SecondQuarter,
    SemesterType.ThirdQuarter,
    SemesterType.FourthQuarter
  ].includes(type);
}

export function isTrimesterTerm(type: SemesterType): boolean {
  return [
    SemesterType.FirstTrimester,
    SemesterType.SecondTrimester,
    SemesterType.ThirdTrimester
  ].includes(type);
}

export function isK12Term(type: SemesterType): boolean {
  return isQuarterTerm(type) || isTrimesterTerm(type);
}

// Get appropriate terms for institution type
export function getTermsForInstitutionType(isHigherEd: boolean): Array<{label: string, value: SemesterType, group?: string}> {
  if (isHigherEd) {
    return [
      { label: 'Fall Semester', value: SemesterType.Fall, group: 'Standard Terms' },
      { label: 'Spring Semester', value: SemesterType.Spring, group: 'Standard Terms' },
      { label: 'Summer Session', value: SemesterType.Summer, group: 'Special Terms' },
      { label: 'Winter Session', value: SemesterType.Winter, group: 'Special Terms' },
      { label: 'Intersession', value: SemesterType.Intersession, group: 'Special Terms' }
    ];
  } else {
    return [
      { label: '1st Quarter', value: SemesterType.FirstQuarter, group: 'Quarter System' },
      { label: '2nd Quarter', value: SemesterType.SecondQuarter, group: 'Quarter System' },
      { label: '3rd Quarter', value: SemesterType.ThirdQuarter, group: 'Quarter System' },
      { label: '4th Quarter', value: SemesterType.FourthQuarter, group: 'Quarter System' },
      { label: '1st Trimester', value: SemesterType.FirstTrimester, group: 'Trimester System' },
      { label: '2nd Trimester', value: SemesterType.SecondTrimester, group: 'Trimester System' },
      { label: '3rd Trimester', value: SemesterType.ThirdTrimester, group: 'Trimester System' }
    ];
  }
}

// Get display name with proper terminology
export function getTermDisplayName(type: SemesterType, isHigherEd: boolean): string {
  const termMap: Record<SemesterType, { higherEd: string; k12: string }> = {
    [SemesterType.Fall]: { higherEd: 'Fall Semester', k12: 'Fall Term' },
    [SemesterType.Spring]: { higherEd: 'Spring Semester', k12: 'Spring Term' },
    [SemesterType.Summer]: { higherEd: 'Summer Session', k12: 'Summer Term' },
    [SemesterType.Winter]: { higherEd: 'Winter Session', k12: 'Winter Term' },
    [SemesterType.Intersession]: { higherEd: 'Intersession', k12: 'Intersession' },
    [SemesterType.FirstQuarter]: { higherEd: '1st Quarter', k12: '1st Quarter' },
    [SemesterType.SecondQuarter]: { higherEd: '2nd Quarter', k12: '2nd Quarter' },
    [SemesterType.ThirdQuarter]: { higherEd: '3rd Quarter', k12: '3rd Quarter' },
    [SemesterType.FourthQuarter]: { higherEd: '4th Quarter', k12: '4th Quarter' },
    [SemesterType.FirstTrimester]: { higherEd: '1st Trimester', k12: '1st Trimester' },
    [SemesterType.SecondTrimester]: { higherEd: '2nd Trimester', k12: '2nd Trimester' },
    [SemesterType.ThirdTrimester]: { higherEd: '3rd Trimester', k12: '3rd Trimester' }
  };

  return isHigherEd ? termMap[type].higherEd : termMap[type].k12;
}

export interface SemesterResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  academicYearId: string;
  academicYearName: string;
  type: SemesterType;
  status: SemesterStatus;
  description?: string;
  weekCount: number;
  registrationStartDate?: Date;
  registrationEndDate?: Date;
  addDropDeadline?: Date;
  withdrawalDeadline?: Date;
  midtermStartDate?: Date;
  midtermEndDate?: Date;
  finalExamStartDate?: Date;
  finalExamEndDate?: Date;
  gradeSubmissionDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSemesterDto {
  name: string;
  startDate: Date;
  endDate: Date;
  academicYearId: string;
  type: SemesterType;
  status: SemesterStatus;
  description?: string;
  weekCount: number;
  registrationStartDate?: Date | null;
  registrationEndDate?: Date | null;
  addDropDeadline?: Date | null;
  withdrawalDeadline?: Date | null;
  midtermStartDate?: Date | null;
  midtermEndDate?: Date | null;
  finalExamStartDate?: Date | null;
  finalExamEndDate?: Date | null;
  gradeSubmissionDeadline?: Date | null;
}

export interface UpdateSemesterDto {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  type?: SemesterType;
  status?: SemesterStatus;
  description?: string;
  weekCount?: number;
  registrationStartDate?: Date | null;
  registrationEndDate?: Date | null;
  addDropDeadline?: Date | null;
  withdrawalDeadline?: Date | null;
  midtermStartDate?: Date | null;
  midtermEndDate?: Date | null;
  finalExamStartDate?: Date | null;
  finalExamEndDate?: Date | null;
  gradeSubmissionDeadline?: Date | null;
}
