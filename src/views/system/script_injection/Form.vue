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
                    placeholder="Enter script name"
                    v-model="formData.name"
                    :is-valid="
                      initial_load ? null : formData.name ? true : false
                    "
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    title="Description"
                    placeholder="Enter Description"
                    v-model="formData.description"
                  />
                </CCol>
                <CCol sm="12">
                  <TextareaDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    required
                    title="Script"
                    placeholder="Enter script"
                    v-model="formData.script"
                    :is-valid="
                      initial_load ? null : formData.script ? true : false
                    "
                  />
                </CCol>
                <CCol sm="12">
                  <SelectOption
                    title="Running Schedule"
                    :options="listCron"
                    v-on:onchange="formData.schedule = $event"
                    :value="formData.schedule"
                    :col="[3, 9]"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="true"
                    :col="[3, 9]"
                    title="Last Execute"
                    v-model="formData.last_execute"
                  />
                </CCol>

                <CCol sm="12">
                  <CRow form class="form-group">
                    <CCol sm="3"> Status </CCol>
                    <SwitchStatusMaster
                      :disabled="action == 'Read'"
                      :show_label="true"
                      :default_value="formData.status"
                      v-on:onChange="formData.status = $event"
                    />
                  </CRow>
                </CCol>
              </CForm>
              <Metadata
                :defaultMetadata="formData.metadata"
                v-on:handleChange="
                  (formData.metadata = $event.result),
                    (formData.error_metadata = $event.error_metadata)
                "
                model="mst_customer"
              />
            </CCardBody>
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Approve' && userInfo.id == 0"
              color="warning"
              size="sm"
              @click="execution()"
            >
              <CIcon size="sm" name="cil-warning" /> Execute
            </CButton>
            <CButton
              v-if="action == 'Create' || action == 'Update'"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
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
import {
  capitalizeFirstLetter,
  getProfile,
  handleBack,
  isValidCron,
} from '../../../utils';
import {
  getSysScriptInj,
  updateSysScriptInj,
  insertSysScriptInj,
  executeSysScriptInj,
} from '../../../resource/SysScriptInj';
import moment from 'moment';
import { getConfCron } from '../../../resource/ConfCron';

export default {
  name: 'FormStation',
  watch: {},
  data() {
    return {
      userInfo: getProfile(),
      initial_load: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      formData: { status: 'Active' },
      listCron: [],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.loadCron();
  },
  methods: {
    async loadData() {
      let _res = await getSysScriptInj({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
        this.formData.last_execute = moment(this.formData.last_execute)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss');
      }
    },
    async loadCron() {
      let cron = await getConfCron();
      if (cron) {
        this.listCron = cron.data.map((it) => {
          return { value: it.cron, label: it.name };
        });
      }
      return;
    },
    async execution() {
      var message = `You are about to execute this script. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await executeSysScriptInj({ id: this.formData.id });
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
    },
    testCron(string) {
      if (!string) string = this.formData.schedule;
      return isValidCron(string);
    },
    validation() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.script) {
        return false;
      } else if (this.formData.schedule && !this.testCron()) {
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
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let formData = this.formData;
        this.$isLoading(true);
        let res = {};
        if (this.action === 'Create' && formData.id) {
          delete formData.id;
        }
        if (formData.id) {
          res = await updateSysScriptInj(formData);
        } else {
          res = await insertSysScriptInj(formData);
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
