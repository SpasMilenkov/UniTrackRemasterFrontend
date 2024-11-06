<template>
    <n-form class="flex-col w-full  items-center mx-auto gap-4 bg-[hsl(240,8%,10%)] py-8 px-16 rounded"
        @submit.prevent="onSubmit">
        <VanillaTitle title="Initial Data" size="medium" />
        <n-divider />
        <VanillaTitle title="Contact Information" size="small" />
        <p class="mt-2">Give us your contact information so we can initiate the integr ation of your institution on our
            platform.</p>
        <div
            class="flex flex-wrap justify-center md:justify-start w-full max-w-[45rem] max-h-fit md:max-h-80 gap-8 py-4">
            <n-form-item label="First name" class="w-80" v-bind="firstNameProps">
                <n-input v-model:value="firstName" placeholder="First name" class="mb-3" />
            </n-form-item>
            <n-form-item label="Last name" class="w-80" v-bind="lastNameProps">
                <n-input v-model:value="lastName" placeholder="Last name" class="mb-3" />
            </n-form-item>
            <n-form-item label="Email" class="w-80" v-bind="emailProps">
                <n-input v-model:value="email" placeholder="Email" class="mb-3" />
            </n-form-item>
            <n-form-item label="Phone number" class="w-80" v-bind="phoneNumberProps">
                <n-input v-model:value="phoneNumber" class="w-full mb-3" placeholder="Phone" />
            </n-form-item>
        </div>

        <n-divider />
        <VanillaTitle title="Geographic Data" size="small" />
        <p class="mt-2">Give us the geog,raphical data of your institution.</p>
        <div class="flex flex-col items-center mx-auto gap-8 py-4 md:flex-row ">
            <div class="min-w-80">
                <n-form-item label="School name" v-bind="schoolNameProps">
                    <n-input v-model:value="schoolName" placeholder="School name" class="mb-3" />
                </n-form-item>
                <n-form-item label="Country" v-bind="countryProps">
                    <n-input v-model:value="country" placeholder="Country" class="mb-3" />
                </n-form-item>
                <n-form-item label="City" v-bind="cityProps">
                    <n-input v-model:value="city" placeholder="City" class="mb-3" />
                </n-form-item>
                <n-form-item label="Postcode" v-bind="postcodeProps">
                    <n-input v-model:value="postcode" :show-button="false" placeholder="Postcode" class="mb-3 w-full" />
                </n-form-item>
                <n-form-item label="Street" v-bind="streetProps">
                    <n-input v-model:value="street" placeholder="Street" class="mb-3" />
                </n-form-item>
            </div>
            <div id="map" class="h-[23rem] w-full rounded" />
        </div>
        <n-button type="primary" @click="onSubmit">Submit</n-button>
    </n-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { useSchoolOnboardingStore } from '~/stores/school-onboarding';
import { initSchoolApplicationSchema } from '~/schemas/init-school-application.schema';
//Stores

const onboardingStore = useSchoolOnboardingStore()

//variables
const latitude = ref()
const longitude = ref()

// Form

const { handleSubmit, defineField, setFieldValue } = useForm({
    validationSchema: toTypedSchema(initSchoolApplicationSchema)
})

// Form fields
const [firstName, firstNameProps] = defineField('firstName', naiveUiFormsConfig)
const [lastName, lastNameProps] = defineField('lastName', naiveUiFormsConfig)
const [email, emailProps] = defineField('email', naiveUiFormsConfig)
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber', naiveUiFormsConfig)
const [schoolName, schoolNameProps] = defineField('schoolName', naiveUiFormsConfig)
const [country, countryProps] = defineField('country', naiveUiFormsConfig)
const [city, cityProps] = defineField('city', naiveUiFormsConfig)
const [postcode, postcodeProps] = defineField('postcode', naiveUiFormsConfig)
const [street, streetProps] = defineField('street', naiveUiFormsConfig)

// Marker source and layer
const markerSource = new VectorSource();
const markerLayer = new VectorLayer({
    source: markerSource,
    style: new Style({
        image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Marker icon
            scale: 0.05,
        }),
    }),
});

// Methods
const onSubmit = handleSubmit((values) => {
    return onboardingStore.createSchoolApplication(values);
})


// Lifecycle
onMounted(() => {
    const map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            markerLayer,
        ],
        view: new View({
            center: fromLonLat([0, 0]), // Initial center of the map
            zoom: 2,
        }),
    });

    // handle map click to place a marker
    map.on('click', async (event) => {
        const coordinates = toLonLat(event.coordinate); // Get clicked location in LonLat
        latitude.value = coordinates[1].toFixed(6);
        longitude.value = coordinates[0].toFixed(6);

        // Clear existing markers
        markerSource.clear();

        // Add a new marker at the clicked location
        const marker = new Feature({
            geometry: new Point(fromLonLat(coordinates)),
        });
        markerSource.addFeature(marker);

        // Fetch address from a reverse-geocoding API with nominatim
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude.value}&lon=${longitude.value}`
            );
            const data = await response.json();

            const address = data.address;

            setFieldValue('country', address.country || '');
            setFieldValue('city', address.city || address.town || address.village || '')
            setFieldValue('postcode', address.postcode || '')
            setFieldValue('street', address.road || '')
        } catch (error) {
            console.error('Error fetching reverse geocoding data:', error);
        }
    });
});
</script>

<style scoped></style>
