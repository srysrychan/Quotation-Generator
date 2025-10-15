<script setup>
import { computed } from 'vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-item', 'remove-item', 'update-total'])

// Format number with thousand separators
function formatNumber(num) {
  return new Intl.NumberFormat('zh-TW').format(num)
}

// Handle quantity or unit price change
function handleValueChange(item) {
  emit('update-total', item)
}

// Computed total amount
const totalAmount = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.total || 0), 0)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">報價項目</h2>
      <button
        @click="$emit('add-item')"
        class="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm"
      >
        <PlusIcon class="w-5 h-5" />
        新增項目
      </button>
    </div>
    
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">品項名稱</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">數量</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">單價</th>
            <th class="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">小計</th>
            <th class="w-12"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <td class="py-4 px-3">
              <input
                v-model="item.description"
                type="text"
                placeholder="請輸入品項名稱"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3">
              <input
                v-model.number="item.quantity"
                type="number"
                min="0"
                step="1"
                @input="handleValueChange(item)"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3">
              <input
                v-model.number="item.unitPrice"
                type="number"
                min="0"
                step="1"
                @input="handleValueChange(item)"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </td>
            <td class="py-4 px-3 text-right font-medium text-gray-900">
              {{ formatNumber(item.total) }}
            </td>
            <td class="py-4 px-3 text-center">
              <button
                @click="$emit('remove-item', item.id)"
                class="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="刪除項目"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Mobile Card View -->
    <div class="md:hidden space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="border border-gray-200 rounded-lg p-4"
      >
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">品項名稱</label>
          <input
            v-model="item.description"
            type="text"
            placeholder="請輸入品項名稱"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">數量</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="0"
              @input="handleValueChange(item)"
              class="w-full px-3 py-2 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">單價</label>
            <input
              v-model.number="item.unitPrice"
              type="number"
              min="0"
              @input="handleValueChange(item)"
              class="w-full px-3 py-2 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="flex justify-between items-center pt-3 border-t border-gray-200">
          <span class="text-sm font-medium text-gray-700">小計</span>
          <span class="text-lg font-bold text-gray-900">NT$ {{ formatNumber(item.total) }}</span>
        </div>
        
        <button
          @click="$emit('remove-item', item.id)"
          class="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
        >
          <TrashIcon class="w-5 h-5" />
          刪除項目
        </button>
      </div>
    </div>
    
    <!-- Total Amount -->
    <div class="mt-8 pt-6 border-t border-gray-100">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-600">總金額</span>
        <span class="text-2xl font-bold text-gray-900">NT$ {{ formatNumber(totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>
