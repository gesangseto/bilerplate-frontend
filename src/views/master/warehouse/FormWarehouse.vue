<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Warehouse [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter warehouse name"
                autocomplete="name"
                v-model="warehouse.name"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.name.$error && $v.warehouse.name.required,
                  'is-invalid':
                    $v.warehouse.name.$error && !$v.warehouse.name.required,
                }"
                invalid-feedback="Warehouse name is required"
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
                v-model="warehouse.address"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.address.$error &&
                    $v.warehouse.address.required,
                  'is-invalid':
                    $v.warehouse.address.$error &&
                    !$v.warehouse.address.required,
                }"
                invalid-feedback="Warehouse address is required"
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

              <!-- <CSelect
                :disabled="action == 'Read' ? true : false"
                :options="listProvince"
                placeholder="- Country -"
                horizontal
                :value.sync="warehouse.mst_province_id"
              ></CSelect> -->
              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Province *"
                :options="listProvince"
                horizontal
                placeholder="--Select--"
                :value.sync="warehouse.mst_province_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.mst_province_id.$error &&
                    $v.warehouse.mst_province_id.required,
                  'is-invalid':
                    $v.warehouse.mst_province_id.$error &&
                    !$v.warehouse.mst_province_id.required,
                }"
                invalid-feedback="Province is required"
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
                :value.sync="warehouse.mst_warehouse_entity_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.mst_warehouse_entity_id.$error &&
                    $v.warehouse.mst_warehouse_entity_id.required,
                  'is-invalid':
                    $v.warehouse.mst_warehouse_entity_id.$error &&
                    !$v.warehouse.mst_warehouse_entity_id.required,
                }"
                invalid-feedback="Entity is required"
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
                :options="listCategoryWarehouse"
                horizontal
                placeholder="--Select--"
                v-model="warehouse.category_id"
                :value.sync="warehouse.category_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.category_id.$error &&
                    $v.warehouse.category_id.required,
                  'is-invalid':
                    $v.warehouse.category_id.$error &&
                    !$v.warehouse.category_id.required,
                }"
                invalid-feedback="Warehouse category is required"
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
                :value.sync="warehouse.temperature"
                :add-input-classes="{
                  'is-valid':
                    !$v.warehouse.temperature.$error &&
                    $v.warehouse.temperature.required,
                  'is-invalid':
                    $v.warehouse.temperature.$error &&
                    !$v.warehouse.temperature.required,
                }"
                invalid-feedback="Temperature is required"
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
                <CCol sm="3">
                  Status
                  <span class="text-danger">*</span>
                </CCol>
                {{ action == "Read" ? warehouse.status : null }}
                <CInputRadioGroup
                  v-if="action == 'Read' ? false : true"
                  class="col-sm-9"
                  :options="statusOptions"
                  :checked.sync="warehouse.status"
                  :inline="true"
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
            <CButton
              type="reset"
              size="sm"
              class="m-1"
              color="danger"
              @click="cancel()"
            >
              <CIcon name="cil-ban" /> Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from "../../../utils";
import $axiosMertrack from "../../../apiMertrack";
import { required } from "vuelidate/lib/validators";

export default {
  name: "FormWarehouse",
  data() {
    return {
      route_action: "",
      // category: '',
      action: "Edit",
      listCategoryWarehouse: [
        {
          value: 1,
          label: "Quarantine",
        },
        {
          value: 3,
          label: "Ready To Sell",
        },
      ],
      warehouse: {
        status: "Active",
        entity: {
          id: undefined,
        },
        province: {
          id: undefined,
        },
        temperature: "",
        // category: { id: '',},
        categoryId: "",
      },
      temperaturOptions: [
        {
          value: true,
          label: "Suhu",
        },
        {
          value: false,
          label: "Non Suhu",
        },
      ],
      statusOptions: ["Active", "Inactive"],
      listProvince: [],
      listEntity: [],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      this.loadData();
    } else {
      this.protectCreateWarehouse();
    }
    this.loadActiveProvince();
    this.loadActiveEntity();
  },
  validations: {
    warehouse: {
      mst_warehouse_entity_id: { required },
      mst_province_id: { required },
      name: { required },
      address: { required },
      temperature: { required },
      category_id: { required },
    },
  },
  methods: {
    protectCreateWarehouse() {
      $axiosMertrack.get(`/general/web?ApiName=WarehouseList`).then((res) => {
        let total_wh = res.data.total || 0;
        $axiosMertrack.get(`/general/web?ApiName=GetConfig`).then((res) => {
          if (res.data.data && res.data.data[0]) {
            if (res.data.data[0].total_wh <= total_wh) {
              this.$router.push({ path: `/oops` });
              return;
            }
          }
        });
      });
    },
    loadData() {
      let param = `ApiName=WarehouseList&Params={}&Id=${this.$route.params.id}&page=&limit=&searchText=`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data[0];
        this.warehouse = data;
      });
    },
    loadActiveProvince() {
      let param = `ApiName=ProvinceList`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data;
        for (const it of data) {
          this.listProvince.push({
            label: it.name,
            value: it.id,
          });
        }
        return;
      });
    },
    loadActiveEntity() {
      let param = `ApiName=WarehouseEntityList`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data;
        for (const it of data) {
          this.listEntity.push({
            label: it.name,
            value: it.id,
          });
        }
        return;
      });
    },
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let dataPost = {
        ApiName: this.$route.params.id ? "UpdateWarehouse" : "InsertWarehouse",
        Params: this.warehouse,
      };
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack.post(`general/web`, dataPost).then((result) => {
          this.$isLoading(false);
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : "Data has been saved succesfully ",
            type: res.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          if (!res.error) {
            this.items = [];
            dataPost = [];
            this.$router.back();
          }
        });
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>
