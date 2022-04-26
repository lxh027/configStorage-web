<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 集群监控: {{raftID}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-radio-group v-model="peerID" @change="flushCharts()">
          <el-radio v-for="item in peerData" :label="item.peer_id" >{{item.peer_id}}</el-radio>
        </el-radio-group>
      </div>
      <el-row :gutter="12">
        <el-col :span="20">
          <el-card shadow="hover">
            <div slot="header">
              <span>基本信息</span>
            </div>
            <el-descriptions class="margin-top"  direction="vertical"  :column="2" border>
              <el-descriptions-item label="Raft ID">{{basicInfo.raft_id}}</el-descriptions-item>
              <el-descriptions-item label="状态">{{basicInfo.status === 1? "Follower": basicInfo.status === 2? "Candidate": basicInfo.status === 3 ? "Leader":"Shutdown"}}</el-descriptions-item>
              <el-descriptions-item label="配置版本">{{basicInfo.config_version}}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-row>
            <el-card shadow="hover" style="width: -moz-available">
              <div slot="header">
                <span>平均选举时间</span>
              </div>
              <div class="grid-content grid-con-1">
                <div class="grid-cont-right">
                  <div class="grid-num">{{timeInfo.revote_time}}ms</div>
                </div>
              </div>
            </el-card>
          </el-row>
          <el-row>
              <el-card shadow="hover"  style="width: -moz-available">
                <div slot="header">
                  <span>平均提交时间</span>
                </div>
                <div class="grid-content grid-con-1">
                  <div class="grid-cont-right">
                    <div class="grid-num">{{timeInfo.commit_time}}ms</div>
                  </div>
                </div>
              </el-card>
          </el-row>
        </el-col>

      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>内存信息</span>
            </div>
            <div id="memory_chart" style="width: 500px; height: 500px"></div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="hover">
            <div slot="header">
              <span>Raft状态</span>
            </div>
            <div id="raft_chart" style="width: 1000px; height: 500px"></div>
          </el-card>

        </el-col>
      </el-row>
    </div>

  </div>

</template>

<script>
import {ref, reactive, onMounted, onBeforeUnmount} from "vue";
import router from "../router";
import {getClusterPeers, getPeerData} from "../api/monitor";
import {memoryChartsOption, raftChartsOption} from "../api/echarts";
import * as echarts from "echarts";
import {ElMessage} from "element-plus";

export default {
  name: "monitor",
  setup() {
    let memoryChart = "";
    let raftChart = "";
    console.log(memoryChart)
    const raftID = router.currentRoute.value.query.raft_id;
    const pQuery = reactive({
      raft_id: raftID,
    });
    const peerData = ref([]);
    const peerID = ref(0);
    const getPData = () => {
      getClusterPeers(pQuery).then((res) => {
        peerData.value = res.data;
      });
    };
    getPData();

    const dQuery = reactive({
      raft_id: raftID,
      peer_id: Number(peerID),
    })

    const basicInfo = ref({})
    const timeInfo = ref({})
    const flushCharts = () => {
      if (document.getElementById('memory_chart')) {
        const chartDom = document.getElementById('memory_chart');
        memoryChart = echarts.init(chartDom);
      }
      if (document.getElementById('raft_chart')) {
        const chartDom = document.getElementById('raft_chart');
        raftChart = echarts.init(chartDom);
      }
      getPeerData({raft_id: raftID, peer_id: peerID.value}).then((res) => {
        if (res.status !== 0) {
          ElMessage.error("获取监控失败");
          return
        }
        timeInfo.value = res.data.time
        basicInfo.value = res.data.basic;
        memoryChart.setOption(memoryChartsOption(res.data.memory))
        raftChart.setOption(raftChartsOption(res.data.raft))
      })
    }
    let timeout = false
    const repeatFlush = () => {
      if (timeout) return;
      flushCharts()
      setTimeout(repeatFlush, 2000)
    }
    onMounted(() => {
      flushCharts()
      console.log(memoryChart)
      repeatFlush()
    })
    onBeforeUnmount(() => {
      if (memoryChart !== "") {
        memoryChart.dispose()
      }
      if (raftChart !== "") {
        raftChart.dispose()
      }
      timeout = true
    })

    return {
      raftID,
      peerData,
      peerID,
      flushCharts,
      basicInfo,
      timeInfo
    };
  },
};
</script>

<style>
.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-content {
  height: 50px;
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}


.handle-box {
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}
</style>

