let searchInput;
$(document).ready(() => {
	searchInput = $('.movie-search');
	let titleInput = $('#name-input');
	let yearInput = $('#year-input');
	let imbdInput = $('#imbd-input');

	searchInput.change(()=>{
		getMovieInfo(`?s=${searchInput.val()}&type=movie`);
		 $('html, body').animate({
        	scrollTop: $("#search-results").offset().top
    	}, 1000);
	});

	$('.search-outline-button').click(()=>{
		console.log(yearInput.val());
		getMovieInfo(`?t=${titleInput.val()}&y=${yearInput.val()}&i=${imbdInput.val()}`);
	});

});

let getMovieInfo = (params,pageRequst=false) => {

    console.log("making request")
    console.log(`${params}&apikey=243fd441`);
    console.log("pageRequst: "+pageRequst);

    let $pagination = $('#pagination-search');
    //$pagination.twbsPagination(defaultOpts);

    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        url: `https://www.omdbapi.com/${params}&apikey=243fd441`, // URL of getting data

        success: (data) => { // in case of success response
            console.log(data)
            let movieInfo;
            if(data.Search){
            	movieInfo = data.Search;
            	$('#result-count').text(`${data.totalResults} movies found with '${searchInput.val()}'`);
            	let resultsContainer = $('#movie-results');
            	resultsContainer.html("");
            	for(let movie of movieInfo){
            		let moviePoster;
            		if (movie.Poster !=="N/A") {
            			moviePoster = movie.Poster;
            		}else{
            			moviePoster = "images/poster-placeholder.jpg";
            		}
            		let movieSearchCard = `
            			<div class="col-1 search-card my-2 p-0">
						<div class="row text-center">
						<div class="col-12 poster-container">
						<img src="${moviePoster}" class="img-fluid movie-search-poster">
						</div>
						<small class="col-12 search-title my-1">${movie.Title}</small>
						<small class="col-12 search-year">${movie.Year}</small>
						</div>
						</div>`;
            		resultsContainer.append(movieSearchCard);
            	}//end for loop

 				$(resultsContainer).find('.search-card').click(function(){
 					console.log('search item clicked')
 					getMovieInfo(`?t=${$(this).find('.search-title').text()}&y=${$(this).find('.search-year').text()}`);
 					$('html, body').animate({
			        	scrollTop: $("#movie-card").offset().top
			    	}, 1000);
 				});
            	if (!pageRequst) {
            	// let pageCount = 1;
            	// let totalPages = data.totalResults/10;
            	// let searchPagination = $('.pagination');
            	// $(searchPagination).html('');
            	// 	while(totalPages > 0.1){
            	// 		console.log(totalPages);
            	// 		$(searchPagination).append(`<li class="page-item"><a class="page-link">${pageCount}</a></li>`);
            	// 		pageCount++;
            	// 		totalPages--;
            	// 	}//end while loop
            	 $pagination.twbsPagination('destroy');
            	 $pagination.twbsPagination({
			        totalPages: Math.ceil(data.totalResults/10),
			        visiblePages: 10,
			        onPageClick: function (event, page) {
			            $('#page-content').text('Page ' + page);
			            getMovieInfo(`?s=${searchInput.val()}&page=${page}&type=movie`,true);
			        }
			    });

            	// $(searchPagination).find('li').first().addClass('disabled');
            	// $(searchPagination).find('li').click(function(){
            	// 	console.log("li element clicked");
            	// 	$(this).addClass('disabled');
            	// 	$(searchPagination).find('li').not(this).removeClass('disabled');
           		// 	getMovieInfo(`?s=${searchInput.val()}&page=${$(this).text()}&type=movie`,true);
            	// });
            	 }//end if(!pageRequest)

            //end data.Search if
            }else{
            	movieInfo = data;
            	$('#movie-card').show();
            	 $(".movie-name").text(`${movieInfo.Title} (${movieInfo.Year})`); // placing data in division with id - 'showData'
            	 let moviePoster;
            	 if (movieInfo.Poster == "N/A") {
            	 	moviePoster = "images/poster-placeholder.jpg";
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
            	 $(".movie-awards").html(`<b>Awards:</b> ${movieInfo.Awards}`);
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
            	 //setting poster as body blurred background
            	 $( `<style>body:before 
            		{ background-image: url(${movieInfo.Poster});
            		  background-size: cover;
            		  height: 300%;
            		 }</style>` ).appendTo( "head" );
            }
            

            //console.log(movieInfo.Title);

            // let tempRow = ` <div class="row">
            //                          <div class="col">${movieInfo.Title}</div>
            //                          <div class="col">${movieInfo.Year}</div>
            //                           <div class="col">${movieInfo.Actors}</div>
            //                     </div>`

        },
        error: (data) => { // in case of error response

            alert("some error occured")
            console.log(data);

        },

        beforeSend: () => { // while request is processing.

            // you can use loader here.
            //alert("request is being made. please wait")

        },
        complete: () => {

            // what you want to do while request is completed
            //alert("data fetched success")
            //if poster can't be loaded or is 404, replacing with placeholder.
    		$(".movie-poster,.movie-search-poster").on("error",function() {
				console.log("HANDLING POSTER ERROR")
				this.src = "images/poster-placeholder.jpg";
			});

			$('html, body').animate({
        	scrollTop: $("#movie-card").offset().top
    		}, 1000);
    		
        	},

        timeout:10000 // this is in milli seconds

    }); // end of AJAX request

} // end of getMovieInfo

