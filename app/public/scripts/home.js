// IBlity, the ... IB textbook
var about_texts = ['completely free', 'community-driven', 'open-source', 'up-to-date', 'non-profit']
var about_interval = 3000
var about_index = 0

function changeAbout() {
	if (about_index == about_texts.length - 1) about_index = 0
	else about_index += 1

	$("#body--dark--about--span-middle").html(about_texts[about_index])
	setTimeout(changeAbout, about_interval)
}

setTimeout(changeAbout, about_interval)
