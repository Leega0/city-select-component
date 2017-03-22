function selectInit(){
//回调函数返回值
modifyCityid = -1;
// 模拟数据请求。
var result,recieveObj;
  $.ajax( {
      url : requestUlr,
      type : 'GET',
      async : false,
      dataType : 'json',
      error : function() {
          alert('操作出现错误！');
      },
      success : function(data) {
          if (data) {
              result= data.data;
          } else {
          }
      }
  });

// 递归查找
function getCtiy(data,cityId)
{
    for (var i in data) {
        if (data[i].id == cityId) {
          // 找到对应id返回此对象。
            recieveObj = data[i];
            break;
        } else {
            getCtiy(data[i].child_citys, cityId);
        }
    }
}
// 此段代码跟上段代码逻辑一致，可优化，查到区县，根据id再次递归查找省份。
function getProvince(data,cityId){
for (var i in data) {
        if (data[i].id == cityId) {
          // 找到省份返回此对象。
            recieveObjprovince = data[i];
            break;
        } else {
            getProvince(data[i].child_citys, cityId);
        }
    }
}
if (recievecity_id==-1) {
    getCtiy(result.citys,1);
    Vue.nextTick(function(){
      vm.selectedProvinceId = -1;
    })
}
  getCtiy(result.citys,recievecity_id);

// 如对象的为三级结构。
if (recieveObj.level===3) {
      recieveCity = recieveObj.parent_id;
      getProvince(result.citys,recieveCity);
      recieveProvince = recieveObjprovince.parent_id;
      recieveCountry = recieveObj.id;
    }else if (recieveObj.level===2) {
      // 对象为二级结构
      recieveCity = recieveObj.id;
      recieveProvince = recieveObj.parent_id;
      recieveCountry = 0;
      Vue.nextTick(function(){
        vm.selectedCountryId = -1;
      })
    }else{
      // 对象为一级结构
      recieveProvince = recieveObj.id;
      recieveCity = 0;
      recieveCountry = 0;
      Vue.nextTick(function(){
        vm.selectedCityId = -1;
        vm.selectedCountryId = -1;
      })
    }
// template
 var citytemplate = '<div class="form-group">'+
    '<label class="col-md-2 control-label">城市：</label>'+
    '<div class="col-md-2" v-if="showprovince">'+
      '<select v-model ="selectedProvinceId" class="form-control" id="rowprovince">'+
        '<option value="-1">请选择省份</option>'+
        '<option v-for="province in provinces" :value="province.id">'+
          '{{province.name}}'+
        '</option>'+
      '</select>'+
    '</div>'+
    '<div class="col-md-2" v-if="showcitys">'+
        '<select class="form-control" v-model="selectedCityId" id="rowcity">'+
            '<option value="-1">请选择市</option>'+
            '<option v-for="city in cities" :value="city.id">'+
          '{{city.name}}'+
        '</option>'+
        '</select>'+
    '</div>'+
    '<div class="col-md-2" v-if="showcountres">'+
        '<select class="form-control" v-model="selectedCountryId" id="rowcountry">'+
            '<option value="-1">请选择区县</option>'+
            '<option v-for="country in countres" :value="country.id">'+
          '{{country.name}}'+
        '</option>'+
        '</select>'+
    '</div>'+

  '</div>'

// vue实例
var vm = new Vue({
el:'#citylist',
data(){
return {
  selectedProvinceId: recieveProvince,
  selectedCityId: recieveCity,
  selectedCountryId:recieveCountry,
  provinces: result.citys, // 省
}
},
created:function(){
$("#citylist").append(citytemplate);
},
  watch:{
    selectedProvinceId:function(newselect,oldselect){
      if (newselect!=oldselect) {
        vm.selectedCityId = -1;
        vm.selectedCountryId = -1;
        modifyCityid = parseInt(newselect)

      }
    },
    selectedCityId:function(newselect,oldselect){
      if (newselect!=oldselect) {
        vm.selectedCountryId = -1;
        modifyCityid = parseInt(newselect)
      }
    },
    selectedCountryId:function(newselect,oldselect){
      if (newselect!=oldselect) {
        modifyCityid = parseInt(newselect)
      }
    }
  },
computed:{
    cities: function() {
                    var tempcities =[];
                    //获取市数据
                    var selectedProvince = this.selectedProvinceId;
                    this.provinces.forEach(function(d){
                      if (d.id == selectedProvince ) {
                        tempcities = d.child_citys;
                      }
                    });
                    return tempcities

                },
    countres: function() {
                    var tempcounres =[];
                    // 获取区县数据
                    var selectedCity = this.selectedCityId;
                   this.cities.forEach(function(d){
                      if (d.id == selectedCity ) {
                        tempcounres = d.child_citys;
                      }
                    });
                    return tempcounres
                },
    showprovince:function(){
      if(componentLevel==1||componentLevel==2||componentLevel==3){
        return true
      }
    },
    showcitys:function(){
      if(componentLevel==2||componentLevel==3){
        return true
      }
    },
    showcountres:function(){
      if(componentLevel==3){
        return true
      }
    }

}

})
}

// methods
var selectComponent = function(selectId,citylevel,url,callback){
  // 参数必传，selectId：城市id，没有则为-1，citylevel：组件显示级别
  // url:数据请求地址，callback:回调函数。
    recievecity_id = selectId;
    componentLevel = citylevel;
    requestUlr = url;
    selectInit();
    if (typeof callback === "function"){
      // modifyCityid 为返回选择的值。
        callback(modifyCityid);
    }
}
