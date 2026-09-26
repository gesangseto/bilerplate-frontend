<template>
  <CRow>
    <CCol sm="12" md="12" lg="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  :col="[3, 9]"
                  title="ID"
                  v-model="product.id"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  title="Product Name"
                  placeholder="Enter product name"
                  v-model="product.name"
                  :required="true"
                  :isValid="initial_load ? null : !product.name ? false : true"
                  :col="[3, 9]"
                />
              </CCol>

              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  title="Description"
                  placeholder="Enter product description"
                  v-model="product.description"
                  :col="[3, 9]"
                />
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="action == 'Read'"
                    :show_label="true"
                    :default_value="product.status"
                    v-on:onChange="product.status = $event"
                  />
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <div class="float-left">
            <CButton
              v-if="action == 'Read' ? false : true"
              @click="save()"
              color="primary"
              size="sm"
              type="submit"
            >
              <CIcon name="cil-check-circle" /> Submit
            </CButton>
            <ButtonBack />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  getMstProduct,
  insertMstProduct,
  updateMstProduct,
} from '../../../resource/MstProduct';
import { capitalizeFirstLetter, handleBack } from '../../../utils';

export default {
  mounted() {
    // Mengecek ada parameter yg dikiri di URL atau tidak
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id) {
      this.loadData();
    }
  },
  data() {
    return {
      route_action: '',
      action: null,
      initial_load: true,
      product: {
        id: null,
        name: '',
        description: '',
        status: 'Active',
      },
    };
  },

  methods: {
    async loadData() {
      let _res = await getMstProduct({ id: this.$route.params.id });
      let data = _res.data[0];
      this.product = data;
    },
    validationData() {
      // Pengecekan normal
      let required = ['name'];
      for (const it of required) {
        if (!this.product[it]) {
          return false;
        }
      }
      return true;
    },

    async save() {
      this.initial_load = false;
      if (!this.validationData()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let body = JSON.parse(JSON.stringify(this.product));
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = body;
        let res = {};
        if (this.action === 'Create' && dataPost.id) {
          delete dataPost.id;
        }
        if (dataPost.id) {
          res = await updateMstProduct(dataPost);
        } else {
          res = await insertMstProduct(dataPost);
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