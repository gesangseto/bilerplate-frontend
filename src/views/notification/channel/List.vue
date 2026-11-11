<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
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
            :items="reformatDatas"
            :status_code="'notification_channel'"
            :action="['read', 'update']"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { getNotificationChannel } from '../../../resource/NotificationChannel';

export default {
  name: 'NotificationChannel',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'code',
          label: 'Code',
          _classes: 'font-weight-bold',
        },
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'description',
          label: 'Description',
        },
        {
          key: 'status',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
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
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getNotificationChannel(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },
    rowUpdate(item) {
      this.$router.push({
        path: `/notification/channel/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `/notification/channel/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `/notification/channel/create`,
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
