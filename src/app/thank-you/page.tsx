import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <div className="text-5xl mb-4">📄</div>
      <h1 className="text-2xl font-bold mb-2">Thank You</h1>
      <p className="mb-6 text-lg">
        Your information was submitted to our team of immigration attorneys. Expect an email from <strong>hello@tryalma.ai</strong>.
      </p>
      <Link href="/">
        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
          Go Back to Homepage
        </button>
      </Link>
    </div>
  );
}
