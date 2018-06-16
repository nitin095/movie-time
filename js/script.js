$(document).ready(() => {
	let nameInput = $('#name-input');
	let yearInput = $('#year-input');
	nameInput.change(()=>{
		console.log(yearInput.val());
		getMovieInfo(nameInput.val(),yearInput.val());
	})
});

let getMovieInfo = (name,year) => {

    console.log("making request")

    $.ajax({
        type: 'GET', // request type GET, POST, PUT
        dataType: 'json', // requesting datatype
        url: `http://www.omdbapi.com/?t=${name}&?y=${year}&apikey=243fd441`, // URL of getting data
        success: (data) => { // in case of success response
            
            console.log(data)
            
            let movieInfo = data;

            console.log(movieInfo.Title);

            // let tempRow = ` <div class="row">
            //                          <div class="col">${movieInfo.Title}</div>
            //                          <div class="col">${movieInfo.Year}</div>
            //                           <div class="col">${movieInfo.Actors}</div>
            //                     </div>`

            	
                 $(".movie-name").text(`${movieInfo.Title} (${movieInfo.Year})`); // placing data in division with id - 'showData'
            	 $(".movie-poster").attr("src",movieInfo.Poster);
            	 //$("body:before").css("background",`url(${movieInfo.Poster})`);
            	 $(".movie-runtime").text(`${movieInfo.Runtime} | ${movieInfo.Genre} | ${movieInfo.Released}`);
            	 $(".movie-plot").text(movieInfo.Plot);
            	 $(".movie-director").html(`<b>Director:</b> ${movieInfo.Director}`);
            	 $(".movie-writer").html(`<b>Writer:</b> ${movieInfo.Writer}`);
            	 $(".movie-actors").html(`<b>Actors:</b> ${movieInfo.Actors}`);

            	 $( `<style>body:before 
            		{ background-image: url(${movieInfo.Poster});
            		  background-size: cover;
            		  height: 200%;
            		 }</style>` ).appendTo( "head" );
           
        },
        error: (data) => { // in case of error response

            alert("some error occured")

        },

        beforeSend: () => { // while request is processing.

            // you can use loader here.
            //alert("request is being made. please wait")

        },
        complete: () => {

            // what you want to do while request is completed
            //alert("data fetched success")

        },

        timeout:3000 // this is in milli seconds

    }); // end of AJAX request

} // end of getMovieInfo