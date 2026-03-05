<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <InputDefault
                :disabled="true"
                :col="[3, 9]"
                title="ID"
                v-model="formData.id"
              />
              <InputDefault
                :disabled="action == 'Read' ? true : false"
                required
                :col="[3, 9]"
                title="Name"
                v-model="formData.name"
                :is-valid="initial_load ? null : formData.name ? true : false"
              />

              <TextareaDefault
                :disabled="action == 'Read' ? true : false"
                :col="[3, 9]"
                required
                title="Description"
                v-model="formData.description"
                :is-valid="
                  initial_load ? null : formData.description ? true : false
                "
              />
              <CRow form class="form-group">
                <CCol sm="3"> Status </CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="formData.status"
                  v-on:onChange="formData.status = $event"
                />
              </CRow>
            </CForm>
            <Metadata
              :defaultMetadata="formData.metadata"
              v-on:handleChange="
                (formData.metadata = $event.result),
                  (formData.error_metadata = $event.error_metadata)
              "
              model="mst_product_category"
            />
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' ? false : true"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getMstProductCategory,
  insertMstProductCategory,
  updateMstProductCategory,
} from '../../../resource/MstProductCategory';

export default {
  name: 'ProductCategory',
  data() {
    return {
      initial_load: true,
      action: '',
      route_action: '',
      formData: { id: null, status: 'Active', metadata: {} },
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      let _res = await getMstProductCategory({ id: this.$route.params.id });
      if (_res) this.formData = _res.data[0];
    },
    valid() {
      if (this.formData.error_metadata) {
        return false;
      } else if (!this.formData.name) {
        return false;
      }
      return true;
    },

    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;

      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = this.formData;
        let res = {};
        if (dataPost.id) {
          res = await updateMstProductCategory(dataPost);
        } else {
          res = await insertMstProductCategory(dataPost);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) handleBack(this.$router, this.$route);
      }
      return;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
  },
};
</script>
