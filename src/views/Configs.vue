<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 命名空间: {{namespace}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`数据`" name="data">
          <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" @click="dHandleAdd">新增</el-button>
          </div>
          <el-table :data="dTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="key" label="key"></el-table-column>
            <el-table-column prop="value" label="value"></el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="text" icon="el-icon-delete" class="red"
                           @click="dHandleDelete(namespaceID, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="dQuery.pageIndex"
                           :page-size="dQuery.pageSize" :total="dPageTotal" @current-change="dHandlePageChange"></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`操作记录`" name="operation">
          <template v-if="message === 'operation'">
            <el-table :data="lTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
              <el-table-column prop="id" label="id"></el-table-column>
              <el-table-column label="操作类型" align="center">
                <template #default="scope">
                  <el-tag effect="dark" :type="scope.row.type === 0 ? 'success':'danger'">
                    <p v-if="scope.row.type === 0">
                      Set
                    </p>
                    <p v-else>
                      Del
                    </p>
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="key" label="key"></el-table-column>
              <el-table-column prop="value" label="value"></el-table-column>
              <el-table-column prop="username" label="用户"></el-table-column>
              <el-table-column label="状态" align="center">
                <template #default="scope">
                  <el-tag effect="dark" :type="scope.row.status === 0 ? 'success':'danger'">
                    <p v-if="scope.row.status === 0">
                      Committed
                    </p>
                    <p v-else>
                      Uncommitted
                    </p>
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button type="text" icon="el-icon-s-promotion"
                             @click="lHandleCommit(scope.row.id)">提交</el-button>
                  <el-button type="text" icon="el-icon-delete" class="red"
                             @click="lHandleDelete(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background layout="total, prev, pager, next" :current-page="lQuery.pageIndex"
                             :page-size="lQuery.pageSize" :total="lPageTotal" @current-change="lHandlePageChange"></el-pagination>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="key">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addConfig">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import { ref, reactive } from "vue";
import {fetchKey, fetchLog} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "../router";

export default {
  name: "config",
  setup() {
    const namespaceID = router.currentRoute.value.params.id;
    const namespace = router.currentRoute.value.params.namespace;
    const message = ref("data");
    const dQuery = reactive({
      id: 0,
      pageIndex: 1,
      pageSize: 10,
    });
    const dTableData = ref([]);
    const dPageTotal = ref(0);
    // 获取表格数据
    const dGetData = () => {
      fetchKey(dQuery).then((res) => {
        dTableData.value = res.data.data;
        dPageTotal.value = res.data.count || 50;
      });
    };

    const lQuery = reactive({
      id: 0,
      pageIndex: 1,
      pageSize: 10,
    });
    const lTableData = ref([]);
    const lPageTotal = ref(0);
    // 获取表格数据
    const lGetData = () => {
      fetchLog(lQuery).then((res) => {
        lTableData.value = res.data.log;
        lPageTotal.value = res.data.count || 50;
      });
    };

    dGetData();
    lGetData();

    const dHandlePageChange = (val) => {
      dQuery.pageIndex = val;
      dGetData();
    }

    const lHandlePageChange = (val) => {
      lQuery.pageIndex = val;
      lGetData();
    }

    const lHandleDelete = (id) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            // TODO del log
            ElMessage.success("删除成功");
            lGetData();
          })
          .catch(() => {});
    }

    const lHandleCommit = (id) => {
      ElMessageBox.confirm("确定要提交吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            // TODO commit log
            ElMessage.success("提交成功");
            lGetData()
          })
          .catch(() => {});
    }

    // 表格编辑时弹窗和保存
    const addVisible = ref(false);
    let form = reactive({
      key: "",
      value: "",
    });

    const dHandleAdd = () => {
      form.key = "";
      form.value = "";
      addVisible.value = true;
    }

    const dHandleDelete = (namespaceID, row) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            // TODO del config
            ElMessage.success("删除成功");
            dGetData();
          })
          .catch(() => {});
    }



    const addConfig = () => {
      // TODO add config
      ElMessageBox.confirm("确定要添加吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            ElMessage.success("添加成功");
            addVisible.value = false
            dGetData();
          })
          .catch(() => {});
    }

    return {
      namespace,
      namespaceID,
      message,
      dQuery,
      dTableData,
      dPageTotal,
      lQuery,
      lTableData,
      lPageTotal,
      dHandleDelete,
      dHandleAdd,
      dHandlePageChange,
      lHandlePageChange,
      lHandleDelete,
      lHandleCommit,
      addConfig,
      addVisible,
      form
    };
  },
};
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
.red {
  color: #ff0000;
}
</style>

