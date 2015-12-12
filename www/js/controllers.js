angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $http, $window) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.resData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.Resmodal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/tradeItems.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.trademodal = modal;
  });

  $scope.logout = function () {
    if(typeof window.sessionStorage.token === 'undefined'){
      return;
    }else{
      window.sessionStorage.removeItem('token')
        $state.go('app.browse')
    }
  }


  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Close trade modal
  $scope.closeTrade = function () {
    $scope.trademodal.hide();
  }
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.closeRegister = function () {
    $scope.Resmodal.hide()
  }
  $scope.register = function () {
    $scope.Resmodal.show()
  }

  $scope.loggedIn = function () {
    if(typeof window.sessionStorage.token === 'undefined'){
      return false
    }else{
      return true
    }
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Login Data Front:', $scope.loginData);

    $http.post('http://localhost:5000/auth/login',$scope.loginData).then(function (token) {
      console.log(token);
      window.sessionStorage.setItem("token", token.data);
      $state.go('app.browse')

    },function (err) {
      console.log(err);
    })

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.doRegister = function () {
    console.log("Register Data Front:", $scope.resData);
    $http.post('http://localhost:5000/auth/register', $scope.resData).then(function (data) {
      console.log(data);
      $scope.Resmodal.hide().then(function () {
        $scope.modal.show();
      })
    },function (err) {
      console.log(err);
    })
  }


  // start trade
  $scope.tradeItem = function (loginItem) {
    var tradePacket = {
      userToken: window.sessionStorage.token,
      loginTradeItem: loginItem,
      offeredTradeItem:$scope.offeredItem
    };

    $http.post('http://localhost:5000/transaction/mobile', tradePacket).then(function (resp) {
      console.log(resp);
    },function (err) {
      console.log(err);
    })

  }



})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


.controller('BrowseCtrl', function ($rootScope, $scope, $stateParams, $http, $window) {
  $http.get('http://localhost:5000/items').then(function (resp) {
    console.log(resp);
    $scope.tradeItems = resp.data.items
  }, function (err) {
      console.log(err);
  });

  $scope.trade = function (item) {
    $scope.trademodal.show();
    $rootScope.offeredItem = item;
    var user = window.sessionStorage.token;
    $http.post('http://localhost:5000/profile/mobile',{cookies:{token:user}}).then(function (resp) {
      console.log(resp);
      $rootScope.userItems = resp.data.items
      console.log('Rootscope items',$rootScope.userItems);
    },function (err) {
      console.log(err);
    })
  }




})

.controller('ProfileCtrl', function ($scope, $stateParams, $http, $window) {

  $scope.$on('$ionicView.enter', function(e) {

    var user = window.sessionStorage.token;
    $http.post('http://localhost:5000/profile/mobile',{cookies:{token:user}}).then(function (resp) {
      console.log(resp);
      $scope.userItems = resp.data.items
    },function (err) {
      console.log(err);
    })

  });
})
