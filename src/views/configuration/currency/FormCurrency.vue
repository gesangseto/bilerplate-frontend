<template>
  <CRow>
    <CCol md="12">
      <CCard
        ><CCardHeader class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
          <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
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
              :is-valid="initial_load ? null : !formData.name ? false : true"
            />
            <InputDefault
              :disabled="action == 'Read' ? true : false"
              required
              :col="[3, 9]"
              title="Country"
              v-model="formData.country"
              :is-valid="initial_load ? null : !formData.country ? false : true"
            />

            <InputDefault
              :disabled="action == 'Read' ? true : false"
              :col="[3, 9]"
              required
              title="Symbol / Country Code"
              placeholder="Please input Country Code"
              v-model="formData.code"
              :is-valid="initial_load ? null : !formData.code ? false : true"
            >
              <template #prepend>
                <div
                  style="width: 350px; margin-bottom: -50px; margin-right: 10px"
                >
                  <InputDefault
                    :disabled="action == 'Read' ? true : false"
                    :col="[3, 9]"
                    required
                    placeholder="Please input Symbol"
                    v-model="formData.symbol"
                    :is-valid="
                      initial_load ? null : !formData.symbol ? false : true
                    "
                  />
                </div>
              </template>
            </InputDefault>

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
            model="mst_packaging"
          />
        </CCardBody>

        <CCardFooter class="d-flex justify-content-start gap-2">
          <ButtonEdit
            v-if="action == 'Update'"
            :property="formData"
            type="update"
            :reason.sync="formData.reason"
            :reason-required="true"
            @handleSubmit="save()"
          />
          <ButtonSubmit v-if="action == 'Create'" @handleSubmit="save()" />
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getMstMstCurrency,
  insertMstCurrency,
  updateMstCurrency,
} from '../../../resource/MstCurrency';
export default {
  name: 'FormCurrency',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: { id: null, have_error: false, metadata: {} },
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    };
  },
  validations: {
    packaging: {
      name: { required },
      description: { required },
    },
  },
  async mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      let param = `id=${this.$route.params.id}`;
      let _res = await getMstMstCurrency(param);
      this.formData = _res.data[0];
    }
  },
  methods: {
    checkValidation() {
      this.formData.have_error = false;
      if (this.formData.error_metadata) {
        this.formData.have_error = true;
      } else if (!this.formData.name) {
        this.formData.have_error = true;
      } else if (!this.formData.code) {
        this.formData.have_error = true;
      } else if (!this.formData.symbol) {
        this.formData.have_error = true;
      } else if (!this.formData.symbol) {
        this.formData.have_error = true;
      }
      return;
    },
    async save() {
      this.initial_load = false;
      this.checkValidation();
      if (this.formData.have_error) {
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
          res = await updateMstCurrency(dataPost);
        } else {
          res = await insertMstCurrency(dataPost);
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
