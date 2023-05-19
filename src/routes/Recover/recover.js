const {Router}=require('express')
const firebase=require('firebase/app')
const auth=require('firebase/auth')
const {getAuth}=require('firebase/auth')

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

firebase.initializeApp(firebaseConfig)

/**
 * @swagger
 * components:
 *   schemas:
 *    Recover:
 *     type: object
 *     properties:
 *      email:
 *       type: string
 *       description: The user email
 *     required:
 *      - email
 *     example:
 *      email: deyber147852@gmail.com
 *       
 */

/**
 * @swagger
 * /recover:
 *  post:
 *   summary: Olvidaste tu contraseña
 *   tags: [Recover]
 *   requestBody:
 *    required: true
 *    content: 
 *     application/json:
 *      schema: 
 *       type: object
 *       $ref: '#/components/schemas/Recover'
 *   responses:
 *    200:
 *     description: Ya fue enviado el correo de restablecimiento
 *    400:
 *     description: Error, algo salió mal
 */

router.post('/recover',(req,res)=>{

    var email=req.body.email
    const auth2=getAuth()
    auth.sendPasswordResetEmail(auth2,email)
    .then(() => {
        return res.status(200).json({message:"El correo de restablecimiento ya fue enviado a tu correo"})
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return res.status(400).json({message:errorMessage})
      });

    
})



module.exports=router