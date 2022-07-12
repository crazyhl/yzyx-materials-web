<template>
  <q-page class="column q-pa-md">
    <div class="row justify-end">
      <q-btn color="primary" label="添加账户" @click="showAddAccountDialog = true" />
    </div>
    <div >
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
          <q-card class="q-mx-xs q-mb-sm" style="width:300px;">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <div v-if="col.name=='action'" style="width: 100%;" class="q-pa-sm row justify-around">
                  <q-btn style="color:blue-grey-7;" @click="openDetail(col.value)">详情</q-btn>
                  <q-btn @click="openEditAccountDialog(col.value)">编辑</q-btn>
                  <q-btn @click="onDeleteAccount(col.value)" color="red-7">删除</q-btn>
                </div>
                <template v-else>
                  <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption class="ellipsis" style="max-width: 200px;word-wrap: break-word;">{{ col.value }}</q-item-label>
                  </q-item-section>
                </template>
              </q-item>
            </q-list>
          </q-card>
        </template>
      </q-table>
    </div>
  </q-page>
  <add-account-dialog :showAddAccountDialog="showAddAccountDialog" @close-dialog="showAddAccountDialog = false" @add-success="refreshData" />
  <edit-account-dialog :show-edit-account-dialog="showEditAccountDialog" @close-dialog="showEditAccountDialog = false" @edit-success="editSuccess" :account="editAccount" />
</template>

<script lang="ts">
import { successNotify } from 'src/utils/notify'
import { defineComponent, ref, onMounted } from 'vue'
import { Account, accountList, deleteAccount } from '../api/account'
import dayjs from 'dayjs'
import AddAccountDialog from 'src/components/AddAccountDialog.vue'
import EditAccountDialog from 'src/components/EditAccountDialog.vue'
import { useRouter } from 'vue-router'
import { useAccountDetailStore } from 'src/stores/account-detail-store'

export default defineComponent({
  name: 'AccountListPage',
  components: { AddAccountDialog, EditAccountDialog },
  setup () {
    const showAddAccountDialog = ref(false)
    const showEditAccountDialog = ref(false)
    const accountListData = ref<Account[]>([])
    const accountListLoading = ref(false)
    const editAccount = ref<Account>({
      id: 0,
      create_at: 0,
      update_at: 0,
      name: '',
      desc: '',
      total: 0,
      expect_total: 0,
      expect_rate_of_return: 0,
      rate_of_return: 0,
      per_part: 0,
      profit_amount: 0
    })

    const refreshData = () => {
      tablePagination.value.page = 1
      getList({
        pagination: tablePagination.value
      })
    }
    const editSuccess = (account: Account) => {
      // 遍历数据，更新数据
      accountListData.value.forEach(item => {
        if (item.id === account.id) {
          item.id = account.id
          item.name = account.name
          item.desc = account.desc
          item.create_at = account.create_at
          item.update_at = account.update_at
          item.expect_rate_of_return = account.expect_rate_of_return
          item.expect_total = account.expect_total
          item.per_part = account.per_part
          item.profit_amount = account.profit_amount
          item.rate_of_return = account.rate_of_return
          item.total = account.total
        }
      })
    }

    const router = useRouter()
    const accDetailStore = useAccountDetailStore()
    // 打开详情
    const openDetail = (account: Account) => {
      accDetailStore.set(account)
      router.push({ name: 'AccountDetail', params: { id: account.id } })
    }

    const onDeleteAccount = async (account: Account) => {
      await deleteAccount(account.id)
      successNotify('删除成功', {
        onDismiss: () => {
          accountListData.value.splice(accountListData.value.indexOf(account), 1)
        }
      })
    }

    const openEditAccountDialog = (account: Account) => {
      editAccount.value = account
      showEditAccountDialog.value = true
    }

    const columns = [
      { name: 'name', label: '名称', field: 'name', format: (val: string) => `${val}`, sortable: false },
      { name: 'desc', label: '描述', field: 'desc', sortable: false },
      { name: 'total', label: '当前投入', field: 'total', sortable: false },
      { name: 'expect_total', label: '预期投入', field: 'expect_total', sortable: false },
      { name: 'per_part', label: '每份金额', field: 'per_part', sortable: false },
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
      accountListData,
      accountListLoading,
      columns,
      tablePagination,
      getList,
      showEditAccountDialog,
      openEditAccountDialog,
      editSuccess,
      onDeleteAccount,
      refreshData,
      editAccount,
      openDetail
    }
  }
})
</script>
