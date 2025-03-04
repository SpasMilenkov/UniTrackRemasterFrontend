<template>
  <div class="min-h-screen bg-background-card relative">
    <!-- Floating Particles Background (consistent with other pages) -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="n in 20"
        :key="n"
        class="absolute w-1 h-1 bg-primary opacity-20 rounded-full animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          '--tx': Math.random() * 200 - 100 + 'px',
          '--ty': Math.random() * 200 - 100 + 'px',
          '--scale': 0.5 + Math.random() * 1,
          animationDelay: Math.random() * 10 + 's',
          animationDuration: 10 + Math.random() * 20 + 's',
        }"
      />
    </div>

    <n-form
      class="max-w-7xl mx-auto p-6 relative z-10"
      @submit.prevent="onSubmit"
    >
      <!-- Header -->
      <div
        v-motion
        class="mb-8 text-center"
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="200"
      >
        <VanillaTitle
          :title="t('onboarding.initialForm.titles.main')"
          size="medium"
          class="bg-gradient-primary"
        />
        <p style="color: var(--color-text-secondary); margin-top: 0.5rem">
          {{ t('onboarding.initialForm.subtitle') }}
        </p>
      </div>

      <!-- Main Form Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Form Fields -->
        <div
          v-motion
          class="feature-card space-y-6 backdrop-blur-sm rounded-lg p-6"
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0 }"
          :delay="400"
        >
          <!-- Institution Details -->
          <div class="space-y-4">
            <h3
              class="text-lg font-semibold"
              style="
                color: var(--color-text-primary);
                border-left: 4px solid var(--color-primary);
                padding-left: 0.75rem;
              "
            >
              {{ t('onboarding.initialForm.titles.institution') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <n-form-item
                :label="
                  t('onboarding.initialForm.fields.institutionName.label')
                "
                v-bind="institutionNameProps"
              >
                <n-input
                  v-model:value="institutionName"
                  :placeholder="
                    t(
                      'onboarding.initialForm.fields.institutionName.placeholder'
                    )
                  "
                />
              </n-form-item>
              <n-form-item
                :label="
                  t('onboarding.initialForm.fields.institutionType.label')
                "
                v-bind="institutionTypeProps"
              >
                <n-select
                  v-model:value="institutionType"
                  :options="institutionTypeOptions"
                  :placeholder="
                    t(
                      'onboarding.initialForm.fields.institutionType.placeholder'
                    )
                  "
                />
              </n-form-item>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3
              class="text-lg font-semibold"
              style="
                color: var(--color-text-primary);
                border-left: 4px solid var(--color-primary);
                padding-left: 0.75rem;
              "
            >
              {{ t('onboarding.initialForm.titles.contact') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <n-form-item
                :label="t('onboarding.initialForm.fields.firstName.label')"
                v-bind="firstNameProps"
              >
                <n-input
                  v-model:value="firstName"
                  :placeholder="
                    t('onboarding.initialForm.fields.firstName.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.lastName.label')"
                v-bind="lastNameProps"
              >
                <n-input
                  v-model:value="lastName"
                  :placeholder="
                    t('onboarding.initialForm.fields.lastName.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.email.label')"
                v-bind="emailProps"
              >
                <n-input
                  v-model:value="email"
                  :placeholder="
                    t('onboarding.initialForm.fields.email.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.phone.label')"
                v-bind="phoneNumberProps"
              >
                <n-input
                  v-model:value="phoneNumber"
                  :placeholder="
                    t('onboarding.initialForm.fields.phone.placeholder')
                  "
                />
              </n-form-item>
            </div>
          </div>

          <!-- Address Fields -->
          <div class="space-y-4">
            <h3
              class="text-lg font-semibold"
              style="
                color: var(--color-text-primary);
                border-left: 4px solid var(--color-primary);
                padding-left: 0.75rem;
              "
            >
              {{ t('onboarding.initialForm.titles.geographic') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <n-form-item
                :label="t('onboarding.initialForm.fields.country.label')"
                v-bind="countryProps"
              >
                <n-input
                  v-model:value="country"
                  :placeholder="
                    t('onboarding.initialForm.fields.country.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.city.label')"
                v-bind="settlementProps"
              >
                <n-input
                  v-model:value="settlement"
                  :placeholder="
                    t('onboarding.initialForm.fields.city.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.postcode.label')"
                v-bind="postalCodeProps"
              >
                <n-input
                  v-model:value="postalCode"
                  :placeholder="
                    t('onboarding.initialForm.fields.postcode.placeholder')
                  "
                />
              </n-form-item>
              <n-form-item
                :label="t('onboarding.initialForm.fields.street.label')"
                v-bind="streetProps"
              >
                <n-input
                  v-model:value="street"
                  :placeholder="
                    t('onboarding.initialForm.fields.street.placeholder')
                  "
                />
              </n-form-item>
            </div>
          </div>
        </div>

        <!-- Right Column: Map -->
        <div
          v-motion
          class="feature-card backdrop-blur-sm rounded-lg p-6"
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0 }"
          :delay="600"
        >
          <ClientOnly>
            <div id="map" class="h-[600px] w-full rounded-lg" />
          </ClientOnly>
          <p
            style="
              color: var(--color-text-secondary);
              font-size: 0.875rem;
              margin-top: 1rem;
            "
          >
            {{ t('onboarding.initialForm.mapInstructions') }}
          </p>
        </div>
      </div>

      <!-- Submit Button -->
      <div
        v-motion
        class="mt-8 flex justify-end"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="800"
      >
        <n-button
          type="primary"
          style="
            padding-left: 2rem;
            padding-right: 2rem;
            transition: all 0.3s ease;
          "
          @click="onSubmit"
        >
          {{ t('onboarding.initialForm.submit') }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { camelCase } from 'lodash';
import { ref, onMounted } from 'vue';
import { initInstitutionApplicationSchema } from '~/schemas/init-institution-application.schema';

const message = useMessage();

// Localization
const { t } = useI18n();
const localePath = useLocalePath();
//Stores
const onboardingStore = useOnboardingStore();

//variables
const latitude = ref();
const longitude = ref();

// Form
const schema = initInstitutionApplicationSchema();
const { handleSubmit, defineField, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Form fields
const [firstName, firstNameProps] = defineField(
  'firstName',
  naiveUiFormsConfig
);
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig);
const [email, emailProps] = defineField('email', naiveUiFormsConfig);
const [phoneNumber, phoneNumberProps] = defineField(
  'phoneNumber',
  naiveUiFormsConfig
);

const [country, countryProps] = defineField('country', naiveUiFormsConfig);
const [settlement, settlementProps] = defineField(
  'settlement',
  naiveUiFormsConfig
);
const [postalCode, postalCodeProps] = defineField(
  'postalCode',
  naiveUiFormsConfig
);
const [street, streetProps] = defineField('street', naiveUiFormsConfig);
const [institutionName, institutionNameProps] = defineField(
  'institutionName',
  naiveUiFormsConfig
);
const [institutionType, institutionTypeProps] = defineField(
  'institutionType',
  naiveUiFormsConfig
);

const institutionTypeOptions = computed(() => {
  const availableTypes = onboardingStore.availableInstitutionTypes;
  return availableTypes.map((type) => ({
    label: t(
      `onboarding.initialForm.fields.institutionType.options.${camelCase(type)}`
    ),
    value: type,
  }));
});

const initMap = async () => {
  // Properly import OpenLayers modules
  const OLMap = (await import('ol/Map')).default;
  const OLView = (await import('ol/View')).default;
  const OLTileLayer = (await import('ol/layer/Tile')).default;
  const OLMOSM = (await import('ol/source/OSM')).default;
  const { fromLonLat, toLonLat } = await import('ol/proj');
  const OLFeature = (await import('ol/Feature')).default;
  const OLPoint = (await import('ol/geom/Point')).default;
  const OLVectorLayer = (await import('ol/layer/Vector')).default;
  const OLVectorSource = (await import('ol/source/Vector')).default;
  const { Style, Icon } = await import('ol/style');

  // Marker source and layer
  const markerSource = new OLVectorSource();
  const markerLayer = new OLVectorLayer({
    source: markerSource,
    style: new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.05,
      }),
    }),
  });

  const map = new OLMap({
    target: 'map',
    layers: [
      new OLTileLayer({
        source: new OLMOSM(),
      }),
      markerLayer,
    ],
    view: new OLView({
      center: fromLonLat([0, 0]),
      zoom: 2,
    }),
  });

  // Map click handler
  map.on('click', async (event) => {
    const coordinates = toLonLat(event.coordinate);
    latitude.value = Number(coordinates[1].toFixed(6));
    longitude.value = Number(coordinates[0].toFixed(6));

    // Clear existing markers
    markerSource.clear();

    // Add new marker
    const marker = new OLFeature({
      geometry: new OLPoint(fromLonLat(coordinates)),
    });
    markerSource.addFeature(marker);

    // Reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude.value}&lon=${longitude.value}`
      );
      const data = await response.json();

      const address = data.address;

      setFieldValue('country', address.country || '');
      setFieldValue(
        'settlement',
        address.city || address.town || address.village || ''
      );
      setFieldValue('postalCode', address.postcode || '');
      setFieldValue('street', address.road || '');
    } catch (error) {
      console.error('Error fetching reverse geocoding data:', error);
    }
  });
};

// Methods
const onSubmit = handleSubmit(async (values) => {
  await onboardingStore.createInstitutionApplication(values);
  if (onboardingStore.error) {
    message.error(
      onboardingStore.error?.toString() || t('onboarding.applicationForm.error')
    );
    return;
  }
  message.success(t('onboarding.applicationForm.success'));
  navigateTo(localePath('/onboarding/auth'));
});

// Lifecycle
onMounted(() => {
  if (import.meta.client) {
    initMap();
  }
});
</script>

<style scoped>
:deep(.n-input),
:deep(.n-select) {
  background-color: var(--color-background-input, rgb(38, 38, 41));
}

:deep(.n-form-item .n-form-item-label) {
  color: var(--color-text-secondary, rgb(156, 163, 175));
  font-size: 0.875rem;
}

.feature-card {
  position: relative;
  overflow: hidden;
  background-color: var(--color-background);
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--color-primary-rgb, 74, 222, 128), 0.15);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(var(--color-primary-rgb, 74, 222, 128), 0.3);
  box-shadow: 0 0 30px rgba(var(--color-primary-rgb, 74, 222, 128), 0.1);
}

.bg-gradient-primary {
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(var(--scale));
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(var(--scale));
    opacity: 0;
  }
}

.animate-float {
  animation: float var(--duration, 15s) ease-in-out infinite alternate;
}
</style>
