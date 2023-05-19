const {Router}=require('express')
const firebase=require('firebase/app')
const auth=require('firebase/auth')
const {getAuth}=require('firebase/auth')
const {getFirestore,getDocs,collection}=require('firebase/firestore')

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
 *    GetSpends:
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
 * /getSpend:
 *  get:
 *   summary: Obtener todos los gastos del usuario
 *   tags: [GetSpends]
 *   requestBody:
 *   responses:
 *    200:
 *     description: Se obtuvieron todos los gastos
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/GetSpends'
 *    400:
 *     description: Error, algo salió mal
 */

router.get('/getSpend',async(req,res)=>{
    auth2=getAuth()
    var getDataSpend=[]
    
    
    auth.onAuthStateChanged(auth2, (user) => {
        if (user) {
    
            const uid = user.uid;
            var priority,spendName,spendValue,dateSpend
            getDocs(collection(db, "Users",user.uid,'Spend_Data')).then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    
                    priority=doc.data().Priority
                    spendName=doc.data().Spend_Name
                    spendValue=doc.data().Spend_Value
                    dateSpend=doc.data().Date_Spend


                    var spend={
                        Priority:"",
                        SpendName:"",
                        SpendValue:"",
                        DateSpend:""
                    }

                    spend.Priority=priority
                    spend.SpendName=spendName
                    spend.SpendValue=spendValue
                    spend.DateSpend=dateSpend

                    getDataSpend.push(spend)

                    
                });

                return res.status(200).json(getDataSpend)
                

            })
            .catch((e)=>{
                return res.status(400).json({message:e})
            })
            
        } 
        else {
            return res.status(400).json({message:"No hay ningún usuario logueado"})
        }
    });
})

module.exports=router