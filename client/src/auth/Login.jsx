import { useState } from "react"
import { BsEnvelope, BsLock } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../helper/AxiosInstance.js";
import toast from 'react-hot-toast'

function LogIn() {
    const navigate = useNavigate();

    const [logInData, setLogInData] = useState({
        email: "",
        password: ""
    })
    function handleUserInput(e) {
        const { name, value } = e.target;
        setLogInData({ ...logInData, [name]: value })
    }

    async function onLogin(event) {
        event.preventDefault();
        try {
            const response = axiosInstance.post('/user/login', logInData);

            toast.dismiss()
            toast.promise(response, {
                loading: "Loging...",
                success: (data) => {
                    localStorage.setItem('userData', JSON.stringify(data?.data));
                    navigate('/profile');
                    setLogInData({
                        email: "",
                        password: ""
                    });
                    return data?.data?.message;
                },
                error: (error) => {
                    return error?.response?.data?.message
                },
            });
            return (await response).data
        } catch (error) {
            console.error("Login error:", error.message);
        }
    }

    return (
        <>

            <div className='flex flex-col gap-3 justify-center items-center h-[91vh]'>
                <form onSubmit={onLogin} className='lg:w-[450px] w-[90%] md:w-1/2 h-fit p-7 flex flex-col justify-between gap-7 rounded-md bg-white text-black shadow-md'>
                    <div>
                        <h1 className='text-3xl font-semibold mb-3'>Log In</h1>
                        <p className='text-slate-400'>Please fill this form to login your account</p>
                    </div>
                    <hr className='border-t-2 border-slate-500' />
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label htmlFor="email" className='text-xl hidden lg:block md:block text-yellow-500'><BsEnvelope /></label>
                        <input type="email" name="email" id="email" placeholder='Enter Email' className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full " value={logInData.email} onChange={handleUserInput} />
                    </div>
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label htmlFor="password" className='text-xl hidden lg:block md:block text-yellow-500'><BsLock /></label>
                        <input type="password" name="password" id="password" placeholder='Enter Password' className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full " value={logInData.password} onChange={handleUserInput} />
                    </div>
                    <button type='submit' className='btn btn-primary w-full  mx-auto'>LogIn</button>
                </form>
                <p className='text-xl text-white'>don't have an account ?  <Link to={'/signup'} className='text-2xl text-blue-500 hover:underline '>Signup</Link> here</p>
            </div>
        </>
    )
}

export default LogIn
