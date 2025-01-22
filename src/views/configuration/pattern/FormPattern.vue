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
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter station name"
                v-model="formData.name"
                :is-valid="initialLoad ? null : !formData.name ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CTextarea
                :disabled="action == 'Read' ? true : false"
                placeholder="Enter connector description"
                horizontal
                v-model="formData.description"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Description</p>
                </template>
              </CTextarea>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Pattern"
                v-model="formData.pattern"
                :is-valid="
                  initialLoad ? null : !formData.pattern ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Pattern
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CRow form class="form-group">
                <CCol sm="3"> Status </CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="formData.status"
                  v-on:onChange="formData.status = $event"
                />
              </CRow>
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
  </div>
</template>

<script>
import { capitalizeFirstLetter } from '../../../utils';
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
        if (!res['error']) this.$router.back();
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>
