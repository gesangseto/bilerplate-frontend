<template>
  <div>
    <CRow>
      <CCol sm="12" md="12" lg="12" xl="12">
        <CCard>
          <CCardHeader
            class="d-flex justify-content-between align-items-center"
          >
            <h5>Configuration [EDIT]</h5>
            <ButtonInfo :formData="data" v-if="action !== 'Create'" />
          </CCardHeader>

          <CCardBody>
            <CForm>
              <!-- Super User -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Super User
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Login Information</p>
                  <InputDefault
                    required
                    :is-valid="!data.users_name ? false : true"
                    :col="[3, 7]"
                    title="Username"
                    v-model="data.users_name"
                  />
                  <InputDefault
                    :col="[3, 7]"
                    :type="showUserPassword == false ? 'password' : 'text'"
                    title="Password"
                    v-model="data.users_password"
                    description="Leave blank if you do not want to change the password."
                  >
                    <template #append>
                      <CButton @click="showUserPassword = !showUserPassword">
                        <v-icon v-if="!showUserPassword" name="eye-slash" />
                        <v-icon v-if="showUserPassword" name="eye" />
                      </CButton>
                    </template>
                  </InputDefault>
                </CCardBody>
              </CCard>

              <!-- Licensed Entity & Limits -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Licensed Entity & Limits
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Company Information</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Entity Name"
                        v-model="data.identity_name"
                        required
                        :is-valid="!data.identity_name ? false : true"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <TextareaDefault
                        :col="[4, 8]"
                        title="Entity Address"
                        v-model="data.entity_address"
                        required
                        :is-valid="!data.entity_address ? false : true"
                      />
                    </CCol>
                  </CRow>

                  <p style="font-weight: bold">GS1 Information</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="GS1 Company Prefix"
                        v-model="data.identity_number"
                        :validasi="'integer'"
                        :max="12"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="GLN"
                        v-model="data.gln"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                  </CRow>

                  <p style="font-weight: bold">License Limits</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum Warehouse"
                        v-model="data.total_wh"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum Department"
                        v-model="data.total_department"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum Section"
                        v-model="data.total_section"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum Label Layout"
                        v-model="data.total_conf_layout"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum Date Format"
                        v-model="data.total_conf_date"
                        :validasi="'integer'"
                        :max="100"
                      />
                    </CCol>
                  </CRow>

                  <p style="font-weight: bold">
                    MERTRACK Warehouse Mobile (MWM) Devices
                  </p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Maximum MWM Devices"
                        :validasi="'integer'"
                        v-model="data.total_device"
                        :max="100"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol
                      v-for="(item, index) in parseInt(data.total_device)"
                      :key="index"
                      sm="12"
                      md="6"
                      lg="6"
                    >
                      <InputDefault
                        :col="[4, 8]"
                        :title="'MWM Device ID #' + (index + 1)"
                        :validasi="'alphanumeric'"
                        v-model="data.list_device[index]"
                        :max="100"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
              <!-- Authentication & Security Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
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
                  <InputDefault
                    :col="[3, 7]"
                    :title="'Password Expiration (Days)'"
                    :validasi="'integer'"
                    v-model="data.password_expiry_days"
                    :max="50"
                    description="Number of days before the user is required to change their password.
                    Leave blank to disable password expiration."
                  />
                  <InputDefault
                    required
                    :col="[3, 7]"
                    :title="'Password History Limit'"
                    :validasi="'integer'"
                    v-model="data.password_history_limit"
                    :min="1"
                    :max="50"
                    :is-valid="!data.password_history_limit ? false : true"
                    description="Specifies how many previous passwords cannot be reused. Minimum value = 1"
                  >
                    <template #append>
                      <CButton
                        size="sm"
                        color="warning"
                        style="white-space: nowrap; margin-left: 8px"
                        @click="resetHsitory()"
                      >
                        Reset Pwd History
                      </CButton>
                    </template>
                  </InputDefault>

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
                    title="Default User Password"
                    v-model="data.password_default"
                    :is-valid="data.password_default ? true : null"
                    description="This password will be assigned to new user accounts or when resetting a user's password"
                  />
                  <CRow form class="form-group">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Enforce Default Password Change
                    </CCol>
                    <CCol sm="7">
                      <SwitchDefault
                        :default_value="data.password_must_change"
                        v-on:onChange="data.password_must_change = $event"
                        :description="
                          data.password_must_change
                            ? `Users assigned the default password (new accounts or after password reset by administrator) must change their password at next login.`
                            : null
                        "
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <!-- General System Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
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
                      :is-valid="!data.identity_logo_path ? false : true"
                    >
                      <template #label>
                        <div class="col-form-label col-sm-3">
                          Identity Logo
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </div>
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
                      :is-valid="!data.home_logo ? false : true"
                      horizontal
                      custom
                      class="input-form-upload"
                      @change="uploadLogo($event, 'home')"
                    >
                      <template #label>
                        <div class="col-form-label col-sm-3">
                          Home Page Picture
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </div>
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
                      :is-valid="!data.login_logo ? false : true"
                      horizontal
                      custom
                      class="input-form-upload"
                      @change="uploadLogo($event, 'login')"
                    >
                      <template #label>
                        <div class="col-form-label col-sm-3">
                          Login Logo
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </div>
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
                </CCardBody>
              </CCard>
              <!-- Notification Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Notification Settings
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <p style="font-weight: bold">
                        <CIcon name="cib-whatsapp" /> &nbsp; Whatsapp
                      </p>
                      <CRow form class="form-group">
                        <CCol tag="label" sm="6" class="col-form-label">
                          Enabling Notification
                        </CCol>
                        <CCol sm="6">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.notification_whatsapp"
                            :disabled="whatsappLoading"
                            @update:checked="onWhatsappToggle"
                          />
                        </CCol>
                      </CRow>
                      <div v-if="data.notification_whatsapp">
                        <template v-if="!whatsappPanelOpen">
                          <small class="text-muted">
                            The QR panel is closed. Open it only when you need to
                            connect or re-scan WhatsApp.
                          </small>
                          <div class="mt-2">
                            <CButton
                              size="sm"
                              color="primary"
                              :disabled="whatsappLoading"
                              @click="openWhatsappPanel"
                            >
                              Connect / Show QR
                            </CButton>
                          </div>
                        </template>
                        <template v-else>
                          <div class="d-flex flex-wrap align-items-center mb-2">
                            <CButton
                              size="sm"
                              color="secondary"
                              @click="closeWhatsappPanel"
                            >
                              Hide QR
                            </CButton>
                          </div>
                          <small>{{ whatsappStatus.message }}</small>
                          <hr />
                        <CForm
                          v-if="whatsappStatus.qr_base64 && !whatsappQrExpired"
                        >
                          <CCol md="4">
                            <img
                              v-bind:src="whatsappStatus.qr_base64"
                              style="width: 220px; height: auto"
                            />
                          </CCol>
                        </CForm>
                        <div
                          v-if="whatsappQrExpired && !whatsappStatus.connected"
                          class="mb-2"
                        >
                          <p class="text-warning mb-2">
                            QR code has expired. Please reload the QR to display
                            a new code.
                          </p>
                          <CButton
                            size="sm"
                            color="primary"
                            @click="reloadWhatsappQr"
                          >
                            Reload QR
                          </CButton>
                        </div>
                        <div
                          v-else-if="
                            !whatsappStatus.qr_base64 &&
                            !whatsappStatus.connected &&
                            !whatsappStatus.error
                          "
                          class="mb-2"
                        >
                          <CButton
                            size="sm"
                            color="primary"
                            @click="reloadWhatsappQr"
                          >
                            Show QR
                          </CButton>
                        </div>
                        <div
                          v-if="!whatsappStatus.connected"
                          class="mt-2 mb-2"
                        >
                          <CButton
                            size="sm"
                            color="danger"
                            :disabled="whatsappDestroying"
                            @click="deleteWhatsapp()"
                          >
                            {{
                              whatsappDestroying
                                ? 'Deleting session...'
                                : 'Reset Session'
                            }}
                          </CButton>
                        </div>
                        <small
                          v-if="
                            whatsappStatus.error && !whatsappStatus.qr_base64
                          "
                          class="text-danger"
                        >
                          {{ whatsappStatus.message }}
                        </small>
                        <CForm v-if="whatsappStatus.connected">
                          <InputDefault
                            :col="[4, 8]"
                            :title="'To'"
                            :validasi="'integer'"
                            v-model="whatsappMessage.to"
                            :max="14"
                          />
                          <InputDefault
                            :col="[4, 8]"
                            :title="'Message'"
                            v-model="whatsappMessage.message"
                            :max="200"
                          />
                          <div
                            class="d-flex flex-wrap align-items-center"
                            style="gap: 12px"
                          >
                            <CButton
                              size="sm"
                              color="success"
                              @click="sendWhatsapp()"
                            >
                              Send Test Message
                            </CButton>
                            <CButton
                              size="sm"
                              color="danger"
                              :disabled="whatsappDestroying"
                              @click="deleteWhatsapp()"
                            >
                              {{
                                whatsappDestroying
                                  ? 'Deleting session...'
                                  : 'Delete Session'
                              }}
                            </CButton>
                          </div>
                          <small
                            v-if="
                              whatsappMessage.response && whatsappMessage.error
                            "
                            class="text-danger"
                          >
                            {{ whatsappMessage.response }}
                          </small>
                        </CForm>
                        </template>
                      </div>
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <p style="font-weight: bold">Other Channels</p>
                      <template v-for="channel in comingSoonNotifications">
                        <div :key="channel.name" class="mb-3">
                          <p style="font-weight: bold" class="mb-2">
                            <CIcon :name="channel.icon" /> &nbsp;
                            {{ channel.name }}
                            <CBadge color="secondary" class="ml-2">
                              Available soon
                            </CBadge>
                          </p>
                          <CRow form class="form-group">
                            <CCol tag="label" sm="6" class="col-form-label">
                              Enabling Notification
                            </CCol>
                            <CCol sm="6">
                              <CSwitch class="mr-1" color="success" disabled />
                            </CCol>
                          </CRow>
                        </div>
                      </template>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
              <!-- Production Module Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Production Module Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Process Order</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <SelectOption
                        title="Expiry Date Calculation Rule"
                        :options="listExpiryType"
                        v-on:onchange="data.expiry_type = $event"
                        :value="data.expiry_type"
                        :col="[4, 8]"
                        :description="expiryDescription()"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="SN Pattern"
                        v-model="data.serial_pattern"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Minimum Generated SN"
                        v-model="data.min_count_generated_serial"
                        :validasi="'integer'"
                        :max="10000"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Additional SNs for Ref. Sample"
                        v-model="data.additional_serial_for_sample"
                        :validasi="'integer'"
                        :max="10000"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <!-- Warehouse Module Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Warehouse Module Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Transaction Settings</p>
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
                          Create Inbound on Transfer Completion
                        </CCol>
                        <CCol sm="4">
                          <CSwitch
                            class="mr-1"
                            color="success"
                            :checked.sync="data.transfer_record_to_inbound"
                          />
                        </CCol>
                      </CRow>
                      <CRow form class="form-group">
                        <CCol tag="label" sm="8" class="col-form-label">
                          Create Outbound on Transfer Completion
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
              <!-- BPOM TTAC Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  BPOM TTAC Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">
                    BPOM TTAC Registration Information
                  </p>
                  <CRow>
                    <CCol sm="12" md="4" lg="4">
                      <InputDefault
                        required
                        :isValid="!data.id_location ? false : true"
                        :col="[4, 8]"
                        title="ID Sarana"
                        v-model="data.id_location"
                        :validasi="'integer'"
                        :max="100"
                        description="'ID Sarana' as registered in the BPOM TTAC system, used for reporting Track & Trace data."
                      />
                    </CCol>
                    <CCol sm="12" md="4" lg="4">
                      <InputDefault
                        required
                        :col="[4, 8]"
                        title="Latitude"
                        v-model="data.latitude"
                        :validasi="'float'"
                        :isValid="!data.latitude ? false : true"
                      />
                    </CCol>
                    <CCol sm="12" md="4" lg="4">
                      <InputDefault
                        required
                        :col="[4, 8]"
                        title="Longitude"
                        v-model="data.longitude"
                        :validasi="'float'"
                        :isValid="!data.longitude ? false : true"
                      />
                    </CCol>
                  </CRow>
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
              <!-- Database Management Settings -->
              <CCard>
                <CCardHeader style="font-weight: bold; font-size: large">
                  Database Management Settings
                </CCardHeader>
                <CCardBody>
                  <p style="font-weight: bold">Archive</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Pre Inbound"
                        v-model="data.folder_preinbound"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Picking List"
                        v-model="data.folder_pickinglist"
                      />
                    </CCol>
                  </CRow>
                  <p style="font-weight: bold; margin-bottom: 15px">Backup</p>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <SelectOption
                        title="Scheduler"
                        :options="listCron"
                        v-on:onchange="data.backup_interval = $event"
                        :value="data.backup_interval"
                        :col="[4, 8]"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Backup Path"
                        v-model="data.backup_path"
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Backup File Name Prefix"
                        v-model="data.backup_prefix"
                        :description="`File name preview: '${getFullNameBackup()}`"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        :type="showPassword == false ? 'password' : 'text'"
                        title="7z Password"
                        v-model="data.backup_password"
                      >
                        <template #append>
                          <CButton @click="showPassword = !showPassword">
                            <v-icon v-if="!showPassword" name="eye-slash" />
                            <v-icon v-if="showPassword" name="eye" />
                          </CButton>
                        </template>
                      </InputDefault>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="12" md="6" lg="6">
                      <SelectOption
                        title="Compression Level"
                        :options="listCompressionLevel"
                        v-on:onchange="data.backup_compression = $event"
                        :value="data.backup_compression"
                        :col="[4, 8]"
                        :description="compressionDescription()"
                      />
                    </CCol>
                    <CCol sm="12" md="6" lg="6">
                      <InputDefault
                        :col="[4, 8]"
                        title="Backup File Retention"
                        v-model="data.backup_retention"
                        :validasi="'integer'"
                        :max="4"
                        :description="`How many days to keep database backup files. Files older than this are deleted automatically (oldest first).\nLeave blank to disable auto-delete`"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CForm>
          </CCardBody>
          <CCardFooter class="d-flex justify-content-start gap-2">
            <ButtonReason
              :property="data"
              type="update"
              :reason.sync="data.reason"
              :reason-required="true"
              @handleSubmit="save()"
            />
            <ButtonBack />
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
import {
  getSysConfig,
  updateSysConfig,
  resetPasswordHistory,
} from '../../../resource/SysConfig';
import {
  getWhatsappQr,
  getWhatsappStatus,
  sendWhatsappMessage,
  deleteWhatsappSession,
} from '../../../resource/Whatsapp';
import { handleBack, setConfig } from '../../../utils';
import { getConfCron } from '../../../resource/ConfCron';
import { CCard, CCol } from '@coreui/vue';
export default {
  name: 'ConfigApplication',
  components: {},
  data() {
    return {
      showUserPassword: false,
      showPassword: false,
      initialLoad: true,
      action: 'Edit',
      labelLogo: {
        identity: 'Choose file...',
        login: 'Choose file...',
        home: 'Choose file...',
      },
      epcStatusOptions: [],
      comingSoonNotifications: [
        { name: 'Email', icon: 'cil-envelope-closed' },
        { name: 'Telegram', icon: 'cib-telegram' },
        { name: 'Slack', icon: 'cib-slack' },
      ],
      password_pattern: {
        min: null,
        max: null,
        alphabet_lower: false,
        alphabet_upper: false,
        numeric: false,
        symbol: false,
      },
      whatsappStatus: { error: false, message: null, qr_base64: null },
      whatsappLoading: false,
      whatsappDestroying: false,
      // Endpoint WhatsApp (termasuk /status) hanya dipanggil saat panel QR
      // dibuka user, agar tidak membebani backend di setiap page load.
      whatsappPanelOpen: false,
      // QR hanya valid 60 detik. Masa berlaku dihitung dari qr_issued_at
      // backend (bukan dari waktu fetch) supaya gambar yang sudah berumur
      // tidak ikut ditampilkan dan ditolak WhatsApp.
      whatsappQrExpired: false,
      whatsappQrIssuedAt: null,
      whatsappQrTtl: 60000,
      whatsappQrRequesting: false,
      whatsappLastQrRefreshAt: 0,
      whatsappPolling: null,
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
        backup_compression: null,
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
      info: {},
      devicesLooping: 0,
      periodicBackupOptions: [
        { value: 1, label: '1 Day' },
        { value: 7, label: '7 Day' },
        { value: 14, label: '14 Day' },
        { value: 30, label: '30 Day' },
      ],
      listCompressionLevel: [
        {
          value: 0,
          label: 'No Compression',
          description:
            'No compression will be applied to the backup files, resulting in larger file sizes but faster backup times.',
        },
        {
          value: 1,
          label: 'Fastest',
          description:
            'Applies fast compression, balancing speed and file size reduction.',
        },
        {
          value: 3,
          label: 'Fast',
          description:
            'Offers a good balance between compression speed and file size reduction.',
        },
        {
          value: 5,
          label: 'Normal',
          description:
            'Provides standard compression settings for most use cases.',
        },
        {
          value: 7,
          label: 'Maximum',
          description:
            'Applies maximum compression, resulting in smaller file sizes but longer backup times.',
        },
        {
          value: 9,
          label: 'Ultra',
          description:
            'Uses the most aggressive compression settings for the smallest file sizes at the cost of longer backup times.',
        },
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
          label: 'End Of Month',
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
  },
  beforeDestroy() {
    this.stopWhatsappPolling();
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
          backup_compression: data.backup_compression ?? null,
          users_password: null,
          return_ext_aggregation: data.return_ext_aggregation ? true : false,
          password_pattern: pattern
            ? JSON.parse(pattern)
            : this.initial_password_pattern(),
        };
        this.info = this.data?.info;
        this.devicesLooping = data.total_device;
      }
      return;
    },
    expiryDescription() {
      let thisExpiry = this.listExpiryType.find(
        (it) => it.value == this.data.expiry_type,
      );
      if (thisExpiry) {
        return thisExpiry.description;
      } else {
        return 'Expiry date retains the original day value.';
      }
    },
    compressionDescription() {
      let selected = this.listCompressionLevel.find(
        (it) => it.value == this.data.backup_compression,
      );
      return selected
        ? selected.description
        : 'Select the desired compression level for the backup files. Higher compression levels result in smaller file sizes but may take longer to create.';
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
        this.whatsappMessage.response = _res.error ? _res.message : null;
        if (!_res.error) {
          this.$toast.open({
            message: _res.message || 'Message sent successfully',
            type: 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        } else {
          this.$toast.open({
            message: _res.message || 'Failed to send message',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        }
      } else {
        this.$toast.open({
          message: 'Failed to send WhatsApp message',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    },
    async onWhatsappToggle(enabled) {
      const previous = !enabled;
      this.data.notification_whatsapp = enabled;
      this.whatsappLoading = true;
      try {
        // Endpoint sys-configuration memvalidasi field wajib dan mengelola
        // scheduler backup setiap kali dipanggil, jadi kirim field tersebut
        // agar update parsial ini tidak menghapus jadwal backup.
        const result = await updateSysConfig({
          users_name: this.data.users_name,
          identity_name: this.data.identity_name,
          identity_number: this.data.identity_number,
          identity_logo_path: this.data.identity_logo_path,
          backup_interval: this.data.backup_interval,
          notification_whatsapp: enabled,
        });
        if (!result || result.error) {
          this.data.notification_whatsapp = previous;
          this.whatsappStatus = {
            error: true,
            connected: false,
            qr_base64: null,
            message: result?.message || 'Failed to save WhatsApp setting.',
          };
          return;
        }

        if (enabled) {
          // Jangan memuat QR/status otomatis; user harus membuka panel QR.
          this.stopWhatsappPolling();
          this.whatsappPanelOpen = false;
          this.whatsappQrExpired = false;
          this.whatsappQrIssuedAt = null;
          this.whatsappStatus = {
            error: false,
            connected: false,
            qr_base64: null,
            message:
              'WhatsApp notification is enabled. Open the QR panel to connect.',
          };
        } else {
          this.stopWhatsappPolling();
          this.whatsappPanelOpen = false;
          this.whatsappQrExpired = false;
          this.whatsappQrIssuedAt = null;
          this.whatsappStatus = {
            error: false,
            connected: false,
            qr_base64: null,
            message: 'WhatsApp notification is disabled.',
          };
        }
      } finally {
        this.whatsappLoading = false;
      }
    },
    async deleteWhatsapp() {
      if (
        !window.confirm(
          'Delete WhatsApp session? You will need to scan the QR again to reconnect.',
        )
      ) {
        return;
      }
      this.whatsappDestroying = true;
      let _res = await deleteWhatsappSession();
      this.whatsappDestroying = false;
      if (!_res || _res.error) {
        this.$toast.open({
          message: _res?.message || 'Failed to delete WhatsApp session',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        error: false,
        connected: false,
        message: 'WhatsApp session deleted successfully.',
        qr_base64: null,
      };
      this.whatsappMessage = {
        to: null,
        message: null,
        response: null,
        error: false,
      };
    },
    async openWhatsappPanel() {
      this.whatsappPanelOpen = true;
      this.whatsappQrExpired = false;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        error: false,
        message: 'Loading WhatsApp status...',
      };
      // Selalu minta socket pairing baru saat panel dibuka: QR yang tersisa
      // dari sesi sebelumnya (mis. setelah API restart) sudah tidak berlaku.
      await this.loadWhatsapp(true);
    },
    closeWhatsappPanel() {
      this.stopWhatsappPolling();
      this.whatsappPanelOpen = false;
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        error: false,
        qr_base64: null,
        connected: false,
        message: null,
      };
    },
    async loadWhatsapp(refresh = false) {
      if (this.whatsappQrRequesting) {
        return;
      }
      this.whatsappQrRequesting = true;
      try {
        let _res = await getWhatsappQr(refresh);
        if (_res && _res.error) {
          this.stopWhatsappPolling();
          // Endpoint /qr pada core mengembalikan error saat sesi sudah terhubung
          // atau QR kedaluwarsa, jadi status dipakai untuk membedakan keduanya.
          const statusRes = await getWhatsappStatus();
          const status =
            (statusRes && !statusRes.error && statusRes.data?.[0]) || null;
          if (status && status.connected) {
            this.whatsappQrExpired = false;
            this.whatsappQrIssuedAt = null;
            this.whatsappStatus = {
              ...this.whatsappStatus,
              qr_base64: null,
              connected: true,
              error: false,
              message: 'WhatsApp terhubung.',
            };
            return;
          }
          const expired = !!(status && status.qr_expired);
          this.whatsappQrExpired = expired;
          this.whatsappStatus = {
            ...this.whatsappStatus,
            qr_base64: null,
            connected: false,
            error: !expired,
            message: _res.message,
          };
          // Session bisa tetap hidup walau QR tidak tersedia (mis. pairing
          // baru diterima). Terus pantau sampai connected/expired.
          if (!expired && this.whatsappPanelOpen) {
            this.startWhatsappPolling();
          }
        } else if (_res && !_res.error) {
          const row = _res.data?.[0] || {};
          const qrBase64 = row.qr_base64 || null;
          const issuedAt = Number(row.qr_issued_at) || null;
          if (row.qr_ttl) {
            this.whatsappQrTtl = Number(row.qr_ttl) || 60000;
          }
          this.whatsappQrExpired = false;
          if (qrBase64) {
            // Masa berlaku dihitung dari waktu QR diterbitkan backend, bukan
            // dari waktu gambar diterima frontend.
            this.whatsappQrIssuedAt = issuedAt || Date.now();
          }
          this.whatsappStatus = {
            ...this.whatsappStatus,
            qr_base64: qrBase64,
            connected: !!row.connected,
            error: !qrBase64,
            message: qrBase64
              ? 'Scan the QR code with WhatsApp to connect.'
              : _res.message || 'Waiting for WhatsApp QR...',
          };
          if (row.connected) {
            this.stopWhatsappPolling();
          } else if (qrBase64) {
            this.startWhatsappPolling();
          }
        }
      } finally {
        this.whatsappQrRequesting = false;
      }
    },
    // QR Baileys dirotasi backend setiap qr_ttl. Polling ini memantau koneksi
    // sekaligus mengambil gambar QR terbaru saat backend merotasi kode, supaya
    // user tidak memindai QR yang sudah mati ("Couldn't link devices").
    startWhatsappPolling() {
      if (this.whatsappPolling) {
        return;
      }
      this.whatsappPolling = setInterval(async () => {
        if (!this.whatsappPanelOpen) {
          this.stopWhatsappPolling();
          return;
        }
        const _res = await getWhatsappStatus();
        const status = (_res && !_res.error && _res.data?.[0]) || null;
        if (!status) {
          return;
        }
        if (status.connected) {
          this.whatsappQrExpired = false;
          this.whatsappQrIssuedAt = null;
          this.whatsappStatus = {
            ...this.whatsappStatus,
            connected: true,
            qr_base64: null,
            error: false,
            message: 'WhatsApp terhubung.',
          };
          this.stopWhatsappPolling();
          return;
        }
        if (status.qr_expired) {
          this.whatsappQrExpired = true;
          this.whatsappQrIssuedAt = null;
          this.stopWhatsappPolling();
          return;
        }
        if (status.qr_ttl) {
          this.whatsappQrTtl = Number(status.qr_ttl) || 60000;
        }
        const issuedAt = Number(status.qr_issued_at) || null;
        const needsNewQr = issuedAt
          ? issuedAt !== this.whatsappQrIssuedAt
          : !!this.whatsappQrIssuedAt;
        if (
          needsNewQr &&
          Date.now() - this.whatsappLastQrRefreshAt > 10000
        ) {
          this.whatsappLastQrRefreshAt = Date.now();
          await this.loadWhatsapp();
          if (this.whatsappQrExpired) {
            return;
          }
        }
        if (
          this.whatsappQrIssuedAt &&
          Date.now() - this.whatsappQrIssuedAt > this.whatsappQrTtl - 5000
        ) {
          this.whatsappQrExpired = true;
          this.stopWhatsappPolling();
        }
      }, 5000);
    },
    stopWhatsappPolling() {
      if (this.whatsappPolling) {
        clearInterval(this.whatsappPolling);
        this.whatsappPolling = null;
      }
    },
    async reloadWhatsappQr() {
      if (!this.whatsappPanelOpen) {
        return;
      }
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        qr_base64: null,
        message: 'Loading new QR...',
      };
      // refresh=true membuang socket pairing lama supaya ref QR benar-benar
      // baru; ref lama yang sudah dipakai/kedaluwarsa ditolak WhatsApp.
      await this.loadWhatsapp(true);
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
        'entity_address',
        'password_history_limit',
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
    async save() {
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
      let res = await updateSysConfig(param);
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
        handleBack(this.$router, this.$route);
      }

      return;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
    async resetHsitory() {
      if (confirm('Are you sure you want to reset the password history?')) {
        this.data.reason = '[REST PASSWORD HISTORY]';
        let res = await resetPasswordHistory(this.data);
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
          this.loadConfig();
          this.loadEpcStatus();
          this.loadCron();
        }

        return;
      }
    },
    getFullNameBackup() {
      let timestamp = moment(new Date()).format('YYYYMMDD-hhmmss');
      return `${this.data.backup_prefix || ''}${this.info.database}_L3v${
        this.info.app_version
      }_Full_${timestamp}.7z`;
    },
  },
};
</script>
