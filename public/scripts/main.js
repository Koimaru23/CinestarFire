import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, getDocs, query, where, collection, orderBy } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';

const myFbApp = initializeApp({
    apiKey: "AIzaSyDH0c7TSVuicj6Q-4sAwBRlEAW-I4ViKq4",
    authDomain: "cinestarfire.firebaseapp.com",
    projectId: "cinestarfire",
    storageBucket: "cinestarfire.firebasestorage.app",
    messagingSenderId: "1003868943684",
    appId: "1:1003868943684:web:fda482ad61e4e3f45f1311",
    measurementId: "G-YZ0WX1RYVW"
});

const myDb = getFirestore(myFbApp);
const cajaPrincipal = document.getElementById('contenido-interno');
if (cajaPrincipal) {
    cajaPrincipal.innerHTML = "";
}

async function mostrarListadoDeCines() {
    try {
        const queryRef = query(collection(myDb, 'cines'), orderBy('id', 'asc'));
        const docSnaps = await getDocs(queryRef);
        
        let htmlHtml = "<br/><h1>Nuestros Cines</h1><br/>";
        
        docSnaps.forEach(function(documento) {
            const v = documento.data();
            htmlHtml += `
                <div class="contenido-cine">
                    <img src="img/cine/${v.id}.1.jpg" width="227" height="170"/>
                    <div class="datos-cine">
                        <h4>${v.RazonSocial}</h4><br/>
                        <span>${v.Direccion} - ${v.Ciudad}<br/><br/>Teléfono: ${v.Telefonos}</span>
                    </div>
                    <br/>
                    <a href="cine.html?id=${v.id}">
                        <img src="img/varios/ico-info2.png" width="150" height="40"/>
                    </a>
                </div>
            `;
        });
        
        cajaPrincipal.innerHTML = htmlHtml;
    } catch (error) {
        cajaPrincipal.innerHTML = "Error al cargar los cines.";
        console.error(error);
    }
}

async function mostrarDetalleDelCine(cineId) {
    try {
        const qTexto = query(collection(myDb, 'cines'), where('id', '==', String(cineId)));
        let objRes = await getDocs(qTexto);
        
        if(objRes.empty) {
            const qNum = query(collection(myDb, 'cines'), where('id', '==', Number(cineId)));
            objRes = await getDocs(qNum);
        }

        let htmlHtml = "";
        
        objRes.forEach(function(docItem) {
            const el = docItem.data();
            
            htmlHtml += `
                <h2>${el.RazonSocial}</h2>
                <div class="cine-info">
                    <div class="cine-info datos">
                        <p>${el.Direccion} - ${el.Ciudad || el.Detalle || ''}</p>
                        <p>Teléfono: ${el.Telefonos}</p><br/>
                        <div class="tabla">
            `;

            if (el.tarifas) {
                el.tarifas.forEach(function(t) {
                    htmlHtml += `
                        <div class="fila">
                            <div class="celda-titulo">${t.DiasSemana}</div>
                            <div class="celda">${t.Precio}</div>
                        </div>
                    `;
                });
            }

            htmlHtml += `
                        </div>
                        <div class="aviso">
                            <p>A partir del 1ro de julio de 2016, Cinestar Multicines realizará el cobro de la comisión de S/. 1.00 adicional al tarifario vigente, a los usuarios que compren sus entradas por el aplicativo de Cine Papaya para Cine Star Comas, Excelsior, Las Américas, Benavides, Breña, San Juan, UNI, Aviación, Sur, Porteño, Tumbes y Tacna.</p>
                        </div>
                    </div>
                    <img src="img/cine/${el.id}.2.jpg"/><br/><br/>
                    <h4>Los horarios de cada función están sujetos a cambios sin previo aviso.</h4><br/>
                    <div class="cine-info peliculas">
                        <div class="tabla">
            `;

            if (el.peliculas) {
                el.peliculas.forEach(function(pel) {
                    htmlHtml += `
                        <div class="tabla">
                            <div class="fila">
                                <div class="celda-titulo">${pel.Titulo}</div>
                                <div class="celda">${pel.Horarios}</div>
                            </div>
                        </div>
                    `;
                });
            }

            htmlHtml += `
                        </div>
                    </div>
                </div>
                <div>
                    <img style="float:left;" src="img/cine/1.3.jpg" alt="Imagen del cine"/>
                    <span class="tx_gris">Precios de los juegos: desde S/1.00 en todos los Cine Star.<br/>
                    Horario de atención de juegos es de 12:00 m hasta las 10:30 pm.<br/><br/>
                    Visitános y diviértete con nosotros.<br/><br/><b>CINESTAR</b>, siempre pensando en tí.</span>
                </div>
            `;
        });
        
        cajaPrincipal.innerHTML = htmlHtml;
    } catch (err) { 
        console.error(err);
    }
}

async function cargarPeliculasEnCartelera() {
    try {
        const reqDb = query(collection(myDb, 'peliculas'), orderBy('id', 'asc'));
        const responseData = await getDocs(reqDb);
        
        let htmlHtml = "<br/><h1>Cartelera</h1><br/>";

        responseData.forEach(function(docRef) {
            const dat = docRef.data();
            if(Number(dat.id) < 18) {
                htmlHtml += `
                    <div class="contenido-pelicula">
                        <div class="datos-pelicula">
                            <h2>${dat.Titulo}</h2><br/>
                            <p>${dat.Sinopsis}</p><br/>
                            <div class="boton-pelicula">
                                <a href="pelicula.html?id=${dat.id}">
                                    <img src="img/varios/btn-mas-info.jpg" width="120" height="30" alt="Info"/>
                                </a>
                            </div>
                            <div class="boton-pelicula">
                                <a href="https://www.youtube.com/v/${dat.Link}" target="_blank">
                                    <img src="img/varios/btn-trailer.jpg" width="120" height="30" alt="Trailer"/>
                                </a>
                            </div>
                        </div>
                        <img src="img/pelicula/${dat.id}.jpg" width="160" height="226"/><br/><br/>
                    </div>
                `;
            }
        });

        cajaPrincipal.innerHTML = htmlHtml;
    } catch(err) {
        console.error(err);
    }
}

async function cargarPeliculasProximas() {
    try {
        const queryEstrenos = query(collection(myDb, 'peliculas'), orderBy('id', 'asc'));
        const docResult = await getDocs(queryEstrenos);
        
        let htmlHtml = "<br/><h1>Próximos Estrenos</h1><br/>";

        docResult.forEach(function(docM) {
            const modelo = docM.data();
            if(Number(modelo.id) >= 18) {
                htmlHtml += `
                    <div class="contenido-pelicula">
                        <div class="datos-pelicula">
                            <h2>${modelo.Titulo}</h2><br/>
                            <p>${modelo.Sinopsis}</p><br/>
                            <div class="boton-pelicula">
                                <a href="pelicula.html?id=${modelo.id}">
                                    <img src="img/varios/btn-mas-info.jpg" width="120" height="30" alt="mas_info"/>
                                </a>
                            </div>
                            <div class="boton-pelicula">
                                <a href="https://www.youtube.com/v/${modelo.Link}" target="_blank">
                                    <img src="img/varios/btn-trailer.jpg" width="120" height="30" alt="ver_trailer"/>
                                </a>
                            </div>
                        </div>
                        <img src="img/pelicula/${modelo.id}.jpg" width="160" height="226"/><br/><br/>
                    </div>
                `;
            }
        });

        cajaPrincipal.innerHTML = htmlHtml;
    } catch(err) {
        console.error(err);
    }
}

async function construirMovieDetail(mId) {
    try {
        let rs = await getDocs(query(collection(myDb, 'peliculas'), where('id', '==', String(mId))));
        if(rs.empty) {
            rs = await getDocs(query(collection(myDb, 'peliculas'), where('id', '==', Number(mId))));
        }

        let htmlHtml = "<br/><h1>Cartelera</h1><br/>";

        rs.forEach(function(row) {
            const p = row.data();
            
            // Si la película tiene Generos o Geneross
            const generos = p.Geneross || p.Generos || 'Aventura / Acción';
            const fechaEstreno = p.FechaEstrenoss || p.FechaEstreno || '11 de Enero del 2018';
            const director = p.Director || 'Jake Kasdan';
            const reparto = p.Reparto || 'Dwayne Johnson, Kevin Hart, Jack Black';

            htmlHtml += `
                <div class="contenido-pelicula">
                    <div class="datos-pelicula">
                        <h2>${p.Titulo}</h2>
                        <p>${p.Sinopsis}</p><br/>
                        <div class="tabla">
                            <div class="fila">
                                <div class="celda-titulo">Título Original :</div>
                                <div class="celda">${p.Titulo}</div>
                            </div>
                            <div class="fila">
                                <div class="celda-titulo">Estreno :</div>
                                <div class="celda">${fechaEstreno}</div>
                            </div>
                            <div class="fila">
                                <div class="celda-titulo">Género :</div>
                                <div class="celda">${generos}</div>
                            </div>
                            <div class="fila">
                                <div class="celda-titulo">Director :</div>
                                <div class="celda">${director}</div>
                            </div>
                            <div class="fila">
                                <div class="celda-titulo">Reparto :</div>
                                <div class="celda">${reparto}</div>
                            </div>
                        </div>
                    </div>
                    <img src="img/pelicula/${p.id}.jpg" width="160" height="226"><br/><br/>
                </div>
                <div class="pelicula-video">
                    <embed src="https://www.youtube.com/v/${p.Link}" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="580" height="400">
                </div>
            `;
        });

        cajaPrincipal.innerHTML = htmlHtml;
    } catch(e) {
        console.error(e);
    }
}

const params = new URLSearchParams(window.location.search);
const currentPage = window.location.pathname;

if(currentPage.indexOf("cines.html") > -1) {
    mostrarListadoDeCines();
} else if(currentPage.indexOf("cine.html") > -1) {
    if(params.has("id")) mostrarDetalleDelCine(params.get("id"));
} else if(currentPage.indexOf("peliculas.html") > -1) {
    if(params.get("id") === "estrenos") {
        cargarPeliculasProximas();
    } else {
        cargarPeliculasEnCartelera();
    }
} else if(currentPage.indexOf("pelicula.html") > -1) {
    if(params.has("id")) construirMovieDetail(params.get("id"));
}
