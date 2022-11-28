<template>
  <CButton
    :class="property.class"
    v-c-tooltip="property.tooltip"
    style="margin: 2px; text-align: center"
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
export default {
  name: "Button",
  props: ["type", "buttonProperty"],
  watch: {
    buttonProperty: {
      handler(n, o) {},
      deep: true,
    },
  },
  mounted() {
    if (this.type == "create") {
      this.property.color = "success";
      this.property.icon = "plus";
      this.property.text = " Add";
    } else if (this.type == "read") {
      this.property.icon = "eye";
      this.property.color = "info";
      this.property.tooltip = "View";
    } else if (this.type == "update") {
      this.property.color = "warning";
      this.property.icon = "pencil-alt";
      this.property.tooltip = "Edit";
    } else if (this.type == "delete") {
      this.property.color = "danger";
      this.property.icon = "trash-alt";
      this.property.tooltip = "Delete";
    } else if (this.type == "print") {
      this.property.color = "secondary";
      this.property.icon = "print";
    } else if (this.type == "approve") {
      this.property.icon = "clipboard-check";
      this.property.color = "success";
      this.property.tooltip = "Approve / Reject";
    }
    if (this.buttonProperty) {
      this.property = this.buttonProperty;
    }
  },
  data() {
    return {
      is_visible: false,
      property: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: "",
        text: "",
        tooltip: "",
      },
    };
  },
  methods: {},
};
</script>
