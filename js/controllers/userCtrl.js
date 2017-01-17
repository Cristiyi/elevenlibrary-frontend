var userApp = angular.module('userApp', ['ngMessages', 'serviceApp']);

userApp.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', '$timeout', '$cookies', 'UserService', function($scope, $rootScope, $http, $location, $timeout, $cookies, UserService) {
  $scope.user = {};
  $scope.submitted = false;
  $scope.initState = function initState() {
    $scope.pwdError = false;
    $scope.userError = false;
    $scope.serverError = false;
    $scope.loginForm.submitted = false;
  };


  $scope.login = function() {
    $scope.initState();
    if ($scope.loginForm.$valid) {
      $('#loginBtn').button('loading');
      var user = {
        'intrID': $scope.user.intrID,
        'pwd': $scope.user.pwd
      };
      UserService.userLogin(user)
        .success(function(res) {
          console.log('[userLogin]res', res);
          if (res.errType === 0) {
            $('#loginBtn').button('reset');
            $location.path($rootScope.fromStage);

            $rootScope.logInUser.name = res.name;
            $rootScope.logInUser.phoneNum = res.phoneNum;
            $rootScope.logInUser.intrID = user.intrID;
            $rootScope.logInUser.agreed = res.agreed;

            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);
            $cookies.putObject('user', {
              intrID: $rootScope.logInUser.intrID,
              name: $rootScope.logInUser.name,
              phoneNum: $rootScope.logInUser.phoneNum,
              agreed: $rootScope.logInUser.agreed,
            }, {
              'expires': expireDate
            });

          } else if (res.errType === 1 || res.errType === 2) {
            $('#loginBtn').button('reset');
            $scope.pwdError = true;
            $timeout($scope.initState, 3000);
          } else {
            $('#loginBtn').button('reset');
            $scope.serverError = true;
            $timeout($scope.initState, 3000);
          };
        })
        .error(function(res) {
          $('#loginBtn').button('reset');
          $scope.serverError = true;
          $timeout($scope.initState, 3000);
        });
    } else {
      $('#loginBtn').button('reset');
      $scope.loginForm.submitted = true;
      $timeout($scope.initState, 3000);
    };
  };
}]);


/* Admin log in*/
userApp.controller('AdminLoginCtrl', ['$scope', '$http', '$location', '$timeout', 'UserService', function($scope, $http, $location, $timeout, UserService) {
  $scope.user = {};
  $scope.submitted = false;
  $scope.initState = function initState() {
    $scope.adminemailError = false;
    $scope.adminloginError = false;
    $scope.serverError = false;
  }

  $scope.login = function() {
    $scope.initState();
    if ($scope.loginForm.$valid) {
      $('#adminLoginBtn').button('loading');
      var user = {
        'intrID': $scope.user.intrID,
        'pwd': $scope.user.pwd
      };
      UserService.adminLogin(user)
        .success(function(res) {
          if (res.errType === 0) {
            $location.path('/manage/books');
          } else if (res.errType === 1) {
            $scope.adminemailError = true;
            $timeout($scope.initState, 3000);
          } else {
            $scope.adminloginError = true;
            $timeout($scope.adminloginError, 3000);
          };
          $('#adminLoginBtn').button('reset');
        })
        .error(function(res) {
          $('#adminLoginBtn').button('reset');
          $scope.serverError = true;
          $timeout($scope.initState, 3000);
          console.log('Error: ' + res);
        });
    };
  };
}]);

userApp.controller('UserHomeCtrl', ['$scope', '$rootScope', '$timeout', 'BooksService', function($scope, $rootScope, $timeout, BooksService) {
  $scope.books = [];
  $scope.likedBooks = [];
  $scope.borrowedBooks = [];
  $scope.sharedBooks = [];
  BooksService.getAllBooks()
    .success(function(res) {
      BooksService.books = [];
      for (var i = 0; i < res.length; i++) {
        res[i].image = res[i].image ? res[i].image : "images/gray.jpg";
        res[i].isLiked = false;
        if (res[i].ownerIntrID === $rootScope.logInUser.intrID){
          $scope.sharedBooks.push(res[i]);
        };
        if (res[i].intrID === $rootScope.logInUser.intrID) {
          $scope.borrowedBooks.push(res[i]);
        };
        for (var j = 0; j < res[i].likes.length; j++) {
          if (res[i].likes[j] === $rootScope.logInUser.intrID) {
            res[i].isLiked = true;
            $scope.likedBooks.push(res[i]);
            break;
          };
        };
        BooksService.books.push(res[i]);
      };
    });
}]);
