<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 命名空间
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="命名空间" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="命名空间">
          <template #default="scope">
              <el-button size="medium" round @click="goConfig(scope.row.id, scope.row.name)">
                {{ scope.row.name }}
              </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="所有者"></el-table-column>
        <el-table-column prop="raft_id" label="集群ID">
          <template #default="scope">
            <el-button size="medium" round @click="goCluster(scope.row.raft_id)">
              {{ scope.row.raft_id }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="private_key" label="密钥"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag effect="dark" :type="scope.row.type === 0 ? 'success': scope.row.type=== 1 ? 'warning' : scope.row.type === 2 ? 'danger' : 'info'">
              <p v-if="scope.row.type === 0">
                Owner
              </p>
              <p v-else-if="scope.row.type === 1">
                Normal
              </p>
              <p v-else-if="scope.row.type === 2">
                Readonly
              </p>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.type=== 0" type="text" icon="el-icon-s-grid"
                       @click="setAuth(scope.row.id)">设置权限</el-button>
            <el-button v-else disabled type="text" icon="el-icon-s-grid">设置权限</el-button>

            <el-button v-if="scope.row.type=== 0" type="text" icon="el-icon-s-grid"
                       @click="setCluster(scope.row.id, scope.row.raft_id)">更改集群位置</el-button>
            <el-button v-else disabled type="text" icon="el-icon-s-grid">更改集群位置</el-button>

            <el-button v-if="scope.row.type=== 0" type="text" icon="el-icon-s-grid" class="red"
                       @click="deleteNamespace(scope.row.id)">删除</el-button>
            <el-button v-else disabled type="text" icon="el-icon-s-grid">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="新建命名空间" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="命名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="集群">
          <el-select v-model="form.raft_id"  placeholder="请选择">
            <el-option v-for="item in options" :key="item.raft_id" :label="item.raft_id" :value="item.raft_id">
              <span style="float: left">{{ item.raft_id }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNamespace">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <el-dialog title="更改集群" v-model="setClusterVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="集群">
          <el-select v-model="form3.raft_id"  placeholder="请选择">
            <el-option v-for="item in options" :key="item.raft_id" :label="item.raft_id" :value="item.raft_id">
              <span style="float: left">{{ item.raft_id }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setClusterVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeCluster()">确 定</el-button>
                </span>
      </template>
    </el-dialog>

    <el-dialog title="设置权限" v-model="setAuthVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form2.username"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form2.auth"   placeholder="请选择">
            <el-option label="Normal" :value=1 key=1> <el-tag type="warning">Normal</el-tag> </el-option>
            <el-option label="Readonly" :value=2 key=2> <el-tag type="danger">Readonly</el-tag></el-option>
            <el-option label="Abandon" :value=-1 key=-1> <el-tag type="info">Banned</el-tag> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setAuthVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setNamespaceAuth">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { fetchNamespace, fetchCluster } from "../api/index";
import { newNamespaces, getUserNamespaces, setUserNamespaceAuth, delNamespace, updateNamespaceRaftID} from "../api/namespace";
import {getUserClusters} from "../api/cluster";
import { useRouter } from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "namespace",
  setup() {
    const router = useRouter();
    const query = reactive({
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      getUserNamespaces(query).then((res) => {
        tableData.value = res.data.namespaces;
        pageTotal.value = res.data.count || 50;
      });
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    const goConfig = (id, name) => {
      router.push({
        name: "config",
        query: {
          id: id,
          namespace: name
        }
      })
    }

    const addVisible = ref(false);
    let form = reactive({
      name: "",
      raft_id: "",
    });

    const handleAdd = () => {
      getOptions()
      addVisible.value = true
    }

    const options = ref([]);

    const getOptions = () => {
      getUserClusters(query).then((res) => {
        options.value = [];
        for (let i = 0; i<res.data.cluster.length; i++) {
          options.value.push(res.data.cluster[i])
        }
      });
    };

    getOptions();

    const addNamespace = () => {
      // TODO add config
      ElMessageBox.confirm("确定要添加吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            newNamespaces({name: form.name, raft_id: form.raft_id}).then((res) => {
              if (res.status === 0) {
                ElMessage.success("添加成功");
                getData();
                addVisible.value = false
              } else {
                ElMessage.error("添加失败");
              }
            })
          })
          .catch(() => {});
    }

    const goCluster = (raft_id) => {
      //TODO go to cluster monitor
      router.push({
        name: "monitor",
        query: {
          raft_id: raft_id,
        }
      })
    }


    const setAuthVisible = ref(false);
    let form2 = reactive({
      username: "",
      auth: "",
      namespace_id: "",
    });

    const setNamespaceAuth = () => {
      // TODO add config
      ElMessageBox.confirm("确定要设置吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            setUserNamespaceAuth({namespace_id: form2.namespace_id, username: form2.username, type: form2.auth}).then((res) => {
              if (res.status === 0) {
                ElMessage.success("设置成功");
                getData();
                addVisible.value = false
              } else {
                ElMessage.error("设置失败");
              }
            })
          })
          .catch(() => {});
    }

    const setAuth = (id) => {
      form2.username = "";
      form2.auth = "";
      form2.namespace_id = id;
      setAuthVisible.value = true;
    }

    const deleteNamespace = (id) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            delNamespace({namespace_id: id}).then((res) => {
              if (res.status === 0) {
                ElMessage.success("删除成功");
                getData();
              } else {
                ElMessage.error("删除失败");
              }
            })
          })

    }

    const setClusterVisible = ref(false);
    let form3 = reactive({
      raft_id: "",
      namespace_id: 0,
    })

    const setCluster = (id, raft_id) => {
      getOptions()
      form3.raft_id = raft_id
      form3.namespace_id = id
      setClusterVisible.value = true
    }

    const changeCluster = () => {
      updateNamespaceRaftID(form3).then((res) => {
        if (res.status === 0) {
          ElMessage.success("更新成功");
          getData();
          setClusterVisible.value = false
        } else {
          ElMessage.error("更新失败");
        }
      })
    }

    return {
      query,
      tableData,
      pageTotal,
      handleSearch,
      handlePageChange,
      goConfig,
      addVisible,
      form,
      options,
      handleAdd,
      addNamespace,
      goCluster,
      setAuthVisible,
      form2,
      setNamespaceAuth,
      setAuth,
      deleteNamespace,
      form3,
      setCluster,
      changeCluster,
      setClusterVisible
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
