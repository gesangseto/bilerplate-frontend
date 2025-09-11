<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol sm="4" lg="4">
                <h5>{{ $activeMenu.name }}</h5>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <SelectOption
              title="Source"
              :options="[
                { value: 'server', label: 'Server' },
                { value: 'local', label: 'Local' },
              ]"
              v-on:onchange="formData.source = $event"
              :value="formData.source"
              :col="[3, 7]"
            />
            <SelectOption
              v-if="formData.source == 'server'"
              title="Select File"
              :options="listFiles"
              v-on:onchange="formData.file = $event"
              :value="formData.file"
              :description="getRemark()"
              :col="[3, 7]"
            />
            <CRow v-if="formData.source == 'local'">
              <CCol sm="3" lg="3"> Select File </CCol>
              <CCol sm="7" lg="7">
                <CInputFile
                  :placeholder="formData.file_name"
                  accept=".7z,.pgb"
                  custom
                  class="input-form-upload"
                  @change="uploadFile"
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <ButtonPermission
              :permission="'create'"
              @click="formData.modal = true"
              :buttonProperty="{
                size: 'sm',
                color: 'success',
                icon: 'file',
                text: 'Restore',
              }"
            />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <!-- START RESTORE MODAL -->
    <div>
      <CModal
        centered="centered"
        :show.sync="formData.modal"
        :title="`Restore`"
        color="danger"
      >
        <CRow>
          <CCol sm="12" md="12" lg="12">
            <TextareaDefault
              :col="[3, 8]"
              title="Remark"
              required
              v-model="formData.remark"
              :is-valid="formData.remark ? true : false"
            />
            <p>
              This action will restore your database from the selected backup
              file. Existing data may be overwritten. Do you want to continue?
            </p>
          </CCol>
        </CRow>
        <template #footer>
          <CButton @click="restore()" color="success">
            <CIcon name="cil-check-circle" />
            Restore Now
          </CButton>
          <CButton @click="formData.modal = false" color="danger">
            <CIcon name="cil-ban" /> Cancel</CButton
          >
        </template>
      </CModal>
    </div>
  </div>
</template>

<script>
const reader = new FileReader();
import 'vue2-datepicker/index.css';
import { CCard, CCol } from '@coreui/vue';
import {
  DatabaseRestore,
  getDatabaseBackup,
} from '../../../resource/BackupRestore';
export default {
  name: 'ConfigApplication',
  components: {},
  data() {
    return {
      file: null,
      formData: {
        file: null,
        file_name: null,
        file_path: null,
        source: null,
        remark: null,
        modal: false,
      },
      listFiles: [],
    };
  },
  mounted() {
    this.loadFileList();
  },
  methods: {
    async loadFileList() {
      let _res = await getDatabaseBackup();
      if (!_res.error) {
        let data = _res.data;
        this.listFiles = data.map((it) => {
          return { ...it, value: it.path, label: it.name };
        });
      }
    },
    getRemark() {
      let find = this.listFiles.find((it) => it.path === this.formData.file);
      if (!find) return '';
      return `Remarks: ${find.remarks}`;
    },
    uploadFile(files) {
      const file = files[0];
      if (!file) {
        this.formData.file = null;
        this.formData.file_name = '';
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
        this.formData.file = null;
        this.formData.file_name = '';
        return;
      }
      this.formData.file = file;
      this.formData.file_name = file.name;
    },
    async restore() {
      console.log(this.formData);

      if (!this.formData.file) {
        this.$toast.open({
          message: 'Please select a backup file first!',
          type: 'error',
          position: 'top-right',
        });
        return;
      }

      try {
        let eksekusi = await DatabaseRestore(this.formData); // pastikan axios request kirim multipart/form-data
        this.$toast.open({
          message: eksekusi.message.replace(/\n/g, '<br>'),
          type: eksekusi.error ? 'error' : 'success',
          position: 'top-right',
          duration: 10000,
        });
        if (!eksekusi.error) {
          this.formData.modal = false;
        }
      } catch (err) {
        this.$toast.open({
          message: err.message.replace(/\n/g, '<br>'),
          type: 'error',
          position: 'top-right',
        });
      }
    },
  },
};
</script>
