import Vue from 'vue'
import CareLabel from './CareLabel.vue'
import parser from './parser.js'

document.addEventListener("DOMContentLoaded", () => {
  new Vue(CareLabel).$mount('#app')
})