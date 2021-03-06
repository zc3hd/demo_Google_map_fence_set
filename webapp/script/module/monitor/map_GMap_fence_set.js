/**
 * Item Name  : 
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.1.18
 *@pararm     :
 */
(function($, window) {

  function map_GMap_fence_set(opts) {
    // 地图容器标识
    this.id = opts.id;
    // 设备的识别
    this.sn = opts.sn;
    // 要设置围栏的基准点
    this.point = opts.point;

    // 谷歌的地图的全局变量
    this.Gmap = google.maps;

    // 已经保存的围栏
    // this.fences = opts.fences;
    this.fences = [{
      alarmType: 1,
      center: [
        { lng: 116.336691, lat: 40.006788 }
      ],
      fenceName: '围栏1',
      radius: 10000,
      shapeType: 0
    }, {
      alarmType: 0,
      center: [
        { lng: 116.336691, lat: 40.106788 },
        { lng: 116.336691, lat: 40.207299 },
        { lng: 116.536691, lat: 40.207299 },
        { lng: 116.536691, lat: 40.106788 },
      ],
      fenceName: '围栏2',
      radius: null,
      shapeType: 1
    }, ];

    // 添加围栏按钮
    this.btn_add_f = null;
    // 保存和删除围栏
    this.btn_saveDel_f = null;


    // 绘画工具容器
    this.drawingManager = null


    // 出入围栏标识
    this.alarmType = null;
    // 形状标识
    this.shapeType = null;
    // 围栏名称
    this.fenceName = '';

    // 当前点击的围栏
    this.active_f = null;


    // 这里需要注意，百度地图有获取页面所有的覆盖物的API，google没有，我需要自己定义一个类ID的唯一标识
    // 围栏的唯一标识
    this.f_id = 0;
    // 全局围栏数组
    this.f_arrs = [];

  };
  map_GMap_fence_set.prototype = {
    // 入口函数
    init: function() {
      var me = this;
      // 初始控件和地图
      me.init_mapBaner()
        // 初始化事件
      me.init_event();

    },
    // -----------------------------------------组件初始
    //控件默认初始化
    init_mapBaner: function() {
      var me = this;
      me.map = new me.Gmap.Map($('#' + me.id)[0], {
        center: {
          lat: 39.920026,
          lng: 116.403694
        },
        zoom: 11,
        // 地图类型控件
        mapTypeControl: true,
        mapTypeControlOptions: {
          // 展示的形式
          // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          // 要地图类型的控件
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            // google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID
          ],
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        // 缩放控件
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,

        // 全景模式开启
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
    },
    //控件自定义初始化
    init_setBaner: function() {
      var me = this;
      // 目前没有自定义
    },
    // -----------------------------------------初始化事件
    init_event: function() {
      var me = this;
      // -----------项目选择
      me.fence_bind();
      me.fence();
    },
    // -----------------------------------------围栏设置
    fence: function(argument) {
      var me = this;
      me.f_init();
    },
    fence_bind: function() {
      var me = this;
      var fn = {
        f_init: function(argument) {
          var me = this;
          // 添加绘画工具
          me.f_tools();
          // 添加围栏
          me.f_add();
          // 所有的围栏的显示
          me.f_show_init();
        },
        // 添加画图工具
        f_tools: function(argument) {
          /* body... */
          var me = this;
          var style = {
            strokeColor: 'blue',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: 'blue',
            fillOpacity: 0.1,
            // strokeWeight: 1,
            clickable: true,
            editable: false,
            zIndex: 1
          };
          var drawingManager = me.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.null,
            drawingControl: false,
            drawingControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT,
              drawingModes: [
                // google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                // google.maps.drawing.OverlayType.POLYLINE,
                // google.maps.drawing.OverlayType.RECTANGLE
              ]
            },
            // markerOptions: { icon: '../../../images/car_online.png' },
            circleOptions: style,
            polygonOptions: style
          });
          drawingManager.setMap(me.map);
          me.f_add_done();
        },
        // 画完的执行
        f_add_done: function() {
          /* body... */
          var me = this;
          // 圆完成时的事件函数
          me.drawingManager.addListener('circlecomplete', function(yuan) {
            me.f_add_done_event(yuan);
          });
          // 多边形的事件函数
          me.drawingManager.addListener('polygoncomplete', function(duo) {
            me.f_add_done_event(duo);
          });
        },
        // 画完的事件函数
        f_add_done_event: function(dom) {
          /* body... */
          var me = this;
          // 唯一ID标识
          me.f_id++;
          // 关闭绘画模式
          me.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.null);
          // 标记唯一id
          dom.f_id = me.f_id;
          // 报警参数
          dom.alarmType = me.alarmType;
          // 围栏的形状参数
          dom.shapeType = me.shapeType;
          // 围栏名称
          dom.fenceName = me.fenceName;

          // 收集为数组
          me.f_arrs.push(dom);
          // 后台进行发送
          console.log('绘制完毕后的发送');
          me.f_send(me.f_arrs);

          // 给当前圆形加一个点击事件。
          me.f_click(dom);
          // 绑定个显示属性
          me.f_mouseevent(dom);
        },
        f_add_done_send: function(argument) {},
        // --------------------------------------------------------显示围栏
        f_show_init: function(argument) {
          /* body... */
          var me = this;
          me.f_show();
          // me.f_show_e();
        },
        f_show: function() {
          /* body... */
          var me = this;
          if (me.fences.length == 0) {
            return;
          }
          for (var i = 0; i < me.fences.length; i++) {
            // 多边形展示
            if (me.fences[i].shapeType == 1) {
              me.f_show_duo(me.fences[i]);
            }
            // 圆形展示
            else if (me.fences[i].shapeType == 0) {
              me.f_show_yuan(me.fences[i]);
            }
          }
        },
        // 多边形围栏
        f_show_duo: function(data) {
          /* body... */
          var me = this;
          var dom = new google.maps.Polygon({
            paths: data.center,
            strokeColor: 'blue',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: 'blue',
            fillOpacity: 0.1,
            map: me.map,
            clickable: true
          });
          me.f_show_common(dom,data);
        },
        // 圆形
        f_show_yuan: function(data) {
          /* body... */
          var me = this;
          var dom = new google.maps.Circle({
            strokeColor: 'blue',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: 'blue',
            fillOpacity: 0.1,
            map: me.map,
            center: data.center[0],
            radius: data.radius,
            clickable: true
          });
          me.f_show_common(dom,data);
        },
        // 展示覆盖物的公共处理
        f_show_common: function(dom,data) {
          /* body... */
          var me = this;
          // 唯一ID标识
          me.f_id++;
          // 标记唯一id
          dom.f_id = me.f_id;
          // 报警参数
          dom.alarmType = data.alarmType;
          // 围栏的形状参数
          dom.shapeType = data.shapeType;
          // 围栏名称
          dom.fenceName = data.fenceName;
          // 给当前圆形加一个点击事件。
          me.f_click(dom);
          // 绑定个显示属性
          me.f_mouseevent(dom);
          // 收集为数组
          me.f_arrs.push(dom);
        },
        // --------------------------------------------------------后台保存
        f_send: function(arr) {
          /* body... */
          var me = this;
          var send_data = {
            sn: me.sn,
            fences: []
          };
          var lastData = me.f_send_handle(send_data, arr)
          console.log(lastData);
        },
        // 发送之前的处理
        f_send_handle: function(send_data, arr) {
          /* body... */
          var me = this;
          for (var i = 0; i < arr.length; i++) {
            var fence = {
              name: '',
              radius: null,
              center: [],
              alarmType: null,
              shapeType: null
            };
            // 圆形
            if (arr[i].shapeType == 0) {
              // 百度和googleAPI非常非常像
              fence.name = arr[i].fenceName;
              fence.radius = arr[i].getRadius();
              fence.center[0] = { lng: arr[i].getCenter().lng(), lat: arr[i].getCenter().lat() };
              fence.alarmType = arr[i].alarmType;
              fence.shapeType = arr[i].shapeType;
            }
            // 多边形
            else if (arr[i].shapeType == 1) {
              fence.name = arr[i].fenceName;
              fence.radius = null;
              var p_arr = arr[i].getPaths().b[0].b;
              for (var j = 0; j < p_arr.length; j++) {
                fence.center.push({ lng: p_arr[j].lng(), lat: p_arr[j].lat() });
              }
              fence.alarmType = arr[i].alarmType;
              fence.shapeType = arr[i].shapeType;
            }
            // console.log(fence);
            send_data.fences.push(fence);
          };
          return send_data;
        },
        // --------------------------------------------------------显示功能
        f_mouseevent: function(yuan) {
          var me = this;
          yuan.addListener('mouseover', function(e) {
            var str = '';
            if (yuan.alarmType == 0) {
              str = '出围栏报警';
            } else {
              str = '入围栏报警';
            }

            yuan.indexLayer = layer.msg('围栏名称：' + yuan.fenceName + '<span style="margin-left:20px;"></span>报警条件：' + str, {
              time: 0,
            });
          });

          yuan.addListener('mouseout', function(e) {
            layer.close(yuan.indexLayer);
          });
        },
        // --------------------------------------------------------编辑功能
        // 给画完的当前的圆形绑定的点击事件
        f_click: function(dom) {
          /* body... */
          var me = this;
          dom.addListener('click', function(e) {
            // 没有记录点击的围栏
            if (me.active_f == null) {
              // 收集当前围栏
              me.active_f = dom;
              me.f_edit(dom);
            }
            // 记录点击的围栏
            else {
              layer.msg('请完成围栏编辑，在进行其他操作！')
            }
          });
        },
        f_edit: function(dom) {
          var me = this;

          dom.setOptions({ fillColor: 'red' });
          dom.setEditable(true);
          // 删除添加按钮
          me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.btn_add_f);

          // 添加删除和保存按钮
          me.btn_saveDel_f = document.createElement('div');
          new NewControl({
            p_dom: me.btn_saveDel_f,
            map: me.map,
            offset: ['10px', 0, 0, '10px'],
            btns: ['保存围栏save', '删除围栏dele']
          }).init();
          me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.btn_saveDel_f);
          // 保存围栏
          me.f_edit_save(dom);
          // 删除围栏
          me.f_edit_del(dom);
        },

        f_edit_save: function(dom) {
          /* body... */
          var me = this;
          $('#dom_save').unbind().on('click', function() {
            var ck = '';
            // 反选设置
            if (dom.alarmType == 0) {
              ck = '<input name = "alarm" type = "radio" value = "0" checked = "checked" /><span class="f_p_one">出围栏报警</span>' +
                '<input name = "alarm" type = "radio" value = "1"  /><span class="f_p_one">入围栏报警</span>';
            } else {
              ck = '<input name = "alarm" type = "radio" value = "0"  /><span class="f_p_one">出围栏报警</span>' +
                '<input name = "alarm" type = "radio" value = "1" checked = "checked" /><span class="f_p_one">入围栏报警</span>';
            };
            // 弹窗
            var str = '' +
              '<p  class="f_p">' +
              '<span> 围栏名称： </span>' +
              '<input name = "type" type = "text" value=' + dom.fenceName + ' id = "f_name"/>' +
              '</p>' +
              '<p id = "alarm" class="f_p">' +
              '<span> 报警条件： </span>' +
              ck +
              '</p>';
            layer.open({
              type: 1,
              title: '修改围栏',
              area: ['350px', '160px'],
              zIndex: 600,
              shadeClose: false, //点击遮罩关闭
              content: str,
              btn: ['保存', '取消'],
              success: function() {
                //me.layer_man_dataBack();
              },
              yes: function(index, layero) {
                // 重新拿下原来的值
                dom.fenceName = $('#f_name').val();
                dom.alarmType = $('#alarm input[name="alarm"]:checked').val();
                layer.close(index);

                dom.setOptions({ fillColor: 'blue' });
                // 退出编辑模式
                dom.setEditable(false);
                // 清空容器
                me.active_f = null;
                // 清除保存删除按钮
                me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.btn_saveDel_f);

                // 后台保存围栏
                console.log('保存围栏后的发送');
                me.f_send(me.f_arrs);
                // 添加围栏
                me.f_add();
              },
              btn2: function(index, layero) {
                layer.close(index);
              }
            });
          })
        },
        f_edit_del: function(dom) {
          /* body... */
          var me = this;
          $('#dom_dele').unbind().on('click', function() {
            dom.setMap(null);
            // 清空容器
            me.active_f = null;

            for (var i = 0; i < me.f_arrs.length; i++) {
              if (me.f_arrs[i].f_id == dom.f_id) {
                me.f_arrs.splice(i, 1);
              }
            }
            console.log('删除后的发送');
            me.f_send(me.f_arrs);
            me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.btn_saveDel_f);
            // 后台保存围栏

            me.f_add();
          })
        },
        // --------------------------------------------------------添加围栏
        f_add: function() {
          /* body... */
          var me = this;
          me.btn_add_f = document.createElement('div');
          new NewControl({
            p_dom: me.btn_add_f,
            map: me.map,
            offset: ['10px', 0, 0, '10px'],
            btns: ['增加围栏adfc']
          }).init();
          me.map.controls[google.maps.ControlPosition.LEFT_TOP].push(me.btn_add_f);

          $('#googleMap').off().on('click', '#dom_adfc', function() {
            // me.map.controls[google.maps.ControlPosition.LEFT_TOP].clear(me.btn_add_f);
            me.f_add_e();
          });
        },
        // 点击添加围栏的事件函数
        f_add_e: function() {
          /* body... */
          var me = this;
          var str = '' +
            '<p  class="f_p">' +
            '<span> 围栏名称： </span>' +
            '<input name = "type" type = "text"  id = "f_name"/>' +
            '</p>' +
            '<p id = "type" class="f_p">' +
            '<span> 创建形状： </span>' +
            '<input name = "type" type = "radio" value = "0"  checked = "checked" /><span class="f_p_one">圆形</span>' +
            '<input name = "type" type = "radio" value = "1" /><span class="f_p_one">多边形</span>' +
            '</p>' +
            '<p id = "alarm" class="f_p">' +
            '<span> 报警条件： </span>' +
            '<input name = "alarm" type = "radio" value = "0" checked = "checked" /><span class="f_p_one">出围栏报警</span>' +
            '<input name = "alarm" type = "radio"value = "1" /><span class="f_p_one">入围栏报警</span>' +
            '</p>';
          layer.open({
            type: 1,
            title: '新增围栏',
            area: ['350px', '200px'],
            zIndex: 600,
            shadeClose: false, //点击遮罩关闭
            content: str,
            btn: ['确定', '取消'],
            success: function() {
              //me.layer_man_dataBack();
            },
            yes: function(index, layero) {
              me.f_add_yes(index);
            },
            btn2: function(index, layero) {
              layer.close(index);
            }
          });
        },
        // 确认添加时
        f_add_yes: function(index) {
          /* body... */
          var me = this;
          // 圆形是0 多边形1
          var type = me.shapeType = $('#type input[name="type"]:checked').val();
          // 出围栏0 进围栏1
          me.alarmType = $('#alarm input[name="alarm"]:checked').val();
          // 围栏名称
          me.fenceName = $('#f_name').val();
          // 名字不能为空
          if ($('#f_name').val() == '') {
            layer.msg('围栏名称不能为空！');
            return;
          }
          // 圆形
          if (type == 0) {
            me.f_add_yuan();
          }
          // 多边形
          else if (type == 1) {
            me.f_add_duo();
          }
          // 关闭弹窗
          layer.close(index);
        },
        // 添加圆形
        f_add_yuan: function() {
          /* body... */
          var me = this;
          me.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE)
        },
        f_add_duo: function() {
          /* body... */
          var me = this;
          me.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
        },
        // ---------------------------------------------------------公用函数
        // 清除全部数据
        m_all_clear: function(arr) {
          /* body... */
          var me = this;
          // 清除数据，容器重置
          for (var i = 0; i < arr.length; i++) {
            // 清除点
            arr[i].marker.setMap(null);
            // 清除信息框
            arr[i].infowindow.close();
          };
        },
        // 设置最优视角
        m_setVeiwPort: function(arr) {
          /* body... */
          var me = this;
          var bounds = new me.Gmap.LatLngBounds();
          //读取标注点的位置坐标，加入LatLngBounds  
          for (var i = 0; i < arr.length; i++) {
            bounds.extend(arr[i].getPosition());
          }
          //调整map，使其适应LatLngBounds,实现展示最佳视野的功能
          me.map.fitBounds(bounds);
        },
      }
      for (k in fn) {
        me[k] = fn[k];
      };
    },
  };
  window["map_GMap_fence_set"] = map_GMap_fence_set;
})(jQuery, window);
