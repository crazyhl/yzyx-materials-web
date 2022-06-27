<template>
  <q-page class="column">
    <div class="q-pa-md row justify-end">
      <q-btn color="primary" label="添加品种" @click="showAddBreedDialog = true" />
    </div>
    <div class="q-pa-md">
      <q-table
        title="品种列表"
        :rows="breedListData"
        :columns="columns"
        row-key="name"
        :loading="breedListLoading"
        v-model:pagination="tablePagination"
        :rows-per-page-options="[10]"
        @request="getList"
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
            <q-btn @click="openEditBreedDialog(props.value)">编辑</q-btn>&nbsp;
            <q-btn @click="onDeleteAccount(props.value)" color="red-7">删除</q-btn>
          </div>
        </q-td>
      </template>
      </q-table>
    </div>
  </q-page>
  <q-dialog v-model="showAddBreedDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">添加品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="代码" v-model="addBreedForm.code" />
        <q-input autofocus label="名称" v-model="addBreedForm.name" />
        <q-input label="净值" type="number" v-model.number="addBreedForm.net_value" />
        <q-input label="成本" type="number" v-model.number="addBreedForm.cost" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="添加" @click="onAddBreed" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showEditBreedDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">编辑品种</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input autofocus label="代码" v-model="editBreedForm.code" />
        <q-input autofocus label="名称" v-model="editBreedForm.name" />
        <q-input label="净值" type="number" v-model.number="editBreedForm.net_value" />
        <q-input label="成本" type="number" v-model.number="editBreedForm.cost" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="编辑" @click="onEditBreed" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { successNotify } from 'src/utils/notify'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { AddBreedForm, EditBreedForm, Breed, addBreed, editBreed, deleteBreed, breedList } from '../api/breed'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'BreedListPage',
  components: { },
  setup () {
    const showAddBreedDialog = ref(false)
    const showEditBreedDialog = ref(false)
    const addBreedForm = reactive<AddBreedForm>({
      code: '',
      name: '',
      net_value: 0,
      cost: 0
    })
    const editBreedForm = reactive<EditBreedForm>({
      id: 0,
      code: '',
      name: '',
      net_value: 0,
      cost: 0
    })
    const breedListData = ref<Breed[]>([])
    const breedListLoading = ref(false)

    const onAddBreed = async () => {
      await addBreed(addBreedForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('添加成功', {
        onDismiss: () => {
          // 追加到列表头部
          // 添加后重置数据
          addBreedForm.name = ''
          addBreedForm.code = ''
          addBreedForm.net_value = 0
          addBreedForm.cost = 0

          tablePagination.value.page = 1
          getList({
            pagination: tablePagination.value
          })
        }
      })
    }

    const onEditBreed = async () => {
      const data = await editBreed(editBreedForm)
      // 添加成功后弹出对话框，并且把数据追加到列表头部
      successNotify('编辑成功', {
        onDismiss: () => {
          editBreedForm.name = ''
          editBreedForm.code = ''
          editBreedForm.net_value = 0
          editBreedForm.cost = 0
          editBreedForm.id = 0
          // 遍历数据，更新数据
          breedListData.value.forEach(item => {
            if (item.id === data.data.data.id) {
              const breed = data.data.data
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
      editBreedForm.id = breed.id
      editBreedForm.name = breed.name
      editBreedForm.code = breed.code
      editBreedForm.net_value = breed.net_value
      editBreedForm.cost = breed.cost
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

    const getList = async (props: {pagination: {sortBy: string, descending: boolean, page: number, rowsPerPage: number }}) => {
      breedListLoading.value = true
      const { page } = props.pagination
      const { data } = await breedList(page)
      breedListLoading.value = false
      breedListData.value = data.data.data
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
      showAddBreedDialog,
      addBreedForm,
      onAddBreed,
      breedListData,
      breedListLoading,
      columns,
      tablePagination,
      getList,
      showEditBreedDialog,
      openEditBreedDialog,
      editBreedForm,
      onEditBreed,
      onDeleteAccount
    }
  }
})
</script>
