<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            v-if="can_create"
            :permission="'create'"
            @click="addNew()"
            :useHref="true"
          />
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="items"
            :action="['read', 'update', 'delete']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleRead="rowRead($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
        <CCardFooter>
          <div class="float-right">
            <ButtonPermission
              exportType="excel"
              :permission="'print'"
              @click="handleClickExport('xls')"
            />
            <ButtonPermission
              exportType="pdf"
              :permission="'print'"
              @click="handleClickExport('pdf')"
            />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { getMstCountry, deleteMstCountry } from '../../../resource/MstCountry';
import { exportDataV3 } from '../../../utils';

export default {
  name: 'ListCountry',
  data() {
    return {
      totalData: 0,
      items: [],
      can_create: true,
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'country_code', label: 'Country Code' },
        { key: 'currency_code', label: 'Currency Code' },
        { key: 'currency_symbol', label: 'Currency Symbol' },
        { key: 'status', label: 'Status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:17%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  watch: {
    $route: {
      deep: true,
      handler(route) {
        this.loadData(route.query);
      },
    },
  },
  mounted() {
    this.loadData(this.$route.query);
  },
  methods: {
    async loadData(filter = {}) {
      const result = await getMstCountry(filter);
      if (result && !result.error) {
        this.totalData = result.grand_total;
        this.items = result.data;
      }
    },
    addNew() {
      this.$router.push({ path: 'country/create' });
    },
    rowUpdate(item) {
      this.$router.push({ path: `country/update/${item.id}` });
    },
    rowRead(item) {
      this.$router.push({ path: `country/read/${item.id}` });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/master/country',
      });
    },
    async deleteRow(item) {
      const message = `You are about to delete this country (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (!confirm(message)) return;
      this.$isLoading(true);
      const result = await deleteMstCountry({ id: item.id });
      this.$isLoading(false);
      this.$toast.open({
        message: result?.error ? `${result.message}` : 'Data has been deleted successfully',
        type: result?.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!result?.error) this.loadData();
    },
  },
};
</script>
