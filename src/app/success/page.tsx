"use client"
import { useRouter } from 'next/navigation'
import '../App.css'

export default function SuccessPage() {
  const router = useRouter()
  return (
    <div className="status-message success">
      <h1>Payment Successful!</h1>
      <p>Your transaction has been processed.</p>
      <button onClick={() => router.push("/")}>Go Back</button>
    </div>
  )
}
