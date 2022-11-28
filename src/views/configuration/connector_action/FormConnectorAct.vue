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
                placeholder="Enter folder sftp"
                v-model="form.folder_sftp"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Folder SFTP</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter folder backup"
                v-model="form.folder_backup"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Folder Backup</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter shcedule periode on minute"
                v-model="form.schedule"
                type="number"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Schedule Periode</p>
                </template>
              </CInput>
              <CSelect
                placeholder="-Select-"
                :options="listConnector"
                horizontal
                :value.sync="form.connector_id"
                @change="handleChangeConnector()"
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
              <CCard>
                <CCardHeader>Config Default data</CCardHeader>
                <CCardBody
                  ><table style="width: 100%">
                    <thead>
                      <th style="text-align: center; width: 5%">Source</th>
                      <th style="text-align: center; width: 5%">
                        Name Parameter
                      </th>
                      <th style="text-align: center; width: 5%">
                        Variable Parameter
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
                            v-if="
                              temp_selected_row !== index ||
                              item.source === 'string'
                            "
                            :readonly="
                              item.source !== 'database' &&
                              item.source !== 'string'
                            "
                            :value.sync="item.variable_value"
                          />
                          <CSelect
                            v-if="
                              temp_selected_row === index &&
                              item.source !== 'string'
                            "
                            :readonly="item.source !== 'database'"
                            :value.sync="item.variable_value"
                            placeholder="-Select-"
                            :options="listConnectorProperty"
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
            <CButton
              type="reset"
              size="sm"
              class="m-1"
              color="danger"
              @click="cancel()"
            >
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

export default {
  name: "Connector",
  data() {
    return {
      route_action: "",
      // category: '',
      action: "Edit",
      form: { params: [], key: null, value: null, connector_id: null },
      detailConnector: { params: [] },
      listConnector: [],
      listConnectorProperty: [],
      temp_selected_row: null,
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
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
          this.detailConnector = data._connector;
          this.detailConnector.params = data.params;
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
        });
    },
    handleClickRow(index) {
      if (index === this.temp_selected_row) {
        return;
      }
      this.listConnectorProperty = [];
      this.temp_selected_row = index;
      let prop = this.detailConnector.params[index];
      prop = `${new URLSearchParams(prop.properties).toString()}`;
      $axiosMertrack
        .get(`/v3/connector/connector-properties?${prop}`)
        .then((response) => {
          let data = response.data.data;
          for (const it of data)
            this.listConnectorProperty.push({
              label: it.column_name,
              value: it.column_value,
            });
        });
    },
    handleChangeConnector() {
      this.getDetailConnector();
    },
    save() {
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
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
        } else {
          $axiosMertrack
            .put(`v3/connector/connector-action`, this.form)
            .then((result) => {
              this.$isLoading(false);
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
