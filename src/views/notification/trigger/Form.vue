<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader
            class="d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
            <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
          </CCardHeader>

          <CCardBody>
            <CForm>
              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  :col="[3, 9]"
                  title="ID"
                  v-model="formData.id"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Name"
                  placeholder="Enter trigger name"
                  v-model="formData.name"
                  :is-valid="initial_load ? null : formData.name ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Model"
                  placeholder="--Select Model--"
                  :options="listModel"
                  :value="formData.model"
                  :is-valid="
                    initial_load ? null : formData.model ? true : false
                  "
                  v-on:onchange="handleModelChange($event)"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead || !formData.model"
                  :col="[3, 9]"
                  title="Status From"
                  :description="'Optional. Empty = trigger berlaku untuk semua status asal.'"
                  placeholder="--All Status--"
                  :options="listStatus"
                  :value="formData.status_from"
                  v-on:onchange="formData.status_from = $event"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead || !formData.model"
                  :col="[3, 9]"
                  required
                  title="Status To"
                  placeholder="--Select Status--"
                  :options="listStatus"
                  :value="formData.status_to"
                  :is-valid="
                    initial_load ? null : formData.status_to ? true : false
                  "
                  v-on:onchange="formData.status_to = $event"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Notification Template"
                  placeholder="--Select Template--"
                  :options="listTemplate"
                  :value="formData.template_id"
                  :is-valid="
                    initial_load ? null : formData.template_id ? true : false
                  "
                  v-on:onchange="formData.template_id = $event"
                />
              </CCol>
              <CCol sm="12" class="receiver-menu-field">
                <SelectOption
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Receiver Menu"
                  description="All active users with the selected menu access will receive this notification."
                  placeholder="--Select Receiver Menu--"
                  :options="receiverMenuOptions"
                  :value="formData.receiver_menu_id"
                  :is-valid="
                    initial_load
                      ? null
                      : receiverMenuOptions.some(
                          (option) =>
                            String(option.value) ===
                            String(formData.receiver_menu_id),
                        )
                  "
                  v-on:onchange="handleReceiverMenuChange($event)"
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="isRead || !formData.receiver_menu_id"
                  :col="[3, 9]"
                  required
                  title="Receiver Access"
                  description="Only users with this permission on the selected menu receive the notification. The event is determined by Model and Status From/To."
                  placeholder="--Select Receiver Access--"
                  :options="receiverAccessOptions"
                  :value="formData.receiver_access"
                  :is-valid="
                    initial_load
                      ? null
                      : receiverAccessOptions.some(
                          (access) => access.value === formData.receiver_access,
                        )
                  "
                  v-on:onchange="formData.receiver_access = $event"
                />
              </CCol>
              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="isRead"
                    :show_label="true"
                    :default_value="formData.status"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>

          <CCardFooter class="d-flex justify-content-start gap-2">
            <ButtonReason
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
  </div>
</template>

<style scoped>
.receiver-menu-field >>> .vs__dropdown-menu {
  z-index: 1040;
}
</style>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import { getSysDatabaseContent } from '../../../resource/SysDatabaseContent';
import { getStatusDesc } from '../../../resource/StatusDesc';
import { getNotificationTemplate } from '../../../resource/NotificationTemplate';
import { getMstMenu } from '../../../resource/MstMenu';
import {
  getNotificationTrigger,
  insertNotificationTrigger,
  updateNotificationTrigger,
} from '../../../resource/NotificationTrigger';

export default {
  name: 'FormNotificationTrigger',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: {
        status: 'Active',
        status_from: '',
        status_to: '',
        receiver_menu_id: '',
        receiver_access: '',
      },
      listModel: [],
      listStatus: [],
      listTemplate: [],
      listReceiverMenus: [],
      receiverAccesses: [
        { value: 'create', label: 'Create' },
        { value: 'read', label: 'Read' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
        { value: 'approve', label: 'Approve' },
      ],
    };
  },
  computed: {
    isRead() {
      return this.action === 'Read';
    },
    receiverMenuOptions() {
      const menuTypes = {
        0: 'Website',
        1: 'Android',
        2: 'Station',
      };
      return this.listReceiverMenus.map((menu) => {
        return {
          value: menu.id,
          label: `${menuTypes[menu.type] || `Type ${menu.type}`} -> ${
            menu.label || menu.link
          }`,
        };
      });
    },
    receiverAccessOptions() {
      const menu = this.listReceiverMenus.find(
        (item) => String(item.id) === String(this.formData.receiver_menu_id),
      );
      if (!menu) return [];
      const visibleFields = {
        create: 'show_create',
        read: 'show_read',
        update: 'show_update',
        delete: 'show_delete',
        approve: 'show_approve',
      };
      return this.receiverAccesses.filter((access) =>
        this.isEnabled(menu[visibleFields[access.value]]),
      );
    },
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    this.loadModel();
    this.loadTemplate();
    this.loadReceiverMenus();
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    async loadModel() {
      let res = await getSysDatabaseContent({});
      if (res && !res.error) {
        this.listModel = (res.data || [])
          .filter((it) => it.notif_support)
          .map((item) => {
            return { value: item.model, label: item.name || item.model };
          });
      }
    },
    async loadTemplate() {
      let res = await getNotificationTemplate({ status: 'Active' });
      if (res && !res.error) {
        this.listTemplate = (res.data || []).map((item) => {
          return {
            value: item.id,
            label: `${item.name} (${item.channel})`,
          };
        });
      }
    },
    async loadReceiverMenus() {
      const [menuWeb, menuAndroid] = await Promise.all([
        getMstMenu({ type: '0', search: '/transaction' }),
        getMstMenu({ type: '1' }),
      ]);
      const failedResponse = [menuWeb, menuAndroid].find(
        (res) => !res || res.error,
      );
      if (failedResponse) {
        this.listReceiverMenus = [];
        this.$toast.open({
          message:
            failedResponse?.message || 'Failed to load receiver menus.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      this.listReceiverMenus = [
        ...(menuWeb.data || []),
        ...(menuAndroid.data || []),
      ].filter(
        (menu) =>
          menu.status === 'Active' &&
          menu.link &&
          [
            'show_create',
            'show_read',
            'show_update',
            'show_delete',
            'show_approve',
          ].some((field) => this.isEnabled(menu[field])),
      );
    },
    isEnabled(value) {
      return (
        value === true ||
        value === 1 ||
        ['true', '1'].includes(String(value || '').toLowerCase())
      );
    },
    handleReceiverMenuChange(menuId) {
      this.formData.receiver_menu_id = menuId;
      if (
        !this.receiverAccessOptions.some(
          (access) => access.value === this.formData.receiver_access,
        )
      ) {
        this.formData.receiver_access = '';
      }
    },
    async loadStatus(table_name) {
      this.listStatus = [];
      if (!table_name) return;
      let res = await getStatusDesc({ table_name });
      if (res && !res.error) {
        this.listStatus = (res.data || []).map((item) => {
          return { value: item.status_code, label: item.status_desc };
        });
      }
    },
    handleModelChange(model) {
      this.formData.model = model;
      this.formData.status_from = '';
      this.formData.status_to = '';
      this.loadStatus(model);
    },
    async loadData() {
      let res = await getNotificationTrigger({ id: this.$route.params.id });
      if (res && !res.error && res.data && res.data.length > 0) {
        this.formData = res.data[0];
        this.formData.status_from = this.formData.status_from || '';
        this.formData.status_to = this.formData.status_to || '';
        await this.loadStatus(this.formData.model);
      }
    },
    validation() {
      if (!this.formData.name) return false;
      if (!this.formData.model) return false;
      if (!this.formData.status_to) return false;
      if (!this.formData.template_id) return false;
      if (
        !this.receiverMenuOptions.some(
          (option) =>
            String(option.value) === String(this.formData.receiver_menu_id),
        )
      ) {
        return false;
      }
      if (
        !this.receiverAccessOptions.some(
          (access) => access.value === this.formData.receiver_access,
        )
      ) {
        return false;
      }
      return true;
    },
    async save() {
      this.initial_load = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
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
        let formData = {
          ...this.formData,
          status_from: this.formData.status_from || null,
        };
        this.$isLoading(true);
        let res = {};
        if (formData.id) {
          res = await updateNotificationTrigger(formData);
        } else {
          res = await insertNotificationTrigger(formData);
        }
        this.$isLoading(false);
        this.$toast.open({
          message:
            res && !res.error
              ? 'Data has been saved successfully '
              : `${res?.message || 'Failed to save data'}`,
          type: res && !res.error ? 'success' : 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) handleBack(this.$router, this.$route);
      }
    },
  },
};
</script>
