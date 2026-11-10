<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader
            class="d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
            <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
          </CCardHeader>

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
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Name"
                  placeholder="Enter template name"
                  v-model="formData.name"
                  :is-valid="initial_load ? null : formData.name ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Code"
                  placeholder="Enter template code"
                  v-model="formData.code"
                  :is-valid="initial_load ? null : formData.code ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Channel"
                  :options="listChannel"
                  :value="formData.channel"
                  :is-valid="
                    initial_load ? null : formData.channel ? true : false
                  "
                  v-on:onchange="formData.channel = $event"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  title="Subject"
                  placeholder="Enter subject"
                  v-model="formData.subject"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  :rows="6"
                  required
                  title="Content"
                  :placeholder="
                    'Enter content. Dynamic value example: {{name}}'
                  "
                  v-model="formData.content"
                  :is-valid="
                    initial_load ? null : formData.content ? true : false
                  "
                />
              </CCol>
              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="isRead"
                    :show_label="true"
                    :default_value="formData.status"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>

          <CCardFooter class="d-flex justify-content-start gap-2">
            <ButtonReason
              v-if="action == 'Update'"
              :property="formData"
              type="update"
              :reason.sync="formData.reason"
              :reason-required="true"
              @handleSubmit="save()"
            />
            <ButtonSubmit v-if="action == 'Create'" @handleSubmit="save()" />
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
  getSysNotificationTemplate,
  insertSysNotificationTemplate,
  updateSysNotificationTemplate,
} from '../../../resource/SysNotificationTemplate';

export default {
  name: 'FormSysNotificationTemplate',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: { status: 'Active', channel: 'IN_APP' },
      listChannel: [
        { value: 'IN_APP', label: 'IN_APP' },
        { value: 'WHATSAPP', label: 'WHATSAPP' },
        { value: 'BOTH', label: 'BOTH' },
      ],
    };
  },
  computed: {
    isRead() {
      return this.action === 'Read';
    },
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      let res = await getSysNotificationTemplate({ id: this.$route.params.id });
      if (res && !res.error && res.data && res.data.length > 0) {
        this.formData = res.data[0];
      }
    },
    validation() {
      if (!this.formData.name) return false;
      if (!this.formData.code) return false;
      if (!this.formData.channel) return false;
      if (!this.formData.content) return false;
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
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let formData = this.formData;
        this.$isLoading(true);
        let res = {};
        if (formData.id) {
          res = await updateSysNotificationTemplate(formData);
        } else {
          res = await insertSysNotificationTemplate(formData);
        }
        this.$isLoading(false);
        this.$toast.open({
          message:
            res && !res.error
              ? 'Data has been saved successfully '
              : `${res?.message || 'Failed to save data'}`,
          type: res && !res.error ? 'success' : 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) handleBack(this.$router, this.$route);
      }
    },
  },
};
</script>
