<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 集群列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="raft_id" label="集群ID"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-s-grid"
                       @click="goCluster(scope.row.raft_id)">查看监控</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  name: "dashboard",
  setup() {
    const role = localStorage.getItem("is_admin")
    const router = useRouter();

    const tableData = ref([]);
    // 获取表格数据
    const getData = () => {
      if (role === "1") {
        getAllClusters().then((res) => {
          tableData.value = res.data.cluster;
        })
      } else {
        getUserClusters({}).then((res) => {
          tableData.value = res.data.cluster;
        })
      }
    };
    getData();

    const goCluster = (raft_id) => {
      //TODO go to cluster monitor
      router.push({
        name: "monitor",
        query: {
          raft_id: raft_id,
        }
      })
    }

    return {
      tableData,
      goCluster,
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
