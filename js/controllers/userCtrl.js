var userApp = angular.module('userApp', ['ngMessages', 'directApp', 'serviceApp']);

//this is used to parse the profile
function url_base64_decode(str) {
  var output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}

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
        .success(function(res, status, headers, config) {
          console.log('[userLogin]res', res);
          if (res.errType === 0) {
            $('#loginBtn').button('reset');
            $location.path($rootScope.fromStage);

            $rootScope.logInUser.name = res.name;
            $rootScope.logInUser.phoneNum = res.phoneNum;
            $rootScope.logInUser.image = res.image;
            $rootScope.logInUser.intrID = user.intrID;

            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);
            $cookies.putObject('user', {
              intrID: $scope.user.intrID,
              name: res.name,
              phoneNum: res.phoneNum,
              image: res.image
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
