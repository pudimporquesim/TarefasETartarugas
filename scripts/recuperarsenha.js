inp_senhat = document.getElementById('senhat');
inp_trocar = document.getElementById('trocar');
inp_hash = document.getElementById('hash');

inp_trocar.addEventListener('click', function() {
  trocarsenha(inp_senhat.value, inp_hash.value);
});

function trocarsenha(senha, hash) {
  $.post("php/recuperarsenhapt2.php", {senhat: senha, hash: hash})
  .done(function(data) {
    if (data.error != undefined) {
      console.log(data.error);
    } else if (data.success != undefined) {
      console.log(data.success);
    }
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error('Erro na requisição:', textStatus, errorThrown);
  });
}