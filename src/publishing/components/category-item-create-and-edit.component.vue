<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue"
export default {
  name: "category-item-create-and-edit-dialog",
  components: {CreateAndEdit},
  props:
      {
        item:null,
        visible:false
      },
  data() {
    return {
      submitted: false,
    }
  },
  emits: ['save-requested', 'cancel-requested'],
  methods: {
    onSaveRequested(item) {
      console.log("onSaveRequested todo bien");
      this.submitted = true;
      this.$emit('save-requested', this.item);
    },
    onCancelRequested() {
      this.$emit('cancel-requested');
    }
  }
}
</script>
<template>
<create-and-edit :entity="item" :visible="visible" entity-name="Category"
    @save-action-requested="onSaveRequested"
    @cancel-action-requested="onCancelRequested">
  <template #content>
    <div class="p-fluid">
      <div class="field mt-5">
        <pv-float-label>
          <label for="name">Name</label>
          <pv-input-text id="name" v-model="item.name" :class="{ 'p-invalid': submitted && !item.name }"></pv-input-text>
        </pv-float-label>
      </div>
    </div>
  </template>

</create-and-edit>
</template>
<style scoped></style>