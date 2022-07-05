<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">编辑账户</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="名称" v-model="editAccountForm.name" />
        <q-input label="描述" type="textarea" v-model="editAccountForm.description" autogrow/>
        <q-input label="预期投入总金额" type="number" v-model.number="editAccountForm.expect_total_money" />
        <q-input label="预期每份金额" type="number" v-model.number="editAccountForm.per_part_money" />
        <q-input label="预期收益率" type="number" v-model.number="editAccountForm.expect_rate_of_return" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消"  @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onEditAccount" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, PropType, reactive, toRefs } from 'vue'
import { Account, EditAccountForm, editAccount } from '../api/account'
import { successNotify } from 'src/utils/notify'

export default defineComponent({
  name: 'EditAccountDialog',
  props: {
    showEditAccountDialog: {
      type: Boolean,
      required: true
    },
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  },
  emits: ['editSuccess', 'closeDialog'],
  setup (props, context) {
    // const { account } = toRefs(props)
    const editAccountForm = reactive<EditAccountForm>({
      id: 0,
      name: '',
      description: '',
      expect_rate_of_return: 0,
      per_part_money: 0,
      expect_total_money: 0
    })

    onMounted(() => {
      console.log('aaaaaa')
    })

    onUpdated(() => {
      editAccountForm.id = account.value.id
      editAccountForm.name = account.value.name
      editAccountForm.description = account.value.desc
      editAccountForm.expect_rate_of_return = account.value.expect_rate_of_return
      editAccountForm.expect_total_money = account.value.expect_total
      editAccountForm.per_part_money = account.value.per_part
    })

    const onEditAccount = async () => {
      const data = await editAccount(editAccountForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('编辑成功', {
        onDismiss: () => {
          editAccountForm.name = ''
          editAccountForm.description = ''
          editAccountForm.expect_rate_of_return = 0
          editAccountForm.per_part_money = 0
          editAccountForm.expect_total_money = 0
          editAccountForm.id = 0
          context.emit('editSuccess', data.data.data)
          context.emit('closeDialog')
        }
      })
    }

    const onCloseAddDialog = () => {
      context.emit('closeDialog')
    }

    const { showEditAccountDialog, account } = toRefs(props)

    return {
      showDialog: showEditAccountDialog,
      editAccountForm,
      onEditAccount,
      onCloseAddDialog
    }
  }
})
</script>
