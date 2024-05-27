import express, { json } from 'express'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { create } from 'express-handlebars';
import listardeportes  from './functions/listardeportes.js'

const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.urlencoded({ extended:true }));

app.use('/css',express.static(path.join(process.cwd(),'/node_modules/bootstrap/dist/css')));
app.use('/cssJS',express.static(path.join(process.cwd(),'/node_modules/bootstrap/dist/js')));
app.use('/public',express.static(path.join(process.cwd(),'/public')));
// app.use('/views',express.static(path.join(process.cwd(),'/views')));

const hbs = create({ 
      extname: '.hbs',   
      layoutsDir:path.join(process.cwd(),'/views') ,
      partialsDir:path.join(process.cwd(),'/views/componentes'),
      defaultLayout:false
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

//INDEX
app.get('/',(req,res)=>{
    res.render('index.hbs')  
});

//LISTAR DEPORTES
app.get('/listadordedeportes',(req,res)=>{    
    const datos = listardeportes();  
    res.send(datos)
});

// CREAR DEPORTE
app.post('/creardeporte',(req,res)=>{
     
    const { nombredeporte , preciodeporte } = req.body;
    
    try {

        let ArrayDeportes = JSON.parse(fs.readFileSync("/tmp/deportes.json", "utf8"));
        let nombreFiltrado = ArrayDeportes.filter(depo => depo.deporte == nombredeporte);

        if( nombreFiltrado.length > 0){
            
            console.log(chalk.bgGreen.white(`El deporte "${nombredeporte}", ya se encuentra ingresado.`))

            res.render('index.hbs',{
                mensaje:`El deporte "${nombredeporte}", ya se encuentra ingresado.`
            });
            
        }else{

            ArrayDeportes.push({
                 deporte:nombredeporte,
                 precio:preciodeporte
            });

            fs.writeFileSync("/tmp/deportes.json",JSON.stringify(ArrayDeportes))

            console.log(chalk.bgYellow.red(`"${nombredeporte}", Creado correctamente en sistema.`))

            res.render('index.hbs',{
                
                mensaje:`"${nombredeporte}", Creado correctamente en sistema.`
            });
        }
       
    } catch (error) {

        let vacio = []
        fs.writeFileSync("/tmp/deportes.json",JSON.stringify(vacio))
        console.log('Error al leer el archivo',error);      
    }    

});

//MODIFICAR DEPORTES
app.post('/modificardeporte',(req,res)=>{

   const { nombredeporte, preciodeporte } = req.body

   try {
       let ArrayDeportes = JSON.parse(fs.readFileSync("/tmp/deportes.json", "utf8"));    

       var IndiceDeporte = ArrayDeportes.map(depo => depo.deporte).indexOf(nombredeporte)

       ArrayDeportes[IndiceDeporte].precio= preciodeporte

       fs.writeFileSync("/tmp/deportes.json",JSON.stringify(ArrayDeportes))

       console.log(chalk.bgCyanBright.black(`Precio de "${nombredeporte}", Actualizado correctamente.`))
        
       res.render('index.hbs',{
           mensaje:`Precio de "${nombredeporte}", Actualizado correctamente.`
       })

   } catch (error) {
      console.log( `Se produjo un erro al actualizar el precio`, error)    
   }

});

//ELIMINAR DEPORTE

app.post('/eliminardeporte',(req,res)=>{

    const { nombredeporte } = req.body;

    try {

        let ArrayDeportes = JSON.parse(fs.readFileSync("/tmp/deportes.json", "utf8"));    

        var IndiceDeporte = ArrayDeportes.map(depo => depo.deporte).indexOf(nombredeporte)

        ArrayDeportes.splice(IndiceDeporte,1);

        fs.writeFileSync("/tmp/deportes.json",JSON.stringify(ArrayDeportes))

        console.log(chalk.bgRed.yellow(`"${nombredeporte}", ELIMINADO correctamente.`))

        res.render('index.hbs',{
            mensaje:`"${nombredeporte}", ELIMINADO correctamente.`
        })
        
    } catch (error) {
        console.log(`No de pudo eliminar el archivo: "${error}"`)
        
    }
    
})




//Rutas para handlebars
app.get('/modificardeporte',(req,res)=>{
    const datos = listardeportes();     
    res.render('modificardeporte.hbs',{
        deportes:datos
    });
});

app.get('/creardeporte',(req,res)=>{
    res.render('creardeporte.hbs')
});

app.get('/eliminardeporte', (req,res)=>{
    const datos = listardeportes();     
    res.render('eliminardeporte.hbs',{
        deportes:datos
    });
});

app.get('/listardeportes',(req,res)=>{    
    const datos = listardeportes();  
    console.log(datos)
    res.render('listardeportes.hbs',{
        deportes:datos
    });
});

app.listen(PORT,()=>{
    console.clear()
    console.log(`Holiwis en port : ${PORT}`)
});