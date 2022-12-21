<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>
              Audit Trail [{{ route_action }}]
              <ButtonPermission
                exportType="pdf"
                :permission="'print'"
                @click="handleClickExport('pdf')"
              />
            </h5>
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
                  <p class="col-form-label col-sm-3">Date</p>
                </template>
              </CInput>
              <CInput
                :disabled="true"
                horizontal
                v-model="data.created_full_name"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Access By</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.path">
                <template #label>
                  <p class="col-form-label col-sm-3">Path</p>
                </template>
              </CInput>
              <CInput :disabled="true" horizontal v-model="data.type">
                <template #label>
                  <p class="col-form-label col-sm-3">Type</p>
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
              <div v-if="Object.keys(dataBody).length > 0">
                <hr />
                <hr />
                <h5>Data</h5>
                <hr />
                <div v-for="(value, name, index) in dataBody" :key="index">
                  <!-- VIEW JIKA KARAKTERNYA NORMAL -->
                  <CInput
                    v-if="!Array.isArray(value) && value && value.length <= 100"
                    disabled
                    horizontal
                    :value="value"
                  >
                    <template #label>
                      <p
                        class="col-form-label col-sm-3"
                        style="text-transform: capitalize"
                      >
                        {{ name === "id" ? "ID" : name.replace(/_/g, " ") }}
                      </p>
                    </template>
                  </CInput>
                  <!-- VIEW JIKA KARAKTERNYA TERLALU BANYAK -->
                  <CTextarea
                    v-if="!Array.isArray(value) && value && value.length > 100"
                    disabled
                    horizontal
                    :value="value"
                    rows="10"
                  >
                    <template #label>
                      <p
                        class="col-form-label col-sm-3"
                        style="text-transform: capitalize"
                      >
                        {{ name === "id" ? "ID" : name.replace(/_/g, " ") }}
                      </p>
                    </template>
                  </CTextarea>
                  <p v-if="Array.isArray(value) && value.length > 0">Items</p>
                  <CDataTable
                    v-if="Array.isArray(value) && value.length > 0"
                    hover
                    striped
                    sorter
                    border
                    :items="re_renderItems"
                    class="text-left"
                    style="font-size: 12px"
                  />
                </div>
              </div>
              <div v-if="Object.keys(detail).length > 0">
                <hr />
                <hr />
                <h5>Updating details</h5>
                <table width="100%" class="table table-hover">
                  <thead style="font-weight: bold">
                    <tr>
                      <td>Name</td>
                      <td>Before</td>
                      <td>After</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(itm, name, index) in detail" :key="index">
                      <td>{{ name }}</td>
                      <td>{{ itm.old_value }}</td>
                      <td>{{ itm.new_value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton size="sm" class="m-1" color="danger" @click="cancel()">
              <CIcon name="cil-ban" /> Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from "../../../utils";
import $axiosMertrack from "../../../apiMertrack";
import { get_log } from "../../../dummy_data";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

export default {
  name: "DetailAuditTrail",
  watch: {
    customer: {
      deep: true,
      handler(n, o) {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initial_load: true,
      action: "",
      route_action: "",
      customer: { status: "Active", tlp_alt: "", tlp: "" },

      data: {},
      detail: {},
      dataBody: {},
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
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
        this.dataBody = JSON.parse(this.data["data"]);
        // this.detail = this.data["detail"];
      });
    },
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    handleClickExport() {
      domtoimage
        .toPng(this.$refs.content, {
          width: 3508,
          height: 2480,
          style: {
            transform: "scale(0.6)",
            "transform-origin": "top left",
          },
        })
        .then(function (data) {
          var img = new Image();
          img.src = data;
          const doc = new jsPDF({
            orientation: "portrait",
            format: "a4",
          });
          doc.addImage(img, "JPEG", 2, 0);
          const date = new Date();
          const filename =
            "showstatus_" +
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2) +
            ".pdf";
          doc.save(filename);
        });
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    re_renderItems() {
      return this.dataBody.items.map((item) => {
        for (const key in item) {
          if (Array.isArray(item[key])) {
            item[key] = JSON.stringify(item[key], null, 4);
          }
        }
        return {
          ...item,
        };
      });
    },
  },
};
</script>
