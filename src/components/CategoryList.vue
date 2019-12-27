<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表(表格)区域 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="分类id" prop="cid"></el-table-column>
        <el-table-column label="分类名称" prop="cname"></el-table-column>
        <!--                <el-table-column label="电话" prop="mobile"></el-table-column>-->
        <!--                <el-table-column label="角色" prop="role_name"></el-table-column>-->
        <!--                <el-table-column label="状态">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.cid)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.cid)"></el-button>
            <!-- 分配角色 -->
            <!--                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">-->
            <!--                            <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>-->
            <!--                        </el-tooltip>-->
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

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="分类名" prop="cname">
          <el-input placeholder="请输入分类名称" v-model="addForm.cname"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="分类id">
          <el-input v-model="editForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名" prop="cname">
          <el-input v-model="editForm.cname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "CategoryList",
    data() {
      return {
        //获取查询信息的参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 3
        },
        //存放查询到的数据
        categoryList: [],
        //查询到的总条数
        total: 0,
        // 控制添加对话框的显示与隐藏
        addDialogVisible: false,
        addForm: {
          cname: '',
        },
        // 添加表单的验证规则对象
        addFormRules: {
          cname: [
            { required: true, message: '请输入分类名', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '分类名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
        },
        // 控制修改对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的分类信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          cname: [
            { required: true, message: '请输入分类名', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '分类名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
        },
      }
    },
    created() {
      this.getCategoryList();
    },
    methods: {
      async getCategoryList() {
        const {data} = await this.$http.get('api/category/findAllByPage/' + this.queryInfo.pagenum + '/' + this.queryInfo.pagesize);
        // console.log(data);
        if (data.code !== 200) return this.$message.error('获取分类列表失败');
        this.categoryList = data.queryResult.list;
        this.total = data.queryResult.total;
      },
      handleSizeChange(newPageSize) {
        //pagesize改变时触发，当pagesize发生改变的时候，我们应该
        //以最新的pagesize来请求数据并展示数据
        this.queryInfo.pagesize = newPageSize;
        this.getCategoryList();
      },
      handleCurrentChange(current) {
        //页码发生改变时触发当current发生改变的时候，我们应该
        //以最新的current页码来请求数据并展示数据
        this.queryInfo.pagenum = current;
        this.getCategoryList();
      },
      // 监听添加对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮，添加
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          // 可以发起添加的网络请求
          const {data} = await this.$http.post('api/admin/addCategory', this.addForm);
          console.log(data);
          if (data.code !== 200) {
            this.$message.error('添加分类失败！');
          }
          this.$message.success('添加分类成功！');
          // 隐藏添加的对话框
          this.addDialogVisible = false;
          // 重新获取分类列表数据
          this.getCategoryList();
        })
      },
      // 展示编辑的对话框
      async showEditDialog(id) {
        // console.log(id)
        const {data} = await this.$http.get('api/admin/categoryById/' + id);

        if (data.code !== 200) {
          return this.$message.error('查询分类信息失败！')
        }
        this.editForm = data.queryResult.list[0];
        this.editDialogVisible = true;
      },
      // 监听修改分类对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 修改分类信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          // 发起修改分类信息的数据请求
          const {data} = await this.$http.put(
            'api/admin/updateCategory',
            this.editForm
          );
          if (data.code !== 200) {
            return this.$message.error('更新分类信息失败！')
          }
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getCategoryList();
          // 提示修改成功
          this.$message.success('更新分类信息成功！')
        })
      },
      // 根据Id删除对应的分类信息
      async removeUserById(id) {
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
        const {data} = await this.$http.delete('api/admin/deleteCategory/' + id);

        if (data.code !== 200) {
          return this.$message.error('删除分类失败！');
        }

        this.$message.success('删除分类成功！');
        this.getCategoryList();
      },
    }
  }
</script>

<style scoped>

</style>
