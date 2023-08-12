//Al cargar
window.onload = function() {
    //Preloader
    $("#preloader").fadeOut(2000);
    //Evantos de navegador
    inputStyles();
    $(".navbar-nav").find("input").change(inputStyles);
    //Comprobar si hay un enlace interno
    goToPage();
    //Añade hook a links internos
    $(".internal_link").on( "click",linkInternoHook);
    //Imag hacker
    hackerTransition();
};

//Comportamiento menu medium
$('.sub-menu ul').hide();
$(".submenu-custom").click(function () {
    $(this).parent().children("ul").slideToggle("100");
    $(this).find(".fa").toggleClass("fa-caret-up fa-caret-down");
    $(this).find(".sub-tog").toggleClass("sub-tog-up sub-tog-down");
});

//Función tachado menus
function inputStyles() {
    $(".navbar-nav").find("input").each(function(){
        if(this.checked){
            $(this).parent().addClass("nav-selectedsub");
        }else{
            $(this).parent().removeClass("nav-selectedsub");
        }
    })
    //Comprueba si todos los subitem están checkeados
    $(".nav-item").each(function(){
        var auxitem=true
        $(this).find("input").each(function(){
            auxitem &= this.checked;
        })
        if (auxitem){
            $(this).addClass("nav-selectedsub");
            if($(this).children("ul").is(':visible')){
                $(this).children("ul").slideToggle("100");
                $(this).find(".fa").toggleClass("fa-caret-up fa-caret-down");
                $(this).find(".sub-tog").toggleClass("sub-tog-up sub-tog-down");
            }
        }else{
            $(this).removeClass("nav-selectedsub");
        }
    })
}

/*Para boton de copy en snipets*/
function addCopyButtons(){
    // use a class selector if available
    let blocks = document.querySelectorAll(".snipet_custom");
    blocks.forEach((block) => {
    // only add button if browser supports Clipboard API
    if (navigator.clipboard) {
        let button = document.createElement("button");

        button.innerHTML = '<i class="bi bi-clipboard"></i>';
        block.appendChild(button);

        button.addEventListener("click", async () => {
        await copyCode(block, button);
        });
    }
    });
}
async function copyCode(block, button) {
  let code = block.querySelector("code");
  let text = code.innerText;

  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed
  button.innerHTML = '<i class="bi bi-clipboard-check"></i>';

  setTimeout(() => {
    button.innerHTML = '<i class="bi bi-clipboard"></i>';
  }, 700);
}

/*Función para cargar la página según link interno*/
function goToPage() {
    var hash = window.location.hash.replace("#","");
    if(hash != ""){
        var url = "./pages/"+hash
        //Se realiza la petición a la URL
        $.get(url+".html", function(data) {
            //Si está en móvil pliega el menú
            mobileClose();
            //Se sobreescribe la información
            $("#mainContent").slideUp(300,function() {
                $(this).html(data).slideDown(300,function(){Rainbow.color();addCopyButtons();});
                $("#hntext").html("/"+hash.replace("/"," /"));
                $(this).find(".internal_link").on( "click",linkInternoHook);
                SetCurrentPageInMenu();
              })
        });
    }
}

/*Hook click links internos*/
function linkInternoHook() {
    hash=this.getAttribute('href');
    window.location=window.location.pathname+hash;
    goToPage();
}

/*Cambiar estilo del link donde se encuentra*/
function SetCurrentPageInMenu() {
    for (var item of  $(".internal_link")) {
        if(item.getAttribute("href") == window.location.hash){
            item.classList.add("SelectedItem");
        }
        else{
            item.classList.remove("SelectedItem");
        }
    }
}


/*En móvil, pliega menu al pulsar link*/
function mobileClose() {
    //Si está en modo móvil y el menú está desplegado
    if($(".navbar-toggler").is(':visible') && $("#navbarResponsive").is(':visible')){
        $("#navbarResponsive").removeClass("show");
    }
}

/* Transición de imágen hacker */
function hackerTransition() {
    if(window.location.hash.replace("#","")==""){
        $("#mainImag").attr("src","./media/imag/transition.gif").delay(2500).queue(function() {
            $("#mainImag").attr("src","./media/imag/hacker.gif");
            $(this).dequeue();
         });
    }
}