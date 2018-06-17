let searchInput;
$(document).ready(() => {
	searchInput = $('.movie-search');
	let titleInput = $('#name-input');
	let yearInput = $('#year-input');
	searchInput.change(()=>{
		getMovieInfo(`?s=${searchInput.val()}&type=movie`);
	});
	$('.search-outline-button').click(()=>{
		console.log(yearInput.val());
		getMovieInfo(`?t=${titleInput.val()}&y=${yearInput.val()}`);
	});
});

let getMovieInfo = (params,pageRequst=false) => {

    console.log("making request")
    console.log(`${params}&apikey=243fd441`);
    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        url: `http://www.omdbapi.com/${params}&apikey=243fd441`, // URL of getting data
        success: (data) => { // in case of success response
            console.log(data)
            let movieInfo;
            if(data.Search){
            	movieInfo = data.Search;
            	$('#result-count').text(`${data.totalResults} movies found with '${searchInput.val()}'`);
            	let resultsContainer = $('#movie-results');
            	resultsContainer.html("");
            	for(let movie of movieInfo){
            		console.log(movie.Title)
            		let moviePoster;
            		if (movie.Poster !=="N/A") {
            			console.log("Poster found for"+movie.Title)
            			moviePoster = movie.Poster;
            		}else{
            			console.log("POster not found for"+movie.Title)
            			moviePoster = "images/movie-logo.jpg";
            		}
            		let movieSearchCard = `
            			<div class="col-1 search-card my-2 p-0">
						<div class="row text-center">
						<div class="col-12">
						<img src="${moviePoster}" class="img-fluid">
						</div>
						<small class="col-12 search-title my-1">${movie.Title}</small>
						<small class="col-12 search-year">${movie.Year}</small>
						</div>
						</div>`;
            		$('#movie-results');
            		resultsContainer.append(movieSearchCard);
            	}//end for loop

 				$(resultsContainer).find('.search-card').click(function(){
 					console.log('search item clicked')
 					getMovieInfo(`?t=${$(this).find('.search-title').text()}&y=${$(this).find('.search-year').text()}`);
 				});
            	if (!pageRequst) {
            	let pageCount = 1;
            	let totalPages = data.totalResults/10;
            	let searchPagination = $('.pagination');
            	$(searchPagination).html('');
            		while(totalPages > 0.1){
            			console.log(totalPages);
            			$(searchPagination).append(`<li class="page-item"><a class="page-link">${pageCount}</a></li>`);
            			pageCount++;
            			totalPages--;
            		}//end while loop

            	$(searchPagination).find('li').first().addClass('disabled');
            	$(searchPagination).find('li').click(function(){
            		console.log("li element clicked");
            		$(this).addClass('disabled');
            		$(searchPagination).find('li').not(this).removeClass('disabled');
           			getMovieInfo(`?s=${searchInput.val()}&page=${$(this).text()}&type=movie`,true);
            	});
            	}//end if(!pageRequest)
            }else{
            	movieInfo = data;
            	$('#movie-card').show();
            	 $(".movie-name").text(`${movieInfo.Title} (${movieInfo.Year})`); // placing data in division with id - 'showData'
            	 if (movieInfo.Poster == "N/A") {
            	 	$(".movie-poster").attr("src","images/movie-logo.jpg");
            	 }else{
            	 	$(".movie-poster").attr("src",movieInfo.Poster);
            	 }
            	 //$("body:before").css("background",`url(${movieInfo.Poster})`);
            	 $(".movie-runtime").text(`${movieInfo.Runtime} | ${movieInfo.Genre} | ${movieInfo.Released}`);
            	 $(".movie-plot").text(movieInfo.Plot);
            	 $(".movie-director").html(`<b>Director:</b> ${movieInfo.Director}`);
            	 $(".movie-writer").html(`<b>Writer:</b> ${movieInfo.Writer}`);
            	 $(".movie-actors").html(`<b>Actors:</b> ${movieInfo.Actors}`);
            	 $('.search-input').css("background","rgba(0,0,0,0.7)");
            	 $('.display-4').find('span').first().css("background","rgba(255,255,255,0.8)");
            	 $('.display-4').find('span').last().css("background","rgba(247,92,81,0.8)");
            	 $( `<style>body:before 
            		{ background-image: url(${movieInfo.Poster});
            		  background-size: cover;
            		  height: 250%;
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

        },

        timeout:10000 // this is in milli seconds

    }); // end of AJAX request

} // end of getMovieInfo