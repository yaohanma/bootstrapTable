var goodsInfo = null;
var sys_goodsNo = "";
var selectUnitData = [];

var tab1 = null;
var tab2 = null;
//选商品规格
var newArr =  [];
var newArr1 =  [];
$(function () {

    var goodsNo = getQueryVariable("goodsNo");
    console.log(goodsNo);
    sys_goodsNo = goodsNo;

    // 查询商品信息
    initGoodsInfo(goodsNo);

	
    // 初始化表格1
    $('#reportTable').bootstrapTable({
        url: "/cm/goods/common/getGoodsOnShelfVisList",
        queryParams: getQueryParams,
        responseHandler: getResponseHandler,
        ajaxOptions: {headers: getHeaderParam()},
        columns: [
            [{
                field: "index",
                title: "序号",
                valign: "middle",
                align: 'center',//居中
                width: 50,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
                {
                    field: "visableScopeType",
                    title: "申请发布范围",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "全国";
                        } else {
                            return row.visName;
                        }
                    }
                },
                {
                    field: "goodsMarketNo",
                    title: "商品市场码",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "createTime",
                    title: "申请发布时间",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "creatorName",
                    title: "申请发布人",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "auditStatus",
                    title: "审核状态",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 3) {
                            return '<span>审核通过</span>';

                        } else if (value == 2) {
                            return '<span>待审核</span>';
                        } else {
                            return '<span style="color: #367bd6;cursor: pointer;" data-autmag="' + row.auditRemark + '" onclick="rejection(this)">审核驳回 <i class="ion-exclamatio"></i></span>';
                        }
                    }
                }, {
                field: "auditTime",
                title: "审核时间",
                align: 'center',//居中
                valign: "middle",
            },
                {
                    field: "mytable7",
                    title: "操作",
                    align: 'center',//居中
                    valign: "middle",
                    width: 350,
                    formatter: function (value, row, index) {
                        return `<a class = "view view-btn" data-type="2" href="#" data-json='` + JSON.stringify(row) + `' onclick="view(this)" > 查看履历 </a>
									<a class = "view view-btn"  data-type="1" href="#" data-json='` + JSON.stringify(row) + `' onclick="view(this)" > 查看详情 </a>
									<a class = "view view-btn"  href="#" data-json='` + JSON.stringify(row) + `'   onclick="editTips(this)"> 编辑 </a>
									<a class = "view view-btn"  href="#"  data-visCode="` + row.code + `" onclick="onShelf(this)" > 上架 </a>`;
                    }
                }
            ]

        ],
    });

    $('#reportTable2').bootstrapTable({
        url: "/cm/goods/common/getGoodsOnShelfVisList",
        queryParams: getQueryParams2,
        responseHandler: getResponseHandler2,
        ajaxOptions: {headers: getHeaderParam()},
        columns: [
            [
                {
                    field: "index",
                    title: "序号",
                    valign: "middle",
                    align: 'center',//居中
                    width: 50,
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: "visableScopeType",
                    title: "申请发布范围",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "全国";
                        } else {
                            return row.visName;
                        }
                    }
                },
                {
                    field: "goodsMarketNo",
                    title: "商品市场码",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "auditTime",
                    title: "审核时间",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "deployStatus",
                    title: "上架状态",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "已上架"
                        }
                        if (value == 0) {
                            return "未上架"
                        }
                    }
                },
                {
                    field: "deployTime",
                    title: "上架时间",
                    align: 'center',//居中
                    valign: "middle",
                },
                {
                    field: "updaterName",
                    title: "操作人",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == "System") {
                            return "系统"
                        } else {
                            return value;
                        }
                    }
                },
                {
                    field: "mytable7",
                    title: "操作",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        return `<a class = "view view-btn" data-type="2" href="#" data-json='` + JSON.stringify(row) + `' onclick="view(this)" > 查看履历 </a>
									<a class = "view view-btn"  data-type="1" href="#" data-json='` + JSON.stringify(row) + `' onclick="view(this)" > 查看详情 </a>
									<a class = "view view-btn"  href="#" data-visCode="` + row.code + `" onclick="offShelf(this)" > 下架 </a>`;
                    }
                }
            ]
        ],
    });

    $("#seach_vis_type_1,#seach_key_1,#seach_status_1").change(table1Change);


    $("#seach_vis_type_2,#seach_key_2").change(table2Change);

    //申请上架 --计费模式--table--removeTr删除tr
    //申请上架 --计费模式
    $(".SublListing").click(function () {
        var html = `<div class="new-goods-box">
								<i class="fa fa-exclamation-circle" style="color:#f95959"></i>上架信息提交成功，是否查看上架审核中的商品信息？
				
							</div>`
        popup.open({
            width: "1000px", // 弹层宽度
            id: "model", // 弹层id
            title: "上架", // 标题
            center: "center", // 标题是否居中 left center right
            content: html, //设置内容 支持html
            cancelBtn: "暂不", //设置关闭文字
            submitBtn: "查看", //确定
            submitCallBack: function () {
            }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
            closeCallBack: function () {
            } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
        })
    })

})

function reLoad() {
    $("#reportTable").bootstrapTable("refresh");
    $("#reportTable2").bootstrapTable("refresh");
}

function table1Change() {
    var type = $("#seach_vis_type_1").val();
    var status = $("#seach_status_1").val();
    var mark = $("#seach_key_1").val();
    var data = [];
    for (var x in tab1) {
        var flag = true;
        if (type) {
            if (tab1[x].visableScopeType != type) {
                flag = false;
            }
        }
        if (status) {
            if (tab1[x].auditStatus != status) {
                flag = false;
            }
        }
        if (mark) {
            if (tab1[x].goodsMarketNo != mark) {
                flag = false;
            }
        }

        if (flag) {
            data.push(tab1[x]);
        }
    }
    $('#reportTable').bootstrapTable("load", data);

    return data;
}

function table2Change() {
    var type = $("#seach_vis_type_2").val();
    var mark = $("#seach_key_2").val();
    var data = [];
    for (var x in tab2) {
        var flag = true;
        if (type) {
            if (tab2[x].visableScopeType != type) {
                flag = false;
            }
        }
        if (mark) {
            if (tab2[x].goodsMarketNo != mark) {
                flag = false;
            }
        }
        if (flag) {
            data.push(tab2[x]);
        }
    }
    $('#reportTable2').bootstrapTable("load", data);

    return data;
}


function getQueryParams() {
    return {
        goodsNo: sys_goodsNo,
        deployStatus: 0
    };
}

function getQueryParams2() {
    return {
        goodsNo: sys_goodsNo,
        deployStatus: 1
    };
}

function getResponseHandler(res) {

    var cityCodes = [];
    for (var x in res.result) {
        if (res.result[x].visableScopeType == 2) {
            cityCodes.push(res.result[x].visableScope);
        }
    }
    if (cityCodes.length > 0) {
        ajaxData("/whitelist/getCitysName", JSON.stringify(cityCodes), function (cityNames) {
            console.log(cityNames);
            for (var x in res.result) {
                if (res.result[x].visableScopeType == 2) {
                    res.result[x].visName = cityNames[res.result[x].visableScope]
                }
            }
        }, "application/json", null, null, false);
    }
    tab1 = res.result;
    return table1Change();
}

function getResponseHandler2(res) {

    var cityCodes = [];
    for (var x in res.result) {
        if (res.result[x].visableScopeType == 2) {
            cityCodes.push(res.result[x].visableScope);
        }
    }
    if (cityCodes.length > 0) {
        ajaxData("/whitelist/getCitysName", JSON.stringify(cityCodes), function (cityNames) {
            console.log(cityNames);
            for (var x in res.result) {
                if (res.result[x].visableScopeType == 2) {
                    res.result[x].visName = cityNames[res.result[x].visableScope]
                }
            }
        }, "application/json", null, null, false);
    }
    tab2 = res.result
    return table2Change();
}


//查看详情
function view(e) {

    var data = JSON.parse($(e).attr("data-json"));
    var btnType = $(e).attr("data-type");

    var goodsNo = data.goodsNo;
    var onsaleCode = data.onsaleCode;
    var visCode = data.code;

    if (btnType == 1) { //点击查看详情 按钮 弹框titleactive
        var mytitle = `<span>商品发布详情</span>`
    } else if (btnType == 2) { //2点击查看履历按钮 弹框title
        var mytitle = `<span>履历</span>`
    }
    var html = `<div class="view-box mypanel">
					<div class="tab">
						<ul class="nav nav-tabs">
							<li>
								<a data-toggle="tab" href="#on-shelf1">商品发布详情</a>
							</li>
							<li>
								<a data-toggle="tab" href="#on-shelf2">
									履历
								</a>
							</li>
						</ul>
					</div>
					<div class="tab-content">
						<div class="tab-pane" id="on-shelf1">
							<form class="form-horizontal panel-body">
								<div class="form-group">
									<div class="panel tt-panel">
										<div class="panel-heading">
											<h3 class="panel-title">商品信息</h3>
										</div>
										<div class="panel-body">
											<div class="img-row">
												<div class="img-box">
													<img style="border-radius: 9px;" src="/filedownload?fileCode=` + goodsInfo.goodsIcon + `" width="80px" height="80px">
												</div>
												<div class="right-box">
													<h3>` + goodsInfo.goodsName + `</h3>
													<p>` + goodsInfo.goodsIntroduction + `</p>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="panel tt-panel form-group">
									<div class="panel-heading">
										<h3 class="panel-title">发布设置</h3>
									</div>
								</div>
					
								<div class="form-group">
									<label class="col-sm-2 control-label">计费模式：</label>
									<div class="col-sm-10 mycheckbox">
										<div class="check-model form-group" style="display: inline-block;">
											<div class="checkbox freeBtn">
												免费
											</div>
										</div>
										<div class="check-model2" style="display:none ;">
											<div class="checkbox monthbox">
												<input id="demo-form-checkbox" class="magic-checkbox" type="checkbox" checked="">
												<label for="demo-form-checkbox">包月</label>
											</div>
											<div class="checkbox yearbox">
												<input id="demo-form-checkbox-2" class="magic-checkbox" type="checkbox">
												<label for="demo-form-checkbox-2">包年</label>
											</div>
											<div class="checkbox lifelong">
												<input id="demo-form-checkbox-3" class="magic-checkbox" type="checkbox">
												<label for="demo-form-checkbox-3">终身</label>
											</div>
										</div>
									</div>
								</div>

								<div class="form-group">
									<label class="col-sm-2 control-label">是否试用：</label>
									<div class="col-sm-10 ">
										<div class="form-group myradio">
											<div class="radio" id="shiyong">
												不支持试用
											</div>
										</div>
										
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">
								  		<span class="fa fa-question-circle-o"></span>
										发布范围：
									</label>
									<div class="col-sm-10">
										<div class="form-group">
											<div class="radio" id="fanwei_leixing">
												全国
											</div>
										</div>
										<div id="vis_table" style="width: 500px;"></div>
									</div>
								</div>
								<div class="panel tt-panel form-group" style="margin-bottom:0;">
									<div class="panel-heading col-sm-2">
										<h3 class="panel-title">上架设置</h3>
									</div>
									
									<div class="col-sm-12" style="padding:0">
										<p style="margin:0;line-height:42px;margin-left: 78px;" id="zd_fubu">审核通过后，自动上架</p>
										
									</div>
								</div>
							</form>
						</div>
						<div class="tab-pane" id="on-shelf2">
							<div class="panel-body" id="his_good_info">
								
							</div>
						</div>
					</div>
				</div>`;
    // 模态框
    popup.open({
        width: "1000px", // 弹层宽度
        id: "model", // 弹层id
        title: mytitle, // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        //cancelBtn: "暂不", //设置关闭文字
        submitBtn: "确定", //上架商品
        submitCallBack: function () {
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })

    if (btnType == 1) { //1点击查看详情 按钮  商品上架详情显示
        $(".view-box .nav-tabs li:first").addClass("active");
        $(".view-box .tab-content .tab-pane:first").addClass("active");
    } else if (btnType == 2) { //2点击查看履历  履历显示
        $(".view-box .nav-tabs li").siblings().removeClass("active");
        $(".view-box .nav-tabs li:last").addClass("active");
        $(".view-box .tab-content .tab-pane").siblings().removeClass("active");
        $(".view-box .tab-content .tab-pane:last").addClass("active");
    }


    $(".nav-tabs li").off().on("click", function () {
        $("#model .t-pop-title span").html($(this).text())
    })

    initGoodsUpInfo(onsaleCode);
    initHisHTml(goodsNo, visCode);

}

function initGoodsUpInfo(onsaleCode) {
    ajaxData("/cm/goods/common/getOnShelfGoodsInfo", {OnShelfCode: onsaleCode}, function (res) {
        console.log(res);

        // 是否免费
        if (res.onsaleAttrList.length == 0) {
            $("#demo-form-checkboxwww").prop('checked', true);
        } else {
            // 不免费
        }

        if (res.allowTrial == 1) {
            $("#shiyong").text("不支持试用");
        } else {
            $("#shiyong").text("支持试用 （" + res.trialPeriod + "个月）");
        }

        if (res.autoDeploy == 1) {
            $("#zd_fubu").text("审核通过后，自动上架");
        } else {
            $("#zd_fubu").text("审核通过后，手动上架");
        }

        // 上架范围
        if (res.onsaleVisableList) {
            if (res.onsaleVisableList[0].visableScopeType == 1) {
                $("#fanwei_leixing").text("全国");
            } else if (res.onsaleVisableList[0].visableScopeType == 2) {
                $("#fanwei_leixing").text("区域");

                var codes = [];

                var visables = res.onsaleVisableList;

                for (var x in visables) {
                    codes.push(visables[x].visableScope);
                }
                ajaxData("/whitelist/getCitysName", JSON.stringify(codes), function (cityNames) {
                    var params = [];
                    for (var x in cityNames) {
                        var names = cityNames[x].split("-");
                        names.push("");
                        names.push("");
                        names.push("");
                        var icodes = x.split("-");
                        var icode = icodes[icodes.length-1];
                        params.push({
                            code: x,
                            names: names,
                            icode:icode
                        });
                    }
                    updateVisTableHtml(params, 2);
                }, "application/json");
            } else if (res.onsaleAttrList[0].visableScopeType == 3) {
                $("#fanwei_leixing").text("组织");
            }
        }

    });
}

function initHisHTml(goodsNo, visCode) {
    ajaxData("/cm/goods/common/getGoodsHis", {goodsNo: goodsNo, visCode: visCode}, function (res) {
        var html = ``;
        for (var x in res) {
            var openTypeName = getOpenTypeName(res[x].operateType);
            html += `<div class="resume-box">
                        <span class="span-bg">` + openTypeName + ` • ` + (res[x].operateTime.split(" ")[0]) + `</span>
                        <div class="bg-box">
                            <div>
                                <h5>` + res[x].remark + `</h5>
                                <p><span class="user_name user_name_` + res[x].operateAccountCode + `" data-accountCode="` + res[x].operateAccountCode + `"></span>     ` + res[x].operateTime + `</p>
                            </div>
                        </div>
                    </div>`;
        }

        $("#his_good_info").html(html);

        $(".user_name").each(function (index, e) {
            var accountCode = $(e).attr("data-accountCode");

            if (accountCode == "System") {
                $(".user_name_" + accountCode).text("系统");
            } else {
                var param = {accountCode: accountCode}
                ajaxData("/cm/goods/common/getUserNameByAccount", {accountCode: accountCode}, function (res) {
                    $(".user_name_" + param.accountCode).text(res);
                })
            }
        });
    })
}

function getOpenTypeName(t) {
    if (t == 1) return "新建";
    if (t == 2) return "修改";
    if (t == 3) return "删除";
    if (t == 4) return "禁用";
    if (t == 5) return "启用";
    if (t == 6) return "升级";
    if (t == 7) return "上架";
    if (t == 8) return "下架";
    if (t == 9) return "发布";
    if (t == 10) return "撤销发布";
    if (t == 11) return "提交审核";
    if (t == 12) return "审核通过";
}

//审核驳回
function rejection(e) {
    var autmag = $(e).attr("data-autmag");
    var html = `<div class="padding-box">
								<div class="mar-top">` + autmag + `</div>
							</div>`;
    popup.open({
        width: "580px", // 弹层宽度
        id: "model111", // 弹层id
        title: "驳回原因", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        submitBtn: "确定", //
        submitCallBack: function () {
        },
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

//发布
function pudbtn() {
    var html = `<div class="Unpublish-box">
						<i class="ion-help-circled" style="color:#ffbc2c;"></i>是否确定现在发布？
			
					</div>`;
    popup.open({
        width: "580px", // 弹层宽度
        id: "mode222", // 弹层id
        title: "发布", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        cancelBtn: "暂不", //设置关闭文字
        submitBtn: "确定", //上架商品
        submitCallBack: function () {
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

//取消发布
function cellpudbtn() {
    var html = `<div class="Unpublish-box">
						<i class="fa fa-exclamation-circle"></i>取消发布不会影响已出售的商品，取消发布可在商品管理查看<br/>并编辑商品，是否确定取消发布？
			
					</div>`;
    popup.open({
        width: "580px", // 弹层宽度
        id: "mode1223", // 弹层id
        title: "取消发布", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        cancelBtn: "暂不", //设置关闭文字
        submitBtn: "确定", //上架商品
        submitCallBack: function () {
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

//下架提示
function offShelf(e) {
    var visCode = $(e).attr("data-visCode");
    var html = `<div class="Unpublish-box">
						<i class="fa fa-exclamation-circle"></i>下架后的商品在市场上将不可见，但不会影响已出售的商品，下架在商品发布管理列表可编辑发布信息，是否立即下架？
			
					</div>`;
    popup.open({
        width: "580px", // 弹层宽度
        id: "mode", // 弹层id
        title: "下架", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        cancelBtn: "暂不", //设置关闭文字
        submitBtn: "确定", //上架商品
        submitCallBack: function () {

            ajaxData("/cm/goods/common/unReleaseGoodsVis", {visCode: visCode}, function (res) {
                console.log(res);
                if (res) {
                    commonShowOk("下架成功");
                } else {
                    commonShowOk("下架失败");
                }
                reLoad()
            });

        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

//
$(".nav-btn", ".mytabs").click(function () {
    var btnindex = $(this).index();
    if (btnindex == 5) {
        btnindex = 1;
    }
    $(this).addClass("active").siblings().removeClass("active");
    $(".tab-content>div").eq(btnindex).addClass("active").siblings().removeClass("active");
})

//table 序号
function myTrindex() {
    var mytable = $('#billingMode');
    var len = $("tr", mytable).length;
    for (var i = 1; i < len; i++) {
        $('tr:eq(' + i + ') td:first', mytable).text(i);
    }
}

//申请上架 --计费模式--table--traddTr添加
function addTr(event) {
    var trhtml = `<tr>
								<td></td>
                        		<td><input placeholder="不限制" /></td>
								<td class="priceTd on" width="30%">
									<div class="input-box"><input placeholder="--" class="text-right"/><span>元/月</span></div>
									<div class="noinput"><div class="text-right">--</div><span>元/月</span></div>
								</td>
								<td class="priceTd on" width="30%">
									<div class="input-box"><input placeholder="--" class="text-right"/><span>元/年</span></div>
									<div class="noinput"><div class="text-right">--</div><span>元/年</span></div>
								</td> 
								<td class="priceTd on" width="30%">
									<div class="input-box"><input placeholder="--" class="text-right"/><span>元/终身</span></div>
									<div class="noinput"><div class="text-right">--</div><span>元/终身</span></div>
								</td>
                        		<td class="jia-icon">
                        			<span class="ion-plus-round addTr" onclick="addTr(this)"></span>
                        		</td>
                        		<td class="jian-icon">
									<span class="ion-minus-round removeTr" onclick="removeTr(this)"></span>
								</td>
			            	</tr> `;

    $(event).parents("tr").after(trhtml);
    myTrindex();
}

//申请上架 --计费模式--table--removeTr删除tr
function removeTr(event) {
    $(event).parents("tr").remove();
    myTrindex();
}

//再上架
function putOn() {
    $(".mytabs .nav-btn").eq(1).addClass("active").siblings().removeClass("active");
    $(".tab-content>div").eq(1).addClass("active").siblings().removeClass("active");
}

//申请发布
function sqfbBtn(btnType, visData) {
    var visList = null;
    ajaxData("/cm/goods/common/getGoodsPermitReleaseArea", {goodsNo: goodsInfo.goodsNo}, function (res) {
        console.log(res);
        if (!res || res.flag == false) {
            // 代理商品授权范围冲突，没有可发布的范围
            var html = `<div class="padding-box">
							<i class="fa fa-exclamation-circle" style="color:#f95959"></i>
							<div>代理商品授权范围冲突，没有可发布的范围！</div>
							</div>`
            popup.open({
                width: "580px", // 弹层宽度
                id: "vis_error", // 弹层id
                title: "提示", // 标题
                center: "center", // 标题是否居中 left center right
                content: html, //设置内容 支持html
                submitBtn: "确定", //上架商品
                submitCallBack: function () {
                },
            })
            return false;
        } else {
            visList = res;
        }
    }, null, null, null, false);

    if (!goodsInfo) {
        return;
    }

    if (btnType == 1) { //申请发布
        var mytitle = `<span>申请发布</span>`
    } else if (btnType == 2) { //编辑
        var mytitle = `<span>编辑</span>`
    }
    var html = `
        	<div class="panel listing-goods-box">
				<form class="form-horizontal panel-body">
					<div class="form-group">
						<div class="panel tt-panel">
							<div class="panel-heading">
								<h3 class="panel-title">商品信息</h3>
								<input type="hidden" value="` + goodsInfo.goodsNo + `" id="up_goodsNo"/>
							</div>
							<div class="panel-body">
								<div class="img-row">
									<div class="img-box">
										<img src="/filedownload?fileCode=` + goodsInfo.goodsIcon + `"  style="border-radius: 9px;" width="80px" height="80px">
									</div>
									<div class="right-box">
										<h3>` + goodsInfo.goodsName + `</h3>
										<p>` + goodsInfo.goodsIntroduction + `</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div class="panel tt-panel form-group">
						<div class="panel-heading flex-box">
							<h3 class="panel-title">商品规格设置<span class="fa fa-question-circle-o"></span>
								<span class="produspeall-box">
									<input id="produspeall" class="magic-checkbox" type="checkbox"   >
									<label for="produspeall">全选商品规格</label>
								</span>
							</h3>
						</div>
					</div>
					
					<div class="form-group produspea-box">
						<label class="col-sm-2 control-label"><span class="red">*</span>颜色:</label>
						<div class="col-sm-10 mycheckbox1 mycheckbox">
							<div class="check-model form-group" style="display: inline-block;">
								<div class="checkbox">
									<input id="color-red" class="magic-checkbox" type="checkbox" checked="" value="红色">
									<label for="color-red">红色</label>
								</div>
								<div class="checkbox ">
									<input id="color-white" class="magic-checkbox" type="checkbox" value="白色">
									<label for="color-white">白色</label>
								</div>
								<div class="checkbox ">
									<input id="color-black" class="magic-checkbox" type="checkbox" value="黑色">
									<label for="color-black">黑色</label>
								</div>
							</div>
						</div>
						<label class="col-sm-2 control-label"><span class="red">*</span>尺寸:</label>
						<div class="col-sm-10 mycheckbox2 mycheckbox">
							<div class="check-model form-group" style="display: inline-block;">
								<div class="checkbox">
									<input id="size_1" class="magic-checkbox" type="checkbox" checked="" value="大">
									<label for="size_1">大</label>
								</div>
								<div class="checkbox ">
									<input id="size_2" class="magic-checkbox" type="checkbox" value="中">
									<label for="size_2">中</label>
								</div>
								<div class="checkbox ">
									<input id="size_3" class="magic-checkbox" type="checkbox" value="小">
									<label for="size_3">小</label>
								</div>
							</div>
						</div>
						<label class="col-sm-2 control-label"><span class="red">*</span>材质:</label>
						<div class="col-sm-10 mycheckbox3 mycheckbox">
							<div class="check-model form-group" style="display: inline-block;" >
								<div class="checkbox">
									<input id="material_1" class="magic-checkbox" type="checkbox" checked="" value="塑料" >
									<label for="material_1">塑料</label>
								</div>
								<div class="checkbox">
									<input id="material_2" class="magic-checkbox" type="checkbox" value="铝">
									<label for="material_2">铝</label>
								</div>
								<div class="checkbox ">
									<input id="material_3" class="magic-checkbox" type="checkbox" value="合金">
									<label for="material_3">合金</label>
								</div>
							</div>
						</div>
					</div>
					<div class="panel tt-panel form-group">
						<div class="panel-heading flex-box">
							<h3 class="panel-title">商品规格设置<span class="fa fa-question-circle-o"></span>
								<span class="">
									<div class="determine btn new-goods-btn automaticbtn">自动生成规格</div>
									<div class="determine btn new-goods-btn" onclick="">添加行</div>
								</span>
							</h3>
						</div>
					</div>
					
					<div class="produtable">
						<table id="produspe"></table>
					</div>

					
					
					<div class="panel tt-panel form-group">
						<div class="panel-heading">
							<h3 class="panel-title">发布设置</h3>
						</div>
					</div>
					
					<div class="form-group">
						<label class="col-sm-2 control-label"><span class="red">*</span>计费模式：</label>
						<div class="col-sm-10 mycheckbox">
							<div class="check-model form-group" style="display: inline-block;">
								<div class="checkbox freeBtn">
									<input id="goods_free" class="magic-checkbox" type="checkbox" checked="" disabled="true" >
									<label for="goods_free">免费</label>
								</div>
							</div>
							<div class="check-model2" style="display:none ;">
								<div class="checkbox monthbox">
									<input id="demo-form-checkbox" class="magic-checkbox" type="checkbox" checked="">
									<label for="demo-form-checkbox">包月</label>
								</div>
								<div class="checkbox yearbox">
									<input id="demo-form-checkbox-2" class="magic-checkbox" type="checkbox">
									<label for="demo-form-checkbox-2">包年</label>
								</div>
								<div class="checkbox lifelong">
									<input id="demo-form-checkbox-3" class="magic-checkbox" type="checkbox">
									<label for="demo-form-checkbox-3">终身</label>
								</div>
							</div>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label"></label>
						<div class="col-sm-10 mytable" style="display:none;">
							<div class="form-group">
								<table id="billingMode" class="demo-add-niftycheck table mytable-border" style="border-collapse: collapse;">
									<thead style="border-bottom:0;">
										<tr style="background-color: #f6f8fa;">
											<th class="text-center" width="8%">
												<div>序号</div>
											</th>
											<th class="text-center"  >
												<div>用户数</div>
											</th>
											<th colspan="3" class="text-center">价格（元）</th>
										</tr>
									</thead>
									<tbody class="text-center;">
										<tr>
											<td>1</td>
											<td><input placeholder="不限制"></td>
											<td class="priceTd on" width="30%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/月</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/月</span>
												</div>
											</td>
											<td class="priceTd" width="30%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/年</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/年</span></div>
											</td>
											<td class="priceTd" width="32%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/终身</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/终身</span></div>
											</td>
											<td class="jia-icon">
												<span class="ion-plus-round addTr" onclick="addTr(this)"></span>
											</td>
										</tr>
										<tr>
											<td>2</td>
											<td><input placeholder="不限制"></td>
											<td class="priceTd on" width="30%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/月</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/月</span>
												</div>
											</td>
											<td class="priceTd" width="30%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/年</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/年</span></div>
											</td>
											<td class="priceTd" width="32%">
												<div class="input-box"><input class="text-right" placeholder="--"><span>元/终身</span></div>
												<div class="noinput">
													<div class="text-right">--</div><span>元/终身</span></div>
											</td>
											<td class="jia-icon">
												<span class="ion-plus-round addTr" onclick="addTr(this)"></span>
											</td>
											<td class="jian-icon">
												<span class="ion-minus-round removeTr" onclick="removeTr(this)"></span>
											</td>
										</tr>
										
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label"><span class="red">*</span>是否试用：</label>
						<div class="col-sm-10 ">
							<div class="form-group">
								 <div class="radio diycycle">
							        <input value="0" id="allowTrial1" class="magic-radio" type="radio" name="allowTrial" checked>
							        <label for="allowTrial1">自定义试用周期</label>
							        <div class="jajian_box">
								        <ul class="minuser-counter">
											<li id="minus"><input type="button" onclick="minuser()" value="-"></li>
											<li id="countnum">1</li>
											<li id="plus"><input type="button" onclick="adder()" value="+"></li>
										</ul>
										<div class="text">个月<span>（1个月为30天）</span></div>
							        </div>
							        
							    </div>
								
								 <div class="radio" style="display: flex;align-items: center;">
							        <input value="1" id="allowTrial2"   class="magic-radio" type="radio" name="allowTrial">
							        <label for="allowTrial2">不支持试用</label>
							    </div>
							</div>
							
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">
					  		<span class="fa fa-question-circle-o"></span>
							<span class="red">*</span>发布范围：
						</label>
						<div class="col-sm-10">
							<div class="form-group">
								<div class="checkbox" id="shelfSele">
									<div>
										<select class="selectpicker" id="visable_scope">
										
       
            							<option id="visable_scope_all" value="1">全国</option>
       
											
											<option value="2">区域</option>
											<!--<option value="3">组织</option>-->
										</select>
										<input type="hidden" id="update_all_code">
									</div>
									<div style="display: none;" id="shelfBtn" style="padding-left:10px">
										<a class="edit">+选择可见区域范围</a>
									</div>
								</div>
							</div>
							<div id="vis_table" style="width: 500px;">
							
                            </div>
						</div>
					</div>
					<div class="panel tt-panel form-group" style="margin-bottom:0;">
						<div class="panel-heading col-sm-2">
							<h3 class="panel-title">上架设置</h3>
						</div>
						
						<div class="col-sm-10" style="padding:0">
							<p style="margin:0;line-height:42px"><span class="ion-exclamatio"></span>发布审核通过后，可以按照以下设置上架</p>
							
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label"></label>
						<div class="col-sm-10">
							<div class="form-group" style="display: flex;align-items: center;justify-content: flex-start">
								<div class="radio diycycle" style="display: flex;align-items: center;">
									<input id="autoDeploy1" class="magic-radio" value="1" type="radio" name="autoDeploy" checked>
									<label for="autoDeploy1">审核通过后，自动上架</label>
								</div>
								<div class="radio" style="display: flex;align-items: center;">
									<input id="autoDeploy0" class="magic-radio" value="0"  type="radio" name="autoDeploy">
									<label for="autoDeploy0">审核通过后，手动上架</label>
    							</div>
							</div>
							
						</div>
					</div>
				</form>
			</div>`
    popup.open({
        width: "1000px", // 弹层宽度
        id: "modewer", // 弹层id
        title: mytitle, // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        //cancelBtn: "暂不", //设置关闭文字
        submitBtn: "提交发布", //上架商品
        submitCallBack: function () {

            return putOnShelfGoods();
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
    //上架范围
    $('.selectpicker').selectpicker();


    $("#visable_scope").change(function () {
        var value = $(this).val();
        if (value == 2) {
            $("#shelfBtn").show();
        } else {
            $("#shelfBtn").hide();
        }
    });

    if (visList.type != 1) {
        $("#visable_scope_all").remove();
        $('.selectpicker').selectpicker('refresh');
        $("#visable_scope").change();
    }

    $("input[name='allowTrial']").change(function () {
        var val = $(this).val();
        if (val == 1) {
            $(".jajian_box").hide();
        } else {
            $(".jajian_box").show();
        }
    });

    // 编辑
    if (visData) {
        $("#shelfBtn").hide();
        ajaxData("/cm/goods/common/getOnShelfGoodsInfo", {OnShelfCode: visData.onsaleCode}, function (res) {
            console.log(res);
            $("input[name='allowTrial']").each(function () {
                if ($(this).val() == res.allowTrial) {
                    $(this).prop('checked', true);
                }
            });
            if (res.allowTrial == 0) {
                $(".jajian_box").show();
            } else {
                $(".jajian_box").hide();
            }

            $("#countnum").text(res.trialPeriod ? res.trialPeriod : "");

            $("input[name='autoDeploy']").each(function () {
                if ($(this).val() == res.autoDeploy) {
                    $(this).prop('checked', true);
                }
            });

            $("#visable_scope").val(res.onsaleVisableList[0].visableScopeType);
            $("#visable_scope").attr("disabled", "disabled");
            $('#visable_scope').selectpicker('refresh');


            if (res.onsaleVisableList[0].visableScopeType == 2) {
                var codes = [];

                codes.push(visData.visableScope);

                ajaxData("/whitelist/getCitysName", JSON.stringify(codes), function (cityNames) {
                    console.log(cityNames);
                    var name = cityNames[visData.visableScope];
                    var names = name.split("-");
                    var icodes = visData.visableScope.split("-");
                    var icode = icodes[icodes.length-1]
                    names.push("");
                    names.push("");
                    names.push("");
                    var params = [{
                        vCode: visData.code,
                        code: visData.visableScope,
                        icode: icode,
                        names: names,
                    }];
                    updateVisTableHtml(params, 2);
                }, "application/json");
            }else{
                $("#update_all_code").val(visData.code);
            }
        })
    }

    selectUnitData = [];
    $(".edit").off().on("click", function () {
        selectUnit.render({
            title: "选择可见范围（区域）",
            select: [],
            onlyShow: visList.type == 2 ? visList.areaList : null,
            url: "/whitelist/getCityList",
            param: '[2, 3, 4]',
            contentType: "application/json",
            resType: "all", // 返回类型 级联类型1 all 选中子集数据父级数据也跟着返回，  默认只返回选中数据(默认返回单条数据)
            select:selectUnitData,
            treePram: {
                view: {
                    dblClickExpand: true,
                    showLine: true,
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: {"Y": "", "N": ""}
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "code",
                        pIdKey: "pcode",
                    },
                    key: {
                        name: "regionName"
                    }
                },

            },
            callback(selectUnitRes) {
                selectUnitData = selectUnitRes;
                initSeletedVisHtml(selectUnitRes);
            },
        })
    })


    //免费
    $(".freeBtn").click(function () {
        if ($('.freeBtn input').is(':checked')) {
            $(this).parents(".check-model").next(".check-model2").find("input").attr('checked', false);
            $("#billingMode").hide();
        } else {
            $(this).parents(".check-model").next(".check-model2").find("input").eq(0).prop('checked', true);
            $("#billingMode").show();
        }
    })
    $(".listing-goods-box .mycheckbox .check-model2 .checkbox").click(function () {
        //全不选
        var length = $('.listing-goods-box .mycheckbox .check-model2 .checkbox').length;
        for (var i = 0; i < length; i++) {
            if ($('.listing-goods-box .mycheckbox .check-model2 .checkbox input:checked').length == 0) {
                $(".freeBtn input").prop('checked', true);
                $("#billingMode").hide();
            }
        }
        //点击包月
        if ($('.monthbox input').is(':checked')) {
            $("#billingMode").show();
            $(".freeBtn input").attr('checked', false);
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(2).addClass("on")
            })

        } else {
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(2).removeClass("on")
            })

        }
        //点击包年
        if ($('.yearbox input').is(':checked')) {
            $("#billingMode").show();
            $(".freeBtn input").attr('checked', false);
            ;
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(3).addClass("on")
            })

        } else {
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(3).removeClass("on")
            })
        }
        //点击终身
        if ($('.lifelong input').is(':checked')) {
            $("#billingMode").show();
            $(".freeBtn input").attr('checked', false);
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(4).addClass("on")
            })

        } else {
            $("tr", "#billingMode tbody").each(function () {
                $(this).find("td").eq(4).removeClass("on")
            })
        }
    })
    
    
   //商品规格全选
  	$(".produspeall-box").click(function () {
  	// console.log($(".produspea-box").find("input"))
        if ($('input',this).is(':checked')) {
        	$(".produspea-box").find("input").prop('checked',true);  
        } else {
     	$(".produspea-box").find("input").prop('checked',false);
        }
    })
  	$(".produspea-box .checkbox").click(function () {
  		var length = $(".produspea-box .checkbox input").length;
  		   for (var i = 0; i < length; i++) {
            if ($('.produspea-box .checkbox input:checked').length ==length) {
                $(".produspeall-box input").prop('checked',true);  
            }else {
	     		$(".produspeall-box input").prop('checked',false);
	        }
        }
  	})
	$('.automaticbtn').click(function(){
		var packageCodeList1=new Array();
		var packageCodeList2=new Array();
		var packageCodeList3=new Array();
		
   		 $('.produspea-box .mycheckbox1 input:checked').each(function(){
	    	 packageCodeList1.push($(this).val());//向数组中添加元素
	        	//console.log('val1'+$(this).val())
       	});
       	$('.produspea-box .mycheckbox2 input:checked').each(function(){
	    	  packageCodeList2.push($(this).val());
       	});
       	$('.produspea-box .mycheckbox3 input:checked').each(function(){
	    	  packageCodeList3.push($(this).val());
       	});
       	

		packageCodeList1.forEach((item,index)=>{
        	packageCodeList2.forEach((item2,index)=>{
		        packageCodeList3.forEach((item3,index)=>{
		        	newArr.push(item+'-'+item2+'-'+item3);
			       console.log(newArr);
			       // return;
			    })
	    	})
        	
    	})

	})
    //商品规格table
	$('#produspe').bootstrapTable({
		
        data: [{
                prodspec: 1,
                customspec: '',
            }],  
        columns: [
            [{
                field: "prodspec",
                title: "<span class='red'>*</span>商品规格<span class='fa fa-question-circle-o'></span>",
                valign: "middle",
                align: 'center',//居中
                //width: 50,
                formatter: function (value, row, index) {
                	console.log(newArr)
                	for (var i =0; i<newArr.length; i++) {
                		newArr1.push(newArr);
                	}
//                  return `<select class="selectpicker" >
//								<option value="">全部发布范围</option>
//								<option value="1">全国</option>
//								<option value="2">区域</option>
//								<option value="3">组织</option>
//							</select>`;
                }
            },
                {
                    field: "customspec",
                    title: "自定义规格",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "全国";
                        } else {
                            return row.visName;
                        }
                    }
                },
                {
                    field: "price",
                    title: "<span class='red'>*</span>单价（元）",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        return `<input  placeholder="请输入单价(元)">`;
                    }
                },
                {
                    field: "stocknum",
                    title: "<span class='red'>*</span>库存数量（件）",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                        return `<input  placeholder="请输入库存数量">`;
                    }
                },
                {
                    field: "specscode",
                    title: "规格码",
                    align: 'center',//居中
                    valign: "middle",
                     formatter: function (value, row, index) {
                        return `<input  placeholder="请输入商品码">`;
                    }
                },
                {
                    field: "auditStatus",
                    title: "操作",
                    align: 'center',//居中
                    valign: "middle",
                    formatter: function (value, row, index) {
                   return `<span>删除</span><span>复制</span>`;
                    } 
                }
               
            ]

        ],
    });

	
}

function initSeletedVisHtml(data, type) {

    // 过滤选中的地区
    var selected = [];

    for(var x in data){
        var code = data[x].pcodePath;
        var name = data[x].regionFullName;

        var codes = code.split(";");
        var names = name.split(",");

        var c_code = codes.slice(2,codes.length).join("-");
        var c_name = names.slice(2,codes.length);

        c_name.push("");
        c_name.push("");
        c_name.push("");

        selected.push({
            code:c_code,
            names:c_name,
            icode:data[x].code
        });
    }

    updateVisTableHtml(selected, type);
}

function updateVisTableHtml(data, onlyshow) {

    if(!data || data.length == 0){
        $("#vis_table").html("");
        return;
    }

    var html = `<table class="table table-bordered table-hover table-condensed">
                        <tr>
                            <th>省</th>
                            <th>市</th>
                            <th>区</th>`
        + (onlyshow ? `` : `<th>操作</th>`) + `
                        </tr>`;

    for (var x in data) {

        html += `<tr>
                    <td class="vis-param">
                        <input type="hidden" class="vis-code" value="` + data[x].code + `"/>
                        <input type="hidden" class="vis-icode" value="` + data[x].icode + `"/>
                        <input type="hidden" class="vis-vCode" value="` + (data[x].vCode ? data[x].vCode : ``) + `"/>
                    
                      ` + (data[x].names[0]?data[x].names[0]:"-") + `</td>
                    <td>` + (data[x].names[1]?data[x].names[1]:"-") + `</td>
                    <td>` + (data[x].names[2]?data[x].names[2]:"-")  + `</td>
                    ` + (onlyshow ? `` :`<td ><a onclick="delRowVis(this)">删除</a></td>`) + `
                 </tr>`;
    }
    html += `</table>`;

    $("#vis_table").html(html);
}

function delRowVis(e) {
    $(e).parents("tr").remove();
    if ($("#vis_table").find("tr").length == 1) {
        $("#vis_table").html("");
    }
}


// 提交发布
function putOnShelfGoods() {
    var data = {
        goodsNo: $("#up_goodsNo").val(),
        allowTrial: $("input[name='allowTrial']:checked").val(),// 是否支持试用
        autoDeploy: $("input[name='autoDeploy']:checked").val(),//审核通过后是否自动发布
        onsaleAttrList: [],// 计费模式 空的属于免费
        onsaleVisableList: []
    }

    var visType = $("#visable_scope").val();

    if (visType == 1) {
        // 全国
        var vis = {
            visableScopeType: visType,
            code:$("#update_all_code").val()
        }
        data.onsaleVisableList.push(vis);
    } else if (visType == 2) {
        if ($("#vis_table .vis-code").length == 0) {
            commonShowError("请选择区域");
            return false;
        } else {
            $("#vis_table .vis-param").each(function (index, e) {
                var vis = {
                    visableScopeType: visType,
                    visableScope: $(e).find(".vis-code").val(),
                    code: $(e).find(".vis-vCode").val(),
                }
                data.onsaleVisableList.push(vis);
            });
        }
    } else {
        return;
    }


    if (data.allowTrial == 0) {
        //试用周期，单位：月，30天
        data.trialPeriod = $("#countnum").text();
    }

    // 校验是否可以保存
    ajaxData("/cm/goods/common/checkOnShelfGoods", JSON.stringify(data), function (res) {
        console.log(res);
        if (res) {
            commonShowError(res);
        } else {
            popup.clearAllPopup();
            ajaxData("/cm/goods/common/putOnShelfGoods", JSON.stringify(data), function (res) {
                if (res) {

                    // 发布成功是否自动上架 1、 自动上架 2、手动上架
                    var autoDeployFlag = data.autoDeploy;
                    // 弹出提示框
                    publishTipPop(autoDeployFlag);
                } else {
                    commonShowError("发布失败");
                }
                reLoad()
            }, 'application/json');
        }
    }, 'application/json');

    return false;
}

/**
 * 发布成功提示
 * @param autoDeployFlag 是否自动上架 1、 自动上架 2、手动上架
 */
function publishTipPop(autoDeployFlag) {

    var html = ``;

    if ("1" == autoDeployFlag) {
        html = `<div class="publish_suc_tip">
							发布成功，审核通过后自动上架到应用市场，你可以在<a href="###" onclick="toTab2()">商品下架管理</a>进行管理或前往应用市场查看。
				</div>`
    } else {
        html = `<div class="publish_suc_tip">
							发布成功，审核通过后你可以在商品发布管理进行手动上架。
							</div>`
    }

    popup.open({
        width: "580px", // 弹层宽度
        id: "publishTipPop", // 弹层id
        title: "发布提示", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        submitBtn: "确定",
        submitCallBack: function () {
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

//申请上架 --计费模式--加减
function adder() {
    var count = $("#countnum").text();
    count = parseInt(count) + 1;
    $("#countnum").text(count);
}

function minuser() {
    var count = $("#countnum").text();
    if (count <= 0) {
        count = 0;
    } else {
        count = parseInt(count) - 1;
    }
    $("#countnum").text(count);

}

function onShelf(e) {
    var visCode = $(e).attr("data-visCode");
    var html = `<div class="Unpublish-box">
							<i class="fa fa-exclamation-circle" style="color:#f95959"></i>是否确定现在上架?
							</div>`
    popup.open({
        width: "580px", // 弹层宽度
        id: "onShelfmode", // 弹层id
        title: "上架", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        cancelBtn: "暂不", //设置关闭文字
        submitBtn: "确定", //上架商品
        submitCallBack: function () {
            ajaxData("/cm/goods/common/releaseGoodsVis", {visCode: visCode}, function (res) {
                console.log(res);
                if (res) {
                    // 弹出上架成功提示
                    showShelfTip();
                } else {
                    commonShowOk("上架失败");
                }
                reLoad()
            })
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

/**
 * 上架成功提示
 */
function showShelfTip() {
    var html = `<div class="publish_suc_tip">
							上架成功，你可以到<a href="###" onclick="toTab2()">商品下架管理</a>进行管理或前往应用市场查看。
				</div>`
    popup.open({
        width: "580px", // 弹层宽度
        id: "onShelfmode", // 弹层id
        title: "上架提示", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        submitBtn: "确定", //
        submitCallBack: function () {
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

/**
 * 跳转到商品下架管理
 */
function toTab2() {
    // 移除弹窗
    popup.clearAllPopup();
    // 跳转到商品下架管理
    $(".to_tab2").click();
}

//编辑提示
function editTips(e) {

    var visData = JSON.parse($(e).attr("data-json"));

    var html = `<div class="padding-box">
							<i class="fa fa-exclamation-circle" style="color:#f95959"></i>
							<div>目前该商品已发布审核通过，如需再次编辑，提交发布后需重新审核，是否确定编辑？</div>
							</div>`
    popup.open({
        width: "580px", // 弹层宽度
        id: "editTipsmode", // 弹层id
        title: "提示", // 标题
        center: "center", // 标题是否居中 left center right
        content: html, //设置内容 支持html
        submitBtn: "确定", //上架商品
        submitCallBack: function () {
            sqfbBtn(2, visData);
        }, // 设置成功回调函数，执行结束关闭弹层，retun false 阻止关闭
        closeCallBack: function () {
        } // 点击取消回调韩式，执行结束关闭弹层，retun false 阻止关闭
    })
}

// 查询商品信息
function initGoodsInfo(goodsNo) {
    ajaxData("/cm/goods/common/getGoodsInfo", {goodsNo: goodsNo}, function (res) {
        console.log(res);
        goodsInfo = res;
        $("#goodsIcon").attr("src", "/filedownload?fileCode=" + res.goodsIcon);
        $("#goodsName").text(res.goodsName);
        $("#goodsIntroduction").text(res.goodsIntroduction);
        $("#goodsNo").text(res.goodsNo);
        $("#goodsType").text(getGoodsTypeName(res.goodsType));
        $("#updateTime").text(res["updateTime"].split(" ")[0]);
    });
}

function getGoodsTypeName(type) {
    if (type == 1) return "解决方案";
    if (type == 2) return "应用";
    if (type == 3) return "小程序";
    if (type == 4) return "智能硬件";
}
