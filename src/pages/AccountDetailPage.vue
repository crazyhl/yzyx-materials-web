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
    </q-card>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { useAccountDetailStore } from 'src/stores/account-detail-store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Account, detailAccount } from '../api/account'

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

const accDetailStore = useAccountDetailStore()
console.log(accDetailStore.account)
account.value = accDetailStore.account
formatFields(account.value)

// 如果从 store 获取的数据为空，就去服务端获取数据一下，方式刷新后没数据
if (account.value.id === 0) {
  const route = useRoute()
  console.log(route.params.id)
  detailAccount(parseInt(route.params.id.toString()))
    .then((res) => {
      const data = res.data
      account.value = data.data
      formatFields(account.value)
    })
}

</script>
