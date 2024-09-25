const menu                = document.getElementById("menu")
const cartBtn             = document.getElementById("cart-btn")
const cartModal           = document.getElementById("cart-modal")
const cartItemsContainer  = document.getElementById("cart-items")
const cartTotal           = document.getElementById("cart-total")
const checkoutBtn         = document.getElementById("checkout-btn")
const closeModalBtn       = document.getElementById("close-modal-btn")
const cartCounter         = document.getElementById("cart-count")
const nameInput           = document.getElementById("name")
const nameWarn            = document.getElementById("name-warn")
const addressInput        = document.getElementById("address")
const addressWarn         = document.getElementById("address-warn")

//Colocar os horários em formato de 24HRS
const openRestaurant      = 11
const closeRestaurant     = 23
const spanItem            = document.getElementById("date-span")
const isOpen              = checkRestaurantOpen();

let cart = [];

//Abrindo o Modal do Carinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechando o Modal do Carrinho quando clicar fora dele
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
                <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div>
                <button class="add-from-cart-btn hover:font-bold hover:text-green-500" data-name="${item.name}">
                    + Adcionar
                </button>

                <button class="remove-from-cart-btn hover:font-bold hover:text-red-500" data-name="${item.name}">
                    Remover -
                </button>
            </div>
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

//Função para Remover e Adicionar Itens do Carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

    if(event.target.classList.contains("add-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        addItemCart(name);
    }
})

//Removendo
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

//Adicionando
function addItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity !== 0){
            item.quantity += 1;
            updateCartModal();
            return;
        }
    }
}

//Pegando o nome digitado no Carrrinho
nameInput.addEventListener("input", function(event) {
    let inputValueName = event.target.value;

    //Verificando se tem algum Nome
    if(inputValueName !== ""){
        nameInput.classList.remove("border-red-500");
        nameWarn.classList.add("hidden");
    }
})

//Pegando o endereço digitado no Carrrinho
addressInput.addEventListener("input", function(event) {
    let inputValueAddress = event.target.value;

    //Verificando se tem algum Endereço
    if(inputValueAddress !== ""){
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
    if(nameInput.value === ""){
        nameWarn.classList.remove("hidden");
        nameInput.classList.add("border-red-500");
        return;
    }

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Enviando o pedido via whatsapp
    const cartItems = cart.map((item) => {
        return (
            `*_${item.name}_*\n*Quantidade:* ${item.quantity}\n*Preço:* R$${(item.price * item.quantity).toFixed(2)}\n------------------------------\n`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone   = "41995287020"
    let totalCompra = 0
    
    totalCompra = cartTotal.textContent

    window.open(`https://wa.me/${phone}?text=*Nome p/ Entrgega:*%0d%0a${nameInput.value}%0d%0a%0d%0a*Itens:*%0d%0a${message}*Total:* ${totalCompra}%0d%0a*Endereço:* ${addressInput.value}`, "_blank")

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