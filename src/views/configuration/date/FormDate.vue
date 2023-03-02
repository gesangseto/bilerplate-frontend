<template>
  <CRow>
    <CCol col="8" xl="8">
      <CCard>
        <CCardHeader>
          <h5>
            Date Format [{{
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
            <CCol col="4" xl="4" v-for="index in 3" :key="index">
              <CCard>
                <CCardHeader>
                  <strong>Field {{ index }}</strong>
                </CCardHeader>
                <CCardBody>
                  <CButton
                    style="margin-bottom: 15px; width: 100%"
                    :disabled="
                      disable_type[`field${index}`].year ||
                      (index > 1 && !data[`field${index - 1}_type`])
                    "
                    @:variant="
                      disable_type[`field${index}`].year ||
                      (index > 1 && !data[`field${index - 1}_type`])
                        ? 'block'
                        : 'outline'
                    "
                    :color="
                      data[`field${index}_type`] == 'year' ? 'primary' : 'dark'
                    "
                    @click="handleClickType('year', index)"
                  >
                    Year
                  </CButton>
                  <CButton
                    :disabled="
                      disable_type[`field${index}`].month ||
                      (index > 1 && !data[`field${index - 1}_type`])
                    "
                    style="margin-bottom: 15px; width: 100%"
                    @:variant="
                      disable_type[`field${index}`].month ||
                      (index > 1 && !data[`field${index - 1}_type`])
                        ? 'block'
                        : 'outline'
                    "
                    :color="
                      data[`field${index}_type`] == 'month' ? 'primary' : 'dark'
                    "
                    @click="handleClickType('month', index)"
                  >
                    Month
                  </CButton>
                  <CButton
                    :disabled="
                      disable_type[`field${index}`].day ||
                      (index > 1 && !data[`field${index - 1}_type`])
                    "
                    style="margin-bottom: 15px; width: 100%"
                    @:variant="
                      disable_type[`field${index}`].day ||
                      (index > 1 && !data[`field${index - 1}_type`])
                        ? 'block'
                        : 'outline'
                    "
                    :color="
                      data[`field${index}_type`] == 'day' ? 'primary' : 'dark'
                    "
                    @click="handleClickType('day', index)"
                  >
                    Day
                  </CButton>
                  <div class="text-center">
                    <CButton
                      :disabled="action == 'Read' || data.used_in_layout"
                      style="margin-bottom: 15px; width: 50%"
                      color="danger"
                      @click="handleClickClear(index)"
                    >
                      Clear
                    </CButton>
                  </div>
                </CCardBody>
                <CCardFooter>
                  <CSelect
                    :disabled="action == 'Read' || data.used_in_layout"
                    placeholder="Please select"
                    @change="handleChangeFormat(index)"
                    :value.sync="data[`field${index}_format`]"
                    :options="
                      data[`field${index}_type`] == 'year'
                        ? format_year
                        : data[`field${index}_type`] == 'month'
                        ? format_month
                        : data[`field${index}_type`] == 'day'
                        ? format_date
                        : []
                    "
                    :is-valid="
                      !data[`field${index}_type`] ||
                      !data[`field${index}_format`]
                        ? index > 1 && !data[`field${index}_type`]
                          ? true
                          : false
                        : true
                    "
                  >
                    <template #label>
                      Format Field {{ index }}
                      <span class="text-danger" v-if="index == 1">
                        <strong>*</strong>
                      </span>
                    </template></CSelect
                  >

                  <CSelect
                    :disabled="action == 'Read' || data.used_in_layout"
                    v-if="data[`field${index}_type`] == 'day'"
                    :label="'Overwrite Option '"
                    placeholder="Please select"
                    @change="handleChangeFormat(index)"
                    :value.sync="data['override']"
                    :options="override_type"
                    :is-valid="data[`override`] ? true : false"
                  />
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> Status </CCol>
            <SwithStatusMaster
              :disabled="action == 'Read'"
              :show_label="true"
              :default_value="data.status"
              v-on:onChange="data.status = $event"
            />
          </CRow>
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
        <CCardHeader>
          <strong>Overall</strong>
        </CCardHeader>
        <CCardBody>
          <CSelect
            :disabled="action == 'Read' || data.used_in_layout"
            :options="delimiter_list"
            placeholder="Please select"
            :value.sync="data.delimiter"
            @change="handleChangeFormat()"
          >
            <template #prepend-content>Delimiter</template>
          </CSelect>
          <CSelect
            :disabled="action == 'Read' || data.used_in_layout"
            :options="around_list"
            placeholder="Please select"
            :value.sync="data.around"
            @change="handleChangeFormat()"
          >
            <template #prepend-content>Around</template>
          </CSelect>
        </CCardBody> </CCard
      ><CCard>
        <CCardHeader>
          <strong>Result</strong>
        </CCardHeader>
        <CCardBody>
          <CInput horizontal label="Format *" readonly v-model="data.format" />
          <CInput
            horizontal
            label="Example"
            readonly
            v-model="data.example_format"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<style>
.tableBig {
  height: 30vh;
  overflow-y: scroll;
  overflow-x: scroll;
}
/* th, */
/* td {
  padding-top: 15px;
} */
</style>
<script>
import { exportData, capitalizeFirstLetter } from "../../../utils";
import moment from "moment";
import {
  getConfDate,
  insertConfDate,
  updateConfDate,
} from "../../../resource/ConfDate";

export default {
  name: "Customer",
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.page = 1;
    if (this.$route.params.id) {
      this.loadData();
    }
  },
  data() {
    return {
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
      customer: {},
      // items: [],
      data: {
        format: "",
        example_format: "",
        delimiter: "",
        override: "",
        around: "",
        field1_type: "",
        field1_format: "",
        field2_type: "",
        field2_format: "",
        field3_type: "",
        field3_format: "",
      },
      type_selected: [],
      disable_type: {
        field1: {
          year: false,
          month: false,
          day: false,
          none: false,
        },
        field2: {
          year: true,
          month: true,
          day: true,
          none: true,
        },
        field3: {
          year: true,
          month: true,
          day: true,
          none: true,
        },
      },
      format_year: [
        { value: "YY", label: "YY" },
        { value: "YYYY", label: "YYYY" },
      ],
      format_month: [
        { value: "M", label: "M" },
        { value: "MM", label: "MM" },
        { value: "MMM", label: "MMM" },
        { value: "MMMM", label: "MMMM" },
      ],
      format_date: [
        // { value: "dddd", label: "dddd" },
        { value: "D", label: "D" },
        { value: "DD", label: "DD" },
        // { value: "Do", label: "Do" },
      ],
      override_type: [
        { value: "no_overwrite", label: "No Overwrite" },
        { value: "last_day_of_month", label: "Last Day of Month" },
        { value: "first_day_of_month", label: "First Day of Month" },
      ],
      delimiter_list: [
        { value: "", label: "Nothing" },
        { value: ";", label: "SemiColon ( ; )" },
        { value: " ", label: "Space" },
        { value: "-", label: "Dash ( - )" },
        { value: "/", label: "Slash ( / )" },
        { value: "|", label: "Vartical bar ( | )" },
        { value: ".", label: "Period ( . )" },
        { value: ",", label: "Comma ( , )" },
        { value: ":", label: "Colon ( : )" },
      ],
      around_list: [
        { value: "", label: "Nothing" },
        { value: "( )", label: "Parentheses ()" },
        { value: "[ ]", label: "Brackets []" },
        { value: "{ }", label: "Braces {}" },
        { value: "-- --", label: "Double dash --" },
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
    async loadData() {
      let _res = await getConfDate({ id: this.$route.params.id });
      if (_res) {
        let data = _res.data[0];
        let _data = data;
        // let _data = get_date();
        // _data = _data[0];
        this.data = _data;
        this.data.delimiter = _data.df_delimiter ?? "";
        this.data.around = _data.df_around ?? "";
        this.data.override = _data.df_overwrite ?? "";
        this.data.field1_format = _data.df_field1 ?? "";
        this.data.field1_type = this.typeFormat(_data.df_field1) ?? "";
        this.data.field2_format = _data.df_field2 ?? "";
        this.data.field2_type = this.typeFormat(_data.df_field2) ?? "";
        this.data.field3_format = _data.df_field3 ?? "";
        this.data.field3_type = this.typeFormat(_data.df_field3) ?? "";
        this.checkDisabled();
        this.reFormatDate();
      }
    },
    typeFormat(str) {
      let string = str;
      if (str) {
        string = str.toLowerCase();
        if (string.includes("d")) {
          return "day";
        } else if (string.includes("m")) {
          return "month";
        } else if (string.includes("y")) {
          return "year";
        }
      }
      return null;
    },
    handleClickType(type, index) {
      this.data[`field${index}_type`] = type;
      this.checkDisabled(type, index);
      this.reFormatDate();
    },
    handleClickClear(index) {
      for (var i = index; i <= 3; i++) {
        // if (this.data[`field${i}_type`] == "day") this.data.override = "";
        this.data[`field${i}_type`] = "";
        this.data[`field${i}_format`] = "";
        delete this.type_selected[i - 1];
      }
      for (const dis in this.disable_type[`field${index}`]) {
        let is_selected = false;
        for (const select of this.type_selected) {
          if (select == dis) {
            is_selected = true;
          }
        }
        if (!is_selected) {
          this.disable_type[`field${index}`][dis] = false;
        }
      }
      this.reFormatDate();
      return;
    },
    reFormatDate() {
      let around = this.data.around.split(" ");
      let del = this.data.delimiter;
      let data = this.data;
      // let format = `${data.field1_format}${del}${data.field2_format}${del}${data.field3_format}`;
      let format = ``;
      if (data.field1_format) format += `${data.field1_format}`;
      if (data.field1_format && data.field2_format)
        format += `${del}${data.field2_format}`;
      if (data.field1_format && data.field2_format && data.field3_format)
        format += `${del}${data.field3_format}`;
      // let dt = moment().format(format.toUpperCase());
      let dt = moment().format(format);
      if (data.override === "last_day_of_month") {
        dt = moment().endOf("month").format(format.toUpperCase());
      } else if (data.override === "first_day_of_month") {
        dt = moment().startOf("month").format(format.toUpperCase());
      }

      if (format) {
        let left = around[0] ?? "";
        let right = around[1] ?? "";
        this.data.example_format = `${left}${dt}${right}`.toUpperCase();
        this.data.format = `${left}${format}${right}`;
      } else {
        this.data.example_format = `${around[0]} ${around[1]}`.toUpperCase();
      }
    },
    handleChangeFormat(index) {
      this.reFormatDate();
    },
    checkDisabled(type, index) {
      if (!type && !index) {
        let dis = this.disable_type;
        let x = 0;
        for (const it in dis) {
          if (this.data[`${it}_format`]) {
            this.disable_type[`${it}`] = {
              year: true,
              month: true,
              day: true,
            };
            this.type_selected[x] = this.data[`${it}_type`];
          }
          x += 1;
        }
        return;
      }
      this.type_selected[index - 1] = type;
      let item = this.disable_type[`field${index}`];
      for (const it in item) {
        this.disable_type[`field${index}`][it] = true;
      }
      if (index >= 3) {
        return;
      }
      let item_next = this.disable_type[`field${index + 1}`];
      for (const it in item_next) {
        this.disable_type[`field${index + 1}`][it] = false;
      }

      for (const it of this.type_selected) {
        this.disable_type[`field${index + 1}`][it] = true;
      }

      return;
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportData({ param: this.filter, exportType: type });
    },
    pageChange(page) {
      this.filter.page = page;
      this.loadData();
    },
    handleChangeSize($event) {
      this.filter.limit = $event;
      this.page = 1;
      this.loadData();
    },
    pageSizeChange($event) {
      this.size = $event;
      this.page = 1;
      this.loadData();
    },
    rowUpdate(item) {
      this.$router.push({
        path: `layout/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `layout/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `layout/create`,
      });
    },
    validation() {
      let message = "Please complete required data field.";
      let error = false;
      for (var i = 1; i <= 3; i++) {
        switch (this.data[`field${i}_type`]) {
          case "day":
            if (!this.data.override) {
              error = true;
            }
            break;
          case "month":
            if (!this.data[`field${i}_format`]) {
              error = true;
            }
            break;
          case "year":
            if (!this.data[`field${i}_format`]) {
              error = true;
            }
            break;
        }
      }
      if (!this.data[`field1_format`]) {
        error = true;
      }
      if (error) {
        this.$toast.open({
          message: message,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    async save() {
      if (!this.validation()) {
        return;
      }
      let body = {
        id: this.$route.params.id,
        df_id: this.data.df_id,
        df_name: this.data.format,
        df_delimiter: this.data.delimiter,
        df_around: this.data.around,
        df_field1: this.data.field1_format,
        df_field2: this.data.field2_format,
        df_field3: this.data.field3_format,
        df_overwrite: this.data.override,
        status: this.data.status,
      };
      let dataPost = body;
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = {};
        if (dataPost.id) {
          res = await updateConfDate(dataPost);
        } else {
          res = await insertConfDate(dataPost);
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
};
</script>
