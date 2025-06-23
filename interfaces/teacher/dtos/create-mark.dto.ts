export interface CreateMarkDto {
  grade?: string; // Grade input (A, B, 5, etc.) - will be converted using grading system
  score?: number; // Direct numerical score (0-100). If provided, takes precedence over Grade
  topic: string; // Required on backend
  description?: string; // Optional
  type: string; // MarkType enum
  subjectId: string; // Required - backend expects Guid
  teacherId: string; // Required - backend expects Guid
  studentId: string; // Required - backend expects Guid
  semesterId?: string; // Optional - backend expects Guid?, defaults to current semester
}
