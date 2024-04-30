var cardproduct;

$(document).ready(() => {

    $.ajax({
        method: 'get',
        url: './api/getallproduct.php',
        success: function(response) {
            console.log(response)
            if(response.RespCode == 200) {

                cardproduct = response.Result;

                var html = '';
                for (let i = 0; i < cardproduct.length; i++) {
                    html += `<div data-bs-toggle="modal" data-bs-target="#productModal" onclick="openProductDetail(${i})" class="product-item col-12 col-xl-4 ${cardproduct[i].type}">
                                <div class="card h-100 pop">
                                    <img src="./images/${cardproduct[i].img}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                    <h5><span class="badge text-bg-danger">${cardproduct[i].tag}</span> ${cardproduct[i].name}</h5>
                                    <p class="card-text">${cardproduct[i].description} <br><br><br> <h3>฿${numberWithCommas(cardproduct[i].price)}</h3> </p>
                                    </div>
                                </div>
                            </div>`;
                }
                $("#card_toplist").html(html);
            }
        }, error: function(error) {
            console.log(error)
        }
    })
})

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function searchitem(elem) {
    var value = $('#'+elem.id).val()
    console.log(value)

    var html = '';
    for (let i = 0; i < cardproduct.length; i++) {
        if(cardproduct[i].name.includes(value)) {
            html += `<div data-bs-toggle="modal" data-bs-target="#productModal" onclick="openProductDetail(${i})" class="product-item col-12 col-xl-4 ${cardproduct[i].type}">
                            <div class="card h-100 pop">
                                <img src="./images/${cardproduct[i].img}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5><span class="badge text-bg-danger">${cardproduct[i].tag}</span> ${cardproduct[i].name}</h5>
                                <p class="card-text">${cardproduct[i].description} <br><br><br> <h3>฿${numberWithCommas(cardproduct[i].price)}</h3> </p>
                                </div>
                            </div>
                        </div>`;
        }
    }
    if(html == "") {
        $("#card_toplist").html(`<h2>Not Found</h2>`);
    } else {
        $("#card_toplist").html(html);
    }
}

function searchproduct(param) {
    console.log(param)
    $(".product-item").css('display', 'none')
    if(param == 'all') {
        $(".product-item").css('display', 'block')
    }
    else {
        $("."+param).css('display', 'block')
    }
}

var productindex = 0;
function openProductDetail(index) {
    productindex = index;
    console.log(productindex)
    $("#productModal").css('display' , 'flex');
    $("#mdd-img").attr('src', './images/' + cardproduct[index].img);
    $("#mdd-name").text(cardproduct[index].name);
    $("#mdd-desc").text(cardproduct[index].description);
    $("#mdd-price").text('฿' + numberWithCommas(cardproduct[index].price));
}

var cart = [];
function addtocart() {
    var pass = true;

    for (let i = 0; i < cart.length; i++) {
        if( productindex == cart[i].index ) {
            console.log('found same product')
            cart[i].count++;
            pass = false;
        }
    }

    if(pass) {
        var obj = {
            index: productindex,
            id: cardproduct[productindex].id,
            name: cardproduct[productindex].name,
            price: cardproduct[productindex].price,
            img: cardproduct[productindex].img,
            count: 1
        };
        cart.push(obj)
    }
    console.log(cart)
      
    Swal.fire({
        icon: 'success',
        title: 'Add ' + cardproduct[productindex].name + ' to cart!!!',
        timer: 1500
    })
    $("#countcart").css('display','flex').text(cart.length)
}

function openCart() {
    $('#modalCart').css('display','flex')
    rendercart();
}

function rendercart() {
    if(cart.length > 0) {
        var html = '';
        html += `<div class="container">
                    <div class="row g-5">
                    <div class="col-md-12 col-lg-12">
                        <h4 class="mb-3">Billing address</h4>
                        <form class="needs-validation" novalidate="">
                        <div class="row g-3">
                            <div class="col-sm-6">
                            <label for="firstName" class="form-label">First name</label>
                            <input type="text" class="form-control" id="txtFName" placeholder="" value="" required="">
                            <div class="invalid-feedback">
                                Valid first name is required.
                            </div>
                            </div>
                
                            <div class="col-sm-6">
                            <label for="lastName" class="form-label">Last name</label>
                            <input type="text" class="form-control" id="lastName" placeholder="" value="" required="">
                            <div class="invalid-feedback">
                                Valid last name is required.
                            </div>
                            </div>
                
                            <div class="col-12">
                            <label for="email" class="form-label">Email <span class="text-body-secondary">(Optional)</span></label>
                            <input type="email" class="form-control" id="email" placeholder="yourmail@gmail.com">
                            <div class="invalid-feedback">
                                Please enter a valid email address for shipping updates.
                            </div>
                            </div>
                
                            <div class="col-12">
                            <label for="address" class="form-label">Tel.</label>
                            <input type="text" class="form-control" id="tel" placeholder="0642345678" required="">
                            <div class="invalid-feedback">
                                Please enter your Telephone Number.
                            </div>
                            </div>
                
                            <div class="col-12">
                            <label for="address2" class="form-label">Address</label>
                            <input type="text" class="form-control" id="address2" placeholder="ที่อยู่ แขวง เขต">
                            </div>
                
                            <div class="col-md-5">
                            <label for="country" class="form-label">Country</label>
                            <select class="form-select" id="country" required="">
                                <option value="">Choose...</option>
                                <option>กรุงเทพมหานคร</option>
                            </select>
                            <div class="invalid-feedback">
                                Please select a valid country.
                            </div>
                            </div>
                
                            <div class="col-md-4">
                            <label for="state" class="form-label">State</label>
                            <select class="form-select" id="state" required="">
                                <option value="">Choose...</option>
                                <option>ลาดกระบัง</option>
                            </select>
                            <div class="invalid-feedback">
                                Please provide a valid state.
                            </div>
                            </div>
                
                            <div class="col-md-3">
                            <label for="zip" class="form-label">Zip</label>
                            <input type="text" class="form-control" id="zip" placeholder="" value="10520" required="">
                            <div class="invalid-feedback">
                                Zip code required.
                            </div>
                            </div>
                        </div>
                        <br>
                        </form>
                    </div>
                    </div>
                </div>`;
        for (let i = 0; i < cart.length; i++) {
            html += `<div class="modalcart-list">
                        <div class="modalcart-content">
                        <div class="modalcart-left">
                            <img class="me-3" src="./images/${cart[i].img}">
                            <div class="modalcart-detail">
                            <p>${cart[i].name}</p>
                            <p>฿${numberWithCommas(cart[i].price * cart[i].count)}</p>
                            </div>
                        </div>
                        <div class="modalcart-right">
                            <p onclick="deinitems('-' , ${i})" class="addout">-</p>
                            <p id="countitems${i}" style="margin: 0 70px;">${cart[i].count}</p>
                            <p onclick="deinitems('+' , ${i})"  class="addout">+</p>
                        </div>
                        </div>
                    </div>`;
        }
    
        $("#mycart").html(html)
    }
    else {
        $("#mycart").html(`<p>Not found product list</p>`)
    }
}

function deinitems(action, index) {
    if(action == '-') {
        if(cart[index].count > 0) {
            cart[index].count--;
            $("#countitems"+index).text(cart[index].count)

            if(cart[index].count <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure to delete?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }).then((res) => {
                    if(res.isConfirmed) {
                        cart.splice(index, 1)
                        console.log(cart)
                        rendercart();
                        $("#countcart").css('display','flex').text(cart.length)

                        if(cart.length <= 0) {
                            $("#countcart").css('display','none')
                         }
                    }
                    else {
                        cart[index].count++;
                        $("#countitems"+index).text(cart[index].count)
                        rendercart();
                      }
                })
            }
            rendercart();
        }
    }
    else if(action == '+') {
        cart[index].count++;
        $("#countitems"+index).text(cart[index].count)
        rendercart();
    }
}

function buynow() {
    var firstName = $('#txtFName').val();
    var lastName = $('#lastName').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var address = $('#address2').val();
    var country = $('#country').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    $.ajax({
        method: 'post',
        url: './api/buynow.php',
        data: {
            product: cart,
            fname: firstName,
            lname: lastName,
            email: email,
            tel: tel,
            address: address,
            country: country,
            state: state,
            zip: zip
        },  success: function(response) {
            console.log(response)
            if(response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thank you',
                    html: ` <p> Amount : ${response.Amount.Amount} ฿</p>
                            <p> Shipping : ${response.Amount.Shipping} ฿</p>
                            <p> Vat : ${response.Amount.Vat} ฿</p>
                            <p> ราคารวมทั้งสิ้น : ${response.Amount.Netamount} ฿</p>
                            <p> ระยะเวลาจัดส่ง 7 - 10 วัน</p>`
                }).then((res) => {
                    if(res.isConfirmed) {
                        cart = [];
                        $("#countcart").css('display','none')
                        $('#cartModal').modal('hide');
                    }
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '!!Something is went wrong!!'
                })
            }
        }, error: function(error) {
            console.log(error)
        }
    })
}