import React, { useEffect, useState } from 'react'
import { Mail, Lock } from "react-feather"
import Loader from '@/app/components/Loader'

import Input from "@/app/components/Input";
import Button from '@/app/components/Button'
import Alert from "@/app/components/Alert";
import Link from 'next/link';

export default function LoginForm({ onSubmit }) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState("")

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		const resp = await onSubmit({email, password})
		setLoading(false)
		if (resp.status == "error") {
			setError(resp.message)
		}
	}
	useEffect(() => {
		return () => {
			setLoading(false)
		}
	}, [])

	return (
		<form
			className="flex items-center flex-col space-y-2"
			onSubmit={handleSubmit}
		>
			<Input 
				value={email}
				onChange={e => setEmail(e.target.value)}
				icon={<Mail width={20} height={20} />}
				type="email" placeholder="Email" required />
			<Input 
				value={password}
				icon={<Lock width={20} height={20} />}
				onChange={e => setPassword(e.target.value)}
				type="password" placeholder="Password" required />

			{error && <Alert heading="Error!" body={error} danger />}

			<Button 
				className="w-full !mt-6 !text-base !rounded-full" 
				type="submit"
				disabled={loading}
			>
				{loading ? <Loader /> : "Login"}
			</Button>
				
			<Link href="/register">
				<Button link>
					Create an account
				</Button>
			</Link>
		</form>
	)
}