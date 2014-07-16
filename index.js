// Generated by LiveScript 1.2.0
var x$;
x$ = angular.module('jobs', ['firebase']);
x$.filter('tok', function(){
  return function(it){
    if (isNaN(it)) {
      return it;
    }
    return parseInt(it / 1000) + "K";
  };
});
x$.directive('delayBk', function(){
  return {
    restrict: 'A',
    link: function(scope, e, attrs, ctrl){
      var url;
      url = attrs["delayBk"];
      return $('<img/>').attr('src', url).load(function(){
        $(this).remove();
        e.css({
          "backgroundImage": "url(" + url + ")"
        });
        return e.toggleClass('visible');
      });
    }
  };
});
x$.controller('index', function($scope, $timeout, $firebase){
  var update;
  $scope.jobtypes = jobtypes;
  $scope.needfix = false;
  $scope.newjob = {};
  if (false) {
    $scope.newjob = {
      title: '碩士級以上研究助理',
      jobtype: $scope.jobtypes[2],
      jobname: $scope.jobtypes[2].jobs[3],
      salary1: 67000,
      salary2: 68000,
      location: '台北市',
      company: '中央研究院',
      url: 'http://www.sinica.edu.tw',
      email: 'hr@nowhere.no',
      desc: '研究助理，協助研究員進行研究，處理文件，申請補助計劃，論文編撰。'
    };
  }
  $scope.user = null;
  $scope.jobtype = "";
  $scope.jobs = [];
  update = function(data){
    var ret, item;
    ret = [];
    for (item in data) {
      if (item.indexOf("$") !== 0) {
        ret.push([item, data[item]]);
      }
    }
    return ret;
  };
  $scope.$watch('newjob.jobtype', function(v){
    if ($scope.newjob.jobtype) {
      $scope.jobs = $scope.newjob.jobtype.jobs;
      return console.log($scope.newjob.jobtype.jobs);
    }
  });
  $scope.dbRef = {
    date: new Firebase('https://joblist.firebaseio.com/jobs')
  };
  $scope.datasrc = {
    date: $firebase($scope.dbRef.date),
    get: function(arg$){
      var id, ref$, name;
      id = (ref$ = arg$.id) != null ? ref$ : 0, name = (ref$ = arg$.name) != null ? ref$ : "date";
      if (!this[name]) {
        if (!$scope.dbRef[name]) {
          $scope.dbRef[name] = new Firebase("https://joblist.firebaseio.com/cat" + id);
        }
        this[name] = $firebase($scope.dbRef[name]);
      }
      this[name].$on('loaded', function(it){
        return $scope.data[id] = update(it);
      });
      return this[name];
    }
  };
  $scope.data = {};
  $scope.auth = new FirebaseSimpleLogin($scope.dbRef.date, function(e, u){
    return $scope.$apply(function(){
      return $scope.user = u;
    });
  });
  $scope.login = function(){
    return $scope.auth.login('facebook');
  };
  $scope.logout = function(){
    return $scope.auth.logout();
  };
  $scope.datasrc.date.$on('loaded', function(it){
    return $scope.data[0] = update(it);
  });
  $scope.$watch('jobtab', function(){
    var src;
    if ($scope.jobtab) {
      return src = $scope.datasrc.get($scope.jobtab);
    }
  });
  $scope.curjob = {};
  $scope.detail = function(j){
    $scope.curjob = j;
    return setTimeout(function(){
      return $('#job-detail-modal').modal("show");
    }, 0);
  };
  $scope.remove = function(job){
    var src;
    console.log("removing...");
    console.log($scope.jobtab);
    src = $scope.datasrc.get($scope.jobtab
      ? $scope.jobtab
      : {
        id: 0,
        name: "date"
      });
    console.log(src);
    return src.$remove(job[0]);
  };
  return $scope.submit = function(){
    var check, t1, t2, now;
    check = ['jobname', 'salary2', 'salary1', 'company', 'email', 'jobtype', 'location', 'title'];
    t1 = $scope.newjobform.salary1;
    t2 = $scope.newjobform.salary2;
    t1.$setValidity('salary1', $scope.newjob.salary1 < 67000 ? false : true);
    t2.$setValidity('salary2', isNaN($scope.newjob.salary2) || $scope.newjob.salary2 < $scope.newjob.salary1 ? false : true);
    if (!$scope.user) {
      return;
    }
    if (check.map(function(it){
      return $scope.newjobform[it].$invalid;
    }).filter(function(it){
      return it;
    }).length) {
      console.log("submit job failed");
      $scope.needfix = true;
      return;
    }
    now = new Date().getTime();
    $scope.newjob.owner = {
      id: $scope.user.id,
      name: $scope.user.displayName
    };
    $scope.newjob.time = now;
    $scope.datasrc.date.$add($scope.newjob);
    $scope.datasrc.get($scope.newjob.jobtype).$add($scope.newjob);
    $scope.newjob = {};
    $scope.needfix = false;
    console.log("job added");
    $scope.waitreload = true;
    return setTimeout(function(){
      return window.location.reload();
    }, 1000);
  };
});