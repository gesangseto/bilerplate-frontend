<template>
  <CButton
    :class="property.class"
    v-c-tooltip="property.tooltip"
    style="margin: 2px; text-align: center"
    v-if="is_visible"
    size="sm"
    :color="property.color"
    v-on:click="$emit('click', $event.target.value)"
  >
    <v-icon
      style="margin-bottom: -1px"
      v-if="property.icon"
      :name="property.icon"
    />
    {{ property.text ? `&nbsp;${property.text}&nbsp;` : null }}
  </CButton>
</template>

<script>
import { buttonPermission } from "../../utils";
export default {
  name: "ButtonPermission",
  props: ["permission", "buttonProperty", "exportType"],
  mounted() {
    this.is_visible = this.button[`can_${this.permission}`];
    if (this.permission == "create") {
      this.property.color = "success";
      this.property.icon = "plus";
      this.property.text = " Add";
    } else if (this.permission == "read") {
      this.property.icon = "eye";
      this.property.color = "info";
      this.property.tooltip = "View";
    } else if (this.permission == "update") {
      this.property.color = "warning";
      this.property.icon = "pencil-alt";
      this.property.tooltip = "Edit";
    } else if (this.permission == "delete") {
      this.property.color = "danger";
      this.property.icon = "trash-alt";
      this.property.tooltip = "Delete";
    } else if (this.permission == "print") {
      this.property.color = "secondary";
      this.property.icon = "print";
    } else if (this.permission == "approve") {
      // this.property.text = "Approve";
      this.property.icon = "clipboard-check";
      this.property.color = "success";
      this.property.tooltip = "Approve / Reject";
    }
    if (this.buttonProperty) {
      this.property = this.buttonProperty;
    }
    if (this.exportType && this.exportType.toLowerCase() == "excel") {
      this.property = this.btn_export_excel;
    } else if (this.exportType && this.exportType.toLowerCase() == "pdf") {
      this.property = this.btn_export_pdf;
    }
  },
  data() {
    return {
      button: buttonPermission({ path: this.$route.path }),
      is_visible: false,
      property: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: null,
        text: "",
        tooltip: "",
      },
      btn_export_excel: {
        size: "sm",
        class: "float-right",
        color: "secondary",
        icon: "file-alt",
        text: "excel",
        tooltip: "Export to excel",
      },
      btn_export_pdf: {
        size: "sm",
        class: "float-right",
        color: "secondary",
        icon: "file-pdf",
        text: "pdf",
        tooltip: "Export to pdf",
      },
    };
  },
  methods: {},
};
</script>
