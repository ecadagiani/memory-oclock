/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */
const express    = require( "express" );
const bodyParser = require( "body-parser" );
const cors       = require( "cors" );
const helmet     = require( "helmet" );
const http       = require( "http" );
const path       = require( "path" );

const gamesRouter = require( "http/router/GamesRouter" );
const webRouter   = require( "http/router/WebRouter" );

class HttpController {
    constructor() {
        // création du server express, mais sans configuration
        this.app    = express();
        this.server = http.createServer( this.app );
    }

    /**
     * Configuration du server express
     */
    init() {
        // pour gérer plus facilement les paramètres et la query en json
        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        // pour gérer les cross origin platform, ATTENTION: suffisant pour du local, mais à ne pas utiliser en prod https://developer.mozilla.org/fr/docs/Web/HTTP/CORS
        this.app.use( cors( { origin: "*" } ) );
        // Ajouter quelque simple sécurité de base
        this.app.use( helmet({
            contentSecurityPolicy: false // todo - update to use only wanted script
        }) );

        // Mise en place du moteur de rendu
        this.app.set( "view engine", "pug" );
        this.app.set( "views", path.join( __dirname, "../views" ) );

        // envoi des fichiers web static
        this.app.use(express.static('src/static'));

        // Charge les routes lié à une partie
        this.app.use( "/game", gamesRouter );
        this.app.use( "/web", webRouter );

        // Route de test
        this.app.get( "/ping", ( req, res ) => {
            res.send( "pong" );
        } );
        this.app.get( "/", ( req, res ) => {
            res.send( "Hello you are on the pyrite server" );
        } );

    }

    startServer() {
        // démarrage du server sur le port gérer via la variable d'environnement SERVER_PORT
        this.server.listen( process.env.SERVER_PORT, () => {
            // eslint-disable-next-line no-console
            console.log( "Memory JS Server Running" );
        } );
    }
}

module.exports = HttpController;
