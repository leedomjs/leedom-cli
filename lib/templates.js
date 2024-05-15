module.exports = {
  operate: [
    { name: '默认模版', value: 'default' },
    { name: '远程仓库', value: 'repo' },
    { name: '取消', value: false },
  ],
  type: [
    { name: '移动端', value: 'mobile' },
    { name: 'PC端', value: 'pc' },
    { name: '取消', value: false },
  ],
  mobile: [
    { name: 'Vite + Vue 3', value: 'leedom92/vue-h5-template#main' },
    { name: 'Vite + Vue 2', value: 'leedom92/vue-h5-template#vue2-h5-vite-template' },
    { name: 'Vue CLI + Vue 2', value: 'leedom92/vue-h5-template#vue-h5-webpack-template' },
    { name: '取消', value: false },
  ],
  pc: [
    { name: 'Vite + Vue 3 + Naive UI', value: 'zclzone/vue-naive-admin#2.x' },
    { name: 'Vite + Vue 3 + Element-Plus', value: 'kailong321200875/vue-element-plus-admin#master' },
    { name: 'Vue CLI + Vue 2 + Element', value: 'leedom92/vue-element-admin#main' },
    { name: '取消', value: false },
  ],
}
