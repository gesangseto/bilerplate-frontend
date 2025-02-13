<template>
  <div v-if="useKeyboard">
    <modal
      name="keyboard"
      :width="500"
      :height="300"
      :minWidth="500"
      :minHeight="300"
      :adaptive="true"
      :resizable="true"
      :draggable="true"
      :shiftY="1"
      :shiftX="0.5"
      overlayTransition="display: block; margin-left: auto; margin-right: auto"
    >
      <div class="ml-2 mr-2 mt-5 mb-2">
        <vue-touch-keyboard
          :options="options"
          v-if="visible"
          :layout="layout.custom"
          :cancel="hide"
          :accept="accept"
          :input="input"
        />
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'VirtualKeyboard',
  props: ['visible'],
  data() {
    return {
      useKeyboard: false,
      // layout: 'normal',
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
      layout: {
        custom: {
          _meta: {
            tab: { key: '\t', text: 'Tab', width: 60, classes: 'control' },
            shiftl: {
              keySet: 'shifted',
              text: 'Shift',
              width: 100,
              classes: 'control',
            },
            shiftr: {
              keySet: 'shifted',
              text: 'Shift',
              width: 100,
              classes: 'control',
            },
            caps: {
              keySet: 'capsed',
              text: 'Caps',
              width: 80,
              classes: 'control',
            },
            space: { key: ' ', text: 'Space', width: 180 },
            enter: {
              key: '\r\n',
              text: 'Enter',
              width: 80,
              classes: 'control',
            },
            backspace: {
              func: 'backspace',
              classes: 'control backspace',
              width: 65,
            },
            accept: {
              func: 'accept',
              text: 'Close',
              classes: 'control featured',
            },
            next: { func: 'next', text: 'Next', classes: 'control featured' },
          },

          default: [
            '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
            '{tab} q w e r t y u i o p [ ] \\',
            "{caps} a s d f g h j k l ; ' {enter}",
            '{shiftl} z x c v b n m , . / {shiftr}',
            '{space}',
          ],
          shifted: [
            '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
            '{tab} Q W E R T Y U I O P { } |',
            '{caps} A S D F G H J K L : " {enter}',
            '{shiftl} Z X C V B N M < > ? {shiftr}',
            '{space}',
          ],

          capsed: [
            '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
            '{tab} Q W E R T Y U I O P [ ] \\',
            "{caps} A S D F G H J K L ; ' {enter}",
            '{shiftl} Z X C V B N M , . / {shiftr}',
            '{space}',
          ],
        },
      },
    };
  },
  mounted() {
    window.addEventListener('use_keyboard', (event) => {
      let check = event.detail.storage;
      if (check && check.toString().toLowerCase() == 'true') {
        this.useKeyboard = true;
      } else {
        this.useKeyboard = false;
      }
    });
  },
  watch: {
    visible: {
      handler(propertyInput) {
        if (propertyInput) {
          this.input = propertyInput.target;
          // this.layout = 'normal';
          this.$modal.show('keyboard');
        } else {
          this.$modal.hide('keyboard');
        }
      },
      deep: true,
    },
  },
  methods: {
    accept(text) {
      this.hide();
    },

    hide() {
      // this.$emit('handleClose', false);
      this.$modal.hide('keyboard');
      // this.visible = false;
    },
  },
};
</script>
