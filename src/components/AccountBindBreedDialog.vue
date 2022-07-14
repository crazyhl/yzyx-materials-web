<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">绑定品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select outlined v-model="selectBreed" :options="options" option-disable="cannotSelect" label="品种列表" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onBindBreed" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Account, accountBindBreed } from 'src/api/account'
import { allBreedList, Breed } from 'src/api/breed'
import { errorNotify } from 'src/utils/notify'
import { PropType, ref, toRefs, watch } from 'vue'

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
const selectBreed = ref<{
  label: string,
  value: number,
  cannotSelect: boolean
}>({
  label: '',
  value: 0,
  cannotSelect: false
})
const options = ref<{
  label: string,
  value: number,
  cannotSelect: boolean
}[]>([])

const emit = defineEmits(['bindSuccess', 'closeDialog'])

const onCloseAddDialog = () => {
  emit('closeDialog')
}

const onBindBreed = () => {
  if (selectBreed.value.value === 0) {
    errorNotify('请选择品种', {})
    return
  }
  accountBindBreed(props.account.id, selectBreed.value.value).then(res => {
    selectBreed.value.label = ''
    selectBreed.value.value = 0
    emit('closeDialog')
    emit('bindSuccess', res.data.data)
  })
}

const allBreeds = ref<Breed[]>()

const refreshOptions = (breeds: Breed[]) => {
  options.value = []
  breeds.forEach((element: Breed) => {
    let cannNotSelect = false
    props.account.breeds?.forEach((breed: Breed) => {
      if (breed.id === element.id) {
        cannNotSelect = true
      }
    })
    options.value.push({ label: element.name + '(' + element.code + ')', value: element.id, cannotSelect: cannNotSelect })
  })
  console.log(options.value)
}

watch(() => props.showDialog, () => {
  console.log('account', props.account)
  if (allBreeds.value === undefined) {
    allBreedList().then(res => {
      allBreeds.value = res.data.data
      refreshOptions(allBreeds.value)
    })
  } else {
    refreshOptions(allBreeds.value)
  }
})

</script>
