<template>
  <q-page class="column">
    <div class="q-pa-md row justify-end">
      <q-btn color="primary" label="添加账户" @click="showAddAccountDialog = true" />
    </div>
    <div class="q-pa-md">
      <q-table
        grid
        title="列表"
        :rows="accountListData"
        :columns="columns"
        row-key="name"
        hide-header
        :loading="accountListLoading"
      >
      </q-table>
    </div>
  </q-page>
  <q-dialog v-model="showAddAccountDialog" persistent>
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
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="添加" @click="onAddAccount" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { successNotify } from 'src/utils/notify'
import { defineComponent, ref, reactive } from 'vue'
import { AddAccount, addAccount, Account, accountList } from '../api/account'
import dayjs from 'dayjs'
import { RequestResponse } from '../api/response'
import { AxiosResponse } from 'axios'

export default defineComponent({
  name: 'AccountListPage',
  components: { },
  setup () {
    const showAddAccountDialog = ref(false)
    const addAccountForm = reactive<AddAccount>({
      name: '',
      description: '',
      expect_rate_of_return: 0,
      per_part_money: 0,
      expect_total_money: 0
    })
    const accountListData = ref<Account[]>([])
    const accountListLoading = ref(true)

    const onAddAccount = () => {
      const data = addAccount(addAccountForm)
      console.log('data', data)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('添加成功', {})
      // 追加到列表头部
      // 添加后重置数据
      addAccountForm.name = ''
      addAccountForm.description = ''
      addAccountForm.expect_rate_of_return = 0
      addAccountForm.per_part_money = 0
      addAccountForm.expect_total_money = 0
    }

    const columns = [
      { name: 'name', label: '名称', field: 'name', format: (val: string) => `${val}`, sortable: false },
      { name: 'desc', label: '描述', field: 'desc', sortable: false },
      { name: 'total', label: '当前投入', field: 'total', sortable: false },
      { name: 'expect_total', label: '预期投入', field: 'expect_total', sortable: false },
      { name: 'rate_of_return', label: '当前收益率', field: 'rate_of_return', sortable: false },
      { name: 'expect_rate_of_return', label: '预期收益率', field: 'expect_rate_of_return', sortable: false },
      { name: 'profit_amount', label: '收益金额', field: 'profit_amount', sortable: false },
      { name: 'create_at', label: '创建时间', field: 'create_at', format: (val: number) => { return dayjs.unix(val).format('YYYY-MM-DD') }, sortable: false },
      { name: 'update_at', label: '更新时间', field: 'update_at', format: (val: number) => { return dayjs.unix(val).format('YYYY-MM-DD') }, sortable: false }
    ]

    const getList = async (page: number) => {
      const { data } = await accountList(page)
      accountListLoading.value = false
      console.log(data)
      accountListData.value = data.data
    }
    getList(1)
    return {
      showAddAccountDialog,
      addAccountForm,
      onAddAccount,
      accountListData,
      accountListLoading,
      columns
    }
  }
})
</script>
