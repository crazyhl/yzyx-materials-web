<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">添加品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="代码" v-model="addBreedForm.code" />
        <q-input autofocus label="名称" v-model="addBreedForm.name" />
        <q-input label="净值" type="number" v-model.number="addBreedForm.net_value" />
        <q-input label="成本" type="number" v-model.number="addBreedForm.cost" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="添加" @click="onAddBreed" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { successNotify } from 'src/utils/notify'
import { addBreed, AddBreedForm } from 'src/api/breed'

export default defineComponent({
  name: 'AddAccountDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
    // account: {
    //   type: Object as PropType<Account>,
    //   required: true
    // }
  },
  emits: ['addSuccess', 'closeDialog'],
  setup (props, context) {
    const addBreedForm = reactive<AddBreedForm>({
      code: '',
      name: '',
      net_value: 0,
      cost: 0
    })

    const onAddBreed = async () => {
      await addBreed(addBreedForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('添加成功', {
        onDismiss: () => {
          // 追加到列表头部
          // 添加后重置数据
          addBreedForm.name = ''
          addBreedForm.code = ''
          addBreedForm.net_value = 0
          addBreedForm.cost = 0

          context.emit('addSuccess')
          context.emit('closeDialog')
        }
      })
    }

    const onCloseAddDialog = () => {
      context.emit('closeDialog')
    }

    const { showDialog } = toRefs(props)
    return {
      show: showDialog,
      addBreedForm,
      onAddBreed,
      onCloseAddDialog
    }
  }
})
</script>
