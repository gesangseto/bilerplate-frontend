<template>
  <CModal
    title="Weight Configuration"
    color="warning"
    :show.sync="showModalDialog"
    size="xl"
  >
    <table style="width: 100%">
      <tr style="border-bottom: 2px solid rgb(101, 101, 101)">
        <td style="width: 5%; text-align: center"><strong>Level</strong></td>
        <td style="width: 25%; text-align: center"><strong>Type</strong></td>
        <td style="width: 70%; text-align: center"><strong>Config</strong></td>
      </tr>
      <tr
        v-for="level in product.current_pack ? product.current_pack : 4"
        :key="level"
        style=""
      >
        <td>
          {{ level }}
        </td>
        <td>
          <v-select
            :disabled="readonly"
            :placeholder="readonly ? 'Not set' : '--Select--'"
            :options="list_weight_type"
            :reduce="(opt) => opt.value"
            v-model="weight_config[`weight_l${level}`].type"
            @input="handleType($event, level)"
            style="margin-right: 15px"
          >
          </v-select>
        </td>
        <td>
          <CRow style="align-items: center">
            <CCol md="1">
              <label>Required: </label>
            </CCol>
            <CCol md="1">
              <CSwitch
                :disabled="readonly"
                class="mb-0"
                color="success"
                size="sm"
                :checked.sync="weight_config[`weight_l${level}`].required"
              />
            </CCol>
            <!-- JIKA TYPE = PREDEFINED -->
            <CCol
              md="10"
              v-if="
                weight_config[`weight_l${level}`] &&
                weight_config[`weight_l${level}`].type == 'predefined'
              "
            >
              <CRow style="align-items: center">
                <CCol md="3">
                  <label>Min (Kg): </label>
                </CCol>
                <CCol md="3">
                  <CInput
                    :disabled="readonly"
                    class="mb-0"
                    size="sm"
                    v-model="weight_config[`weight_l${level}`].min"
                    @keypress="limitWeight($event, 'min', level)"
                    :add-input-classes="{
                      'is-invalid': !valid_weight[`l${level}`],
                    }"
                    :invalid-feedback="
                      weight_config[`weight_l${level}`].min
                        ? 'Min value must smaller than Max value'
                        : 'Min is required'
                    "
                  />
                </CCol>
                <CCol md="3">
                  <label>Max (Kg): </label>
                </CCol>
                <CCol md="3">
                  <CInput
                    :disabled="readonly"
                    class="mb-0"
                    size="sm"
                    v-model="weight_config[`weight_l${level}`].max"
                    @keypress="limitWeight($event, 'max', level)"
                    :add-input-classes="{
                      'is-invalid': !valid_weight[`l${level}`],
                    }"
                    :invalid-feedback="
                      weight_config[`weight_l${level}`].max
                        ? 'Max value must greater than Min value'
                        : 'Max is required'
                    "
                  />
                </CCol>
              </CRow>
            </CCol>
            <!-- JIKA TYPE = AVERAGE -->
            <CCol
              md="10"
              v-if="
                weight_config[`weight_l${level}`] &&
                weight_config[`weight_l${level}`].type == 'average'
              "
            >
              <CRow style="align-items: center">
                <CCol md="3">
                  <label>Average of First: </label>
                </CCol>
                <CCol md="3">
                  <CInput
                    :disabled="readonly"
                    class="mb-0"
                    size="sm"
                    v-model="weight_config[`weight_l${level}`].average_of_first"
                    @keypress="onlyNumber($event, 'average_of_first', level)"
                    :add-input-classes="{
                      'is-invalid':
                        !weight_config[`weight_l${level}`].average_of_first,
                    }"
                    :invalid-feedback="'Average of First is required'"
                  />
                </CCol>
                <CCol md="3">
                  <label>Offset (%): </label>
                </CCol>
                <CCol md="3">
                  <CInput
                    :disabled="readonly"
                    class="mb-0"
                    size="sm"
                    v-model="weight_config[`weight_l${level}`].offset"
                    @keypress="onlyNumber($event, 'offset', level)"
                    :add-input-classes="{
                      'is-invalid': !weight_config[`weight_l${level}`].offset,
                    }"
                    :invalid-feedback="'Offset of First is required'"
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </td>
      </tr>
    </table>
    <template #footer>
      <!-- Buton Cancel-->
      <CButton
        type="reset"
        size="sm"
        color="danger"
        class="m-1"
        @click="showModalDialog = false"
      >
        <CIcon name="cil-ban" /> Cancel
      </CButton>
      <CButton
        v-if="!readonly"
        size="sm"
        color="success"
        type="button"
        @click="onSubmit()"
        :disabled="!valid_weight.all"
      >
        <CIcon name="cil-check-circle" /> Set
      </CButton>
    </template>
  </CModal>
</template>

<script>
import { readonly } from 'vue';
import { isJsonString } from '../../utils';
export default {
  name: 'ProductWeight',
  props: {
    product: Object,
    readonly: Boolean,
    showModal: Boolean,
  },
  beforeMount() {},
  watch: {
    product: {
      handler(item) {
        for (let i = 1; i <= 4; i++) {
          if (item[`weight_l${i}`]) {
            if (isJsonString(item[`weight_l${i}`])) {
              this.weight_config[`weight_l${i}`] = JSON.parse(
                item[`weight_l${i}`]
              );
            } else {
              this.weight_config[`weight_l${i}`] = item[`weight_l${i}`];
            }
          }
        }
      },
      deep: true,
    },
    showModal: {
      handler(item) {
        this.showModalDialog = item;
      },
      deep: true,
    },
    showModalDialog: {
      handler(item) {
        if (!item) {
          this.$emit('onCloseModal');
        }
      },
      deep: true,
    },
    weight_config: {
      handler(item) {
        this.valid_weight.all = true;
        for (var i = 1; i <= 4; i++) {
          let isValid = true;
          this.valid_weight[`l${i}`] = true;
          let thisWeight = item[`weight_l${i}`];
          if (thisWeight.type == 'predefined') {
            if (!thisWeight.min || !thisWeight.max) {
              isValid = false;
            } else if (
              parseFloat(thisWeight.min) > parseFloat(thisWeight.max)
            ) {
              isValid = false;
            }
          } else if (thisWeight.type == 'average') {
            if (!thisWeight.average_of_first || !thisWeight.offset) {
              isValid = false;
            }
          }

          this.valid_weight[`l${i}`] = isValid;
          if (!isValid) this.valid_weight.all = false;
        }
      },
      deep: true,
    },
  },
  mounted() {},
  data() {
    return {
      valid_weight: { l1: true, l2: true, l3: true, l4: true, all: true },
      showModalDialog: false,
      list_weight_type: [
        // { value: 'predefined', label: 'Predefined' },
        { value: 'average', label: 'Average' },
      ],
      weight_config: {
        weight_l1: { required: false },
        weight_l2: { required: false },
        weight_l3: { required: false },
        weight_l4: { required: false },
      },
      weight_predefined: {
        type: 'predefined',
        min: null,
        max: null,
        required: false,
      },
      weight_average: {
        type: 'average',
        average_of_first: null,
        offset: null,
        required: false,
      },
    };
  },
  computed: {},
  methods: {
    onlyNumber(event, key, level) {
      const stringBefore = this.weight_config[`weight_l${level}`][key];
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        return event.preventDefault();
      } else if (stringBefore && stringBefore.length >= 2) {
        return event.preventDefault();
      }
      return true;
    },
    limitWeight(event, key, level) {
      const stringBefore = this.weight_config[`weight_l${level}`][key];
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      // Menerima Angka saja (48 s/d 57), atau titik '.' (46)
      if ((charCode < 48 || charCode > 57) && charCode != 46) {
        return event.preventDefault();
      } else if (stringBefore && stringBefore.replace('.', '').length >= 6) {
        // memastikan angka harus 6 angka
        return event.preventDefault();
      }
      return true;
    },
    handleType(type, level) {
      let isRequired = this.weight_config[`weight_l${level}`].required;
      if (type === 'predefined') {
        this.weight_config[`weight_l${level}`] = {
          ...this.weight_predefined,
          required: isRequired,
        };
      } else if (type === 'average') {
        this.weight_config[`weight_l${level}`] = {
          ...this.weight_average,
          required: isRequired,
        };
      } else {
        this.weight_config[`weight_l${level}`] = {
          required: isRequired,
        };
      }
    },
    onSubmit() {
      this.showModalDialog = false;
      this.$emit('onSubmit', this.weight_config);
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  text-align: center;
  vertical-align: middle;
  padding: 0.25rem;
  border: 0.1px solid #ccc;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
</style>
