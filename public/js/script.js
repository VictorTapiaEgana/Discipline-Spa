 $(document).ready(function(){
    
    $('button').on('click', function() {
        const partial = $(this).data('seccion');       

        $.get(`/${partial}`, function(data) {
            $('#error').text("");
            $('#content').html(data);        
        });
    });

    $('#content').on('change', 'select[name=deportes1]', function(){
        
        var deporteSeleccionado = $(this).find('option:selected').text();
        var precioSeleccionado = $(this).find('option:selected').val();
        
        $('#nombredeporte').val(deporteSeleccionado);
        $('#preciodeporte').val(precioSeleccionado)
        
    });
 
 });