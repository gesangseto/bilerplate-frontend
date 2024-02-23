<template>
  <CRow>
    <CCol col="8" xl="8">
      <CCard>
        <CCardHeader>
          <h5>
            Label Layout [{{
              this.action == 'Create'
                ? 'ADD'
                : this.action == 'Read'
                ? 'VIEW'
                : 'EDIT'
            }}]
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="12">
              <CInputFile
                :placeholder="
                  formData.itf_name ? formData.itf_name : 'Choose file...'
                "
                :disabled="action === 'Read'"
                horizontal
                custom
                accept=".itf,.csv"
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
                    Layout File
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
                v-model="formData.name"
                horizontal
                :is-valid="initialLoad ? null : !formData.name ? false : true"
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
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12">
              <CSelect
                :disabled="action == 'Read'"
                label="Packaging Level"
                :options="[1, 2, 3, 4]"
                :value.sync="formData.packaging_level"
                horizontal
                :is-valid="
                  initialLoad ? null : !formData.packaging_level ? false : true
                "
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12"
              ><CInput
                :disabled="true"
                v-model="formData.bpom_barcode_format"
                horizontal
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.bpom_barcode_format
                    ? false
                    : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Barcode Format (BPOM)
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
                <th style="text-align: center; width: 15%">Type</th>
                <th style="text-align: center; width: 40%">Associated Field</th>
                <th style="text-align: center; width: 15%">As Barcode</th>
              </thead>

              <tbody
                v-for="(item, index) in formData.items"
                :key="index"
                style="padding: 1px"
              >
                <tr
                  v-bind:style="
                    selectedIndex == index ? 'background-color: #6ba1e3' : ''
                  "
                  @click="handleClickRow(index)"
                >
                  <td style="align: center; padding-left: 20px">
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
                      :horizontal="{ input: 'col-md-12' }"
                      :value.sync="item.layout_generate_type_id"
                      inline
                      @change="handleChangeType(index)"
                      @click="editAssociatedField((selectedIndex = index))"
                      :is-valid="
                        initialLoad
                          ? null
                          : !item.layout_generate_type_id
                          ? false
                          : true
                      "
                    />
                  </td>
                  <td style="padding-right: 20px">
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
                  <td>
                    <CInputCheckbox
                      v-if="item.layout_generate_type === 'AI'"
                      :disabled="action === 'Read'"
                      :checked.sync="item.set_bpom_barcode_format"
                      size="sm"
                      class="center-checkbox"
                      @change="handleCheckBarcodeFormat(item, index)"
                    />
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
          <ButtonBack />
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
                  :table-row-height="5"
                  :items="identifier_list"
                  :fields="identifier_field"
                >
                  <template #action="{ item, index }">
                    <td>
                      <CInputCheckbox
                        :checked.sync="item.is_selected"
                        size="sm"
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
              <CDataTable
                striped
                class="table-associated-content"
                hover
                :items="associated_list"
                :fields="associated_field"
              >
                <template #action="{ item }">
                  <td>
                    <input
                      type="radio"
                      :value="item.layout_identifier_id"
                      v-model="selectedIdentifier"
                    />
                  </td>
                </template>
              </CDataTable>
              <br />
              <CButton
                :disabled="action == 'Read'"
                size="sm"
                color="primary"
                @click="handleSwipe('UP')"
              >
                <v-icon name="arrow-up" />
              </CButton>
              &nbsp;
              <CButton
                :disabled="action == 'Read'"
                size="sm"
                color="primary"
                @click="handleSwipe('DOWN')"
              >
                <v-icon name="arrow-down" />
              </CButton>
              &nbsp;
              <CButton
                :disabled="
                  action == 'Read'
                    ? true
                    : selectedAssociated.flag_system
                    ? true
                    : false
                "
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
        <div class="form-group row mb-2">
          <label
            for="product-name"
            class="col-sm-3 col-md-3 col-lg-3 form-label"
          >
            Date Format <strong class="text-danger">*</strong>
          </label>
          <div class="col-sm-9 col-md-9 col-lg-9">
            <model-select
              :options="listFormatDate"
              v-model="vSelectDate"
              placeholder="--Select--"
            >
            </model-select>
          </div>
        </div>
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
.table-scroll-auto td {
  padding-top: 5px;
  padding-bottom: 5px;
}
.table-associated-content {
  height: 30vh;
  overflow-y: scroll;
  /* overflow-x: scroll; */
  white-space: nowrap; /* mencegah pemisahan kata pada teks */
}
.table-associated-content td {
  padding-top: 10px;
  padding-bottom: 10px;
}
th,
td {
  padding-top: 15px;
}
.center-checkbox {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script>
import { ModelSelect } from 'vue-search-select';
import moment from 'moment';
import { getConfDate } from '../../../resource/ConfDate';
import {
  getConfLayout,
  getLayoutIdentifier,
  getLayoutType,
  insertConfLayout,
  updateConfLayout,
} from '../../../resource/ConfLayout';
const reader = new FileReader();
import {
  capitalizeFirstLetter,
  getStringBetween,
  dynamicSort,
} from '../../../utils';

export default {
  components: { ModelSelect },
  name: 'Customer',
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.page = 1;
    this.getGenerateType();
    this.getDateFromat();
    // if (this.action != "Create") this.loadData();
    if (this.$route.params.id !== undefined) this.loadData();
  },
  data() {
    return {
      cursor: `url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='32px' height='32px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E %3Cpath d='M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4 L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1 c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1 c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z'/%3E %3C/svg%3E"), pointer`,
      initialLoad: true,
      action: '',
      filter: {
        page: 1,
        limit: 10,
        StartDate: '',
        EndDate: '',
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      modalRefDate: false,
      listFormatDate: [],
      listType: [],
      selectedDate: null,
      vSelectDate: null,
      list_packaging: [
        { value: 1, name: '1', label: `1` },
        { value: 1, name: '2', label: `2` },
        { value: 1, name: '3', label: `3` },
        { value: 1, name: '4', label: `4` },
      ],
      // items: [],
      identifier: [],
      associated_content: [],
      uploadFile: { fileName: null, fileContent: null },
      // V2 API
      formData: {
        name: '',
        packaging_level: 1,
        itf_name: '',
        itf_content: '',
        bpom_barcode_format: '',
        layout_status: true,
        items: [
          // formType
        ],
      },
      formType: {
        layout_generate_type_id: '',
        itf_var_name: '',
        set_bpom_barcode_format: false,
        associated_field: '',
        field_associated: [
          // formAssociated
        ],
      },
      formAssociated: {
        layout_identifier_id: '',
        format_ref: '',
        table_name: null,
        column_name: null,
        order_number: null,
        identifier_AI: null,
        identifier_name: '',
      },
      // DONE
      associated_field: [
        {
          key: 'action',
          label: ' ',
        },
        {
          key: 'AI',
          label: 'AI',
        },
        {
          key: 'name',
          label: 'Name',
        },
      ],

      // DONE
      identifier_field: [
        {
          key: 'action',
          label: ' ',
        },
        {
          key: 'AI',
          label: 'AI',
        },
        {
          key: 'name',
          label: 'Name',
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
      handler(n) {
        let idx = this.associated_content.findIndex(
          (it) => it.layout_identifier_id === n
        );
        if (~idx) this.selectedAssociated = this.associated_content[idx];
      },
      deep: true,
    },
    selectedIndex: {
      async handler(n, o) {
        if (this.action === 'Read') {
          return;
        } else if (n != o) {
          let row_selected = this.formData.items[n];
          if (row_selected.layout_generate_type_id) {
            let type_id = row_selected.layout_generate_type_id;
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
        let ekstensiFile = fileName.split('.').reverse()[0];
        reader.onload = (e) => {
          this.formData.name = fileName.replace('.itf', '');
          this.formData.itf_name = fileName;
          this.formData.itf_content = e.target.result;
          this.generateField(e.target.result, ekstensiFile);
        };
        reader.readAsText(isiFile);
      } else {
        return;
      }
    },

    generateField(string, extensi) {
      let arr_str = string.split(/\r?\n/);
      this.formData.items = [];
      let listLayout = [];
      if (extensi === 'itf') {
        for (const it of arr_str) {
          let _variable = getStringBetween({ string: it });
          if (_variable) {
            let _layout = JSON.parse(JSON.stringify(this.formType));
            _layout.itf_var_name = _variable;
            listLayout.push(_layout);
          }
        }
        listLayout.sort(dynamicSort('itf_var_name'));
        this.formData.items = listLayout;
      } else if (extensi === 'csv') {
        for (const it of arr_str) {
          if (it) {
            let _layout = JSON.parse(JSON.stringify(this.formType));
            _layout.itf_var_name = it;
            listLayout.push(_layout);
          }
        }
        listLayout.sort(dynamicSort('itf_var_name'));
        this.formData.items = listLayout;
      }
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
      this.formData.items[index].associated_field = '';
      this.formData.items[index].field_associated = [];
      let layout_selected = this.formData.items[index];
      this.getIdentifier(layout_selected.layout_generate_type_id);
      let type = this.listType.find(
        (it) => it.value == layout_selected.layout_generate_type_id
      );
      this.formData.items[index].layout_generate_type = type.code;
    },
    /*
    END
    */
    handleCheckBarcodeFormat(item, index) {
      let n = 0;

      let newData = [];
      for (const it of this.formData.items) {
        if (n != index) {
          it.set_bpom_barcode_format = false;
        }
        n += 1;
        newData.push(it);
      }
      this.formData.items = newData;
      this.formData.bpom_barcode_format = item.associated_field;
    },
    /*
    START
    INI UNTUK SAAT PILIH IDENTIFIER
    */
    handleSelectIdentifier(item, index) {
      let i = this.selectedIndex;
      let check_ai = this.identifier[index];
      check_ai.is_selected = !check_ai.selected;
      if (!check_ai.flag_system && check_ai.data_type == 'Date') {
        let listDate = this.listFormatDate.find(
          (it) => it.value == check_ai.format_ref
        );
        if (listDate) {
          check_ai.format_ref = listDate.value;
          check_ai.format_ref_data = listDate.label;
        } else {
          check_ai.format_ref = this.listFormatDate[0].value;
          check_ai.format_ref_data = this.listFormatDate[0].label;
        }
      }
      let lineParameter = this.formData.items[i];
      if (
        check_ai.generate_type === 'single' &&
        lineParameter.field_associated.length > 0
      ) {
        lineParameter.field_associated = [check_ai];
      } else if (item.is_selected) {
        check_ai.order_number = lineParameter.field_associated.length;
        lineParameter.field_associated.push(check_ai);
      } else {
        let n = 0;
        for (const it of this.formData.items[i].field_associated) {
          if (it.layout_identifier_id === item.layout_identifier_id) {
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
      let text = '';
      if (this.formData.items[i].field_associated.length > 0) {
        for (const it of this.formData.items[i].field_associated) {
          //
          if (it.layout_identifier_AI) {
            text += '-' + it.layout_identifier_AI;
          } else {
            text += '-' + it.layout_identifier_name;
          }
        }
      } else {
        text = 'Automatic';
      }
      let content = [...this.associated_content];
      this.associated_content = [];
      this.associated_content = content;
      text = text.trim();
      this.formData.items[i].associated_field = text.replace('-', '');
      // console.log(text);
      // this.formData.bpom_barcode_format = text.replace('-', '');
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
      // if (this.action === "Read") return;
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
          if (selected.layout_identifier_id == it.layout_identifier_id) {
            if (swipe == 'UP' && i > 0) {
              this.formData.items[N].field_associated.swapItems(i - 1, i);
            } else if (swipe == 'DOWN' && i + 1 < layout.length) {
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
      let idx = this.listFormatDate.findIndex(
        (it) => this.selectedAssociated.format_ref === it.value
      );
      if (~idx) {
        this.vSelectDate = this.listFormatDate[idx].value;
      } else {
        this.vSelectDate = null;
      }

      if (this.selectedAssociated) {
        if (this.selectedAssociated.data_type == 'Date') {
          this.selectedDate = this.selectedAssociated.format_ref;
          this.modalRefDate = true;
        }
      }
    },

    handleSetDateFormat() {
      this.selectedDate = this.vSelectDate;
      let i = this.selectedIndex;
      let associated = this.selectedAssociated;
      associated.format_ref = this.selectedDate;
      associated.format_ref_data = this.matchDate(this.selectedDate);
      let idx = this.formData.items[i].field_associated.findIndex(
        (it) => it.layout_identifier_id == associated.layout_identifier_id
      );
      if (~idx) this.formData.items[i].field_associated[idx] = associated;
      // for (const it of this.formData.items[i].field_associated) {
      //   if (it.layout_identifier_id === associated.layout_identifier_id) {
      //     this.formData.items[i].field_associated[n] = associated;
      //   }
      //   n += 1;
      // }
      this.modalRefDate = false;
      this.vSelectDate = null;
      this.rewriteIdentifierText();
      this.rewriteIdentifierText();
    },
    matchDate(id) {
      let data = '';
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
    async getIdentifier(layout_generate_type_id) {
      this.identifier = [];
      let _res = await getLayoutIdentifier({
        layout_generate_type_id: layout_generate_type_id,
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
          this.listType.push({ ...it, value: `${it.id}`, label: it.name });
        }
      }
    },
    handleClickRow(index) {
      this.selectedIndex = index;
    },
    async getDateFromat() {
      this.listFormatDate = [];
      let _res = await getConfDate({ status: 'Active' });
      if (_res) {
        for (const it of _res.data) {
          let dt = '';
          if (it.overwrite === 'last_day_of_month') {
            dt = moment().endOf('month').format(it.name);
          } else if (it.overwrite === 'first_day_of_month') {
            dt = moment().startOf('month').format(it.name);
          } else {
            dt = moment().format(it.name);
          }
          dt = dt.toUpperCase();
          this.listFormatDate.push({
            id: `${it.id}`,
            value: `${it.id}`,
            label: `${it.name_overwrite} - ${dt}`,
            text: `${it.name_overwrite} - ${dt}`,
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
        for (var i = 0; i < this.formData.items.length; i++) {
          if (
            this.formData.items[i].associated_field ==
            this.formData.bpom_barcode_format
          ) {
            this.formData.items[i].set_bpom_barcode_format = true;
            i = this.formData.items;
          }
        }
      }
    },
    /*
    END
    */

    validation() {
      let required = ['name', 'itf_name'];
      let next = true;
      for (const key in this.formData) {
        if (required.includes(key) && !this.formData[key]) next = false;
      }
      let required_item = ['layout_generate_type_id', 'associated_field'];
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
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
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
        if (this.action === 'Create' && dataPost.id) {
          delete dataPost.id;
        }
        if (dataPost.id) {
          res = await updateConfLayout(dataPost);
        } else {
          res = await insertConfLayout(dataPost);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved succesfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.back();
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
          if (item.layout_identifier_id == it.layout_identifier_id) {
            is_selected = true;
          }
        }
        return {
          ...item,
          AI: item.layout_identifier_AI || '',
          is_selected: is_selected,
        };
      });
    },
    associated_list() {
      return this.associated_content.map((item) => {
        let idx = this.listFormatDate.findIndex(
          (o) => o.value == item.format_ref
        );
        if (~idx) item.format_ref_data = this.listFormatDate[idx].label;

        let title =
          `${item.layout_identifier_name} ` + (item.format_ref_data || '');
        return {
          ...item,
          AI: item.layout_identifier_AI || '',
          name: title,
        };
      });
    },
  },
};
</script>
