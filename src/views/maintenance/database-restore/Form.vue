<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <ButtonPermission
              :permission="'create'"
              @click="restore()"
              :buttonProperty="{
                size: 'sm',
                class: 'float-right',
                color: 'success',
                icon: 'file',
                text: 'Restore Now',
                tooltip: 'Restore Database from specific file',
              }"
            />
            <CRow>
              <CCol sm="4" lg="4">
                <h5>{{ $activeMenu.name }}</h5>
              </CCol>
              <CCol sm="8" lg="8">
                <CInputFile
                  :placeholder="fileName"
                  accept=".7z,.pgb"
                  custom
                  class="input-form-upload"
                  @change="uploadFile"
                />
              </CCol>
            </CRow>
          </CCardHeader>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const reader = new FileReader();
import 'vue2-datepicker/index.css';
import { CCard, CCol } from '@coreui/vue';
import { DatabaseRestore } from '../../../resource/BackupRestore';
export default {
  name: 'ConfigApplication',
  components: {},
  data() {
    return { file: null, fileName: '' };
  },
  mounted() {},
  methods: {
    uploadFile(files) {
      const file = files[0];
      console.log(file);

      if (!file) {
        this.file = null;
        this.fileName = '';
        return;
      }

      // Validasi ekstensi
      const allowed = ['.7z', '.pgb'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowed.includes(ext)) {
        this.$toast.open({
          message: 'Only .7z or .pgb files are allowed',
          type: 'error',
          position: 'top-right',
        });
        this.file = null;
        this.fileName = '';
        return;
      }

      this.file = file;
      this.fileName = file.name;
    },
    async restore() {
      if (!this.file) {
        this.$toast.open({
          message: 'Please select a backup file first!',
          type: 'error',
          position: 'top-right',
        });
        return;
      }

      try {
        let eksekusi = await DatabaseRestore(this.file); // pastikan axios request kirim multipart/form-data
        this.$toast.open({
          message: eksekusi.message,
          type: eksekusi.error ? 'error' : 'success',
          position: 'top-right',
          duration: 10000,
        });
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'error',
          position: 'top-right',
        });
      }
    },
  },
};
</script>
