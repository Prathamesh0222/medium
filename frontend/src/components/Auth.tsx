import { Link, useNavigate } from "react-router-dom"
import { LabelInput } from "./LabelInput"
import { useState } from "react";
import { SignupInput } from "@prathamesh0222/medium-common";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../config";
import { Flip, toast} from "react-toastify";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        username: "",
        password: "",
        firstName: "",
    })
    const navigate = useNavigate();

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === 'signup' ? 'signup' : 'signin'}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            if(type==='signin') navigate('/blogs');
            else navigate('/signin');

        } catch (error) {
            toast.error('Error while fetching', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className=" flex justify-center">
            <div className="flex flex-col border shadow p-10 hover:bg-slate-200 rounded-2xl">
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an Account
                    </div>
                    <div className="text-slate-500 text-center">
                        {type === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                        <Link className="pl-2 underline" to={type === 'signin' ? '/signup' : '/signin'}>
                            {type === 'signup' ? 'Sign in' : 'Sign up'}
                        </Link>
                    </div>
                </div>
                <div className="pt-4">
                    {type === 'signup' ? <LabelInput label={"Name"} placeholder={"Enter your name..."} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            firstName: e.target.value
                        })
                    }} /> : null}
                    <LabelInput label={"Email"} placeholder={"me@example.com"} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }} />
                    <LabelInput label={"Password"} type={"password"} placeholder={"123456"} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button"
                        className="w-full mt-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white
                dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                        {type == 'signup' ? 'Sign up' : 'Sign in'}
                    </button>
                    
                </div>
            </div>
        </div>
    </div>
}

