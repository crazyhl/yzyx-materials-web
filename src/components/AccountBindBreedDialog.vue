<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">绑定品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select outlined v-model="selectBreed" :options="options" label="品种列表" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onBindBreed" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Account } from 'src/api/account'
import { allBreedList, Breed } from 'src/api/breed'
import { PropType, ref, toRefs } from 'vue'

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  },
  account: {
    type: Object as PropType<Account>,
    required: true
  }
})
const { showDialog } = toRefs(props)

const show = showDialog // 是否显示对话框
const selectBreed = ref(null)
const options = ref<{
  label: string,
  value: string
}[]>([])

const emit = defineEmits(['bindSuccess', 'closeDialog'])

const onCloseAddDialog = () => {
  emit('closeDialog')
}

const onBindBreed = () => {
  console.log('selectBreed', selectBreed.value)
  emit('closeDialog')
  emit('bindSuccess')
}

allBreedList().then(res => {
  console.log('res', res.data.data)
  res.data.data.forEach((element: Breed) => {
    options.value.push({ label: element.name + '(' + element.code + ')', value: element.id.toString() })
  })
})

</script>
