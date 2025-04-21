
var app = angular.module("embibeApp", ['ngSanitize']); 
app.controller("appCtrl", function($scope,$window) {

        $window.setActive = function(active) {
            document.title = active;
        }

        $window.loadData = function()
        {
            $scope.showData = false;
             var ques_num = window.CommonAndroidAPI.getQuestionNumber();
             $scope.question_index = ['A','B','C','D','E','F'];
             $scope.isCorrect = true;

             $scope.test_section = window.CommonAndroidAPI.getSectionName();
             $scope.question = JSON.parse(window.CommonAndroidAPI.getQuestion());
             $scope.locale = window.CommonAndroidAPI.getLocale();
             $scope.explanation = "Explanation"
             $scope.correct = "Correct Answer"
             $scope.your_answer = "Your Answer"
             $scope.qtype = $scope.question.category;
             $scope.keyconcepts = "Key Concepts"
             $scope.showConcepts = window.CommonAndroidAPI.showConcept();
             var questionIndexString = "Q."

             if($scope.locale == "hi"){
                $scope.explanation = "प्रश्न का हल"
                $scope.correct = "सही उत्तर"
                $scope.your_answer = "आपका उत्तर"
                $scope.keyconcepts = "मुख्य कांसेप्ट"
                questionIndexString = "प्र."

                if($scope.qtype == "Single Choice"){
                    $scope.qtype = "एकल विकल्पी"
                }else if($scope.qtype == "Subjective Numerical"){
                    $scope.qtype = "विषयपरक आंकिक"
                }else if($scope.qtype == "Integer"){
                    $scope.qtype = "पूर्णांक"
                }
             }

            $scope.ques_no = questionIndexString + ques_num.toString();

            var selectedAnswer = "";
            if($scope.question.category == "Matrix")
            {
              var f_ans;
              for (var i = 0; i < $scope.question.answers.length; i++) {
                  if ($scope.question.answers[i].correct == true) {
                     f_ans = $scope.question.answers[i].body;
                     break;
                  }
              }

              $scope.answer_options = eval(f_ans.split(";;")[0]);
              $scope.correct_answers = f_ans.split(";;")[1];
              $scope.matrix_header_top = $scope.answer_options[1];
              $scope.matrix_header_left = $scope.answer_options[0];
              selectedAnswer = window.CommonAndroidAPI.getAnswer().split(";;")[1];
            } else {
              selectedAnswer = window.CommonAndroidAPI.getAnswer();
            }

             $scope.quesType = $scope.question.category;
             $scope.question_code = $scope.question.question_code;

             $scope.ques_concepts = JSON.parse(window.CommonAndroidAPI.getConcept());

             if($scope.quesType != "Integer" && $scope.quesType != "Subjective Numerical" &&
             	$scope.quesType != "Matrix")
             {
	             	if(selectedAnswer)
	             	{
		             	 for(var i=0;i<$scope.question['answers'].length;i++)
			             {
			                if(selectedAnswer.indexOf($scope.question['answers'][i]['code']) > -1) {
			                    $scope.question['answers'][i]['selected'] = true;
			                }
			                else {
			                    $scope.question['answers'][i]['selected'] = false;
			                }
			             }
	             	}
             }

             else if($scope.quesType == "Integer" || $scope.quesType == "Subjective Numerical")
             {
             		if(selectedAnswer)
             		{
             			if($scope.quesType == "Integer" ) {
                            $scope.integer_input = Number(selectedAnswer);
                            if(selectedAnswer == $scope.question['answers'][0].body)
                            {
                                $scope.question['answers'][0]['selected'] = true;
                                $scope.question['answers'][0]['correct'] = true;
                                $scope.isCorrect = true;
                            }
                            else
                            {
                                $scope.question['answers'][0]['selected'] = true;
                                $scope.question['answers'][0]['correct'] = false;
                                $scope.isCorrect = false;
                            }
	             		} else {
                            $scope.integer_input = Number(selectedAnswer);

                            var correctAnswer = $scope.question['answers'][0].body;
                            var selectedAnswerFloat = parseFloat(selectedAnswer);
                            var correctAnswerFloat = parseFloat(correctAnswer);
                            var tokens =correctAnswer.split(".");

                            if(tokens.length >1 && tokens[1].length> 2){
                                correctAnswerFloat =parseFloat(correctAnswerFloat.toFixed(2));
                                var correctAnswerFloatDelta = correctAnswerFloat +parseFloat( 0.01);
                                if (selectedAnswerFloat >= correctAnswerFloat && selectedAnswerFloat <= correctAnswerFloatDelta) {
                                    $scope.isCorrect = true;
                                }
                            } else if(selectedAnswerFloat == correctAnswerFloat){
                                $scope.question['answers'][0]['selected'] = true;
                                $scope.question['answers'][0]['correct'] = true;
                                $scope.isCorrect = true;
                            } else {
                                $scope.question['answers'][0]['selected'] = true;
                                $scope.question['answers'][0]['correct'] = false;
                                $scope.isCorrect = false;
                            }
	             		}
             		}
             		else
             		{
             			$scope.integer_input = '';
             			$scope.question['answers'][0]['selected'] = false;
             			$scope.isCorrect = false;
             		}
             }
             else if($scope.quesType == "Matrix")
             {
             		if(selectedAnswer)
             		{
	             		if(selectedAnswer.indexOf($scope.correct_answers) > -1)
	             		{
	             			$scope.showIncorrectMatrix = false;
	             		}
	             		else
	             		{
	             			$scope.showIncorrectMatrix = true;
	             			$scope.matrixSelectedAns = selectedAnswer;
	             		}
             		}
             		else
             		{
             				$scope.showIncorrectMatrix = false;
             		}
             }

             setTimeout(function () {
             MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
             });

            $scope.showData = true;

			      $scope.$apply();
        }

        $scope.extractParagraphFromComprehension = function(string)
        {
          var splittedArray = string.split('<br />\r\n<br />');
          if(splittedArray.length > 1){
            splittedArray.pop();
          }
          return splittedArray.join('<br />\r\n<br />');
        }

        $scope.extractQuestionForLinkComprehension = function(string){
          var splittedArray = string.split('<br />\r\n<br />');
          if(splittedArray.length == 1){
            return '';
          }
          if(1){
            return "<strong>Question :</strong>" +  splittedArray[splittedArray.length-1];
          }
          else{
            return splittedArray[splittedArray.length-1]
          }
        }

        $scope.isMatrixAnswerChecked = function(header,header2)
        {
            if($scope.question.category == "Matrix")
            {  
                var qcode = $scope.question.question_code;
                var corrAns = $scope.correct_answers;
        
                if(corrAns)
                {
                  var corrAnsArr = corrAns.split(";");
                  corrAnsArr.pop();
                  var correctAnswers = [];
                  for (var i in corrAnsArr)
                  {
                      var key_val = corrAnsArr[i].split("-")
                      var key = key_val[0];
                      var value = key_val[1];
                      var valArr = value.split(",");
                      for(var value in valArr)
                      {
                        correctAnswers.push(qcode+'-'+key+ "-" +valArr[value]);
                      }
                  }
                  if(correctAnswers.indexOf(qcode+'-'+header+"-"+header2) > -1)
                  {
                    return true;
                  }
                  return false;
                }
                else return false;
            }
            else 
            {
              return false;
            } 
        }
        $scope.MatrixAnswerSelected = function(header,header2)
        {
        	  if($scope.question.category == "Matrix")
            {  
                var qcode = $scope.question.question_code;
                var corrAns = $scope.matrixSelectedAns;
        
                if(corrAns)
                {
                  var corrAnsArr = corrAns.split(";");
                  corrAnsArr.pop();
                  var correctAnswers = [];
                  for (var i in corrAnsArr)
                  {
                      var key_val = corrAnsArr[i].split("-")
                      var key = key_val[0];
                      var value = key_val[1];
                      var valArr = value.split(",");
                      for(var value in valArr)
                      {
                        correctAnswers.push(qcode+'-'+key+ "-" +valArr[value]);
                      }
                  }
                  if(correctAnswers.indexOf(qcode+'-'+header+"-"+header2) > -1)
                  {
                    return true;
                  }
                  return false;
                }
                else return false;
            }
            else 
            {
              return false;
            } 
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
                		 if(html)
                		 {
												html = html.replace(/\{/g, " \{");
	                     	html = html.replace(/\{/g, " \{");
	                     	html = html.replace(/\{\{/g, " \{ \{");
	                     	html = html.replace(/\}\}/g, " \} \}");
	                     	html = html.replace(/\$\$([^$]+)\$\$/g, "<span mathjax-bind=\"$1\"></span>");
	                     	ele.html(html);
	                     	$compile(ele.contents())(scope);
                		 }
                });
        }
    };
});
