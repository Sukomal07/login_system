import { FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../helper/AxiosInstance.js'
import toast from 'react-hot-toast'

function Profile() {
    const navigate = useNavigate();

    const { data } = JSON.parse(localStorage.getItem("userData") || {})


    async function onDelete(e) {
        e.preventDefault();
        try {
            const response = axiosInstance.delete("/user/delete-profile", data?._id)

            toast.dismiss()
            toast.promise(response, {
                loading: "Loading...",
                success: (data) => {
                    localStorage.removeItem('userData');
                    navigate('/');
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

    async function onLogout() {
        try {
            const response = axiosInstance.post("/user/logout")

            toast.dismiss()
            toast.promise(response, {
                loading: "Loading...",
                success: (data) => {
                    localStorage.removeItem('userData');
                    navigate('/login');
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
            <div className='flex justify-center items-center lg:h-screen mb-4'>
                <form className='lg:w-[60%] w-[90%] flex flex-col gap-8 bg-white rounded-lg px-8 shadow-lg py-8'>
                    <div className='flex items-center justify-center w-full'>

                        <div className='relative'>
                            <img src={data?.avatar?.secure_url} alt="profile photo" className="rounded-full w-32 h-32" />
                            <input type="file" id="imageUpload" accept='.jpg, .jpeg, .png, .svg' className='hidden' />
                        </div>

                    </div>

                    <div className='grid lg:grid-cols-2 grid-cols-1 gap-8 w-full'>
                        <div className='flex w-full relative'>
                            <label htmlFor="name" className='absolute bg-white bottom-9 left-5 '>UserName *</label>
                            <input className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent text-black rounded-md capitalize border-slate-400 outline-0 input-disabled' disabled type="text" name='name' id='name' value={data?.userName} />
                        </div>
                        <div className='flex w-full relative'>
                            <label htmlFor="name" className='absolute bg-white bottom-9 left-5 '>FullName *</label>
                            <input className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent text-black rounded-md capitalize border-slate-400 outline-0 input-disabled' disabled type="text" name='name' id='name' value={data?.fullName} />
                        </div>
                        <div className='flex w-full relative'>
                            <label htmlFor="email" className='absolute bg-white bottom-9 left-5 '>Email *</label>
                            <input type="text" name='email' id='email' value={data?.email} className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent text-black rounded-md border-slate-400 outline-0 input-disabled' disabled />
                        </div>
                    </div>

                    <div className='w-full flex lg:flex-row flex-col gap-8 items-center'>
                        <button className='flex items-center text-red-500 gap-2 font-semibold' onClick={onDelete}>
                            <FiTrash2 />
                            Delete Account
                        </button>
                        <button type='button' className='btn btn-secondary' onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Profile
