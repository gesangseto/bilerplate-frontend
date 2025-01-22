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
              <CInput :disabled="true" horizontal v-model="formData.id">
                <template #label>
                  <p class="col-form-label col-sm-3">ID</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter department name"
                v-model="formData.name"
                :is-valid="initial_load ? null : formData.name ? true : false"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CInput>
              <CTextarea
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter department description"
                v-model="formData.description"
                :is-valid="
                  initial_load ? null : formData.description ? true : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Description
                    <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CTextarea>
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
            <Metadata
              :defaultMetadata="formData.metadata"
              v-on:handleChange="
                (formData.metadata = $event.result),
                  (formData.error = $event.error)
              "
              model="mst_customer"
            />
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' ? false : true"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { capitalizeFirstLetter } from '../../../utils';
import {
  getMstDepartment,
  insertMstDepartment,
  updateMstDepartment,
} from '../../../resource/MstDepartment';
export default {
  name: 'FormDepartment',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: { name: '', description: '', status: 'Active' },
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    };
  },
  validations: {
    formData: {
      name: { required },
      description: { required },
    },
  },
  async mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      let _res = await getMstDepartment({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    }
  },
  methods: {
    async save() {
      this.initial_load = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = this.formData;
        let res = {};
        if (dataPost.id) {
          res = await updateMstDepartment(dataPost);
        } else {
          res = await insertMstDepartment(dataPost);
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
