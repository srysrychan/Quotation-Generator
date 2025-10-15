<script setup>
import { computed } from 'vue'

const props = defineProps({
  quotationNumber: {
    type: String,
    required: true
  },
  validUntil: {
    type: String,
    required: true
  },
  company: {
    type: Object,
    required: true
  },
  customer: {
    type: Object,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:quotationNumber', 'update:validUntil', 'update:company', 'update:customer', 'update:notes'])

const localQuotationNumber = computed({
  get: () => props.quotationNumber,
  set: (value) => emit('update:quotationNumber', value)
})

const localValidUntil = computed({
  get: () => props.validUntil,
  set: (value) => emit('update:validUntil', value)
})

const localCompany = computed({
  get: () => props.company,
  set: (value) => emit('update:company', value)
})

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
  <div class="space-y-6">
    <!-- Quote Info Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">報價單資訊</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">
            報價單編號
          </label>
          <input
            v-model="localQuotationNumber"
            type="text"
            placeholder="Q-20251015-0001"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">
            有效期限
          </label>
          <input
            v-model="localValidUntil"
            type="date"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Company Info Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">公司資訊</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-600 mb-2">
            公司名稱
          </label>
          <input
            v-model="localCompany.name"
            type="text"
            placeholder="請輸入公司名稱"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-600 mb-2">
            公司地址
          </label>
          <input
            v-model="localCompany.address"
            type="text"
            placeholder="請輸入公司地址"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">
            公司電話
          </label>
          <input
            v-model="localCompany.phone"
            type="tel"
            placeholder="02-1234-5678"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">
            公司 Email
          </label>
          <input
            v-model="localCompany.email"
            type="email"
            placeholder="company@example.com"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Customer Info Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">客戶資訊</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
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
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-600 mb-2">
            客戶地址
          </label>
          <input
            v-model="localCustomer.address"
            type="text"
            placeholder="請輸入客戶地址"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
        
        <div>
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
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            v-model="localCustomer.email"
            type="email"
            placeholder="customer@example.com"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Notes Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">備註</h2>
      
      <textarea
        v-model="localNotes"
        rows="4"
        placeholder="付款條件、交付時程等備註資訊"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white resize-none transition-all"
      ></textarea>
    </div>
  </div>
</template>
