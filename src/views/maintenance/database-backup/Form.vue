<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }}</h5>
          </CCardHeader>
          <CCardBody>
            <InputDefault
              :col="[3, 7]"
              title="Backup File Name"
              v-model="formData.file_name"
              :description="`Leave blank if you want to use the default file name.`"
            />
          </CCardBody>
          <CCardFooter>
            <ButtonReason
              :property="formData"
              type="create"
              label="Remark"
              :reason.sync="formData.remark"
              :reason-required="true"
              @handleSubmit="backup($event)"
              :buttonProperty="{
                size: 'sm',
                color: 'success',
                icon: 'cilStorage',
                text: 'Backup',
                tooltip: 'Backup Database',
              }"
            />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CCard, CCardBody, CCol } from '@coreui/vue';
import { DatabaseBackup } from '../../../resource/BackupRestore';
import { getConfig } from '../../../utils';
export default {
  name: 'DatabaseBackup',
  components: {},
  data() {
    return {
      appConfig: getConfig(),
      initialLoad: true,
      action: 'Edit',
      formData: {
        file_name: null,
        file_prefix: null,
        remark: null,
        file_path: null,
      },
    };
  },
  mounted() {},
  methods: {
    async backup(payload) {
      const data = { ...this.formData, remark: payload?.reason };
      data.file_prefix = !data?.file_name
        ? `${this.appConfig?.backup_prefix}<default_name>`
        : ' ';
      data.file_path = this.appConfig?.backup_path;
      let eksekusi = await DatabaseBackup(data);
      this.$toast.open({
        message: eksekusi.message.replace(/\n/g, '<br>'),
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
