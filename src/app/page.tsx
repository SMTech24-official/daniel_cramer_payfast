"use client"
import { useState } from "react";
import axios from "axios";
import "./App.css";

const liveAPI = "http://104.131.119.245:12016/api/v1";
const localAPI = "http://10.0.30.177:12016/api/v1";

const API_BASE = liveAPI || localAPI;

// Interfaces for State Management
interface OrderPaymentState {
  userId: string;
  orderId: string;
}

interface WalletTopupState {
  userId: string;
  amount: number;
}

interface SubscriptionState {
  userId: string;
  planId: string;
  timeSlot: string;
  dateAndDay: string; // JSON string in UI
}

export default function Home() {
  const [loading, setLoading] = useState(false);

  // States for each form
  const [orderForm, setOrderForm] = useState<OrderPaymentState>({
    userId: "",
    orderId: "",
  });
  const [walletForm, setWalletForm] = useState<WalletTopupState>({
    userId: "",
    amount: 0,
  });
  const [subForm, setSubForm] = useState<SubscriptionState>({
    userId: "",
    planId: "",
    timeSlot: "11:00 PM",
    dateAndDay: JSON.stringify(
      [
        { date: "10/6/2025", day: "sunday" },
        { date: "10/12/2025", day: "monday" },
      ],
      null,
      2
    ),
  });
  const [upgradeForm, setUpgradeForm] = useState<SubscriptionState>({
    userId: "",
    planId: "",
    timeSlot: "11:00 PM",
    dateAndDay: JSON.stringify(
      [
        { date: "10/6/2025", day: "sunday" },
        { date: "10/12/2025", day: "monday" },
      ],
      null,
      2
    ),
  });

  // Generic Function to Submit to PayFast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitToPayFast = (url: string, payment_data: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    for (const key in payment_data) {
      if (payment_data.hasOwnProperty(key)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payment_data[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  // 1. Pay Order
  const handleOrderPayment = async () => {
    if (!orderForm.userId || !orderForm.orderId)
      return alert("Please fill all fields");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/test-payfast/initiate`, {
        userId: orderForm.userId,
        orderId: orderForm.orderId,
      });
      const { url, payment_data } = response.data.data;
      submitToPayFast(url, payment_data);
    } catch (error) {
      console.error(error);
      alert("Payment Initiation Failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Wallet Topup
  const handleWalletTopup = async () => {
    if (!walletForm.userId || !walletForm.amount)
      return alert("Please fill all fields");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/test-payfast/increment-wallet`,
        {
          userId: walletForm.userId,
          amount: Number(walletForm.amount),
        }
      );
      const { url, payment_data } = response.data.data;
      submitToPayFast(url, payment_data);
    } catch (error) {
      console.error(error);
      alert("Wallet Topup Failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Purchase Subscription
  const handlePurchaseSubscription = async () => {
    if (!subForm.userId || !subForm.planId)
      return alert("Please fill all fields");
    setLoading(true);
    try {
      const dateAndDayParsed = JSON.parse(subForm.dateAndDay);
      const response = await axios.post(
        `${API_BASE}/test-payfast/subscription/purchase`,
        {
          userId: subForm.userId,
          planId: subForm.planId,
          timeSlot: subForm.timeSlot,
          dateAndDay: dateAndDayParsed,
        }
      );
      const { url, payment_data } = response.data.data;
      submitToPayFast(url, payment_data);
    } catch (error) {
      console.error(error);
      alert("Subscription Purchase Failed. Check JSON format.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Upgrade Subscription
  const handleUpgradeSubscription = async () => {
    if (!upgradeForm.userId || !upgradeForm.planId)
      return alert("Please fill all fields");
    setLoading(true);
    try {
      const dateAndDayParsed = JSON.parse(upgradeForm.dateAndDay);
      const response = await axios.post(
        `${API_BASE}/test-payfast/subscription/upgrade`,
        {
          userId: upgradeForm.userId,
          planId: upgradeForm.planId,
          timeSlot: upgradeForm.timeSlot,
          dateAndDay: dateAndDayParsed,
        }
      );
      const { url, payment_data } = response.data.data;
      submitToPayFast(url, payment_data);
    } catch (error) {
      console.error(error);
      alert("Subscription Upgrade Failed. Check JSON format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>PayFast Integration</h1>
      <p style={{ color: "#aaa" }}>All payment scenarios below</p>

      <div className="grid-container">
        {/* Card 1: Pay Order */}
        <div className="card">
          <h2>Pay Order</h2>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="User ID"
              value={orderForm.userId}
              onChange={(e) =>
                setOrderForm({ ...orderForm, userId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Order ID</label>
            <input
              type="text"
              placeholder="Order ID"
              value={orderForm.orderId}
              onChange={(e) =>
                setOrderForm({ ...orderForm, orderId: e.target.value })
              }
            />
          </div>
          <button onClick={handleOrderPayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Order"}
          </button>
        </div>

        {/* Card 2: Wallet Topup */}
        <div className="card">
          <h2>Topup Wallet</h2>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="User ID"
              value={walletForm.userId}
              onChange={(e) =>
                setWalletForm({ ...walletForm, userId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Amount"
              value={walletForm.amount}
              onChange={(e) =>
                setWalletForm({ ...walletForm, amount: Number(e.target.value) })
              }
            />
          </div>
          <button onClick={handleWalletTopup} disabled={loading}>
            {loading ? "Processing..." : "Topup Wallet"}
          </button>
        </div>

        {/* Card 3: Subscription Purchase */}
        <div className="card">
          <h2>Purchase Subscription</h2>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="User ID"
              value={subForm.userId}
              onChange={(e) =>
                setSubForm({ ...subForm, userId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Plan ID</label>
            <input
              type="text"
              placeholder="Plan ID"
              value={subForm.planId}
              onChange={(e) =>
                setSubForm({ ...subForm, planId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <input
              type="text"
              placeholder="Time Slot"
              value={subForm.timeSlot}
              onChange={(e) =>
                setSubForm({ ...subForm, timeSlot: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Date & Day (JSON)</label>
            <textarea
              placeholder="Date and Day JSON"
              value={subForm.dateAndDay}
              onChange={(e) =>
                setSubForm({ ...subForm, dateAndDay: e.target.value })
              }
            />
          </div>
          <button onClick={handlePurchaseSubscription} disabled={loading}>
            {loading ? "Processing..." : "Purchase Subscription"}
          </button>
        </div>

        {/* Card 4: Upgrade Subscription */}
        <div className="card">
          <h2>Upgrade Subscription</h2>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="User ID"
              value={upgradeForm.userId}
              onChange={(e) =>
                setUpgradeForm({ ...upgradeForm, userId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Plan ID</label>
            <input
              type="text"
              placeholder="Plan ID"
              value={upgradeForm.planId}
              onChange={(e) =>
                setUpgradeForm({ ...upgradeForm, planId: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <input
              type="text"
              placeholder="Time Slot"
              value={upgradeForm.timeSlot}
              onChange={(e) =>
                setUpgradeForm({ ...upgradeForm, timeSlot: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Date & Day (JSON)</label>
            <textarea
              placeholder="Date and Day JSON"
              value={upgradeForm.dateAndDay}
              onChange={(e) =>
                setUpgradeForm({ ...upgradeForm, dateAndDay: e.target.value })
              }
            />
          </div>
          <button onClick={handleUpgradeSubscription} disabled={loading}>
            {loading ? "Processing..." : "Upgrade Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}
