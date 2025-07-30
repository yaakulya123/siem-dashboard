'use client';

import { useState } from 'react';
import clsx from 'clsx';

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  client: string;
  roleId: 'L1' | 'L2' | 'L3' | '';
};

const initialFormData: UserFormData = {
  name: '',
  email: '',
  phone: '',
  client: '',
  roleId: '',
};

const FloatInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  pattern,
  title,
}: {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: any;
  pattern?: string;
  title?: string;
}) => (
  <div className="relative w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      pattern={pattern}
      title={title}
      required
      className={clsx(
        'peer w-full px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      )}
      placeholder=" "
    />
    <span
      className={clsx(
        'absolute left-3 top-2 text-xs text-gray-500 dark:text-gray-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400'
      )}
    >
      {placeholder}
    </span>
  </div>
);

export default function AddUserPage() {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    alert('User submitted successfully!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Add New User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatInput
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <FloatInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <FloatInput
          type="tel"
          name="phone"
          placeholder="Phone (e.g. +911234567890)"
          value={formData.phone}
          onChange={handleChange}
          pattern="^\+\d{1,3}\d{10}$"
          title="Include country code. E.g., +911234567890"
        />

        <FloatInput
          type="text"
          name="client"
          placeholder="Client"
          value={formData.client}
          onChange={handleChange}
        />

        <div className="relative w-full">
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
            className="peer w-full px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="" disabled hidden></option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
          <span className="absolute left-3 top-2 text-s text-gray-500 dark:text-gray-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400">
            Select Role ID
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
