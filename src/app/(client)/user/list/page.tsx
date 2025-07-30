'use client';

import React, { useEffect, useState } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline'

interface ClientUser {
  firstName: string;
  lastName: string;
  clientName: string;
  email: string;
  phoneNumber: number;
  password: string;
  role: string;
  level: string;
  is_active: boolean;
}

const UserList = () => {
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data: ClientUser[] = [
        {
          firstName: 'Client2',
          lastName: 'two',
          clientName: 'Clienttwo.com',
          email: 'client2@gmail.com',
          phoneNumber: 9876543233,
          password: 'client2@12345',
          role: '68874c0cb4b9a18b29a1f241',
          level: 'L2',
          is_active: true,
        }, {
          firstName: 'Client24',
          lastName: 'three',
          clientName: 'Clienttwenty.com',
          email: 'client24@gmail.com',
          phoneNumber: 9873333233,
          password: 'client2@123456',
          role: '68874c0cbb43bw9a1f241',
          level: 'L1',
          is_active: false,
        },
      ];
      setClientUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className='p-6 space-y-6'>
      <div className="mb-4 flex items-center space-x-2">
        <UsersIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Client Users</h1>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-left">Role ID</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {clientUsers.map((user, index) => (
              <tr key={index} className="text-gray-800 dark:text-gray-200">
                <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phoneNumber}</td>
                <td className="px-4 py-2">{user.clientName}</td>
                <td className="px-4 py-2">{user.level}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default UserList;
