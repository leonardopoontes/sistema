
import { useState, createContext, useEffect } from "react";
import firebase from "../services/firebaseConnection";
import { toast } from "react-toastify";


export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, SetLoadingAuth] = useState(false); 
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const storageUser = localStorage.getItem('SistemaUser');

        function loadStorage(){
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);

        }

        loadStorage();

    }, []);

    // FAZENDO LOGIN
    async function signIn(email, password) {
        SetLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            SetLoadingAuth(false);
            toast.success('Bem-vinde de volta a plataforma!')
        })

        .catch( (error) =>{
            console.log(error);
            SetLoadingAuth(false);
            toast.error('Algo deu errado!')

        })
    }


    
    // CADASTRAR UM NOVO USUARIO
    async function signUp(email, password, nome){ 
        SetLoadingAuth(true); // muda o estado para verdadeiro

        await firebase.auth().createUserWithEmailAndPassword(email, password) // vai no bando de dados
        .then(async(value) =>{
            let uid = value.user.uid;

            await firebase.firestore().collection('users') // cria o arquivo no bando de dados
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then( ()=>{ // se deu certo
                let data = {
                    uid: uid,
                    nome: nome,
                    email: email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                SetLoadingAuth(false);
                toast.success('Bem-vindo a plataforma!')
            })
        })

        .catch((error)=>{ // se deu erro
            console.log(error);
            toast.error('Algo deu errado!')
            SetLoadingAuth(false);
        })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data))
    }

    async function signOut() { // faz o logout do usuario
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    

    return(
        <AuthContext.Provider value={{signed: !!user, user, loading, signUp, signOut, signIn, loadingAuth, setUser, storageUser} }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;