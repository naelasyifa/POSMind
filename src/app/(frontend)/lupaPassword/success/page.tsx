export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9e9] px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
        <img src="/logo-posmind.png" className="w-20 mx-auto mb-4" />

        <h2 className="text-2xl font-bold mb-2">Cek Email Kamu</h2>
        <p className="text-gray-600 text-sm">
          Jika email terdaftar, kami telah mengirim link untuk reset password.
          <br />
          Silakan cek inbox atau spam.
        </p>
      </div>
    </div>
  )
}
