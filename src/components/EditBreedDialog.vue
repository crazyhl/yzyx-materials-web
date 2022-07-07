<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">编辑品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="代码" v-model="editBreedForm.code" />
        <q-input autofocus label="名称" v-model="editBreedForm.name" />
        <q-input label="净值" type="number" v-model.number="editBreedForm.net_value" />
        <q-input label="成本" type="number" v-model.number="editBreedForm.cost" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onEditBreed" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onUpdated, PropType, reactive, toRefs } from 'vue'
import { successNotify } from 'src/utils/notify'
import { Breed, editBreed, EditBreedForm } from 'src/api/breed'

export default defineComponent({
  name: 'EditAccountDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    breed: {
      type: Object as PropType<Breed>,
      required: true
    }
  },
  emits: ['editSuccess', 'closeDialog'],
  setup (props, context) {
    // const { account } = toRefs(props)
    const editBreedForm = reactive<EditBreedForm>({
      id: 0,
      code: '',
      name: '',
      net_value: 0,
      cost: 0
    })
    onUpdated(() => {
      editBreedForm.id = breed.value.id
      editBreedForm.name = breed.value.name
      editBreedForm.code = breed.value.code
      editBreedForm.net_value = breed.value.net_value
      editBreedForm.cost = breed.value.cost
    })

    const onEditBreed = async () => {
      const data = await editBreed(editBreedForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('编辑成功', {
        onDismiss: () => {
          editBreedForm.name = ''
          editBreedForm.code = ''
          editBreedForm.net_value = 0
          editBreedForm.cost = 0
          editBreedForm.id = 0
          context.emit('editSuccess', data.data.data)
          context.emit('closeDialog')
        }
      })
    }
    const onCloseAddDialog = () => {
      context.emit('closeDialog')
    }

    const { showDialog, breed } = toRefs(props)

    return {
      show: showDialog,
      editBreedForm,
      onEditBreed,
      onCloseAddDialog
    }
  }
})
</script>
