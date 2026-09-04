<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <CCol sm="12">
              <SelectOption
                title="Customer"
                placeholder="--Select--"
                required
                :options="listCustomer"
                v-model="formData.customer_id"
                :is-valid="
                  initialLoad ? null : !formData.customer_id ? false : true
                "
              />
              <SelectOption
                title="Product"
                placeholder="--Select--"
                :options="listProduct"
                v-model="formData.product_id"
              />
              <SelectOption
                title="Warehouse"
                placeholder="--Select--"
                :options="listWarehouse"
                v-model="formData.warehouse_id"
              />
              <InputDefault
                title="Quantity"
                placeholder="0"
                required
                validasi="integer"
                v-model="formData.quantity"
                :is-valid="
                  initialLoad ? null : !formData.quantity ? false : true
                "
              />
              <InputDefault
                title="Cost Price"
                placeholder="0"
                required
                validasi="float"
                v-model="formData.cost_price"
                :is-valid="
                  initialLoad ? null : !formData.cost_price ? false : true
                "
              />
              <InputDefault
                title="Selling Price"
                placeholder="0"
                validasi="float"
                v-model="formData.selling_price"
              />
              <InputDefault
                title="Price Code"
                placeholder="--"
                v-model="formData.price_code"
              />
              <CRow form class="form-group">
                <CCol sm="3"> Photo </CCol>
                <CCol sm="9">
                  <input
                    type="file"
                    class="form-control"
                    @change="onFileChange"
                  />
                </CCol>
              </CRow>
            </CCol>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton @click="save()" color="primary" size="sm" type="submit">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { handleBack } from '../../../utils';

export default {
  name: 'FormItemRegistry',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      formData: {
        customer_id: null,
        product_id: null,
        warehouse_id: null,
        quantity: null,
        cost_price: null,
        selling_price: null,
        price_code: null,
      },
      listCustomer: [],
      listProduct: [],
      listWarehouse: [],
      photoFile: null,
    };
  },
  mounted() {
    this.action = this.$route.params.id === undefined ? 'ADD' : 'EDIT';
    this.loadListCustomer();
    this.loadListProduct();
    this.loadListWarehouse();
    if (this.action === 'EDIT') {
      this.loadData();
    }
  },
  methods: {
    loadListCustomer() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/customer?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listCustomer.push({ value: it.id, label: it.name });
        }
      });
    },
    loadListProduct() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/product?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listProduct.push({ value: it.id, label: it.name });
        }
      });
    },
    loadListWarehouse() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/warehouse?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouse.push({ value: it.id, label: it.name });
        }
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/item-registry?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            customer_id: item.customer_id,
            product_id: item.product_id,
            warehouse_id: item.warehouse_id,
            quantity: item.quantity,
            cost_price: item.cost_price,
            selling_price: item.selling_price,
            price_code: item.price_code,
          };
        }
      });
    },
    onFileChange(e) {
      this.photoFile = e.target.files[0];
    },
    save() {
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (!this.formData.quantity || !this.formData.cost_price) {
        this.$toast.open({
          message: 'Quantity and Cost Price are required.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      let formData = new FormData();
      formData.append('customer_id', this.formData.customer_id);
      formData.append('product_id', this.formData.product_id || '');
      formData.append('warehouse_id', this.formData.warehouse_id || '');
      formData.append('quantity', this.formData.quantity);
      formData.append('cost_price', this.formData.cost_price);
      formData.append('selling_price', this.formData.selling_price || 0);
      formData.append('price_code', this.formData.price_code || '');
      if (this.photoFile) {
        formData.append('photo', this.photoFile);
      }

      let url = '/v1/jastip/item-registry';
      let method = this.action === 'ADD' ? 'put' : 'post';
      if (this.action === 'EDIT') {
        formData.append('id', this.$route.params.id);
      }

      this.$isLoading(true);
      $axios[method](url, formData).then((result) => {
        this.$isLoading(false);
        let res = result.data;
        this.$toast.open({
          message: res.error
            ? res.message
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) {
          handleBack(this.$router, this.$route);
        }
      });
    },
  },
};
</script>
