import type { GradingSystemType } from "~/enums/grading-system-type.enum";

export interface GradingSystemFilter {
  institutionId?: string;
  type?: GradingSystemType;
}
