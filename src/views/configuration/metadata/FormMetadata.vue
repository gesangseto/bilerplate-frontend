<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CInput
                :disabled="true"
                horizontal
                placeholder="Enter name"
                v-model="formData.name"
                :is-valid="initialLoad ? null : !formData.name ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Menu
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="true"
                horizontal
                placeholder="Enter model name"
                v-model="formData.model"
                :is-valid="initialLoad ? null : !formData.model ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Model
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
            </CForm>
            <ButtonPermission
              v-if="action == 'Update'"
              :permission="'create'"
              @click="addNew()"
            />
            <CDataTable
              hover
              striped
              sorter
              :items="reformat"
              :fields="fields"
              class="data-table"
              style="font-size: 12px"
            >
              <template #action="{ item, index }">
                <td>
                  <ButtonPermission
                    v-if="action == 'Update'"
                    :id="item.id"
                    :permission="'delete'"
                    @click="deleteRow(item, index)"
                  />
                  <ButtonPermission
                    v-if="action == 'Update'"
                    :id="item.id"
                    :permission="'update'"
                    @click="rowUpdate(item, index)"
                  />
                </td>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <ButtonBack :title="'Back'" />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CModal
      :title="
        formData.sys_database_content_id ? 'Edit Metadata' : 'Add Metedata'
      "
      color="warning"
      :show.sync="showModalDialog"
      size="lg"
    >
      <CRow v-if="modalData">
        <CCol sm="12">
          <InputDefault
            required
            :col="[3, 9]"
            title="Metadata Name"
            placeholder="Enter Metadata name"
            v-model="modalData.name"
            :is-valid="initial_load ? null : !modalData.name ? false : true"
          />
        </CCol>
        <CCol sm="12">
          <TextareaDefault
            :col="[3, 9]"
            title="Metadata Description"
            placeholder="Enter Metadata description"
            v-model="modalData.description"
          />
        </CCol>

        <CCol sm="12">
          <SelectOption
            required
            title="Pattern "
            :options="listOption"
            v-on:onchange="modalData.conf_pattern_id = $event"
            :value="modalData.conf_pattern_id"
            :col="[3, 9]"
            :is-valid="
              initial_load ? null : !modalData.conf_pattern_id ? false : true
            "
          />
        </CCol>

        <CCol sm="12">
          <CRow form class="form-group">
            <CCol sm="3"> Mandatory </CCol>
            <SwitchDefault
              :show_label="true"
              :default_value="modalData.mandatory"
              v-on:onChange="modalData.mandatory = $event"
            />
          </CRow>
        </CCol>

        <CCol md="12">
          <CRow form class="form-group">
            <CCol sm="3"> Status </CCol>
            <SwitchStatusMaster
              :default_value="modalData.status"
              :show_label="true"
              v-on:onChange="modalData.status = $event"
            />
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton size="sm" color="success" type="button" @click="onSave()">
          <CIcon name="cil-check-circle" /> Save
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import { getConfPattern } from '../../../resource/ConfPattern';
import {
  deleteConfMetadata,
  getConfMetadata,
  insertConfMetadata,
  updateConfMetadata,
} from '../../../resource/ConfMetadata';

export default {
  name: 'FormMetadata',
  watch: {
    form: {
      handler(item) {
        // console.log(item);
      },
      deep: true,
    },
  },
  data() {
    return {
      initial_load: true,
      showModalDialog: false,
      initialData: {
        sys_database_content_id: null,
        name: null,
        conf_pattern_id: null,
        status: null,
      },
      modalData: {
        sys_database_content_id: null,
        name: null,
        conf_pattern_id: null,
        status: null,
      },
      initialLoad: true,
      route_action: '',
      // category: '',
      action: 'Edit',
      formData: { metadata: [] },
      connection: { ip: null, username: null, password: null, port: null },
      detailConnector: { params: [] },
      listOption: [],
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'name',
          label: 'Metadata Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'description',
          label: 'Description',
        },
        {
          key: 'pattern',
          label: 'Pattern',
        },
        {
          key: 'mandatory',
          label: 'Mandatory',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  mounted() {
    this.loadOption();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    async loadOption() {
      let _res = await getConfPattern({ status: 'Active' });
      if (_res) {
        this.listOption = [];
        for (const it of _res.data) {
          this.listOption.push({ value: '' + it.id, label: it.name });
        }
      }
    },
    async loadData() {
      let _res = await getConfMetadata({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
      }
    },
    validation() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.sys_database_content_id) {
        return false;
      }
      return true;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
    addNew() {
      this.modalData = {
        ...this.initialData,
        sys_database_content_id: this.$route.params.id,
      };
      this.showModalDialog = true;
    },
    rowUpdate(item, index) {
      this.modalData = JSON.parse(JSON.stringify(item));
      this.showModalDialog = true;
    },
    async deleteRow(item, index) {
      let message = `You are about to delete this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = await deleteConfMetadata(item);
        this.$isLoading(false);
        this.$toast.open({
          message: res.error
            ? `${res.message}`
            : 'Data has been deleted successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        this.modalData = this.initialData;
        this.showModalDialog = false;
        if (!res.error) this.loadData();
      }
    },
    validationMetadata() {
      if (!this.modalData.sys_database_content_id) {
        return false;
      } else if (!this.modalData.name) {
        return false;
      } else if (!this.modalData.conf_pattern_id) {
        return false;
      }
      return true;
    },
    async onSave() {
      this.initial_load = false;
      if (!this.validationMetadata()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let message = `You are about to change this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = null;
        if (this.modalData.id) {
          res = await updateConfMetadata(this.modalData);
        } else {
          res = await insertConfMetadata(this.modalData);
        }
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
          this.initial_load = true;
          this.modalData = this.initialData;
          this.showModalDialog = false;
        }
      }
    },
  },
  computed: {
    reformat() {
      return this.formData.metadata.map((item) => {
        let pattern = null;
        if (item.conf_pattern) pattern = item.conf_pattern;
        return {
          ...item,
          description: item.description || '',
          pattern: pattern ? pattern.name : '[No Pattern]',
        };
      });
    },
  },
};
</script>
