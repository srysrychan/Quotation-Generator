<script setup>
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/vue/24/outline'

defineEmits(['export-pdf', 'export-csv'])
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
    <h2 class="text-lg font-semibold text-gray-800 mb-6">匯出報價單</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        @click="$emit('export-pdf')"
        class="group flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md"
      >
        <DocumentArrowDownIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>匯出 PDF</span>
      </button>
      
      <button
        @click="$emit('export-csv')"
        class="group flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-medium"
      >
        <TableCellsIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>匯出 CSV</span>
      </button>
    </div>
    
    <p class="text-sm text-gray-400 mt-5 text-center">
      匯出成功後，報價單資料將自動清除
    </p>
  </div>
</template>
