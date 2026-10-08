<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <InputDefault :disabled="true" :col="[3, 9]" title="ID" v-model="formData.id" />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Code"
                placeholder="Example: pro"
                v-model="formData.code"
                :is-valid="initial_load ? null : !!formData.code"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Name"
                placeholder="Example: Pro Plan"
                v-model="formData.name"
                :is-valid="initial_load ? null : !!formData.name"
              />
              <TextareaDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Description"
                placeholder="Short description of this plan"
                v-model="formData.description"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Price"
                type="number"
                placeholder="0"
                v-model="formData.price"
                :is-valid="initial_load ? null : formData.price !== '' && formData.price !== null"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Currency"
                placeholder="IDR"
                v-model="formData.currency"
              />
              <CSelect
                :disabled="action == 'Read'"
                label="Billing Cycle"
                :options="billingOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.billing_cycle"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Duration (days)"
                type="number"
                placeholder="30"
                v-model="formData.duration_days"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Trial (days)"
                type="number"
                placeholder="0"
                v-model="formData.trial_days"
              />

              <hr />
              <h6>Usage Limits</h6>
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Users"
                type="number"
                placeholder="10"
                v-model="formData.max_users"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Customers"
                type="number"
                placeholder="100"
                v-model="formData.max_customers"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Warehouses"
                type="number"
                placeholder="2"
                v-model="formData.max_warehouses"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Products"
                type="number"
                placeholder="1000"
                v-model="formData.max_products"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Storage (MB)"
                type="number"
                placeholder="1024"
                v-model="formData.max_storage_mb"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max API Calls / Day"
                type="number"
                placeholder="100000"
                v-model="formData.max_api_calls_per_day"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Max Transactions / Month"
                type="number"
                placeholder="1000"
                v-model="formData.max_transactions_per_month"
              />

              <hr />
              <TextareaDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Features Enabled (JSON array)"
                placeholder='["courier","tracking","whatsapp","report","api"]'
                v-model="formData.features_text"
                :is-valid="initial_load ? null : validJsonArray(formData.features_text)"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Sort Order"
                type="number"
                placeholder="0"
                v-model="formData.sort_order"
              />

              <CRow form class="form-group">
                <CCol sm="3">Popular</CCol>
                <SwitchDefault
                  :disabled="action == 'Read'"
                  :default_value="formData.is_popular"
                  v-on:onChange="formData.is_popular = $event"
                />
              </CRow>
              <CRow form class="form-group">
                <CCol sm="3">Status</CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="formData.status"
                  v-on:onChange="formData.status = $event"
                />
              </CRow>
            </CForm>
            <Metadata
              :defaultMetadata="formData.metadata"
              v-on:handleChange="
                (formData.metadata = $event.result),
                  (formData.error_metadata = $event.error_metadata)
              "
              model="mst_subscription_plan"
            />
          </CCardBody>
          <CCardFooter>
            <div class="float-left">
              <CButton v-if="action != 'Read'" type="submit" size="sm" color="primary" @click="save()">
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
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getMstSubscriptionPlan,
  insertMstSubscriptionPlan,
  updateMstSubscriptionPlan,
} from '../../../resource/MstSubscriptionPlan';

export default {
  name: 'FormSubscriptionPlan',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      billingOptions: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
      ],
      formData: {
        status: 'Active',
        currency: 'IDR',
        billing_cycle: 'monthly',
        price: 0,
        is_popular: false,
        features_text: '[]',
        metadata: {},
      },
    };
  },
  async mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) await this.loadData();
  },
  methods: {
    async loadData() {
      const result = await getMstSubscriptionPlan({ id: this.$route.params.id });
      if (!result || result.error || !result.data?.length) return;
      const data = result.data[0];
      this.formData = {
        ...data,
        features_text: Array.isArray(data.features_enabled)
          ? JSON.stringify(data.features_enabled)
          : '[]',
      };
    },
    validJsonArray(value) {
      if (!value || !value.trim()) return true;
      try {
        return Array.isArray(JSON.parse(value));
      } catch (error) {
        return false;
      }
    },
    parsedFeatures(value) {
      if (!value || !value.trim()) return [];
      return JSON.parse(value);
    },
    valid() {
      return (
        !!this.formData.code &&
        !!this.formData.name &&
        this.formData.price !== '' &&
        this.formData.price !== null &&
        this.validJsonArray(this.formData.features_text) &&
        !this.formData.error_metadata
      );
    },
    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all required data and valid feature list',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (
        !confirm(
          this.$route.params.id
            ? 'You are about to save changes to this data. Would you like to continue?'
            : 'You are about to add this new data. Would you like to continue?',
        )
      ) {
        return;
      }
      this.$isLoading(true);
      const payload = {
        ...this.formData,
        code: this.formData.code.toLowerCase(),
        features_enabled: this.parsedFeatures(this.formData.features_text),
      };
      delete payload.features_text;
      const result = payload.id
        ? await updateMstSubscriptionPlan(payload)
        : await insertMstSubscriptionPlan(payload);
      this.$isLoading(false);
      this.$toast.open({
        message: result?.error ? `${result.message}` : 'Data has been saved successfully',
        type: result?.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!result?.error) handleBack(this.$router, this.$route);
    },
  },
};
</script>
