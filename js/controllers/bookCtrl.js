var bookApp = angular.module('bookApp', ['wu.masonry', 'infinite-scroll', 'serviceApp']);
bookApp.controller('MainBooksCtrl', ['$scope', '$state', '$rootScope', '$timeout', 'BooksService', function($scope, $state, $rootScope, $timeout, BooksService) {
  console.log('MainBooksCtrl Start');
  $scope.books = [];
  $scope.showScrollToTop = false;
  $scope.successMsg = '';
  $scope.errorMsg = '';
  $scope.timeout = null;
  $scope.showAvai = false;
  $scope.onlyAvai = false;

  var eachPageBooksCount = 10;

  $scope.$watch(function() {
    return $state.current.name;
  }, function() {
    if ($state.current.name == "main.all") {
      $scope.cate = '';
    } else if ($state.current.name == "main.frontend") {
      $scope.cate = 'Frontend';
    } else if ($state.current.name == "main.backend") {
      $scope.cate = 'Backend';
    } else if ($state.current.name == "main.database") {
      $scope.cate = 'Database';
    } else if ($state.current.name == "main.bigdata") {
      $scope.cate = 'Big Data';
    } else if ($state.current.name == "main.ios") {
      $scope.cate = 'IOS/Android';
    } else if ($state.current.name == "main.ui") {
      $scope.cate = 'UI Design';
    } else if ($state.current.name == "main.other") {
      $scope.cate = 'Other';
    } else if ($state.current.name == "main.res") {
      $scope.cate = 'Resource';
    } else if ($state.current.name == "main.shared") {
      $scope.cate = 'userShared';
    } else if ($state.current.name == "main.liked") {
      $scope.cate = 'userLiked';
    } else if ($state.current.name == "main.borrowed") {
      $scope.cate = 'userBorrowed';
    };
  });

  $scope.showErrorMsg = function(errorMsg) {
    $timeout.cancel($scope.timeout);
    $scope.successMsg = '';
    $scope.errorMsg = errorMsg;
    $scope.timeout = $timeout(function() {
      $scope.errorMsg = '';
    }, 3000);
  };

  $scope.showSuccessMsg = function(successMsg) {
    $timeout.cancel($scope.timeout);
    $scope.errorMsg = '';
    $scope.successMsg = successMsg;
    $scope.timeout = $timeout(function() {
      $scope.successMsg = '';
    }, 3000);
  };

  $scope.$on(
    "$destroy",
    function(event) {
      $timeout.cancel($scope.timeout);
    }
  );


  $scope.showMoreBooks = function() {
    // var start = $scope.books.length;
    // var end = Math.min(start + 10, BooksService.books.length);
    // for (var i = start; i < end; i++) {
    //   $scope.books.push(BooksService.books[i]);
    // };
    // if (start >= eachPageBooksCount * 2) {
    //   $scope.showScrollToTop = true;
    // };
  };

  $scope.update = function() {
    $scope.books = [];
    $scope.showScrollToTop = false;
    $scope.showAvai = false;

    BooksService.getAllBooks()
      .success(function(res) {
        var intrID = $rootScope.logInUser.intrID;
        var total = 0;
        for (var i = 0; i < res.length; i++) {
          for (var k = 0; k < res[i].likes.length; k++) {
            if (res[i].likes[k] === intrID) {
              res[i].isLiked = true;
              break;
            };
          };
          total = 0;
          for (var k = 0; k < res[i].rates.length; k++) {
            total += res[i].rates[k].value;
            if (res[i].rates[k].intrID === intrID) {
              res[i].isRated = true;
              res[i].rateValue = res[i].rates[k].value;
            };
          };
          res[i].avaValue = res[i].rates.length == 0 ? 0 : parseFloat(total / res[i].rates.length).toFixed(1);
          res[i].image = res[i].image ? res[i].image : "images/gray.jpg";
          $scope.books.push(res[i]);
        };
        $scope.showAvai = true;
        $scope.$broadcast('getAllDataEvent');
      });
  };
}]);

bookApp.controller('AllBooksCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'BooksService', function($scope, $rootScope, $state, $timeout, BooksService) {
  console.log('AllBooksCtrl Start');
  $scope.update();
  var timeout;
  $scope.like = function(book) {
    book.isLiked = !book.isLiked;
    if (timeout) $timeout.cancel(timeout);
    timeout = $timeout(function() {
      BooksService.likeBook(book._id, $rootScope.logInUser.intrID, book.isLiked).success(function(res) {
        book.likes = res;
        for (var i = 0; i < book.likes.length; i++) {
          if (book.likes[i] === $rootScope.logInUser.intrID) {
            book.isLiked = true;
            break;
          };
        };
      });
    }, 500);
  };
}]);

bookApp.controller('DetailBookCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$location', 'BooksService', '$window', function($scope, $rootScope, $timeout, $state, $location, BooksService, $window) {
  console.log('DetailBookCtrl Start');
  $scope.simBooks = [];
  $scope.tarValue = 0;
  $scope.content = '';
  $scope.index = -1;
  $scope.isBook = true;
  $scope.update();
  $scope.expireDate = new Date();

  $scope.contact = function(intrID) {
    up.services.sametime.chat(intrID);
  };


  $scope.$on('getAllDataEvent', function() {
    var i = 0;
    for (i = 0; i < $scope.books.length; i++) {
      if ($scope.books[i]._id == $state.params._id) {
        if ($scope.books[i].category === 'Resource') {
          $scope.isBook = false;
        } else {
          $scope.isBook = true;
        };
        $scope.index = i;
        console.log("Current Book:", $scope.books[i]);
        if ($scope.books[i].applyTime) {
          $scope.expireDate = new Date($scope.books[i].applyTime).setDate(new Date($scope.books[i].applyTime).getDate() + 2);
        };
        if ($scope.isBook) {
          BooksService.getSimilarBooks($state.params._id).success(function(res) {
            $scope.simBooks = res;
            $scope.showSimilarBooks = $scope.simBooks.length != 0 ? true : false;
          });

          BooksService.getPopularBooks().success(function(res) {
            $scope.popBooks = res;
          });
        };
        break;
      };
    };
    if (i >= $scope.books.length) {
      $location.path($rootScope.fromStage);
    }
  });

  $scope.borrow = function() {
    BooksService.borrrowBook($state.params._id, $rootScope.logInUser.intrID).success(function(res) {
      if (res.errType == 0) {
        $scope.books[$scope.index].intrID = $rootScope.logInUser.intrID;
        $scope.books[$scope.index].status = 1;
        $scope.books[$scope.index].applyTime = res.applyTime;
        $scope.showMsg = true;
        if ($scope.books[$scope.index].applyTime) {
          $scope.expireDate = $scope.books[$scope.index].applyTime;
          $scope.expireDate.setDate($scope.books[$scope.index].applyTime.getDate() + 2);
        };
      } else if (res.errType == 1) {
        $('#warningModal').modal('show');
      } else if (res.errType == 2) {
        $('#noneModal').modal('show');
      } else if (res.errType == 3) {
        $('#errorModal').modal('show');
      };
    }).error(function(res) {
      console.log(res, "BorrowBook");
    });
  };

  $scope.cancel = function() {
    $timeout(function() {
      BooksService.cancelBook($state.params._id, $rootScope.logInUser.intrID).success(function(res) {
        delete $scope.books[$scope.index].intrID;
        $scope.books[$scope.index].status = 0;
      }).error(function(res) {
        console.log("cancelBook error");
      });
    }, 200);
  };

  var timeout;
  $scope.like = function() {
    $scope.books[$scope.index].isLiked = !$scope.books[$scope.index].isLiked;
    if (timeout) $timeout.cancel(timeout);
    timeout = $timeout(function() {
      BooksService.likeBook($scope.books[$scope.index]._id, $rootScope.logInUser.intrID, $scope.books[$scope.index].isLiked).success(function(res) {
        $scope.books[$scope.index].likes = res;
      });
    }, 500);
  };

  $scope.rate = function(value) {
    $scope.books[$scope.index].rateValue = value;
    BooksService.rateBook($scope.books[$scope.index]._id, $rootScope.logInUser.intrID, value).success(function(res) {
      $scope.books[$scope.index].rates = res;
      var total = 0;
      for (var i = 0; i < $scope.books[$scope.index].rates.length; i++) {
        total += $scope.books[$scope.index].rates[i].value;
        if ($scope.books[$scope.index].rates[i].intrID === $rootScope.logInUser.intrID) {
          $scope.books[$scope.index].isRated = true;
          $scope.books[$scope.index].rateValue = $scope.books[$scope.index].rates[i].value;
        };
      };
      $scope.books[$scope.index].avaValue = $scope.books[$scope.index].rates.length == 0 ? 0 : parseFloat(total / $scope.books[$scope.index].rates.length).toFixed(1);
    });
  };

  $scope.comment = function() {
    if ($scope.content.length != 0) {
      BooksService.commentBook($scope.books[$scope.index]._id, $rootScope.logInUser.intrID, $scope.content).success(function(res) {
        $scope.books[$scope.index].comments = res;
        $scope.content = '';
      });
    };
  };

  $scope.deleteComment = function(commentID) {
    BooksService.deleteComment($scope.books[$scope.index]._id, commentID).success(function(res) {
      $scope.books[$scope.index].comments = res;
    }).error(function(res) {
      console.error("deleteComment error", res);
    });
  };

  $scope.deliver = function() {
    BooksService.deliverBook($scope.books[$scope.index]._id).success(function(res) {
      if (res.errType == 0) {
        $scope.books[$scope.index].status = 2;
        $scope.books[$scope.index].borrowTime = res.borrowTime;
        $scope.books[$scope.index].returnTime = res.returnTime;
      };
    }).error(function(res) {
      console.error(res);
    });
  };

  $scope.return = function() {
    BooksService.returnBook($scope.books[$scope.index]._id).success(function(res) {
      if (res.errType == 0) {
        $scope.books[$scope.index].status = 0;
        $scope.books[$scope.index].intrID = '';
        $scope.books[$scope.index].applyTime = null;
        $scope.books[$scope.index].borrowTime = null;
        $scope.books[$scope.index].returnTime = null;
      };
    }).error(function(res) {
      console.error(res);
    })
  };
}]);

bookApp.controller('CreateMyBookCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$location', 'BooksService', '$window', function($scope, $rootScope, $timeout, $state, $location, BooksService, $window) {
  $('#shareTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
  });
  $scope.isDone = false;

  $scope.myBook = {
    'ownerIntrID': $rootScope.logInUser.intrID,
    'ownerName': $rootScope.logInUser.name,
    'ownerPhoneNum': $rootScope.logInUser.phoneNum,
    'confirmed': false,
    'category': 'Frontend'
  };
  $scope.myRes = {
    'ownerIntrID': $rootScope.logInUser.intrID,
    'ownerName': $rootScope.logInUser.name,
    'ownerPhoneNum': $rootScope.logInUser.phoneNum,
    'confirmed': false,
    'category': 'Resource'
  };

  $scope.getDouban = function() {
    BooksService.getDoubanCall($scope.myBook, function() {
      $scope.isDone = true;
      console.log($scope.myBook);
    }, function() {
      $scope.isDone = true;
    });
  };
  $scope.createMyBook = function() {
    $('#createNewBookButton').button('loading');
    BooksService.createBook($scope.myBook).success(function(res) {
      if (res.errType == 0) {
        $scope.myBook._id = res._id;
        $scope.books.push($scope.myBook);
        $scope.showSuccessMsg("Success to add the book: " + $scope.myBook.name);
        $('#createNewBookButton').button('reset');
        $location.path('/book/' + $scope.myBook._id);
      }
    }).error(function(res) {
      $('#createNewBookButton').button('reset');
      $scope.showErrorMsg("Fail to add the book: " + $scope.myBook.name);
    });
  };

  $scope.createMyRes = function() {
    $('#createNewResButton').button('loading');
    BooksService.createBook($scope.myRes).success(function(res) {
      if (res.errType == 0) {
        $scope.myRes._id = res._id;
        $scope.books.push($scope.myRes);
        $scope.showSuccessMsg("Success to add the Resource: " + $scope.myRes.name);
        $('#createNewResButton').button('reset');
        $location.path('/book/' + $scope.myRes._id);
      }
    }).error(function(res) {
      $('#createNewResButton').button('reset');
      $scope.showErrorMsg("Fail to add the Resource: " + $scope.myRes.name);
    });
  };
}]);

bookApp.controller('EditMyBookCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$location', 'BooksService', '$window', function($scope, $rootScope, $timeout, $state, $location, BooksService, $window) {
  $scope.myBook = {};
  $scope.index = -1;
  $scope.ifDelete = false;
  $scope.isBook = true;
  $scope.update();
  $scope.$on('getAllDataEvent', function() {
    var i = 0;
    for (i = 0; i < $scope.books.length; i++) {
      if ($scope.books[i]._id == $state.params._id) {
        if ($scope.books[i].ownerIntrID != $rootScope.logInUser.intrID) {
          $location.path('/book/' + $scope.books[i]._id);
          break;
        };
        if ($scope.myBook.category == 'Resource') {
          $scope.isBook = false;
        } else {
          $scope.isBook = true;
        };
        $scope.index = i;
        $scope.myBook = {
          _id: $scope.books[$scope.index]._id,
          isbn: $scope.books[$scope.index].isbn,
          name: $scope.books[$scope.index].name,
          category: $scope.books[$scope.index].category,
          image: $scope.books[$scope.index].image,
          author: $scope.books[$scope.index].author,
          publisher: $scope.books[$scope.index].publisher,
          pageCount: $scope.books[$scope.index].pageCount,
          price: $scope.books[$scope.index].price,
          desc: $scope.books[$scope.index].desc,
          ownerIntrID: $scope.books[$scope.index].ownerIntrID,
          ownerName: $scope.books[$scope.index].ownerName,
          ownerPhoneNum: $scope.books[$scope.index].ownerPhoneNum,
          confirmed: false
        };
        break;
      };
    };
    if (i >= $scope.books.length) {
      $location.path('/books/all');
    }
  });

  $scope.getDouban = function() {
    BooksService.getDouban($scope.books[$scope.index]);
  };
  $scope.saveMyBook = function() {
    $('#saveMyBookButton').button('loading');
    BooksService.editBook($scope.myBook).success(function(res) {
      $scope.books[$scope.index].isbn = $scope.myBook.isbn;
      $scope.books[$scope.index].name = $scope.myBook.name;
      $scope.books[$scope.index].category = $scope.myBook.category;
      $scope.books[$scope.index].image = $scope.myBook.image;
      $scope.books[$scope.index].author = $scope.myBook.author;
      $scope.books[$scope.index].publisher = $scope.myBook.publisher;
      $scope.books[$scope.index].pageCount = $scope.myBook.pageCount;
      $scope.books[$scope.index].price = $scope.myBook.price;
      $scope.books[$scope.index].desc = $scope.myBook.desc;
      $scope.books[$scope.index].confirmed = false;
      $('#saveMyBookButton').button('reset');
      $scope.showSuccessMsg("Success to save the book: " + $scope.myBook.name);
      $location.path('/book/' + $scope.myBook._id);
    }).error(function(res) {
      $('#saveMyBookButton').button('reset');
      $scope.showErrorMsg("Fail to save the book: " + $scope.myBook.name);
    });
  };

  $('#deleteMyBookModal').on('hidden.bs.modal', function(e) {
    if ($scope.ifDelete) {
      BooksService.deleteBook($scope.myBook._id).success(function(res) {
        $scope.books.splice($scope.$index, 1);
        $timeout(function() {
          $location.path('/books/all');
          $scope.showSuccessMsg("Success to delete the book: " + $scope.myBook.name);
        }, 300);
      }).error(function(res) {
        $scope.showErrorMsg("Fail to delete the book: " + $scope.myBook.name);
      });
    }
  });
}]);
