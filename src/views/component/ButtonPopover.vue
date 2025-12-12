<template>
  <div class="float-right">
    <CButton
      :class="property.class"
      v-if="is_visible"
      size="sm"
      :color="property.color"
      @click="toggleTooltip"
      class="btn btn-secondary"
      style="margin: 2px; text-align: center"
    >
      <v-icon
        style="vertical-align: -0.175em"
        v-if="property.icon"
        :name="property.icon"
      />
      {{ property.text ? `&nbsp;${property.text}&nbsp;` : null }}
    </CButton>
    <div
      ref="tooltip"
      v-if="showTooltip"
      class="tooltip-container"
      :style="`margin-top: ${mt}%;`"
    >
      <div v-for="item in popover_list" :key="item">
        <div class="tooltip-item" @click="handleClick(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { buttonPermission } from '../../utils';
export default {
  name: 'ButtonPopover',
  props: {
    mt: { type: String, default: '13' },
    permission: { type: String, default: null },
    exportType: { type: String, default: null },
    popover_list: { type: Array, default: [] },
    buttonProperty: { type: Object },
  },
  data() {
    return {
      is_visible: false,
      showTooltip: false,
      access: buttonPermission({ path: this.$route.path }),
      property: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: null,
        text: '',
        tooltip: '',
      },
      btn_export_excel: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'file-alt',
        text: 'excel',
        tooltip: 'Export to excel',
      },
      btn_export_pdf: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'file-pdf',
        text: 'pdf',
        tooltip: 'Export to pdf',
      },
      btn_bpom_report: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'download',
        text: 'BPOM Report',
        tooltip: 'BPOM Report',
      },
    };
  },
  methods: {
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    },
    handleClick(item) {
      this.$emit('handleClick', item);
      this.showTooltip = false;
    },
    handleClickOutside(event) {
      if (this.showTooltip && this.$refs.tooltip && this.$el) {
        if (
          !this.$refs.tooltip.contains(event.target) &&
          !this.$el.contains(event.target)
        ) {
          this.showTooltip = false;
        }
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.is_visible = this.access[`can_${this.permission}`];

    if (this.permission == 'create') {
      this.property.color = 'success';
      this.property.icon = 'plus';
      this.property.text = ' Add';
    } else if (this.permission == 'read') {
      this.property.icon = 'eye';
      this.property.color = 'info';
      this.property.tooltip = 'View';
    } else if (this.permission == 'update') {
      this.property.color = 'warning';
      this.property.icon = 'pencil-alt';
      this.property.tooltip = 'Edit';
    } else if (this.permission == 'delete') {
      this.property.color = 'danger';
      this.property.icon = 'trash-alt';
      this.property.tooltip = 'Delete';
    } else if (this.permission == 'print') {
      this.property.color = 'secondary';
      this.property.icon = 'print';
    } else if (this.permission == 'approve') {
      // this.property.text = "Approve";
      this.property.icon = 'clipboard-check';
      this.property.color = 'success';
      this.property.tooltip = 'Approve / Reject';
    }
    if (this.buttonProperty) {
      this.property = Object.assign({}, this.property, this.buttonProperty);
    }
    if (this.exportType && this.exportType.toLowerCase() == 'excel') {
      this.property = this.btn_export_excel;
    } else if (this.exportType && this.exportType.toLowerCase() == 'pdf') {
      this.property = this.btn_export_pdf;
    } else if (
      this.exportType &&
      this.exportType.toLowerCase() == 'bpom-report'
    ) {
      this.property = this.btn_bpom_report;
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.button-container {
  position: relative;
  display: inline-block;
}

.tooltip-container {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
}

.tooltip-item {
  padding: 5px 10px;
  cursor: pointer;
}

.tooltip-item:hover {
  background-color: #f0f0f0;
}
</style>
