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
              <!-- Licensed Entity Information -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Licensed Entity Information
                </CCardHeader>
                <CCardBody>
                  <!-- COMPANY INFORMATION -->
                  <p style="font-weight: bold">Company Information</p>
                  <InputDefault
                    :col="[3, 7]"
                    title="Entity Name"
                    v-model="data.identity_name"
                  />
                  <TextareaDefault
                    :col="[3, 7]"
                    title="Entity Address"
                    v-model="data.entity_address"
                  />
                  <!-- GS1 INFORMATION -->
                  <p style="font-weight: bold">GS1 Information</p>
                  <InputDefault
                    :col="[3, 7]"
                    title="GS1 Company Prefix"
                    v-model="data.identity_number"
                    :validasi="'integer'"
                    :max="12"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="GLN"
                    v-model="data.gln"
                    :validasi="'integer'"
                    :max="100"
                  />
                </CCardBody>
              </CCard>

              <!-- Licensed Features & Limits -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Licensed Features & Limits
                </CCardHeader>
                <CCardBody>
                  <!-- License Limits -->
                  <p style="font-weight: bold">License Limits</p>
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Warehouse"
                    v-model="data.total_wh"
                    :validasi="'integer'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Department"
                    v-model="data.total_department"
                    :validasi="'integer'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Section"
                    v-model="data.total_section"
                    :validasi="'integer'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Label Layout"
                    v-model="data.total_conf_layout"
                    :validasi="'integer'"
                    :max="100"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Date Format"
                    v-model="data.total_conf_date"
                    :validasi="'integer'"
                    :max="100"
                  />
                  <p style="font-weight: bold">
                    MERTRACK Warehouse Mobile (MWM) Devices
                  </p>
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum MWM Devices"
                    :validasi="'integer'"
                    v-model="data.total_device"
                    :max="100"
                  />
                  <div
                    v-for="(item, index) in parseInt(data.total_device)"
                    :key="item"
                  >
                    <InputDefault
                      :col="[3, 7]"
                      :title="'MWM Device ID #' + (index + 1)"
                      :validasi="'alphanumeric'"
                      v-model="data.list_device[index]"
                      :max="100"
                    />
                  </div>
                </CCardBody>
              </CCard>

              <!-- Authentication & Security Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Authentication & Security Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Authentication Rules</p>
                  <InputDefault
                    :col="[3, 7]"
                    :title="'Maximum Consecutive Failed Login Attempts'"
                    :validasi="'integer'"
                    v-model="data.login_attempt"
                    :max="50"
                  />

                  <p style="font-weight: bold">Password Policy</p>
                  <InputDefault
                    :col="[3, 7]"
                    title="Minimum Length"
                    :validasi="'integer'"
                    v-model="data.password_pattern.min"
                    :is-valid="
                      data.password_pattern.max && data.password_pattern.min
                        ? parseInt(data.password_pattern.min) >
                          parseInt(data.password_pattern.max)
                          ? false
                          : true
                        : true
                    "
                    invalid_feedback="Min value must smaller than Max value"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Maximum Length"
                    :validasi="'integer'"
                    v-model="data.password_pattern.max"
                    :is-valid="
                      !data.password_pattern
                        ? null
                        : data.password_pattern.max && data.password_pattern.min
                        ? parseInt(data.password_pattern.min) >
                          parseInt(data.password_pattern.max)
                          ? false
                          : true
                        : true
                    "
                    invalid_feedback="Max value must greater than Min value"
                  />

                  <CRow form class="form-group">
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="6" class="col-form-label">
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
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="6" class="col-form-label">
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
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="6" class="col-form-label">
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
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="6" class="col-form-label">
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
                  <p style="font-weight: bold">Initial Password Settings</p>
                  <InputDefault
                    :col="[3, 7]"
                    title="Default Password User"
                    v-model="data.password_default"
                    :is-valid="data.password_default ? true : null"
                    description="This password will be assigned to new user accounts or when resetting a user's password"
                  />
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Enforce Password Change on First Login or After Password
                      Reset
                    </CCol>
                    <CCol sm="7">
                      <SwitchDefault
                        :default_value="data.password_must_change"
                        v-on:onChange="data.password_must_change = $event"
                        :description="
                          data.password_must_change
                            ? `Users are required to change their password upon first login after account creation or a password reset.`
                            : null
                        "
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <!-- General System Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  General System Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Pictures</p>
                  <!-- Identity Logo -->
                  <CCol sm="10" lg="10">
                    <CInputFile
                      :placeholder="labelLogo.identity"
                      horizontal
                      custom
                      class="input-form-upload"
                      @change="uploadLogo($event, 'identity')"
                    >
                      <template #label>
                        <p class="col-form-label col-sm-3">Home Page Picture</p>
                      </template>
                    </CInputFile>
                  </CCol>
                  <!-- identity_logo_path -->
                  <div class="form-group row mb-5">
                    <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                      <label for="identity-logo"> </label>
                    </div>
                    <div class="col-md-7 col-sm-7 col-lg-7 custom-file">
                      <div class="custom-file mb-3">
                        <CImg
                          width="100"
                          v-bind:src="data.identity_logo_path"
                        />
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

                  <p style="font-weight: bold">Long Process Settings</p>
                  <SelectOption
                    title="Retry Interval"
                    :options="listCron"
                    v-on:onchange="data.retry_interval = $event"
                    :value="data.retry_interval"
                    :col="[3, 7]"
                  />
                  <p style="font-weight: bold">Notification Settings</p>

                  <strong>
                    <CIcon name="cib-whatsapp" /> &nbsp; Whatsapp
                  </strong>
                  <br />
                  <small>{{ whatsappStatus.message }}</small>
                  <hr />
                  <CForm v-if="!whatsappStatus.error"
                    ><CCol class="md-4">
                      <img
                        v-bind:src="whatsappStatus.qr_base64"
                        style="width: 150px; heigth: auto"
                      />
                    </CCol>
                  </CForm>
                  <CForm v-if="whatsappStatus.error">
                    <InputDefault
                      :col="[3, 7]"
                      :title="'To'"
                      :validasi="'integer'"
                      v-model="whatsappMessage.to"
                      :max="14"
                    />
                    <InputDefault
                      :col="[3, 7]"
                      :title="'Message'"
                      v-model="whatsappMessage.message"
                      :max="200"
                    />
                    <CButton size="sm" color="success" @click="sendWhatsapp()">
                      Send Test Message
                    </CButton>
                    <CButton
                      class="ml-1"
                      size="sm"
                      color="danger"
                      @click="deleteWhatsapp()"
                    >
                      Delete Session
                    </CButton>
                    <br />
                    <small
                      :class="
                        whatsappMessage.error ? 'text-danger' : 'text-muted'
                      "
                    >
                      {{ whatsappMessage.response }}
                    </small>
                  </CForm>
                </CCardBody>
              </CCard>
              <!-- Production Module Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Production Module Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Process Order</p>
                  <SelectOption
                    title="Expiry Date Calculation Rule"
                    :options="listExpiryType"
                    v-on:onchange="data.expiry_type = $event"
                    :value="data.expiry_type"
                    :col="[3, 7]"
                    :description="expiryDescription()"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Minimum Generated SN"
                    v-model="data.min_count_generated_serial"
                    :validasi="'integer'"
                    :max="10000"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Additional SNs for Ref. Sample"
                    v-model="data.additional_serial_for_sample"
                    :validasi="'integer'"
                    :max="10000"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="SN Pattern"
                    v-model="data.serial_pattern"
                  />
                </CCardBody>
              </CCard>

              <!-- Warehouse Module Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  Warehouse Module Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Transaction Settings</p>
                  <CRow form class="form-group">
                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Create Inbound on Transfer Completion
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

                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Create Outbound on Transfer Completion
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

                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Create Inbound on Return Completion
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

                    <CCol sm="6">
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Create Outbound on Return Completion
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

                  <InputDefault
                    :col="[3, 7]"
                    title="Minimum Remaining Shelf Life for Picking"
                    v-model="data.delivery_day_limit"
                    :validasi="'integer'"
                    :max="10000"
                    description="Products must have at least the specified number of days before expiry to be eligible for picking."
                  />
                  <CCol sm="12"> </CCol>
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Allow Aggregated Packaging L2 on Return External
                    </CCol>
                    <CCol sm="9">
                      <CSwitch
                        class="mr-1"
                        color="success"
                        :checked.sync="data.return_ext_aggregation"
                      />
                      <p style="font-size: smaller; color: rgb(143, 143, 143)">
                        When enabled, the system accepts external return items
                        in aggregated packaging (level 2). When disabled, only
                        unit-level packaging (level 1) is allowed.
                      </p>
                    </CCol>
                    <CCol sm="12">
                      <SelectOption
                        title="EPC Status After Return External"
                        :options="epcStatusOptions"
                        v-on:onchange="data.return_ext_status = $event"
                        :value="data.return_ext_status"
                        :col="[3, 7]"
                        description="If left blank, the default status Active will be applied."
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
              <!-- Warehouse Module Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold">
                  BPOM TTAC Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">
                    BPOM TTAC Registration Information
                  </p>

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
                  <InputDefault
                    :required="true"
                    :col="[3, 7]"
                    title="ID Sarana"
                    v-model="data.id_location"
                    :validasi="'integer'"
                    :max="100"
                    :isValid="
                      initialLoad ? null : !data.id_location ? false : true
                    "
                    description="'ID Sarana' as registered in the BPOM TTAC system, used for reporting Track & Trace data."
                  />
                  <p style="font-weight: bold">BPOM TTAC Reporting Settings</p>

                  <CRow form class="form-group">
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
                            Determines how the system generates reports to the
                            BPOM TTAC system. When enabled, all reportable
                            transactions include aggregated packaging data, and
                            any changes to aggregation or serial operations will
                            trigger TTAC reports. When disabled, production
                            reports after Transfer include only level 1
                            serialization (primary barcode). In distribution
                            reports, the system registers relevant aggregation
                            from the Picking List and reports the corresponding
                            aggregated barcodes sent to the customer. Important:
                            Before changing this setting, all pending reports in
                            the BPOM Queue must be completed.
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
                            When enabled, the system will validate barcodes of
                            returned items against the BPOM TTAC system during
                            the first approval of an External Return
                            transaction. When disabled, validation will rely
                            solely on the internal system database.
                          </p>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader style="font-weight: bold">
                  Archive Folder
                </CCardHeader>
                <CCardBody>
                  <InputDefault
                    :col="[3, 7]"
                    title="Pre Inbound"
                    v-model="data.folder_preinbound"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    title="Picking List"
                    v-model="data.folder_pickinglist"
                  />
                </CCardBody>
              </CCard>

              <CCol sm="10"> </CCol>
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
import {
  getWhatsappQr,
  sendWhatsappMessage,
  deleteWhatsappSession,
} from '../../../resource/Whatsapp';
import { setConfig } from '../../../utils';
import { getConfCron } from '../../../resource/ConfCron';
import { CCard, CCol } from '@coreui/vue';
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
      whatsappStatus: { error: false, message: null, qr_base64: null },
      whatsappMessage: {
        to: null,
        message: null,
        response: null,
        error: false,
      },

      data: {
        password_must_change: false, // Nilai awal,
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
        password_pattern: this.initial_password_pattern(),
      },
      devicesLooping: 0,
      periodicBackupOptions: [
        { value: 1, label: '1 Day' },
        { value: 7, label: '7 Day' },
        { value: 14, label: '14 Day' },
        { value: 30, label: '30 Day' },
      ],
      listExpiryType: [
        {
          value: 'one_day_before',
          label: 'One Day Before the day of Mfg Date',
          description:
            'Expiry date falls on one day before the day of Mfg Date',
        },
        {
          value: 'same_day',
          label: 'Same Day as the Day of Mfg Date',
          description: 'Expiry date retains the original day value.',
        },
        {
          value: 'start_of_month',
          label: 'Start Of Month',
          description: 'Expiry date falls on the first day of the month',
        },
        {
          value: 'end_of_month',
          label: 'End Of Moth',
          description: 'Expiry date falls on the last day of the month',
        },
        {
          value: 'adjusted_eom',
          label: 'Mid-Month Adjustment (15th Day to EoM)',
          description:
            'If the manufacturing date is before the 15th, subtract 1 month and set expiry to the end of that month',
        },
      ],
      listCron: [],
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
    this.loadEpcStatus();
    this.loadCron();
    this.loadWhatsapp();
  },
  methods: {
    initial_password_pattern() {
      return {
        min: null,
        max: null,
        alphabet_lower: false,
        alphabet_upper: false,
        numeric: false,
        symbol: false,
      };
    },
    async loadConfig() {
      let _res = await getSysConfig();
      if (_res) {
        let data = _res.data[0];
        let pattern = data.password_pattern;
        this.data = {
          ...data,
          return_ext_aggregation: data.return_ext_aggregation ? true : false,
          password_pattern: pattern
            ? JSON.parse(pattern)
            : this.initial_password_pattern(),
        };
        this.devicesLooping = data.total_device;
      }
      return;
    },
    expiryDescription() {
      let thisExpiry = this.listExpiryType.find(
        (it) => it.value == this.data.expiry_type
      );
      if (thisExpiry) {
        return thisExpiry.description;
      } else {
        return 'Expiry date retains the original day value.';
      }
    },
    async loadEpcStatus() {
      let epcStatus = await getMstEpcStatus({ is_final_status: true });
      if (epcStatus) {
        this.epcStatusOptions = epcStatus.data.map((it) => {
          return { value: parseInt(it.id), label: it.name };
        });
      }
      return;
    },
    async loadCron() {
      let cron = await getConfCron();
      if (cron) {
        this.listCron = cron.data.map((it) => {
          return { value: it.cron, label: it.name };
        });
      }
      return;
    },
    async sendWhatsapp() {
      let _res = await sendWhatsappMessage(this.whatsappMessage);
      if (_res) {
        this.whatsappMessage.error = _res.error;
        this.whatsappMessage.response = _res.message;
      }
    },
    async deleteWhatsapp() {
      let _res = await deleteWhatsappSession();
      this.whatsappStatus = { error: false, message: null, qr_base64: null };
      this.whatsappMessage = {
        to: null,
        message: null,
        response: null,
        error: false,
      };
      this.loadWhatsapp();
    },
    async loadWhatsapp() {
      let _res = await getWhatsappQr();
      if (_res && _res.error) {
        this.whatsappStatus.qr_base64 = null;
        this.whatsappStatus.error = true;
        this.whatsappStatus.message = _res.message;
      } else if (_res && !_res.error) {
        this.whatsappStatus.qr_base64 = _res.data[0].qr_base64;
        this.whatsappStatus.error = false;
        this.whatsappStatus.message = null;
      }
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
      let param = JSON.parse(JSON.stringify(this.data));
      param.list_device = param.list_device.slice(0, param.total_device);
      param.password_pattern = JSON.stringify(param.password_pattern);
      param.return_ext_aggregation = param.return_ext_aggregation ? 1 : 0;
      $axiosMertrack
        .post(`v3/configuration/application`, param)
        .then((result) => {
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : 'Data has been saved successfully ',
            type: res.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          if (!res.error) {
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
