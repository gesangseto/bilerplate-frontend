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
            <ButtonPermission
              :permission="'create'"
              @click="formData.modal = true"
              :buttonProperty="{
                size: 'sm',
                color: 'success',
                icon: 'file',
                text: 'Backup',
                tooltip: 'Backup Database',
              }"
            />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <!-- START REMARK MODAL -->
    <div>
      <CModal
        centered="centered"
        :show.sync="formData.modal"
        :title="`Create Backup`"
        color="danger"
      >
        <CRow>
          <CCol sm="12" md="12" lg="12">
            <TextareaDefault
              :rows="5"
              :col="[3, 8]"
              title="Remark"
              required
              v-model="formData.remark"
              :is-valid="formData.remark ? true : false"
            />
            <p>
              This will create a new backup of your database. The file will be
              saved in
              {{ appConfig.backup_path }}\{{
                formData.file_name
                  ? `${formData.file_name}.7z`
                  : `[default file name]`
              }}. Do you want to continue?
            </p>
          </CCol>
        </CRow>
        <template #footer>
          <CButton @click="backup()" color="success">
            <CIcon name="cil-check-circle" />
            Backup Now
          </CButton>
          <CButton @click="formData.modal = false" color="danger">
            <CIcon name="cil-ban" /> Cancel</CButton
          >
        </template>
      </CModal>
    </div>
    <!-- END REJECT MODAL -->
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
      formData: { file_name: null, remark: null, modal: false },
    };
  },
  mounted() {},
  methods: {
    async backup() {
      let eksekusi = await DatabaseBackup(this.formData);
      this.$toast.open({
        message: eksekusi.message.replace(/\n/g, '<br>'),
        type: eksekusi.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 10000,
      });
      if (!eksekusi.error) {
        this.formData.modal = false;
      }
      return;
    },
  },
};
</script>
