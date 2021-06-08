<template>
    <div>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- 消息提示的文案 -->
        <el-alert
          title="消息提示的文案"
          type="info"
          center
          :closable="false"
          show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" class="andSteps" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 商品基本信息表单 -->
        <el-form label-position="top" :model="addForm" :rules="addRules" ref="addRefs" label-width="100px" >
           <!-- 侧边tabs标签页 -->
          <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
              <!-- 商品基本信息 -->
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price" >
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
               <!-- 商品分类级联选择器 -->
              <el-form-item label="商品分类：" class="selectCate" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="goodsCateList"
                    expand-trigger= 'hover'
                    :props="{ 
                      value: 'cat_id',
                      label: 'cat_name',
                      children: 'children'
                    }"
                    clearable
                    @change="selectCateChanged"
                    ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 渲染表单item项 -->
              <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox v-for="(val,index) in item.attr_vals" :key="index" :label="val" border></el-checkbox>
                </el-checkbox-group>  
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!-- action表示图片要上传到的后台API地址 -->
              <el-upload
                :headers="headersObj"
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" style="margin-top:15px" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
       
      </el-card>
      <!-- 预览图片对话框 -->
      <el-dialog
        title="图片预览"
        :visible.sync="picDialogVisible"
        width="70%"
        >
        <img :src="previewPath" alt="" style="width:100%">
      </el-dialog>
    </div>
</template>

<script>
export default {
  data(){
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm:{
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:[],
        // 图片数组
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      // 验证规则
      addRules:{
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
      },
      goodsCateList:[],
      manyTableData:[],
      onlyTableData:[],
      // 图片上传组件的请求头
      headersObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath:'',
      picDialogVisible:false,

    }
  },
  created(){
    this.getCateList()
  },
  methods: {
    //深拷贝
    // deepClone(obj) {
    //   if (typeof obj !== 'object' || obj == null) {
    //       // obj 是 null ，或者不是对象和数组，直接返回
    //       return obj
    //   }
    //   // 初始化返回结果
    //   let result
    //   if (obj instanceof Array) {
    //       result = []
    //   } else {
    //       result = {}
    //   }

    //   for (let key in obj) {
    //       // 保证 key 不是原型的属性
    //       if (obj.hasOwnProperty(key)) {
    //           // 递归调用！！！
    //           result[key] = this.deepClone(obj[key])
    //       }
    //   }
    //   // 返回结果
    //   return result
    // },
    // 获取分类列表
    async getCateList(){
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败！')
      }
      // console.log(res);
      this.goodsCateList = res.data
      // console.log(this.goodsCateList);
    },
    selectCateChanged(){
      //保证只能选中三级分类
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
        return 
      } 
    },
    beforeTabLeave(activeName,oldActiveName){
      // console.log(activeName,oldActiveName);
      if(oldActiveName==='0' && this.addForm.goods_cat.length!==3){
        this.$message.error('请先选择商品名称')
        return false
      }
    },
    async tabClicked(){
      // 如果访问的是动态参数面板
      if (this.activeIndex==='1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
        if (res.meta.status!==200){
          return this.$message.error('获取商品动态参数列表失败！')
        }
        // 将attr_vals转换为数组
        res.data.forEach(item=>{
          return item.attr_vals= item.attr_vals.length===0? []: item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData);
      }
      // 如果访问静态属性面板
      else if(this.activeIndex==='2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
        if (res.meta.status!==200){
          return this.$message.error('获取商品静态属性列表失败！')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData);
      
      }
    },
    // 处理图片预览
    handlePreview(file){
      // console.log(file);
      this.previewPath = file.response.data.url
      console.log(this.previewPath);
      this.picDialogVisible = true
    },
    // 处理图片移除
    handleRemove(file){
      // console.log(file);      
      const filePath = file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter(item=>{
        return item.pic !== filePath
      })
      // console.log(this.addForm);
    },
    handleSuccess(response){
      // console.log(response);
      // 拼接图片信息对象，将其push到pics数组中
      const picInfo = {pic:response.data.tmp_path}
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);
    },
    //点击添加按钮添加商品到数据库
    addGoods(){
      this.$refs.addRefs.validate( async valid=>{
        if(!valid){
          return this.$message.error('请填写必要的表单项')
        }
        //处理动态参数和静态属性
        this.manyTableData.forEach(item=>{
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item=>{
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        console.log(this.addForm);
        const form = JSON.parse(JSON.stringify(this.addForm))
        // const form = this.deepClone(this.addForm)
        //处理goodscat参数
        form.goods_cat = form.goods_cat.join(',')
        console.log(form);
        const {data:res} = await this.$http.post('goods',form)
        if (res.meta.status!==201){
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        // 跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length ===3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
  .andSteps{
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .el-checkbox{
    margin: 0 8px 0 0 !important;
  }
</style>