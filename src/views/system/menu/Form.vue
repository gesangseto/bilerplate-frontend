<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader
          ><h5>{{ $activeMenu.name }} [{{ route_action }}]</h5></CCardHeader
        >
        <CCardBody>
          <!-- MENU WEBSITE -->
          <!-- MENU WEBSITE -->
          <!-- MENU WEBSITE -->
          <!-- MENU WEBSITE -->
          <template>
            <CCard>
              <CCardHeader class="HeaderDashboard">
                <div class="float-left title-dashboard font-weight-bold">
                  Menu Website
                </div>
              </CCardHeader>
              <CCardBody style="padding: 0px">
                <div class="sticky-table-container">
                  <table class="sticky-table">
                    <thead>
                      <tr>
                        <th style="text-align: center">Parent Menu</th>
                        <th style="text-align: center">Child Menu</th>
                        <th style="text-align: center">Create</th>
                        <th style="text-align: center">Read</th>
                        <th style="text-align: center">Update</th>
                        <th style="text-align: center">Delete</th>
                        <th style="text-align: center">Print</th>
                        <th style="text-align: center">Approve</th>
                        <th style="text-align: center">Hide</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(item, index) in menuWeb">
                        <tr
                          :style="
                            index % 2 == 0
                              ? 'background-color:#ffffff;'
                              : 'background-color:#ededed;'
                          "
                        >
                          <td
                            v-if="index == item.start_menu_count"
                            :rowspan="item.count"
                            style="
                              padding-left: 10px;
                              border-bottom: 1px solid #7d7d7d;
                            "
                          >
                            {{ item.parent_label }}
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'padding-left: 10px;border-bottom: 1px solid #7d7d7d;'
                                : 'padding-left: 10px;'
                            "
                          >
                            {{ item.label }}
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              size="sm"
                              @click="handleChangeMenuWeb('show_create', index)"
                              :checked="item.show_create"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuWeb('show_read', index)"
                              size="sm"
                              :checked="item.show_read"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuWeb('show_update', index)"
                              size="sm"
                              :checked="item.show_update"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuWeb('show_delete', index)"
                              size="sm"
                              :checked="item.show_delete"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuWeb('show_print', index)"
                              size="sm"
                              :checked="item.show_print"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuWeb('show_approve', index)
                              "
                              size="sm"
                              :checked="item.show_approve"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuWeb('sa', index)"
                              size="sm"
                              :checked="item.sa"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </CCardBody>
            </CCard>
          </template>

          <!-- MENU ANDROID -->
          <!-- MENU ANDROID -->
          <!-- MENU ANDROID -->
          <!-- MENU ANDROID -->

          <template>
            <CCard>
              <CCardHeader class="HeaderDashboard">
                <div class="float-left title-dashboard font-weight-bold">
                  Menu Android
                </div>
              </CCardHeader>
              <CCardBody style="padding: 0px">
                <div class="sticky-table-container">
                  <table class="sticky-table">
                    <thead>
                      <tr>
                        <th style="text-align: center">Parent Menu</th>
                        <th style="text-align: center">Child Menu</th>
                        <th style="text-align: center">Hide</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(item, index) in menuAndroid">
                        <tr
                          :style="
                            index % 2 == 0
                              ? 'background-color:#ffffff;'
                              : 'background-color:#ededed;'
                          "
                        >
                          <td
                            v-if="index == item.start_menu_count"
                            :rowspan="item.count"
                            style="
                              padding-left: 10px;
                              border-bottom: 1px solid #7d7d7d;
                            "
                          >
                            Android
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'padding-left: 10px;border-bottom: 1px solid #7d7d7d;'
                                : 'padding-left: 10px;'
                            "
                          >
                            {{ item.label }}
                          </td>
                          <td
                            :style="
                              item.count + item.start_menu_count == index + 1
                                ? 'text-align: center;border-bottom: 1px solid #7d7d7d;'
                                : 'text-align: center;'
                            "
                          >
                            <CInputCheckbox
                              @click="handleChangeMenuAndroid('sa', index)"
                              size="sm"
                              :checked="item.sa"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </CCardBody>
            </CCard>
          </template>
          <!-- MENU STATION -->
          <!-- MENU STATION -->
          <!-- MENU STATION -->
          <!-- MENU STATION -->

          <template>
            <CCard>
              <CCardHeader class="HeaderDashboard">
                <div class="float-left title-dashboard font-weight-bold">
                  Menu Station
                </div>
              </CCardHeader>
              <CCardBody style="padding: 0px">
                <div class="sticky-table-container">
                  <table class="sticky-table">
                    <thead>
                      <tr>
                        <th style="text-align: center">Menu</th>
                        <th style="text-align: center">Access</th>
                        <th style="text-align: center">Approve</th>
                        <th style="text-align: center">Diff Approval</th>
                        <th style="text-align: center">Batch Active</th>
                        <th style="text-align: center">Batch Inactive</th>
                        <th style="text-align: center">Remark Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(item, index) in menuStation">
                        <tr
                          :style="
                            index % 2 == 0
                              ? 'background-color:#ffffff;'
                              : 'background-color:#ededed;'
                          "
                        >
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="{
                              paddingLeft:
                                (getLevel(menuStation, item) * 40 || 10) + 'px',
                            }"
                          >
                            {{ item.label }}
                          </td>

                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              size="sm"
                              @click="
                                handleChangeMenuStation('show_update', index)
                              "
                              :checked="item.show_update"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuStation('show_approve', index)
                              "
                              size="sm"
                              :checked="item.show_approve"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuStation('diff_approval', index)
                              "
                              size="sm"
                              :checked="item.diff_approval"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuStation('batch_active', index)
                              "
                              size="sm"
                              :checked="item.batch_active"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuStation('batch_inactive', index)
                              "
                              size="sm"
                              :checked="item.batch_inactive"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                          <td
                            :class="{ 'has-border': !item.mst_menu_id }"
                            :style="'text-align: center;'"
                          >
                            <CInputCheckbox
                              @click="
                                handleChangeMenuStation(
                                  'remarks_required',
                                  index
                                )
                              "
                              size="sm"
                              :checked="item.remarks_required"
                              style="margin-bottom: 30px; margin-top: 5px"
                            />
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </CCardBody>
            </CCard>
          </template>
          <!-- END OF TABLE -->
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" size="sm" color="primary" @click="save()">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { capitalizeFirstLetter } from '../../../utils';
import { getMstMenu, updateMstMenu } from '../../../resource/MstMenu';
import { CCard, CCardBody } from '@coreui/vue';

export default {
  name: 'AddRoles',
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      route_action: '',
      menuWeb: [],
      menuAndroid: [],
      menuStation: [],
    };
  },

  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    this.route_action = 'EDIT';
    this.loadData();
  },
  methods: {
    getLevel(menu, item) {
      let level = 0;
      let currentParent = item.mst_menu_id;
      while (currentParent) {
        const parent = menu.find((m) => m.id == currentParent);
        if (parent) {
          level++;
          currentParent = parent.mst_menu_id;
        } else {
          break;
        }
      }
      return level;
    },
    // Using a conditional statement
    stringToBoolean(str) {
      if (!str) return false;
      if (str.toLowerCase() === 'true') {
        return true;
      } else if (
        str.toLowerCase() === 'false' ||
        str === '0' ||
        str === 'null' ||
        str === 'undefined'
      ) {
        return false;
      } else {
        return !!str; // Default for other truthy/falsey values
      }
    },
    async loadData() {
      let param = {};
      let _res = await getMstMenu(param);
      if (!_res) return;

      let data = _res.data;

      // filter menu berdasarkan type
      this.menuWeb = this.reformatingMenu(data.filter((it) => it.type == 0));
      this.menuAndroid = this.reformatingMenu(
        data.filter((it) => it.type == 1)
      );
      this.menuStation = this.reformatStationMenu(
        data.filter((it) => it.type == 2)
      );
      console.log(this.menuStation);
    },
    handleChangeMenuWeb(name, index) {
      this.menuWeb[index][name] = !this.menuWeb[index][name];
    },
    handleChangeMenuAndroid(name, index) {
      this.menuAndroid[index][name] = !this.menuAndroid[index][name];
    },
    handleChangeMenuStation(name, index) {
      this.menuStation[index][name] = !this.menuStation[index][name];
    },
    reformatingMenu(items = []) {
      let nestedMenu = [];
      let start_menu_count = 0;
      let parents = items.filter((it) => !it.mst_menu_id);
      for (const parent of parents) {
        let children = items.filter((it) => it.mst_menu_id == parent.id);
        let count = children.length;
        //Jika memiliki anak maka kesini
        if (children.length > 0) {
          for (const child of children) {
            let temp = child;
            temp.parent_label = parent.label;
            temp.parent_id = parent.id;
            temp.count = count;
            temp.start_menu_count = start_menu_count;
            nestedMenu.push(temp);
          }
        } else {
          // Handle Menu Without Child
          count = 1;
          let temp = parent;
          temp.parent_label = parent.label;
          temp.parent_id = parent.id;
          temp.count = count;
          temp.start_menu_count = start_menu_count;
          nestedMenu.push(temp);
          // END Handle Menu Without Child
        }
        start_menu_count = start_menu_count + count;
      }
      return nestedMenu;
    },
    reformatStationMenu(items = [], parentId = null) {
      let result = [];
      items
        .filter((item) => item.mst_menu_id === parentId)
        .forEach((parent) => {
          result.push(parent);
          // recursive ke anak
          result = result.concat(this.reformatStationMenu(items, parent.id));
        });
      return result;
    },

    cancel() {
      this.$router.back();
    },
    async save() {
      let params = [...this.menuWeb, ...this.menuAndroid, ...this.menuStation];
      var message = `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await updateMstMenu(params);
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
          this.loadData();
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

.table-container {
  /* max-height: 520px; */
  overflow-y: auto;
}
.sticky-table-container {
  max-height: 400px; /* atur tinggi sesuai kebutuhan */
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
