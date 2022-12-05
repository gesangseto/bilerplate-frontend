<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Packing [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CRow>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">ID</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.full_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Remark</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="repack.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Warehouse</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.warehouse_name"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td>Packaging Level</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="repack.packaging_level"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Name</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="
                            repack[`name_packaging_l${repack.packaging_level}`]
                          "
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="12" md="12" lg="12">
                  <ButtonPermission
                    v-if="can_print_all == true"
                    :permission="'print'"
                    :buttonProperty="print_buttonProperty"
                    @click="printAllV3()"
                  />
                  &nbsp;

                  <ButtonPermission
                    v-if="can_print_all == true"
                    :permission="'print'"
                    :buttonProperty="print_buttonProperty2"
                    @click="printAllV3('zpl_mode')"
                  />
                </CCol>
              </CRow>

              <CDataTable
                tableFilter
                hover
                striped
                sorter
                border
                :items="detailRepack"
                :fields="fieldItem"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :buttonProperty="btn_printProp"
                      v-if="item.trx_pack_gtin_sscc"
                      :permission="'print'"
                      @click="printV3(item, index)"
                    />
                    &nbsp;
                    <ButtonPermission
                      v-if="user_id == 0"
                      :buttonProperty="btn_printProp2"
                      :permission="'print'"
                      @click="selected_data = item"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="reset"
            size="sm"
            class="m-1 float-right"
            color="primary"
            @click="cancel()"
          >
            <CIcon name="cil-arrow-left" /> Back
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <ModalPrintLabelV3
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import $axiosSupport from "../../../apiSupport";
import { printLabelV3 } from "../../../utils";

export default {
  name: "DetailPacking",
  mounted() {
    this.action = this.$route.params.type == "read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      let param = { id: this.$route.params.id, raw: true };
      let url = `/v3/transaction/packing?${new URLSearchParams(param)}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.repack = data;
        if (data.items.length > 0) {
          this.items = data.items;
          for (const it of data.items) {
            console.log(it);
            if (!it.trx_pack_gtin_sscc) {
              this.can_print_all = false;
            }
          }
        } else {
          this.$toast.open({
            message: `No data to be viewed`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        }
      });
    }
  },
  data() {
    return {
      user_id: localStorage.getItem("user_id"),
      action: "",
      print_buttonProperty: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: "print",
        text: "Print All",
        tooltip: "Print all label",
      },
      print_buttonProperty2: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "print",
        text: "Print All",
        tooltip: "Print all label",
      },
      btn_printProp: {
        size: "sm",
        class: "float-right",
        color: "secondary",
        icon: "print",
        text: "",
        tooltip: "Print this label",
      },
      btn_printProp2: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "print",
        text: "",
        tooltip: "Print V2",
      },
      selected_data: {},
      can_print_all: true,
      datas: [],
      viewModal: false,
      view: {
        productId: "",
        productName: "",
        batch: "",
        serial: [],
        gtin: "",
        nie: "",
        expiredDate: "",
      },
      sn: false,
      test: null,
      status: "",
      repack: {
        id: "",
        warehouse: "",
        remark: "",
        reason: "",
        date: "",
        serialNo: "",
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: "",
      search: false,
      items: [],
      darkModal: false,
      fieldItem: [
        {
          key: "no",
          label: "Item No",
        },
        {
          key: "name",
          label: "Product Name",
        },
        {
          key: "batch_no",
          label: "Batch No",
          sorter: false,
          filter: false,
        },
        {
          key: "expired_date",
          label: "Exp Date",
          sorter: false,
          filter: false,
        },
        {
          key: "nie",
          label: "NIE",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "trx_pack_serial",
          label: "Packing SN",
        },
        {
          key: "packaging_level",
          label: "Child Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Child Pkg Name",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        { key: "action", label: "Print", sorter: false, filter: false },
      ],
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
    cancel() {
      this.$router.back();
    },
    printAllV3(zpl_mode = false) {
      let _body = [];
      for (const it of this.items) {
        let itm = {
          serial: it.trx_pack_serial,
          gtin_sscc: it.trx_pack_gtin_sscc,
        };
        _body.push(itm);
      }
      if (zpl_mode) {
        this.selected_data = { items: _body };
        return;
      }
      $axiosSupport
        .post(`helper/print-layout/pdf`, { validate: true, items: _body })
        .then((response) => {
          if (response.data.error) {
            this.$toast.open({
              message: `${response.data.message ?? "Success validate"}`,
              type: response.data.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 3000,
            });
          } else {
            printLabelV3({
              data: _body,
              link: `${process.env.VUE_APP_URL_API_SUPPORT}/api/v3/helper/print-layout/pdf`,
            });
          }
        });
    },
    printV3(item) {
      let _body = {
        serial: item.trx_pack_serial,
        gtin_sscc: item.trx_pack_gtin_sscc,
        validate: true,
      };
      var _url = new URLSearchParams(_body).toString();
      $axiosSupport
        .get(`helper/print-layout/pdf?${_url}`)
        .then((response) => {
          this.$toast.open({
            message: `${response.data.message ?? "Success validate"}`,
            type: response.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 3000,
          });
          if (response.data.error) {
            return;
          }
          let _data = [_body];
          printLabelV3({
            data: _data,
            link: `${process.env.VUE_APP_URL_API_SUPPORT}/api/v3/helper/print-layout/pdf`,
          });
        })
        .catch((error) => {
          this.$toast.open({
            message: `${error}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 3000,
          });
        });
      return;
    },
  },
  computed: {
    detailRepack() {
      return this.items.map((item) => {
        return {
          ...item,
          gtin_cp:
            item.trx_pack_epc_type == "sscc"
              ? item.company_prefix
              : item.trx_pack_gtin_sscc,
        };
      });
    },
  },
};
</script>
