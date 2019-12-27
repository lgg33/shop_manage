<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"/>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addProduct">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表(表格)区域 -->
      <el-table :data="productList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品id" prop="pid"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.pimage" style="width: 56px; height: 61px;">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="pname"></el-table-column>
        <el-table-column label="商品价格" prop="shopPrice"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size='mini'
                       @click="showEditDialog(scope.row.pid)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size='mini'
                       @click="removeProductById(scope.row.pid)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页导航区域 @size-change(pagesize改变时触发)
                      @current-change(页码发生改变时触发)
                      :current-page(设置当前页码)
                      :page-size(设置每页的数据条数)
                      :total(设置总页数) -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[3, 2, 5, 10]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加商品的对话框 -->
    <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="商品名" prop="pname">
          <el-input placeholder="请输入商品名称" v-model="addForm.pname"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="cid">
          <el-select v-model="addForm.cid" placeholder="请选择商品分类">
            <el-option v-for="item in this.categories" :label="item.cname" :value="item.cid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片" prop="pimage">
          <el-upload
            class="upload-demo"
            drag
            action="api/admin/saveFile" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" list-type="picture"
            :on-preview="handlePreview" :on-remove="handleRemove" accept=".PNG, .jpg, .jpeg">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商城价" prop="marketPrice">
          <el-input placeholder="请输入商城价" v-model="addForm.marketPrice"></el-input>
        </el-form-item>

        <el-form-item label="商品价" prop="shopPrice">
          <el-input placeholder="请输入商品价" v-model="addForm.shopPrice"></el-input>
        </el-form-item>

        <el-form-item label="商品描述" prop="pdesc">
          <el-input type="textarea" placeholder="请输入商品描述" v-model="addForm.pdesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "ProductList",
    data() {
      return {
        productList: [],
        //获取查询信息的参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 3
        },
        total: 0,
        imageUrl: 'http://localhost:8081/',
        value: '',
        categories: [],
        // 控制添加对话框的显示与隐藏
        addDialogVisible: false,
        addForm: {
          cname: '',
          marketPrice: 0,
          shopPrice: 0
        },
        // 添加表单的验证规则对象
        addFormRules: {
          pname: [
            {required: true, message: '请输入商品名', trigger: 'blur'},
            {
              min: 2,
              max: 10,
              message: '商品名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          marketPrice: [
            {required: true, message: '请输入商城价', trigger: 'blur'},
            // {
            //   type: Number,
            //   min: 0,
            //   message: '不能小于0',
            //   trigger: 'blur'
            // }
          ],
          shopPrice: [
            {required: true, message: '请输入商品价', trigger: 'blur'},
            // {
            //   type: Number,
            //   min: 0,
            //   message: '不能小于0',
            //   trigger: 'blur'
            // }
          ],
          // cname: [
          //   {required: true, message: '请输入商品描述', trigger: 'blur'},
          // ],
          // pimage: [
          //   {required: true, message: '请输入商品描述', trigger: 'blur'},
          // ],
        },
      }
    },
    created() {
      this.getProductList();
    },
    methods: {
      async getProductList() {
        const {data} = await this.$http.get('api/admin/findProductList/' + this.queryInfo.pagenum + '/' + this.queryInfo.pagesize);
        // console.log(data);
        if (data.code !== 200) return this.$message.error('获取商品列表失败');
        this.productList = data.queryResult.list;
        this.changeImage();
        this.total = data.queryResult.total;
      },
      handleSizeChange(newPageSize) {
        //pagesize改变时触发，当pagesize发生改变的时候，我们应该
        //以最新的pagesize来请求数据并展示数据
        this.queryInfo.pagesize = newPageSize;
        this.getProductList();
      },
      handleCurrentChange(current) {
        //页码发生改变时触发当current发生改变的时候，我们应该
        //以最新的current页码来请求数据并展示数据
        this.queryInfo.pagenum = current;
        this.getProductList();
      },
      changeImage() {
        for (let item of this.productList) {
          item.pimage = this.imageUrl + item.pimage;
        }
      },
      // 点击按钮，添加
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          console.log(this.addForm);
          // 可以发起添加的网络请求
          const {data} = await this.$http.post('api/admin/addProduct', this.addForm);
          console.log(data);
          if (data.code === 200) {
            this.$message.error('添加商品失败！');
          }
          this.$message.success('添加商品成功！');
          // 隐藏添加的对话框
          this.addDialogVisible = false;
          // 重新获取商品列表数据
          this.getProductList();
        })
      },
      // 监听添加对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      handleAvatarSuccess(res, file) {
        console.log(res);
        this.addForm.pimage = res.url;
      },
      //限制上传文件
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        // console.log(file);
      },
      async getCategory() {
        const {data} = await this.$http.get('api/category/findAll');
        if (data.code !== 200) return this.$message.error("查询分类失败");
        this.categories = data.queryResult.list;
        console.log(this.categories);
      },
      addProduct() {
        this.getCategory();
        this.addDialogVisible = true;
      },
      // 根据Id删除对应的分类信息
      async removeProductById(id) {
        // 弹框询问分类是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除该分类, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        // 如果分类确认删除，则返回值为字符串 confirm
        // 如果分类取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        const {data} = await this.$http.delete('api/admin/deleteProduct/' + id);

        if (data.code !== 200) {
          return this.$message.error('删除商品失败！');
        }

        this.$message.success('删除商品成功！');
        this.getProductList();
      },
      showEditDialog(item) {

      }
    }
  }
</script>

<style scoped>

</style>
