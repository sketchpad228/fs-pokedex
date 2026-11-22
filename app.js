/* 
	? Application Programming Interface (API)
	* a way for us to communicate with a resource (usually a server)
	* client (front-end)
		* browsers, curl command, Postman request
	* server (back-end)
		* a computer has a listener setup that listens for requests
		* it serves up response
	* enables a RESTful architecture using request/response lifecycle
		* REST - representational state transfer
			* communicate in req/res
			* JSON (JavaScript Object Notation) specific
			* stateless
		* SOAP - simple object access protocol
			* communicate in req/res
			* XML specific
			* stateful
		* request - data we send (as the client)
			* headers (metadata)
			* query parameters (GET)
			* body (POST)
		* response - data we receive (as the server)
			* headers
			* payload
			* status code
	
	* REST & SOAP work via CRUD
		* create
		* read
		* update
		* delete
	
	* correspond to the following HTTP Methods or HTTP Verbs
		* POST
		* GET
		* PUT
		* DELETE
*/

/* 
	? Fetch API
	* asynchronous function
	* we need it because we don't know how long fetching data will take
	* we wait until our Promise is resolved or rejected
	* fetch allows us to handel the data in three states
		* pending (not done)
		* fulfilled (done)
		* rejected (error) - due to network problems or time-to-live (TTL)
	
	* JSON JavaScript Object Notation
		* it is an object
		* wrapped in a string
		* specific syntax for stringfying and JSONifying
		* ex: "{ 'name': 'Paul', 'age': 27}"
		* to aid in transmission, data gets encapsulated into ReadableStream object
		* it needs JSONified
*/

// let url = `https://prismix.dev/api/v1/statuses`;
// let url = `https://pokeapi.co/api/v2/pokemon/`
// let url = `https://pokeapi.co/api/v2/pokemon/pikachu`
// let url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`
// let url1 = `https://pokeapi.co/api/v2/pokemon/pikachu`

// fetch(url)
// 	.then(response => response.json())
// 	.then(data => console.log(data))
// 	.catch(err => console.log(err))

/* 
	? Fetch Process
	* 1. fetch grabs your resource and returns Promise object
	* Promise can be pending, fulfilled, or rejected
	* 2. use .then() resolver to strip the Promise
	* we catch the data in the parameter of the callback function (response)
	* 3. use Response.json() method to read and strip it from JSON string to object
	* .json() method returns a Promise again
	* 4. use another .then() resolver to strip its Promise
	* catch it into a parameter (data) and do as you please with your output
	* 5. use .catch() to deal with any error handling
*/

/* 
	? Fetch with Async Await Try Catch
*/

const serviceList = document.querySelector("#service-list")
const statusMessage = document.querySelector("#status-message")
const emptyResults = document.querySelector("#empty-results")
const resultCount = document.querySelector("#result-count")
// const searchForm = document.querySelector("#search-form")

const setStatus = (message, visible = true) => {
	statusMessage.textContent = message
	statusMessage.hidden = !visible
}



// const formatDate = value => {
// 	if (!value) return "Date unavailable"
// 	const date = new Date(value)
// 	return Number.isNaN(date.getTime())
// 		? String(value)
// 		: date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
// }

const updateResults = () => {
	const term = search.value.trim().toLowerCase()
	const cards = [...document.querySelectorAll(".card")]
	const visibleCards = cards.filter(card => {
		const matches = !term || card.dataset.searchText.includes(term)
		card.hidden = !matches
		return matches
	})

	emptyResults.hidden = cards.length === 0 || visibleCards.length > 0
	resultCount.textContent = term
		? `${visibleCards.length} ${visibleCards.length === 1 ? "service" : "services"} matching “${search.value.trim()}”.`
		: `${visibleCards.length} ${visibleCards.length === 1 ? "service" : "services"} available.`
}

const search = document.querySelector("#service-search")

search.addEventListener("input", updateResults)
// search.form.addEventListener("reset", () => requestAnimationFrame(updateResults))
search.form.addEventListener("submit", event => {
	event.preventDefault()
	let input = search.value
	if (!input) {
		setStatus("Please enter a search term.")
		return
	}
	console.log(`Search: ${input}`)
	searchPokemon(input)
})

let searchPokemon = (searchInput) => {
	if (!searchInput) {
		console.log("No search input provided.")
		return
	}
	getPokemon(searchInput)
}

const renderPokemon = data => {
	serviceList.replaceChildren()
	console.log(data)

	const card = document.createElement("article")
	card.className = "card"
	card.dataset.searchText = [data.id, data.name]
			// .concat(service.recentIncidentBriefs?.map(issue => `${issue.impact} ${issue.name}`) || [])
			.join(" ").toLowerCase()

	const image = document.createElement("img")
	image.className = "pokemon-image"
	image.src = data.sprites?.other?.["official-artwork"]?.versions?.["generation-i"]?.["red-and-blue"]?.front_default || "https://via.placeholder.com/150"
	image.alt = data.name || "Pokemon image unavailable"
	image.setAttribute("aria-label", data.name || "Pokemon image unavailable")

	// Cropping image

	// var context = image.getContext("2d")
	// var imageObj = new Image();

	// imageObj.onload = function() {

	// 	var sourceX = 100;
	// 	var sourceY = 100;
	// 	var sourceWidth = 800;
	// 	var sourceHeight = 800;
	// 	context.drawImage(imageObj, 0, 0);
	// }

	// Changing size of image

	const name = document.createElement("h3")
	name.textContent = data.name || "Unnamed service"

	const id = document.createElement("p")
	id.textContent = "Pokedex ID: " + (data.id || "ID unavailable")

	const height = document.createElement("p")
	height.textContent = `Height: ${data.height || "Height unavailable"}`

	const weight = document.createElement("p")
	weight.textContent = `Weight: ${data.weight || "Weight unavailable"}`

	const description = document.createElement("p")
	description.className = "card-description"
	// description.textContent = service.description || "No description available."

	const stats = document.createElement("p")
	stats.textContent = data.stats || "Stats unavailable"

	const types = document.createElement("p")
	types.textContent = data.types || "Unnamed service"

	card.append(name, image, id, height, stats, types)

	const abilities = Array.isArray(data.abilities) ? data.abilities : []
	if (abilities.length) {
		const incidentSection = document.createElement("section")
		incidentSection.className = "incidents"
		incidentSection.setAttribute("aria-label", "Abilities")
		const incidentHeading = document.createElement("h4")
		incidentHeading.className = "incidents-heading"
		incidentHeading.textContent = "Abilities"
		const incidentList = document.createElement("ul")
		abilities.forEach(issue => {
			const item = document.createElement("li")
			item.textContent = `${abilities[issue] || "Unknown impact"}`
			incidentList.append(item)
		})
		incidentSection.append(incidentHeading, incidentList)
		card.append(incidentSection)
	}

	serviceList.append(card)
	
	setStatus(data.length ? "" : "No services are currently available.", !data.length)
	updateResults()
}

const getPokemon = async (searchInput) => {
	try {
		let url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`
		const response = await fetch(url)
		if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
		const data = await response.json()
		console.log("What the hell is going on here?")
		console.log(data)
		renderPokemon(data)
	} 
	catch (error) {
		console.error(error)
		serviceList.replaceChildren()
		resultCount.textContent = "Services could not be loaded."
		setStatus("We couldn't load service status right now. Please try again later.")
	}
}

// ? This returns a Promise again
// to use it, either use resolvers or throw inside another async function

/* 
	? Challenge
	* parse thru the data and render it using DOM
	* build blocks that display the following:
		* name
		* description
		* updated date
		* recent issues
		! Spicey Mode
		* add an input field
		* as you type, the search removes all irrelevant blocks
*/

function getUserUsingPromise(state)
{
	return new Promise((resolve, reject) => {
		if (state) {
			resolve({message: "The promise is resolved."})
		} else {
			reject({message: "The promise has been rejected."})
		}
	})
}

getUserUsingPromise(true)