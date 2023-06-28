<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <h5>Configuration [EDIT]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CCol sm="10">
                <CInput
                  label="Entity Name"
                  horizontal
                  v-model="data.identity_name"
                  :is-valid="
                    initialLoad ? null : !data.identity_name ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Entity Name
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="10">
                <CTextarea
                  label="Entity Address"
                  horizontal
                  v-model="data.entity_address"
                  :is-valid="
                    initialLoad ? null : !data.entity_address ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Entity Address
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CTextarea>
              </CCol>
              <CCol sm="10">
                <CInput
                  label="GS1 Company Prefix"
                  horizontal
                  type="number"
                  v-model="data.identity_number"
                  :is-valid="
                    initialLoad ? null : !data.identity_number ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      GS1 Company Prefix
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="10">
                <CInput
                  label="ID Location"
                  horizontal
                  type="number"
                  v-model="data.id_location"
                  :is-valid="
                    initialLoad ? null : !data.id_location ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      ID Location (BPOM)
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="10">
                <CInput
                  label="Latitude"
                  horizontal
                  v-model="data.latitude"
                  :is-valid="initialLoad ? null : !data.latitude ? false : true"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Latitude
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="10">
                <CInput
                  label="Longitude"
                  horizontal
                  v-model="data.longitude"
                  :is-valid="
                    initialLoad ? null : !data.longitude ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Longitude
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="10" lg="10">
                <CInputFile
                  :placeholder="labelLogo"
                  horizontal
                  custom
                  class="input-form-upload"
                  @change="uploadLogo"
                  :is-valid="
                    initialLoad ? null : !data.identity_logo_path ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Identity Logo
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInputFile>
              </CCol>
              <div class="form-group row mb-5">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="logo-identity"> </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <CImg width="100" v-bind:src="data.identity_logo_path" />
                  </div>
                </div>
              </div>

              <CCol sm="10">
                <CInput
                  label="Maximum Warehouse"
                  horizontal
                  type="number"
                  v-model="data.total_wh"
                />
              </CCol>
              <CCol sm="10">
                <CInput
                  label="Maximum Android Device"
                  horizontal
                  type="number"
                  v-model="data.total_device"
                />
              </CCol>
              <CCard>
                <CCardHeader style="font-weight: bold">
                  List Android ID
                </CCardHeader>
                <CCardBody>
                  <div
                    v-for="(item, index) in parseInt(data.total_device)"
                    :key="item"
                    class="form-group row"
                  >
                    <CCol sm="10">
                      <CInput
                        :label="'Android ID ' + (index + 1)"
                        horizontal
                        v-model="data.list_device[index]"
                        :is-valid="
                          initialLoad
                            ? null
                            : !data.list_device[index]
                            ? false
                            : true
                        "
                      />
                    </CCol>
                  </div>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">SFTP Folder</CCardHeader>
                <CCardBody>
                  <CCol sm="10">
                    <CInput
                      label="SFTP Folder 1"
                      horizontal
                      v-model="data.sftp_folder_1"
                    />
                  </CCol>
                  <CCol sm="10">
                    <CInput
                      label="SFTP Folder 2"
                      horizontal
                      v-model="data.sftp_folder_2"
                    />
                  </CCol>
                  <CCol sm="10">
                    <CInput
                      label="SFTP Folder 3"
                      horizontal
                      v-model="data.sftp_folder_3"
                    />
                  </CCol>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  Archive Folder
                </CCardHeader>
                <CCardBody>
                  <CCol sm="10">
                    <CInput
                      label="Archive Folder 1"
                      horizontal
                      v-model="data.achived_folder_1"
                    />
                  </CCol>
                  <CCol sm="10">
                    <CInput
                      label="Archive Folder 2"
                      horizontal
                      v-model="data.achived_folder_2"
                    />
                  </CCol>
                  <CCol sm="10">
                    <CInput
                      label="Archive Folder 3"
                      horizontal
                      v-model="data.achived_folder_3"
                    />
                  </CCol>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold"
                  >Serial Config (Deprecated)</CCardHeader
                >
                <CCardBody>
                  <CCol sm="12">
                    <CInput
                      label=""
                      horizontal
                      type="number"
                      v-model="data.level_indicator_box_gtin"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">
                          GTIN Indicator - L2 - Box
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template></CInput
                    >
                  </CCol>
                  <CCol sm="12">
                    <CInput
                      label=""
                      horizontal
                      type="number"
                      v-model="data.sscc_no_box_sn"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">
                          SSCC Ext - L2 - Box (Serial)
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template></CInput
                    >
                  </CCol>
                  <CCol sm="12">
                    <CInput
                      label=""
                      horizontal
                      type="number"
                      v-model="data.sscc_no_box_non_sn"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">
                          SSCC Ext - L2 - Box (Non-Serial)
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template></CInput
                    >
                  </CCol>
                  <CCol sm="12">
                    <CInput
                      label=""
                      horizontal
                      type="number"
                      v-model="data.sscc_no_pallet_sn"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">
                          SSCC Ext - L3 - Pallet (Serial)
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template></CInput
                    >
                  </CCol>
                  <CCol sm="12">
                    <CInput
                      label=""
                      horizontal
                      type="number"
                      v-model="data.sscc_no_pallet_non_sn"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">
                          SSCC Ext - L3 - Pallet (Non-Serial)
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template></CInput
                    >
                  </CCol>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold"
                  >Transaction Option</CCardHeader
                >
                <CCardBody>
                  <CRow form class="form-group">
                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Allow Inbound Multiple Batch
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.allow_multiple_batch_inbound"
                          />
                        </CCol>
                      </CRow>
                    </CCol>

                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Return Record to Inbound
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.return_record_to_inbound"
                          />
                        </CCol>
                      </CRow>
                    </CCol>

                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Transfer Record to Outbound
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.transfer_record_to_outbound"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow form class="form-group">
                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Allow Transfer Multiple Batch
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.allow_multiple_batch_transfer"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Transfer Record to Inbound
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.transfer_record_to_inbound"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="4">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Return Record to Outbound
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.return_record_to_outbound"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCol sm="10">
                <CSelect
                  :options="periodicBackupOptions"
                  :value.sync="data.backup_frequent"
                  placeholder="--SELECT--"
                  label="Periodic Backups"
                  horizontal
                >
                </CSelect>
              </CCol>
              <CCol sm="10">
                <CInput
                  label=" Delivery Limit Before Expiry Date"
                  placeholder="Enter minimum L1 stock threshold"
                  type="number"
                  horizontal
                  v-model="data.delivery_day_limit"
                >
                  <template #append-content>Day's</template>
                </CInput>
              </CCol>

              <CCol sm="10">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Allow Return Aggregation
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="success"
                      :checked.sync="data.return_ext_aggregation"
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm="10">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Record Data for BPOM Report
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="success"
                      :checked.sync="data.report_bpom"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="save()">
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <CButton
              type="reset"
              size="sm"
              color="danger"
              class="m-1"
              @click="cancel()"
            >
              <CIcon name="cil-ban" />
              Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const reader = new FileReader();
import "vue2-datepicker/index.css";
import $axiosMertrack from "../../../apiMertrack";
import moment from "moment";
import { getSysConfig } from "../../../resource/SysConfig";
export default {
  name: "PackageForm",
  components: {},
  data() {
    return {
      initialLoad: true,
      action: "Edit",
      labelLogo: "Choose file...",
      data: {
        Username: "",
        UserPassword: "",
        IdentityName: "",
        IdentityNumber: "",
        logo: { fileName: "", fileContent: "" },
        identity_logo_path: "",
        TotalWh: 0,
        total_device: 0,
        imei: "",
        // DbPwd: "",
        backup_frequent: "",
        sftp_folder_1: "",
        sftp_folder_2: "",
        sftp_folder_3: "",
        achived_folder_1: "",
        achived_folder_2: "",
        achived_folder_3: "",
        sscc_no_box_sn: "",
        sscc_no_box_non_sn: "",
        sscc_no_pallet_sn: "",
        sscc_no_pallet_non_sn: "",
        level_indicator_box_gtin: "",
        Latitude: "",
        Longitude: "",
        list_device: [],
      },
      devicesLooping: 0,
      periodicBackupOptions: [
        { value: 1, label: "1 Day" },
        { value: 7, label: "7 Day" },
        { value: 14, label: "14 Day" },
        { value: 30, label: "30 Day" },
      ],
      message: {
        errorAdmin: "",
        errorPassword: "",
        errorIdentity: "",
        errorLogo: "",
        errorTotalWarehouse: "",
        errortotal_device: "",
        errorImeiDevice: "",
        errorDatabasePassword: "",
        errorSftp1: "",
        errorSftp2: "",
        errorSftp3: "",
        errorAchived1: "",
        errorAchived2: "",
        errorAchived3: "",
        errorsscc_no_box_sn: "",
        errorsscc_no_box_non_sn: "",
        errorsscc_no_pallet_sn: "",
        errorsscc_no_pallet_non_sn: "",
        errorlevel_indicator_box_gtin: "",
      },
      statusOptions: ["Active", "Inactive"],
    };
  },
  mounted() {
    this.loadConfig();
  },
  methods: {
    async loadConfig() {
      let _res = await getSysConfig();
      if (_res) {
        let data = _res.data[0];
        this.data = data;
        this.devicesLooping = data.total_device;
      }
      return;
    },
    formatDate(date) {
      return moment(date).format("yyyy/MM/DD");
    },
    uploadLogo(event) {
      let file = event[0];
      if (file != undefined) {
        // this.data.logo.fileName = file.name;
        this.labelLogo = file.name;
        this.convertToBase64(file);
        this.message.errorLogo = "";
      } else {
        this.labelLogo = "Choose file...";
        this.message.errorLogo = "The logo file is required";
      }
    },
    convertToBase64(file) {
      reader.onload = (e) => {
        this.data.identity_logo_path = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    validator(val) {
      return val ? val.length >= 4 : false;
    },
    formValidation() {
      let required = [
        "identity_name",
        "identity_number",
        "identity_logo_path",
        "entity_address",
      ];
      for (const it of required) {
        if (!this.data[it]) {
          this.$toast.open({
            message: "Please complete all required data",
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          return false;
        }
      }
      return true;
    },
    save() {
      this.initialLoad = false;
      if (!this.formValidation()) {
        return;
      }
      this.message.errorlevel_indicator_box_gtin = "";
      for (var i = 0; i < this.data.total_device; i++) {
        if (!this.data.list_device[i]) {
          this.$toast.open({
            message: `Please input Android ID  ${i + 1}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          return;
        }
      }
      let total = this.data.total_device;
      this.data.list_device = this.data.list_device.slice(0, total);
      $axiosMertrack
        .post(`v3/configuration/application`, this.data)
        .then((result) => {
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : "Data has been saved succesfully ",
            type: res.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          if (!res.error) {
            this.$router.back();
          }
        });
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>
