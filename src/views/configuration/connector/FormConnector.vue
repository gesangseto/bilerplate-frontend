<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Connector [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter connector name"
                autocomplete="name"
                v-model="connector.name"
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
                v-model="connector.description"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Description
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CTextarea>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter connector method"
                v-model="connector.connector_method"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Method
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter connector path"
                v-model="connector.connector_path"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Path</p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter connector port"
                v-model="connector.connector_port"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Port</p>
                </template>
              </CInput>
              <template>
                <table style="width: 100%">
                  <thead>
                    <th style="text-align: center; width: 30%">
                      Name Parameter
                    </th>
                    <th style="text-align: center; width: 30%">Source</th>
                    <th style="text-align: center; width: 5%">Required</th>
                    <th style="text-align: center; width: 5%">As Key</th>
                  </thead>

                  <tbody
                    v-for="(item, index) in connector.params"
                    :key="index"
                    style="padding-bottom: 100px"
                  >
                    <tr>
                      <td style="align: center">
                        <CInput
                          readonly
                          :value.sync="item.variable_name"
                          @click="selectedLayout = index"
                        />
                      </td>
                      <td style="text-align: center">
                        <CSelect
                          placeholder="-Select-"
                          disabled
                          :options="listSource"
                          horizontal
                          :value.sync="item.source"
                          inline
                        />
                      </td>
                      <td>
                        <CSwitch
                          class="mr-1"
                          color="success"
                          disabled
                          :checked.sync="item.required"
                        />
                      </td>
                      <td style="text-align: center">
                        <CInputRadioGroup
                          id="avatar"
                          readonly
                          name="inlineRadioOptions"
                          style="margin-left: 18px"
                          :options="[{ value: item.variable_name }]"
                          :inline="false"
                          :checked.sync="connector.key"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <ButtonBack />
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
      connector: { params: [] },
      listSource: [
        {
          label: "Database",
          value: "database",
        },
        {
          label: "File Content",
          value: "file_content",
        },
        {
          label: "File Name",
          value: "file_name",
        },
        {
          label: "String",
          value: "string",
        },
      ],
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
      $axiosMertrack
        .get(`/v3/connector/connector-list?id=${this.$route.params.id}`)
        .then((response) => {
          let data = response.data.data[0];
          this.connector = data;
        });
    },
    save() {
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>
