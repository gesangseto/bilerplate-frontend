<template>
  <div>
    <CRow style="margin-bottom: -10px">
      <CCol md="4">
        <CSelect
          label="Status"
          :options="listFilterStatusCode"
          :value.sync="result.StatusCode"
          horizontal
          @update:value="handleChangeStatus()"
        />
      </CCol>
      <CCol md="4">
        <CInput
          v-on:keyup.enter="handleEnterSearchText()"
          v-model="result.searchText"
          placeholder="Search text..."
        >
        </CInput>
      </CCol>

      <CCol md="3">
        <CButton v-on:click="handleClickFilter()" color="primary">
          <v-icon name="filter" /> Filter
        </CButton>
        &nbsp;
        <CButton
          v-on:click="handleResetFilter()"
          style="background-color: #f9b115; color: white"
        >
          <v-icon name="broom" /> Reset
        </CButton>
      </CCol>
      <CCol md="1" v-if="costume_filter || filter">
        <CButton v-on:click="is_visible = !is_visible">
          <v-icon v-if="!is_visible" name="angle-right" />
          <v-icon v-if="is_visible" name="angle-down" />
        </CButton>
      </CCol>
    </CRow>
    <CRow style="margin-bottom: -10px" v-if="is_visible">
      <CCol md="4">
        <CSelect
          label="Filter By"
          :options="listFilter"
          :value.sync="result.SearchType"
          horizontal
          @update:value="handleChangeType()"
        />
      </CCol>
      <CCol md="4">
        <model-select
          :isDisabled="!extendFilter"
          :options="listExtendFilter"
          v-model="result.SearchVal1"
          @input="handleChangeFilter()"
          placeholder="--Select--"
        >
        </model-select>
      </CCol>
      <CCol md="4"> </CCol>
    </CRow>
    <hr />
    <CRow>
      <CCol md="9"></CCol>
      <CCol md="3">
        <CSelect
          :options="pages"
          :value.sync="result.limit"
          @update:value="handleChangeSize()"
        >
          <template #append-content>Per Page</template>
        </CSelect>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import "vue-search-select/dist/VueSearchSelect.css";
import { ModelSelect } from "vue-search-select";

export default {
  name: "HeaderFilterTransaction",
  props: ["status_code", "costume_filter", "filter"],
  components: { ModelSelect },
  mounted() {
    this.getSatusCode();
    if (this.filter && this.filter.constructor === Array) {
      let new_list = [];
      for (const it of this.listFilter) {
        for (const fil of this.filter) {
          if (
            it.value.toLowerCase() == fil.toLowerCase() ||
            it.label.toLowerCase() == fil.toLowerCase()
          ) {
            new_list.push(it);
          }
        }
      }
      this.listFilter = new_list;
    }
    if (this.costume_filter && this.costume_filter.constructor === Array) {
      for (const it of this.costume_filter) {
        if (it.data && it.data.constructor === Array) {
          this.listFilter.push(it);
        }
      }
    }
  },
  data() {
    return {
      result: {
        limit: 10,
        StatusCode: "",
        StatusCodeText: "All",
        SearchType: "All",
        searchText: "",
        SearchVal1: "",
        SearchVal2: "",
        SearchVal1Text: "",
        SearchVal2Text: "",
      },
      pages: [10, 20, 50, 100],
      is_visible: false,
      listFilterStatusCode: [],
      extendFilter: false,
      listExtendFilter: [],
      listFilter: [
        {
          value: "All",
          label: "All",
        },
        {
          value: "ProductCategory",
          label: "Product Category",
        },
      ],
    };
  },
  methods: {
    handleResetFilter() {
      this.result = {
        limit: 10,
        StatusCode: "",
        SearchType: "All",
        StartDate: "",
        EndDate: "",
        searchText: "",
        SearchVal1: "",
        SearchVal2: "",
      };
      this.handleClickFilter();
    },
    handleChangeType() {
      this.extendFilter = true;
      this.result.SearchVal1 = "";
      this.result.SearchVal1Text = "";
      if (this.result.SearchType) {
        if (this.result.SearchType.toLowerCase() == "all") {
          this.extendFilter = false;
          this.result.SearchVal1 = "";
          this.result.SearchVal1Text = "All";
        } else if (this.result.SearchType.toLowerCase() == "productcategory") {
          this.extendFilter = true;
          this.result.SearchVal1 = "";
          this.result.SearchVal1Text = "";
          this.getProductCategory();
        } else if (this.costume_filter) {
          for (const it of this.costume_filter) {
            if (
              this.result.SearchType.toLowerCase() == it.value.toLowerCase()
            ) {
              this.getCostumeFilter(it);
              this.extendFilter = true;
            }
          }
        }
      }
    },
    handleChangeSize() {
      this.$emit("handleChangeSize", this.result.limit);
    },
    handleEnterSearchText() {
      this.handleClickFilter();
    },
    handleClickFilter() {
      this.$emit("handleClickFilter", this.result);
    },
    handleChangeFilter() {
      for (const it of this.listExtendFilter) {
        if (this.result.SearchVal1 == it.value)
          this.result.SearchVal1Text = it.label;
      }
      this.$emit("handleChangeFilter", this.result);
    },
    handleChangeStatus() {
      for (const it of this.listFilterStatusCode) {
        if (this.result.StatusCode == it.value)
          this.result.StatusCodeText = it.label;
      }
    },
    getSatusCode() {
      this.listFilterStatusCode = [{ value: "", label: "All" }];
      let url = `/general/web?ApiName=GetWeb_GetStatus&Params={"table_name":"${this.status_code}"}`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let tmp = it;
          tmp.value = it.status_code;
          tmp.label = it.status_desc;
          tmp.text = it.status_desc;
          this.listFilterStatusCode.push(tmp);
        }
      });
    },
    getProductCategory() {
      this.listExtendFilter = [];
      let url = `/general/web?ApiName=ProductCategoryList&include_delete=1`;
      $axiosMertrack.get(url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          let ext = it.delete_flag == 1 ? "(X)" : "";
          let tmp = it;
          tmp.value = it.id;
          tmp.label = `${ext} ${it.name}`;
          tmp.text = `${ext} ${it.name}`;
          this.listExtendFilter.push(tmp);
        }
      });
    },
    getCostumeFilter(item) {
      for (const it of item.data) {
        let tmp = it;
        tmp.value = it.value;
        tmp.label = it.label;
        tmp.text = it.label;
        this.listExtendFilter.push(tmp);
      }
    },
  },
};
</script>
