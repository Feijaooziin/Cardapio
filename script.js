const menu                = document.getElementById("menu")
const cartBtn             = document.getElementById("cart-btn")
const cartModal           = document.getElementById("cart-modal")
const cartItemsContainer  = document.getElementById("cart-items")
const cartTotal           = document.getElementById("cart-total")
const checkoutBtn         = document.getElementById("checkout-btn")
const closeModalBtn       = document.getElementById("close-modal-btn")
const cartCounter         = document.getElementById("cart-count")
const addressInput        = document.getElementById("address")
const addressWarn         = document.getElementById("address-warn")

//Colocar os horários em formato de 24HRS
const openRestaurant      = 18
const closeRestaurant     = 22
const spanItem            = document.getElementById("date-span")
const isOpen              = checkRestaurantOpen();

let cart = [];

//Abrindo o Modal do Carinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechando o Modal do Carrinho quando clicarr fora dele
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//Botão de fechar o Modal Carrinho
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

//Botão de adicionar produtos ao Carrinho
menu.addEventListener("click", function(event) {

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionando no Carrinho
        addToCart(name, price)
    }
})

//Função para adicionar produtos ao Carrinho
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    //Se o Item já existe aumenta apenas a quantidade
    if(existingItem){

        existingItem.quantity += 1;

    }else{

        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()

}

//Atualizando o Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency:"BRl"
    });

    cartCounter.innerText = cart.length;

}

//Função para Remover Itens do Carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//Pegando o endereço digitado no Carrrinho
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    //Verificando se tem Endereço
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

//Finalizando Pedido
checkoutBtn.addEventListener("click", function() {

    if(!isOpen){

        Toastify({
            text: "RESTAURANTE FECHADO!!!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Enviando o pedido via whatsapp
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone   = "41995287020"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//Checando se Restaurante está aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= openRestaurant && hora < closeRestaurant; //True = Restaurante está aberto
}

if(isOpen){
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-600");
    spanItem.classList.remove("bg-green-600");
}