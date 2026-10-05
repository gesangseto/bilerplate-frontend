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
              <!-- Item Name -->
              <InputDefault
                title="Item Name"
                placeholder="Nama barang"
                v-model="formData.item_name"
              />

              <!-- Quantity -->
              <InputDefault
                title="Quantity"
                placeholder="1"
                required
                validasi="integer"
                v-model="formData.quantity"
                :is-valid="
                  initialLoad ? null : !formData.quantity ? false : true
                "
              />

              <!-- Phone No. with Country Code Prefix & Autocomplete -->
              <CRow form class="form-group">
                <CCol sm="3">
                  Phone No. <span class="text-danger">*</span>
                </CCol>
                <CCol sm="9">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text font-weight-bold">{{
                        phonePrefix
                      }}</span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          !initialLoad && !isValidPhone(formData.customer_phone),
                      }"
                      v-model="formData.customer_phone"
                      @input="handlePhoneInput"
                      placeholder="81234567890"
                      maxlength="15"
                    />
                    <div class="input-group-append" v-if="selectedCustomer">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="clearCustomer"
                        title="Clear customer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Selected Customer Info Badge -->
                  <div
                    v-if="selectedCustomer"
                    class="alert alert-success mt-2 py-2 px-3 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{{ selectedCustomer.name }}</strong>
                      <span class="text-muted ml-2">({{ selectedCustomer.phone }})</span>
                      <div v-if="selectedCustomer.address" class="small text-muted">
                        {{ selectedCustomer.address }}
                      </div>
                    </div>
                  </div>

                  <!-- Dropdown Suggestions -->
                  <div
                    v-if="showSuggestions"
                    class="list-group position-absolute w-100 shadow-sm"
                    style="z-index: 1000; max-height: 220px; overflow-y: auto;"
                  >
                    <div v-if="customerSearching" class="list-group-item text-muted">
                      Mencari customer...
                    </div>
                    <a
                      v-for="cust in customerSuggestions"
                      :key="cust.id"
                      href="javascript:void(0)"
                      class="list-group-item list-group-item-action py-2"
                      @click="selectCustomer(cust)"
                    >
                      <div class="font-weight-bold">{{ cust.name }}</div>
                      <small class="text-muted">{{ cust.phone }}</small>
                      <small v-if="cust.address" class="text-muted d-block">
                        {{ cust.address }}
                      </small>
                    </a>
                  </div>

                  <!-- Form Quick Add Customer if Not Found -->
                  <div
                    v-if="showAddCustomer && !selectedCustomer"
                    class="card border-warning mt-2 p-3 bg-light"
                  >
                    <h6 class="text-warning font-weight-bold mb-2">
                      Customer tidak ditemukan
                    </h6>
                    <p class="small text-muted mb-2">
                      Nomor belum terdaftar. Masukkan nama customer untuk disimpan ke database:
                    </p>
                    <div class="form-group mb-2">
                      <label class="small font-weight-bold">Nama Customer</label>
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="newCustomerName"
                        placeholder="Nama customer (opsional/otomatis dibuatkan dari nomor HP)"
                      />
                    </div>
                    <div class="form-group mb-2">
                      <label class="small font-weight-bold">Alamat</label>
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        v-model="newCustomerAddress"
                        placeholder="Alamat (opsional)"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-warning btn-sm"
                      :disabled="savingCustomer"
                      @click="saveNewCustomer"
                    >
                      {{ savingCustomer ? 'Menyimpan...' : 'Simpan Customer Sekarang' }}
                    </button>
                  </div>
                </CCol>
              </CRow>

              <!-- Cost Price / Cost Code -->
              <CRow form class="form-group">
                <CCol sm="3">
                  Cost Price <span class="text-danger">*</span>
                </CCol>
                <CCol sm="9">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">{{ costSymbol }}</span>
                    </div>
                    <input
                      type="text"
                      class="form-control text-uppercase"
                      :class="{
                        'is-invalid': !initialLoad && !formData.cost_code,
                      }"
                      v-model="formData.cost_code"
                      placeholder="Kode harga (misal: ADB)"
                    />
                    <div class="input-group-append">
                      <select
                        class="custom-select"
                        v-model="formData.cost_unit"
                        style="max-width: 140px;"
                      >
                        <option value="none">Satuan</option>
                        <option value="thousands">Ribu (k)</option>
                        <option value="ten_thousands">Puluh Ribu (10k)</option>
                        <option value="hundred_thousands">Ratus Ribu (100k)</option>
                        <option value="millions">Juta (M)</option>
                      </select>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <!-- Selling Price / Selling Code -->
              <CRow form class="form-group">
                <CCol sm="3">
                  Selling Price <span class="text-danger">*</span>
                </CCol>
                <CCol sm="9">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">{{ sellingSymbol }}</span>
                    </div>
                    <input
                      type="text"
                      class="form-control text-uppercase"
                      :class="{
                        'is-invalid': !initialLoad && !formData.selling_code,
                      }"
                      v-model="formData.selling_code"
                      placeholder="Kode harga (misal: ADB)"
                    />
                    <div class="input-group-append">
                      <select
                        class="custom-select"
                        v-model="formData.selling_unit"
                        style="max-width: 140px;"
                      >
                        <option value="none">Satuan</option>
                        <option value="thousands">Ribu (k)</option>
                        <option value="ten_thousands">Puluh Ribu (10k)</option>
                        <option value="hundred_thousands">Ratus Ribu (100k)</option>
                        <option value="millions">Juta (M)</option>
                      </select>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <!-- Photo Upload -->
              <CRow form class="form-group">
                <CCol sm="3"> Foto Barang </CCol>
                <CCol sm="9">
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="onFileChange"
                  />
                  <div v-if="photoPreview" class="mt-2">
                    <img
                      :src="photoPreview"
                      alt="Preview"
                      class="img-thumbnail"
                      style="max-height: 150px;"
                    />
                  </div>
                </CCol>
              </CRow>

              <!-- Direct Payment (Optional - Create Only) -->
              <div v-if="action === 'ADD'" class="card mt-4 border-info">
                <div class="card-header bg-info text-white py-2">
                  <h6 class="mb-0 font-weight-bold">Pembayaran Langsung (Opsional)</h6>
                </div>
                <div class="card-body">
                  <CRow form class="form-group">
                    <CCol sm="3"> Jumlah Bayar </CCol>
                    <CCol sm="9">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">{{ sellingSymbol }}</span>
                        </div>
                        <input
                          type="number"
                          class="form-control"
                          v-model="paymentAmount"
                          placeholder="0"
                        />
                      </div>
                    </CCol>
                  </CRow>

                  <CRow form class="form-group">
                    <CCol sm="3"> Metode Bayar </CCol>
                    <CCol sm="9">
                      <select class="form-control" v-model="paymentMethod">
                        <option value="BANK_TRANSFER">🏦 Transfer Bank</option>
                        <option value="CASH">💵 Tunai</option>
                        <option value="E_WALLET">📱 E-Wallet</option>
                        <option value="OTHER">🔄 Lainnya</option>
                      </select>
                    </CCol>
                  </CRow>

                  <template v-if="Number(paymentAmount) > 0">
                    <CRow form class="form-group">
                      <CCol sm="3"> No. Referensi </CCol>
                      <CCol sm="9">
                        <input
                          type="text"
                          class="form-control"
                          v-model="paymentRef"
                          placeholder="No. transfer / referensi (opsional)"
                        />
                      </CCol>
                    </CRow>
                    <CRow form class="form-group">
                      <CCol sm="3"> Catatan </CCol>
                      <CCol sm="9">
                        <input
                          type="text"
                          class="form-control"
                          v-model="paymentNotes"
                          placeholder="Catatan pembayaran (opsional)"
                        />
                      </CCol>
                    </CRow>
                  </template>
                </div>
              </div>
            </CCol>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <div class="float-left">
            <CButton @click="save()" color="primary" size="sm" type="submit">
              <CIcon name="cil-check-circle" /> Submit
            </CButton>
            <ButtonBack />
          </div>
          <div class="float-right">
            <ExportButtons
              v-if="action !== 'ADD'"
              @export="handleClickExport"
            />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { exportDataV3, handleBack } from '../../../utils';

export default {
  name: 'FormItemRegistry',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      phonePrefix: '+62',
      costSymbol: 'IDR',
      sellingSymbol: 'Rp',
      formData: {
        id: null,
        item_name: '',
        customer_id: null,
        customer_phone: '',
        quantity: 1,
        cost_code: '',
        cost_unit: 'none',
        selling_code: '',
        selling_unit: 'none',
      },
      // Autocomplete customer
      customerSuggestions: [],
      showSuggestions: false,
      customerSearching: false,
      selectedCustomer: null,
      showAddCustomer: false,
      newCustomerName: '',
      newCustomerAddress: '',
      savingCustomer: false,
      searchTimer: null,
      // Payment (optional)
      paymentAmount: '',
      paymentMethod: 'BANK_TRANSFER',
      paymentRef: '',
      paymentNotes: '',
      photoFile: null,
      photoPreview: null,
    };
  },
  mounted() {
    this.action = this.$route.params.id === undefined ? 'ADD' : 'EDIT';
    this.loadActiveSessionAndConfig();
    if (this.action === 'EDIT') {
      this.loadData();
    }
  },
  methods: {
    toLocalDigits(phone) {
      if (!phone) return '';
      const cc = this.phonePrefix || '+62';
      const ccPlain = cc.replace('+', '');
      let p = String(phone).replace(/[\s\-().]/g, '');
      if (p.startsWith(cc)) p = p.slice(cc.length);
      else if (p.startsWith(ccPlain)) p = p.slice(ccPlain.length);
      else if (p.startsWith('0')) p = p.slice(1);
      return p;
    },
    normalizePhone(phone) {
      if (!phone) return '';
      let clean = String(phone).replace(/[^\d+]/g, '');
      const cc = this.phonePrefix || '+62';
      const ccDigits = cc.replace('+', '');
      if (clean.startsWith('+')) return clean;
      if (clean.startsWith(ccDigits)) return `+${clean}`;
      if (clean.startsWith('0')) return `${cc}${clean.slice(1)}`;
      return `${cc}${clean}`;
    },
    isValidPhone(local) {
      const digits = String(local || '').replace(/\D/g, '');
      return digits.length >= 9 && digits.length <= 15;
    },
    loadActiveSessionAndConfig() {
      $axios.get('/v1/system/configuration').then((res) => {
        let cfg = res.data?.data?.[0] || res.data?.data;
        if (cfg) {
          if (cfg.country_code) this.phonePrefix = cfg.country_code;
          if (cfg.currency) this.sellingSymbol = cfg.currency;
          if (cfg.price_unit_code) this.formData.selling_unit = cfg.price_unit_code;
        }
      }).catch(() => {});

      $axios.get('/v1/jastip/dashboard').then((res) => {
        let active = res.data?.data?.active_session;
        if (active) {
          this.costSymbol = active.symbol_currency || active.currency_code || 'IDR';
          if (active.price_code_unit) this.formData.cost_unit = active.price_code_unit;
        }
      }).catch(() => {});
    },
    handlePhoneInput(e) {
      const digits = String(e.target.value || '').replace(/\D/g, '');
      this.formData.customer_phone = digits;
      this.selectedCustomer = null;

      if (!digits || digits.length < 3) {
        this.customerSuggestions = [];
        this.showSuggestions = false;
        this.showAddCustomer = false;
        return;
      }

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchCustomer(digits);
      }, 500);
    },
    searchCustomer(phone) {
      this.customerSearching = true;
      this.showSuggestions = true;
      $axios
        .get(`/v1/master/customer?search=${phone}`)
        .then((res) => {
          this.customerSearching = false;
          let list = res.data?.data || [];
          const exact = list.find((c) => this.toLocalDigits(c.phone) === phone);
          if (exact) {
            this.selectCustomer(exact);
            return;
          }
          this.customerSuggestions = list;
          this.showSuggestions = list.length > 0;
          this.showAddCustomer = list.length === 0;
        })
        .catch(() => {
          this.customerSearching = false;
          this.showSuggestions = false;
          this.showAddCustomer = false;
        });
    },
    selectCustomer(cust) {
      this.selectedCustomer = cust;
      this.formData.customer_id = cust.id;
      this.formData.customer_phone = this.toLocalDigits(cust.phone);
      this.customerSuggestions = [];
      this.showSuggestions = false;
      this.showAddCustomer = false;
    },
    clearCustomer() {
      this.selectedCustomer = null;
      this.formData.customer_id = null;
      this.formData.customer_phone = '';
      this.customerSuggestions = [];
      this.showSuggestions = false;
      this.showAddCustomer = false;
    },
    async saveNewCustomer() {
      if (!this.isValidPhone(this.formData.customer_phone)) {
        this.$toast.open({
          message: 'Nomor telepon tidak valid (9-15 digit)',
          type: 'error',
          position: 'top-right',
          duration: 4000,
        });
        return null;
      }

      const fullPhone = this.normalizePhone(this.formData.customer_phone);
      const nameToSave = this.newCustomerName.trim() || `Customer ${this.formData.customer_phone}`;
      this.savingCustomer = true;
      try {
        const res = await $axios.put('/v1/master/customer', {
          name: nameToSave,
          phone: fullPhone,
          address: this.newCustomerAddress.trim(),
        });
        this.savingCustomer = false;
        let saved = res.data?.data;
        if (saved) {
          const custObj = {
            id: saved.id,
            name: saved.name || nameToSave,
            phone: saved.phone || fullPhone,
            address: saved.address || this.newCustomerAddress.trim(),
          };
          this.selectCustomer(custObj);
          this.newCustomerName = '';
          this.newCustomerAddress = '';
          return custObj;
        }
        return null;
      } catch (e) {
        this.savingCustomer = false;
        this.$toast.open({
          message: e?.response?.data?.message || 'Gagal menyimpan customer ke database',
          type: 'error',
          position: 'top-right',
          duration: 4000,
        });
        return null;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: { item_id: this.$route.params.id },
        exportType: type,
        url: '/v1/jastip/item-registry',
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/item-registry?item_id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            id: item.id,
            item_name: item.item_name || item.product_name || '',
            customer_id: item.customer_id,
            customer_phone: this.toLocalDigits(item.customer_phone),
            quantity: item.quantity || 1,
            cost_code: item.cost_code || '',
            cost_unit: item.cost_unit || 'none',
            selling_code: item.selling_code || '',
            selling_unit: item.selling_unit || 'none',
          };
          if (item.customer_phone) {
            this.selectedCustomer = {
              id: item.customer_id,
              name: item.customer_name,
              phone: item.customer_phone,
            };
          }
          if (item.photo_thumbnail || item.photo_path) {
            this.photoPreview = `/${item.photo_thumbnail || item.photo_path}`;
          }
        }
      });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.photoFile = file;
      if (file) {
        this.photoPreview = URL.createObjectURL(file);
      } else {
        this.photoPreview = null;
      }
    },
    async save() {
      this.initialLoad = false;
      if (!this.isValidPhone(this.formData.customer_phone)) {
        this.$toast.open({
          message: 'Nomor telepon customer wajib valid (9-15 digit)',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (!this.formData.quantity || Number(this.formData.quantity) <= 0) {
        this.$toast.open({
          message: 'Quantity wajib diisi lebih dari 0',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (!this.formData.cost_code || !this.formData.selling_code) {
        this.$toast.open({
          message: 'Cost Price Code dan Selling Price Code wajib diisi',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      // Pastikan customer tersimpan di DB jika belum ada
      let customerId = this.selectedCustomer?.id;
      if (!customerId) {
        this.$isLoading(true);
        const created = await this.saveNewCustomer();
        if (!created || !created.id) {
          this.$isLoading(false);
          return;
        }
        customerId = created.id;
      }

      let formData = new FormData();
      if (this.formData.item_name) formData.append('item_name', this.formData.item_name);
      formData.append('quantity', this.formData.quantity);
      formData.append('cost_code', this.formData.cost_code.toUpperCase());
      formData.append('selling_code', this.formData.selling_code.toUpperCase());
      formData.append('cost_unit', this.formData.cost_unit || 'none');
      formData.append('selling_unit', this.formData.selling_unit || 'none');
      formData.append('customer_id', customerId);

      if (this.photoFile) {
        formData.append('photo', this.photoFile);
      }

      // Pembayaran langsung (opsional create baru)
      if (this.action === 'ADD' && Number(this.paymentAmount) > 0) {
        formData.append('payment_amount', this.paymentAmount);
        formData.append('payment_method', this.paymentMethod);
        if (this.paymentRef.trim()) formData.append('reference_number', this.paymentRef.trim());
        if (this.paymentNotes.trim()) formData.append('payment_notes', this.paymentNotes.trim());
      }

      let url = '/v1/jastip/item-registry';
      let method = this.action === 'ADD' ? 'put' : 'post';
      if (this.action === 'EDIT') {
        formData.append('id', this.$route.params.id);
      }

      this.$isLoading(true);
      $axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((result) => {
        this.$isLoading(false);
        let res = result.data;
        this.$toast.open({
          message: res.error
            ? res.message
            : 'Data has been saved successfully',
          type: res.error ? 'error' : 'success',
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) {
          handleBack(this.$router, this.$route);
        }
      }).catch((e) => {
        this.$isLoading(false);
        this.$toast.open({
          message: e?.response?.data?.message || e.message || 'Gagal menyimpan item',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      });
    },
  },
};
</script>
