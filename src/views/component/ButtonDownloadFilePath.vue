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
        style="margin-bottom: -1px"
        v-if="property.icon"
        :name="property.icon"
      />
      {{ property.text ? `&nbsp;${property.text}&nbsp;` : null }}
    </CButton>
    {{ !is_visible ? 'File is not set' : '' }}
  </a>
</template>

<script>
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
    downloadFile() {
      let endpoint = process.env.VUE_APP_URL_API_MERTRACK;
      let _url = `${endpoint}/api/v4/helper/download?file_path=${this.file_path}`;
      window.open(`${_url}`, '_blank');
      return true;
    },
  },
};
</script>
