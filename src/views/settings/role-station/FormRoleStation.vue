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
            <div class="sticky-table-container">
              <table class="sticky-table">
                <thead>
                  <tr>
                    <th style="text-align: center">Menu</th>
                    <th style="text-align: center">Access</th>
                    <th style="text-align: center">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in menu">
                    <tr
                      :style="
                        index % 2 == 0
                          ? 'background-color:#ffffff;'
                          : 'background-color:#ededed;'
                      "
                    >
                      <td
                        :class="{ 'has-border': !item.mst_menu_id }"
                        :style="{ paddingLeft: getLevel(item) * 40 + 'px' }"
                      >
                        {{ item.label }}
                      </td>
                      <td
                        :class="{ 'has-border': !item.mst_menu_id }"
                        style="text-align: center"
                      >
                        <CInputCheckbox
                          v-if="item.show_update"
                          :disabled="action == 'Read' ? true : false"
                          @click="clickUpdate('edit', index)"
                          size="sm"
                          :checked="item.can_edit"
                          style="margin-bottom: 30px; margin-top: 5px"
                        />
                      </td>
                      <td
                        :class="{ 'has-border': !item.mst_menu_id }"
                        :style="'text-align: center;'"
                      >
                        <CInputCheckbox
                          v-if="item.show_approve"
                          :disabled="action == 'Read' ? true : false"
                          @click="clickUpdate('approve', index)"
                          size="sm"
                          :checked="item.can_approve"
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
.has-border {
  border-top: 1px solid #000;
  font-weight: bold;
}
.table-container {
  /* max-height: 520px; */
  overflow-y: auto;
}
.sticky-table-container {
  max-height: 500px; /* atur tinggi sesuai kebutuhan */
  overflow-y: auto;
  display: block;
}

.sticky-table {
  width: 100%;
  border-collapse: collapse;
}

.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: #f9f9f9; /* opsional agar sticky terlihat */
  z-index: 2;
}
</style>
<script>
import { capitalizeFirstLetter, getProfile, handleBack } from '../../../utils';
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
      userInfo: getProfile(),
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
    getLevel(item) {
      let level = 0;
      let currentParent = item.mst_menu_id;
      while (currentParent) {
        const parent = this.menu.find((m) => m.menu_id === currentParent);
        if (parent) {
          level++;
          currentParent = parent.mst_menu_id;
        } else {
          break;
        }
      }
      return level;
    },
    handleSearchInput() {
      this.search = false;
      this.menu = this.defaultMenu;
      if (this.keyword) {
        this.search = true;
        let search_menu = [];
        let key = this.keyword.toLowerCase();
        for (const it of this.defaultMenu) {
          let label = it.label.toLowerCase();
          if (label.includes(`${key}`)) {
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
      const flattingMenu = (menus = Array) => {
        let thisMenu = [];
        for (const it of menus) {
          it.can_add = it.can_add == 'true' ? true : false;
          it.can_view = it.can_view == 'true' ? true : false;
          it.can_edit = it.can_edit == 'true' ? true : false;
          it.can_delete = it.can_delete == 'true' ? true : false;
          it.can_print = it.can_print == 'true' ? true : false;
          it.can_approve = it.can_approve == 'true' ? true : false;
          thisMenu.push(it);
          if (it.children && Array.isArray(it.children)) {
            thisMenu = [...thisMenu, ...flattingMenu(it.children)];
          }
        }
        return thisMenu;
      };

      let nestedMenu = flattingMenu(data.role_menu);
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
      handleBack(this.$router, this.$route);
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
          handleBack(this.$router, this.$route);
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
