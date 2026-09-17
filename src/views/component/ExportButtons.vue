<template>
  <span class="float-right">
    <ButtonPermission
      exportType="excel"
      :permission="'print'"
      @click="$emit('export', 'xls')"
    />
    <ButtonPermission
      exportType="pdf"
      :permission="'print'"
      @click="$emit('export', 'pdf')"
    />
  </span>
</template>

<script>
export default {
  name: 'ExportButtons',
};
</script>
