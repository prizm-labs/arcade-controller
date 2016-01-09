angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$ionicModal) {

  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
        $scope.changeOriantationLandspace = function() {
            screen.lockOrientation('landscape');
        }

        $scope.changeOriantationPortrait = function() {
            screen.lockOrientation('portrait');
        }
    }

    var modalInitialized = false;

    function bootstrapInteractions() {
      var myElement = document.getElementById('myElement');

      // create a simple instance
      // by default, it only adds horizontal recognizers
      var mc = new Hammer(myElement);

      // let the pan gesture support all directions.
      // this will block the vertical scrolling on a touch-device while on the element
      mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

      // listen to events...
      mc.on("panleft panright panup pandown tap press", function(ev) {
          myElement.textContent = ev.type +" gesture detected.";
      });
    }

    $ionicModal.fromTemplateUrl('templates/controller-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      console.log('modal loaded');
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.shown', function() {
      // Execute action
      console.log("modal.show");

      if (!modalInitialized) {
        bootstrapInteractions();
      }
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
      console.log("modal.hidden");
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
      console.log("modal.removed");
    });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
