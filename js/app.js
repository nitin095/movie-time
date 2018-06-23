let searchInput;
let inputType;
let movieInfo;
let bodyHeight;

$(document).ready(() => {
	
	$('button.search-button').click(()=>{
        searchInput = $('.movie-search').val();
        if (!searchInput) {
            toast("No input!","warning");
        }else{
            inputType = $('.type-select option:selected').val();
            getMovieInfo(`?s=${searchInput}&type=${inputType}`);
            $('.search-input').find('.loader').show();
        }  
	});


    $('.movie-search').keypress(function(e) {
        if (e.which == 13) {
            $('button.search-button').click();
        }
    });

	$('.search-outline-button').click(()=>{
        let titleInput = $('#name-input').val();
        let yearInput = $('#year-input').val();
        let imbdInput = $('#imbd-input').val();
        console.log("t:"+titleInput+" y:"+yearInput +" i:"+imbdInput)
         console.log("t:"+!titleInput+" y:"+!yearInput +" i:"+!imbdInput)
        if (!titleInput && !yearInput && !imbdInput) {
            toast("No input!","warning");
        }else if (!titleInput && yearInput) {
            toast("Please provide title.")
        }else{
            $('.search-input').find('.loader').show();
            getMovieInfo(`?t=${titleInput}&y=${yearInput}&i=${imbdInput}`,'title');
        }
	});

    $('#name-input,#year-input,#imbd-input').keypress(function(e) {
        if (e.which == 13) {
            $('.search-outline-button').click();
        }
    });

});//end document.ready function

$( window ).resize(function() {
	if ($('#movie-card').is(":visible")) {
    	$('head').find('style').remove();
        bodyHeight = $('footer').offset();
        $( `<style>body:before 
           { background-image: url(${movieInfo.Poster});
             background-size: cover;
             height: ${bodyHeight.top}px;
           }</style>` ).appendTo( "head" );
	}
});//end window.resize function

let toast = (message,type="danger") => {
    let t = $("#toast");
    if (type == "warning") {
        t.css({"color":"orange","bottom":"70%"});
    }else{
        t.css({"color":"rgb(242,65,65)","bottom":"70%"});
    }
    t.text(message);
    t.animate({opacity: "1",bottom: "+=100px"});
    setTimeout(()=>{ t.animate({opacity: "0",bottom: "+=100px"}); }, 5000);
    }

let getMovieInfo = (params,requestType="search",pageRequst=false) => {

    console.log("making request")
    console.log(`${params}&apikey=243fd441`);
    console.log("pageRequst: "+pageRequst);

    let $pagination = $('#pagination-search');

    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: `https://www.omdbapi.com/${params}&apikey=243fd441`, 

        success: (data) => { 
            console.log(data);
		 if (data.Response == 'True') {
            console.log("RUNNING CODE")
            if(data.Search){
            	movieInfo = data.Search;
            	let searchType = inputType; 
            	if (!searchType.endsWith('s') && data.totalResults > 1) {
            		searchType += 's';
            	}

            	$('#result-count').text(`${data.totalResults} ${searchType} found with '${searchInput}'`);
            	let resultsContainer = $('#movie-results');
            	resultsContainer.html("");
            	for(let movie of movieInfo){
            		let moviePoster;
            		if (movie.Poster !=="N/A") {
            			moviePoster = movie.Poster;
            		}else{
            			moviePoster = `images/${inputType}-poster-placeholder.jpg`;
            		}
            		let movieSearchCard = `
            			<div class="col-5 col-sm-4 col-md-3 col-lg-2 col-xl-1 mx-2 search-card my-2">
						<div class="row text-center">
						<div class="col-12">
						<img src="${moviePoster}" class="img-fluid movie-search-poster">
						</div>
                        <div class="loader col-12">
                        <img src="images/loader/movie.png" class="img-fluid mt-5">
                        </div>
						<small class="col-12 search-title my-1">${movie.Title}</small>
						<small class="col-12 search-year">${movie.Year}</small>
						<small class="col-12 search-imbd d-none">${movie.imdbID}</small>
						</div>
						</div>`;
            		resultsContainer.append(movieSearchCard);
            	}//end for loop

 				$(resultsContainer).find('.search-card').click(function(){
 					console.log('search item clicked')
 					getMovieInfo(`?i=${$(this).find('.search-imbd').text()}`,'id');
 					$(this).find('.loader').show();
 				});

            	if (!pageRequst) {
            	 $pagination.twbsPagination('destroy');
            	 $pagination.twbsPagination({
			        totalPages: Math.ceil(data.totalResults/10),
			        visiblePages: 10,
			        onPageClick: function (event, page) {
			            $('#page-content').text('Page ' + page);
			            getMovieInfo(`?s=${searchInput}&page=${page}&type=${inputType}`,'search',true);
			        }
			     });
            	}//end if(!pageRequest)

            //end data.Search if
            }else{
            	movieInfo = data;
            	$('#movie-card').show();
            	 $(".movie-name").text(`${movieInfo.Title} (${movieInfo.Year})`);
            	 let moviePoster;
            	 if (movieInfo.Poster == "N/A") {
            	 	moviePoster = `images/${inputType}-poster-placeholder.jpg`;
            	 }else{
            	 	 moviePoster = movieInfo.Poster;
            	 }
            	 $(".movie-poster").attr("src",moviePoster);
            	 $(".movie-runtime").text(`${movieInfo.Runtime} | ${movieInfo.Genre} | ${movieInfo.Released}`);
            	 $(".movie-plot").text(movieInfo.Plot);
            	 $(".movie-director").html(`<b>Director:</b> ${movieInfo.Director}`);
            	 $(".movie-writer").html(`<b>Writer:</b> ${movieInfo.Writer}`);
            	 $(".movie-actors").html(`<b>Actors:</b> ${movieInfo.Actors}`);
            	 $(".movie-rated").html(
            	 	`<span class="col-auto">
            	 		<b>Rated:</b>&nbsp;${movieInfo.Rated}
            	 	</span>
            	 	<span class="col-auto">
            	 		<b>Language:</b>&nbsp;${movieInfo.Language}
            	 	</span>
            	 	<span class="col-auto">
            	 		<b>Country:</b>&nbsp;${movieInfo.Country}
            	 	</span>`);
                if (!movieInfo.Awards == "N/A") {
            	   $(".movie-awards").html(`<b>Awards:</b> ${movieInfo.Awards}`);
                }
            	$(".movie-ratings").html('<span class="col-auto pr-0"><b>Ratings:</b></span>');
            	for(let rating in movieInfo.Ratings){
            	   console.log(movieInfo.Ratings[rating].Source);
            	   $(".movie-ratings").append(`<span class="col-auto text-center reduced-line-height mt-1">${movieInfo.Ratings[rating].Source}:<br><span class="">${movieInfo.Ratings[rating].Value}</span></span>`);
            	}
            	$(".movie-production").html(`<b>Production:</b>&nbsp;${movieInfo.Production}`);
            	if (!movieInfo.BoxOffice == "N/A") {
            	   $(".movie-box-office").html(`<b>Box office:</b>&nbsp;${movieInfo.BoxOffice}`);
            	}
            	if (!movieInfo.Website == "N/A") {
            	   $(".movie-website").html(`<b>Website:</b>&nbsp;<a href="${movieInfo.Website}">${movieInfo.Website}</a>`);
            	}
            	$(".movie-yt").html(`<small><a href="https://www.youtube.com/results?search_query=${movieInfo.Title} ${movieInfo.Year} trailer" target="blank">View trailer on Youtube</a></small>`);
            	$('.search-input').css("background","rgba(0,0,0,0.7)");
            	$('.display-4').find('span').first().css("background","rgba(255,255,255,0.8)");
            	$('.display-4').find('span').last().css("background","rgba(247,92,81,0.8)");
            	
            }//end else
        }else{
            if (data.Error) {
                toast(data.Error);
            }
        }

        },
        error: (data) => { 
             if (data.statusText == "timeout") {
                toast("Request timed out. Please try again.");
            }
            if (data.statusText == "parsererror") {
                toast("Parse error! Cannot load data.");
            }
            console.log(data);
        },

        beforeSend: () => { 

            // you can use loader here.
            //alert("request is being made. please wait")

        },
        complete: (data) => {
            console.log(data)

            //if poster can't be loaded or is 404, replacing with placeholder.
    		$(".movie-poster,.movie-search-poster").on("error",function() {
				console.log("HANDLING POSTER ERROR");
				this.src = `images/${inputType}-poster-placeholder.jpg`;
			});

            if (data.responseJSON !== undefined) {
                if (!data.responseJSON.Error) {
                    if (requestType == "search") {
                        $('html, body').animate({
                            scrollTop: $("#search-results").offset().top
                        }, 1000);
                    }else{
                        $('html, body').animate({
                            scrollTop: $("#movie-card").offset().top
                        }, 1000);
                        $('#result-count').css({"color":"#fff","background":"rgba(247,92,81,0.8)"});
                    }
                }
            }

            $('.loader').hide();

            setTimeout(()=>{ 
                //setting poster as body blurred background
                    bodyHeight = $('footer').offset();
                    $('head').find('style').remove();
                    $( `<style>body:before 
                        { background-image: url(${movieInfo.Poster});
                        height: ${bodyHeight.top}px;
                        }</style>` ).appendTo( "head" );
            }, 1000);

        	},

        timeout:10000

    }); // end of AJAX request

} // end of getMovieInfo

