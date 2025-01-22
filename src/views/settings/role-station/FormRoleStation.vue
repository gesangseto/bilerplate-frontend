<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader
          ><h5>{{ $activeMenu.name }} [{{ route_action }}]</h5></CCardHeader
        >
        <CCardBody>
          <CRow style="margin: 10px 0">
            <CCol sm="12">
              <CInput
                :disabled="true"
                horizontal
                v-model="role.department_name"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Department
                    <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CInput>
            </CCol>
            <CCol sm="12">
              <CInput :disabled="true" horizontal v-model="role.section_name">
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Section
                    <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CInput>
            </CCol>
          </CRow>
          <CRow style="margin: 10px 0" v-if="action != 'Read'">
            <CCol sm="3"> Check All </CCol>
            <CCol sm="9">
              <CInputCheckbox
                class="float-left"
                :checked.sync="check_all"
                @update:checked="checkAll()"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="7"></CCol>
            <CCol md="4">
              <input
                v-on:keyup="handleSearchInput()"
                v-model="keyword"
                class="form-control float-right"
                placeholder="Search by Parent or Child Menu..."
              />
            </CCol>
            <CCol md="1">
              <CButton
                class="float-left"
                color="default"
                v-on:click="handleSearchInput()"
              >
                <v-icon name="search" /> </CButton
            ></CCol>
          </CRow>
          <br />
          <template>
            <div class="table-container">
              <table class="sticky-table">
                <thead>
                  <tr>
                    <th v-if="!search" style="text-align: center">
                      Parent Menu
                    </th>
                    <th style="text-align: center">Child Menu</th>
                    <th style="text-align: center">Access</th>
                    <th style="text-align: center">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(child, key) in menu">
                    <tr
                      :style="
                        key % 2 == 0
                          ? 'background-color:#ffffff;'
                          : 'background-color:#ededed;'
                      "
                    >
                      <td
                        v-if="key == child.start_menu_count && !search"
                        :rowspan="child.count"
                        style="
                          padding-left: 10px;
                          border-bottom: 1px solid #7d7d7d;
                        "
                      >
                        {{ child.parent_label }}
                      </td>
                      <td
                        :style="
                          child.count + child.start_menu_count == key + 1
                            ? 'padding-left: 10px;border-bottom: 1px solid #7d7d7d;'
                            : 'padding-left: 10px;'
                        "
                      >
                        {{ child.label }}
                      </td>
                      <td
                        :style="
                          child.count + child.start_menu_count == key + 1
                            ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                            : 'text-align: center;'
                        "
                      >
                        <CInputCheckbox
                          v-if="child.show_update === 1"
                          :disabled="action == 'Read' ? true : false"
                          @click="clickUpdate('edit', key)"
                          size="sm"
                          :checked="child.can_edit"
                          style="margin-bottom: 30px; margin-top: 5px"
                        />
                      </td>
                      <td
                        :style="
                          child.count + child.start_menu_count == key + 1
                            ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                            : 'text-align: center;'
                        "
                      >
                        <CInputCheckbox
                          v-if="child.show_update === 1"
                          :disabled="action == 'Read' ? true : false"
                          @click="clickUpdate('approve', key)"
                          size="sm"
                          :checked="child.can_approve"
                          style="margin-bottom: 30px; margin-top: 5px"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
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
</template>

<style scoped>
.table-container {
  /* max-height: 520px; */
  overflow-y: auto;
}

.sticky-table {
  width: 100%;
}

.sticky-table thead tr {
  position: sticky;
  top: 0;
  background: #3266a8; /* Latar belakang header untuk menutupi konten saat scroll */
  z-index: 1; /* Pastikan header berada di atas konten */
  color: white;
}

.sticky-table th {
  padding: 10px;
  border: 1px solid #ddd;
}

.sticky-table td {
  padding: 10px;
  border: 1px solid #ddd;
}
</style>
<script>
import { capitalizeFirstLetter } from '../../../utils';
import {
  getMstSectionRole,
  updateMstSectionRole,
} from '../../../resource/MstSectionRole';

export default {
  name: 'FormRoleStation',
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      route_action: '',
      readOnlyItem: false,
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      departments: [],
      optionSections: [],
      body: {},
      action: '',
      idRoles: null,
      check_all: false,
      role: [],
      menu: [],
      defaultMenu: [],
      fields: [
        { key: 'parent_label', label: 'Parent Menu' },
        { key: 'label', label: 'Child Menu' },
        // { key: "check_all", label: "All" },
        { key: 'can_view', label: 'View' },
        { key: 'can_add', label: 'Add' },
        { key: 'can_edit', label: 'Edit' },
        { key: 'can_delete', label: 'Delete' },
        { key: 'can_print', label: 'Print' },
        { key: 'can_approve', label: 'Approve' },
        // {key: 'action', label: 'Action'},
      ],
    };
  },

  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    handleSearchInput() {
      this.search = false;
      this.menu = this.defaultMenu;
      if (this.keyword) {
        this.search = true;
        let search_menu = [];
        let key = this.keyword.toLowerCase();
        for (const it of this.defaultMenu) {
          let parent_label = it.parent_label.toLowerCase();
          let label = it.label.toLowerCase();
          if (parent_label.includes(`${key}`)) {
            search_menu.push(it);
          } else if (label.includes(`${key}`)) {
            search_menu.push(it);
          }
        }
        this.menu = search_menu;
      }
    },
    async loadData() {
      let param = { type: 2, id: this.$route.params.id };
      let _res = await getMstSectionRole(param);
      if (!_res) return;
      let data = _res.data[0];
      this.role = data;
      let nestedMenu = [];
      let start_menu_count = 0;
      for (const parent of data.role_menu) {
        let count = parent.children.length;
        if (!parent.link) {
          for (const child of parent.children) {
            let temp = child;
            temp.can_add = child.can_add == 'true' ? true : false;
            temp.can_view = child.can_view == 'true' ? true : false;
            temp.can_edit = child.can_edit == 'true' ? true : false;
            temp.can_delete = child.can_delete == 'true' ? true : false;
            temp.can_print = child.can_print == 'true' ? true : false;
            temp.can_approve = child.can_approve == 'true' ? true : false;
            temp.parent_label = parent.label;
            temp.parent_id = parent.id;
            temp.count = count;
            temp.start_menu_count = start_menu_count;
            temp.can_all = false;
            if (
              child.can_add &&
              child.can_view &&
              child.can_edit &&
              child.can_delete &&
              child.can_print &&
              child.can_approve
            ) {
              temp.can_all = true;
            }
            nestedMenu.push(temp);
          }
        } else {
          // Handle Menu Without Child
          count = 1;
          let temp = parent;
          temp.can_add = parent.can_add == 'true' ? true : false;
          temp.can_view = parent.can_view == 'true' ? true : false;
          temp.can_edit = parent.can_edit == 'true' ? true : false;
          temp.can_delete = parent.can_delete == 'true' ? true : false;
          temp.can_print = parent.can_print == 'true' ? true : false;
          temp.can_approve = parent.can_approve == 'true' ? true : false;
          temp.parent_label = parent.label;
          temp.parent_id = parent.id;
          temp.count = count;
          temp.start_menu_count = start_menu_count;
          temp.can_all = false;
          if (
            parent.can_add &&
            parent.can_view &&
            parent.can_edit &&
            parent.can_delete &&
            parent.can_print &&
            parent.can_approve
          ) {
            temp.can_all = true;
          }
          nestedMenu.push(temp);
          // END Handle Menu Without Child
        }
        start_menu_count = start_menu_count + count;
      }
      this.defaultMenu = nestedMenu;
      this.menu = nestedMenu;
    },
    clickUpdate(type, key) {
      if (type == 'edit') {
        this.menu[key].can_edit = !this.menu[key].can_edit;
        this.defaultMenu[key].can_edit = this.menu[key].can_edit;
      } else if (type == 'approve') {
        this.menu[key].can_approve = !this.menu[key].can_approve;
        this.defaultMenu[key].can_approve = this.menu[key].can_approve;
      }
    },
    checkAll() {
      let newMenu = [];
      for (const it of this.menu) {
        let temp = it;
        temp.can_add = this.check_all;
        temp.can_view = this.check_all;
        temp.can_edit = this.check_all;
        temp.can_delete = this.check_all;
        temp.can_print = this.check_all;
        temp.can_approve = this.check_all;
        temp.can_all = this.check_all;
        newMenu.push(temp);
      }
      this.menu = newMenu;
      this.defaultMenu = newMenu;
    },

    pageSizeChange() {
      this.page = 1;
      this.loadData();
    },
    pageChange(page) {
      this.page = page;
      this.loadData();
    },
    loadDetailRoles() {
      this.search = false;
      this.loadData();
    },

    searchData() {
      this.search = true;
      this.page = 1;
      this.loadData();
    },
    cancel() {
      this.$router.back();
    },
    async save() {
      let _form_data = JSON.parse(JSON.stringify(this.menu));
      let newMenu = [];
      for (const it of _form_data) {
        let temp = it;
        temp.can_add = `${it.can_add}`;
        temp.can_view = `${it.can_view}`;
        temp.can_edit = `${it.can_edit}`;
        temp.can_delete = `${it.can_delete}`;
        temp.can_print = `${it.can_print}`;
        temp.can_approve = `${it.can_approve}`;
        temp.can_all = `${it.can_all}`;
        newMenu.push(temp);
      }

      let dataPost = {
        id: this.role.id,
        type: 2,
        section_id: this.role.section_id,
        department_id: this.role.department_id,
        role_menu: newMenu,
      };
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await updateMstSectionRole(dataPost);
        this.$isLoading(false);
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
          this.items = [];
          dataPost = [];
          this.$router.back();
        }
      }
      return;
    },
  },

  computed: {
    detail() {
      return this.menu.map((item) => {
        return {
          ...item,
          parentLabel: item.parentLabel ? item.parentLabel : '',
        };
      });
    },
  },
};
</script>
