<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader>
            <strong>Edit Configuration</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div class="form-group row"></div>
              <!-- <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="password">
                    Password <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="password"
                    v-model="configuration.UserPassword"
                    id="password"
                    class="form-control"
                    placeholder="Enter Your Password"
                    autocomplete="off"
                  />
                  <label
                    id="error-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorPassword }}
                  </label>
                </div>
              </div> -->
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="identity">
                    Identity Name <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.identity_name"
                    id="identity"
                    class="form-control"
                    placeholder="Enter Your Identity Name"
                    autocomplete="off"
                  />
                  <label
                    id="error-identity"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorIdentity }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="identity">
                    Identity Number <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.identity_number"
                    id="identity"
                    class="form-control"
                    placeholder="Enter Your Identity Name"
                    autocomplete="off"
                  />
                  <label
                    id="error-identity"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorIdentity }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="identity">
                    Latitude <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.latitude"
                    id="identity"
                    class="form-control"
                    placeholder="Enter Your Latitude"
                    autocomplete="off"
                  />
                  <label
                    id="error-identity"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorLatitude }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="identity">
                    Longitude <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.longitude"
                    id="identity"
                    class="form-control"
                    placeholder="Enter Your Longitude"
                    autocomplete="off"
                  />
                  <label
                    id="error-identity"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorLongitude }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="logo-identity">
                    Identity Logo <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <input
                      type="file"
                      class="custom-file-input"
                      id="logo"
                      required
                      @change="uploadLogo"
                    />
                    <label
                      id="label-name-file"
                      class="custom-file-label"
                      for="logo"
                      >{{ labelLogo }}</label
                    >
                    <label
                      id="error-logo"
                      class="text-danger"
                      style="font-size: 12px; font-weight: bolder"
                    >
                      {{ message.errorLogo }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group row mb-5">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="logo-identity"> </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <CImg
                      width="100"
                      v-bind:src="configuration.identity_logo_path"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="total-warehouse">
                    Total Warehouse <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    v-model="configuration.total_wh"
                    id="total-warehouse"
                    class="form-control"
                  />
                  <label
                    id="error-total-warehouse"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorTotalWarehouse }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="total-device">
                    Total Device <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    v-model="configuration.total_device"
                    id="total-device"
                    class="form-control"
                    @change="updatetotal_devices"
                  />
                  <label
                    id="error-total-device"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errortotal_device }}
                  </label>
                </div>
              </div>
              <div
                v-for="device in devicesLooping"
                :key="device"
                class="form-group row"
              >
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="total-device">
                    Android ID {{ device
                    }}<strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <!-- <textarea class="form-control" placeholder="Enter IMEI Device" v-model="configuration.imei" autocomplete="off" rows="4" ></textarea> -->
                  <input
                    type="text"
                    min="0"
                    max="100"
                    placeholder="Enter Android ID"
                    v-model="AndroidId[device - 1]"
                    autocomplete="off"
                    class="form-control"
                  />
                  <label
                    id="error-total-device"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorImeiDevice }}
                  </label>
                </div>
              </div>
              <!-- <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-password">
                    Database SA Password <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="password"
                    v-model="configuration.DbPwd"
                    id="database-password"
                    class="form-control"
                    placeholder="Enter Your Database Password"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorDatabasePassword }}
                  </label>
                </div>
              </div> -->
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    Periodic Backups <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <CSelect
                    :options="periodicBackupOptions"
                    :value.sync="configuration.backup_frequent"
                    placeholder="--SELECT--"
                  >
                  </CSelect>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SFTP Folder 1 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sftp_folder_1"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SFTP Folder 1"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorSftp1 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SFTP Folder 2 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sftp_folder_2"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SFTP Folder 2"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorSftp2 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SFTP Folder 3 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sftp_folder_3"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SFTP Folder 3"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorSftp3 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    Achived Folder 1 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.achived_folder_1"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your Achived Folder 1"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorAchived1 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    Achived Folder 2 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.achived_folder_2"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your Achived Folder 2"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorAchived2 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    Achived Folder 3 <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.achived_folder_3"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your Achived Folder 3"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorAchived3 }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="">
                    GTIN Level Indicator Box
                    <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.level_indicator_box_gtin"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your GTIN Level Indicator Box"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.errorlevel_indicator_box_gtin }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SSCC No Box Serial <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sscc_no_box_sn"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SSCC No Box Serial"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.sscc_no_box_sn }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SSCC No Box Non-Serial
                    <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sscc_no_box_non_sn"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SSCC No Box Non-Serial"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.sscc_no_box_non_sn }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SSCC No Pallet Serial <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sscc_no_pallet_sn"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SSCC No Pallet Serial"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.sscc_no_pallet_sn }}
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="database-backup">
                    SSCC No Pallet NS
                    <strong class="text-danger">*</strong>
                  </label>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <input
                    type="text"
                    v-model="configuration.sscc_no_pallet_non_sn"
                    class="form-control"
                    autocomplete="off"
                    placeholder="Enter Your SSCC No Pallet NS"
                  />
                  <label
                    id="error-datebase-password"
                    class="text-danger"
                    style="font-size: 12px; font-weight: bolder"
                  >
                    {{ message.sscc_no_pallet_non_sn }}
                  </label>
                </div>
              </div>
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
export default {
  name: "PackageForm",
  components: {},
  data() {
    return {
      action: "Edit",
      labelLogo: "Choose file...",
      configuration: {
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
        AndroidDevices: [],
      },
      devicesLooping: 0,
      AndroidId: [],
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
    loadConfig() {
      let param = `ApiName=GetConfig&Params={}&Id=&page=&limit=&searchText=`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data[0];
        this.configuration = data;
        this.devicesLooping = data.total_device;
        for (const it of data.devices) {
          this.AndroidId.push(it.android_id);
        }
      });
      return;
    },
    formatDate(date) {
      return moment(date).format("yyyy/MM/DD");
    },
    uploadLogo(event) {
      let file = event.target.files[0];
      if (file != undefined) {
        // this.configuration.logo.fileName = file.name;
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
        this.configuration.identity_logo_path = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    validator(val) {
      return val ? val.length >= 4 : false;
    },
    updatetotal_devices() {
      this.devicesLooping = parseInt(this.configuration.total_device);
    },
    save() {
      if (!this.configuration.level_indicator_box_gtin) {
        return (this.message.errorlevel_indicator_box_gtin =
          "This must have value");
      }
      this.message.errorlevel_indicator_box_gtin = "";
      this.configuration.AndroidDevices = [];
      for (var i = 0; i < this.devicesLooping; i++) {
        if (!this.AndroidId[i]) {
          this.$toast.open({
            message: `Please input Android ID  ${i + 1}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          return;
        }
        this.configuration.AndroidDevices.push({
          AndroidId: this.AndroidId[i],
        });
      }
      let devices = [];
      for (const it of this.AndroidId) {
        devices.push({ android_id: it });
      }
      this.configuration.devices = devices;
      let dataPost = {
        ApiName: "UpdateConfig",
        Params: this.configuration,
      };
      $axiosMertrack.post(`general/web`, dataPost).then((result) => {
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
          this.items = [];
          dataPost = [];
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
