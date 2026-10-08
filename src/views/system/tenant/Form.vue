<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CCardBody>
              <CForm>
                <CCol sm="12">
                  <InputDefault
                    :disabled="true"
                    :col="[3, 9]"
                    title="ID"
                    v-model="formData.id"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    required
                    title="Name"
                    placeholder="Enter tenant name"
                    v-model="formData.name"
                    :is-valid="
                      initial_load ? null : formData.name ? true : false
                    "
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' || (formData.id && !isNewRecord) ? true : false"
                    :col="[3, 9]"
                    required
                    title="Subdomain"
                    placeholder="Enter subdomain (e.g., mycompany)"
                    v-model="formData.subdomain"
                    :is-valid="
                      initial_load ? null : formData.subdomain ? true : false
                    "
                    help-text="Only lowercase letters, numbers, and dash allowed. Cannot be changed after creation."
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Contact Name"
                    placeholder="Enter contact person name"
                    v-model="formData.contact_name"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    required
                    title="Contact Email"
                    placeholder="Enter contact email"
                    v-model="formData.contact_email"
                    :is-valid="
                      initial_load ? null : formData.contact_email ? true : false
                    "
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Contact Phone"
                    placeholder="Enter contact phone"
                    v-model="formData.contact_phone"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Identity Name"
                    placeholder="Enter identity name"
                    v-model="formData.identity_name"
                  />
                </CCol>
                <CCol sm="12">
                  <TextareaDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Identity Address"
                    placeholder="Enter identity address"
                    v-model="formData.identity_address"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Tax ID (NPWP)"
                    placeholder="Enter tax ID"
                    v-model="formData.tax_id"
                  />
                </CCol>
                <CCol sm="12">
                  <SelectOption
                    title="Status"
                    :options="listStatus"
                    v-on:onchange="formData.status = $event"
                    :value="formData.status"
                    :col="[3, 9]"
                    :disabled="action == 'Read'"
                  />
                </CCol>
                <CCol sm="12">
                  <SelectOption
                    title="Plan"
                    :options="listPlan"
                    v-on:onchange="formData.plan_code = $event"
                    :value="formData.plan_code"
                    :col="[3, 9]"
                    :disabled="action == 'Read'"
                  />
                </CCol>
                <CCol sm="12">
                  <SelectOption
                    title="Billing Cycle"
                    :options="listBillingCycle"
                    v-on:onchange="formData.billing_cycle = $event"
                    :value="formData.billing_cycle"
                    :col="[3, 9]"
                    :disabled="action == 'Read'"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    type="number"
                    title="Max Users"
                    v-model="formData.max_users"
                    help-text="Maximum number of users for this tenant"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    type="number"
                    title="Max Warehouses"
                    v-model="formData.max_warehouses"
                    help-text="Maximum number of warehouses for this tenant"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    type="number"
                    title="Max Storage (MB)"
                    v-model="formData.max_storage_mb"
                    help_text="Maximum storage in MB"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    type="number"
                    title="Max API Calls / Day"
                    v-model="formData.max_api_calls_per_day"
                    help_text="Maximum API calls per day"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Default Timezone"
                    placeholder="Asia/Jakarta"
                    v-model="formData.default_timezone"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Default Locale"
                    placeholder="id-ID"
                    v-model="formData.default_locale"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Default Currency"
                    placeholder="IDR"
                    v-model="formData.default_currency"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Date Format"
                    placeholder="DD/MM/YYYY"
                    v-model="formData.date_format"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Primary Color (Hex)"
                    placeholder="#1976D2"
                    v-model="formData.primary_color"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Secondary Color (Hex)"
                    placeholder="#424242"
                    v-model="formData.secondary_color"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Logo Path (base64/URL)"
                    placeholder="data:image/png;base64,... or /path/to/logo.png"
                    v-model="formData.logo_path"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Favicon Path (base64/URL)"
                    placeholder="data:image/png;base64,... or /path/to/favicon.ico"
                    v-model="formData.favicon_path"
                  />
                </CCol>
                <CCol sm="12">
                  <SelectOption
                    title="Features Enabled"
                    :options="listFeatures"
                    v-on:onchange="formData.features_enabled = $event"
                    :value="formData.features_enabled"
                    :col="[3, 9]"
                    :disabled="action == 'Read'"
                    :multiple="true"
                  />
                </CCol>
                <CCol sm="12">
                  <CRow form class="form-group">
                    <CCol sm="3"> Trial Ends At </CCol>
                    <CCol sm="9">
                      <CFormInput
                        :disabled="action == 'Read'"
                        type="datetime-local"
                        v-model="formData.trial_ends_at_local"
                        class="form-control"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CForm>
              <Metadata
                :defaultMetadata="formData.metadata"
                v-on:handleChange="
                  (formData.metadata = $event.result),
                    (formData.error_metadata = $event.error_metadata)
                "
                model="sys_tenant"
              />
            </CCardBody>
          </CCardBody>
          <CCardFooter>
            <div class="float-left">
              <CButton
                v-if="action == 'Create' || action == 'Update' || action == 'Copy'"
                type="submit"
                size="sm"
                color="primary"
                @click="save()"
              >
                <CIcon name="cil-check-circle" /> Submit
              </CButton>
              <ButtonBack />
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  capitalizeFirstLetter,
  getProfile,
  handleBack,
} from '../../../utils';
import {
  getSysTenant,
  updateSysTenant,
  insertSysTenant,
} from '../../../resource/SysTenant';
import { getMstSubscriptionPlan } from '../../../resource/MstSubscriptionPlan';
import moment from 'moment';

export default {
  name: 'FormSysTenant',
  watch: {},
  data() {
    return {
      userInfo: getProfile(),
      initial_load: true,
      route_action: '',
      action: 'Edit',
      isNewRecord: true,
      formData: {
        status: 'Pending',
        plan_code: 'starter',
        billing_cycle: 'monthly',
        max_users: 10,
        max_warehouses: 2,
        max_storage_mb: 1024,
        max_api_calls_per_day: 100000,
        default_timezone: 'Asia/Jakarta',
        default_locale: 'id-ID',
        default_currency: 'IDR',
        date_format: 'DD/MM/YYYY',
        primary_color: '#1976D2',
        secondary_color: '#424242',
        features_enabled: [],
        delete_flag: false,
      },
      listStatus: [
        { value: 'Active', label: 'Active' },
        { value: 'Trial', label: 'Trial' },
        { value: 'Suspended', label: 'Suspended' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Pending', label: 'Pending' },
      ],
      listPlan: [
        { value: 'starter', label: 'Starter' },
        { value: 'pro', label: 'Pro' },
        { value: 'enterprise', label: 'Enterprise' },
      ],
      listBillingCycle: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
      ],
      listFeatures: [
        { value: 'whatsapp', label: 'WhatsApp Integration' },
        { value: 'api', label: 'API Access' },
        { value: 'reports', label: 'Advanced Reports' },
        { value: 'all', label: 'All Features' },
      ],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : this.action == 'Copy' ? 'COPY' : 'EDIT';
    this.isNewRecord = this.action === 'Create' || this.action === 'Copy';
    this.loadPlans();
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    async loadPlans() {
      const result = await getMstSubscriptionPlan({ status: 'Active', raw: true });
      if (result && !result.error && Array.isArray(result.data)) {
        this.listPlan = result.data.map((plan) => ({
          value: plan.code,
          label: `${plan.name}${plan.price ? ` (${plan.currency || 'IDR'} ${plan.price})` : ''}`,
        }));
      }
    },
    async loadData() {
      let _res = await getSysTenant({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
        // Convert trial_ends_at to local datetime-local format
        if (this.formData.trial_ends_at) {
          this.formData.trial_ends_at_local = moment(this.formData.trial_ends_at).format('YYYY-MM-DDTHH:mm');
        }
        // Ensure features_enabled is array
        if (typeof this.formData.features_enabled === 'string') {
          try {
            this.formData.features_enabled = JSON.parse(this.formData.features_enabled);
          } catch (e) {
            this.formData.features_enabled = [];
          }
        }
      }
    },
    validation() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.subdomain) {
        return false;
      } else if (!this.formData.contact_email) {
        return false;
      } else if (!/^[a-z0-9-]+$/.test(this.formData.subdomain)) {
        this.$toast.open({
          message: 'Subdomain hanya boleh huruf kecil, angka, dan dash',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    async save() {
      this.initial_load = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this tenant. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new tenant. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let formData = { ...this.formData };
        this.$isLoading(true);
        let res = {};
        if (this.action === 'Create' && formData.id) {
          delete formData.id;
        }
        // Convert trial_ends_at_local back to ISO string
        if (formData.trial_ends_at_local) {
          formData.trial_ends_at = moment(formData.trial_ends_at_local).toISOString();
        }
        delete formData.trial_ends_at_local;
        
        // Ensure features_enabled is JSON string
        if (Array.isArray(formData.features_enabled)) {
          formData.features_enabled = JSON.stringify(formData.features_enabled);
        }

        if (formData.id) {
          res = await updateSysTenant(formData);
        } else {
          res = await insertSysTenant(formData);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) handleBack(this.$router, this.$route);
      }
      return;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
  },
};
</script>