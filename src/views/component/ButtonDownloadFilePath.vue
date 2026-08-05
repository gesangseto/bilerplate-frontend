<template>
  <a :href="href ? href : null">
    <CButton
      v-if="is_visible"
      :class="property.class"
      v-c-tooltip="property.tooltip"
      style="margin: 2px; text-align: center"
      size="sm"
      :color="property.color"
      v-on:click="downloadFile()"
    >
      <v-icon
        style="vertical-align: -0.175em"
        v-if="property.icon"
        :name="property.icon"
      />
      {{ property.text ? `&nbsp;${property.text}&nbsp;` : null }}
    </CButton>
    {{ !is_visible ? 'File is not set' : '' }}
  </a>
</template>

<script>
import $axios from '../../api';

export default {
  name: 'ButtonDownloadFilePath',
  props: ['buttonProperty', 'file_path'],
  watch: {
    file_path: {
      deep: true,
      handler(item) {
        if (item) {
          let lastSlashIndex = item.lastIndexOf('/');
          if (item.includes('\\')) {
            lastSlashIndex = item.lastIndexOf('\\');
          }
          this.property.text = item.substring(lastSlashIndex + 1);
          this.is_visible = true;
        }
      },
    },
  },
  mounted() {
    if (this.buttonProperty) {
      this.property = this.buttonProperty;
    }
  },
  data() {
    return {
      is_visible: false,
      property: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'download',
        text: '',
        tooltip: 'download',
      },
      href: null,
    };
  },
  methods: {
    async downloadFile() {
      try {
        let endpoint = process.env.VUE_APP_URL_API;
        let _url = `${endpoint}/api/v4/helper/download?file_path=${this.file_path}`;

        // 🔥 request dengan axios, responseType = blob
        const response = await $axios.get(_url, {
          responseType: 'blob',
        });

        // Cek apakah response sebenarnya error JSON
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const text = await response.data.text();
          const errorObj = JSON.parse(text);
          this.$toast.open({
            message: errorObj.message || 'Download gagal',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }

        // ✅ Kalau sukses → buat link download manual
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Nama file bisa diambil dari header Content-Disposition
        const disposition = response.headers['content-disposition'];
        let fileName = 'download.dat';

        if (disposition && disposition.includes('filename=')) {
          fileName = disposition.split('filename=')[1].replace(/"/g, '');
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.$toast.open({
          message: err,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    },
  },
};
</script>
