"use client"
import { useRouter } from 'next/navigation'
import '../App.css'

export default function CancelPage() {
  const router = useRouter()
  return (
    <div className="status-message error">
      <h1>Payment Cancelled</h1>
      <p>You have cancelled the transaction.</p>
      <button onClick={() => router.push("/")}>Go Back</button>
    </div>
  )
}
