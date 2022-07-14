<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{account.name}}</div>
        <div class="text-subtitle2">{{account.desc}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-chip>投入 当前：{{account.total}}/预期：{{account.expect_total}}</q-chip>
        <q-chip v-if="account.per_part > 0">每份：{{account.per_part}}</q-chip>
        <q-chip>收益率 当前：{{account.rate_of_return}}/预期：{{account.expect_rate_of_return}}</q-chip>
        <q-chip :color="accountProfitAmountColor" text-color="white">收益：{{account.profit_amount}}</q-chip>
        <q-chip v-if="accountCreateTimeStr !== ''">创建：{{accountCreateTimeStr}}</q-chip>
        <q-chip v-if="accountUpdateTimeStr !== ''">修改：{{accountUpdateTimeStr}}</q-chip>

      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary"  @click="openEditAccountDialog()">
          编辑
        </q-btn>
        <q-btn flat color="primary" @click="showAccountBindBreedDialog = true">
          绑定品种
        </q-btn>
      </q-card-actions>
    </q-card>
    <div class="q-mt-md">
      <q-table
        title="已绑定品种列表"
        :rows="breedListData"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[10]"
      >
      <template v-slot:body-cell-value="props">
        <q-td :props="props">
          <div>
            <q-badge v-if="props.value.cost > props.value.net_value" color="green">
            {{props.value.cost}}/{{props.value.net_value}}
            </q-badge>
            <q-badge v-else color="red">
            {{props.value.cost}}/{{props.value.net_value}}
            </q-badge>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-total_value="props">
        <q-td :props="props">
          <div>
            <q-badge v-if="props.value.total_cost > props.value.total_net_value" color="green">
            {{props.value.total_cost}}/{{props.value.total_net_value}}
            </q-badge>
            <q-badge v-else color="red">
            {{props.value.total_cost}}/{{props.value.total_net_value}}
            </q-badge>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-profit="props">
        <q-td :props="props">
          <div>
            <q-badge v-if="props.value.total_cost > props.value.total_net_value" color="green">
            {{props.value.total_cost - props.value.total_net_value}}
            </q-badge>
            <q-badge v-else color="red">
            {{props.value.total_cost - props.value.total_net_value}}
            </q-badge>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div>
            记一笔位置
          </div>
        </q-td>
      </template>
      </q-table>
    </div>
  </div>
  <edit-account-dialog :show-edit-account-dialog="showEditAccountDialog" @close-dialog="showEditAccountDialog = false" @edit-success="editSuccess" :account="account" />
  <account-bind-breed-dialog :show-dialog="showAccountBindBreedDialog" :account="account" @close-dialog="showAccountBindBreedDialog = false" @bind-success="bindSuccess" />
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Account, detailAccount } from '../api/account'
import EditAccountDialog from 'src/components/EditAccountDialog.vue'
import AccountBindBreedDialog from 'src/components/AccountBindBreedDialog.vue'
import { Breed } from 'src/api/breed'

const formatFields = (account: Account) => {
  accountCreateTimeStr.value = dayjs.unix(account.create_at).format('YYYY-MM-DD')
  accountUpdateTimeStr.value = dayjs.unix(account.update_at).format('YYYY-MM-DD')
  accountProfitAmountColor.value = account.profit_amount >= 0 ? 'red' : 'greed'
}

const account = ref<Account>({
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
const accountCreateTimeStr = ref('')
const accountUpdateTimeStr = ref('')
const accountProfitAmountColor = ref('')
const showAccountBindBreedDialog = ref(false)

const route = useRoute()
detailAccount(parseInt(route.params.id.toString()))
  .then((res) => {
    const data = res.data
    account.value = data.data
    console.log(account.value)
    formatFields(account.value)
    if (data.data.breeds) {
      breedListData.value = data.data.breeds
    }
  })

const showEditAccountDialog = ref(false)

const openEditAccountDialog = () => {
  showEditAccountDialog.value = true
}

const editSuccess = (acc: Account) => {
  account.value = acc
  formatFields(account.value)
}

const bindSuccess = () => {
  console.log('aaaaaa')
}

const columns = [
  { name: 'code', label: '代码', field: 'code', sortable: false },
  { name: 'name', label: '名称', field: 'name', format: (val: string) => `${val}`, sortable: false },
  {
    name: 'value',
    label: '成本/净值',
    field: (row:Breed) => row,
    sortable: false
  },
  { name: 'total_count', label: '总份数', field: 'total_count', sortable: false },
  { name: 'profit', label: '利润', field: (row:Breed) => row, sortable: false },
  { name: 'total_value', label: '总成本/总净值', field: (row:Breed) => row, sortable: false },
  {
    name: 'time',
    label: '添加/更新时间',
    field: (row:Breed) => row,
    format: (val: Breed) => {
      const createTimeStr = dayjs.unix(val.create_at).format('YYYY-MM-DD')
      const updateTimeStr = dayjs.unix(val.update_at).format('YYYY-MM-DD')
      return createTimeStr + '/' + updateTimeStr
    },
    sortable: false
  },
  {
    name: 'action',
    label: '操作',
    field: (row: Breed) => row,
    sortable: false
  }
]

const breedListData = ref<Breed[]>([])

</script>
