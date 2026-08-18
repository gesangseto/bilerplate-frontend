<template>
  <CRow>
    <CCol md="12">
      <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
          <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
        </CCardHeader>
        <CCardBody>
          <strong
            v-if="formData.is_lock"
            style="color: red; font-size: x-small; margin-bottom: 10px"
            class="mb-5"
          >
            This record is referenced by another transaction.
          </strong>
          <br />
          <br />
          <CCol sm="12">
            <InputDefault
              :disabled="true"
              :col="[3, 9]"
              title="ID"
              placeholder="ID"
              v-model="formData.id"
            />
          </CCol>
          <CCol sm="12">
            <InputDefault
              :disabled="action == 'Read' || formData.is_lock ? true : false"
              :col="[3, 9]"
              title="Name"
              placeholder="Enter Name"
              v-model="formData.name"
              :is-valid="initialLoad ? null : formData.name ? true : false"
            />
          </CCol>
          <CCol sm="12">
            <InputDefault
              :disabled="action == 'Read' || formData.is_lock ? true : false"
              :col="[3, 9]"
              title="Cron Schedule"
              placeholder="* * * * * (5 / 6 length of *)"
              v-model="formData.cron"
              :is-valid="!formData.cron ? null : testCron(formData.cron)"
              :invalid_feedback="'Invalid cron expression. Please visit https://crontab.guru/ for assistance.'"
            />
          </CCol>
          <CCol sm="12">
            <InputDefault
              :disabled="'Read'"
              :col="[3, 9]"
              title="Info"
              v-model="formData.description"
            />
          </CCol>
          <CCol sm="12">
            <CRow form class="form-group">
              <CCol sm="3"> Show </CCol>
              <SwitchStatusMaster
                :disabled="action == 'Read'"
                :show_label="true"
                :default_value="formData.status"
                v-on:onChange="formData.status = $event"
              />
            </CRow>
          </CCol>
        </CCardBody>

        <CCardFooter class="d-flex justify-content-start gap-2">
          <ButtonEdit
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
</template>

<script>
import {
  capitalizeFirstLetter,
  handleBack,
  isValidCron,
  readCron,
} from '../../../utils';
import {
  getConfCron,
  insertConfCron,
  updateConfCron,
} from '../../../resource/ConfCron';

export default {
  name: 'Formcron',
  watch: {},
  data() {
    return {
      initialLoad: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      formData: { status: 'Active' },
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
      let _res = await getConfCron({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    },
    testCron(string) {
      if (!string) string = this.formData.cron;
      if (!string) return false;
      let isvalid = isValidCron(string);
      if (isvalid) this.formData.description = readCron(string);
      else this.formData.description = 'Invalid Cron';
      return isvalid;
    },
    validation() {
      if (!this.formData.name) {
        return false;
      } else if (this.formData.cron && !this.testCron()) {
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
        let dataPost = this.formData;
        this.$isLoading(true);
        let res = {};
        if (this.action === 'Create' && dataPost.id) {
          delete dataPost.id;
        }
        if (dataPost.id) {
          res = await updateConfCron(dataPost);
        } else {
          res = await insertConfCron(dataPost);
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
