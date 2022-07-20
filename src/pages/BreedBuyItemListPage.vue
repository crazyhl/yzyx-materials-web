<template>
  <q-page class="column q-pa-md">
    <div class="q-mt-md">
      <q-table
        :title="title"
        :rows="buyItemList"
        :columns="columns"
        row-key="name"
        :loading="buyItemListLoading"
        v-model:pagination="tablePagination"
        :rows-per-page-options="[10]"
        @request="getList"
      >

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div>
            <q-btn color="primary" label="更新" @click="openUpdateBuyItemDialog(props.value)" />
          </div>
        </q-td>
      </template>
      </q-table>
    </div>
  </q-page>
  <update-breed-buy-item :show-dialog="showUpdateBreedBuyItemDialog" :breedBuyItem="breedBuyItem" @close-dialog="showUpdateBreedBuyItemDialog = false" @update-success="onUpdateBuyItemSuccss" />
</template>

<script setup lang="ts">import dayjs from 'dayjs'
import { accountBreedBuyItemList, BreedBuyItem } from 'src/api/account'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import updateBreedBuyItem from 'src/components/UpdateBreedBuyItem.vue'

const buyItemListLoading = ref(true)

const tablePagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'id',
  descending: false
})

const columns = [
  { name: 'created_at', label: '时间', field: (row:BreedBuyItem) => dayjs.unix(row.create_at).format('YYYY-MM-DD'), sortable: false },
  { name: 'cost', label: '成本', field: 'cost', sortable: false },
  { name: 'count', label: '份数', field: 'count', sortable: false },
  { name: 'fee', label: '手续费', field: 'fee', sortable: false },
  { name: 'ftotal_costee', label: '总成本', field: 'total_cost', sortable: false },
  {
    name: 'action',
    label: '操作',
    field: (row: BreedBuyItem) => row,
    sortable: false
  }
]

const route = useRoute()
const accountId = route.params.id
const breedId = route.params.breedId

const buyItemList = ref<BreedBuyItem[]>([])
const title = ref('购买记录')

// 账户中某个品种的购买记录
const getListFunc = accountBreedBuyItemList
if (accountId === undefined) {
  // 品种的全部购买记录
}

const getList = async (props: {pagination: {sortBy: string, descending: boolean, page: number, rowsPerPage: number }}) => {
  buyItemListLoading.value = true
  const { page } = props.pagination
  getListFunc(page, parseInt(accountId.toString()), parseInt(breedId.toString()))
    .then(res => {
      buyItemListLoading.value = false
      buyItemList.value = res.data.data.data
      title.value = res.data.message
      // 更新分页数据
      tablePagination.value.rowsNumber = res.data.data.count
      tablePagination.value.page = page
    })
}

// 在挂载页面的时候获取第一页的数据
onMounted(() => {
  // get initial data from server (1st page)
  getList({
    pagination: tablePagination.value
  })
})

const showUpdateBreedBuyItemDialog = ref(false)
const breedBuyItem = ref<BreedBuyItem>({
  id: 0,
  create_at: 0,
  update_at: 0,
  cost: 0,
  count: 0,
  fee: 0,
  total_cost: 0
})

const openUpdateBuyItemDialog = (buyItem: BreedBuyItem) => {
  breedBuyItem.value = buyItem
  showUpdateBreedBuyItemDialog.value = true
}

const onUpdateBuyItemSuccss = (buyItem: BreedBuyItem) => {
  buyItemList.value.forEach(item => {
    if (item.id === buyItem.id) {
      item.id = buyItem.id
      item.create_at = buyItem.create_at
      item.update_at = buyItem.update_at
      item.cost = buyItem.cost
      item.count = buyItem.count
      item.fee = buyItem.fee
      item.total_cost = buyItem.total_cost
    }
  })
}

</script>
