//---- VARIABLES ----//
let montoTotal = 0;
let prodTotales = 0;
let carrito = [];
let clientes = [];
let productosJSON = [];

//---- OBJETO CLIENTE ----//
class Cliente{
	constructor(nombre, email, telefono){
		this.nombre = nombre;
		this.email = email;
		this.telefono = telefono;
	};
};

//---- FUNCTION DOCUMENT READY ----//
$(document).ready(function(){
	renderizarBtnInfo();
	obtenerJSON();
	renderizarTabla();
	renderizarInfoUtil();
	renderizarTotales()
	renderizarContCompra();
	renderizarPayment();
	console.log('DOM READY')
});

//---- Obtener productos mediante AJAX----//
function obtenerJSON() {
	$.getJSON("../json/products.json", function(respuesta, estado) {
		if (estado == "success") {
			productosJSON = respuesta;
			console.log(productosJSON)
			renderizarCards();
		};
	});
};

//---- FUNCTION PARA CHEQUEAR CARRITO EN LOCAL STORAGE ----//
function chequearLS(){
	//traer el carrito del local storage
	let carritoEnLS = JSON.parse(localStorage.getItem('cartLS'));
	console.log('contenido carrito en LS:', carritoEnLS);
	//si el carritoEnLS existe, lo psuheamos al carrito y lo renderizamos en la tabla
	if (carritoEnLS) {
		carritoEnLS.forEach((prod) => {
			carrito.push(prod)
			//console.log (carrito);
			});
	//mostrar el producto en la tabla del carrito en HTML
	mostrarEnTabla();
	//cargar carrito al local storage
	localStorage.setItem('cartLS', JSON.stringify(carrito));
	//calculamos los totales del carrito (precio y cantidad)
	calcularTotalCarrito();
		};
};

                    //-------------------------------//
                    //------ RENDERIZAR EN DOM ------//
                    //-------------------------------//

//---- RENDERIZAR BOTON DE INFROMACION UTIL ----//
function renderizarBtnInfo(){
	$('#selectDiv').append(`
		<div class="col-lg-12 col-md-12 col-xs-12" id="animacion">
			<button class="botStyle" id="btnInfo">VER INFO UTIL 🡇</button>
		</div>
		`);
	//evento click - te lleva al final de la pagina donde se va a mostrar la informacion
	$('#btnInfo').css("font-size", "2rem", "background", "#F6DFD6",).click(function(){
		$('html').animate({scrollTop: $('#infoUtil').offset().top}, 2000);
		$('#displayInfoUtil').delay(2000).slideDown(1500);
	});
};

//---- RENDERIZAR INFORMACION UTIL ----// Es la informacion que aparece cuando se da click en el boton 'info util'
function renderizarInfoUtil(){
	$('#infoDiv').append(`
		<div class="col-lg-12 col-md-12 col-xs-12" id="infoUtil" >
			<div id="displayInfoUtil" style="display: none">
				<h2 class="titulos">INFORMACION UTIL </h2>
				<h3 class="tInfoUtil">No exclusividad</h3>
				<p class="pInfoUtil">Los estampados de linea <b>no son excluisvos</b>, puede adqirirlos cualquier usuario. <br>
					En caso de querer un estampado de forma exclusiva, comunicarse a traves de la pagina de contacto para analizar 
					la posibilidad con el estamapdo deseado o un desarrollo personalizado. </p>
					<br>
				<h3 class="tInfoUtil">Archivos</h3>
				<p class="pInfoUtil">Los estampados <b>son digitales</b>, se envian por mail en formato .pdf, en curvas. <br>
					De esta manera son completamente editables por el comprador. </p>
				<button class="botStyle" id="btnUp">VOLVER AL INICIO 🡅</button>
			</div>
			
		</div>
		`);
	//evento click - te lleva al inicio de la pagina cerrando primeroel div de la informacion
	$('#btnUp').click(function(){
		$('#displayInfoUtil').slideUp(2000);
		$('html').delay(2000).animate({scrollTop: $('header').offset().top}, 2000);
	});
};

//---- RENDERIZAR CARDS DE PRODUCTOS ----//
function renderizarCards (){
	//chequeamos si hay productos en LocalStorage
	chequearLS()
	//renderizamos los productos del archivo products.json en las cards
	for (const prod of productosJSON){
		//buscamos el productp en el carrito cuyo id sea igual al id del productoJSON
		let prodAgregado= carrito.find((producto) => producto.id ===prod.id)
		if(prodAgregado){
			//si el producto existe, renderizamos la card con el boton deshabilitado
			$('#cardDiv').append(`
				<div class="col-lg-3 col-md-6 col-xs-12" id="cardContainer">
					<div class="cardData">
						<img src="${prod.img}" class= "imgCard">
						<h2 class= "nameCard">${prod.dibujo}</h2>
						<p class= "pCard">${prod.medida}</p>
						<p class= "pCard">${prod.uso}</p>
						<h2 class= "priceCard"> Precio $ ${prod.precio}</h2>
						<button class= "cardButton" id="${prod.id}">AGREGAR</button>
					</div>
				</div>
				`);
			$(`#${prod.id}`).prop('disabled', true).text ('AGREGADO').css ({'background':'#b1b1b2', 'color':'white'});	
		}
		else{
			//si el producto no existe renderizamos la card con el boton habilitado
			$('#cardDiv').append(`
			<div class="col-lg-3 col-md-6 col-xs-12" id="cardContainer">
				<div class="cardData">
					<img src="${prod.img}" class= "imgCard">
					<h2 class= "nameCard">${prod.dibujo}</h2>
					<p class= "pCard">${prod.medida}</p>
					<p class= "pCard">${prod.uso}</p>
					<h2 class= "priceCard"> Precio $ ${prod.precio}</h2>
					<button class= "cardButton" id="${prod.id}">AGREGAR</button>
				</div>
			</div>
			`);
			//agregamos los productos haciendo click en el boton
			$(`#${prod.id}`).on('click', () => {
				agregarProducto(`${prod.id}`);
			});
			//el boton se deshabilita una vez que se hizo click en el mismo
			$(`#${prod.id}`).click(function() {
				$(this).prop('disabled', true).text ('AGREGADO').css ({'background':'#b1b1b2', 'color':'white'});
			});	
		};
	};
};

//---- RENDERIZAR TABLA CON EL CARRITO ----//
function renderizarTabla(){
	$('#cartDiv').append(`
		<div class="col-lg-12 col-md-12 col-xs-12" id="cartContainer">
			<h2 class="titulos">CARRITO DE COMPRAS</h2>
			<table class="table">
				<tr>
					<th>ID</th>
					<th></th>
					<th>DIBUJO</th>
					<th>PRECIO</th>
					<th>ACCION</th>
				</tr>
				<tbody id="tablaCarrito">
				</tbody>
			</table>
		</div>
	`);
};

//---- RENDERIZAR LOS TOTALES (PRECIO Y CANTIDAD) ----//
function renderizarTotales(){
	$('#cartDiv').append(`
		<h2 class="col-lg-3 col-md-6 col-xs-12 totales">Total de tu compra:</h2>
		<h2 id="montoTotal" class="col-lg-3 col-md-6 col-xs-12 totales">0</h2>
		<h2 class="col-lg-3 col-md-6 col-xs-12 totales">Productos totales:</h2>
		<h2 id="prodTotales" class="col-lg-3 col-md-6 col-xs-12 totales">0</h2>
		`);
};

//---- FUNCION PARA CALCULAR TOTALES CARRITO A RENDERIZAR----//
function calcularTotalCarrito() {
	//los totales inician en 0
	let total = 0;
	//sumamos todos los precios del carrito
	for (const prodCarrito of carrito) {
        total += prodCarrito.precio;
    };
	//cambiamos el valor del total por la sumatoria de los precios
	$('#montoTotal').text('$' + total)
	//cambiamos la cantidad por la ongitud del array carrito
	$('#prodTotales').text(carrito.length)
};

//---- RENDERIZAR BOTON PARA CONTINUAR COMPRA Y BOTON PARA VACIAR CARRITO ----//
function renderizarContCompra(){
	$('#cartDiv').append(`
		<div class="col-lg-6 col-md-6 col-xs-12">
			<button id="botVaciar">VACIAR CARRITO</button>
		</div>
		<div class="col-lg-6 col-md-6 col-xs-12">
			 <button id="botContinuar">CONTINUAR COMPRA</button>
		</div>
		`)
	//evento click  apra vaciar el carrito
	$('#botVaciar').click(function(){
		vaciarCarrito();
	})
	//evento click para continuar la compra y mostrar el formulario de datos del usuario
	$('#botContinuar').click(function(){
		$('#formDiv').empty();
		mostrarFormulario()
	});
};

//---- RENDERIZAR TARJETA DE CREDITO PARA FINALIZAR LA COMPRA ----//
function renderizarPayment(){
	$('#paymentDiv').append(`
		<div class="col-lg-12 col-md-12 col-xs-12">
			<div id="creditCard" style="display: none" >
				<div class="imgCard">
					<img src="../assets/img/card/chipCard.png" alt="chipCard class="cardIcons" id="chipCard">
					<img src="../assets/img/logoMMX.svg" alt="logoCard" class="cardIcons" id="logoCard">
				</div>
				<form id="formCard">
					<div class="form-group">
						<label for="numCard">Ingresa los numeros de la tarjeta</label>
						<input id="numCard" type="number" placeholder="Nº tarjeta" />
					</div>
					<div class="form-group">
						<label for="nameCard">Ingresa el nombre como figura en la tarjeta</label>
						<input id="nameCard" type="text" placeholder="nombre y apellido">
					</div>
					<div class="form-row">
						<div class="inputCRow">
							<label for="mesCard">Vencimiento</label>
							<input id="mesCard" type="number" max="12" placeholder="MM" />
							<input id="anioCard" type="number" min="22" placeholder="AA" />
							<label for="cvv">CVV</label>
							<input id="cvv" type="password" maxlength="3placeholder="CVV" />
						</div>
					</div>
					<input id="finCompra" type="submit" value="PAGAR" />
				</form>
			</div>
        </div>
	`);
	// limitamos la cantidad de numeros en 16 en numeros de tarjeta
	$('#numCard').on('input', function(){
		if (this.value.length > 16) {
			this.value = this.value.slice(0,16); 
		}
	});
	// limitamos la cantidad de numeros en 2 para mes y año
	$('#mesCard').on('input', function(){
		if (this.value.length > 2) {
			this.value = this.value.slice(0,2); 
		}
	});
	$('#anioCard').on('input', function(){
		if (this.value.length > 2) {
			this.value = this.value.slice(0,2); 
		}
	});
	//evento click para validar todos los datos de la tarjeta
	$('#formCard').on('submit', function(e){
		validarTarjeta(e);
	});
};

                    //---------------------//
                    //------ EVENTOS ------//
                    //---------------------//

//---- EVENTO - FUNCION PARA AGREGAR Y MOSTRAR PRODUCTOS SELECCIONADOS ----//
function agregarProducto(id){
	//buscamos en productosJSON el producto cuyo id coincida con el seleccionado
	let productoElegido =productosJSON.find(prod => prod.id ==id);
	//pusheamos el producto al carrito
	carrito.push(productoElegido);
	//mostramos el alerta de SUCCESS
	Swal.fire({
		position: 'center',
		icon: 'success',
		title: 'PRODUCTO AGREGADO AL CARRITO',
		showConfirmButton: false,
		timer: 1000
	});
	console.log (carrito);
	//mostramos el producto en la tabla del carrito en HTML
	productoElegido = mostrarEnTabla();
	//cargamos carrito al local storage
	localStorage.setItem('cartLS', JSON.stringify(carrito));
	//volvemos a calcular los totales del carrito (precio y cantidad)
	calcularTotalCarrito();
};

//---- FUNCION PARA MOSTRAR PRODUCTOS EN LA TABLA DEL CARRITO AL AGREGAR LOS PRODUCTOS ----//
function mostrarEnTabla(){
	//primero vaciamos la tabla para ir actualizando a medida que se agrega cada producto al carrito
	$("#tablaCarrito").empty();
	//agregamos la fila de cada producto del carrito
	for (const prod of carrito){
		$('#tablaCarrito').append(`
			<tr id="fila${prod.id}">
				<td>${prod.id}</td>
				<td class="tableImg"><img src="${prod.img}"></td>
				<td>${prod.dibujo}</td>
				<td>$ ${prod.precio}</td>
				<td><button class="botStyle" id="eliminar${prod.id}">ELIMINAR</button></td>
			</tr>
		`)
		//evento click para eliminar el producto del carrito
		$(`#eliminar${prod.id}`).click(function(){
			//buscamos el indice del producto en el carrito
			let prodEliminar = carrito.findIndex(producto => producto.id == prod.id);
			//eliminamos el producto que ocupa la posicion encontrada
			carrito.splice(prodEliminar, 1);
			//eliminamos la fila de este producto en la tabla
			$(`#fila${prod.id}`).remove();
			//volvemos a calcular los totales del carrito (precio y cantidad)
			calcularTotalCarrito();
			//cuando eliminamos el producto del carrito vuelve a habiliatrse el boton de la card para poder volver a agregar el producto si asi lo deseamos
			$(`#${prod.id}`).removeAttr('disabled').text ('AGREGAR').css ({'background':'#EEC5B9', 'color':'#575757'});
			console.log('se elimino del carrito: ', prod.dibujo);
			//volvemos a cargar el carrito al LocalStorage
			localStorage.setItem('cartLS', JSON.stringify(carrito));
		});
		console.log('se agrego al carrito: ', prod.dibujo);
	};
};

//---- EVENTO - FUNCION PARA VACIAR EL CARRITO ----//
function vaciarCarrito(){
    if (carrito.length == 0){
		//si el carrito esta vacio mostramos un alerta que ya lo esta
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'NO HAY PRODUCTOS EN EL CARRITO',
			showConfirmButton: false,
			timer: 1500
		});
	}else{
		//si el carrito tiene productos lo vaciamos
        carrito = [];
		//eliminamos el carrito del LocalStorage
		localStorage.removeItem('cartLS');
		//mostramos un alerta que el carrito fue vaciado
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: 'CARRITO VACIO',
			showConfirmButton: false,
			timer: 1000
		});
		//al vaciar el array carrito vaciamos el div contenedor de las cards y volvemos a renderizarlas reiniciando los botones de las mismas 
		$("#cardDiv").empty();
		renderizarCards();
		//vaciamos la tabla que muestra los productos del carrito
		$("#tablaCarrito").empty();
		//vovlemos a calcular los totales
		calcularTotalCarrito();
    };
};

//---- EVENTO - MOSTRAR FORMULARIO ----//
function mostrarFormulario(){
	if (carrito.length == 0){
		//si el carrito esta vacio mostramos un alerta que no hay productos y no se puede continuar
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'NO HAY PRODUCTOS EN EL CARRITO',
			showConfirmButton: false,
			timer: 1500
		});
	}else{
		//si hay productos en el carrito renderizamos el formulario para ingresar los datos del cliente
		$('#formDiv').append(`
			<div class="col-lg-12 col-md-12 col-xs-12">
				<h2 class="titulos"> COMPLETA TUS DATOS</h2> 
				<p>Todos los campos son oblicatorios</p>
				<form id="formClient">
					<input id="nombre" type="text" placeholder="NOMBRE Y APELLIDO" />
					<input id="email" type="email" placeholder="EMAIL" />
					<input id="telefono" type="number" placeholder="TELEFONO" />
					<input id="botonForm" type="submit" value="CONFIRMAR DATOS" />
				</form>
			</div>
		`);
		//evento para validar formulario con el submit
		$('#formClient').on('submit', function(e){
			validarForm(e);
		});
	};
};

//---- EVENTO - FUNCION PARA LA VALIDACION DE FORMULARIO AL DAR SUBMIT ----//
function validarForm(e){
	//prevenimos comportamiento del formulario 
    e.preventDefault();
	//verificamos que los campos no esten vacios y cumplan con las caracteristicas necesarias
	if ($('#nombre').val()== "" || $('#nombre').val()== "" || $('#telefono').val()== "" || isNaN($('#telefono').val())) {
		//si no cumple con la validacion mostramos un alerta para revisar los campos del formulario
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'POR FAVOR REVISA LOS DATOS',
			showConfirmButton: false,
			timer: 1500
		});
	}else{
		//si cumple con la validacion pusheamos los datos del formulario al array clientes 
		clientes.push(new Cliente($('#nombre').val(), $('#email').val(), $('#telefono').val()));
		$('#creditCard').slideToggle(1500);
	};
};

//---- EVENTO - FUNCION PARA VALIDACION DE LA TARJETA DE CREDITO ---//
function validarTarjeta(e){
	//prevenimos comportamiento del formulario 
    e.preventDefault();
	if ($('#numCard').val()== "" || $('#nameCard').val()== "" || $('#mesCard').val()== "" || $('#anioCard').val()== "" || $('#cvv').val()== "" ){
		//si no cumple con la validacion mostramos un alerta para revisar los campos del de la tarjeta
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'POR FAVOR REVISA Y COMPLETA TODOS LOS CAMPOS',
			showConfirmButton: false,
			timer: 1500
		});
	}else if (isNaN($('#cvv').val())) {
		//si no cumple con la validacion mostramos un alerta para revisar los campos del de la tarjeta
		Swal.fire({
			position: 'center',
			icon: 'error',
			title: 'CVV INCORRECTO',
			showConfirmButton: false,
			timer: 1500
		});
	}else{
		//mostramos un alerta de pago aprobado
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: 'PAGO APROBADO',
			text: 'Muchas gracias por tu compra, pronto me pondre en contacto para el envio de los archivos',
			showConfirmButton: false,
			timer: 2500
		});
		//armamos el array de pedido confirmado con los datos del usuario (array clientes) y los productos que pidio (array carrito)
		let pedidoConfirmado = clientes.concat(carrito);
		//cargamos en el LocalStorage el pedido confirmado
		localStorage.setItem('pedidoConfirmado', JSON.stringify(pedidoConfirmado));
		//Borramos el carrito que ya fue confirmado como pedido
		localStorage.removeItem('cartLS');
		console.log(pedidoConfirmado);
		//recargamos la pagina una vez que ya se confirmo el pedido. 
		setTimeout(function() {
			window.location.reload();
		}, 4000);
	};
};