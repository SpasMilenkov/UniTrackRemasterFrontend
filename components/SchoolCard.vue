<template>
  <div
    class="institution-card group cursor-pointer"
    @click="navigateToInstitution(institution.id)"
  >
    <!-- Animated background elements -->
    <div class="floating-orbs">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
    </div>

    <!-- Main card content -->
    <div class="card-inner">
      <!-- Image Section with enhanced effects -->
      <div class="image-container">
        <div class="image-wrapper">
          <img
            :src="getInstitutionImage()"
            :alt="institution.name"
            class="institution-image"
            loading="lazy"
          >
          <div class="image-overlay" />
          <div class="image-glow" />
        </div>

        <!-- Floating motto tag -->
        <div v-if="institution.motto" class="motto-tag">
          <Icon name="ph:sparkle-fill" class="motto-icon" />
          <span>{{ institution.motto }}</span>
        </div>

        <!-- Institution type badge -->
        <div class="institution-type-badge">
          <Icon
            :name="getInstitutionIcon(institution.type as InstitutionType)"
          />
          <span>{{
            getInstitutionCategory(institution.type as InstitutionType)
          }}</span>
        </div>

        <!-- Status badge for institutions -->
        <div
          v-if="institution.integrationStatus"
          class="status-badge"
          :class="getStatusBadgeClass(institution.integrationStatus)"
        >
          <Icon name="ph:shield-check-fill" />
          <span>{{
            formatIntegrationStatus(institution.integrationStatus)
          }}</span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Title with enhanced styling -->
        <div class="title-section">
          <h3 class="institution-title">
            {{ institution.name }}
          </h3>
          <div class="title-underline" />
        </div>

        <!-- Description -->
        <p class="institution-description">
          {{ institution.description || getDefaultDescription() }}
        </p>

        <!-- Institution features based on type -->
        <div class="institution-features">
          <template v-if="isSchool(institution.type as InstitutionType)">
            <!-- School-specific features -->
            <div v-if="schoolData?.programs?.length" class="feature-item">
              <Icon name="ph:list-checks-fill" class="feature-icon" />
              <span>{{
                t('institutionCard.features.programs', {
                  count: schoolData.programs.length,
                })
              }}</span>
            </div>
            <div v-if="schoolData?.address" class="feature-item">
              <Icon name="ph:map-pin-fill" class="feature-icon" />
              <span>{{ getShortAddress(schoolData.address) }}</span>
            </div>
          </template>

          <template
            v-else-if="isHigherEducation(institution.type as InstitutionType)"
          >
            <!-- University-specific features -->
            <div v-if="universityData?.undergraduateCount" class="feature-item">
              <Icon name="ph:users-fill" class="feature-icon" />
              <span>{{
                t('institutionCard.features.students', {
                  count: formatNumber(universityData.undergraduateCount),
                })
              }}</span>
            </div>
            <div
              v-if="universityData?.departments?.length"
              class="feature-item"
            >
              <Icon name="ph:buildings-fill" class="feature-icon" />
              <span>{{
                t('institutionCard.features.departments', {
                  count: universityData.departments.length,
                })
              }}</span>
            </div>
            <div v-if="universityData?.acceptanceRate" class="feature-item">
              <Icon name="ph:percent-fill" class="feature-icon" />
              <span>{{
                t('institutionCard.features.acceptanceRate', {
                  rate: universityData.acceptanceRate.toFixed(1),
                })
              }}</span>
            </div>
            <div v-if="universityData?.website" class="feature-item">
              <Icon name="ph:globe-fill" class="feature-icon" />
              <span>{{ t('institutionCard.features.websiteAvailable') }}</span>
            </div>
          </template>

          <!-- Common features -->
          <div v-if="institution.establishedDate" class="feature-item">
            <Icon name="ph:calendar-fill" class="feature-icon" />
            <span>{{
              t('institutionCard.features.established', {
                year: formatDate(institution.establishedDate),
              })
            }}</span>
          </div>
          <div v-if="institution.email" class="feature-item">
            <Icon name="ph:envelope-fill" class="feature-icon" />
            <span>{{ t('institutionCard.features.contactAvailable') }}</span>
          </div>
        </div>

        <div class="card-footer">
          <button
            class="primary-button"
            @click.stop="navigateToInstitution(institution.id)"
          >
            <span class="button-text">
              {{
                isSchool(institution.type as InstitutionType)
                  ? t('institutionCard.actions.exploreSchool')
                  : t('institutionCard.actions.exploreUniversity')
              }}
            </span>
            <Icon name="ph:arrow-right-bold" class="button-icon" />
            <div class="button-glow" />
          </button>

          <button
            class="icon-button"
            :title="
              t('institutionCard.actions.share', {
                type: getInstitutionCategory(
                  institution.type as InstitutionType
                ).toLowerCase(),
              })
            "
            @click.stop="shareInstitution"
          >
            <Icon name="ph:share-bold" class="icon" />
          </button>

          <button
            v-if="institution.email"
            class="icon-button"
            :title="t('institutionCard.actions.contact')"
            @click.stop="contactInstitution"
          >
            <Icon name="ph:envelope-bold" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'nuxt/app';
import type { InstitutionType } from '~/enums/institution-type.enum';
import type { InstitutionResponseDto } from '~/interfaces/organizations/institution-response.dto';
import type { UniversityResponseDto } from '~/interfaces/organizations/university-response.dto';
import {
  isSchool,
  isHigherEducation,
  getInstitutionCategory,
  getInstitutionIcon,
} from '~/utils/institution-helper';

const router = useRouter();
const { t } = useI18n();

interface Props {
  institution: InstitutionResponseDto;
  schoolData?: SchoolWithAddressResponseDto | null;
  universityData?: UniversityResponseDto | null;
}

const props = defineProps<Props>();

const navigateToInstitution = (institutionId: string) => {
  router.push(`/institutions/${institutionId}`);
};

const shareInstitution = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.institution.name,
        text:
          props.institution.description ||
          t('institutionCard.share.defaultText', {
            name: props.institution.name,
          }),
        url: `${window.location.origin}/institutions/${props.institution.id}`,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/institutions/${props.institution.id}`
      );
      // You could emit an event or show a toast here
      console.log(t('institutionCard.share.urlCopied'));
    } catch {
      console.log(t('institutionCard.share.copyFailed'));
    }
  }
};

const contactInstitution = () => {
  if (props.institution.email) {
    window.location.href = `mailto:${props.institution.email}`;
  }
};

const getInstitutionImage = (): string => {
  // Priority: school logo > school images > institution images > default
  if (props.schoolData?.logoUrl) {
    return props.schoolData.logoUrl;
  }
  if (props.schoolData?.images?.length) {
    return props.schoolData.images[0];
  }
  if (props.institution.images?.length) {
    return props.institution.images[0];
  }
  // Return a default institution image or placeholder
  return '/placeholder-institution.jpg';
};

const getDefaultDescription = (): string => {
  const category = getInstitutionCategory(
    props.institution.type as InstitutionType
  );
  return t('institutionCard.defaultDescription', {
    category: category.toLowerCase(),
  });
};

const getShortAddress = (address: string): string => {
  const parts = address.split(', ');
  return parts.length > 2 ? `${parts[1]}, ${parts[parts.length - 1]}` : address;
};

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

const formatIntegrationStatus = (status: string): string => {
  return status.replace(/([A-Z])/g, ' $1').trim();
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'Active':
    case 'Verified':
      return 'status-success';
    case 'RequiresVerification':
    case 'AdditionalDataSubmitted':
      return 'status-warning';
    case 'Denied':
    case 'Inactive':
      return 'status-error';
    default:
      return 'status-default';
  }
};
</script>

<style scoped>
.institution-card {
  position: relative;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.6s ease;
}

.orb-1 {
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb), 0.3) 0%,
    transparent 70%
  );
  top: -50px;
  right: -50px;
  animation: float1 6s ease-in-out infinite;
}

.orb-2 {
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    rgba(var(--color-secondary-rgb), 0.2) 0%,
    transparent 70%
  );
  bottom: -40px;
  left: -40px;
  animation: float2 8s ease-in-out infinite;
}

.orb-3 {
  width: 60px;
  height: 60px;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb), 0.25) 0%,
    transparent 70%
  );
  top: 50%;
  left: -30px;
  animation: float3 7s ease-in-out infinite;
}

.institution-card:hover .orb {
  opacity: 1;
}

.card-inner {
  position: relative;
  height: 100%;
  background: rgba(var(--color-background-card-rgb, 24, 24, 28), 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--color-border-rgb, 55, 65, 81), 0.3);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  z-index: 2;
}

.institution-card:hover .card-inner {
  background: rgba(var(--color-background-card-rgb, 24, 24, 28), 0.9);
  border-color: rgba(var(--color-primary-rgb), 0.4);
  transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 60px rgba(var(--color-primary-rgb), 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.image-container {
  position: relative;
  aspect-ratio: 16/9;
  margin: 16px 16px 0;
  border-radius: 16px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.institution-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
}

.institution-card:hover .institution-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.1) 0%,
    rgba(var(--color-secondary-rgb), 0.1) 50%,
    transparent 100%
  );
  transition: all 0.4s ease;
}

.institution-card:hover .image-overlay {
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.2) 0%,
    rgba(var(--color-secondary-rgb), 0.2) 50%,
    transparent 100%
  );
}

.image-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    rgba(var(--color-primary-rgb), 0.5),
    rgba(var(--color-secondary-rgb), 0.5)
  );
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  filter: blur(8px);
}

.institution-card:hover .image-glow {
  opacity: 0.3;
}

.motto-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(var(--color-primary-rgb), 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-primary-rgb), 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(var(--color-primary-rgb));
  transition: all 0.3s ease;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.institution-card:hover .motto-tag {
  background: rgba(var(--color-primary-rgb), 0.3);
  transform: translateY(-2px);
}

.motto-icon {
  animation: sparkle 2s ease-in-out infinite;
  flex-shrink: 0;
}

.institution-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(var(--color-secondary-rgb), 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-secondary-rgb), 0.3);
  border-radius: 16px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(var(--color-secondary-rgb));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: rgb(34, 197, 94);
}

.status-warning {
  background: rgba(251, 191, 36, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: rgb(251, 191, 36);
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgb(239, 68, 68);
}

.status-default {
  background: rgba(156, 163, 175, 0.2);
  border: 1px solid rgba(156, 163, 175, 0.3);
  color: rgb(156, 163, 175);
}

.content-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title-section {
  position: relative;
}

.institution-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.title-underline {
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.institution-card:hover .title-underline {
  transform: scaleX(1);
}

.institution-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.institution-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
}

.institution-card:hover .feature-item {
  color: var(--color-text-secondary);
}

.feature-icon {
  color: var(--color-primary);
  font-size: 1rem;
  flex-shrink: 0;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid rgba(var(--color-border-rgb), 0.3);
  display: flex;
  gap: 12px;
  align-items: center;
}

.primary-button {
  position: relative;
  flex: 1;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  border: none;
  border-radius: 16px;
  padding: 14px 20px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.4);
}

.button-text {
  transition: transform 0.3s ease;
}

.button-icon {
  transition: transform 0.3s ease;
}

.primary-button:hover .button-text {
  transform: translateX(-2px);
}

.primary-button:hover .button-icon {
  transform: translateX(4px);
}

.button-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    var(--color-primary),
    var(--color-secondary)
  );
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  filter: blur(6px);
}

.primary-button:hover .button-glow {
  opacity: 0.5;
}

.icon-button {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(var(--color-border-rgb), 0.3);
  background: rgba(var(--color-background-card-rgb), 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
}

.icon-button:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* Animations */
@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-10px, -10px) rotate(90deg);
  }
  50% {
    transform: translate(10px, -5px) rotate(180deg);
  }
  75% {
    transform: translate(-5px, 10px) rotate(270deg);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(15px, -10px) rotate(120deg);
  }
  66% {
    transform: translate(-10px, 15px) rotate(240deg);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(10px, -15px) scale(1.1);
  }
}

@keyframes sparkle {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .institution-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .feature-item {
    font-size: 0.8rem;
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
  }

  .icon-button {
    width: 44px;
    height: 44px;
  }

  .motto-tag {
    max-width: 150px;
  }
}
</style>
