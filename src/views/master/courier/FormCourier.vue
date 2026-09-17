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
                placeholder="Example: JNT"
                v-model="formData.code"
                :is-valid="initial_load ? null : !!formData.code"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Name"
                placeholder="Example: J&T Express"
                v-model="formData.name"
                :is-valid="initial_load ? null : !!formData.name"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                required
                title="Provider"
                placeholder="Example: jnt"
                v-model="formData.provider"
                :is-valid="initial_load ? null : !!formData.provider"
              />
              <InputDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="API Base URL"
                placeholder="https://api.example.com"
                v-model="formData.api_base_url"
              />
              <CSelect
                :disabled="action == 'Read'"
                label="Authentication"
                :options="authOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.auth_type"
              />
              <InputDefault
                v-if="action != 'Read'"
                :disabled="false"
                :col="[3, 9]"
                title="Credentials"
                placeholder="JSON or API credential value"
                v-model="formData.credentials"
              >
                <template #description>
                  <p style="font-size: x-small">
                    Credentials are write-only. Leave blank during update to preserve the saved credential.
                  </p>
                </template>
              </InputDefault>
              <TextareaDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Endpoint Config (JSON)"
                placeholder='{"rates":"/v1/rates","tracking":"/v1/trackings"}'
                v-model="formData.endpoint_config_text"
                :is-valid="initial_load ? null : validJson(formData.endpoint_config_text)"
              />
              <TextareaDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Service Config (JSON)"
                placeholder='{"services":["EZ"]}'
                v-model="formData.service_config_text"
                :is-valid="initial_load ? null : validJson(formData.service_config_text)"
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
              model="mst_courier"
            />
          </CCardBody>
          <CCardFooter>
            <CButton v-if="action != 'Read'" type="submit" size="sm" color="primary" @click="save()">
              <CIcon name="cil-check-circle" /> Submit
            </CButton>
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getMstCourier,
  insertMstCourier,
  updateMstCourier,
} from '../../../resource/MstCourier';

export default {
  name: 'FormCourier',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      authOptions: [
        { value: 'bearer', label: 'Bearer' },
        { value: 'api_key', label: 'API Key' },
        { value: 'header', label: 'Custom Header' },
        { value: 'basic', label: 'Basic Auth' },
        { value: 'jnt_signature', label: 'J&T Signature' },
      ],
      formData: {
        status: 'Inactive',
        auth_type: 'bearer',
        metadata: {},
        credentials: '',
        endpoint_config_text: '',
        service_config_text: '',
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
      const result = await getMstCourier({ id: this.$route.params.id });
      if (!result || result.error || !result.data?.length) return;
      const data = result.data[0];
      this.formData = {
        ...data,
        credentials: '',
        endpoint_config_text: data.endpoint_config
          ? JSON.stringify(data.endpoint_config, null, 2)
          : '',
        service_config_text: data.service_config
          ? JSON.stringify(data.service_config, null, 2)
          : '',
      };
    },
    validJson(value) {
      if (!value || !value.trim()) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return false;
      }
    },
    parsedJson(value) {
      if (!value || !value.trim()) return null;
      return JSON.parse(value);
    },
    valid() {
      return (
        !!this.formData.code &&
        !!this.formData.name &&
        !!this.formData.provider &&
        this.validJson(this.formData.endpoint_config_text) &&
        this.validJson(this.formData.service_config_text) &&
        !this.formData.error_metadata
      );
    },
    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all required data and valid JSON configuration',
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
        endpoint_config: this.parsedJson(this.formData.endpoint_config_text),
        service_config: this.parsedJson(this.formData.service_config_text),
      };
      delete payload.endpoint_config_text;
      delete payload.service_config_text;
      if (!payload.credentials) delete payload.credentials;
      const result = payload.id
        ? await updateMstCourier(payload)
        : await insertMstCourier(payload);
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
