
const http = require('http'),
  fs = require('fs'),
  url = require('url'),
  {
    parse
  } = require('querystring');

mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}; 

http.createServer((req, res) => {
    //Control code.
    var pathname = url.parse(req.url).pathname;

    if (pathname == "/") {
        pathname = "../index.html";
    }

    if (pathname == "../index.html") {
        fs.readFile(pathname, (err, data) => {
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // En caso no haberse encontrado el archivo
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }
            // Pagina encontrada
            // HTTP Status: 200 : OK

            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());

            // Envia la respuesta 
            return res.end();
        });
    }

    if (pathname.split(".")[1] == "css") {
        fs.readFile(".." + pathname, (err, data) => {

            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                }); return res.end("404 Not Found");
            }

            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
            });

            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());

            // Envia la respuesta 
            return res.end();
        });
    }

    if (req.method === 'POST' && pathname == "/cv") {
        collectRequestData(req, (err, result) => {

            if (err) {
                res.writeHead(400, {
                    'content-type': 'text/html'
                });
                return res.end('Bad Request');
            }

            fs.readFile("../templates/plantilla.html", function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    return res.end("404 Not Found");
                }

                res.writeHead(200, {
                    'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                });

                //Variables de control. 

                let parsedData = data.toString().replace('${dui}', result.dui)
                    .replace("${lastname}", result.lastname)
                    .replace("${firstname}", result.firstname)
                    .replace("${gender}", result.gender)
                    .replace("${civilStatus}", result.civilStatus)
                    .replace("${birth}", result.birth)
                    .replace("${exp}", result.exp)
                    .replace("${tel}", result.tel)
                    .replace("${std}", result.std);

                res.write(parsedData);
                return res.end();
            });

        });
    }
}).listen(8081);


function collectRequestData(request, callback) {

    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        // Evento de acumulacion de data. 
        request.on('data', chunk => {
            body += chunk.toString();
        });
        // Data completamente recibida 
        request.on('end', () => {
            callback(null, parse(body));
        });
    } else {
        callback({
            msg: `The content-type don't is equals to ${FORM_URLENCODED}`
        });
    }

}

/*


¿Cuál es la principal función del módulo HTTP?

    Es el protocolo que nos permite realizar peticion de datos y peticion de recursos. En node js el modulo se utiliza para administrar peticiones

¿Cuál es la principal función del módulo FileSystem?

    Organizar datos y mantenerlos despues que termina el programa.
    Los datos se manejan a traves de funciones standar POSIX

¿Qué es un MIME type?
    ES un texto que contiene diferentes archivos donde los archivos se especifican en mimeTypes

¿Qué contienen las variables "req" y "res" en la creación del servidor?
    -req contiene la peticion del usuario (REQUEST)
    -res contiene la respuesta del servidor (RESPONSE)

¿La instrucción .listen(number) puede fallar? Justifique.
    Si, ya que si se le manda un puerto distinto al cual debe escuchar o si es un puerto que se ha levantado anteriormente fallara.

¿Por qué es útil la función "collectRequestData(...)"?
    Es donde esta contenida la informacion que se le da al usuario como respuesta.
    Los parametros son enviados por el método POST.


¿Para qué, además de conocer la dirección de la petición, es útil la variable "pathname"?
    Redirecciona al usuario justo a la parte que se desea ver.


¿Qué contine el parametro "data"?}
    Contiene informacion del documento al cual se le llama.
Es un buffer con el contenido del archivo

¿Cuál es la diferencia entre brindar una respuesta HTML y brindar una CSS?
 MIME es diferente en la respuesta.

¿Qué contiene la variable "result"?
    La informacion que el usuario lleno en el formulario

¿Por qué con la variable "data" se debe aplicarse el metodo toString()? Justifique.
    Para que el contenido de la informacion del documento sea convertido a cadena de texto.


Preguntas complementarias.

    ¿Hay diferencia al quitar el control de peticiones para hojas CSS? Si sucedió algo distinto justifique por qué.
Si, lo que cambia es la respuesta que recibe el usuario de parte del servidor y no se aplican los estilos css

    ¿Se puede inciar el servidor (node main.js) en cualquier sitio del proyecto? Cualquier respuesta justifique.
No, por que genera error con el modulo y el servidor no inicia.


    Con sus palabras, ¿Por qué es importante aprender Node.js sin el uso de frameworks a pesar que estos facilitan el manejo de API's?
ES importante aprender NODE.JS sin frameworks ya que aunque estos nos facilitan nuestro trabajo, como estudiantes de ingeniera informatica debemos 
comprender como funciona un lenguaje sin frameworks 


*/