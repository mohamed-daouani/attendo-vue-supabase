<script setup>
defineProps({
    title: String,
    columns: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto hover:shadow-xl transition-all duration-200">
    <div
      v-if="title"
      class="bg-indigo-800 text-white text-lg font-semibold px-8 py-4 uppercase tracking-wide hover:bg-indigo-700 transition-colors duration-200"
    >
      {{ title }}
    </div>

    <table class="w-full">
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="border-t border-indigo-100 hover:bg-indigo-50 transition-all duration-200 ease-in-out cursor-pointer hover:scale-[1.01]"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-8 py-4 text-indigo-900 font-medium hover:text-indigo-700 transition-colors duration-200"
          >
            <slot :name="col.key" :item="item">
              <span>{{ item[col.key] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!data.length" class="text-center p-6 text-indigo-500 italic hover:text-indigo-600 transition-colors duration-200">
      Aucune donnée trouvée.
    </div>
  </div>
</template>
