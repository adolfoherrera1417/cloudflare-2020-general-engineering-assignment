/**
 * @param {string} url the URL to send the request to
 */
const url = "https://static-links-page.signalnerve.workers.dev"


class ProfileTransformer {
  async element(element) {
    // Will remove the style atribute completly. Alternative will be to setInnerContent
    element.removeAttribute('style')
    const page = await fetch(url)
  }
}

class ProfileImageTransformer{
  async element(element) {
    // Update profile image with custom link
    element.setAttribute('src','https://media-exp1.licdn.com/dms/image/C4E03AQFL7WIiNxIgHA/profile-displayphoto-shrink_400_400/0?e=1609372800&v=beta&t=VlvW3XghRcDwPZJGZU275Fr7YzjcIoifGzpvizn_3SE')
  }
}

class ProfileNameTransformer {
  async element(element) {
    // Update profile name with personal account name
    element.setInnerContent("adolfoherrera1417")
  }
}

class SocialTransformer {
  async element(element) {
    // Allows the social element to be visible and adds github icon
    element.removeAttribute('style')
    element.setInnerContent('<a href=\"https://github.com/adolfoherrera1417\"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>',{ html: true })
  }
}


/**
 * @param {Array} links array that contains links to display in HTML
 */
class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  async element(element) {
    for(let i = 0; i < this.links.length; i++) {
      element.append("<a href=\""+ this.links[i]["url"] + "\">"+ this.links[i]["name"] +"</a>",{ html: true })
    }
  }
}

addEventListener('fetch', event => {
  const {request} = event
  const {url} = request
  
  // Route to handle /links api call
  if (url.includes("links")) {
    handleAPIRequest(event)
  } else {
    event.respondWith(handleRequest(event.request))
  }
})
/**
 * Respond with HTML page
 * @param {Request} request
 */
async function handleRequest(request) {
  const links = [{ "name": "LinkedIn", "url": "https://www.linkedin.com/in/adolfo-herrera/" },{ "name": "Email", "url": "mailto: adolfoherrera1417@gmail.com" },{ "name": "Pathfinding Visualizer", "url": "https://adolfoherrera1417.github.io/Target-Acquired/" }]
  return editHtml(url,links)
}

/**
 * Fetches HTML page from "https://static-links-page.signalnerve.workers.dev"
 * Updates HTML with custom edits
 * Respond with HTML page
 * @param {Request} request
 * @param {links} links array that contains links to display in HTML
 */
async function editHtml(request,links) {
  return new HTMLRewriter()
    .on("div#profile", new ProfileTransformer())
    .on("img#avatar", new ProfileImageTransformer())
    .on("h1#name", new ProfileNameTransformer())
    .on("div#links", new LinksTransformer(links))
    .on("div#social", new SocialTransformer())
    .on("body", {element(element) {element.setAttribute("class","bg-blue-400")}})
    .on("title", {element(element) {element.setInnerContent("Adolfo Herrera")}})
    .transform(await fetch(request))
}

/**
 * Request Handler to respond to path /links
 * Respond with JSON
 * @param {Request} request
 * @param {links} links array that contains links to display in HTML
 */
async function handleAPIRequest(event) {
  const data = [{ "name": "LinkedIn", "url": "https://www.linkedin.com/in/adolfo-herrera/" },{ "name": "Email", "url": "mailto: adolfoherrera1417@gmail.com" },{ "name": "Pathfinding Visualizer", "url": "https://adolfoherrera1417.github.io/Target-Acquired/" }]
  const json = JSON.stringify(data, null, 2)
  return event.respondWith(
    new Response(json, {
      headers: {
        "content-type": "application/json"
      }
    })
  )
}