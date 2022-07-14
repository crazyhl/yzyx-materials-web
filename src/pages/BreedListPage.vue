<template>
  <q-page class="column q-pa-md">
    <div class="row justify-end">
      <q-btn color="primary" label="添加品种" @click="showAddBreedDialog = true" />
    </div>
    <div class="q-mt-md">
      <q-table
        title="品种列表"
        :rows="breedListData"
        :columns="columns"
        row-key="name"
        :loading="breedListLoading"
        v-model:pagination="tablePagination"
        :rows-per-page-options="[10]"
        :filter="filter"
        @request="getList"
      >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
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
            <q-btn @click="openUpdateBreedNetValueDialog(props.value)" color="deep-purple">更新净值</q-btn>&nbsp;
            <q-btn @click="openEditBreedDialog(props.value)">编辑</q-btn>&nbsp;
            <!-- <q-btn @click="onDeleteAccount(props.value)" color="red-7">删除</q-btn> -->
          </div>
        </q-td>
      </template>
      </q-table>
    </div>
  </q-page>
  <add-breed-dialog :show-dialog="showAddBreedDialog" @close-dialog="showAddBreedDialog = false" @add-success="refreshData" />
  <edit-breed-dialog :show-dialog="showEditBreedDialog" @close-dialog="showEditBreedDialog = false" @edit-success="editSuccess" :breed="editBreed" />
  <update-breed-net-value-dialog  :show-dialog="showUpdateBreedNetValueDialog" @close-dialog="showUpdateBreedNetValueDialog = false" @edit-success="editSuccess" :breed="editBreed"/>
</template>

<script lang="ts">
import { successNotify } from 'src/utils/notify'
import { defineComponent, ref, onMounted } from 'vue'
import { Breed, deleteBreed, breedList } from '../api/breed'
import dayjs from 'dayjs'
import AddBreedDialog from 'src/components/AddBreedDialog.vue'
import EditBreedDialog from 'src/components/EditBreedDialog.vue'
import UpdateBreedNetValueDialog from '../components/UpdateBreedNetValueDialog.vue'

export default defineComponent({
  name: 'BreedListPage',
  components: { AddBreedDialog, EditBreedDialog, UpdateBreedNetValueDialog },
  setup () {
    const showAddBreedDialog = ref(false)
    const showEditBreedDialog = ref(false)
    const showUpdateBreedNetValueDialog = ref(false)

    const breedListData = ref<Breed[]>([])
    const breedListLoading = ref(false)
    // 品种表格接收搜索的字段
    const filter = ref('')

    const editBreed = ref<Breed>({
      id: 0,
      create_at: 0,
      update_at: 0,
      code: '',
      name: '',
      net_value: 0,
      cost: 0,
      total_count: 0,
      total_cost: 0,
      total_net_value: 0
    })

    const refreshData = () => {
      tablePagination.value.page = 1
      getList({
        pagination: tablePagination.value,
        filter: ''
      })
    }

    const editSuccess = (breed: Breed) => {
      // 遍历数据，更新数据
      breedListData.value.forEach(item => {
        if (item.id === breed.id) {
          item.id = breed.id
          item.create_at = breed.create_at
          item.update_at = breed.update_at
          item.name = breed.name
          item.cost = breed.cost
          item.code = breed.code
          item.net_value = breed.net_value
          item.total_count = breed.total_count
          item.total_cost = breed.total_cost
          item.total_net_value = breed.total_net_value
        }
      })
    }

    const onDeleteAccount = async (breed: Breed) => {
      await deleteBreed(breed.id)
      successNotify('删除成功', {
        onDismiss: () => {
          breedListData.value.splice(breedListData.value.indexOf(breed), 1)
        }
      })
    }

    const openEditBreedDialog = (breed: Breed) => {
      editBreed.value = breed
      showEditBreedDialog.value = true
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
    const tablePagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: 'id',
      descending: false
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getList = async (props: {pagination: {sortBy: string, descending: boolean, page: number, rowsPerPage: number }, filter: string | any | undefined}) => {
      breedListLoading.value = true
      const { page } = props.pagination
      const { data } = await breedList(page, props.filter)
      breedListLoading.value = false
      breedListData.value = data.data.data
      // 更新分页数据
      tablePagination.value.rowsNumber = data.data.count
      tablePagination.value.page = page
    }

    const openUpdateBreedNetValueDialog = (breed: Breed) => {
      editBreed.value = breed
      showUpdateBreedNetValueDialog.value = true
    }

    // 在挂载页面的时候获取第一页的数据
    onMounted(() => {
      // get initial data from server (1st page)
      getList({
        pagination: tablePagination.value,
        filter: filter.value
      })
    })

    return {
      showAddBreedDialog,
      refreshData,
      breedListData,
      breedListLoading,
      columns,
      tablePagination,
      getList,
      showEditBreedDialog,
      openEditBreedDialog,
      editBreed,
      editSuccess,
      onDeleteAccount,
      openUpdateBreedNetValueDialog,
      showUpdateBreedNetValueDialog,
      filter
    }
  }
})
</script>
