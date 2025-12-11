"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifikasiPage() {
  const [otp, setOtp] = useState("");
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();

  const handleVerify = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (data?.success) {
      alert("Akun berhasil diverifikasi!");
      router.push("/login");
    } else {
      alert(data?.message || "OTP salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Verifikasi OTP</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Kode OTP telah dikirim ke <strong>{email}</strong>
        </p>

        <input
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Masukkan OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-teal-500 text-white rounded-lg text-sm font-medium"
        >
          Verifikasi
        </button>
      </div>
    </div>
  );
}
