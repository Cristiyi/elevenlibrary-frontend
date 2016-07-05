var serviceApp = angular.module('serviceApp', []);
var host = '';
if (window.location.hostname == 'localhost') {
  host = 'http://localhost:4000';
} else {
  host = 'http://9.115.24.133:4000';
};

serviceApp.factory('adminBooksService', ['$http', function($http) {
  var books = [];
  return {
    addBook: function(book, success, error) {
      $http.post(host + '/api/admin/books', book).success(success).error(error);
    },
    deleteOneBook: function(_id, success, error) {
      $http.delete(host + '/api/admin/books/' + _id).success(success).error(error);
    },
    setBook: function(book, success, error) {
      $http.put(host + '/api/admin/books/' + book._id, book).success(success).error(error);
    },
    approvalConfirmation: function(_id){
      return $http.put(host + '/api/admin/confirmations/' + _id);
    },
    getAllBooks: function(success, error) {
      $http.get(host + '/api/admin/books').success(success).error(error);
    },
    books: books
  };
}]);

serviceApp.factory('HistoriesService', ['$http', function($http) {
  var histories = [];
  return {
    getAllHistories: function(success, error) {
      $http.get(host + '/api/admin/histories').success(success).error(error);
    },
    histories: histories
  };
}]);

serviceApp.factory('BooksService', ['$http', function($http) {
  var books = [];
  return {
    getAllBooks: function() {
      return $http.get(host + '/api/user/books');
    },
    borrrowBook: function(_id, intrID) {
      return $http.put(host + '/api/user/books/borrow/' + _id, {
        intrID: intrID
      });
    },
    cancelBook: function(_id, intrID) {
      return $http.put(host + '/api/user/books/cancelBorrow/' + _id, {
        intrID: intrID
      });
    },
    createBook: function(book){
      return $http.post(host + '/api/user/books', book);
    },
    editBook: function(book){
      return $http.put(host + '/api/user/books/' + book._id, book);
    },
    deleteBook: function(_id){
      return $http.delete(host + '/api/user/books/' + _id);
    },
    deliverBook: function(_id){
      return $http.post(host + '/api/user/books/deliver/' + _id)
    },
    returnBook: function(_id){
      return $http.post(host + '/api/user/books/return/' + _id)
    },
    likeBook: function(_id, intrID, ifYou) {
      return $http.put(host + '/api/user/books/like/' + _id, {
        intrID: intrID,
        ifYou: ifYou
      });
    },
    rateBook: function(_id, intrID, value) {
      return $http.put(host + '/api/user/books/rate/' + _id, {
        intrID: intrID,
        value: value
      });
    },
    commentBook: function(_id, intrID, content) {
      return $http.put(host + '/api/user/books/comment/' + _id, {
        intrID: intrID,
        content: content
      });
    },
    deleteComment: function(_id, commentID) {
      return $http.delete(host + '/api/user/books/comment?_id=' + _id + '&commentID=' + commentID);
    },
    getSimilarBooks: function(_id) {
      return $http.get(host + '/api/user/books/similar/' + _id);
    },
    getDouban: function(book) {
      var iserror = true;
      $http.jsonp('http://api.douban.com/v2/book/isbn/' + book.isbn, {
        params: {
          'callback': 'MyCallback'
        }
      });
      window.MyCallback = function(data) {
        iserror = false;
        console.log("Complete book info:", data);
        book.name = data.title;
        book.image = data.images.large;
        book.author = data.author[0];
        book.publisher = data.publisher;
        book.pageCount = data.pages;
        book.price = data.price.replace(/[\u4e00-\u9fa5]/, '');
        book.desc = data.summary;
      };
    },
    getDoubanCall: function(book, success, error) {
      var iserror = true;
      $http.jsonp('http://api.douban.com/v2/book/isbn/' + book.isbn, {
        params: {
          'callback': 'MyCallback'
        }
      }).error(function(err){
        if (iserror){
          error();
        }
      });;
      window.MyCallback = function(data) {
        iserror = false;
        console.log("Complete book info:", data);
        book.name = data.title;
        book.image = data.images.large;
        book.author = data.author[0];
        book.publisher = data.publisher;
        book.pageCount = data.pages;
        book.price = data.price.replace(/[\u4e00-\u9fa5]/, '');
        book.desc = data.summary;
        success();
      };
    },
    books: books
  }
}]);

serviceApp.factory('UserService', ['$http', function($http) {
  return {
    userLogin: function(user) {
      return $http.post(host + '/api/login/user', user);
    },
    adminLogin: function(user) {
      return $http.post(host + '/api/login/admin', user);
    },
    userLogout: function() {
      return $http.post(host + '/api/logout/user');
    },
    adminLogout: function() {
      return $http.post(host + '/api/logout/admin');
    }
  }
}]);

serviceApp.factory('LogsService', ['$http', function($http) {
  var logs = [];
  return {
    getAllLogs: function() {
      return $http.get(host + '/api/admin/logs');
    },
    deleteLog: function(_id) {
      return $http.delete(host + '/api/admin/log/' + _id);
    },
    logs: logs
  }
}]);

serviceApp.constant('category', {
  'Frontend': '1',
  'Backend': '2',
  'Database': '3',
  'Big Data': '4',
  'IOS/Android': '5',
  'UI Design': '6',
  'Other': '7'
});
