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
            <InputDefault
              :disabled="true"
              :col="[3, 9]"
              title="ID"
              placeholder="ID"
              v-model="formData.id"
            />
            <SelectOption
              required
              :disabled="action == 'Read' ? true : false"
              title="Department "
              :options="
                departmentOptions.filter((it) => it.is_sys == formData.is_sys)
              "
              v-on:onchange="formData.mst_department_id = $event"
              :value="formData.mst_department_id"
              :col="[3, 9]"
              :is-valid="
                initial_load ? null : formData.mst_department_id ? true : false
              "
            />
            <InputDefault
              required
              :disabled="action == 'Read' ? true : false"
              :col="[3, 9]"
              title="Name"
              v-model="formData.name"
              :is-valid="initial_load ? null : formData.name ? true : false"
            />
            <TextareaDefault
              :disabled="action == 'Read' ? true : false"
              :col="[3, 9]"
              required
              title="Description"
              v-model="formData.description"
              :is-valid="
                initial_load ? null : formData.description ? true : false
              "
            />
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

        <CCardFooter class="d-flex justify-content-start gap-2">
          <ButtonReason
            v-if="action == 'Update' && !formData.is_sys"
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
      formData: { status: 'Active', is_sys: false },
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
            is_sys: it.is_sys ? true : false,
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
