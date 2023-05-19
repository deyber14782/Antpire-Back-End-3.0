const {Router}=require('express')
const firebase=require('firebase/app')
const auth=require('firebase/auth')
const {getAuth}=require('firebase/auth')
const {getFirestore,addDoc,collection}=require('firebase/firestore')

const router=Router()

const firebaseConfig = {
    apiKey: "AIzaSyD9Ugtsq_Ts_FbGLl3sXYFnPFUOwsAs5S0",
    authDomain: "antpire-original.firebaseapp.com",
    databaseURL: "https://antpire-original-default-rtdb.firebaseio.com",
    projectId: "antpire-original",
    storageBucket: "antpire-original.appspot.com",
    messagingSenderId: "342233726581",
    appId: "1:342233726581:web:f498bd394cecb1645c423c",
    measurementId: "G-GDBJRFMR3F"
};

const app=firebase.initializeApp(firebaseConfig)
const db=getFirestore(app)

/**
 * @swagger
 * components:
 *   schemas:
 *    RegisterSpend:
 *     type: object
 *     properties:
 *      nameSpend:
 *       type: string
 *       description: The user spend
 *      priceSpend:
 *       type: number
 *       description: Spend price
 *      priority:
 *       type: string
 *       description: Spend priority
 *      today:
 *       type: string
 *       description: Spend date
 *     required:
 *      - nameSpend
 *      - priceSpend
 *      - priority
 *      - Spend date
 *     example:
 *      nameSpend: Café
 *      priceSpend: 2000
 *      priority: Baja
 *      today: 20/05/2023
 *      
 *       
 */

/**
 * @swagger
 * /registerSpend:
 *  post:
 *   summary: Registrar gasto
 *   tags: [RegisterSpend]
 *   requestBody:
 *    required: true
 *    content: 
 *     application/json:
 *      schema: 
 *       type: object
 *       $ref: '#/components/schemas/RegisterSpend'
 *   responses:
 *    200:
 *     description: Un gasto fue registrado
 *    400:
 *     description: Error, algo salió mal
 */


router.post('/registerSpend',async(req,res)=>{

    var nameSpend=req.body.nameSpend
    var priceSpend=req.body.priceSpend
    var priority=req.body.priority
    var today=new Date()

    auth2=getAuth()

    auth.onAuthStateChanged(auth2,(user)=>{
        if(user){
            try{
                const docRef = addDoc(collection(db, "Users",user.uid,'Spend_Data'), {
                    Spend_Name:nameSpend,
                    Spend_Value:priceSpend,
                    Priority:priority,
                    Date_Spend:today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear()
                    
                });
                return res.status(200).json({message:"Registro de gasto exitoso"})
            }
            catch(error){
                return res.status(400).json({message:error})
            } 
        }
        else{
            return res.status(400).json({message:"No hay ningún usuario logueado"})
        }
    })
    
})


module.exports=router