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
              <CInput :disabled="true" horizontal v-model="formData.id">
                <template #label>
                  <p class="col-form-label col-sm-3">IDs</p>
                </template>
              </CInput>
              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Department *"
                :options="departmentOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.mst_department_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.formData.mst_department_id.$error &&
                    $v.formData.mst_department_id.required,
                  'is-invalid':
                    $v.formData.mst_department_id.$error &&
                    !$v.formData.mst_department_id.required,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Department
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter section name"
                autocomplete="name"
                v-model="formData.name"
                :add-input-classes="{
                  'is-valid':
                    !$v.formData.name.$error && $v.formData.name.required,
                  'is-invalid':
                    $v.formData.name.$error && !$v.formData.name.required,
                }"
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
                placeholder="Enter section description"
                horizontal
                v-model="formData.description"
                :add-input-classes="{
                  'is-valid':
                    !$v.formData.description.$error &&
                    $v.formData.description.required,
                  'is-invalid':
                    $v.formData.description.$error &&
                    !$v.formData.description.required,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Description
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
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
                  (formData.error_metadata = $event.error_metadata)
              "
              model="mst_section"
            />
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' || formData.is_sys ? false : true"
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
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import { required } from 'vuelidate/lib/validators';
import {
  getMstSection,
  insertMstSection,
  updateMstSection,
} from '../../../resource/MstSection';
import { getMstDepartment } from '../../../resource/MstDepartment';

export default {
  name: 'WareHouseForm',
  data() {
    return {
      initial_load: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      listCategoryWarehouse: [
        {
          value: 1,
          label: 'Quarantine',
        },
        {
          value: 3,
          label: 'Ready To Sell',
        },
      ],
      formData: { status: 'Active' },
      departmentOptions: [],
      statusOptions: ['Active', 'Inactive'],
      listProvince: [],
      listEntity: [],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.loadDepartment();
  },
  validations: {
    formData: {
      mst_department_id: { required },
      name: { required },
      description: { required },
    },
  },
  methods: {
    async loadData() {
      let _res = await getMstSection({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    },
    async loadDepartment() {
      let _res = await getMstDepartment({ status: 'Active' });
      if (_res) {
        for (const it of _res.data) {
          this.departmentOptions.push({
            label: it.name,
            value: `${it.id}`,
          });
        }
      }
    },
    valid() {
      if (!this.formData.mst_department_id) {
        return false;
      } else if (!this.formData.name) {
        return false;
      } else if (!this.formData.description) {
        return false;
      } else if (this.formData.error_metadata) {
        return false;
      }
      return true;
    },
    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all the required data',
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
        this.$isLoading(true);
        let dataPost = this.formData;
        let res = {};
        if (dataPost.id) {
          res = await updateMstSection(dataPost);
        } else {
          res = await insertMstSection(dataPost);
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
