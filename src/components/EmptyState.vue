<script setup>
import { DocumentPlusIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineEmits(['add-item'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 px-4">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md w-full text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
        <DocumentPlusIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-3">開始建立報價單</h2>
      <p class="text-gray-500 mb-8 leading-relaxed">
        點擊下方按鈕新增第一個報價項目，開始建立您的專業報價單
      </p>
      <button
        @click="$emit('add-item')"
        class="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md"
      >
        <PlusIcon class="w-5 h-5" />
        <span>新增第一個項目</span>
      </button>
    </div>
  </div>
</template>
