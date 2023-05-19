const {Router}=require('express')
const firebase=require('firebase/app')
const auth=require('firebase/auth')
const {getAuth}=require('firebase/auth')
const {getFirestore,getDocs,collection,updateDoc,doc}=require('firebase/firestore')

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
 *    GetData:
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
 *      frequencySalary:
 *       type: string
 *       description: The user frequency salary
 *     required:
 *      - names
 *      - lastNames
 *      - age
 *      - email
 *      - salary
 *      - frequencySalary
 *     example:
 *      names: Deiber Andrés
 *      lastNames: Cárdenas Castillo
 *      age: 21
 *      email: deyber147852@gmail.com
 *      salary: 1200000
 *      frequencySalary: Mensual
 *       
 */

/**
 * @swagger
 * /getData:
 *  get:
 *   summary: Obtener datos de usuario
 *   tags: [GetData]
 *   responses:
 *    200:
 *     description: Se obtuvieron los datos
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/GetData'
 *    400:
 *     description: Error, algo salió mal
 */

router.get('/getData',async(req,res)=>{
    auth2=getAuth()
    
    
    auth.onAuthStateChanged(auth2, (user) => {
        if (user) {
    
            const uid = user.uid;
            var name,email,salary,frequencySalary
            getDocs(collection(db, "Users",user.uid,'Private_Data')).then(querySnapshot => {
                const query=querySnapshot.forEach((doc) => {
                    
                    name=doc.data().Names+' '+doc.data().Last_Names
                    email=doc.data().Email
                    salary=doc.data().Salary
                    frequencySalary=doc.data().FrequencySalary
                });

                
                var getData=[{
                    name:'',
                    email:'',
                    salary:'',
                    frequencySalary:''
                }]
                getData.splice(0,1,name)
                getData.splice(1,1,email)
                getData.splice(2,1,salary)
                getData.splice(3,1,frequencySalary)

                return res.status(200).json(getData)
                

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

/**
 * @swagger
 * components:
 *   schemas:
 *    UpdatePassword:
 *     type: object
 *     properties:
 *      password:
 *       type: string
 *       description: The user password
 *     required:
 *      - password
 *     example:
 *      password: 123456
 *       
 */

/**
 * @swagger
 * /updatePassword:
 *  post:
 *   summary: Actualización de contraseña
 *   tags: [UpdatePassword]
 *   requestBody:
 *    required: true
 *    content: 
 *     application/json:
 *      schema: 
 *       type: object
 *       $ref: '#/components/schemas/UpdatePassword'
 *   responses:
 *    200:
 *     description: Ya cambiaste tu contraseña
 *    400:
 *     description: Error, algo salió mal
 */


router.post('/updatePassword',async(req,res)=>{
    var password=req.body.password

    const auth2=getAuth()
    const user=auth2.currentUser

    auth.updatePassword(user,password).then(() => {
        return res.status(200).json({message:"Contraseña actualizada"})
      }).catch((error) => {
        return res.status(400).json({message:error})
      });
})

router.put('/updateSalary',async(req,res)=>{
    
    auth2=getAuth()
    

    auth.onAuthStateChanged(auth2,(user)=>{
        if(user){
            const uid = user.uid;
            var salary=req.body.salary

            updateDoc(collection(db,"Users",user.uid,"Private_Data"),{
                Salary:salary
            })

        }
        else{
            return res.status(400).json({message:"No hay ningún usuario logueado"})
        }
    })

})

/**
 * @swagger
 * /logout:
 *  post:
 *   summary: Cerrar sesión
 *   tags: [Logout]
 *   responses:
 *    200:
 *     description: Cerraste la sesión
 *    400:
 *     description: Error, algo salió mal
 */

router.post('/logout',async(req,res)=>{


    const auth2=getAuth()

    auth.signOut(auth2)
    .then(() => {
        return res.status(200).json({message:"Cerraste sesión"})
    }).catch((error) => {
        return res.status(400).json({message:error})
    });
    
})

/**
 * @swagger
 * /deleteAccount:
 *  post:
 *   summary: Cerrar sesión
 *   tags: [DeleteAccount]
 *   responses:
 *    200:
 *     description: Eliminstae la cuenta
 *    400:
 *     description: Error, algo salió mal
 */


router.post('/deleteAccount',async(req,res)=>{


    const auth2=getAuth()
    const user=auth2.currentUser


    auth.deleteUser(user).then(() => {
        return res.status(200).json({message:"Borraste el usuario"})
      }).catch((error) => {
        return res.status(400).json({message:error})
      });
    
})

module.exports=router