<template>
  <div v-if="reformat_metadata && reformat_metadata.length > 0">
    <CCard>
      <CCardBody>
        <h5>Metadata</h5>
        <hr />
        <div v-for="(item, index) in reformat_metadata" :key="index">
          <CInput
            :placeholder="`Enter ${item.name}`"
            horizontal
            :value="item.result"
            @input="handleChangeInput($event, index)"
            :description="item.pattern_description"
            :is-valid="!item.error_metadata"
          >
            <template #label>
              <p class="col-form-label col-sm-3">
                {{ item.name }}
                <span v-if="item.mandatory" class="text-danger">
                  <strong>*</strong>
                </span>
              </p>
            </template>
          </CInput>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { getConfMetadata } from '../../resource/ConfMetadata';

export default {
  name: 'VirtualKeyboard',
  props: ['defaultMetadata', 'model'],
  data() {
    return {
      config_metadata: null,
      reformat_metadata: null,
    };
  },
  watch: {
    defaultMetadata: {
      handler(item) {
        if (!this.reformat_metadata && item && this.model) {
          this.reformatData();
        }
      },
      deep: true,
    },
    reformat_metadata: {
      handler(item) {
        let data = { result: {}, error_metadata: false };
        for (const it of item) {
          data.result[`${it.name}`] = it.result;
          if (!data.error_metadata) data.error_metadata = it.error_metadata;
        }
        this.$emit('handleChange', data);
      },
      deep: true,
    },
  },
  methods: {
    async reformatData() {
      if (!this.config_metadata) {
        let res = await getConfMetadata({
          status: 'Active',
          model: this.model,
        });
        if (res && res.data[0]) {
          this.config_metadata = res.data[0].metadata;
          let row = [];
          for (const it of this.config_metadata) {
            let result = this.defaultMetadata[it.name];
            let pattern = it.conf_pattern ? it.conf_pattern.pattern : null;
            let pattern_description = it.conf_pattern
              ? it.conf_pattern.description
              : null;
            let error_metadata = this.validation(result, pattern, it.mandatory);
            row.push({
              ...it,
              result,
              pattern,
              pattern_description,
              error_metadata,
            });
          }
          this.reformat_metadata = row;
        }
      }
    },
    testMatch(regex, value) {
      if (!value) value = '';
      if (!regex) return true;
      const pattern = new RegExp(regex, 'g');
      return pattern.test(value);
    },
    validation(result, pattern, mandatory) {
      if (mandatory && !result) {
        return true;
      }
      if (result && pattern && !this.testMatch(pattern, result)) {
        return true;
      }
      return false;
    },
    handleChangeInput(event, index) {
      let newValue = event;
      let item = this.reformat_metadata[index];
      let error_metadata = this.validation(
        newValue,
        item.pattern,
        item.mandatory
      );

      // Update the item with the new value and error_metadata state
      this.$set(this.reformat_metadata, index, {
        ...item,
        result: newValue,
        error_metadata,
      });
    },
  },
};
</script>
