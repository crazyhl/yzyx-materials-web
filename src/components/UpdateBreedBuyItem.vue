<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">更新记录</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- 一个hidden 存放breedid -->
        <input :value="itemId" type="hidden" />
        <q-input outlined v-model="date" label="时间">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model.number="cost"
          type="number"
          outlined
          class="q-mt-md"
          label="单价"
        />
        <q-input
          v-model.number="count"
          type="number"
          outlined
          class="q-mt-md"
          label="份数"
        />
        <q-input
          v-model.number="fee"
          type="number"
          outlined
          class="q-mt-md"
          label="手续费"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCloseAddDialog" />
        <q-btn flat label="编辑" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { BreedBuyItem } from 'src/api/account'
import { updateAddBreedBuyItem } from 'src/api/breed'
import { PropType, ref, toRefs, watch } from 'vue'

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  },
  breedBuyItem: {
    type: Object as PropType<BreedBuyItem>,
    required: true
  }
})
const { showDialog } = toRefs(props)

const show = showDialog // 是否显示对话框

const emit = defineEmits(['updateSuccess', 'closeDialog'])

const onCloseAddDialog = () => {
  emit('closeDialog')
}

const onAdd = () => {
  updateAddBreedBuyItem(
    itemId.value,
    dayjs(date.value, 'YYYY-MM-DD HH:mm').unix(),
    cost.value,
    count.value,
    fee.value
  ).then(res => {
    emit('closeDialog')
    emit('updateSuccess', res.data.data)
  })
}

const itemId = ref(0)
const date = ref('')
const cost = ref(0)
const count = ref(0)
const fee = ref(0)

watch(() => props.breedBuyItem, (item: BreedBuyItem) => {
  console.log('item', item)
  itemId.value = item.id
  date.value = dayjs.unix(props.breedBuyItem.create_at).format('YYYY-MM-DD HH:mm')
  cost.value = props.breedBuyItem.cost
  count.value = props.breedBuyItem.count
  fee.value = props.breedBuyItem.fee
})

</script>
