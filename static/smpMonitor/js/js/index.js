var realTimeClData;
var systemDropdown=''
var monitorUrl=window.g.dev_url;
//var monitorUrl='http://192.168.34.174:8080/smp-monitor';
$(function() {
	// 1.初始化Table
	var oTable = new TableInit();
	oTable.Init();

	// 2.初始化事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();
	/*  $("#datetimepicker1").datetimepicker({
						format: 'yyyy-mm-dd hh:ii:ss',
						   autoclose: 1,
						   todayHighlight: 1,//今天高亮
						   todayBtn: true,
						   language:'zh-CN'
						})*/
		
});

/**
 * 初始化table
 */
var TableInit = function() {
	var oTableInit = {};
	// 初始化Table
	oTableInit.Init = function() {
		$('#tb_departments').bootstrapTable({
			url : monitorUrl+'/monitor/queryTaskList', // 请求后台的URL（*）
			method : 'post', // 请求方式（*）
			dataType : "json", // 从服务端接收数据类型定义
			toolbar : '#toolbar', // 工具按钮用哪个容器
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			// sortOrder: "asc", //排序方式
			queryParams : oTableInit.queryParams,// 传递参数（*）
			sidePagination : "client", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 15, // 每页的记录行数（*）
			pageList : [ 15, 30, 45 ], // 可供选择的每页的行数（*）
			search : false, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch : false,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			clickToSelect : true, // 是否启用点击选中行
			// height: 910, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			showToggle : false, // 是否显示详细视图和列表视图的切换按钮
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			columns : [ {
				checkbox : true
			}, {
				field : 'id',
				title : '监控id',
				width : '9%',
				visible : false
			}, {
				field : 'name',
				title : '监控名称',
				width : '10%',
				formatter : format
			}, {
				field : 'type',
				title : '监控类型',
				width : '7%',
				formatter : typeHandle
			}, {
				field : 'sys_name',
				title : '应用系统名称',
				width : '9%',
				formatter : format
			}, {
				field : 'ip',
				title : '被监控对象ip/域名',
				width : '10%',
				formatter : format
			}, {
				field : 'url',
				title : '监控地址',
				width : '19%',
				formatter : format
			}, {
				field : 'rate',
				title : '监控频率',
				width : '5%',
				formatter : format
			}, {
				field : 'repeatflag',
				title : '重复确认',
				width : '5%',
				formatter : flagHandle
			}, {
				field : 'state',
				title : '运行状态',
				width : '5%',
				formatter : stateHandle
			}, {
				field : 'linkperson',
				title : '责任人',
				width : '5%',
				formatter : format
			}, {
				field : 'remark',
				title : '备注',
				width : '19%',
				formatter : format
			}, {
				field : 'state',
				title : '操作',
				width : '4%',
				formatter : operationHandle
			} ]
		});
	};

	// 得到查询的参数
	oTableInit.queryParams = function(params) {
		return { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit : params.limit, // 页面大小
			offset : params.offset, // 页码
			query_name : $("#txt_search_name").val(),
			app_name : $("#txt_search_appname").val(),
			query_state : $("#txt_search_state").val(),
			query_type : $("#txt_search_type").val()
		};
	};
	return oTableInit;
};

// 获取系统下拉列表
function  setSystemList(sys){
	$.ajax({
		url :monitorUrl+'/duty/getSystemList',
		dataType : 'json',
		type : 'get',
		async : false,
		success : function(data) {
			if (data.code === "200") {
				var arr=data.data
				var len=arr.length
				var newArr=[]
				var seleced=''
				for(var i=0;i<len;i++){
					var item={}
					item.id=arr[i].id
					item.name=arr[i].sysName
					if(sys){
						if(arr[i].sysName==sys){
							item.selected=true
							seleced=sys
						}
					}else{
						if(i==0){
							item.selected=true
							seleced=item.name
						}
					}
					newArr.push(item)
				}
				if(systemDropdown!=''){
					systemDropdown.destroy()
				}
				$('#relationSystem').attr('title',seleced)
				systemDropdown=$('#relationSystem').dropdown({
							data: newArr,
							input: '<input type="text" maxLength="20" placeholder="请输入搜索">',
							choice: function() {
								$('#relationSystem').attr('title',$('#relationSystem .dropdown-selected').text())
							}
						}).data('dropdown');
				
			} else {
				alert("获取监控信息失败，原因：" + data.message);
			}
		}
	})
}

/**
 * 初始化事件
 */
var ButtonInit = function() {
	var oInit = {};
	oInit.Init = function() {
		console.log('init.....')
		$('.close_icon').on('click', function() {
			$(this).parent().find('.form-control').val('')
		})

		// 查询按钮
		$("#btn_query").click(function() {
			$("#tb_departments").bootstrapTable('refresh');
		});

		// 新增按钮
		$("#btn_add").click(function() {
			$("#id").val("");
			$("#myModalLabel").text("新增监控任务");
			setSystemList();
			$("#save").show();
			$("#update").hide();
			$("#myModal").modal();
		});

		// 新增批量按钮
		$("#btn_batch_import").click(function() {
			$("#myModalLabel1").text("新增批量监控任务");
			$("#save").show();
			$("#file").val("");
			$("#photoCover").val("");
			$("#myModal1").modal();
		});

		// 修改按钮
		$("#btn_edit").click(
				function() {
					var arrselections = $("#tb_departments").bootstrapTable(
							'getSelections');
					if (arrselections.length > 1) {
						alert('只能选择一个监控任务进行修改');
						return;
					} else if (arrselections.length <= 0) {
						alert('请选择要修改的任务');
						return;
					} else if (arrselections[0].state === "Y") {
						alert('无法对正在运行的任务进行修改，请先停止任务');
						return;
					}

					$("#myModalLabel").text("修改监控任务");
					$("#save").hide();
					$("#update").show();
					$("#myModal").modal('show');
					$.ajax({
						type : "post",// 使用get方法访问后台
						dataType : "json",// 返回json格式的数据
						data : JSON.stringify({
							query_id : arrselections[0].id
						}),
						contentType : "application/json;charset:utf-8",
						url : monitorUrl+'/monitor/queryTaskById',// 要访问的后台地址
						success : function(data) {
							if (data.code === "200") {
								supply(data.data);
								setSystemList(data.data.sys_name)
							} else {
								alert("获取监控信息失败，原因：" + data.message);
							}
						}
					});
				});

		// 删除按钮
		$("#btn_delete").click(
				function() {
					var idsArray = [];
					var arrselections = $("#tb_departments").bootstrapTable(
							'getSelections');
					if (arrselections.length <= 0) {
						alert('请选择要删除的数据');
						return;
					}
					for (var i = 0; i < arrselections.length; i++) {
						if ("Y" === arrselections[i].state) {
							alert('无法删除运行中的监控任务，如需删除请先停止任务');
							return;
						}
						idsArray[i] = arrselections[i].id;
					}
					var query = {
						query_ids : idsArray
					};

					bootbox.confirm("确定要删除选中的监控任务吗？", function(result) {
						if (result) {
							$.ajax({
								type : "post",// 使用get方法访问后台
								dataType : "json",// 返回json格式的数据
								data : JSON.stringify(query),
								contentType : "application/json;charset:utf-8",
								url : monitorUrl+"/monitor/deleteByIds",// 要访问的后台地址
								success : function(data) {
									if (data.code === "200") {
										alert("删除成功");
										$("#tb_departments").bootstrapTable(
												'refresh');
									} else {
										alert("删除失败，原因：" + data.message, "警告");
									}
								}
							});
						}
					})
				});

		// 关闭窗口
		$('#myModal').on('hide.bs.modal', function() {
			$("#task")[0].reset();
			$('div[id*="Info"]').hide();
			// 恢复默认值
			$("#prefix").html("http://");
			$("#ftpMessage").show();
			$('#fileRetentTime').show();
			$('#fileNum').hide();
			$('#fileMonitorType').hide();
			$('#fileEndTime').flatpickr({
					time_24hr:true,
					noCalendar: true,
					dateFormat: "H:i",
					allowInput:true,
					minTime:'00:00'
				});
		});

		// 类型联动
		$('#type').change(function() {
			var type = $('#type').val();
			var urlInfo = $('#urlInfo');
			var dbInfo = $('#dbInfo');
			var fileInfo = $('#fileInfo');
			var emailInfo = $('#emailInfo');
			var taskInfo = $('#taskInfo');
			var tcpInfo = $('#tcpInfo');

			var dubboInfo = $("#dubboInfo")

			if ("url" === type || "interface" === type) {
				urlInfo.show();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.hide();
				dubboInfo.hide();
			} else if ("db" === type) {
				urlInfo.hide();
				dbInfo.show();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.hide();
				dubboInfo.hide();
			} else if ("file" === type) {
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.show();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.hide();
				dubboInfo.hide();
			} else if ("email" === type) {
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.show();
				tcpInfo.hide();
				taskInfo.hide();
				dubboInfo.hide();
			} else if ("task" === type) {
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.show();
				dubboInfo.hide();
			} else if ("tcp" === type) {
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.show();
				taskInfo.hide();
				dubboInfo.hide();
			} else if("dubbo" === type){ //新增
				dubboInfo.show();
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.hide();
			}else{
				urlInfo.hide();
				dbInfo.hide();
				fileInfo.hide();
				emailInfo.hide();
				tcpInfo.hide();
				taskInfo.hide();
				dubboInfo.hide();
			}
		});

		$('#url_protocol').change(function() {
			$("#prefix").html($('#url_protocol').val() + "://");
		});

		$('#repeatflag').change(function() {
			var repeatflag = $('#repeatflag').val();
			var repeatInfo = $('#repeatInfo');
			if (repeatflag === "Y") {
				repeatInfo.show();
			} else {
				repeatInfo.hide();
			}
		});

		$('#file_file_type').change(function() {
			var file_file_type = $('#file_file_type').val();
			var ftpMessage = $("#ftpMessage");
			if (file_file_type === "1") {
				ftpMessage.show();
			} else {
				ftpMessage.hide();
			}
		});
		$('#file_monitor_type').change(function(){
			var file_monitor_type=$('#file_monitor_type').val();
			if(file_monitor_type=='1'){
				$('#fileRetentTime').show();
				$('#fileNum').hide();
				$('#fileMonitorType').hide();
			}else if(file_monitor_type=='2'){
				$('#fileRetentTime').hide();
				$('#fileNum').show();
				$('#fileMonitorType').show();
				
			
			}
		});
		
			$('#fileStartTime').flatpickr({
						time_24hr:true,
						noCalendar: true,
						dateFormat: "H:i",
						allowInput:true,
						maxTime:'23:59',
					    onClose: function(selectedDates, dateStr, instance){
					    	$('#fileEndTime').attr('data-min-time',dateStr)
					    		$('#fileEndTime').flatpickr({
									time_24hr:true,
									noCalendar: true,
									dateFormat: "H:i",
									allowInput:true,
									minTime:dateStr
								});
					    }
			});
			$('#fileEndTime').flatpickr({
					time_24hr:true,
					noCalendar: true,
					dateFormat: "H:i",
					allowInput:true,
					minTime:'00:00'
				});
		var _this;
		$("#test").click(function() {
			_this = this;
			$(this).attr("disabled", "true");
			realTimeClData = setInterval(function() {
				$(_this).removeAttr("disabled");
				clearInterval(realTimeClData);
			}, 10000);
		});

		$("#import").click(function() {
			_this = this;
			$(this).attr("disabled", "true");
			realTimeClData = setInterval(function() {
				$(_this).removeAttr("disabled");
				clearInterval(realTimeClData);
			}, 10000);
		});
		$("#choose").click(function() {
			$("#file").click();
		});

		$("#import")
				.click(
						function() {
							var formData = new FormData();
							var file = document.getElementById("file").files[0];
							if (undefined !== file) {
								formData.append("myfile", file);
								var index = null;
								$
										.ajax({
											url : "/upload/importExcel",
											type : "POST",
											data : formData,
											contentType : false,
											processData : false,
											beforeSend : function() {
												index = layer.load(1, {
													shade : [ 0.1, '#fff' ]
												// 0.1透明度的白色背景
												});
											},
											success : function(data) {
												layer.close(index);
												if (data.code === "200") {

													$('#myModal1')
															.modal('hide');
													$("#tb_departments")
															.bootstrapTable(
																	'refresh');
													alert(
															"此次导入，导入成功"
																	+ data.data.success
																	+ "条任务，导入失败"
																	+ data.data.failed
																	+ "条任务。<a style='color: blue' href=\"/upload/download?filePath="
																	+ data.data.path
																	+ "\" TARGET='_blank'>点击下载导入结果</a>",
															"导入结果");
												} else {
													alert("导入失败", "错误");
												}
											},
											error : function() {
												layer.close(index);
											}
										});
							} else {
								alert("请选择要导入的EXCEL文件", "提示");
							}
						});

	};
	return oInit;
};

/**
 * 显示文件名称
 */
function changeFileName() {
	$("#photoCover").val(document.getElementById("file").files[0].name);
}
/**
 * 操作类型转义
 */
function operationHandle(value, row) {
	if ("Y" === value) {
		return "<i class='fa fa-pause-circle-o fa-lg' title='点击停止' onclick='startOrStop(this,\""
				+ row.id + "\",\"" + value + "\")'></i>";
	} else {
		return "<i class='fa fa-play-circle-o fa-lg' title='点击启动' onclick='startOrStop(this,\""
				+ row.id + "\",\"" + value + "\")'></i>";
	}
}

/**
 * 标准格式转义
 */
function format(value) {
	if (isEmpty(value)) {
		value = "-";
	}
	return "<span class='msg_span' title='" + value + "'>" + value + "</span>";
}

/**
 * 任务状态转义
 */
function stateHandle(value) {
	if ("Y" === value) {
		return format("运行");
	} else {
		return format("停止");
	}
}

/**
 * 状态转义
 */
function flagHandle(value) {
	if ("Y" === value) {
		return format("是");
	} else {
		return format("否");
	}
}

/**
 * 告警类型转义
 */
function typeHandle(value) {
	if ("url" === value) {
		return format("URL页面监控");
	} else if ("interface" === value) {
		return format("URL接口监控");
	} else if ("db" === value) {
		return format("数据库监控");
	} else if ("tcp" === value) {
		return format("tcp连接监控");
	} else if ("file" === value) {
		return format("文件监控");
	} else if ("email" === value) {
		return format("邮件监控");
	} else if ("task" === value) {
		return format("定时任务监控");
	}
}

function startOrStop(obj, rowId, value) {
	if ("Y" === value) {
		stop(obj, rowId);
	} else if ("N" === value) {
		start(obj, rowId);
	}
}

/**
 * 启动任务
 */
function start(obj, id) {
	var query = {};
	query.query_id = id;
	$.ajax({
		type : "post",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		data : JSON.stringify(query),
		contentType : "application/json;charset:utf-8",
		url : monitorUrl+"/monitor/startTaskById",// 要访问的后台地址
		success : function(data) {
			if (data.code === "200") {
				$(obj).removeClass('fa-play-circle-o').addClass(
						'fa-pause-circle-o').attr('title', '点击停止');
				var table = $("#tb_departments");
				var olddate = table.bootstrapTable('getRowByUniqueId', id);
				olddate.state = 'Y';
				table.bootstrapTable('updateByUniqueId', {
					id : id,
					row : olddate
				});
			} else {
				alert("启动失败，原因：" + data.message, "警告");
			}
		}
	});
}

/**
 * 停止任务
 */
function stop(obj, id) {
	var query = {};
	query.query_id = id;

	$.ajax({
		type : "post",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		data : JSON.stringify(query),
		contentType : "application/json;charset:utf-8",
		url : monitorUrl+"/monitor/stopTaskById",// 要访问的后台地址
		success : function(data) {
			if (data.code === "200") {
				$(obj).removeClass('fa-pause-circle-o').addClass(
						'fa-play-circle-o').attr('title', '点击启动');
				var table = $("#tb_departments");
				var olddate = table.bootstrapTable('getRowByUniqueId', id);
				olddate.state = 'N';
				table.bootstrapTable('updateByUniqueId', {
					id : id,
					row : olddate
				});
			} else {
				alert("停止失败，原因：" + data.message, "警告");
			}
		}
	});
}

/**
 * 输入校验
 */
function check() {
	var info = {};
	// 必填项
	var name = $("#name").val();
	var type = $("#type").val();
	var rate = $("#rate").val();
	var sys_name = $('#relationSystem .dropdown-selected').text();
	var sys_id=$('#relationSystem .dropdown-selected').find('.del').attr('data-id');
	var linkperson = $("#linkperson").val();
	var repeat_rate = $("#repeat_rate").val();
	var repeat_num = $("#repeat_num").val();
	var url_url = $("#url_url").val();
	var db_username = $("#db_username").val();
	var db_password = $("#db_password").val();
	var db_url = $("#db_url").val();
	var db_sql = $("#db_sql").val();
	var tcp_ip = $("#tcp_ip").val();
	var tcp_port = $("#tcp_port").val();
	var file_ip = $("#file_ip").val();
	var file_port = $("#file_port").val();
	var file_username = $("#file_username").val();
	var file_password = $("#file_password").val();
	var file_retention = $("#file_retention").val();
	var file_url = $("#file_url").val();
	var email_ip = $("#email_ip").val();
	var email_receive_ip = $("#email_receive_ip").val();
	var email_username = $("#email_username").val();
	var email_password = $("#email_password").val();
	var task_ip = $("#task_ip").val();
	var task_other_sys_id = $("#task_other_sys_id").val();

	var dubbo_url = $("#dubbo_url").val();
	var interface_class = $("#interface_class").val();
	var file_num = $("#file_num").val();

	// 非必填项
	var id = $("#id").val();
	var timeout = $("#timeout").val();
	var repeatflag = $("#repeatflag").val();
	var remark = $("#remark").val();
	var plan = $("#plan").val();
	var url_protocol = $("#url_protocol").val();
	var file_file_type = $("#file_file_type").val();
	var email_port = $("#email_port").val();
	var email_receive_port = $("#email_receive_port").val();
	var email_send_ssl = $("#email_send_ssl").val();
	var email_receive_ssl = $("#email_receive_ssl").val();
	var file_monitor= $("#file_monitor_type").val();
	var matchChart=$('#match_character').val();
	var matchRule=$('#match_rule').val();
	var fileStartTime=$('#fileStartTime').val();
	var fileEndTime=$('#fileEndTime').val();
	if (isEmpty(name)) {
		alert("请输入监控名称");
		return;
	}
	if (isEmpty(type)) {
		alert('请选择监控类型');
		return;
	}
	if (isEmpty(rate)) {
		alert('请输入监控频率');
		return;
	}
	if (isEmpty(sys_name)) {
		alert('请选择应用系统名称');
		return;
	}
	if (isEmpty(linkperson)) {
		alert('请输入负责人姓名');
		return;
	}
	if (repeatflag === "Y") {
		if (isEmpty(repeat_rate)) {
			alert('请输入重复频率');
			return;
		}
		if (isEmpty(repeat_num)) {
			alert('请输入重复次数');
			return;
		}
	}
	if ("url" === type || "interface" === type) {
		if (isEmpty(url_url)) {
			alert('请输入监控地址');
			return;
		}
		if (url_url.indexOf("//") !== -1) {
			alert('地址格式有误，请直接输入监控地址');
			return;
		}
	} else if ("db" === type) {
		if (isEmpty(db_username)) {
			alert('请输入数据库用户名');
			return;
		}
		if (isEmpty(db_url)) {
			alert('请输入数据库地址');
			return;
		}
		if (isEmpty(db_password)) {
			alert('请输入数据库密码');
			return;
		}
		if (isEmpty(db_sql)) {
			alert('请输入数据库表名');
			return;
		}
	} else if ("tcp" === type) {
		if (isEmpty(tcp_ip)) {
			alert('请输入监控ip/域名');
			return;
		}
		if (isEmpty(tcp_port)) {
			alert('请输入端口号');
			return;
		}
	} else if ("file" === type) {
		if (isEmpty(file_url)) {
			alert('请输入文件夹路径');
			return;
		}
		if (isEmpty(file_ip)) {
			alert('请输入文件服务器地址');
			return;
		}
		if(file_monitor=='1'){
			if (isEmpty(file_retention)) {
				alert('请输入文件滞留时间');
				return;
			}
		}else{
			if (isEmpty(file_num)) {
				alert('请输入文件个数');
				return;
			}
			if (isEmpty(matchChart)) {
				alert('请输入匹配字符');
				return;
			}
			if (isEmpty(fileStartTime)) {
				alert('请输入开始时间');
				return;
			}
			if (isEmpty(fileEndTime)) {
				alert('请输入结束时间');
				return;
			}
		}
		if ("1" === file_file_type) {
			if (isEmpty(file_port)) {
				alert('请输入ftp端口号');
				return;
			}
			if (isEmpty(file_username)) {
				alert('请输入ftp用户名');
				return;
			}
			if (isEmpty(file_password)) {
				alert('请输入ftp密码');
				return;
			}
		}
	} else if ("email" === type) {
		if (isEmpty(email_ip)) {
			alert('请输入发件服务器地址');
			return;
		}
		if (isEmpty(email_receive_ip)) {
			alert('请输入收件服务器地址');
			return;
		}
		if (isEmpty(email_username)) {
			alert('请输入邮箱用户名');
			return;
		}
		if (isEmpty(email_password)) {
			alert('请输入邮箱密码');
			return;
		}
	} else if ("task" === type) {
		if (isEmpty(task_ip)) {
			alert('请输入定时任务所在的服务器地址');
			return;
		}
		if (isEmpty(task_other_sys_id)) {
			alert('请输入定时任务id');
			return;
		}
	}else if("dubbo" === type){
		if (isEmpty(dubbo_url)) {
			alert('请输入接口服务类');
			return;
		}
		if (isEmpty(interface_class)) {
			alert('请输入服务注册中心');
			return;
		}
	}
file_monitor=file_monitor=='1'?'按滞留时间':'按文件个数'
	// 拼写结果
	info.id = emptyToNull(id);
	info.name = emptyToNull(name);
	info.type = emptyToNull(type);
	info.rate = emptyToNull(rate);
	info.sys_name = emptyToNull(sys_name);
	info.sys_id = sys_id;
	info.linkperson = emptyToNull(linkperson);
	info.timeout = emptyToNull(timeout);
	info.repeatflag = emptyToNull(repeatflag);
	info.remark = emptyToNull(remark);
	info.plan = emptyToNull(plan);
	if ("Y" === repeatflag) {
		info.repeat_rate = emptyToNull(repeat_rate);
		info.repeat_num = emptyToNull(repeat_num);
	}
	if ("url" === type || "interface" === type) {
		info.protocol = emptyToNull(url_protocol);
		info.url = emptyToNull(url_url);
	} else if ("db" === type) {
		info.username = emptyToNull(db_username);
		info.url = emptyToNull(db_url);
		info.password = emptyToNull(db_password);
		info.sql = emptyToNull(db_sql);
	} else if ("tcp" === type) {
		info.ip = emptyToNull(tcp_ip);
		info.port = emptyToNull(tcp_port);
	} else if ("file" === type) {
		info.ip = emptyToNull(file_ip);
		info.port = emptyToNull(file_port);
		info.username = emptyToNull(file_username);
		info.password = emptyToNull(file_password);
		info.retention = emptyToNull(file_retention);
		info.sql = emptyToNull(db_sql);
		info.url = emptyToNull(file_url);
		info.file_type = emptyToNull(file_file_type);
		info.file_num = emptyToNull(file_num);
		info.fileMonitorType = emptyToNull(file_monitor);
		info.matchChart = emptyToNull(matchChart);
		info.matchRule = emptyToNull(matchRule);
		info.fileStartTime = emptyToNull(fileStartTime);
		info.fileEndTime = emptyToNull(fileEndTime);
	} else if ("email" === type) {
		info.ip = emptyToNull(email_ip);
		info.port = emptyToNull(email_port);
		info.receive_ip = emptyToNull(email_receive_ip);
		info.receive_port = emptyToNull(email_receive_port);
		info.username = emptyToNull(email_username);
		info.password = emptyToNull(email_password);
		info.send_ssl = emptyToNull(email_send_ssl);
		info.receive_ssl = emptyToNull(email_receive_ssl);
	} else if ("task" === type) {
		info.ip = emptyToNull(task_ip);
		info.other_sys_id = emptyToNull(task_other_sys_id);
	}else if("dubbo"===type){
		info.url = emptyToNull(dubbo_url);
		info.interface_class = emptyToNull(interface_class);
	}
	return info;
}

/**
 * 添加任务
 */
function save() {
	var result = check();
	if (result) {
		$.ajax({
			type : "post",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			data : JSON.stringify(result),
			contentType : "application/json;charset:utf-8",
			url : monitorUrl+"/monitor/addTask",// 要访问的后台地址
			success : function(data) {
				if (data.code === "200") {
					$('#myModal').modal('hide');
					$("#tb_departments").bootstrapTable('refresh');
				} else {
					alert("添加失败，原因：" + data.message, "警告");
				}
			}
		});
	}
}

/**
 * 更新任务
 */
function update() {
	var result = check();
	if (result) {
		$.ajax({
			type : "post",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			data : JSON.stringify(result),
			contentType : "application/json;charset:utf-8",
			url : monitorUrl+"/monitor/updateTask",// 要访问的后台地址
			success : function(data) {
				if (data.code === "200") {
					$('#myModal').modal('hide');
					$("#tb_departments").bootstrapTable('refresh');
				} else {
					alert("修改失败，原因：" + data.message, "警告");
				}
			}
		});
	}
}

/**
 * 填充页面信息
 */
function supply(task) {
	var type = task.type;
	$("#id").val(task.id);
	$("#name").val(task.name);
	$("#type").val(task.type).trigger('change');// 触发选择类型事件
	$("#rate").val(task.rate);
//	$('#relationSystem .dropdown-selected').text(task.sys_name);
	$("#linkperson").val(task.linkperson);
	$("#timeout").val(task.timeout);
	$("#repeatflag").val(task.repeatflag).trigger('change');
	$("#repeat_rate").val(task.repeat_rate);
	$("#repeat_num").val(task.repeat_num);
	$("#remark").val(task.remark);
	$("#plan").val(task.plan);
	if (type === "url" || type === "interface") {
		$("#url_protocol").val(task.protocol).trigger('change');
		$("#url_url").val(task.url);
	} else if (type === "db") {
		$("#db_username").val(task.username);
		$("#db_password").val(task.password);
		$("#db_url").val(task.url);
		$("#db_sql").val(task.sql);
	} else if (type === "tcp") {
		$("#tcp_ip").val(task.ip);
		$("#tcp_port").val(task.port);
	} else if (type === "file") {
		$("#file_ip").val(task.ip);
		$("#file_port").val(task.port);
		$("#file_file_type").val(task.file_type).trigger('change');
		var fileType=task.fileMonitorType=='按滞留时间'?'1':'2'
		$("#file_monitor_type").val(fileType).trigger('change');
		$("#match_character").val(task.matchChart);
		$("#match_rule").val(task.matchRule);
		$("#fileStartTime").val(task.fileStartTime);
		$("#fileEndTime").val(task.fileEndTime);
		
		$("#file_url").val(task.url);
		$("#file_username").val(task.username);
		$("#file_num").val(task.num);
		if (task.file_type === "2") {
			$("#file_password").val("");
		} else {
			$("#file_password").val(task.password);
		}
		$("#file_retention").val(task.retention);
	} else if (type === "email") {
		$("#email_ip").val(task.ip);
		$("#email_port").val(task.port);
		$("#email_receive_ip").val(task.receive_ip);
		$("#email_receive_port").val(task.receive_port);
		$("#email_username").val(task.username);
		$("#email_password").val(task.password);
		$("#email_send_ssl").val(task.send_ssl);
		$("#email_receive_ssl").val(task.receive_ssl);
	} else if (type === "task") {
		$("#task_ip").val(task.ip);
		$("#task_other_sys_id").val(task.other_sys_id);
	}else if(type==="dubbo"){
		$("#dubbo_url").val(task.url);
		$("#interface_class").val(task.interface_class);
	}
}

/**
 * 测试
 */
function test() {

	var result = check();
	if (result) {
		$.ajax({
			type : "post",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			data : JSON.stringify(result),
			contentType : "application/json;charset:utf-8",
			url : monitorUrl+"/monitor/testTask",// 要访问的后台地址
			success : function(data) {
				if (data.code === "200") {
					alert("测试成功");
				} else {
					var message = "测试失败，原因：" + data.message;
					// if(data.detailMessage !== null){
					// //message +="。<a
					// onclick='showDetail()'>点击查看详情</a><br><span
					// style='display: none'
					// id=\"detailMessage\">"+data.detailMessage+"</span>";
					// message +="。<a onclick='showDetail()'>点击查看详情</a>";
					// $("#detailMessage").html(data.detailMessage);
					// }
					alert(message, "警告");
				}
			}
		});
	}
}

function showDetail() {
	$('#detailModal').modal('show');
}