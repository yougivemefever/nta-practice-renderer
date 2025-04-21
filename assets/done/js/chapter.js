
var app = angular.module("embibeApp", ['ngSanitize']); 
app.controller("appCtrl", function($scope,$window) {

    $window.loadData = function()
    {
        $scope.showData = false;
        $scope.concepts = JSON.parse(window.CommonAndroidAPI.getChapterJson());
        $scope.chapterName = window.CommonAndroidAPI.getChapterName();

         setTimeout(function () {
         MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
         });

         $scope.showData = true;
         $scope.$apply();
    }
})

 app.directive("mathjaxBind", function() {
        return {
            restrict: "A",
            scope: {
                text: "@mathjaxBind"
            },
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.$watch('text', function(value) {
                    var $script = angular.element("<script type='math/tex; mode=" + ($attrs.mathjaxMode == undefined ? "inline" : $attrs.mathjaxMode) + "'>")
                        .html(value == undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]

        };
    })

app.directive('dynamicData', function($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, ele, attrs) {
            scope.$watch(attrs.dynamicData,
                function(html) {
                     html = html.replace(/\{/g, " \{");
                     html = html.replace(/\{/g, " \{");
                     html = html.replace(/\{\{/g, " \{ \{");
                     html = html.replace(/\}\}/g, " \} \}");
                     html = html.replace(/\$\$([^$]+)\$\$/g, "<span mathjax-bind=\"$1\"></span>");
                     ele.html(html);
                     $compile(ele.contents())(scope);
                });
        }
    };
});