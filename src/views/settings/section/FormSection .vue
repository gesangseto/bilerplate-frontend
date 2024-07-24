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
              <CInput :disabled="true" horizontal v-model="section.id">
                <template #label>
                  <p class="col-form-label col-sm-3">ID</p>
                </template>
              </CInput>
              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Type Of Temperature *"
                :options="departmentOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="section.mst_department_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.mst_department_id.$error &&
                    $v.section.mst_department_id.required,
                  'is-invalid':
                    $v.section.mst_department_id.$error &&
                    !$v.section.mst_department_id.required,
                }"
                invalid-feedback="Department is required"
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
                v-model="section.name"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.name.$error && $v.section.name.required,
                  'is-invalid':
                    $v.section.name.$error && !$v.section.name.required,
                }"
                invalid-feedback="Section name is required"
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
                v-model="section.description"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.description.$error &&
                    $v.section.description.required,
                  'is-invalid':
                    $v.section.description.$error &&
                    !$v.section.description.required,
                }"
                invalid-feedback="Section description is required"
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
                  :default_value="section.status"
                  v-on:onChange="section.status = $event"
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
      section: { status: 'Active' },
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
    section: {
      mst_department_id: { required },
      name: { required },
      description: { required },
    },
  },
  methods: {
    async loadData() {
      let _res = await getMstSection({ id: this.$route.params.id });
      if (_res) {
        this.section = _res.data[0];
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
    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = this.section;
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
            : 'Data has been saved succesfully ',
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
