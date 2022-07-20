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
            actions
          </div>
        </q-td>
      </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">import dayjs from 'dayjs'
import { accountBreedBuyItemList, BreedBuyItem } from 'src/api/account'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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

</script>
