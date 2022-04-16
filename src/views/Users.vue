<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="is_admin" label="身份">
          <template #default="scope">
            <el-tag effect="dark" :type="scope.row.is_admin === 1 ? 'danger' : 'success'">
              <p v-if="scope.row.is_admin === 1">
                管理员
              </p>
              <p v-else>
                普通用户
              </p>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-s-grid"
                       @click="manageCluster(scope.row.id)">管理集群权限</el-button>

            <el-button v-if="scope.row.is_admin === 0" type="text" icon="el-icon-s-custom"
                       @click="setAdmin(scope.row.id)">设为管理员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                       :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="用户集群权限管理" v-model="clusterVisible" width="80%">
      <el-table :data="clusters" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="raft_id" label="集群ID"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="auth" label="权限">
          <template #default="scope">
            <el-tag effect="dark" :type="scope.row.auth === 1 ? 'success' : 'info'">
              <p v-if="scope.row.auth === 1">
                有
              </p>
              <p v-else>
                无
              </p>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-s-grid"
                       @click="changeClusterAuth(scope.row.raft_id, scope.row.auth)">改变集群权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="clusterVisible = false">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { fetchUsers, fetchCluster } from "../api/index";
import { getUsers, setUserAdmin } from "../api/user";
import {getAllClusters, getUserClusters, setUserClusterAuth, unsetUserClusterAuth} from "../api/cluster";
import { useRouter } from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import {setUserNamespaceAuth} from "../api/namespace";

export default {
  name: "users",
  setup() {
    const router = useRouter();
    const query = reactive({
      username: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      getUsers(query).then((res) => {
        tableData.value = res.data.users;
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


    const clusterVisible = ref(false);
    let form = reactive({
      name: "",
      raft_id: "",
    });
    let user_id = 0;

    const clusters = ref([]);
    const getClusters = (id) => {
      getAllClusters().then((allClusterRes) => {
        if (allClusterRes.status !== 0) {
          ElMessage.error("获取失败");
          return
        }
        const userClusterRes = getUserClusters(query).then((userClusterRes) => {
          if (userClusterRes.status !== 0) {
            ElMessage.error("获取失败");
            return
          }
          for (let i=0; i<allClusterRes.data.count; i++) {
            let ok = false
            for (let j=0; j<userClusterRes.data.count; j++) {
              if (allClusterRes.data.cluster[i].raft_id === userClusterRes.data.cluster[j].raft_id) {
                ok = true
                allClusterRes.data.cluster[i].auth = 1
                break
              }
            }
            if (!ok) allClusterRes.data.cluster[i].auth = 0
          }
          clusters.value = allClusterRes.data.cluster
        })
      })
      //     .then((res) => {
      //   // for (let i = 0; i<res.data.cluster.length; i++) {
      //   //   res.data.cluster[i].address = res.data.cluster[i].address.replace(/\n/g, " - - - - - - ")
      //   // }
      //   clusters.value = res.data.cluster;
      // });
    };


    const manageCluster = (id) => {
      getClusters(id)
      user_id = id
      clusterVisible.value = true
    }

    const setAdmin = (id) => {
      ElMessageBox.confirm("确定要设为管理员吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            // TODO del log
            setUserAdmin({id: id}).then((res) => {
              if (res.status === 0) {
                ElMessage.success("操作成功");
              } else {
                ElMessage.error("操作失败");
              }
            })
            getData();
          })
          .catch(() => {});
    }

    const changeClusterAuth = (id, auth) => {
      ElMessageBox.confirm("确定要更改权限吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            if (auth === 0) {
              setUserClusterAuth({user_id: user_id, raft_id: id}).then((res) => {
                if (res.status === 0) {
                  ElMessage.success("操作成功");
                } else {
                  ElMessage.error("操作失败");
                }
              })
            } else {
              unsetUserClusterAuth({user_id: user_id, raft_id: id}).then((res) => {
                if (res.status === 0) {
                  ElMessage.success("操作成功");
                } else {
                  ElMessage.error("操作失败");
                }
              })
            }
            getClusters(user_id);
          })
          .catch(() => {});
    }

    return {
      query,
      tableData,
      pageTotal,
      handleSearch,
      handlePageChange,
      clusterVisible,
      form,
      clusters,
      manageCluster,
      setAdmin,
      changeClusterAuth
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
