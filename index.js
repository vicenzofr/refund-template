// Selecionar os elementos do input 

const amount = document.getElementById("amount")
const expense  = document.getElementById("expense")
const category = document.getElementById("category")
const form = document.querySelector("form")

// Seleciona os elementos na lista 
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2") 


amount.oninput = () => {
    //remove string 
    let value = amount.value.replace(/\D/g, "")
     
    // transformar o valor para centavos 
    value = Number(value) /100 
    amount.value = formatCurrencyBRL(value)

}

//formatar para REAL R$ 

function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR", {
        style:"currency",
        currency: "BRL",
    })

    return value
}


// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) =>{
    //  nao recarregar a pagina 
    event.preventDefault()
    
// criar um objeto com os datalhes na nova despesa 
    const newExpense = {
        id: new Date().getTime(),
        expense:expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    // chama a funcao que ira adicionar o item na lista
    expenseAdd(newExpense)
}

// Adicionar um novo item na lista 
function expenseAdd(newExpense){
    try {   
        // Cria um elemento de LI para adicionar na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Criar o icone da categoria 
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg` )
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Criar a info da despesa 
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Criar o nome da despensa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa 
        const expenseCategory= document.createElement("span")   
        expenseCategory.textContent = newExpense.category_name

        // Cria o valor das despesas 
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expenseAmount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}` 

        // Cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // Limpa o formulario para adicionar um novo item 
        formClear()

        // Adiciona name e categoria na div das informacoes da despesa
        expenseInfo.append(expenseName, expenseCategory)

        // Adicionar as informacoes nos icones
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
        // Adicionar  o item na lista 
        expenseList.append(expenseItem)

        updateTotals()



        

    }catch (error){
        alert("nao foi possivel add na lista de despesas")
        console.log(error)
    }
}

// Atualizar o total 
function updateTotals(){
    try {
        //Recuperar toso os itens li da lista 
        const items = expenseList.children

        // Atualizar a quatidade de item na lista 
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesas"}`
        
        // Variavel para incrementar o total 
        let total = 0 

        // Percorre cada item (li) da lista (ul)
        for (let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expenseAmount")

            // remove caracteres nao numericos e substiui a virtgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            
            // converte o valor para float 
            value = parseFloat(value)

            // verificar se é um numero valido
            if(isNaN(value))
            { return alert("nao foi possivel calcular o valor total")
            }

            // incrementar o valor total 
            total += Number(value)
        }

        // Criar a span para adicionar o R$ formatado 
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
        
        // Limpa o conteudo do elemento 
        expenseTotal.innerHTML = ""

        // adiciona o simbolo e o valor 
        expenseTotal.append(symbolBRL, total)

    }catch (error){
        console.log(error)
        alert("nao foi possivel add na lista de despesas")      
    }
}

// evento que captura o clique nos itens da lista 
expenseList.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-icon")){
        // Obtem a li pai do elemento clicado 
        const item = event.target.closest(".expense")
       
        //remove o item
        item.remove()
    }

    updateTotals()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    // coloca focu no input de amount 
    expense.focus()
}



