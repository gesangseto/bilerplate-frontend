<template>
  <div>
    <CRow>
      <CCol md="6">
        <CInput
          horizontal
          v-model="detail_product.product_no"
          label="Item No"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.batch_no"
          label="Batch No"
          readonly
        />
        <CInput
          horizontal
          v-model="detail_product.product_nie"
          label="NIE"
          readonly
        />
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
          v-model="detail_product.product_name"
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
          v-model="first_product.mfg_date"
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
                  {{
                    list_data[`level_${total_child + 1 - idx}`].length === 1
                      ? list_data[`level_${total_child + 1 - idx}`][0].quantity
                      : list_data[`level_${total_child + 1 - idx}`].length
                  }}
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
                        ? ` &emsp; - &emsp; [${item.quantity}]`
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
  name: "DetailTransaction",
  props: { item: Object },
  mounted() {
    if (this.item) {
      const _it = JSON.parse(JSON.stringify(this.item));
      this.detail_product = _it;
      this.detail_product.product_no = _it.product_no ?? _it.no;
      this.detail_product.product_name = _it.product_name ?? _it.name;
      this.detail_product.product_nie = _it.product_nie ?? _it.nie;
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
      first_product: {},
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
      if (item && (item.id || item.stock_serial_id)) {
        let id = item.id;
        if (item.stock_serial_id) {
          id = item.stock_serial_id;
        }
        // for Loading button
        if (this.initial_load) {
          this.loading[`level_${pack_level - 1}`] = true;
        } else {
          this.loading[`level_${pack_level}`] = true;
        }
        let param = item;
        param.packaging_level = pack_level - 1;
        param.from_stock = 1;
        let url = `/general/web?ApiName=DetailItem&Params=${JSON.stringify(
          param
        )}&Id=${id}`;
        $axiosMertrack.get(url).then((result) => {
          // for Loading button
          if (this.initial_load) {
            this.initial_load = false;
            this.loading[`level_${pack_level - 1}`] = false;
          } else {
            this.loading[`level_${pack_level}`] = false;
          }
          let data = result.data.data;
          this.first_product = data[0];
          this.list_data[`level_${pack_level - 1}`] = data;
        });
      }
    },
  },
};
</script>
