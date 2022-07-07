<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">更新净值</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="净值" type="number" v-model.number="updateNetValueForm.net_value" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onUpdateBreedNetValue" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onUpdated, PropType, reactive, toRefs } from 'vue'
import { successNotify } from 'src/utils/notify'
import { Breed, editBreedNetValue, UpdateNetValueForm } from 'src/api/breed'

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
    const updateNetValueForm = reactive<UpdateNetValueForm>({
      id: 0,
      net_value: 0
    })
    onUpdated(() => {
      updateNetValueForm.id = breed.value.id
      updateNetValueForm.net_value = breed.value.net_value
    })

    const onUpdateBreedNetValue = async () => {
      const data = await editBreedNetValue(updateNetValueForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('更新净值成功', {
        onDismiss: () => {
          updateNetValueForm.net_value = 0
          updateNetValueForm.id = 0

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
      updateNetValueForm,
      onUpdateBreedNetValue,
      onCloseAddDialog
    }
  }
})
</script>
