$(function() {
	var month = {
				"январь": 0,
				"февраль": 1,
				"март": 2,
				"апрель": 3,
				"май": 4,
				"июнь": 5,
				"июль": 6,
				"август": 7,
				"сентябрь": 8,
				"октябрь": 9,
				"ноябрь": 10,
				"декабрь": 11
			},
			events = {};

	if (!localStorage.getItem('events')) {

	 	$.ajax({
		  url: 'js/data.json',
		  success: function(data, status) {

		  	events = data;
		  	events.events.sort(eventsSort);
		  	writeDates(events.events);

			},
		  dataType: 'json'
		});

	} else {

		events = JSON.parse(localStorage.getItem('events'));
		writeDates(events.events);

	}
	


	function dayFormat(date) {

		date = date.split(' ');
		
		return +new Date(date[2], month[date[1].toLowerCase()], date[0])
	}

	function eventsSort(a, b) {

		return dayFormat(a.date) - dayFormat(b.date);

	}

	function writeDates(events) {

		var dates = eventsDates(events),
				html = ``;
				

		dates.forEach(function(date) {

			var visited = getCookie(date.date) ? ' days__block--visited': '';

			html += `
				<div class="days__block${visited}">
					<a href="#" class="days__day">${date.date}</a>
					<p class="days__count">Количество ${date.count}</p>
				</div>
			`;
		});

		html += `<a href="#" class="modal-open button-primary">Добавить событие</a>`;

		$('.days').html(html);

	}

	function eventsDates(events) {

		var dates = [],
				lastIndex = events.length - 1,
				previous = events[0].date,
				count = 0;

		events.forEach(function(event, i) {

			if (event.date === previous) {

				count++;

			} else {

				dates.push({
					date: previous,
					count: count
				});

				previous = event.date;
				count = 1;

			}

			if (lastIndex === i) {

				dates.push({
					date: previous,
					count: count
				});

			}

		});

		return dates;
	}

	function filterDate(match) {

		var dates = events.events.filter(function(date) {
			return date.date === match;
		});

		return dates;
	}

	$(document).on('click', 'a.days__day', writeEvents);
	$(document).on('click', '.modal-open', modalOpen);
	$('.overlay').on('click', modalClose);
	$('.add-event').on('submit', addEvent);
	$(document).on('click', '.days__back', function(e) {

		e.preventDefault();
		writeDates(events.events);

	});

	function writeEvents(e) {

		var html = ``,
				date = $(this).text(),
				events;

		e.preventDefault();

		setCookie(date, true, {expires: 937});

		events = filterDate( date );

		events.forEach(function(event) {
			html += `
				<div class="days__block">
					<h2 class="days__title">${event.title}</h2>
					<div class="days__day">${event.date}</div>
					<p class="days__desc">${event.desc}</p>
					<p class="days__author">${event.author}</p>
				</div>
			`;
		});
					
		html += `<a href="#" class="days__back button-primary">Вернутся назад</a>`

		$('.days').html(html);
	}

	function modalOpen(e) {

		e.preventDefault();
		$('.modal').addClass('show');
		$('.overlay').addClass('show');
	}

	function modalClose(e) {

		e.preventDefault();
		$('.modal').removeClass('show');
		$('.overlay').removeClass('show');
	}

	function addEvent(e) {

		var target = e.target;
		modalClose(e);

		console.log(e);

		events.events.push({
			title: target[0].value,
			date: target[1].value,
			desc: target[2].value,
			author: target[3].value
		});

		$(target).trigger('reset');

		events.events.sort(eventsSort);

		localStorage.setItem('events', JSON.stringify(events));

		writeDates(events.events);
	}

	function setCookie(name, value, options) {
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) {
	    var d = new Date();
	    d.setTime(d.getTime() + expires * 1000);
	    expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) {
	    options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for (var propName in options) {
	    updatedCookie += "; " + propName;
	    var propValue = options[propName];
	    if (propValue !== true) {
	      updatedCookie += "=" + propValue;
	    }
	  }

	  document.cookie = updatedCookie;
	}

	function getCookie(name) {
	  var matches = document.cookie.match(new RegExp(
	    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	  ));
	  return matches ? decodeURIComponent(matches[1]) : false;
	}
});

