// utils/term-helpers.ts
import type { InstitutionType } from '~/enums/institution-type.enum';
import {
  SemesterType,
  SemesterStatus,
  isHigherEducationTerm,
  isK12Term,
  isQuarterTerm,
  isTrimesterTerm,
  getTermsForInstitutionType,
  getTermDisplayName,
} from '~/interfaces/academic/semester';
import { isHigherEducation } from '~/utils/institution-helper';

/**
 * Get appropriate terminology for terms based on institution type
 */
export function getTerminology(institutionType?: InstitutionType | null) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;

  return {
    singular: isHigherEd ? 'Semester' : 'Term',
    plural: isHigherEd ? 'Semesters' : 'Terms',
    management: isHigherEd ? 'Semester Management' : 'Term Management',
    create: isHigherEd ? 'Create Semester' : 'Create Term',
    all: isHigherEd ? 'All Semesters' : 'All Terms',
    active: isHigherEd ? 'Active Semesters' : 'Active Terms',
    upcoming: isHigherEd ? 'Upcoming Semesters' : 'Upcoming Terms',
    completed: isHigherEd ? 'Completed Semesters' : 'Completed Terms',
  };
}

/**
 * Get term type options based on institution type
 */
export function getTermTypeOptions(institutionType?: InstitutionType | null) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;
  return getTermsForInstitutionType(isHigherEd);
}

/**
 * Get display name for a term type based on institution type
 */
export function getDisplayName(
  type: SemesterType,
  institutionType?: InstitutionType | null
) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;
  return getTermDisplayName(type, isHigherEd);
}

/**
 * Get default values for creating a new term based on institution type
 */
export function getDefaultTermValues(
  institutionType?: InstitutionType | null,
  academicYearId?: string
) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;

  const baseDefaults = {
    name: '',
    academicYearId: academicYearId || '',
    status: SemesterStatus.Upcoming,
    startDate: '',
    endDate: '',
    description: '',
  };

  if (isHigherEd) {
    return {
      ...baseDefaults,
      type: SemesterType.Fall,
      weekCount: 16, // Typical semester length
    };
  } else {
    return {
      ...baseDefaults,
      type: SemesterType.FirstQuarter,
      weekCount: 9, // Typical quarter length
      // Clear higher-ed specific fields for K-12
      registrationStartDate: undefined,
      registrationEndDate: undefined,
      addDropDeadline: undefined,
      withdrawalDeadline: undefined,
      finalExamStartDate: undefined,
      finalExamEndDate: undefined,
    };
  }
}

/**
 * Generate suggested term name based on type and academic year
 */
export function generateTermName(
  type: SemesterType,
  academicYearName: string,
  institutionType?: InstitutionType | null
): string {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;
  const yearPart =
    academicYearName.split('-')[0] || new Date().getFullYear().toString();

  if (isHigherEd) {
    switch (type) {
      case SemesterType.Fall:
        return `Fall ${yearPart}`;
      case SemesterType.Spring:
        return `Spring ${parseInt(yearPart) + 1}`;
      case SemesterType.Summer:
        return `Summer ${parseInt(yearPart) + 1}`;
      case SemesterType.Winter:
        return `Winter ${parseInt(yearPart) + 1}`;
      case SemesterType.Intersession:
        return `Intersession ${yearPart}`;
      default:
        return `${type} ${yearPart}`;
    }
  } else {
    switch (type) {
      case SemesterType.FirstQuarter:
        return `Q1 ${yearPart}`;
      case SemesterType.SecondQuarter:
        return `Q2 ${yearPart}`;
      case SemesterType.ThirdQuarter:
        return `Q3 ${parseInt(yearPart) + 1}`;
      case SemesterType.FourthQuarter:
        return `Q4 ${parseInt(yearPart) + 1}`;
      case SemesterType.FirstTrimester:
        return `T1 ${yearPart}`;
      case SemesterType.SecondTrimester:
        return `T2 ${yearPart}`;
      case SemesterType.ThirdTrimester:
        return `T3 ${parseInt(yearPart) + 1}`;
      default:
        return `${type} ${yearPart}`;
    }
  }
}

/**
 * Get term status options with appropriate labels
 */
export function getTermStatusOptions() {
  return [
    { label: 'Upcoming', value: SemesterStatus.Upcoming },
    { label: 'Active', value: SemesterStatus.Active },
    { label: 'Completed', value: SemesterStatus.Completed },
    { label: 'Archived', value: SemesterStatus.Archived },
    { label: 'Cancelled', value: SemesterStatus.Cancelled },
  ];
}

/**
 * Filter terms by institution type
 */
export function filterTermsByInstitutionType<T extends { type: SemesterType }>(
  terms: T[],
  institutionType?: InstitutionType | null
): T[] {
  if (!institutionType) return terms;

  const isHigherEd = isHigherEducation(institutionType);

  return terms.filter((term) => {
    if (isHigherEd) {
      return isHigherEducationTerm(term.type);
    } else {
      return isK12Term(term.type);
    }
  });
}

/**
 * Group terms by type for better organization
 */
export function groupTermsByType<T extends { type: SemesterType }>(
  terms: T[],
  institutionType?: InstitutionType | null
): Record<string, T[]> {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;

  if (isHigherEd) {
    return {
      'Standard Terms': terms.filter((t) =>
        [SemesterType.Fall, SemesterType.Spring].includes(t.type)
      ),
      'Special Terms': terms.filter((t) =>
        [
          SemesterType.Summer,
          SemesterType.Winter,
          SemesterType.Intersession,
        ].includes(t.type)
      ),
    };
  } else {
    return {
      'Quarter System': terms.filter((t) => isQuarterTerm(t.type)),
      'Trimester System': terms.filter((t) => isTrimesterTerm(t.type)),
    };
  }
}

/**
 * Get term sequence order for sorting
 */
export function getTermSequenceOrder(type: SemesterType): number {
  // Higher education terms
  if (isHigherEducationTerm(type)) {
    switch (type) {
      case SemesterType.Fall:
        return 1;
      case SemesterType.Winter:
        return 2;
      case SemesterType.Spring:
        return 3;
      case SemesterType.Summer:
        return 4;
      case SemesterType.Intersession:
        return 5;
      default:
        return 10;
    }
  }

  // Quarter terms
  if (isQuarterTerm(type)) {
    switch (type) {
      case SemesterType.FirstQuarter:
        return 1;
      case SemesterType.SecondQuarter:
        return 2;
      case SemesterType.ThirdQuarter:
        return 3;
      case SemesterType.FourthQuarter:
        return 4;
      default:
        return 10;
    }
  }

  // Trimester terms
  if (isTrimesterTerm(type)) {
    switch (type) {
      case SemesterType.FirstTrimester:
        return 1;
      case SemesterType.SecondTrimester:
        return 2;
      case SemesterType.ThirdTrimester:
        return 3;
      default:
        return 10;
    }
  }

  return 10; // Default for unknown types
}

/**
 * Sort terms by their natural sequence
 */
export function sortTermsBySequence<
  T extends { type: SemesterType; startDate: string },
>(terms: T[]): T[] {
  return [...terms].sort((a, b) => {
    // First sort by start date (year)
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    if (dateA.getFullYear() !== dateB.getFullYear()) {
      return dateA.getFullYear() - dateB.getFullYear();
    }

    // Then by term sequence within the same year
    const seqA = getTermSequenceOrder(a.type);
    const seqB = getTermSequenceOrder(b.type);

    return seqA - seqB;
  });
}

/**
 * Check if advanced calendar features should be shown
 */
export function shouldShowAdvancedCalendar(
  institutionType?: InstitutionType | null
): boolean {
  return institutionType ? isHigherEducation(institutionType) : false;
}

/**
 * Get appropriate field labels based on institution type
 */
export function getFieldLabels(institutionType?: InstitutionType | null) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;
  const termText = isHigherEd ? 'Semester' : 'Term';

  return {
    name: `${termText} Name`,
    type: `${termText} Type`,
    description: `${termText} description (optional)`,
    preview: `${termText} Preview`,
    management: `${termText} Management`,
    gradeDeadline: isHigherEd
      ? 'Grade Submission Deadline'
      : 'Report Card Deadline',
    midtermLabel: isHigherEd ? 'Midterms:' : 'Mid-term Assessment:',
    datesCardTitle: isHigherEd ? 'Important Dates' : 'Term Dates',
    emptyMessage: `Select start and end dates to preview the ${termText.toLowerCase()} calendar`,
  };
}

/**
 * Get appropriate help text based on institution type
 */
export function getHelpText(institutionType?: InstitutionType | null) {
  const isHigherEd = institutionType
    ? isHigherEducation(institutionType)
    : false;
  const termText = isHigherEd ? 'semester' : 'term';

  return {
    type: isHigherEd
      ? 'Choose the semester type (Fall, Spring, Summer, etc.)'
      : 'Choose the term type (quarters or trimesters)',
    academicYear: `Select the academic year this ${termText} belongs to`,
    prerequisites: `Before creating ${termText}s`,
    gradeDeadline: isHigherEd
      ? 'Deadline for faculty to submit final grades'
      : 'Deadline for teachers to submit final grades',
  };
}

// Re-export common functions for convenience
export {
  isHigherEducationTerm,
  isK12Term,
  isQuarterTerm,
  isTrimesterTerm,
  getTermsForInstitutionType,
  getTermDisplayName,
};
