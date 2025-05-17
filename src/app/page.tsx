'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
   const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    linkedin: '',
    visas: [] as string[],
    additionalInfo: '',
    resume: null as File | null,
  });

  const visaOptions = ['O-1', 'EB-1A', 'EB-2 NIW', "I don't know"];
  const [visaError, setVisaError] = useState('');
  const router = useRouter();

  const handleVisaChange = (value: string) => {
    setFormData(prev => {
      const visas = prev.visas.includes(value)
        ? prev.visas.filter(v => v !== value)
        : [...prev.visas, value];
      return { ...prev, visas };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.visas.length === 0) {
    setVisaError('Please select at least one visa category.');
    return;
  } else {
    setVisaError('');
  }

  if (!formData.resume) {
    alert('Please upload your resume or CV.');
    return;
  }

  const payload = new FormData();
  payload.append('firstName', formData.firstName);
  payload.append('lastName', formData.lastName);
  payload.append('email', formData.email);
  payload.append('country', formData.country);
  payload.append('linkedin', formData.linkedin);
  payload.append('visas', JSON.stringify(formData.visas));
  payload.append('additionalInfo', formData.additionalInfo);
  if (formData.resume) {
    payload.append('resume', formData.resume);
  }

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      body: payload,
      // DO NOT set Content-Type header manually here! Let browser set it for FormData
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Success:', result);
    router.push('/thank-you');
  } catch (error) {
    console.error('Failed to submit:', error);
    alert('Failed to submit the form, please try again.');
  }
};


  return (
    <main className="min-h-screen bg-white font-sans text-black">
      <section className="bg-[#d6d497] px-6 py-12 text-center">
        <h1 className="text-lg font-bold mb-2">almà</h1>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Get An Assessment <br /> Of Your Immigration Case
        </h2>
      </section>

      <section className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">📄</div>
          <h3 className="text-xl font-bold">Want to understand your visa options?</h3>
          <p className="text-sm text-gray-700 mt-2">
            Submit the form below and our team of experienced attorneys will review your information
            and send a preliminary assessment of your case based on your goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2"
          />
          <select
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 text-gray-700"
          >
            <option value="">Country of Citizenship</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="url"
            name="linkedin"
            placeholder="LinkedIn / Personal Website URL"
            required
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2"
          />

          {/* Resume Upload */}
          <div>
            <label className="block font-medium mb-1">Upload Resume / CV</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              required
              onChange={handleFileChange}
              className="w-full border rounded-md px-4 py-2"
            />
            {formData.resume && (
              <p className="text-sm text-gray-600 mt-1">Selected: {formData.resume.name}</p>
            )}
          </div>

          {/* Visa options */}
          <div className="mt-8">
            <div className="text-4xl text-center">🎲</div>
            <h4 className="text-md font-bold text-center mb-2 mt-2">Visa categories of interest?</h4>
            <div className="space-y-2">
              {visaOptions.map((visa) => (
                <label key={visa} className="block">
                  <input
                    type="checkbox"
                    value={visa}
                    checked={formData.visas.includes(visa)}
                    onChange={() => handleVisaChange(visa)}
                    className="mr-2"
                  />
                  {visa}
                </label>
              ))}
            </div>
            {visaError && <p className="text-red-500 text-sm mt-1">{visaError}</p>}
          </div>

          {/* Additional info */}
          <div className="mt-8">
            <div className="text-4xl text-center">💜</div>
            <h4 className="text-md font-bold text-center mb-2 mt-2">How can we help you?</h4>
            <textarea
              name="additionalInfo"
              placeholder="What is your current status and when does it expire?..."
              rows={5}
              required
              value={formData.additionalInfo}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-black text-white font-bold py-2 rounded-md hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
}
