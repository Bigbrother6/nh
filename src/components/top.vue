         <!-- <p class="title"><i></i><span>当前告警情况分析</span></p>
          <p class="alarm_title">当前共有{{sysNum}}套系统存告警，告警数量{{alarmNum}}条</p>
          <div class="alarm_box clearfix">
              <div class="alarm_item1">
                  <div class="alarm_red"></div>
                  <h3>{{alarmNum}}条</h3>
              </div>
              <div class="alarm_item2">
                  <div v-for="(item,index) in alarmdata" v-if="index<2">
                      <p>{{item.sysName}}</p>
                      <p>{{item.alarmNum}}条</p>
                  </div>
              </div>
              <div class="alarm_item1">
                <div class="alarm_blue"></div>
                <h3>0条</h3>
              </div>
              <div class="alarm_item2">
                <div>
                  <p>无告警</p>
                  <p>0条</p>
              </div>
              </div>
          </div>
          <div id="chart">
            <div id="chart1" style="width:100%;height: 100%"></div>
          </div>
          <div id="nodata" v-if="nodata">
            <p>暂无告警信息</p>
          </div> -->