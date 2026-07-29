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
            <!-- Tabel jika yang dipilih adalah server -->
            <CRow v-if="formData.source == 'server'" class="mt-15">
              <CCol md="12" class="mb-3">Select File</CCol>

              <CCol md="12">
                <CCard>
                  <div class="sticky-table-container">
                    <table class="sticky-table">
                      <thead>
                        <tr>
                          <th style="text-align: center">Select</th>
                          <th style="text-align: center">File name</th>
                          <th style="text-align: center">Remark</th>
                          <th style="text-align: center">Create Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(item, index) in listFiles">
                          <tr
                            :style="
                              index % 2 == 0
                                ? 'background-color:#ffffff;'
                                : 'background-color:#ededed;'
                            "
                          >
                            <td :style="'text-align: center;'">
                              <CInputCheckbox
                                :key="index"
                                :checked="item.checked"
                                size="sm"
                                @change="handleSelectFile(index)"
                                style="margin-bottom: 30px; margin-top: 5px"
                              />
                            </td>
                            <td style="padding-left: 10px">
                              {{ item.name }}
                            </td>
                            <td
                              style="padding-left: 10px; white-space: pre-line"
                            >
                              {{ item.remarks }}
                            </td>
                            <td style="padding-left: 10px">
                              {{ item.Timestamp }}
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </CCard>
              </CCol>
            </CRow>
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
              rows="5"
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
import { CCard, CCol, CRow } from '@coreui/vue';
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
    handleSelectFile(selectedIndex) {
      let checked = null;
      // Merubah checkbox agar reactive
      this.listFiles = this.listFiles.map((row, i) => {
        let result = {
          ...row,
          checked: i === selectedIndex ? !row.checked : false,
        };
        if (result.checked) checked = true;
        return result;
      });
      // Jika ada check file maka masukan namanya ke FormData
      if (checked) {
        this.formData.file = this.listFiles[selectedIndex].path;
      } else {
        // Jika tidak ada check file maka hapus namanya di FormData
        this.formData.file = null;
      }
    },
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

<style scoped>
.has-border {
  border-top: 1px solid #000;
  font-weight: bold;
}
.table-container {
  /* max-height: 520px; */
  overflow-y: auto;
}
.sticky-table-container {
  max-height: 500px; /* atur tinggi sesuai kebutuhan */
  overflow-y: auto;
  display: block;
}

.table-container {
  /* max-height: 520px; */
  overflow-y: auto;
}
.sticky-table-container {
  max-height: 400px; /* atur tinggi sesuai kebutuhan */
  overflow-y: auto;
  display: block;
}

.sticky-table {
  width: 100%;
  border-collapse: collapse;
}

.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: #f9f9f9; /* opsional agar sticky terlihat */
  z-index: 2;
}
</style>
