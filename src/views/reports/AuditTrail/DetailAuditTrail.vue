<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>

          <CCardBody ref="content">
            <CForm>
              <CInput :disabled="true" horizontal v-model="data.id">
                <template #label>
                  <p class="col-form-label col-sm-3">ID</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.created_date">
                <template #label>
                  <p class="col-form-label col-sm-3">Date & Time</p>
                </template>
              </CInput>
              <CInput
                :disabled="true"
                horizontal
                v-model="data.created_full_name"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">User (Full Name)</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.path">
                <template #label>
                  <p class="col-form-label col-sm-3">Path</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.action">
                <template #label>
                  <p class="col-form-label col-sm-3">Method</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.ip_address">
                <template #label>
                  <p class="col-form-label col-sm-3">IP Address</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.user_agent">
                <template #label>
                  <p class="col-form-label col-sm-3">User Agent</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.status_desc">
                <template #label>
                  <p class="col-form-label col-sm-3">Status</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.message">
                <template #label>
                  <p class="col-form-label col-sm-3">Message</p>
                </template>
              </CInput>
              <div v-if="Object.keys(oldDataBody).length > 0">
                <hr />
                <hr />
                <h5>Old Data</h5>
                <hr />

                <div
                  v-for="(value, name, index) in oldDataBody"
                  :key="`${name}-${index}`"
                >
                  <!-- STRING / NUMBER -->
                  <CInput
                    v-if="
                      (!isImage(value) && typeof value === 'string') ||
                      typeof value === 'number'
                    "
                    disabled
                    horizontal
                    :value="value"
                  >
                    <template #label>
                      <p
                        class="col-form-label col-sm-3"
                        style="text-transform: capitalize"
                      >
                        {{ humanizeText(name) }}
                      </p>
                    </template>
                  </CInput>

                  <!-- IMAGE -->
                  <CRow v-else-if="isImage(value)">
                    <CCol md="3">
                      {{ humanizeText(name) }}
                    </CCol>
                    <CCol md="9">
                      <CImg width="100" :src="getImage(value)" />
                    </CCol>
                  </CRow>

                  <!-- ARRAY WITH DATA -->
                  <div v-else-if="Array.isArray(value) && value.length > 0">
                    <p>
                      {{ humanizeText(name) }}
                    </p>
                    <CDataTable
                      hover
                      striped
                      sorter
                      border
                      :items="value"
                      class="data-table"
                      style="font-size: 12px"
                    />
                  </div>

                  <!-- OBJECT (bukan array) -->
                  <CTextarea
                    v-else-if="
                      typeof value === 'object' &&
                      value !== null &&
                      !Array.isArray(value) &&
                      Object.keys(value).length > 0
                    "
                    disabled
                    horizontal
                    :value="JSON.stringify(value, null, 2)"
                    rows="5"
                  >
                    <template #label>
                      <p
                        class="col-form-label col-sm-3"
                        style="text-transform: capitalize"
                      >
                        {{ humanizeText(name) }}
                      </p>
                    </template>
                  </CTextarea>

                  <!-- EMPTY / NULL / UNDEFINED -->
                  <div v-else>
                    <!-- STRING / NUMBER -->
                    <CInput disabled horizontal :value="value">
                      <template #label>
                        <p
                          class="col-form-label col-sm-3"
                          style="text-transform: capitalize"
                        >
                          {{ humanizeText(name) }}
                        </p>
                      </template>
                    </CInput>
                  </div>
                </div>
              </div>
              <!-- DATA BARU -->
              <div v-if="Object.keys(dataBody).length > 0">
                <hr />
                <hr />
                <h5>
                  {{ Object.keys(oldDataBody).length > 0 ? 'New' : '' }} Data
                </h5>
                <hr />

                <div
                  v-for="(value, name, index) in dataBody"
                  :key="`${name}-${index}`"
                >
                  <div v-if="isJSONString(value)">
                    <CTextarea
                      disabled
                      horizontal
                      :value="formatJSONString(value)"
                      rows="5"
                    >
                      <template #label>
                        <p
                          class="col-form-label col-sm-3"
                          style="text-transform: capitalize"
                        >
                          {{ humanizeText(name) }}
                        </p>
                      </template>
                    </CTextarea>
                  </div>

                  <!-- STRING / NUMBER -->
                  <CInput
                    v-else-if="
                      (!isImage(value) && typeof value === 'string') ||
                      typeof value === 'number'
                    "
                    disabled
                    horizontal
                    :value="value"
                  >
                    <template #label>
                      <p
                        class="col-form-label col-sm-3"
                        style="text-transform: capitalize"
                      >
                        {{ humanizeText(name) }}
                      </p>
                    </template>
                  </CInput>

                  <!-- IMAGE -->
                  <CRow v-else-if="isImage(value)">
                    <CCol md="3">
                      {{ humanizeText(name) }}
                    </CCol>
                    <CCol md="9">
                      <CImg width="100" :src="getImage(value)" />
                    </CCol>
                  </CRow>

                  <!-- ARRAY ATAU OBJECT - Tampilkan di TextArea -->
                  <div v-else-if="shouldShowAsTextArea(value)">
                    <CTextarea
                      disabled
                      horizontal
                      :value="formatValue(value)"
                      :rows="getRows(value)"
                    >
                      <template #label>
                        <p
                          class="col-form-label col-sm-3"
                          style="text-transform: capitalize"
                        >
                          {{ humanizeText(name) }}
                        </p>
                      </template>
                    </CTextarea>
                  </div>

                  <!-- EMPTY / NULL / UNDEFINED -->
                  <div v-else>
                    <!-- STRING / NUMBER -->
                    <CInput disabled horizontal :value="value">
                      <template #label>
                        <p
                          class="col-form-label col-sm-3"
                          style="text-transform: capitalize"
                        >
                          {{ humanizeText(name) }}
                        </p>
                      </template>
                    </CInput>
                  </div>
                </div>
              </div>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <ButtonBack />
            <ButtonPermission
              exportType="pdf"
              :permission="'print'"
              @click="handleClickExport('pdf')"
            />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  capitalizeFirstLetter,
  cleanBase64Image,
  exportDataV3,
  handleBack,
  isBase64Image,
  humanize,
} from '../../../utils';
import $axiosMertrack from '../../../apiMertrack';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { CCol, CRow } from '@coreui/vue';

export default {
  name: 'DetailAuditTrail',
  watch: {
    customer: {
      deep: true,
      handler() {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initial_load: true,
      action: '',
      route_action: '',
      customer: { status: 'Active', tlp_alt: '', tlp: '' },

      data: {},
      detail: {},
      dataBody: {},
      oldDataBody: {},
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    shouldShowAsTextArea(value) {
      // Return true jika value adalah array atau object yang tidak kosong
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return false;
    }, // Format JSON string menjadi rapi
    formatJSONString(str) {
      try {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return str; // Return asli jika gagal parse
      }
    },
    formatValue(value) {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';

      if (Array.isArray(value)) {
        if (value.length === 0) return '[]';
        // Cek apakah ada object di dalam array
        const hasObject = value.some(
          (item) => typeof item === 'object' && item !== null,
        );
        return hasObject ? JSON.stringify(value, null, 2) : value.join(', ');
      }

      if (typeof value === 'object') {
        if (Object.keys(value).length === 0) return '{}';
        return JSON.stringify(value, null, 2);
      }

      return String(value);
    },

    getRows(value) {
      if (Array.isArray(value)) {
        return Math.min(Math.max(value.length, 3), 10);
      }
      if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        return Math.min(Math.max(keys.length, 3), 10);
      }
      return 5;
    },
    humanizeText(text) {
      if (typeof text === 'string') {
        return humanize(text);
      }
      return text;
    },
    isImage(string) {
      if (typeof string === 'string' && isBase64Image(string)) {
        return true;
      }
      return false;
    },
    getImage(string) {
      return cleanBase64Image(string);
    },
    loadData() {
      // let _data = get_log();
      // this.data = _data.find((x) => x.api_log_id === this.$route.params.id);
      // this.dataBody = this.data["val3"];
      // this.dataBody = JSON.parse(this.dataBody);
      // return;
      let url = `/v3/system/audit-trail?id=${this.$route.params.id}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.data = data;
        this.dataBody = JSON.parse(this.data['data']);
        this.oldDataBody = JSON.parse(this.data['old_data']) || {};
        console.log('dataBody', this.dataBody?.password_pattern);
      });
    }, // Cek apakah string adalah JSON valid
    isJSONString(str) {
      if (typeof str !== 'string') return false;
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object' && parsed !== null;
      } catch (e) {
        return false;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v3/system/audit-trail',
      });
    },
    // handleClickExport() {
    //   domtoimage
    //     .toPng(this.$refs.content, {
    //       width: 3508,
    //       height: 2480,
    //       style: {
    //         transform: 'scale(0.6)',
    //         'transform-origin': 'top left',
    //       },
    //     })
    //     .then(function (data) {
    //       var img = new Image();
    //       img.src = data;
    //       const doc = new jsPDF({
    //         orientation: 'portrait',
    //         format: 'a4',
    //       });
    //       doc.addImage(img, 'JPEG', 2, 0);
    //       const date = new Date();
    //       const filename =
    //         'showstatus_' +
    //         date.getFullYear() +
    //         ('0' + (date.getMonth() + 1)).slice(-2) +
    //         ('0' + date.getDate()).slice(-2) +
    //         ('0' + date.getHours()).slice(-2) +
    //         ('0' + date.getMinutes()).slice(-2) +
    //         ('0' + date.getSeconds()).slice(-2) +
    //         '.pdf';
    //       doc.save(filename);
    //     });
    // },
    cancel() {
      handleBack(this.$router, this.$route);
    },
  },
  computed: {
    // re_renderItems() {
    //   return this.dataBody.items.map((item) => {
    //     for (const key in item) {
    //       if (Array.isArray(item[key])) {
    //         item[key] = JSON.stringify(item[key], null, 4);
    //       }
    //     }
    //     return {
    //       ...item,
    //     };
    //   });
    // },
  },
};
</script>
