<template>
  <div>
    <CModal
      centered="centered"
      size="lg"
      :show.sync="property.modal"
      title="Show Locking Pending Transaction"
      color="warning"
    >
      <CRow>
        <CCol md="6">
          <CInput
            horizontal
            v-model="property.item.no"
            label="Item No"
            readonly
          />
          <CInput
            horizontal
            v-model="property.item.batch_no"
            label="Batch No"
            readonly
          />
          <CInput horizontal v-model="property.item.nie" label="NIE" readonly />
          <CInput
            horizontal
            v-model="property.item.gtin_cp"
            label="GTIN / CP"
            readonly
          />
        </CCol>
        <CCol md="6">
          <CInput
            horizontal
            v-model="property.item.name"
            label="Product"
            readonly
          />
          <CInput
            horizontal
            v-model="property.item.expired_date"
            label="Exp Date"
            readonly
          />
          <CInput
            horizontal
            v-model="property.item.mfg_date"
            label="Mfg Date"
            readonly
          />
          <CInput
            horizontal
            v-model="property.item.serial"
            label="SN"
            readonly
          />
        </CCol>
      </CRow>
        <hr/>
      <CRow>
        <CCol md="12">
          <CDataTable
            hover
            striped
            border
            sorter
            :items="locked_item"
            :fields="locked_field"
            class="text-left"
            style="font-size: 12px"
          ></CDataTable>
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="property.modal = false" color="danger">
          <CIcon name="cil-ban" /> Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { capitalizeFirstLetter, convertTableName } from "../../utils";
import Table from '../base/Table.vue';
export default {
  components: { Table },
  name: "ShowLockedStatus",
  props: { property: Object},
  watch: {
    property: {
      deep: true,
      handler(n, o) {
        let datas=[];
        for(const it of this.property.item.locked){
          let data = it;
          data.trx_type = convertTableName(data.trx_type)
          datas.push(data)
        }
        this.locked_item = datas
      },
    },
  },
  mounted() {},
  data() {
    return {
      result: this.resetForm(),
      locked_item :[],
      locked_field:[
          { key: "id", label: "Trx ID" },
          { key: "trx_type", label: "Locking Pending Transaction" },
          { key: "quantity", label: "L1 Qty" },
        ]
    };
  },
  methods: {
    resetForm() {
      return {
        id: null,
        item: {},
      };
    },
  },
};
</script>
