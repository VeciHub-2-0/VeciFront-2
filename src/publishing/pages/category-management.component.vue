<script>
import DataManager from '../../shared/components/data-manager.component.vue';
import CategoryItemCreateAndEditDialog from '../components/category-item-create-and-edit.component.vue';
import {Category} from '../model/category.entity.js';
import {CategoryService} from '../services/category.service.js';

export default {
  name: "category-management",
  components: {DataManager, CategoryItemCreateAndEditDialog},
  data() {
    return {
     title: {singular: 'category', plural: 'categories'},
      categories: [],
      category: new Category({}),
      selectedCategories: [],
      categoryService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    onNewItem() {
      this.category = new Category({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
      console.log("Se aperturo del Dialog Create");
    },
    onEditItem(item)
    {
      this.category = new Category(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item)
    {
      console.log("onDeleteItem");

      this.category = {...item};
      console.log(this.category);
      this.deleteCategory();
    },
    deleteCategory() {
      console.log("delete category");
      this.categoryService.delete(this.category.id).then(() => {
        console.log("antes de buscando el index");

        let index = this.findIndexById(this.category.id);
        console.log("buscando el index");
        this.categories.splice(index, 1);
        this.notifySuccessfulAction("Category Deleted");

      }).catch(error => console.error(error));
    },
    onDeleteSelectedItems(selectedItems)
    {
      console.log("onDeleteSelectedItems");
      this.selectedCategories = selectedItems;
      this.deleteSelectedCategories();
    },
    deleteSelectedCategories()
    {
      this.selectedCategories.forEach((category) => {
        this.categoryService.delete(category.id).then(() => {
          this.categories = this.categories.filter((t) => t.id !== this.category.id);
        });
      });
      this.notifySuccessfulAction("Categories Deleted");
    },
    onCancelRequested()
    {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSaveRequested(item)
    {
      console.log("onSaveRequested todo casi bien");
      this.submitted = true;
      console.log(" onSaveRequested antes del if");
      if (this.category.name.trim()) {
        console.log(" onSaveRequested antes del segundo if");
      //  console.log(item);
        if (item.id)
        { console.log("En el update");
          this.updateCategory();
        }
        else
        {
          console.log("En el create");
          this.createCategory();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    findIndexById(id) {
      return this.categories.findIndex( category => category.id === id);
    },
    createCategory() {
      this.categoryService.create(this.category).then(response =>{
            let category = new Category(response.data)
            console.log(category);
            this.categories.push(category);
            this.notifySuccessfulAction("Category Created");
          }
      ).catch(error => console.error(error));

    },
    notifySuccessfulAction(message){
      this.$toast.add({severity:'success', summary: 'Success', detail: message, life: 3000});
    },
    updateCategory() {
      this.categoryService.update(this.category.id, this.category).then( response =>{
        let index = this.findIndexById(this.category.id);
        this.categories[index] = new Category(response.data);
        this.notifySuccessfulAction("Category Updated");
      }).catch(error => console.error(error));
    }
  },
  created() {
    this.categoryService = new CategoryService();
    this.categoryService.getAll().then(response => {
      this.categories = response.data.map(category => new Category(category));
      console.log(this.categories);
    }).catch(error => console.error(error));
    console.log("obtuvo las categorias");
    console.log(this.categories);
  },
}
</script>
<template>
  <div class="w-full">
    <data-manager :title=title
                  :items="categories"
                  @new-item-requested="onNewItem"
                  @edit-item-requested="onEditItem($event)"
                  @delete-item-requested="onDeleteItem($event)"
                  @delete-selected-items-requested="onDeleteSelectedItems($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="Id" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 24rem"/>
      </template>
    </data-manager>

    <category-item-create-and-edit-dialog
          :edit="isEdit"
          :item="category"
          :visible="createAndEditDialogIsVisible"
          @cancel-requested="onCancelRequested"
          @save-requested="onSaveRequested($event)">

    </category-item-create-and-edit-dialog>

  </div>

</template>