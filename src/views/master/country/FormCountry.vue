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
                title="Name"
                placeholder="Example: Indonesia"
                v-model="formData.name"
                :max="100"
                :is-valid="initial_load ? null : !!formData.name"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Code"
                placeholder="Example: ID"
                v-model="formData.code"
                :max="5"
                :options="{ uppercase: true, nospace: true }"
                :is-valid="initial_load ? null : !!formData.code"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Country Code"
                placeholder="Example: IDN"
                v-model="formData.country_code"
                :max="10"
                :options="{ uppercase: true, nospace: true }"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Currency Code"
                placeholder="Example: IDR"
                v-model="formData.currency_code"
                :max="5"
                :options="{ uppercase: true, nospace: true }"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Currency Symbol"
                placeholder="Example: Rp"
                v-model="formData.currency_symbol"
                :max="10"
              />
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
              model="mst_country"
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
  getMstCountry,
  insertMstCountry,
  updateMstCountry,
} from '../../../resource/MstCountry';

export default {
  name: 'FormCountry',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: {
        status: 'Active',
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
      const result = await getMstCountry({ id: this.$route.params.id });
      if (!result || result.error || !result.data?.length) return;
      this.formData = result.data[0];
    },
    valid() {
      return (
        !!this.formData.name &&
        !!this.formData.code &&
        !this.formData.error_metadata
      );
    },
    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all required data',
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
        code: this.formData.code.toUpperCase(),
      };
      const result = payload.id
        ? await updateMstCountry(payload)
        : await insertMstCountry(payload);
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
