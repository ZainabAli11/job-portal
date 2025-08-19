import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {
    const [state, setState] = useState('Login')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState(null)
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

    const { setShowRecruiterLogin } = useContext(AppContext)

    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (state === 'SignUp' && !isTextDataSubmitted) {
            setIsTextDataSubmitted(true)
        } else {
            console.log({
                name,
                email,
                password,
                image,
                state
            })
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'unset'

        }
    })

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex items-center justify-center'>
            <form
                onSubmit={onSubmitHandler}
                className='relative bg-white p-10 rounded-xl text-slate-500 w-96'
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>
                    Recruiter {state}
                </h1>

                <p className='text-sm text-center mt-1'>
                    {state === 'Login'
                        ? 'Welcome Back! Sign in to Continue'
                        : 'Create your account to get started'}
                </p>

                {state === 'SignUp' && isTextDataSubmitted ? (
                    <div className='flex flex-col items-center mt-6'>
                        <label
                            htmlFor='image'
                            className='cursor-pointer flex flex-col items-center'
                        >
                            <img
                                src={image ? URL.createObjectURL(image) : assets.upload_area}
                                alt='upload'
                                className='w-24 h-24 object-cover rounded-full border'
                            />
                            <input
                                type='file'
                                id='image'
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                        <p className='text-sm mt-2 text-center'>
                            Upload Company <br /> Logo
                        </p>
                    </div>
                ) : (
                    <>
                        {state === 'SignUp' && (
                            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.person_icon} alt='' />
                                <input
                                    className='outline-none text-sm flex-1'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type='text'
                                    placeholder='Company Name'
                                    required
                                />
                            </div>
                        )}

                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.email_icon} alt='' />
                            <input
                                className='outline-none text-sm flex-1'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type='email'
                                placeholder='Email Id'
                                required
                            />
                        </div>

                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.lock_icon} alt='' />
                            <input
                                className='outline-none text-sm flex-1'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type='password'
                                placeholder='Password'
                                required
                            />
                        </div>
                    </>
                )}

                {state === 'Login' && (
                    <p className='text-sm text-blue-600 cursor-pointer my-4'>
                        Forgot Password?
                    </p>
                )}

                <button
                    type='submit'
                    className='cursor-pointer bg-blue-600 w-full text-white py-2 rounded-full mt-2'
                >
                    {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Finish Sign Up' : 'Next'}
                </button>

                {state === 'Login' ? (
                    <p className='mt-5 text-center'>
                        Don&apos;t have an account?{' '}
                        <span
                            className='text-blue-600 cursor-pointer'
                            onClick={() => {
                                setState('SignUp')
                                setIsTextDataSubmitted(false)
                            }}
                        >
                            Sign Up
                        </span>
                    </p>
                ) : (
                    <p className='mt-5 text-center'>
                        Already have an account?{' '}
                        <span
                            className='text-blue-600 cursor-pointer'
                            onClick={() => {
                                setState('Login')
                                setIsTextDataSubmitted(false)
                            }}
                        >
                            Login
                        </span>
                    </p>
                )}
                <img onClick={e => setShowRecruiterLogin(false)} className='absolute top-4 right-4 cursor-pointer' src={assets.cross_icon} alt='' />
            </form>
        </div>
    )
}

export default RecruiterLogin
