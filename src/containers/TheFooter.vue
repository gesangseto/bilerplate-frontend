<template>
  <CFooter
    fixed
    light
    style="
      background-color: #fafaf5;
      border-top: 1px solid rgba(166, 119, 50, 0.18);
    "
  >
    <div>
      <span class="mr-1">Copyright &copy; {{ new Date().getFullYear() }}</span>
      <a href="http://merindo.co.id/" target="_blank"> Gesang Aji Seto</a>
    </div>
    <div
      class="ml-auto"
      style="display: inline-flex; align-items: center; gap: 8px"
    >
      <CButton
        @click="appModal = true"
        color="default"
        style="
          padding: 0;
          min-width: auto;
          min-height: auto;
          height: auto;
          line-height: normal;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        "
      >
        <span class="mr-1">About</span>
      </CButton>
    </div>
    <CModal
      title="Warning Session Timeout"
      color="info"
      :show.sync="appModal"
      size="lg"
    >
      <template #header>
        <h5><strong>About Gastrack&reg; </strong></h5>
      </template>
      <CCardBody>
        <div class="container-area">
          <p v-html="data.about" class="text-area" />
        </div>
      </CCardBody>
      <template #footer>
        <div style="display: block; margin-left: auto; margin-right: auto">
          <img v-bind:src="merindo_image" style="width: auto; height: 40px" />
        </div>
        <div style="display: block; margin-left: auto; margin-right: auto">
          <span class="mr-1">Copyright</span>
          <span class="ml-1">&copy; {{ new Date().getFullYear() }}</span>
          <span class="ml-1"
            ><a href="http://merindo.co.id/" target="_blank"> Gesang Aji Seto</a
            >.</span
          >
          <span class="ml-1">All rights reserved.</span>
        </div>
      </template>
    </CModal>
  </CFooter>
</template>

<style scoped>
.container-area {
  border: 1px solid rgb(212, 212, 212);
  border-radius: 5px;
  padding: 5px;
  margin-left: auto;
  margin-right: auto;
  height: 300px;
  overflow-y: scroll;
}
.text-area {
  background: #fff;
  border: none;
  outline: 0;
  cursor: text;
  resize: none;
}
.sticky-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc; /* Border luar tabel */
}
.sticky-table th,
.sticky-table td {
  text-align: left;
  white-space: nowrap;
  padding: 4px 8px;
}
.sticky-table th {
  text-align: center;
}
</style>
<script>
import { logoMertrack, logoMerindo } from '../constants';
import { getVersion } from '../resource/Version';
import { getConfig } from '../utils';
import { APP_CONFIG } from '@/config';

export default {
  data() {
    return {
      version: {
        web: APP_CONFIG.BUILD_VERSION,
        be: null,
        mobile: '4.2.0',
        bpom: '3.0.1',
      },
      mertrack_image: logoMertrack,
      merindo_image: logoMerindo,
      appModal: false,
      data: {
        about: null,
        identity_name: null,
        entity_address: null,
        total_device: null,
        total_wh: null,
      },
    };
  },
  name: 'TheFooter',
  mounted() {
    this.loadVersion();
    this.data = getConfig();
    this.data.about = `
    This copy of <strong>Gastrack® </strong> is licensed to: <br/>
    <br/>
    
    <strong>Warning</strong>
    <br/>
This computer program is protected by copyright and international treaties. Unauthorized use or reproduction or distribution of this program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
    <br/>
Any modification to this program or any portion of it without approval from Gesang Aji Seto shall be considered as illegal act and could be prosecuted under the law, therefore any valid warranty will be terminated immediately and Gesang Aji Seto will be released from any responsibility and obligation to anything happened due to the illegal modification of the program or any portion of the program.
    <br/>
    <br/>
    <strong>Warranty</strong>
    <br/>
The program warranty period is indicated in the quotation / PO / project agreement.
The program warranty will begin on the date of the software handover document (unless a different start date is specified in the quotation / PO / project agreement).
During the warranty period, licensed customer is entitled for limited free of charge support, maintenance, and program update, unless it is terminated earlier in accordance with the valid warranty period.
    <br/>
Any program modification requested by customer which is outside the scope of Functional and Design Specification of this program will not be part of the warranty and will be considered as Change Request which need to be purchased separately. The Change Request is subject to then-current rates.
    <br/>
    <br/>
    <strong>Post Warranty</strong>
    <br/>
Licensed customer can purchase support and service package or on demand support and service from Gesang Aji Seto after the warranty period ends. Both support and service package and on demand support and service is subject to then-current rates. Terms and condition of support and service after valid warranty ends will be subject to the terms and condition of purchased support and service (package or on demand).
    <br/>
    <br/>
Copyright © ${new Date().getFullYear()} Gesang Aji Seto. All rights reserved.
`;
  },
  methods: {
    async loadVersion() {
      this.version.be = await getVersion();
    },
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
};
</script>
