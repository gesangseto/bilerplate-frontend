<template>
  <div>
    <CRow>
      <CCol md="6">
        <CInput
          horizontal
          v-model="detail_product.no"
          label="Item No"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.batch_no"
          label="Batch No"
          readonly
        />
        <CInput horizontal v-model="detail_product.nie" label="NIE" readonly />
        <CInput
          horizontal
          v-model="detail_product.gtin_cp"
          label="GTIN / CP"
          readonly
        />
      </CCol>
      <CCol md="6">
        <CInput
          horizontal
          v-model="detail_product.name"
          label="Product"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.expired_date"
          label="Exp Date"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.mfg_date"
          label="Mfg Date"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.serial"
          label="SN"
          readonly
        />
      </CCol>
      <CCol md="12">
        <CCardGroup style="border: 0">
          <CCard
            v-for="idx in total_child"
            :key="idx"
            style="margin-top: 15px; border: 0"
          >
            <CListGroup accent>
              <CListGroupItem
                accent
                class="d-flex justify-content-between align-items-center"
              >
                Packaging Level {{ total_child + 1 - idx }}
                <CBadge color="primary" shape="pill">
                  {{ qty_data[`level_${total_child + 1 - idx}`] }}
                </CBadge>

                <CButton
                  size="sm"
                  color="success"
                  @click="handleClickExpand(total_child + 1 - idx)"
                  :style="idx == total_child && 'opacity: 0;'"
                  :disabled="idx == total_child"
                >
                  <v-icon
                    v-if="!loading[`level_${total_child + 1 - idx}`]"
                    name="angle-double-right"
                  />
                  <v-icon
                    v-if="loading[`level_${total_child + 1 - idx}`]"
                    name="sync"
                    spin
                  />
                </CButton>
                <!-- <hr v-if="idx == total_child" /> -->
              </CListGroupItem>
              <CListGroupItem
                class="d-flex align-items-center"
                :color="
                  error[`level_${total_child + 1 - idx}`] ? 'danger' : 'default'
                "
              >
                <select
                  multiple
                  class="form-control"
                  size="10"
                  style="width: 100%"
                >
                  <option
                    v-for="item in list_data[`level_${total_child + 1 - idx}`]"
                    :key="item.value"
                    @click="handleClickSerial(item, total_child + 1 - idx)"
                  >
                    [{{
                      item.epc_type == "sscc"
                        ? item.company_prefix
                        : item.gtin_sscc
                    }}] {{ item.serial }}
                    {{
                      total_child + 1 - idx != 1
                        ? ` - [${item.quantity_child}]`
                        : ""
                    }}
                  </option>
                </select>
              </CListGroupItem>
              <span
                class="text-danger"
                v-if="error[`level_${total_child + 1 - idx}`]"
              >
                Please select data first
              </span>
            </CListGroup>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
export default {
  name: "DetailTransactionV3",
  props: { item: Object },
  mounted() {
    if (this.item) {
      const _it = JSON.parse(JSON.stringify(this.item));
      this.trx_detail_id = _it.id;
      this.detail_product = _it;
      this.detail_product.gtin_cp =
        _it.epc_type == "sscc" ? _it.company_prefix : _it.gtin_sscc;
      this.total_child = _it.packaging_level - 1 ?? 1;
      this.getDetailItem(_it, _it.packaging_level);
    }
  },
  data() {
    return {
      initial_load: true,
      trx_detail_id: null,
      list_data: {
        level_1: [],
        level_2: [],
        level_3: [],
        level_4: [],
        level_5: [],
      },
      qty_data: {
        level_1: 0,
        level_2: 0,
        level_3: 0,
        level_4: 0,
        level_5: 0,
      },
      loading: {
        level_1: false,
        level_2: false,
        level_3: false,
        level_4: false,
        level_5: false,
      },
      error: {
        level_1: null,
        level_2: null,
        level_3: null,
        level_4: null,
        level_5: null,
      },
      detail_product: {},
      total_child: 0,
      selected_data: {
        item: null,
        pack_level: null,
      },
    };
  },
  methods: {
    handleClickExpand(pack_level) {
      this.error[`level_${pack_level}`] = false;
      if (pack_level != this.selected_data.pack_level) {
        this.error[`level_${pack_level}`] = true;
        return;
      }
      this.getDetailItem(this.selected_data.item, pack_level);
    },
    handleClickSerial(it, pack_level) {
      this.selected_data.item = it;
      this.selected_data.pack_level = pack_level;
      // this.getDetailItem(it, pack_level);
    },
    getDetailItem(item, pack_level) {
      if (item && item.serial && item.id) {
        // for Loading button
        if (this.initial_load) {
          this.loading[`level_${pack_level - 1}`] = true;
        } else {
          this.loading[`level_${pack_level}`] = true;
        }
        let param = {};
        let url = `/v3/helper/detail-item/transaction?${param}`;
        if (item.pss_id && item.id) {
          param = { pss_id_parent: item.pss_id, item_id: item.id };
          param = new URLSearchParams(param).toString();
          url = `/v3/helper/detail-item/transaction?raw=true&${param}`;
        } else {
          param = { parent: item.id };
          param = new URLSearchParams(param).toString();
          url = `/v3/helper/detail-item/stock?raw=true&${param}`;
        }
        $axiosMertrack.get(url).then((result) => {
          // for Loading button
          if (this.initial_load) {
            this.initial_load = false;
            this.loading[`level_${pack_level - 1}`] = false;
          } else {
            this.loading[`level_${pack_level}`] = false;
          }
          let data = result.data.data;
          if (!this.detail_product.name && !this.detail_product.no) {
            this.detail_product.no = data[0]["no"];
            this.detail_product.name = data[0]["name"];
            this.detail_product.nie = data[0]["nie"];
            this.detail_product.expired_date = data[0]["expired_date"];
            this.detail_product.mfg_date = data[0]["mfg_date"];
          }
          let qty = 0;
          if (
            (data && data[0].serial == "0000000000") ||
            data[0].serial == "0000000000"
          ) {
            qty = data[0].quantity;
          } else {
            qty = data.length;
          }
          this.list_data[`level_${pack_level - 1}`] = data;
          this.qty_data[`level_${pack_level - 1}`] = qty;
        });
      }
    },
  },
};
</script>
