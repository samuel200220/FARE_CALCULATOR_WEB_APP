"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';

const data = [
  { name: 'Lundi', trajets: 12 },
  { name: 'Mardi', trajets: 18 },
  { name: 'Mercredi', trajets: 10 },
  { name: 'Jeudi', trajets: 22 },
  { name: 'Vendredi', trajets: 25 },
];

const Page = () => {
  return (
    <div className="w-full h-[400px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="trajets" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Page;
