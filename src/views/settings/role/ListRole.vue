<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
          <!-- <ButtonPermission :permission="'create'" @click="addNew()" /> -->
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :status_code="'mst_product'"
            :action="['read', 'update']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
            :filterAction="customActionFilter"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { getMstSectionRole } from '../../../resource/MstSectionRole';
import { getProfile } from '../../../utils';

export default {
  name: 'ListRole',

  mounted() {},
  data() {
    return {
      userInfo: getProfile(),
      totalData: 0,
      items: [],
      fields: [
        { key: 'section_name', label: 'Section' },
        {
          key: 'department_name',
          label: 'Department',
        },
        {
          key: 'status',
          label: 'Section Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:12%',
        },
      ],
    };
  },
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (!item.is_sys) {
        action.push('update');
      }
      if (this.userInfo && this.userInfo.user_id == 0) {
        action.push('update');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getMstSectionRole(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },
    rowUpdate(item) {
      this.$router.push({
        path: `role/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `role/read/${item.id}`,
      });
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>
