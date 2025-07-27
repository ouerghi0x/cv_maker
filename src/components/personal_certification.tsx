import { useState } from "react";

type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string; // Optional
};

type PersonalCertificationProps = {
  next: () => void;
  prev: () => void;
  onChange: (certifications: Certification[]) => void;
  initialData: Certification[]; // To pre-fill if data exists
};

const PersonalCertification = ({ next, prev, onChange, initialData }: PersonalCertificationProps) => {
  const [certifications, setCertifications] = useState<Certification[]>(initialData);
  const [newCert, setNewCert] = useState<Certification>({ name: '', issuingOrganization: '', issueDate: '' });

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCert(prev => ({ ...prev, [name]: value }));
  };

  const addCertification = () => {
    if (newCert.name && newCert.issuingOrganization && newCert.issueDate) {
      setCertifications(prev => [...prev, newCert]);
      setNewCert({ name: '', issuingOrganization: '', issueDate: '' }); // Reset form
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(certifications); // Pass the array of certifications back
    next();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-[Inter]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Certifications</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-50">
            <p className="font-semibold">{cert.name}</p>
            <p className="text-sm text-gray-600">{cert.issuingOrganization} - {cert.issueDate}</p>
          </div>
        ))}
        <div className="space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Certification Name"
            value={newCert.name}
            onChange={handleCertChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <input
            type="text"
            name="issuingOrganization"
            placeholder="Issuing Organization"
            value={newCert.issuingOrganization}
            onChange={handleCertChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <input
            type="date"
            name="issueDate"
            placeholder="Issue Date"
            value={newCert.issueDate}
            onChange={handleCertChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <input
            type="date"
            name="expirationDate"
            placeholder="Expiration Date (Optional)"
            value={newCert.expirationDate || ''}
            onChange={handleCertChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
          <button
            type="button"
            onClick={addCertification}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Another Certification
          </button>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prev}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save & Next
          </button>
        </div>
      </form>
    </div>
  );
};
export default PersonalCertification;
