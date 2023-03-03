<template>
  <CRow>
    <CCol col="8" xl="8">
      <CCard>
        <CCardHeader>
          <h5>
            Label Layout [{{
              this.action == "Create"
                ? "ADD"
                : this.action == "Read"
                ? "VIEW"
                : "EDIT"
            }}]
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="12">
              <CInputFile
                :placeholder="
                  formData.layout_name ? formData.itf_name : 'Choose file...'
                "
                :disabled="action === 'Read'"
                horizontal
                custom
                accept=".itf"
                class="input-form-upload"
                @change="handleUploadFile"
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.itf_name || formData.items.length == 0
                    ? false
                    : true
                "
                :invalid-feedback="
                  formData.itf_name && formData.items.length == 0
                    ? 'Invalid ITF file selected.'
                    : ''
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    ITF File
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInputFile>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12"
              ><CInput
                :disabled="action == 'Read'"
                v-model="formData.layout_name"
                horizontal
                :is-valid="
                  initialLoad ? null : !formData.layout_name ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template></CInput
              >
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> Status </CCol>
            <SwitchStatusMaster
              :disabled="action == 'Read'"
              :show_label="true"
              :default_value="formData.status"
              v-on:onChange="formData.status = $event"
            />
          </CRow>
          <template>
            <table style="width: 100%">
              <thead>
                <th style="text-align: center; width: 30%">Name Parameter</th>
                <th style="text-align: center; width: 30%">Type</th>
                <th style="text-align: center; width: 40%">Associated Field</th>
              </thead>

              <tbody
                v-for="(item, index) in formData.items"
                :key="index"
                style="padding-bottom: 100px"
              >
                <tr
                  v-bind:style="
                    selectedIndex == index ? 'background-color: #6ba1e3' : ''
                  "
                  @click="handleClickRow(index)"
                >
                  <td style="align: center">
                    <CInput
                      readonly
                      :value.sync="item.itf_var_name"
                      @click="selectedIndex = index"
                    />
                  </td>
                  <td>
                    <CSelect
                      :disabled="action == 'Read'"
                      placeholder="-Select-"
                      :options="listType"
                      horizontal
                      :value.sync="item.generate_type_id"
                      inline
                      @change="handleChangeType(index)"
                      @click="editAssociatedField((selectedIndex = index))"
                      :is-valid="
                        initialLoad
                          ? null
                          : !item.generate_type_id
                          ? false
                          : true
                      "
                    />
                  </td>
                  <td>
                    <!-- Associated Field -->
                    <CRow>
                      <CCol md="12">
                        <CInput
                          readonly
                          :value.sync="item.associated_field"
                          @click="editAssociatedField((selectedIndex = index))"
                          :is-valid="
                            initialLoad
                              ? null
                              : !item.associated_field
                              ? false
                              : true
                          "
                        >
                          <template #append>
                            <CButton
                              type="submit"
                              color="primary"
                              @click="
                                editAssociatedField((selectedIndex = index))
                              "
                              ><v-icon name="pen" />
                            </CButton>
                          </template>
                        </CInput>
                      </CCol>
                    </CRow>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <br />
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
          <CButton size="sm" class="m-1" color="danger" @click="cancel()">
            <CIcon name="cil-ban" /> Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="4" xl="4">
      <CCard>
        <CCardBody>
          <CCard>
            <CCardHeader>
              <strong>Identifier</strong>
            </CCardHeader>
            <CCardBody>
              <div>
                <CDataTable
                  striped
                  class="table-scroll-auto"
                  hover
                  :items="identifier_list"
                  :fields="identifier_field"
                >
                  <template #action="{ item, index }">
                    <td>
                      <CInputCheckbox
                        :checked.sync="item.is_selected"
                        size="sm"
                        style="margin-bottom: 30px; margin-top: 5px"
                        @change="handleSelectIdentifier(item, index)"
                      />
                    </td>
                  </template>
                </CDataTable>
              </div>
            </CCardBody>
          </CCard>
          <CCard>
            <CCardHeader>
              <strong>Associated Content</strong>
            </CCardHeader>
            <CCardBody>
              <div>
                <CDataTable
                  striped
                  class="table-scroll-auto"
                  hover
                  :items="associated_list"
                  :fields="associated_field"
                >
                  <template #action="{ item }">
                    <td>
                      <input
                        type="radio"
                        :value="item.identifier_id"
                        v-model="selectedIdentifier"
                      />
                    </td>
                  </template>
                </CDataTable>
              </div>
              <br />
              <CButton size="sm" color="primary" @click="handleSwipe('UP')">
                <v-icon name="arrow-up" />
              </CButton>
              &nbsp;
              <CButton size="sm" color="primary" @click="handleSwipe('DOWN')">
                <v-icon name="arrow-down" />
              </CButton>
              &nbsp;
              <CButton
                :disabled="selectedAssociated.flag_system ? true : false"
                size="sm"
                color="primary"
                @click="handleConfigAssociated()"
              >
                <v-icon name="cog" />
              </CButton>
            </CCardBody>
          </CCard>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      title="Warning Session Timeout"
      color="info"
      :show.sync="modalRefDate"
      size="lg"
    >
      <template #header>
        <h5><strong>Select Date Format</strong></h5>
      </template>
      <CCardBody>
        <CRow>
          <CCol class="md-4">
            <CSelect
              label="Date Format"
              :value.sync="selectedDate"
              horizontal
              :options="listFormatDate"
            />
          </CCol>
        </CRow>
      </CCardBody>
      <template #footer>
        <div style="display: block; margin-left: auto">
          <CButton size="sm" color="success" @click="handleSetDateFormat()">
            Set Date
          </CButton>
        </div>
      </template>
    </CModal>
  </CRow>
</template>

<style>
.table-scroll-auto {
  height: 30vh;
  overflow-y: scroll;
  /* overflow-x: scroll; */
  white-space: nowrap; /* mencegah pemisahan kata pada teks */
}
th,
td {
  padding-top: 15px;
}
</style>
<script>
import { getConfDate } from "../../../resource/ConfDate";
import {
  getConfLayout,
  getLayoutIdentifier,
  getLayoutType,
  insertConfLayout,
  updateConfLayout,
} from "../../../resource/ConfLayout";
const reader = new FileReader();
import {
  capitalizeFirstLetter,
  getStringBetween,
  dynamicSort,
} from "../../../utils";

export default {
  name: "Customer",
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.page = 1;
    this.getGenerateType();
    this.getDateFromat();
    if (this.action != "Create") this.loadData();
  },
  data() {
    return {
      initialLoad: true,
      action: "",
      filter: {
        page: 1,
        limit: 10,
        StartDate: "",
        EndDate: "",
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: "",
      search: false,
      modalRefDate: false,
      listFormatDate: [],
      listType: [],
      selectedDate: null,
      // items: [],
      identifier: [],
      associated_content: [],
      uploadFile: { fileName: null, fileContent: null },
      // V2 API
      formData: {
        layout_name: "",
        itf_name: "",
        itf_content: "",
        layout_status: true,
        items: [
          // formType
        ],
      },
      formType: {
        generate_type_id: "",
        itf_var_name: "",
        associated_field: "",
        field_associated: [
          // formAssociated
        ],
      },
      formAssociated: {
        identifier_id: "",
        format_ref: "",
        table_name: null,
        column_name: null,
        order_number: null,
        identifier_AI: null,
        identifier_name: "",
      },
      // DONE
      associated_field: [
        {
          key: "action",
          label: " ",
        },
        {
          key: "identifier_AI",
          label: "AI",
        },
        {
          key: "identifier_name",
          label: "Name",
        },
      ],

      // DONE
      identifier_field: [
        {
          key: "action",
          label: " ",
        },
        {
          key: "identifier_AI",
          label: "AI",
        },
        {
          key: "identifier_name",
          label: "Name",
        },
      ],
      selectedIndex: null,
      selectedIdentifier: null,
      selectedAssociated: { flag_system: 1 },
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
    selectedIdentifier: {
      handler(n, o) {
        let idx = this.associated_content.findIndex(
          (it) => it.identifier_id === n
        );
        if (~idx) this.selectedAssociated = this.associated_content[idx];
      },
      deep: true,
    },
    selectedIndex: {
      async handler(n, o) {
        if (this.action === "Read") {
          return;
        } else if (n != o) {
          let row_selected = this.formData.items[n];
          if (row_selected.generate_type_id) {
            let type_id = row_selected.generate_type_id;
            await this.getIdentifier(type_id);
          } else {
            this.identifier = [];
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    /*
    START
    INI UNTUK SAAT UPLOAD IFT FILE
    */
    handleUploadFile(event) {
      let isiFile = event[0];
      if (isiFile != undefined) {
        let fileName = isiFile.name;
        $("#error-upload").text("");
        let ekstensiFile = fileName.split(".").reverse()[0];
        if (ekstensiFile.toLowerCase() != "itf") {
          $("#error-upload").text(
            `Your file is not ITF (${fileName}). Please select ITF file`
          );
        } else {
          $("#error-upload").text("");
          reader.onload = (e) => {
            this.formData.layout_name = fileName.replace(".itf", "");
            this.formData.itf_name = fileName;
            this.formData.itf_content = e.target.result;
            this.generateField(e.target.result);
          };
          reader.readAsText(isiFile);
        }
      } else {
        $("#error-upload").text("ITF file is required");
      }
    },
    generateField(string) {
      let arr_str = string.split(/\r?\n/);
      this.formData.items = [];
      let listLayout = [];
      for (const it of arr_str) {
        let _variable = getStringBetween({ string: it });
        if (_variable) {
          let _layout = JSON.parse(JSON.stringify(this.formType));
          _layout.itf_var_name = _variable;
          listLayout.push(_layout);
        }
      }
      listLayout.sort(dynamicSort("itf_var_name"));
      this.formData.items = listLayout;
    },
    /*
    END
    */

    /*
    START
    INI UNTUK SAAT PILIH TYPE
    */
    handleChangeType(index) {
      this.selectedIdentifier = null;
      this.formData.items[index].associated_field = "";
      this.formData.items[index].field_associated = [];
      let layout_selected = this.formData.items[index];
      this.getIdentifier(layout_selected.generate_type_id);
    },
    /*
    END
    */

    /*
    START
    INI UNTUK SAAT PILIH IDENTIFIER
    */
    handleSelectIdentifier(item, index) {
      let i = this.selectedIndex;
      let check_ai = this.identifier[index];
      check_ai.is_selected = !check_ai.selected;
      if (!check_ai.flag_system && check_ai.data_type == "Date") {
        check_ai.format_ref = this.listFormatDate[0].value;
        check_ai.format_ref_data = this.listFormatDate[0].label;
      }
      let lineParameter = this.formData.items[i];
      if (
        check_ai.generate_type === "single" &&
        lineParameter.field_associated.length > 0
      ) {
        lineParameter.field_associated = [check_ai];
      } else if (item.is_selected) {
        check_ai.order_number = lineParameter.field_associated.length;
        lineParameter.field_associated.push(check_ai);
      } else {
        let n = 0;
        for (const it of this.formData.items[i].field_associated) {
          if (it.identifier_id === item.identifier_id) {
            lineParameter.field_associated.splice(n, 1);
          }
          n += 1;
        }
      }
      this.formData.items[i] = lineParameter;
      this.associated_content = this.formData.items[i].field_associated;
      this.rewriteIdentifierText();
    },

    rewriteIdentifierText(i = this.selectedIndex) {
      let text = "";
      if (this.formData.items[i].field_associated.length > 0) {
        for (const it of this.formData.items[i].field_associated) {
          //
          if (it.identifier_AI) {
            text += "-" + it.identifier_AI;
          } else {
            text += "-" + it.identifier_name;
          }
        }
      } else {
        text = "Automatic";
      }
      let content = [...this.associated_content];
      this.associated_content = [];
      this.associated_content = content;
      text = text.trim();
      this.formData.items[i].associated_field = text.replace("-", "");
    },
    /*
    END
    */

    /*
    START
    INI UNTUK Associated Content
    */
    resetData() {
      this.selectedIdentifier = null;
      this.selectedAssociated = { flag_system: 1 };
    },
    editAssociatedField(index) {
      if (this.action === "Read") return;
      this.resetData();
      let layout_selected = this.formData.items[index];
      this.associated_content = layout_selected.field_associated ?? [];
    },
    handleSwipe(swipe) {
      let N = this.selectedIndex;
      if (this.selectedAssociated) {
        this.associated_content = [];
        let layout = this.formData.items[N].field_associated;
        let selected = this.selectedAssociated;
        let i = 0;
        Array.prototype.swapItems = function (a, b) {
          this[a] = this.splice(b, 1, this[a])[0];
          return this;
        };
        for (const it of layout) {
          if (selected.identifier_id == it.identifier_id) {
            if (swipe == "UP" && i > 0) {
              this.formData.items[N].field_associated.swapItems(i - 1, i);
            } else if (swipe == "DOWN" && i + 1 < layout.length) {
              this.formData.items[N].field_associated.swapItems(i, i + 1);
            }
            break;
          }
          i += 1;
        }
        this.associated_content = this.formData.items[N].field_associated;
        this.rewriteIdentifierText();
      }
    },
    handleConfigAssociated() {
      if (this.selectedAssociated) {
        if (this.selectedAssociated.data_type == "Date") {
          this.selectedDate = this.selectedAssociated.format_ref;
          this.modalRefDate = true;
        }
      }
    },
    handleSetDateFormat() {
      let i = this.selectedIndex;
      let associated = this.selectedAssociated;
      associated.format_ref = this.selectedDate;
      associated.format_ref_data = this.matchDate(this.selectedDate);
      let idx = this.formData.items[i].field_associated.findIndex(
        (it) => it.identifier_id == associated.identifier_id
      );
      if (~idx) this.formData.items[i].field_associated[idx] = associated;
      // for (const it of this.formData.items[i].field_associated) {
      //   if (it.identifier_id === associated.identifier_id) {
      //     this.formData.items[i].field_associated[n] = associated;
      //   }
      //   n += 1;
      // }
      this.modalRefDate = false;
      this.rewriteIdentifierText();
      this.rewriteIdentifierText();
    },
    matchDate(id) {
      let data = "";
      let idx = this.listFormatDate.findIndex((it) => it.value == id);
      if (~idx) return this.listFormatDate[idx].label;
      return data;
    },
    /*
    END
    */

    /*
    START
    Connect API
    */
    async getIdentifier(generate_type_id) {
      this.identifier = [];
      let _res = await getLayoutIdentifier({
        generate_type_id: generate_type_id,
      });
      if (_res) {
        this.identifier = _res.data;
      }
    },
    async getGenerateType() {
      this.listType = [];
      let _res = await getLayoutType();
      if (_res) {
        for (const it of _res.data) {
          this.listType.push({
            value: `${it.generate_type_id}`,
            label: it.generate_type_name,
          });
        }
      }
    },
    handleClickRow(index) {
      this.selectedIndex = index;
    },
    async getDateFromat() {
      this.listFormatDate = [];
      let _res = await getConfDate();
      if (_res) {
        for (const it of _res.data) {
          this.listFormatDate.push({
            value: `${it.df_id}`,
            label: it.df_name_overwrite,
          });
        }
      }
    },
    async loadData() {
      this.listFormatDate = [];
      let _res = await getConfLayout({ id: this.$route.params.id });
      if (_res) {
        let _data = _res.data;
        this.formData = _data[0];
        this.formData.layout_status = _data[0].layout_status ? true : false;
      }
    },
    /*
    END
    */

    validation() {
      let required = ["layout_name", "itf_name"];
      let next = true;
      for (const key in this.formData) {
        if (required.includes(key) && !this.formData[key]) next = false;
      }
      let required_item = ["generate_type_id", "associated_field"];
      if (this.formData.items.length == 0) next = false;
      for (const it of this.formData.items) {
        for (const req of required_item) {
          if (!it[req]) next = false;
        }
      }
      return next;
    },
    async save() {
      this.initialLoad = false;
      if (!this.validation()) {
        this.$toast.open({
          message: "Please input all the required data.",
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return;
      }
      let param = JSON.parse(JSON.stringify(this.formData));
      param.layout_status = param.layout_status ? 1 : 0;
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let dataPost = param;
        this.$isLoading(true);
        let res = {};
        if (dataPost.id) {
          res = await updateConfLayout(dataPost);
        } else {
          res = await insertConfLayout(dataPost);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res["error"]
            ? `${res["message"]}`
            : "Data has been saved succesfully ",
          type: res.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!res["error"]) this.$router.back();
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    identifier_list() {
      return this.identifier.map((item) => {
        let is_selected = false;
        let idn = this.formData.items[this.selectedIndex].field_associated;
        for (const it of idn) {
          if (item.identifier_id == it.identifier_id) {
            is_selected = true;
          }
        }
        return {
          ...item,
          identifier_AI: item.identifier_AI || "",
          is_selected: is_selected,
        };
      });
    },
    associated_list() {
      return this.associated_content.map((item) => {
        let title = `${item.identifier_name} ` + (item.format_ref_data || "");
        return {
          ...item,
          identifier_AI: item.identifier_AI || "",
          identifier_name: title,
        };
      });
    },
  },
};
</script>
