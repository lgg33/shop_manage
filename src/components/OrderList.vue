<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addorder">添加订单</el-button>
        </el-col>
      </el-row>

      <!-- 订单列表(表格)区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单id" prop="oid"></el-table-column>
        <el-table-column label="订单时间" prop="orderTime" :formatter="dateFormat">
<!--          <template slot-scope="scope">-->
<!--            <img :src="scope.row.orderTime" style="width: 56px; height: 61px;">-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="用户名称" prop="name"></el-table-column>
        <el-table-column label="订单价格" prop="total"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size='mini'
                       @click="showEditDialog(scope.row.cid)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size='mini'
                       @click="removeUserById(scope.row.cid)"></el-button>
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
  </div>
</template>

<script>
  export default {
    name: "OrderList",
    data() {
      return {
        orderList: [],
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

      }
    },
    created() {
      this.getorderList();
    },
    methods: {
      async getorderList() {
        const {data} = await this.$http.get('api/admin/findOrderList/' + this.queryInfo.pagenum + '/' + this.queryInfo.pagesize);
        console.log(data);
        if (data.code !== 200) return this.$message.error('获取订单列表失败');
        this.orderList = data.queryResult.list;
        this.changeImage();
        this.total = data.queryResult.total;
      },
      handleSizeChange(newPageSize) {
        //pagesize改变时触发，当pagesize发生改变的时候，我们应该
        //以最新的pagesize来请求数据并展示数据
        this.queryInfo.pagesize = newPageSize;
        this.getorderList();
      },
      handleCurrentChange(current) {
        //页码发生改变时触发当current发生改变的时候，我们应该
        //以最新的current页码来请求数据并展示数据
        this.queryInfo.pagenum = current;
        this.getorderList();
      },
      changeImage() {
        for (let item of this.orderList) {
          item.pimage = this.imageUrl + item.pimage;
        }
      },
      // 点击按钮，添加
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          console.log(this.addForm);
          // 可以发起添加的网络请求
          const {data} = await this.$http.post('api/admin/addorder', this.addForm);
          console.log(data);
          if (data.code === 200) {
            this.$message.error('添加订单失败！');
          }
          this.$message.success('添加订单成功！');
          // 隐藏添加的对话框
          this.addDialogVisible = false;
          // 重新获取订单列表数据
          this.getorderList();
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
      addorder() {
        this.getCategory();
        this.addDialogVisible = true;
      },
      dateFormat(row,column) {
        let t=new Date(row.orderTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds();
      },
    }
  }
</script>

<style scoped>

</style>
