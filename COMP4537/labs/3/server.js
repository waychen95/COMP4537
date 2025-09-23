let http = require('http')
let url = require('url')
const template = require('./lang/messages/en/user')
const path = require('path')

class Server {
    createServer() {
        http.createServer((req, res) => {

            const parsed_url = url.parse(req.url, true)

            const pathname = parsed_url.pathname
            const query = parsed_url.query
            const name = query.name || template.unknown_user
            const date = new Date()

            console.log(pathname)

            if (pathname === "/getDate") {
                const message = template.greetings.replace("%1", name).replace("%2", date)
                res.writeHead(200, {'Content-Type':'text/html'})
                res.end(message)
            } else {
                res.writeHead(404, {'Content-Type':'text/html'})
                res.end("404 Page Not Found")
            }

        }).listen(8080)
    }
}

console.log("listening...")