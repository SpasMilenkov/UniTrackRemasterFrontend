// ~/utils/institution-helpers.ts
import { InstitutionType } from '~/enums/institution-type.enum';

// Define Sets for efficient lookups
const HIGHER_ED_TYPES = new Set<InstitutionType>([
  InstitutionType.PublicUniversity,
  InstitutionType.PrivateUniversity,
  InstitutionType.CommunityCollege,
  InstitutionType.TechnicalCollege,
  InstitutionType.LiberalArtsCollege,
]);

const SCHOOL_TYPES = new Set<InstitutionType>([
  InstitutionType.PublicSchool,
  InstitutionType.PrivateSchool,
  InstitutionType.CharterSchool,
  InstitutionType.InternationalSchool,
  InstitutionType.PrimarySchool,
  InstitutionType.SecondarySchool,
  InstitutionType.HighSchool,
  InstitutionType.VocationalSchool,
  InstitutionType.SpecialEducationSchool,
  InstitutionType.LanguageSchool,
]);

/**
 * Helper function to check if an institution type is considered higher education
 * (university or college)
 *
 * @param type The InstitutionType to check, can be null or undefined
 * @returns boolean indicating whether the type is higher education
 */
export const isHigherEducation = (type?: InstitutionType | null): boolean => {
  if (!type) return false;
  return HIGHER_ED_TYPES.has(type);
};

/**
 * Helper function to check if an institution type is a school
 * (primary, secondary, high, etc)
 *
 * @param type The InstitutionType to check, can be null or undefined
 * @returns boolean indicating whether the type is a school
 */
export const isSchool = (type?: InstitutionType | null): boolean => {
  if (!type) return false;
  return SCHOOL_TYPES.has(type);
};

/**
 * Get a user-friendly category name for an institution type
 *
 * @param type The InstitutionType to categorize, can be null or undefined
 * @returns string representing the category ('Higher Education', 'School', 'Other', or 'Unknown')
 */
export const getInstitutionCategory = (
  type?: InstitutionType | null
): string => {
  if (!type) return 'Unknown';
  if (isHigherEducation(type)) {
    return 'Higher Education';
  } else if (isSchool(type)) {
    return 'School';
  } else {
    return 'Other';
  }
};

/**
 * Get the appropriate icon name for an institution type
 *
 * @param type The InstitutionType to get icon for
 * @returns string representing the icon name
 */
export const getInstitutionIcon = (type?: InstitutionType | null): string => {
  if (!type) return 'ph:building-bold';

  if (isHigherEducation(type)) {
    return 'ph:graduation-cap-bold';
  } else if (isSchool(type)) {
    return 'ph:student-bold';
  } else {
    return 'ph:building-bold';
  }
};

/**
 * Get a user-friendly display name for an institution type
 *
 * @param type The InstitutionType to format
 * @returns string representing the formatted type name
 */
export const formatInstitutionType = (
  type?: InstitutionType | null
): string => {
  if (!type) return 'Unknown';

  // Convert enum value to readable format
  return type.replace(/([A-Z])/g, ' $1').trim();
};
