var mainApp = angular.module('mainApp', [
  'ui.router',
  'bookApp',
  'ngCookies',
  'adminApp',
  'userApp',
  'serviceApp'
]);

mainApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/books/all');

  $stateProvider
    .state('main', {
      url: '',
      templateUrl: 'views/book/main.html',
      controller: 'MainBooksCtrl'
    })
    .state('main.all', {
      url: '/books/all',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.frontend', {
      url: '/books/frontend',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.backend', {
      url: '/books/backend',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.database', {
      url: '/books/database',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.bigdata', {
      url: '/books/bigdata',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.ios', {
      url: '/books/ios&android',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.ui', {
      url: '/books/ui',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.other', {
      url: '/books/other',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.res', {
      url: '/books/resource',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.shared', {
      url: '/books/shared',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.liked', {
      url: '/books/liked',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.borrowed', {
      url: '/books/borrowed',
      templateUrl: 'views/book/allbooks.html',
      controller: 'AllBooksCtrl'
    })
    .state('main.detail', {
      url: '/book/:_id',
      templateUrl: 'views/book/detailbook.html',
      controller: 'DetailBookCtrl'
    })
    .state('main.createMyBook', {
      url: '/myBook/new',
      templateUrl: 'views/user/createMyBook.html',
      controller: 'CreateMyBookCtrl'
    })
    .state('main.editMyBook', {
      url: '/myBook/:_id',
      templateUrl: 'views/user/editMyBook.html',
      controller: 'EditMyBookCtrl'
    })
    .state('main.home', {
      url: '/home',
      templateUrl: 'views/user/home.html',
      controller: 'UserHomeCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/user/login.html',
      controller: 'LoginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'views/user/register.html',
      controller: 'RegCtrl'
    })
    .state('manage', {
      url: '',
      templateUrl: 'views/admin/admin-main.html',
      controller: 'ManageCtrl'
    })
    .state('manage.books', {
      url: '/manage/books',
      templateUrl: 'views/admin/admin-books.html',
      controller: 'ManageBooksCtrl'
    })
    .state('manage.history', {
      url: '/manage/history',
      templateUrl: 'views/admin/admin-histories.html',
      controller: 'ManageHistoriesCtrl'
    })
    .state('manage.logs', {
      url: '/manage/logs',
      templateUrl: 'views/admin/admin-logs.html',
      controller: 'ManageLogsCtrl'
    })
    .state('manage.newBook', {
      url: '/manage/newBook',
      templateUrl: 'views/admin/admin-new.html',
      controller: 'NewBookCtrl'
    })
    .state('manage.detail', {
      url: '/manage/book/:_id',
      templateUrl: 'views/admin/admin-item.html',
      controller: 'ManageBookCtrl'
    })
    .state('adminLogin', {
      url: '/adminLogin',
      templateUrl: 'views/admin/adminlogin.html',
      controller: 'AdminLoginCtrl'
    });
});

mainApp.run(function($rootScope, $window, $cookies, $http, $location, UserService) {
  var user = $cookies.getObject('user');
  console.log('$cookies User=', user);

  $rootScope.logInUser = {
    'name': user ? user.name : '',
    'intrID': user ? user.intrID : '',
    'phoneNum': user ? user.phoneNum : '',
    'image': user ? 'http://faces.tap.ibm.com/imagesrv/' + user.intrID : '',
    'agreed': user ? user.agreed : false,
  };
  $rootScope.fromStage = "";
  $rootScope.agree = function() {
    UserService.userAgree($rootScope.logInUser).success(function(res) {
      $rootScope.logInUser.agreed = true;
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 7);
      $cookies.putObject('user', {
        intrID: $rootScope.logInUser.intrID,
        name: $rootScope.logInUser.name,
        phoneNum: $rootScope.logInUser.phoneNum,
        agreed: $rootScope.logInUser.agreed
      }, {
        'expires': expireDate
      });
    })
  };
  $rootScope.logOut = function() {
    UserService.userLogout().success(function(res) {
      $rootScope.logInUser = {};
      $cookies.remove('user');
      $cookies.remove('connect.sid');
    }).error(function(res) {
      console.log('Logout Failed!');
    });
  };

  angular.element(document).bind('scroll', function() {
    // console.log(window.pageYOffset);
    if (window.pageYOffset > 300) {
      $('#gotoTop').show();
    } else {
      $('#gotoTop').hide();
    }
  });

  $rootScope.gotoTop = function() {
    $("body").animate({ scrollTop: $("body").offset().top }, "slow");
  }

  $rootScope.goBack = function() {
    $location.path($rootScope.fromStage);
  };

  $rootScope.showTerms = function() {
    console.log('showTerms');
    $('#termModal').modal('show');
  }

  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if (current) {
      var newUrl = current.substr(current.indexOf('#') + 1);
      if (newUrl != '/login') {
        $rootScope.fromStage = newUrl;
      }
    };
  });

  $rootScope.adminLogOut = function() {
    UserService.adminLogout().success(function(res) {
      $location.path('/adminLogin');
    }).error(function(res) {
      console.log('Admin Logout Failed!');
    });
  };
});

mainApp.factory('authInterceptor', function($rootScope, $q, $window, $location) {
  return {
    responseError: function(rejection) {
      console.log('[ResponseError]Rejection:', rejection);
      if (rejection.status === 401 && rejection.data === 'User') {
        // handle the case where the user is not authenticated
        $rootScope.fromStage = $location.path();
        console.log('$location.path', $location.path());
        $location.path('/login');
      } else if (rejection.status === 401 && rejection.data === 'Admin') {
        $location.path('/adminLogin');
      } else if (rejection.status === 401 && rejection.data === 'NotAgreed') {
        $rootScope.showTerms();
      }
      return $q.reject(rejection);
    }
  };
});

mainApp.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.defaults.withCredentials = true;
});
