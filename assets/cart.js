// Cart js
// Author: Shailesh Kumar Dangi

loadJson();
function loadJson() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse((this.responseText.toString()));
			var html = '';
			data.items.forEach(function (item) {
				html += ProductList(item);
			});
			document.getElementById("ProductList").innerHTML = html;//'<h1>HI</h1>';
		}
	};
	xhttp.open("GET", "./assets/cart.json", true);
	xhttp.send();
}

function ProductList(item, index) {
	return ("<div class='item-wrap'>\
					<div class='items'>\
						<div class='product-top'>\
							<div class='flash'>"+ item.discount + "% off</div>\
						</div>\
						<div class='item-image'>\
							<img class='image-size' src='"+ item.image + "' alt='cart image' />\
						</div>\
						<div class='product-details'>\
							<div class='product-name'>\
								<h5>"+ item.name + "</h5>\
							</div>\
							<div class='product-add'>\
								<div class='product-prices'>\
									<h5 class='product-price'>&#36;"+ item.price.display + "</h5>\
									<h5>&#36;"+ item.price.actual + "</h5>\
								</div>\
								<button class='product-add-cart-button' onclick='addToCartButtons("+ JSON.stringify(item) + ");'>Add to cart</button>\
							</div>\
						</div>\
					</div >\
				</div>");
}

// Increase and decrease function
function increaseItem(evt) {
	evt.preventDefault();
	var inputTarget = evt.target.parentNode.childNodes[3];
	var value = parseInt(inputTarget.value);

	if (value <= 100) {
		value = value + 1;
	} else {
		value = 100;
	}
	inputTarget.value = value;
	updateCartTotal();
}

function decreaseItem(evt) {
	evt.preventDefault();
	var inputTarget = evt.target.parentNode.childNodes[3];
	var value = parseInt(inputTarget.value);
	if (value > 1) {
		value = value - 1;
	} else {
		value = 0;
		evt.target.parentElement.parentElement.remove(); // if value zero remove item from cart
	}
	inputTarget.value = value;
	updateCartTotal();
}

function removeItem(event) {
	var buttonClicked = event.target
	buttonClicked.parentElement.parentElement.parentElement.parentElement.remove()
	updateCartTotal();
}

function addToCartButtons(item) {
	var messgeId = document.getElementById("message");
	var cartItemNames = document.getElementsByClassName('cart-item-title');
	var cartRows = document.getElementsByClassName('cart-item-list');
	for (var i = 0; i < cartItemNames.length; i++) {  // For increment of quantity
		if (cartItemNames[i].innerText == item.name) {
			var inputTarget = cartRows[i].getElementsByClassName('cart-quantity-input')[0];
			var inputValue = parseInt(inputTarget.value);
			inputTarget.value = inputValue + 1;
			updateCartTotal();
			return
		}
	}

	var cartRowHtml = "<div class='cart-item-list'>\
						<div class='width-50'>\
							<div class='cart-item-name'>\
								<img src='"+ item.image + "' style='width: 25px; height: 25px;'>&nbsp;\
								<p><span class='cart-item-title'>"+ item.name + "</span>&nbsp;\
									&nbsp;&nbsp;<span class='cart-remove' onclick='removeItem(event)'>x</span></p>\
							</div>\
						</div>\
						<div class='width-20 quantity'>\
							<button class='plus-btn' onclick='increaseItem(event);' type='button' name='button'>\
								+\
							</button>\
							<input type='text' class='cart-quantity-input' name='name' value='1' />\
							<button class='minus-btn' onclick='decreaseItem(event);' type='button' name='button'>\
								-\
							</button>\
						</div>\
						<div class='width-20'>\
							<input type='hidden' class='cart-item-price-display' value='"+ item.price.display + "'/>\
							<input type='hidden' class='cart-item-discount' value='"+ item.discount + "'/>\
							<span class='cart-item-price' > $"+ item.price.actual + "</span >\
						</div>\
					</div>";

	document.getElementById("cartRow").insertAdjacentHTML('beforeend', cartRowHtml);
	messgeId.innerText = item.name + ' is added to the cart';
	updateCartTotal();
}


/**
 * update cart value
 */
function updateCartTotal() {
	var cartItemContainer = document.getElementsByClassName('cart-items')[0];
	var cartRows = cartItemContainer.getElementsByClassName('cart-item-list');
	var total = 0;
	var displayTotal = 0;
	for (var i = 0; i < cartRows.length; i++) {
		var cartRow = cartRows[i];
		var priceElement = cartRow.getElementsByClassName('cart-item-price')[0];
		var priceElementDisplay = cartRow.getElementsByClassName('cart-item-price-display')[0].value;
		var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
		var price = parseFloat(priceElement.innerText.replace('$', ''));
		var quantity = quantityElement.value;
		var priceDisplay = parseFloat(priceElementDisplay);
		displayTotal = displayTotal + (priceDisplay * quantity);
		total = total + (price * quantity);
	}
	// set all place number of items
	var itemValue = document.getElementsByClassName("cart-item-total");
	for (var i = 0; i < itemValue.length; i++) {
		itemValue[i].innerText = cartRows.length;
	}

	displayTotal = Math.round(displayTotal * 100) / 100;
	total = Math.round(total * 100) / 100;
	var discountPrice = displayTotal - total;
	document.getElementsByClassName('price-discount')[0].innerText = '-$' + discountPrice;
	document.getElementsByClassName('price-items')[0].innerText = '$' + displayTotal;
	document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}