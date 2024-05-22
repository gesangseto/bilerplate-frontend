<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Connector Action [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter connector name"
                autocomplete="name"
                v-model="form.name"
                :is-valid="initialLoad ? null : !form.name ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CTextarea
                :disabled="action == 'Read' ? true : false"
                placeholder="Enter connector description"
                horizontal
                v-model="form.description"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Description</p>
                </template>
              </CTextarea>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter folder path"
                v-model="form.folder_sftp"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Folder Path</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                :placeholder="
                  form.folder_sftp
                    ? 'Default: ' +
                      form.folder_sftp +
                      form.folder_sftp.includes('/')
                      ? '/Archive'
                      : '\\Archive'
                    : ''
                "
                v-model="form.folder_backup"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Archive Folder Path</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter time interval (in minute). Leave blank or set value to 0 to disable."
                v-model="form.schedule"
                type="number"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Auto Execution Time Interval
                  </p>
                </template>
              </CInput>
              <CRow form class="form-group">
                <CCol sm="3"> Using Connection </CCol>
                <SwitchDefault
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="form.using_connection"
                  v-on:onChange="form.using_connection = $event"
                />
              </CRow>
              <CCard v-if="form.using_connection">
                <CCardBody>
                  <CInput
                    :disabled="action == 'Read' ? true : false"
                    horizontal
                    placeholder="Enter Connection Host"
                    label="Host *"
                    v-model="connection.host"
                    :is-valid="
                      initialLoad ? null : !connection.host ? false : true
                    "
                  >
                  </CInput>
                  <CInput
                    :disabled="action == 'Read' ? true : false"
                    horizontal
                    placeholder="Enter Connection PORT"
                    label="Port *"
                    v-model="connection.port"
                    :is-valid="
                      initialLoad ? null : !connection.port ? false : true
                    "
                  >
                  </CInput>
                  <CInput
                    :disabled="action == 'Read' ? true : false"
                    horizontal
                    placeholder="Enter Username"
                    label="Username *"
                    v-model="connection.username"
                    :is-valid="
                      initialLoad ? null : !connection.username ? false : true
                    "
                  >
                  </CInput>
                  <CInput
                    :disabled="action == 'Read' ? true : false"
                    horizontal
                    type="password"
                    placeholder="Enter Password"
                    label="Password *"
                    v-model="connection.password"
                    :is-valid="
                      initialLoad ? null : !connection.password ? false : true
                    "
                  >
                  </CInput>
                </CCardBody>
              </CCard>
              <CSelect
                placeholder="-Select-"
                :options="listConnector"
                horizontal
                :value.sync="form.connector_id"
                @change="handleChangeConnector()"
                :is-valid="
                  initialLoad ? null : !form.connector_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Connector
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
              <CRow form class="form-group">
                <CCol sm="3"> Status </CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="form.status"
                  v-on:onChange="form.status = $event"
                />
              </CRow>
              <CCard>
                <CCardHeader>Connector Parameter</CCardHeader>
                <CCardBody
                  ><table style="width: 100%">
                    <thead>
                      <th style="text-align: center; width: 5%">Source Type</th>
                      <th style="text-align: center; width: 5%">
                        Parameter Name
                      </th>
                      <th style="text-align: center; width: 5%">
                        Parameter Value
                      </th>
                      <th style="text-align: center; width: 5%">Required</th>
                      <th style="text-align: center; width: 5%">Key</th>
                    </thead>

                    <tbody
                      v-for="(item, index) in detailConnector.params"
                      :key="index"
                    >
                      <tr @click="handleClickRow(index)">
                        <td style="align: center">
                          <CInput readonly :value.sync="item.source" />
                        </td>
                        <td style="align: center">
                          <CInput readonly :value.sync="item.variable_name" />
                        </td>
                        <td style="text-align: center">
                          <CInput
                            v-if="item.source !== 'database'"
                            :readonly="
                              item.source !== 'database' &&
                              item.source !== 'string'
                            "
                            :value.sync="item.variable_value"
                          />
                          <CSelect
                            v-if="item.source == 'database'"
                            :value.sync="item.variable_value"
                            placeholder="-Select-"
                            :options="databaseList[index]"
                            horizontal
                          />
                        </td>
                        <td style="text-align: center">
                          <CInputCheckbox
                            class="mr-1"
                            color="success"
                            :disabled="true"
                            horizontal
                            inline
                            :checked.sync="item.required"
                          />
                        </td>
                        <td style="text-align: center">
                          <!-- <CInputRadioGroup
                            id="avatar"
                            name="inlineRadioOptions"
                            style="margin-left: 18px"
                            :options="[{ value: item.variable_name }]"
                            :inline="false"
                            :checked.sync="form.key"
                          /> -->

                          <CInputCheckbox
                            class="mr-1"
                            color="success"
                            disabled
                            horizontal
                            inline
                            :checked="
                              form.key === item.variable_name ? true : false
                            "
                          />
                        </td>
                      </tr>
                    </tbody></table
                ></CCardBody>
              </CCard>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' ? false : true"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
              <CIcon name="cil-check-circle" /> Submit
            </CButton>
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from '../../../utils';
import $axiosMertrack from '../../../apiMertrack';

export default {
  name: 'Connector',
  watch: {
    form: {
      handler(item) {},
      deep: true,
    },
  },
  data() {
    return {
      initialLoad: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      form: {
        params: [],
        key: null,
        value: null,
        connector_id: null,
        name: '',
        using_connection: true,
        connection: null,
      },
      connection: { ip: null, username: null, password: null, port: null },
      detailConnector: { params: [] },
      listConnector: [],
      listConnectorProperty: [],
      databaseList: [[], [], [], [], [], [], [], [], [], []],
      temp_selected_row: null,
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.loadConnector();
  },
  methods: {
    loadData() {
      $axiosMertrack
        .get(`/v3/connector/connector-action?id=${this.$route.params.id}`)
        .then((response) => {
          let data = response.data.data[0];
          this.form = data;
          if (this.form.using_connection)
            this.connection = this.form.connection;
          this.detailConnector.params = data.params;
          let idx = 0;
          for (const it of data.params) {
            if (it.source === 'database') {
              this.databaseList[idx].push({
                label: it.variable_value_name,
                value: it.variable_value,
              });
            }
            idx += 1;
          }
        });
    },
    loadConnector() {
      $axiosMertrack.get(`/v3/connector/connector-list`).then((response) => {
        let data = response.data.data;
        for (const it of data) {
          this.listConnector.push({ label: it.name, value: it.id });
        }
      });
    },
    getDetailConnector() {
      $axiosMertrack
        .get(`/v3/connector/connector-list?id=${this.form.connector_id}`)
        .then((response) => {
          let data = response.data.data[0];
          this.detailConnector = data;
          this.form.params = data.params;
          this.form.key = data.key;
        });
    },
    handleClickRow(index) {
      if (index === this.temp_selected_row) {
        return;
      }
      let prop = this.detailConnector.params[index];
      let idx = this.databaseList[index].findIndex(
        (i) => i.value == prop.variable_value
      );
      if (~idx && this.databaseList[index].length > 1) {
        return;
      }
      this.temp_selected_row = index;
      let param = `${new URLSearchParams(prop.properties).toString()}`;
      $axiosMertrack
        .get(`/v3/connector/connector-properties?${param}`)
        .then((response) => {
          let data = response.data.data;
          for (const it of data) {
            let list = {
              label: it.column_name,
              value: it.column_value,
            };
            this.databaseList[index].push(list);
          }
          this.databaseList[index] = this.uniqueArr(this.databaseList[index]);
        });
    },
    uniqueArr(arr) {
      return arr.filter((obj, index, self) => {
        return (
          index ===
          self.findIndex((t) => t.label === obj.label && t.value === obj.value)
        );
      });
    },
    handleChangeConnector() {
      this.getDetailConnector();
    },
    validation() {
      let required = ['name', 'connector_id'];
      let next = true;
      for (const key in this.form) {
        if (required.includes(key) && !this.form[key]) next = false;
      }
      if (this.form.using_connection) {
        if (!this.connection.host) {
          next = false;
        } else if (!this.connection.port) {
          this.connection.port = 22;
        } else if (!this.connection.username) {
          next = false;
        } else if (!this.connection.password) {
          next = false;
        }
      }
      return next;
    },
    save() {
      this.initialLoad = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        if (this.form.using_connection) {
          this.form.connection = this.connection;
        } else {
          this.form.connection = null;
        }
        for (const it of this.form.params) {
          if (it.variable_name === this.form.key) {
            this.form.value = it.variable_value;
            break;
          }
        }
        if (this.$route.params.id) {
          $axiosMertrack
            .post(`v3/connector/connector-action`, this.form)
            .then((result) => {
              this.$isLoading(false);
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
                this.$router.back();
              }
            });
        } else {
          $axiosMertrack
            .put(`v3/connector/connector-action`, this.form)
            .then((result) => {
              this.$isLoading(false);
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
                this.$router.back();
              }
            });
        }
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>
