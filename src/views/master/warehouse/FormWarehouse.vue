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
                  <p class="col-form-label col-sm-3">ID</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter warehouse name"
                autocomplete="name"
                v-model="formData.name"
                :is-valid="initial_load ? null : formData.name ? true : false"
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
                placeholder="Enter warehouse address"
                horizontal
                v-model="formData.address"
                :is-valid="
                  initial_load ? null : formData.address ? true : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Address
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CTextarea>

              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Province *"
                :options="listProvince"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.mst_province_id"
                :is-valid="
                  initial_load ? null : formData.mst_province_id ? true : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Province
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Entity *"
                :options="listEntity"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.mst_warehouse_entity_id"
                :is-valid="
                  initial_load
                    ? null
                    : formData.mst_warehouse_entity_id
                    ? true
                    : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Entity
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Warehouse Category *"
                :options="listWhCategory"
                horizontal
                placeholder="--Select--"
                v-model="formData.category_id"
                :value.sync="formData.category_id"
                :is-valid="
                  initial_load ? null : formData.category_id ? true : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Warehouse Category
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Warehouse Temperature Type *"
                :options="temperaturOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="formData.temperature"
                :is-valid="
                  initial_load ? null : formData.temperature ? true : false
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Warehouse Temperature Type
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

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
              model="mst_warehouse"
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
  getMstWarehouse,
  getMstWarehouseCategory,
  getMstWarehouseEntity,
  insertMstWarehouse,
  updateMstWarehouse,
} from '../../../resource/MstWarehouse';
import { getMstProvince } from '../../../resource/MstProvince';

export default {
  name: 'FormWarehouse',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: {
        status: 'Active',
        name: '',
        address: '',
        category_id: null,
        mst_warehouse_entity_id: null,
        mst_province_id: null,
        temperature: null,
      },
      temperaturOptions: [
        {
          value: 1,
          label: 'Suhu',
        },
        {
          value: 0,
          label: 'Non Suhu',
        },
      ],
      statusOptions: ['Active', 'Inactive'],
      listProvince: [],
      listEntity: [],
      listWhCategory: [],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.loadWhCategory();
    this.loadProvince();
    this.loadEntity();
  },
  methods: {
    async loadData() {
      let _res = await getMstWarehouse({ id: this.$route.params.id });
      this.formData = _res.data[0];
      this.formData['category_id'] = this.formData['category_id'].toString();
    },
    async loadEntity() {
      let _res = await getMstWarehouseEntity({ status: 'Active' });
      for (const it of _res.data) {
        this.listEntity.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    async loadWhCategory() {
      let _res = await getMstWarehouseCategory({ status: 'Active' });
      for (const it of _res.data) {
        this.listWhCategory.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    async loadProvince() {
      let _res = await getMstProvince({ status: 'Active' });
      for (const it of _res.data) {
        this.listProvince.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    valid() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.address) {
        return false;
      } else if (!this.formData.mst_province_id) {
        return false;
      } else if (!this.formData.mst_warehouse_entity_id) {
        return false;
      } else if (!this.formData.category_id) {
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
          res = await updateMstWarehouse(dataPost);
        } else {
          res = await insertMstWarehouse(dataPost);
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
