import type { Institution } from './institution';

export interface School extends Institution {
  founded: any;
  phone: any;
  level: string;
  studentCount: number;
  studentTeacherRatio: number;
  hasSpecialEducation: boolean;
  extracurricularActivities: string[];
  hasUniform: boolean;
  programs?: string[];
}
