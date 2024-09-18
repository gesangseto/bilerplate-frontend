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
                  v-model="data.gln"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      GLN
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <!-- IDENTITY PATH LOGO -->
              <CCol sm="10" lg="10">
                <CInputFile
                  :placeholder="labelLogo.identity"
                  horizontal
                  custom
                  class="input-form-upload"
                  @change="uploadLogo($event, 'identity')"
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
                  <label for="identity-logo"> </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <CImg width="100" v-bind:src="data.identity_logo_path" />
                  </div>
                </div>
              </div>
              <!-- Home LOGO -->
              <CCol sm="10" lg="10">
                <CInputFile
                  :placeholder="labelLogo.home"
                  horizontal
                  custom
                  class="input-form-upload"
                  @change="uploadLogo($event, 'home')"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">Home Logo</p>
                  </template>
                </CInputFile>
              </CCol>
              <div class="form-group row mb-5">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="home-logo"> </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <CImg width="100" v-bind:src="data.home_logo" />
                  </div>
                </div>
              </div>
              <!-- LOGIN LOGO -->
              <CCol sm="10" lg="10">
                <CInputFile
                  :placeholder="labelLogo.login"
                  horizontal
                  custom
                  class="input-form-upload"
                  @change="uploadLogo($event, 'login')"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">Login Logo</p>
                  </template>
                </CInputFile>
              </CCol>
              <div class="form-group row mb-5">
                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <label for="login-logo"> </label>
                </div>
                <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                  <div class="custom-file mb-3">
                    <CImg width="100" v-bind:src="data.login_logo" />
                  </div>
                </div>
              </div>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  Limitation
                </CCardHeader>
                <CCardBody>
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Warehouse"
                    v-model="data.total_wh"
                    :validasi="'numeric'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Department"
                    v-model="data.total_department"
                    :validasi="'numeric'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Section"
                    v-model="data.total_section"
                    :validasi="'numeric'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Config Layout"
                    v-model="data.total_conf_layout"
                    :validasi="'numeric'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Config Date"
                    v-model="data.total_conf_date"
                    :validasi="'numeric'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Android Device"
                    :validasi="'numeric'"
                    v-model="data.total_device"
                    :max="100"
                  />
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  List Android ID
                </CCardHeader>
                <CCardBody>
                  <div
                    v-for="(item, index) in parseInt(data.total_device)"
                    :key="item"
                  >
                    <InputDefault
                      :col="[3, 7]"
                      :title="'Android ID ' + (index + 1)"
                      :validasi="'alphanumeric'"
                      v-model="data.list_device[index]"
                      :max="100"
                    />
                  </div>
                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Authentication
                </CCardHeader>
                <CCardBody>
                  <InputDefault
                    :col="[3, 7]"
                    :title="'Login attempts exceeded'"
                    :validasi="'numeric'"
                    v-model="data.login_attempt"
                    :max="50"
                  />
                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Password Validation
                </CCardHeader>
                <CCardBody>
                  <CRow form class="form-group">
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="4" class="col-form-label">
                          Min Character
                        </CCol>
                        <CCol sm="8">
                          <CInput
                            horizontal
                            type="number"
                            v-model="data.password_pattern.min"
                            :is-valid="
                              data.password_pattern.max &&
                              data.password_pattern.min
                                ? parseInt(data.password_pattern.min) >
                                  parseInt(data.password_pattern.max)
                                  ? false
                                  : true
                                : true
                            "
                            invalid-feedback="Min value must smaller than Max value"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="4" class="col-form-label">
                          Max Character
                        </CCol>
                        <CCol sm="8">
                          <CInput
                            horizontal
                            type="number"
                            v-model="data.password_pattern.max"
                            :is-valid="
                              data.password_pattern.max &&
                              data.password_pattern.min
                                ? parseInt(data.password_pattern.min) >
                                  parseInt(data.password_pattern.max)
                                  ? false
                                  : true
                                : true
                            "
                            invalid-feedback="Max value must greater than Min value"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow form class="form-group">
                    <CCol sm="3">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Alphabet (Lower Case)
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.password_pattern.alphabet_lower"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="3">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Alphabet (Upper Case)
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.password_pattern.alphabet_upper"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="3">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Numeric
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.password_pattern.numeric"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="3">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Symbol
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.password_pattern.symbol"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">BPOM Config</CCardHeader>
                <CCardBody>
                  <CRow form class="form-group">
                    <CCol sm="12">
                      <InputDefault
                        :required="true"
                        :col="[3, 7]"
                        title="Latitude"
                        v-model="data.latitude"
                        :validasi="'float'"
                        :isValid="
                          initialLoad ? null : !data.latitude ? false : true
                        "
                      />
                    </CCol>
                    <CCol sm="12">
                      <InputDefault
                        :required="true"
                        :col="[3, 7]"
                        title="Longitude"
                        v-model="data.longitude"
                        :validasi="'float'"
                        :isValid="
                          initialLoad ? null : !data.longitude ? false : true
                        "
                      />
                    </CCol>

                    <CCol sm="12">
                      <InputDefault
                        :required="true"
                        :col="[3, 7]"
                        title="ID Location (BPOM)"
                        v-model="data.id_location"
                        :validasi="'numeric'"
                        :max="100"
                        :isValid="
                          initialLoad ? null : !data.id_location ? false : true
                        "
                        description="This value is named 'ID Sarana' is obtained from BPOM and is used for serial reporting to BPOM"
                      />
                    </CCol>

                    <CCol sm="12">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="3" class="col-form-label">
                          Advance BPOM Reporting
                        </CCol>
                        <CCol sm="9">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.advance_bpom_report"
                          />
                          <p
                            style="
                              font-size: smaller;
                              color: rgb(143, 143, 143);
                            "
                          >
                            This affects the report that will be generated for
                            BPOM purposes. If this value is true then all
                            aggregation processes will be generated. if the
                            value is false then the report is carried out during
                            production and during the picking list. This value
                            cannot change if there is already a transaction in
                            the bpom Queue
                          </p>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="12">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="3" class="col-form-label">
                          Return External Validation
                        </CCol>
                        <CCol sm="9">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.bpom_return_validation"
                          />
                          <p
                            style="
                              font-size: smaller;
                              color: rgb(143, 143, 143);
                            "
                          >
                            This function is still beta for validation
                            return-external
                          </p>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol sm="12">
                      <SelectOption
                        title="Return External Status"
                        :options="epcStatusOptions"
                        v-on:onchange="data.return_ext_status = $event"
                        :value="data.return_ext_status"
                        :col="[3, 7]"
                        description="Leave blank if status set to active"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  Archive Folder
                </CCardHeader>
                <CCardBody>
                  <CCol sm="10">
                    <CInput
                      label="Pre Inbound"
                      horizontal
                      v-model="data.folder_preinbound"
                    />
                  </CCol>
                  <CCol sm="10">
                    <CInput
                      label="Picking List"
                      horizontal
                      v-model="data.folder_pickinglist"
                    />
                  </CCol>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  Serial Config (Deprecated)
                </CCardHeader>
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
              <CCard>
                <CCardHeader style="font-weight: bold"
                  >Production Option</CCardHeader
                >
                <CCardBody>
                  <InputDefault
                    :col="[3, 7]"
                    title="Min. Count Generated Serial"
                    v-model="data.min_count_generated_serial"
                    :validasi="'numeric'"
                    :max="10000"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Additional EPC for ref Sample"
                    v-model="data.additional_serial_for_sample"
                    :validasi="'numeric'"
                    :max="10000"
                  />
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
                  description="This will determine the expiration date that is allowed to be sold"
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
                    <p style="font-size: smaller; color: rgb(143, 143, 143)">
                      If the value is true then when returning externally it is
                      allowed to return with the aggregation level (maximum
                      level 2)
                    </p>
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
import 'vue2-datepicker/index.css';
import $axiosMertrack from '../../../apiMertrack';
import moment from 'moment';
import { getMstEpcStatus } from '../../../resource/MstEpcStatus';
import { getSysConfig } from '../../../resource/SysConfig';
import { setConfig } from '../../../utils';
export default {
  name: 'ConfigApplication',
  components: {},
  data() {
    return {
      initialLoad: true,
      action: 'Edit',
      labelLogo: {
        identity: 'Choose file...',
        login: 'Choose file...',
        home: 'Choose file...',
      },
      epcStatusOptions: [],
      password_pattern: {
        min: null,
        max: null,
        alphabet_lower: false,
        alphabet_upper: false,
        numeric: false,
        symbol: false,
      },
      data: {
        Username: '',
        UserPassword: '',
        IdentityName: '',
        IdentityNumber: '',
        identity_logo_path: '',
        login_logo: '',
        home_logo: '',
        TotalWh: 0,
        total_device: 0,
        imei: '',
        // DbPwd: "",
        backup_frequent: '',
        sftp_folder_1: '',
        sftp_folder_2: '',
        sftp_folder_3: '',
        achived_folder_1: '',
        achived_folder_2: '',
        achived_folder_3: '',
        sscc_no_box_sn: '',
        sscc_no_box_non_sn: '',
        sscc_no_pallet_sn: '',
        sscc_no_pallet_non_sn: '',
        level_indicator_box_gtin: '',
        Latitude: '',
        Longitude: '',
        list_device: [],
        password_pattern: this.password_pattern,
      },
      devicesLooping: 0,
      periodicBackupOptions: [
        { value: 1, label: '1 Day' },
        { value: 7, label: '7 Day' },
        { value: 14, label: '14 Day' },
        { value: 30, label: '30 Day' },
      ],
      message: {
        errorAdmin: '',
        errorPassword: '',
        errorIdentity: '',
        errorLogo: '',
        errorTotalWarehouse: '',
        errortotal_device: '',
        errorImeiDevice: '',
        errorDatabasePassword: '',
        errorSftp1: '',
        errorSftp2: '',
        errorSftp3: '',
        errorAchived1: '',
        errorAchived2: '',
        errorAchived3: '',
        errorsscc_no_box_sn: '',
        errorsscc_no_box_non_sn: '',
        errorsscc_no_pallet_sn: '',
        errorsscc_no_pallet_non_sn: '',
        errorlevel_indicator_box_gtin: '',
      },
      statusOptions: ['Active', 'Inactive'],
    };
  },
  mounted() {
    this.loadConfig();
  },
  methods: {
    async loadConfig() {
      let _res = await getSysConfig();
      let epcStatus = await getMstEpcStatus({ is_final_status: true });
      if (_res) {
        let data = _res.data[0];
        this.data = {
          ...data,
          password_pattern: data.password_pattern
            ? JSON.parse(data.password_pattern)
            : this.password_pattern,
        };
        this.devicesLooping = data.total_device;
      }
      if (epcStatus) {
        this.epcStatusOptions = epcStatus.data.map((it) => {
          return { value: parseInt(it.id), label: it.name };
        });
      }
      return;
    },
    formatDate(date) {
      return moment(date).format('yyyy/MM/DD');
    },
    uploadLogo(event, type) {
      let file = event[0];
      if (file != undefined) {
        // this.data.logo.fileName = file.name;
        this.labelLogo[type] = file.name;
        this.convertToBase64(file, type);
        this.message.errorLogo = '';
      } else {
        this.labelLogo[type] = 'Choose file...';
        this.message.errorLogo = 'The logo file is required';
      }
    },
    convertToBase64(file, type) {
      reader.onload = (e) => {
        if (type == 'identity') this.data.identity_logo_path = e.target.result;
        else if (type == 'login') this.data.login_logo = e.target.result;
        else if (type == 'home') this.data.home_logo = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    validator(val) {
      return val ? val.length >= 4 : false;
    },
    formValidation() {
      let required = [
        'identity_name',
        'identity_number',
        'identity_logo_path',
        'entity_address',
      ];
      // Check Pattern
      if (this.data.password_pattern) {
        let patt = this.data.password_pattern;
        if (patt.min && patt.max) {
          if (parseInt(patt.min) > parseInt(patt.max)) {
            return false;
          }
        }
      }
      for (const it of required) {
        if (!this.data[it]) {
          return false;
        }
      }
      return true;
    },
    save() {
      this.initialLoad = false;
      if (!this.formValidation()) {
        this.$toast.open({
          message: 'Please complete all required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.message.errorlevel_indicator_box_gtin = '';
      for (var i = 0; i < this.data.total_device; i++) {
        if (!this.data.list_device[i]) {
          this.$toast.open({
            message: `Please input Android ID  ${i + 1}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
      }
      let total = this.data.total_device;
      this.data.list_device = this.data.list_device.slice(0, total);
      this.data.password_pattern = JSON.stringify(this.data.password_pattern);
      $axiosMertrack
        .post(`v3/configuration/application`, this.data)
        .then((result) => {
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : 'Data has been saved succesfully ',
            type: res.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          if (!res.error) {
            delete this.data.password_pattern;
            setConfig(this.data);
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
