<script setup>
import { computed } from 'vue'

const props = defineProps({
  customer: {
    type: Object,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:customer', 'update:notes'])

const localCustomer = computed({
  get: () => props.customer,
  set: (value) => emit('update:customer', value)
})

const localNotes = computed({
  get: () => props.notes,
  set: (value) => emit('update:notes', value)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 hover:shadow-md transition-shadow">
    <h2 class="text-lg font-semibold text-gray-800 mb-6">客戶資訊</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-2">
          客戶名稱 <span class="text-red-400">*</span>
        </label>
        <input
          v-model="localCustomer.name"
          type="text"
          placeholder="請輸入客戶名稱"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-2">
          Email
        </label>
        <input
          v-model="localCustomer.email"
          type="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
        />
      </div>
      
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-2">
          聯絡電話
        </label>
        <input
          v-model="localCustomer.phone"
          type="tel"
          placeholder="0912-345-678"
          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
        />
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-600 mb-2">
        備註
      </label>
      <textarea
        v-model="localNotes"
        rows="3"
        placeholder="付款條件、交付時程等備註資訊"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white resize-none transition-all"
      ></textarea>
    </div>
  </div>
</template>
