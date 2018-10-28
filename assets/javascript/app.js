class game {
  constructor(){
    this.qst_ans_array = [
      {question: 'Which house did the sorting hat want to place Harry in initially?', options: ['Slytherin', 'Ravenclaw','Hufflepuff','Gryffindor',], answer:'Slytherin', topic: 'sorting hat'},
      {question: 'How many Horcruxes were there in total?', options: ['5','6','7','9','3'], answer:'7', topic: 'Horcrux'},
      {question: 'How did Harry and Ron get to Hogwarts during their second year?', options: ['Hogwarts Express','Flying Car','Boat','Broomsticks','Walking'], answer:'Flying Car', topic: 'harry potter car'},
      {question: 'Which of the following is NOT a name of Voldermort:', options: ['Tom Riddle','Marvolo','The Dark Lord','He who must not be named','The Black Heir'], answer:'The Black Heir', topic: 'Voldermort'},
      {question: `What is the core of Harry's wand?`, options: ['Dragon-heart string', 'Unicorn hair', 'Thestral Hair', 'Gold string', 'Phoenix Feather'], answer: 'Phoenix Feather', topic: 'Harry Potter wand'},
      {question: 'What is the Gryffindor symbol?', options: ['Dragon', 'Phoenix', 'Lion', 'Snake', 'Sword'], answer: 'Lion', topic: 'Gryffindor'},
      {question: `What was the shape of Severus Snape's patronus?`, options: ['Dragon','Snake', 'Bird', 'Doe','Bear'], answer: 'Doe', topic: 'Patronus'},
      {question: `What form did Harry's boggart take?`, options: ['Spiders', 'Dementors', 'A Basilisk', 'Voldermort', 'Werevolves'], answer: 'Dementors', topic: 'Dementors'},
      {question: `Which spell was used to combat boggarts?`, options: ['Riddikulus', 'Stupefy', 'Sectumsempra', 'Expelliarmus', 'Obliviate'], answer:'Riddikulus', topic: 'Riddikulus'},
      {question: `Who was the Half-Blood prince?`, options: ['Voldermort', 'Dumbledore', 'Severus Snape', 'Harry Potter', 'Draco Malfoy'], answer: 'Severus Snape', topic: 'Snape'}
    ];

    this.timer_count = 11;
    this.new_qst_timer = 3000;
    this.interval_timer;
    this.next_question = true;
    this.random;
    this.current_qst_ans;
    this.correct = 0;
    this.incorrect = 0;
    this.allow_input = true;
  }

  get_next_question(){
    let random = Math.floor(Math.random() * this.qst_ans_array.length);
    this.random = random;
    this.current_qst_ans = this.qst_ans_array[random];
    this.qst_ans_array.splice(random, 1);
    this.allow_input = true;
    return this.current_qst_ans;
  }

  run_timer(){
    clearInterval(this.interval_timer);
    this.interval_timer = setInterval(this.timer.bind(this), 1000);
  }

  reset_timer(){
    clearInterval(this.interval_timer);
    this.timer_count = 11;
    this.run_timer();
  }

  timer() {
    let that = this;
    if(that.timer_count > 0) {

      if(that.next_question) {
        if(that.qst_ans_array.length > 0) {
          display(that.get_next_question());
        }
      }

      that.next_question = false;
      // console.log(this.timer_count);
      this.timer_count--;
      $('#h3_timer').text(this.timer_count);

      if(this.timer_count === 0){
        this.allow_input = false;
        if(that.qst_ans_array.length === 0){
          clearInterval(that.interval_timer); //
          that.display_answer();
          setTimeout(() => { //
            display_game_over();
          }, that.new_qst_timer);
        } else {
          $('#h3_timer').text(`Times up!`);
          that.display_answer();
          setTimeout(function(){
            that.reset_timer();
            that.next_question = true;
          }, that.new_qst_timer);
        }
      }
    }
  } //end timer();

  process_input(input){
    // console.log(this.allow_input);
    let that = this;
    if(that.allow_input) {
      that.allow_input = false;
      if(input === that.current_qst_ans.answer) {
        alert('correct');
        that.correct++;
      } else {
        alert('incorrect!');
        that.incorrect++;
      }

      if(that.qst_ans_array.length === 0) {
        that.next_question = false;
        clearInterval(that.interval_timer); //1
        that.display_answer(input); //2
        setTimeout(()=> {
          display_game_over();
        }, this.new_qst_timer);
      } else {
        that.next_question = true;
        clearInterval(this.interval_timer); //1
        that.display_answer(input); //2
        setTimeout(() =>{
          that.reset_timer();
        }, that.new_qst_timer); 
        // that.reset_timer();
      }
    }
  } //end process_input();

  display_answer(input){

    let that = this;

    let li_items = $('#ul_options').children();
    for(let i = 0; i < li_items.length; i++) {
      if(li_items.eq(i).text() == that.current_qst_ans.answer) {
        let text = li_items.eq(i).text();
        // li_items.eq(i).text(`Correct Answer = ${text}`);
        li_items.eq(i).html(`<i class="fas fa-hat-wizard"></i> Correct Answer = ${text}`);

        li_items.eq(i).addClass('li_correct');

        //Append iimage at the wrong time:
        // this.getAJAXImage(that.current_qst_ans.topic);

      }
      if(input !== null) {
        if(input === li_items.eq(i).text()) {
          li_items.eq(i).addClass('li_incorrect');
        }
      }
    } 
  }//end display answer

  get unanswered(){
    return (10 - this.correct - this.incorrect);
  }

  //getting an ajax image using giphy api:
  getAJAXImage(topic){
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=dc6zaTOxFJmzC&limit=1`;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response){
      // let $img = $(`<img src='${response.data.fixed_height.url}'>`);
      console.log(response.data[0].images.fixed_height.url);
      let img_src = response.data[0].images.fixed_height.url;
      $('#div_gif').html($(`<img class='center-block' src='${response.data[0].images.fixed_height.url}'>`));
    });
  }

} //end game class

let game1 = new game();

$('#div_game_over').hide();

$('#btn_start').on('click', function(){
  game1.run_timer();
  // console.log(game1);
  $(this).hide();
});

const display = (object) => {
  $('#out_question').text(object.question);

  $('#ul_options').empty();
  for(let i = 0; i < object.options.length; i++) {
    $('#ul_options').append(`<li class='li_options'>${object.options[i]}</li>`);
  }
}

$(document).on('click', '.li_options', function(){
  let $that = $(this);
  game1.process_input($that.text());
});

$(document).on('click', '#btn_restart', function(){
  $('#div_game_over').hide();
  game1 = new game();
  game1.run_timer();
  setTimeout(()=> {
    $('#div_main').show();
  }, 1000);
});

const display_game_over = () => {
  $('#div_main').hide();
  $('#out_correct').text(`Correct: ${game1.correct}`);
  $('#out_incorrect').text(`Incorrect: ${game1.incorrect}`);
  $('#out_unanswered').text(`Unanswered: ${game1.unanswered}`);
  $('#div_game_over').show();
}
