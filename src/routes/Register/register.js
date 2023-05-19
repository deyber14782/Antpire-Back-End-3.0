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
 *    Register:
 *     type: object
 *     properties:
 *      names:
 *       type: string
 *       description: The user names
 *      lastNames:
 *       type: string
 *       description: The user last names
 *      age:
 *       type: integer
 *       description: The user age
 *      email:
 *       type: string
 *       description: The user email
 *      salary:
 *       type: number
 *       description: The user salary
 *      password:
 *       type: string
 *       description: The user password
 *      frequencySalary:
 *       type: string
 *       description: The user frequency salary
 *     required:
 *      - names
 *      - lastNames
 *      - age
 *      - email
 *      - salary
 *      - password
 *      - frequencySalary
 *     example:
 *      names: Deiber Andrés
 *      lastNames: Cárdenas Castillo
 *      age: 21
 *      email: deyber147852@gmail.com
 *      salary: 1200000
 *      password: 123456
 *      frequencySalary: Mensual
 *       
 */

/**
 * @swagger
 * /signup:
 *  post:
 *   summary: Crear un nuevo usuario
 *   tags: [Register]
 *   requestBody:
 *    required: true
 *    content: 
 *     application/json:
 *      schema: 
 *       type: object
 *       $ref: '#/components/schemas/Register'
 *   responses:
 *    200:
 *     description: Se creó un nuevo usuario
 *    400:
 *     description: Error, algo salió mal
 */



router.post('/signup',async(req,res)=>{

    var names=req.body.names
    var lastNames=req.body.lastNames
    var age=req.body.age
    var email=req.body.email
    var salary=req.body.salary
    var password=req.body.password
    var frequencySalary=req.body.frequencySalary

    auth2=getAuth()

    auth.createUserWithEmailAndPassword(auth2,email,password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            try{
                const docRef = addDoc(collection(db, "Users",user.uid,'Private_Data'), {
                    Names:names,
                    Last_Names:lastNames,
                    Age:age,
                    Email:email,
                    Salary:salary,
                    FrequencySalary:frequencySalary,
                });
                auth.sendEmailVerification(auth2.currentUser)
                return res.status(200).json({message:"Registro exitoso, confirma tu correo"})
            }
            catch(error){
                return res.status(400).json({message:error})
            }

            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return res.status(400).json({message:errorMessage})
        });
    
})


module.exports=router