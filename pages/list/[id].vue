<template>
  <div
    class="min-h-screen bg-background text-text-primary relative overflow-hidden"
  >
    <!-- Loading state -->
    <div
      v-if="pending"
      class="flex justify-center items-center min-h-screen relative z-10"
    >
      <div class="text-center space-y-4">
        <n-spin size="large" />
        <p class="text-text-secondary animate-pulse">
          Loading institution details...
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-screen relative z-10"
    >
      <div
        class="max-w-md mx-auto bg-background-card/80 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="ph:warning-circle-bold" class="text-red-500 w-8 h-8" />
        </div>
        <h3 class="text-xl font-semibold text-red-400 mb-2">
          Oops! Something went wrong
        </h3>
        <p class="text-text-secondary mb-6">{{ error }}</p>
        <button
          class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:from-primary-dark hover:to-secondary-dark transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
          @click="loadInstitution"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="institution">
      <!-- Hero Section -->
      <div class="relative pt-32 pb-20 px-6 lg:px-8">
        <div
          v-motion
          class="mx-auto max-w-4xl text-center relative z-10"
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0 }"
          :duration="800"
        >
          <!-- Institution Logo (for schools) -->
          <div
            v-if="isSchoolType(institution.type as InstitutionType) && schoolDetails?.logoUrl"
            v-motion
            class="w-32 h-32 mx-auto mb-8 relative"
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1 }"
            :delay="100"
          >
            <div class="relative w-full h-full rounded-3xl bg-background-card/60 backdrop-blur-xl border border-primary/20 p-4 shadow-2xl shadow-primary/10">
              <img
                :src="schoolDetails.logoUrl"
                :alt="`${institution.name} logo`"
                class="w-full h-full object-contain rounded-2xl"
              />
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
            </div>
          </div>

          <!-- Institution name with enhanced styling -->
          <h1
            v-motion
            class="text-5xl md:text-7xl font-black tracking-tight mb-6 relative"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="200"
          >
            <span
              class="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-300 animate-gradient"
            >
              {{ institution.name }}
            </span>
            <div
              class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-30 -z-10"
            />
          </h1>

          <!-- Institution Type Badge -->
          <div
            v-motion
            class="inline-flex items-center space-x-3 bg-background-card/60 backdrop-blur-xl rounded-full px-6 py-3 border border-primary/30 mb-6"
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1 }"
            :delay="300"
          >
            <Icon 
              :name="isSchoolType(institution.type as InstitutionType) ? 'ph:student-bold' : 'ph:graduation-cap-bold'" 
              class="text-primary w-5 h-5" 
            />
            <span class="text-lg font-medium text-text-primary">
              {{ getInstitutionCategory(institution.type as InstitutionType) }}
            </span>
          </div>

          <!-- Motto with elegant styling -->
          <div
            v-if="institution.motto"
            v-motion
            class="relative mb-8"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="400"
          >
            <div
              class="inline-flex items-center space-x-3 bg-background-card/60 backdrop-blur-xl rounded-full px-6 py-3 border border-secondary/30"
            >
              <Icon name="ph:quotes-bold" class="text-primary/70 w-5 h-5" />
              <p
                class="text-lg md:text-xl text-text-secondary font-medium italic"
              >
                {{ institution.motto }}
              </p>
              <Icon
                name="ph:quotes-bold"
                class="text-secondary/70 w-5 h-5 rotate-180"
              />
            </div>
          </div>

          <!-- Key Statistics Row -->
          <div
            v-motion
            class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="500"
          >
            <div class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-primary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-primary">{{ formatDate(institution.establishedDate) }}</div>
              <div class="text-sm text-text-secondary">Established</div>
            </div>
            
            <div v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails" class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-primary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-secondary">{{ formatNumber(universityDetails.undergraduateCount) }}</div>
              <div class="text-sm text-text-secondary">Undergrads</div>
            </div>
            
            <div v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails" class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-primary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-primary">{{ formatNumber(universityDetails.graduateCount) }}</div>
              <div class="text-sm text-text-secondary">Graduates</div>
            </div>
            
            <div v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails" class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-primary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-secondary">{{ universityDetails.acceptanceRate.toFixed(2) }}%</div>
              <div class="text-sm text-text-secondary">Acceptance</div>
            </div>

            <div v-if="isSchoolType(institution.type as InstitutionType) && schoolDetails?.programs" class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-primary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-primary">{{ schoolDetails.programs.length }}</div>
              <div class="text-sm text-text-secondary">Programs</div>
            </div>

            <div v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails" class="bg-background-card/60 backdrop-blur-xl rounded-2xl border border-secondary/20 p-4">
              <div class="text-2xl md:text-3xl font-bold text-secondary">{{ formatNumber(universityDetails.facultiesCount) }}</div>
              <div class="text-sm text-text-secondary">Faculty</div>
            </div>
          </div>

          <!-- Description -->
          <p
            v-if="institution.description"
            v-motion
            class="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="600"
          >
            {{ institution.description }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <!-- Image Carousel -->
          <div
            v-if="(isSchoolType(institution.type as InstitutionType) && schoolDetails?.images?.length) || (isHigherEducation(institution.type as InstitutionType) && (institution.images?.length || schoolDetails?.images?.length))"
            v-motion
            class="mb-16"
            :initial="{ opacity: 0, scale: 0.95 }"
            :enter="{ opacity: 1, scale: 1 }"
            :delay="800"
          >
            <n-carousel
              autoplay
              draggable
              class="rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-background-card/50 backdrop-blur-xl"
            >
              <div
                v-for="(image, index) in getCarouselImages()"
                :key="index"
                class="relative"
              >
                <img
                  :src="image"
                  class="w-full h-80 md:h-96 object-cover"
                  :alt="`${institution.name} image ${index + 1}`"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-background-card/40 to-transparent"
                />
              </div>
            </n-carousel>
          </div>

          <!-- Programs Section (for schools) -->
          <div
            v-if="isSchoolType(institution.type as InstitutionType) && schoolDetails?.programs?.length"
            v-motion
            class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 p-8 hover:border-primary/40 transition-all duration-500"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="1000"
          >
            <!-- Card glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Header -->
            <div class="flex items-center space-x-4 mb-8 relative z-10">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center relative"
                >
                  <Icon name="ph:list-checks-bold" class="text-primary w-8 h-8" />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-sm"
                  />
                </div>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Programs Offered
              </h3>
            </div>

            <!-- Programs Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              <div
                v-for="(program, index) in schoolDetails.programs"
                :key="program"
                v-motion
                class="group/item relative bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0 }"
                :delay="1000 + index * 100"
              >
                <!-- Item glow effect -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                />

                <div class="relative z-10">
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    >
                      <Icon
                        name="ph:check-circle-fill"
                        class="text-primary w-5 h-5"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-text-primary font-semibold group-hover/item:text-primary transition-colors">
                        {{ program }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Departments Section (for universities) -->
          <div
            v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails?.departments?.length"
            v-motion
            class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 p-8 hover:border-primary/40 transition-all duration-500"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="1000"
          >
            <!-- Card glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Header -->
            <div class="flex items-center space-x-4 mb-8 relative z-10">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center relative"
                >
                  <Icon name="ph:buildings-bold" class="text-primary w-8 h-8" />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-sm"
                  />
                </div>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Academic Departments
              </h3>
            </div>

            <!-- Departments Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              <div
                v-for="(department, index) in universityDetails.departments"
                :key="department"
                v-motion
                class="group/item relative bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0 }"
                :delay="1000 + index * 100"
              >
                <!-- Item glow effect -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                />

                <div class="relative z-10">
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    >
                      <Icon
                        name="ph:building-office-fill"
                        class="text-primary w-5 h-5"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-text-primary font-semibold group-hover/item:text-primary transition-colors">
                        {{ department }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Focus Areas Section (for universities) -->
          <div
            v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails?.focusAreas?.length"
            v-motion
            class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-secondary/20 p-8 hover:border-secondary/40 transition-all duration-500"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="1100"
          >
            <!-- Card glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Header -->
            <div class="flex items-center space-x-4 mb-8 relative z-10">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center relative"
                >
                  <Icon name="ph:target-bold" class="text-secondary w-8 h-8" />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-2xl opacity-20 blur-sm"
                  />
                </div>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
              >
                Focus Areas
              </h3>
            </div>

            <!-- Focus Areas Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              <div
                v-for="(focusArea, index) in universityDetails.focusAreas"
                :key="focusArea"
                v-motion
                class="group/item relative bg-background/60 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6 hover:border-secondary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-secondary/10"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0 }"
                :delay="1100 + index * 100"
              >
                <!-- Item glow effect -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                />

                <div class="relative z-10">
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    >
                      <Icon
                        name="ph:bullseye-fill"
                        class="text-secondary w-5 h-5"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-text-primary font-semibold group-hover/item:text-secondary transition-colors">
                        {{ focusArea }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- University-specific sections -->
          <template v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails">
            <!-- Research & Funding Section -->
            <div
              v-motion
              class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-secondary/20 p-8 hover:border-secondary/40 transition-all duration-500"
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0 }"
              :delay="1300"
            >
              <!-- Card glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <!-- Header -->
              <div class="flex items-center space-x-4 mb-8 relative z-10">
                <div class="relative">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center relative"
                  >
                    <Icon name="ph:flask-bold" class="text-secondary w-8 h-8" />
                    <div
                      class="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-2xl opacity-20 blur-sm"
                    />
                  </div>
                </div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
                >
                  Research & Academics
                </h3>
              </div>

              <!-- Research Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <div class="bg-background/60 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6 text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="ph:currency-dollar-bold" class="text-secondary w-6 h-6" />
                  </div>
                  <div class="text-2xl font-bold text-secondary mb-1">${{ formatCurrency(universityDetails.researchFunding) }}</div>
                  <div class="text-text-secondary text-sm">Research Funding</div>
                </div>

                <div class="bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="ph:users-bold" class="text-primary w-6 h-6" />
                  </div>
                  <div class="text-2xl font-bold text-primary mb-1">{{ formatNumber(universityDetails.facultiesCount) }}</div>
                  <div class="text-text-secondary text-sm">Faculty Members</div>
                </div>

                <div class="bg-background/60 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6 text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="ph:percent-bold" class="text-secondary w-6 h-6" />
                  </div>
                  <div class="text-2xl font-bold text-secondary mb-1">{{ universityDetails.acceptanceRate.toFixed(2) }}%</div>
                  <div class="text-text-secondary text-sm">Acceptance Rate</div>
                </div>

                <div class="bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="ph:house-bold" class="text-primary w-6 h-6" />
                  </div>
                  <div class="text-2xl font-bold text-primary mb-1">
                    {{ universityDetails.hasStudentHousing ? 'Yes' : 'No' }}
                  </div>
                  <div class="text-text-secondary text-sm">Student Housing</div>
                </div>
              </div>
            </div>
          </template>

          <!-- Info Cards Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <!-- General Info Card -->
            <div
              v-motion
              class="group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 p-8 hover:border-primary/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
              :initial="{ opacity: 0, x: -50 }"
              :enter="{ opacity: 1, x: 0 }"
              :delay="1500"
            >
              <!-- Card glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <!-- Header -->
              <div class="flex items-center space-x-4 mb-8 relative z-10">
                <div class="relative">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center relative"
                  >
                    <Icon name="ph:info-bold" class="text-primary w-8 h-8" />
                    <div
                      class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-sm"
                    />
                  </div>
                </div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                >
                  General Information
                </h3>
              </div>

              <!-- Info Grid -->
              <div class="space-y-6 relative z-10">
                <div
                  v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails?.website"
                  class="flex items-center justify-between py-3 border-b border-primary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon name="ph:globe-bold" class="text-primary w-4 h-4" />
                    <span>Website</span>
                  </span>
                  <a
                    :href="universityDetails.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-text-primary font-semibold hover:text-primary transition-colors"
                  >
                    Visit Website
                  </a>
                </div>

                <div
                  v-if="isSchoolType(institution.type as InstitutionType) && schoolDetails?.address"
                  class="flex items-start justify-between py-3 border-b border-primary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon name="ph:map-pin-bold" class="text-primary w-4 h-4" />
                    <span>Address</span>
                  </span>
                  <span class="text-text-primary font-semibold text-right max-w-xs">
                    {{ schoolDetails.address }}
                  </span>
                </div>

                <div
                  v-if="institution.establishedDate"
                  class="flex items-center justify-between py-3 border-b border-primary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon
                      name="ph:calendar-bold"
                      class="text-primary w-4 h-4"
                    />
                    <span>Established</span>
                  </span>
                  <span class="text-text-primary font-semibold">{{
                    formatDate(institution.establishedDate)
                  }}</span>
                </div>
                <div
                  v-if="institution.type"
                  class="flex items-center justify-between py-3 border-b border-primary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon
                      name="ph:building-bold"
                      class="text-primary w-4 h-4"
                    />
                    <span>Type</span>
                  </span>
                  <span class="text-text-primary font-semibold">{{
                    formatInstitutionType(institution.type as InstitutionType)
                  }}</span>
                </div>
                <div
                  v-if="institution.integrationStatus"
                  class="flex items-center justify-between py-3"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon
                      name="ph:shield-check-bold"
                      class="text-primary w-4 h-4"
                    />
                    <span>Status</span>
                  </span>
                  <span class="text-text-primary font-semibold">
                    <n-tag
                      :type="getStatusTagType(institution.integrationStatus)"
                      round
                    >
                      {{
                        formatIntegrationStatus(institution.integrationStatus)
                      }}
                    </n-tag>
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact Info Card -->
            <div
              v-motion
              class="group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-secondary/20 p-8 hover:border-secondary/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/10"
              :initial="{ opacity: 0, x: 50 }"
              :enter="{ opacity: 1, x: 0 }"
              :delay="1700"
            >
              <!-- Card glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <!-- Header -->
              <div class="flex items-center space-x-4 mb-8 relative z-10">
                <div class="relative">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center relative"
                  >
                    <Icon name="ph:phone-bold" class="text-secondary w-8 h-8" />
                    <div
                      class="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-2xl opacity-20 blur-sm"
                    />
                  </div>
                </div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
                >
                  Contact Information
                </h3>
              </div>

              <!-- Contact Grid -->
              <div class="space-y-6 relative z-10">
                <div
                  v-if="institution.email"
                  class="flex items-center justify-between py-3 border-b border-secondary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon
                      name="ph:envelope-bold"
                      class="text-secondary w-4 h-4"
                    />
                    <span>Email</span>
                  </span>
                  <a
                    :href="`mailto:${institution.email}`"
                    class="text-text-primary font-semibold hover:text-secondary transition-colors"
                    >{{ institution.email }}</a
                  >
                </div>
                <div
                  v-if="institution.phone"
                  class="flex items-center justify-between py-3 border-b border-secondary/15"
                >
                  <span
                    class="text-text-secondary font-medium flex items-center space-x-2"
                  >
                    <Icon name="ph:phone-bold" class="text-secondary w-4 h-4" />
                    <span>Phone</span>
                  </span>
                  <a
                    :href="`tel:${institution.phone}`"
                    class="text-text-primary font-semibold hover:text-secondary transition-colors"
                    >{{ institution.phone }}</a
                  >
                </div>

                <!-- Quick Actions -->
                <div class="pt-4 space-y-3">
                  <button
                    @click="handleContact"
                    class="w-full px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-xl font-medium hover:from-secondary-dark hover:to-primary-dark transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-secondary/25 flex items-center justify-center space-x-2"
                  >
                    <Icon name="ph:envelope-bold" class="w-5 h-5" />
                    <span>Contact Institution</span>
                  </button>

                  <button
                    v-if="isHigherEducation(institution.type as InstitutionType) && universityDetails?.website"
                    @click="openWebsite"
                    class="w-full px-6 py-3 bg-background/60 backdrop-blur-sm border border-primary/30 text-text-primary rounded-xl font-medium hover:border-primary/50 hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Icon name="ph:globe-bold" class="w-5 h-5" />
                    <span>Visit Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div
            v-if="institution.description"
            v-motion
            class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-primary/20 p-8 hover:border-primary/40 transition-all duration-500"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="1900"
          >
            <!-- Card glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Header -->
            <div class="flex items-center space-x-4 mb-8 relative z-10">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center relative"
                >
                  <Icon name="ph:book-open-bold" class="text-primary w-8 h-8" />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 blur-sm"
                  />
                </div>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                About the Institution
              </h3>
            </div>

            <!-- Content -->
            <div class="relative z-10">
              <p
                class="text-text-muted text-lg leading-relaxed whitespace-pre-line"
              >
                {{ institution.description }}
              </p>
            </div>
          </div>

          <!-- Accreditations Section -->
          <div
            v-if="institution.accreditations?.length"
            v-motion
            class="mb-16 group relative bg-background-card/60 backdrop-blur-xl rounded-3xl border border-secondary/20 p-8 hover:border-secondary/40 transition-all duration-500"
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0 }"
            :delay="2100"
          >
            <!-- Card glow effect -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Header -->
            <div class="flex items-center space-x-4 mb-8 relative z-10">
              <div class="relative">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center relative"
                >
                  <Icon
                    name="ph:seal-check-bold"
                    class="text-secondary w-8 h-8"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-2xl opacity-20 blur-sm"
                  />
                </div>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
              >
                Accreditations
              </h3>
            </div>

            <!-- Accreditations Grid -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10"
            >
              <div
                v-for="(accreditation, index) in institution.accreditations"
                :key="accreditation"
                v-motion
                class="group/accreditation relative bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0 }"
                :delay="2100 + index * 100"
              >
                <!-- Accreditation glow effect -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover/accreditation:opacity-100 transition-opacity duration-300"
                />

                <div class="flex items-center space-x-3 relative z-10">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
                  >
                    <Icon
                      name="ph:seal-check-fill"
                      class="text-primary w-5 h-5"
                    />
                  </div>
                  <span
                    class="text-text-secondary font-medium group-hover/accreditation:text-text-primary transition-colors"
                    >{{ accreditation }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom spacing -->
      <div class="h-20" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { InstitutionType } from '~/enums/institution-type.enum';
import type { UniversityResponseDto } from '~/interfaces/organizations/university-response.dto';
import { isSchool as isSchoolType, isHigherEducation, getInstitutionCategory, formatInstitutionType } from '~/utils/institution-helper';

const route = useRoute();
const institutionStore = useInstitutionStore();
const schoolStore = useSchoolStore();
const universityStore = useUniversityStore();

// State
const pending = ref(false);
const error = ref<string | null>(null);

// Get institution ID from route
const institutionId = computed(() => route.params.id as string);

// Get institution from store
const institution = computed(() => institutionStore.activeInstitution);

// Determine institution type and fetch appropriate detailed data
const isSchool = ref(true);
const schoolDetails = ref<SchoolWithAddressResponseDto | null>(null);
const universityDetails = ref<UniversityResponseDto | null>(null);

// Computed data based on institution type
const getCarouselImages = () => {
  if (isSchoolType(institution.value?.type as InstitutionType) && schoolDetails.value?.images) {
    return schoolDetails.value.images;
  } else if (institution.value?.images) {
    return institution.value.images;
  }
  return [];
};

// Load institution data
const loadInstitution = async () => {
  if (!institutionId.value) {
    error.value = 'Institution ID is required';
    return;
  }

  pending.value = true;
  error.value = null;

  try {
    // First fetch the basic institution data
    await institutionStore.fetchInstitutionById(institutionId.value);
    
    if (!institution.value) {
      throw new Error('Institution not found');
    }

    // Determine if this is a school or university using the utility functions
    isSchool.value = isSchoolType(institution.value.type as InstitutionType);

    // Fetch detailed data based on type
    if (isSchool.value) {
      try {
        const schoolData = await schoolStore.fetchSchoolByInstitutionId(institutionId.value);
        schoolDetails.value = schoolData;
      } catch (schoolError) {
        console.warn('Could not load school details:', schoolError);
        // Continue with basic institution data - this is normal for some schools
      }
    } else if (isHigherEducation(institution.value.type as InstitutionType)) {
      try {
        const universityData = await universityStore.fetchUniversityByInstitutionId(institutionId.value);
        universityDetails.value = universityData;
      } catch (universityError) {
        console.warn('Could not load university details:', universityError);
        // Continue with basic institution data - this is normal for some universities
      }
    }

  } catch (err) {
    console.error('Error loading institution:', err);
    error.value =
      err instanceof Error ? err.message : 'Failed to load institution';
  } finally {
    pending.value = false;
  }
};

// Utility functions
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
};

const formatIntegrationStatus = (status: string) => {
  return status.replace(/([A-Z])/g, ' $1').trim();
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Verified':
      return 'success';
    case 'RequiresVerification':
    case 'AdditionalDataSubmitted':
      return 'warning';
    case 'Denied':
    case 'Inactive':
      return 'error';
    default:
      return 'default';
  }
};

// Actions
const handleContact = () => {
  if (institution.value?.email) {
    window.location.href = `mailto:${institution.value.email}`;
  }
};

const openWebsite = () => {
  if (universityDetails.value?.website) {
    window.open(universityDetails.value.website, '_blank');
  }
};

// Load data on component mount
onMounted(() => {
  loadInstitution();
});

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loadInstitution();
    }
  }
);

// Head management
useHead(() => ({
  title: institution.value?.name ?? 'Loading Institution...',
  meta: [
    {
      name: 'description',
      content: institution.value?.description
        ? `Learn about ${institution.value.name} - ${institution.value.description}`
        : `Learn about ${institution.value?.name}`,
    },
    {
      property: 'og:image',
      content: schoolDetails.value?.logoUrl ?? schoolDetails.value?.images?.[0] ?? '',
    },
  ],
}));
</script>

<style scoped>
@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  animation: gradient 6s ease infinite;
}

.bg-300 {
  background-size: 300%;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
</style>