<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">添加账户</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="名称" v-model="addAccountForm.name" />
        <q-input label="描述" type="textarea" v-model="addAccountForm.description" autogrow/>
        <q-input label="预期投入总金额" type="number" v-model.number="addAccountForm.expect_total_money" />
        <q-input label="预期每份金额" type="number" v-model.number="addAccountForm.per_part_money" />
        <q-input label="预期收益率" type="number" v-model.number="addAccountForm.expect_rate_of_return" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="添加" @click="onAddAccount" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { AddAccountForm, addAccount } from '../api/account'
import { successNotify } from 'src/utils/notify'

export default defineComponent({
  name: 'AddAccountDialog',
  props: {
    showAddAccountDialog: {
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
    // const { account } = toRefs(props)
    const addAccountForm = reactive<AddAccountForm>({
      name: '',
      description: '',
      expect_rate_of_return: 0,
      per_part_money: 0,
      expect_total_money: 0
    })

    const onAddAccount = async () => {
      await addAccount(addAccountForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('添加成功', {
        onDismiss: () => {
          // 追加到列表头部
          // 添加后重置数据
          addAccountForm.name = ''
          addAccountForm.description = ''
          addAccountForm.expect_rate_of_return = 0
          addAccountForm.per_part_money = 0
          addAccountForm.expect_total_money = 0
          context.emit('addSuccess')
          context.emit('closeDialog')
        }
      })
    }

    const onCloseAddDialog = () => {
      context.emit('closeDialog')
    }

    const { showAddAccountDialog } = toRefs(props)
    return {
      showDialog: showAddAccountDialog,
      addAccountForm,
      onAddAccount,
      onCloseAddDialog
    }
  }
})
</script>
