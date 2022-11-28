<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <CCol sm="12" md="12" lg="12" class="clearfix">
            <strong>List Configuration</strong>
            <CButton
              class="float-right"
              size="sm"
              color="success"
              @click="addNew()"
            >
              <CIcon name="cil-check-circle" /> Add
            </CButton>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CCol sm="12">
            <CInput
              v-on:keyup.enter="searchWorkflow"
              class="float-right"
              placeholder="Search..."
              v-model="keyword"
            />
          </CCol>

          <CDataTable
            tableFilter
            hover
            striped
            sorter
            :items="items"
            :fields="fields"
            :active-page="activePage"
            @row-clicked="rowClicked"
            :pagination="{ doubleArrows: false, align: 'center' }"
            @page-change="pageChange"
          >
            <template #action="">
              <td>
                <CButton color="danger" class="px-2">Edit</CButton>
              </td>
            </template>
          </CDataTable>
          <template>
            <CPagination
              :activePage.sync="page"
              :pages="totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: "Configuration",
  mounted() {
    // this.loadWorkflow(this.page)
  },
  data() {
    return {
      page: 1,
      totalPages: 0,
      keyword: "",
      items: [],
      fields: [
        {
          key: "auth_mode",
          label: "Authentication Mode",
          _classes: "font-weight-bold",
        },
        { key: "barcode_conf", label: "Barcode" },
        { key: "imei" },
        { key: "number_conf", label: "Number" },
        { key: "wh_qty", label: "Qty" },
        { key: "action", label: "Action", _classes: "font-weight-bold" },
      ],
      activePage: 1,
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
  },
  methods: {
    pageChange(page, number, reduced) {
      this.loadWorkflow(page);
    },
    loadWorkflow(page) {},
    searchWorkflow() {},
    getBadge(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "secondary";
        case "Pending":
          return "warning";
        case "Banned":
          return "danger";
        default:
          "primary";
      }
    },
    rowClicked(item, index) {
      this.$router.push({ path: `packaging/${item.id}` });
    },
    // pageChange (val) {
    //   this.$router.push({ query: { page: val }})
    // },
    addNew() {
      this.$router.push({ path: `add_configuration` });
    },
  },
};
</script>
