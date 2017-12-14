    $(function () {
                gcorrect = 0;
                incorrect = 0;
                timeout = 0;
                seconds = 30;
                currentanswer = "";
                questions = null;
                url = "assets/";
				
				var loc = window.location.pathname;
				var dir = loc.substring(0, loc.lastIndexOf('/'));
				console.log(dir);
                 // Set the global configs to synchronous 
                $.ajaxSetup({
                    async: false
                });
                $.getJSON(url + "questions.json", {
                    format: "json"
                }).done(function (data) {
                    questions = data;
                });


                timer = setInterval(
                        function () {

                        }, 10);

                function stoptimer() {
                    window.clearInterval(timer);
                }

                function starttimer() {
                    seconds = 30;
                    window.clearInterval(timer);
                    $("#seconds").html(seconds);
                    timer = setInterval(function () {
                        seconds--;
                        if (seconds < 1) {
                            timeup();
                            window.clearInterval(timer);
                        }
                        $("#seconds").html(seconds);
                    }, 1000);
                }

                function timeup() {
                    timeout++;
                    var audio = new Audio(url + 'audio/incorrect.mp3');
                    audio.play();
                    $("#result").html("");
                    $("#result").append("<p>The Correct Answer Was: " + currentanswer + "</p>");
                    $("#seconds").html(0);
                    $(".container").css("display", "none");
                    $("#result-container").css("display", "block");
                    $("#timeup").css("display", "block");
                    newRoundSetup();
                }

                function arng(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }


                function questionPopulate() {
                    var keys = Object.keys(questions);

                    var rng = arng(0, keys.length - 1);

                    var key = keys[rng];

                    var question = questions[key];

                    delete questions[key];

                    var answers = question.answers;
                    var image = question.image;
                    var correctanswer = question.answer;
                    currentanswer = correctanswer;
                    $("#img-container").html("<img src='" + image + "'/>");
                    $("#question").html("<h2>" + key + "</h2>");
                    $("#answers").html("");
                    for (var index in answers) {
                        var correct = answers[index];
                        $("#answers").append("<div class='answer' data-correctanswer='" + correctanswer + "' data-correct='" + correct + "'>" + index + "</div>");
                    }


                }

                function newRoundSetup() {
                    var keys = Object.keys(questions);
                    console.log(keys);
                    if (keys.length > 5) {
                        setTimeout(function () {
                            $("#timeup").css("display", "none");
                            questionPopulate();
                            $(".container").css("display", "none");
                            $("#time").css("display", "block");
                            $("#question-container").css("display", "block");
                            starttimer();
                        }, 3000
                                );
                    } else {
                        $(".container").css("display", "none");
                        $("#time").css("display", "none");
                        $("#correct").html(gcorrect);
                        $("#incorrect").html(incorrect);
                        $("#unanswered").html(timeout);
                        $("#status-container").css("display", "block");
                    }
                }


                $("#start-over").click(function () {
                    gcorrect = 0;
                    incorrect = 0;
                    timeout = 0;
                    // Set the global configs to synchronous 
                    $.ajaxSetup({
                        async: false
                    });
                    $.getJSON(url + "questions.json", {
                        format: "json"
                    }).done(function (data) {
                        questions = data;
                    });

                    questionPopulate();
                    $(".container").css("display", "none");
                    $("#time").css("display", "block");
                    $("#question-container").css("display", "block");
                    starttimer();
                });

                $("#start").click(function () {
                    questionPopulate();
                    $(".container").css("display", "none");
                    $("#time").css("display", "block");
                    $("#question-container").css("display", "block");
                    starttimer();
                });

                $(document).on('click', '.answer', function () { // bind event to dynamic elements
                    stoptimer();
                    $("#result").html("");
                    var correct = $(this).attr("data-correct");
                    var correctanswer = $(this).attr("data-correctanswer");
                    if (correct == "1") {
                        var audio = new Audio(url + 'audio/correct.mp3');
                        audio.play();
                        gcorrect++;
                        $("#result").append("<h3>Correct!</h3>");
                    }
                    if (correct == "0") {
                        var audio = new Audio(url + 'audio/incorrect.mp3');
                        audio.play();
                        incorrect++;
                        $("#result").append("<h3>Nope!</h3>");
                        $("#result").append("<p>The Correct Answer Was: " + correctanswer + "</p>");

                    }
                    $(".container").css("display", "none");
                    $("#result-container").css("display", "block");
                    newRoundSetup();
                });



            });
