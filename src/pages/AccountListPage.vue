<template>
  <q-page class="column">
    <div class="q-pa-md row justify-end">
      <q-btn color="primary" label="添加账户" @click="showAddAccountDialog = true" />
    </div>
    <div class="q-pa-md">
      <q-table
        grid
        title="账户列表"
        :rows="accountListData"
        :columns="columns"
        row-key="name"
        hide-header
        :loading="accountListLoading"
        v-model:pagination="tablePagination"
        :rows-per-page-options="[10]"
        @request="getList"
      >
        <template v-slot:item="props">
          <q-card class="q-mx-xs">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <div v-if="col.name=='action'" class="q-pa-sm">
                  <q-btn @click="openEditAccountDialog(col.value)">编辑{{col.value.id}}</q-btn>&nbsp;&nbsp;
                  <q-btn color="red-7">删除{{col.value.id}}</q-btn>&nbsp;&nbsp;
                </div>
                <template v-else>
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side style="max-width: 200px;word-wrap: break-word;">
                    <q-item-label caption >{{ col.value }}</q-item-label>
                  </q-item-section>
                </template>
              </q-item>
            </q-list>
          </q-card>
        </template>
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
  <q-dialog v-model="showEditAccountDialog" persistent>
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
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="编辑" @click="onEditAccount" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { successNotify } from 'src/utils/notify'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { AddAccountForm, addAccount, Account, accountList, EditAccountForm, editAccount } from '../api/account'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'AccountListPage',
  components: { },
  setup () {
    const showAddAccountDialog = ref(false)
    const showEditAccountDialog = ref(false)
    const addAccountForm = reactive<AddAccountForm>({
      name: '',
      description: '',
      expect_rate_of_return: 0,
      per_part_money: 0,
      expect_total_money: 0
    })
    const editAccountForm = reactive<EditAccountForm>({
      id: 0,
      name: '',
      description: '',
      expect_rate_of_return: 0,
      per_part_money: 0,
      expect_total_money: 0
    })
    const accountListData = ref<Account[]>([])
    const accountListLoading = ref(false)

    const onAddAccount = () => {
      const data = addAccount(addAccountForm)
      console.log('data', data)
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

          tablePagination.value.page = 1
          getList({
            pagination: tablePagination.value
          })
        }
      })
    }

    const onEditAccount = () => {
      const data = editAccount(editAccountForm)
      console.log('data', data)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('添加成功', {
        onDismiss: () => {
          // 追加到列表头部
          // 添加后重置数据
          editAccountForm.name = ''
          editAccountForm.description = ''
          editAccountForm.expect_rate_of_return = 0
          editAccountForm.per_part_money = 0
          editAccountForm.expect_total_money = 0
          editAccountForm.id = 0

          tablePagination.value.page = 1
          getList({
            pagination: tablePagination.value
          })
        }
      })
    }

    const openEditAccountDialog = (account: Account) => {
      editAccountForm.id = account.id
      editAccountForm.name = account.name
      editAccountForm.description = account.desc
      editAccountForm.expect_rate_of_return = account.expect_rate_of_return
      editAccountForm.expect_total_money = account.expect_total
      editAccountForm.per_part_money = account.per_part
      showEditAccountDialog.value = true
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
      { name: 'update_at', label: '更新时间', field: 'update_at', format: (val: number) => { return dayjs.unix(val).format('YYYY-MM-DD') }, sortable: false },
      {
        name: 'action',
        label: '操作',
        field: (row: Account) => row,
        sortable: false
      }
    ]
    const tablePagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: 'id',
      descending: false
    })

    const getList = async (props: {pagination: {sortBy: string, descending: boolean, page: number, rowsPerPage: number }}) => {
      accountListLoading.value = true
      const { page } = props.pagination
      const { data } = await accountList(page)
      accountListLoading.value = false
      accountListData.value = data.data.data
      // 更新分页数据
      tablePagination.value.rowsNumber = data.data.count
      tablePagination.value.page = page
    }

    onMounted(() => {
      // get initial data from server (1st page)
      getList({
        pagination: tablePagination.value
      })
    })

    return {
      showAddAccountDialog,
      addAccountForm,
      onAddAccount,
      accountListData,
      accountListLoading,
      columns,
      tablePagination,
      getList,
      showEditAccountDialog,
      openEditAccountDialog,
      editAccountForm,
      onEditAccount
    }
  }
})
</script>
