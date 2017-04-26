import Vue from 'vue';

export const Focus = {
  update(el, binding, vNode) {
    if (binding.value) {
      Vue.nextTick(function () {
        el.focus();
      });
    }
  }
};
