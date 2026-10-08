<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  required
                  :col="[3, 9]"
                  title="Code"
                  placeholder="Enter template code (e.g. REQUEST_PAYMENT)"
                  v-model="formData.code"
                  :is-valid="
                    initialLoad ? null : !formData.code ? false : true
                  "
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  required
                  :col="[3, 9]"
                  title="Name"
                  placeholder="Enter template name"
                  v-model="formData.name"
                  :is-valid="
                    initialLoad ? null : !formData.name ? false : true
                  "
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Description"
                  placeholder="Enter description"
                  v-model="formData.description"
                />
              </CCol>

              <CCol sm="12">
                <SelectDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Channel"
                  placeholder="Select channel"
                  v-model="formData.channel"
                  :options="channelOptions"
                  :is-valid="
                    initialLoad ? null : !formData.channel ? false : true
                  "
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Trigger Event"
                  placeholder="e.g. request_payment, item_shipping"
                  v-model="formData.trigger_event"
                />
              </CCol>

              <CCol sm="12">
                <SelectDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Content Type"
                  placeholder="Select content type"
                  v-model="formData.content_type"
                  :options="contentTypeOptions"
                />
              </CCol>

              <CCol sm="12">
                <SelectDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Recipient Type"
                  placeholder="Select recipient type"
                  v-model="formData.recipient_type"
                  :options="recipientTypeOptions"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Subject (Email)"
                  placeholder="Email subject line"
                  v-model="formData.subject"
                />
              </CCol>

              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Content Template"
                  placeholder="Enter template with {&#123;variables&#125;}"
                  v-model="formData.content_template"
                  :rows="6"
                  :is-valid="
                    initialLoad
                      ? null
                      : !formData.content_template
                      ? false
                      : true
                  "
                />
                <small class="text-muted d-block mt-1">
                  Gunakan {{variable}} untuk placeholder. Contoh: {{customer_name}}, {{order_number}}, {{amount}}
                </small>
              </CCol>

              <CCol md="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="action == 'Read'"
                    :default_value="formData.status"
                    :show_label="true"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div class="float-left">
              <CButton
                v-if="action == 'Read' ? false : true"
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
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getMessageTemplate,
  insertMessageTemplate,
  updateMessageTemplate,
} from '../../../resource/ConfMessageTemplate';

export default {
  name: 'FormMessageTemplate',
  data() {
    return {
      initialLoad: true,
      route_action: '',
      action: 'Edit',
      formData: {},
      channelOptions: [
        { value: 'wa', label: 'WhatsApp' },
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
      ],
      contentTypeOptions: [
        { value: 'text', label: 'Text' },
        { value: 'html', label: 'HTML' },
      ],
      recipientTypeOptions: [
        { value: 'customer', label: 'Customer' },
        { value: 'all', label: 'All' },
        { value: 'segment', label: 'Segment' },
      ],
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    };
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
      let _res = await getMessageTemplate({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    },
    validation() {
      if (!this.formData.code) {
        return false;
      } else if (!this.formData.name) {
        return false;
      } else if (!this.formData.channel) {
        return false;
      } else if (!this.formData.content_template) {
        return false;
      }
      return true;
    },
    async save() {
      this.initialLoad = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dismissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let dataPost = this.formData;
        this.$isLoading(true);
        let res = {};
        if (this.action === 'Create' && dataPost.id) {
          delete dataPost.id;
        }
        if (dataPost.id) {
          res = await updateMessageTemplate(dataPost);
        } else {
          res = await insertMessageTemplate(dataPost);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dismissible: true,
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