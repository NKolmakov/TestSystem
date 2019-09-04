var questNumber = 0;
// on window load remove comments
$('*').contents().each(function() {
     if(this.nodeType === Node.COMMENT_NODE) {
       $(this).remove();
     }
});

//radios on form have different names but referred to one group
//for this purpose if radio clicked on one answer then turn off others in current question
$(function(){
    $(".question").on("click","input:radio",function(){
        var currentQuestion = $(this).closest(".question")[0];
        var currentRadio = $(this);
        var radios = $(currentQuestion).find("input:radio");
        
        for(var i = 0; i < radios.length; i++){
            $(radios[i]).not(currentRadio).prop('checked', false);
        }

    })
});

//timer function starts when available element with class='timer'
    var initialTime = $('#initTime').val();
    var endOfTime = new Date().getTime() + parseInt(initialTime*60*1000);

    if(initialTime != null){
        var dt = new Date();
        var startTime = dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
        $(function(){
            sessionStorage.setItem("startTime",startTime);
        });
        var timing = setInterval(function () {

            var currentDate = new Date().getTime();
            var timeLeft = endOfTime - currentDate;

            var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (hours < 10) hours="0"+hours;
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes < 10) minutes="0"+minutes;
            var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            if (seconds < 10) seconds="0"+seconds;

            var time = "";

            if(hours != "00") time+=hours+"h "
            if(minutes != "00") time+=minutes+"m "
            document.getElementById("time").innerHTML = time + seconds + "s";

            if (timeLeft <= 0) {
              var endTime = dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
              clearInterval(timing);
              alert("Time is over. Test will be send automatically");
              $("#passTest").append('<input hidden name="startTime" value="'+startTime+'">');
              $("#passTest").append('<input hidden name="endTime" value="'+endTime+'">');
              $('#passTest').submit();
            }
        }, 1000);
    }

    $(function(){
        $("#passingTest").on("submit",{'startTime':startTime})
    });

/*$(window).load(function(){
    var timer = $('.timer');

    if(timer != null){
        var minutes = $($(timer).find(":header[id*='time']")[0]).val();
        var hours = minutes / 60;
        minutes = minutes % 60;        
        var seconds = 00;
        timer.innerHTML = 
    }
});*/
var questionPlaceholder = document.getElementById("form.placeholder.question").value;
var answerPlaceholder = document.getElementById("form.placeholder.answer").value;
var questionNumber = document.getElementById("form.label.questionNumber").value;
var addAnswer = document.getElementById("form.button.addAnswer").value;

function createQuestion() {
    var parentObject = $(".questionBlock")[0];
    var questions = $(parentObject).find("div[id^='question#']");
    var questionLength = questions.length;

    if (questionLength == null) {
        questionLength = 0;
    }

    $(parentObject)
        .prepend($('<div id="question#' + questionLength + '" class="question"></div>')
            .prepend($('<h4 class="questionHeader col-lg-6">' + questionNumber + (questionLength + 1) + '</h4>'))
            .append($('<button class="removeQuestion"> - </button>'))
            .append($('<textarea name="questions[' + questionLength + '].name" class="questionName"' +
                'placeholder="' + questionPlaceholder + '"' +
                'maxlength="255" required' +
                '</textarea>'))
            .append($('<button class="createAnswer" type="button">' + addAnswer + '</button>'))
            .append($('<div id="answer#0" class="answers"</div>')
                .append($('<input name="questions[' + questionLength + '].answers[0].right" type="checkbox">'))
                .append($('<input name="questions[' + questionLength + '].answers[0].name" type="text"' +
                    'placeholder="' + answerPlaceholder + '" maxlength="255" required><br>'))
            )
        );
}

function removeQuestion(question) {
    $(question).remove();
    var questions = $($(".questionBlock")[0]).find("div[id^='question#']");
    updateQuestions(questions);
}

function updateQuestions(questions) {
    if (questions != null) {
        for (var i = 0; i < questions.length; i++) {
            var currentQuestionNumber = questions.length - i - 1;
            questions[i].id = "question#" + currentQuestionNumber;
            var answers = $(questions[i]).find("div[id^='answer#']");
            var questHeader = $(questions[i]).find(":header[class*='questionHeader']")[0];
            var textarea = $(questions[i]).find("textarea[class*='questionName']")[0];

            questHeader.innerHTML = questionNumber+parseInt(currentQuestionNumber+1,10);
            textarea.setAttribute('name','questions['+currentQuestionNumber+'].name')
            updateAnswers(answers);
        }
    }
}
    function createAnswer(question) {
        var questNumber = $(question).attr('id').replace("question#", "");
        var answers = $(question).find("div[id^='answer#']");
        var answerLength = answers.length;
        if (answerLength == null) {
            answerLength = 0;
        }

          $((answers)[answerLength -1])
            .after($('<div id="answer#' + answerLength + '" class="answers"></div>')
                .append($('<input name="questions[' + questNumber + '].answers[' + answerLength + '].right" type="checkbox">'))
                .append($('<input name="questions[' + questNumber + '].answers[' + answerLength + '].name" type="text"' +
                    'placeholder="' + answerPlaceholder + '" maxlength="255" required>'))
                .append($('<button class="removeAnswer" type="button"> - </button><br>'))
            )
    }

    function removeAnswer(answer) {
        var currentQuestion = $(answer).closest(".question")[0];
        $(answer).remove();

        var currentQuestionNumber = $(currentQuestion).attr('id').replace("question#", "");
        var answers = $(currentQuestion).find("div[id^='answer#']");

        updateAnswers(answers);
    }

    function updateAnswers(answers) {
        if (answers.length != null) {
            for (var i = 0; i < answers.length; i++) {
                var answerNum = answers.length - i - 1;
                var currentQuestionNumber = $($(answers[i]).closest(".question")[0]).attr('id').replace("question#","");
                var inputCheckBox = $(answers[i]).find("input:checkbox")[0];
                var inputs = $(answers[i]).find("input:text");
                var newCheckbox = $(inputCheckBox).clone()[0];
                answers[i].id = "answer#" + answerNum;

                newCheckbox.setAttribute('name','questions[' + currentQuestionNumber + '].answers[' + answerNum + '].right');
                newCheckbox.setAttribute('value',$(inputCheckBox).val());

                var newInputText;
                var answerId;
                var newAnswerId;
                
                //answer has id if input text length > 1
                if(inputs.length > 1){
                    var answerId = inputs[0];
                    var inputText = inputs[1];
                    var newAnswerId = $(answerId).clone()[0];
                    var newInputText = $(inputText).clone()[0];

                }else{                    
                    var inputText = inputs[0];                    
                    var newInputText = $(inputText).clone()[0];
                }

                if(answerId != null){
                    newAnswerId.setAttribute('name','questions['+currentQuestionNumber+'].answers['+answerNum+'].id');
                    newAnswerId.setAttribute('value',$(answerId).val());

                    answerId.parentNode.replaceChild(newAnswerId,answerId);
                }
                
                newInputText.setAttribute('name', 'questions[' + currentQuestionNumber + '].answers[' + answerNum + '].name');
                newInputText.setAttribute('value', $(inputText).val());
                
                inputCheckBox.parentNode.replaceChild(newCheckbox, inputCheckBox);
                inputText.parentNode.replaceChild(newInputText,inputText);
                
            }
        }
    }

    $(function () {
        $(".createQuestion").click(function () {
            createQuestion();
        })
    });

    $(function () {
        $(".questionBlock").on("click", ".createAnswer", function () {
            createAnswer($(this).closest(".question")[0]);
        })
    });

    $(function () {
        $(".questionBlock").on("click", ".removeAnswer", function () {
            removeAnswer($(this).closest(".answers")[0]);
        })
    });

    $(function(){
        $(".questionBlock").on("click",".removeQuestion",function(){
            removeQuestion($(this).closest(".question")[0]);
        })
    });

