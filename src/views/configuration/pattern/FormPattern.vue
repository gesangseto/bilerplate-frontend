<template>
  <CRow>
    <CCol md="12">
      <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
          <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
        </CCardHeader>
        <CCardBody>
          <CForm novalidate>
            <CCol sm="12">
              <InputDefault
                :disabled="action == 'Read'"
                required
                :col="[3, 9]"
                title="Name"
                placeholder="Enter pattern name"
                v-model="formData.name"
                :is-valid="initialLoad ? null : !formData.name ? false : true"
              />
            </CCol>
            <CCol sm="12">
              <TextareaDefault
                :disabled="action == 'Read'"
                :col="[3, 9]"
                title="Description"
                placeholder="Enter pattern description"
                v-model="formData.description"
              />
            </CCol>

            <CCol sm="12">
              <InputDefault
                :disabled="action == 'Read'"
                required
                :col="[3, 9]"
                title="Regex"
                placeholder="Enter regex pattern"
                v-model="formData.pattern"
                :is-valid="
                  initialLoad ? null : !formData.pattern ? false : true
                "
              />
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
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getConfPattern,
  insertConfPattern,
  updateConfPattern,
} from '../../../resource/ConfPattern';

export default {
  name: 'FormPattern',
  watch: {},
  data() {
    return {
      initialLoad: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      formData: {},
      connection: { ip: null, username: null, password: null, port: null },
      detailConnector: { params: [] },
      listStation: [
        { label: 'Serialization', value: 'serialization' },
        { label: 'Aggregation', value: 'aggregation' },
        { label: 'Online', value: 'online' },
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
      let _res = await getConfPattern({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    },
    validation() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.pattern) {
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
          res = await updateConfPattern(dataPost);
        } else {
          res = await insertConfPattern(dataPost);
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
