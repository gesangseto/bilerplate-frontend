<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <ButtonPermission
              :permission="'create'"
              @click="backup()"
              :buttonProperty="{
                size: 'sm',
                class: 'float-right',
                color: 'success',
                icon: 'file',
                text: 'Backup Now',
                tooltip: 'Backup Database to default folder',
              }"
            />
            <h5>{{ $activeMenu.name }}</h5>
          </CCardHeader>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CCard, CCol } from '@coreui/vue';
import { DatabaseBackup } from '../../../resource/BackupRestore';
export default {
  name: 'DatabaseBackup',
  components: {},
  data() {
    return {
      initialLoad: true,
      action: 'Edit',
    };
  },
  mounted() {},
  methods: {
    async backup() {
      let eksekusi = await DatabaseBackup();
      this.$toast.open({
        message: eksekusi.message,
        type: eksekusi.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 10000,
      });
      return;
    },
  },
};
</script>
